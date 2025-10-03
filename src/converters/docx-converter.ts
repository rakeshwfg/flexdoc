import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ImageRun,
  Footer,
  Header,
  PageNumber,
  NumberFormat,
  UnderlineType,
  ExternalHyperlink,
  TableOfContents,
  ShadingType
} from 'docx';
import { JSDOM } from 'jsdom';
import * as fs from 'fs';
import * as path from 'path';
import { DOCXOptions, ConversionResult, HTMLInput, IConverter } from '../types';
import { ThemeManager, Theme } from '../themes';

/**
 * DOCX Converter - Converts HTML to Word documents with theme support
 */
export class DOCXConverter implements IConverter {
  private currentTheme!: Theme;
  private imageCache: Map<string, Buffer> = new Map();

  async convert(html: string | HTMLInput, options: DOCXOptions = {}): Promise<ConversionResult> {
    const startTime = Date.now();

    try {
      // Load theme
      this.currentTheme = this.loadTheme(options);

      // Parse HTML
      const htmlContent = typeof html === 'string' ? html :
        (html as any).content || (html as any).filePath ?
        fs.readFileSync((html as any).filePath, 'utf-8') : '';

      const dom = new JSDOM(htmlContent);
      const document = dom.window.document;

      // Parse document elements
      const sections = await this.parseDocument(document, options);

      // Build Word document
      const doc = this.buildDocument(sections, options);

      // Generate buffer
      const buffer = await Packer.toBuffer(doc);

      // Save to file if output path specified
      let filePath: string | undefined;
      if (options.outputPath) {
        filePath = options.outputPath;
        fs.writeFileSync(filePath, buffer);
      }

      const duration = Date.now() - startTime;

      return {
        success: true,
        format: 'docx' as any,
        filePath,
        buffer,
        size: buffer.length,
        duration,
        metadata: {
          pageCount: this.estimatePageCount(sections)
        }
      };
    } catch (error) {
      return {
        success: false,
        format: 'docx' as any,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime
      };
    }
  }

  private loadTheme(options: DOCXOptions): Theme {
    let theme: Theme;

    if (options.theme && typeof options.theme === 'object') {
      theme = options.theme as Theme;
    } else {
      const themeName = (options.theme as string) || 'corporate-blue';
      theme = ThemeManager.getTheme(themeName);
    }

    if (options.themeOptions) {
      theme = ThemeManager.applyThemeOptions(theme, options.themeOptions);
    }

    return theme;
  }

  private async parseDocument(document: globalThis.Document, options: DOCXOptions): Promise<any[]> {
    const sections: any[] = [];
    const body = document.body;

    if (!body) return sections;

    // Parse all child nodes
    for (let i = 0; i < body.children.length; i++) {
      const element = body.children[i];
      const parsed = await this.parseElement(element as HTMLElement, options);
      if (parsed) {
        if (Array.isArray(parsed)) {
          sections.push(...parsed);
        } else {
          sections.push(parsed);
        }
      }
    }

    return sections;
  }

  private async parseElement(element: HTMLElement, options: DOCXOptions): Promise<any | any[] | null> {
    const tagName = element.tagName.toLowerCase();

    switch (tagName) {
      case 'h1':
        return this.createHeading(element, HeadingLevel.HEADING_1);
      case 'h2':
        return this.createHeading(element, HeadingLevel.HEADING_2);
      case 'h3':
        return this.createHeading(element, HeadingLevel.HEADING_3);
      case 'h4':
        return this.createHeading(element, HeadingLevel.HEADING_4);
      case 'h5':
        return this.createHeading(element, HeadingLevel.HEADING_5);
      case 'h6':
        return this.createHeading(element, HeadingLevel.HEADING_6);
      case 'p':
        return this.createParagraph(element);
      case 'ul':
      case 'ol':
        return this.createList(element, tagName === 'ol');
      case 'table':
        return this.createTable(element);
      case 'img':
        return await this.createImage(element);
      case 'hr':
        return this.createHorizontalRule();
      case 'blockquote':
        return this.createBlockquote(element);
      case 'pre':
      case 'code':
        return this.createCode(element);
      case 'div':
      case 'section':
      case 'article':
        // Recursively parse container elements
        const children: any[] = [];
        for (let i = 0; i < element.children.length; i++) {
          const child = await this.parseElement(element.children[i] as HTMLElement, options);
          if (child) {
            if (Array.isArray(child)) {
              children.push(...child);
            } else {
              children.push(child);
            }
          }
        }
        return children.length > 0 ? children : null;
      default:
        // For unknown elements, try to extract text
        if (element.textContent && element.textContent.trim()) {
          return this.createParagraph(element);
        }
        return null;
    }
  }

  private createHeading(element: HTMLElement, level: typeof HeadingLevel[keyof typeof HeadingLevel]): Paragraph {
    const text = element.textContent || '';
    const color = this.hexToDocxColor(this.currentTheme.colors.primary);

    return new Paragraph({
      children: [new TextRun({
        text,
        color,
        bold: true
      })],
      heading: level,
      spacing: {
        before: 240,
        after: 120
      }
    });
  }

  private createParagraph(element: HTMLElement): Paragraph {
    const runs: TextRun[] = [];
    this.extractTextRuns(element, runs);

    return new Paragraph({
      children: runs.length > 0 ? runs : [new TextRun(element.textContent || '')],
      spacing: {
        after: 120
      }
    });
  }

  private extractTextRuns(node: Node, runs: TextRun[]): void {
    if (node.nodeType === 3) { // Text node
      const text = node.textContent || '';
      if (text.trim()) {
        runs.push(new TextRun(text));
      }
    } else if (node.nodeType === 1) { // Element node
      const element = node as HTMLElement;
      const tagName = element.tagName?.toLowerCase();

      const isBold = tagName === 'strong' || tagName === 'b';
      const isItalic = tagName === 'em' || tagName === 'i';
      const isUnderline = tagName === 'u';
      const isLink = tagName === 'a';

      if (isLink) {
        const href = element.getAttribute('href') || '';
        const text = element.textContent || '';
        // Note: ExternalHyperlink needs to be handled differently in docx
        runs.push(new TextRun({
          text,
          underline: { type: UnderlineType.SINGLE },
          color: this.hexToDocxColor(this.currentTheme.colors.accent)
        }));
      } else if (isBold || isItalic || isUnderline) {
        const text = element.textContent || '';
        runs.push(new TextRun({
          text,
          bold: isBold,
          italics: isItalic,
          underline: isUnderline ? { type: UnderlineType.SINGLE } : undefined
        }));
      } else {
        // Recursively process children
        for (let i = 0; i < element.childNodes.length; i++) {
          this.extractTextRuns(element.childNodes[i], runs);
        }
      }
    }
  }

  private createList(element: HTMLElement, isOrdered: boolean): Paragraph[] {
    const items: Paragraph[] = [];
    const listItems = element.querySelectorAll('li');

    listItems.forEach((li, index) => {
      const text = li.textContent || '';
      const bullet = isOrdered ? `${index + 1}.` : '•';

      items.push(new Paragraph({
        text: `${bullet} ${text}`,
        spacing: {
          before: 60,
          after: 60
        },
        indent: {
          left: 720 // 0.5 inch indent
        }
      }));
    });

    return items;
  }

  private createTable(element: HTMLElement): Table {
    const rows: TableRow[] = [];

    // Process thead
    const thead = element.querySelector('thead');
    if (thead) {
      const headerRows = thead.querySelectorAll('tr');
      headerRows.forEach(tr => {
        rows.push(this.createTableRow(tr, true));
      });
    }

    // Process tbody
    const tbody = element.querySelector('tbody') || element;
    const bodyRows = tbody.querySelectorAll('tr');
    bodyRows.forEach(tr => {
      if (!thead || !thead.contains(tr)) {
        rows.push(this.createTableRow(tr, false));
      }
    });

    return new Table({
      rows,
      width: {
        size: 100,
        type: WidthType.PERCENTAGE
      },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: '999999' },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: '999999' },
        left: { style: BorderStyle.SINGLE, size: 1, color: '999999' },
        right: { style: BorderStyle.SINGLE, size: 1, color: '999999' },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
        insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' }
      }
    });
  }

  private createTableRow(tr: Element, isHeader: boolean): TableRow {
    const cells: TableCell[] = [];
    const cellElements = tr.querySelectorAll('td, th');

    cellElements.forEach(cell => {
      const text = cell.textContent || '';
      const bgColor = isHeader ?
        this.hexToDocxColor(this.currentTheme.colors.primary) :
        'FFFFFF';

      cells.push(new TableCell({
        children: [new Paragraph({
          children: [new TextRun({
            text,
            bold: isHeader,
            color: isHeader ? 'FFFFFF' : '000000'
          })]
        })],
        shading: {
          fill: bgColor,
          type: ShadingType.CLEAR,
          color: 'auto'
        }
      }));
    });

    return new TableRow({
      children: cells
    });
  }

  private async createImage(element: HTMLElement): Promise<Paragraph | null> {
    try {
      const src = element.getAttribute('src');
      if (!src) return null;

      let imageBuffer: Buffer;

      // Handle different image sources
      if (src.startsWith('data:')) {
        // Data URL
        const base64Data = src.split(',')[1];
        imageBuffer = Buffer.from(base64Data, 'base64');
      } else if (src.startsWith('http://') || src.startsWith('https://')) {
        // URL - fetch image
        const response = await fetch(src);
        const arrayBuffer = await response.arrayBuffer();
        imageBuffer = Buffer.from(arrayBuffer);
      } else {
        // Local file path
        imageBuffer = fs.readFileSync(src);
      }

      // Get dimensions from attributes or use defaults
      const width = parseInt(element.getAttribute('width') || '400');
      const height = parseInt(element.getAttribute('height') || '300');

      // Determine image type from source or buffer
      let imageType: 'jpg' | 'png' | 'gif' | 'bmp' = 'png';
      if (src.match(/\.jpe?g$/i)) imageType = 'jpg';
      else if (src.match(/\.gif$/i)) imageType = 'gif';
      else if (src.match(/\.bmp$/i)) imageType = 'bmp';

      return new Paragraph({
        children: [
          new ImageRun({
            type: imageType,
            data: imageBuffer,
            transformation: {
              width,
              height
            }
          })
        ],
        spacing: {
          before: 120,
          after: 120
        }
      });
    } catch (error) {
      console.warn('Failed to load image:', error);
      return null;
    }
  }

  private createHorizontalRule(): Paragraph {
    return new Paragraph({
      border: {
        bottom: {
          color: this.hexToDocxColor(this.currentTheme.colors.border || '#CCCCCC'),
          space: 1,
          style: BorderStyle.SINGLE,
          size: 6
        }
      },
      spacing: {
        before: 120,
        after: 120
      }
    });
  }

  private createBlockquote(element: HTMLElement): Paragraph {
    return new Paragraph({
      children: [new TextRun({
        text: element.textContent || '',
        italics: true
      })],
      indent: {
        left: 720
      },
      border: {
        left: {
          color: this.hexToDocxColor(this.currentTheme.colors.accent),
          space: 1,
          style: BorderStyle.SINGLE,
          size: 12
        }
      },
      spacing: {
        before: 120,
        after: 120
      }
    });
  }

  private createCode(element: HTMLElement): Paragraph {
    return new Paragraph({
      children: [new TextRun({
        text: element.textContent || '',
        font: 'Courier New'
      })],
      shading: {
        fill: 'F5F5F5',
        type: ShadingType.CLEAR,
        color: 'auto'
      },
      spacing: {
        before: 120,
        after: 120
      }
    });
  }

  private buildDocument(sections: any[], options: DOCXOptions): Document {
    // Flatten sections array
    const children: Paragraph[] = [];
    sections.forEach(section => {
      if (Array.isArray(section)) {
        section.forEach(item => {
          if (item) children.push(item);
        });
      } else if (section) {
        children.push(section);
      }
    });

    // Add table of contents if requested
    if (options.includeTableOfContents) {
      children.unshift(
        new Paragraph({
          text: 'Table of Contents',
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 240 }
        })
      );
      // Note: TableOfContents is added as a separate paragraph in docx v9.5.1
      const toc = new TableOfContents('Table of Contents', {
        hyperlink: true,
        headingStyleRange: `1-${options.tocDepth || 3}`
      });
      children.splice(1, 0, toc as any);
    }

    // Build page size configuration
    const pageConfig = this.getPageConfiguration(options);

    // Build sections
    const docSections: any[] = [{
      properties: pageConfig,
      headers: options.header ? {
        default: this.createHeader(options.header, options)
      } : undefined,
      footers: options.footer ? {
        default: this.createFooter(options.footer, options)
      } : undefined,
      children
    }];

    return new Document({
      sections: docSections,
      title: options.title,
      subject: options.subject,
      creator: options.author || 'FlexDoc',
      description: options.description,
      keywords: options.keywords?.join(', '),
      styles: {
        default: {
          document: {
            run: {
              font: options.fontFamily || this.currentTheme.typography.bodyFont || 'Calibri',
              size: (options.fontSize || this.currentTheme.typography.sizes.body || 11) * 2 // Half-points
            },
            paragraph: {
              spacing: {
                line: options.lineSpacing ? options.lineSpacing * 240 : 276 // 1.15 default
              }
            }
          }
        }
      }
    });
  }

  private getPageConfiguration(options: DOCXOptions): any {
    const pageSize = options.pageSize || 'A4';
    const orientation = options.orientation || 'portrait';

    // Page dimensions in twips (1/1440 inch)
    const dimensions: any = {
      'A4': { width: 11906, height: 16838 },
      'A3': { width: 16838, height: 23811 },
      'Letter': { width: 12240, height: 15840 },
      'Legal': { width: 12240, height: 20160 },
      'Tabloid': { width: 15840, height: 24480 }
    };

    let { width, height } = dimensions[pageSize] || dimensions['A4'];

    // Swap for landscape
    if (orientation === 'landscape') {
      [width, height] = [height, width];
    }

    // Use custom dimensions if provided
    if (options.pageWidth) width = options.pageWidth;
    if (options.pageHeight) height = options.pageHeight;

    return {
      page: {
        width,
        height,
        margin: {
          top: options.margins?.top || 1440,      // 1 inch
          right: options.margins?.right || 1440,
          bottom: options.margins?.bottom || 1440,
          left: options.margins?.left || 1440
        }
      }
    };
  }

  private createHeader(config: NonNullable<DOCXOptions['header']>, options: DOCXOptions): Header {
    const children: Paragraph[] = [];

    if (config.text) {
      children.push(new Paragraph({
        text: config.text,
        alignment: this.getAlignment(config.alignment)
      }));
    }

    if (config.includePageNumber) {
      children.push(new Paragraph({
        alignment: this.getAlignment(config.alignment),
        children: [
          new TextRun('Page '),
          new TextRun({
            children: [PageNumber.CURRENT]
          })
        ]
      }));
    }

    return new Header({
      children: children.length > 0 ? children : [new Paragraph('')]
    });
  }

  private createFooter(config: NonNullable<DOCXOptions['footer']>, options: DOCXOptions): Footer {
    const children: Paragraph[] = [];

    if (config.text) {
      children.push(new Paragraph({
        text: config.text,
        alignment: this.getAlignment(config.alignment)
      }));
    }

    if (config.includePageNumber) {
      children.push(new Paragraph({
        alignment: this.getAlignment(config.alignment),
        children: [
          new TextRun('Page '),
          new TextRun({
            children: [PageNumber.CURRENT]
          })
        ]
      }));
    }

    return new Footer({
      children: children.length > 0 ? children : [new Paragraph('')]
    });
  }

  private getAlignment(align?: 'left' | 'center' | 'right'): typeof AlignmentType[keyof typeof AlignmentType] {
    switch (align) {
      case 'center': return AlignmentType.CENTER;
      case 'right': return AlignmentType.RIGHT;
      default: return AlignmentType.LEFT;
    }
  }

  private hexToDocxColor(hex: string): string {
    // Remove # if present and return uppercase
    return hex.replace('#', '').toUpperCase();
  }

  private estimatePageCount(sections: any[]): number {
    // Rough estimation: ~50 elements per page
    const elementCount = sections.reduce((count, section) => {
      return count + (Array.isArray(section) ? section.length : 1);
    }, 0);

    return Math.max(1, Math.ceil(elementCount / 50));
  }
}

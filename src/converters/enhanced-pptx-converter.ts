/**
 * Enhanced PPTX Converter Module
 * Advanced HTML to PowerPoint conversion with better layout preservation
 */

import PptxGenJS from 'pptxgenjs';
import { JSDOM } from 'jsdom';
import { convert as htmlToText } from 'html-to-text';
import sharp from 'sharp';
import { 
  PPTXOptions, 
  ConversionResult, 
  FlexDocError, 
  ErrorType,
  HTMLInput
} from '../types';

interface EnhancedSlideContent {
  title?: string;
  subtitle?: string;
  content: Array<{
    type: 'text' | 'list' | 'table' | 'image' | 'code' | 'quote';
    data: any;
    style?: any;
  }>;
  layout: 'title' | 'content' | 'two-column' | 'comparison' | 'image-text';
  background?: string;
  notes?: string;
}

interface TableData {
  headers: string[];
  rows: string[][];
  style?: {
    headerColor?: string;
    alternateRows?: boolean;
  };
}

export class EnhancedPPTXConverter {
  private pptx!: PptxGenJS;
  
  // Professional color schemes
  private colorSchemes = {
    professional: {
      primary: '#003366',
      secondary: '#0066CC',
      accent: '#FF6600',
      background: '#FFFFFF',
      text: '#333333',
      lightBg: '#F5F5F5'
    },
    modern: {
      primary: '#2E3440',
      secondary: '#5E81AC',
      accent: '#88C0D0',
      background: '#ECEFF4',
      text: '#2E3440',
      lightBg: '#E5E9F0'
    },
    vibrant: {
      primary: '#6366F1',
      secondary: '#8B5CF6',
      accent: '#EC4899',
      background: '#FFFFFF',
      text: '#1F2937',
      lightBg: '#F9FAFB'
    }
  };

  /**
   * Enhanced HTML to PPTX conversion
   */
  async convert(
    html: string | HTMLInput,
    options: PPTXOptions = {}
  ): Promise<ConversionResult> {
    const startTime = Date.now();
    
    try {
      // Initialize presentation
      this.pptx = new PptxGenJS();
      this.setupPresentation(options);
      
      // Parse HTML with enhanced analysis
      const htmlContent = await this.resolveHTMLContent(html);
      const dom = new JSDOM(htmlContent);
      const document = dom.window.document;
      
      // Apply smart content analysis
      const slides = await this.smartContentAnalysis(document, options);
      
      // Create slides with professional layouts
      for (const slide of slides) {
        await this.createProfessionalSlide(slide, options);
      }
      
      // Generate output
      const buffer = await this.pptx.stream() as Buffer;
      
      return {
        success: true,
        format: 'pptx' as any,
        buffer,
        size: buffer.length,
        duration: Date.now() - startTime,
        metadata: {
          slideCount: slides.length,
          enhanced: true
        }
      };
    } catch (error) {
      throw new FlexDocError(
        ErrorType.CONVERSION_FAILED,
        `Enhanced PPTX conversion failed: ${error}`,
        error
      );
    }
  }

  /**
   * Smart content analysis for better slide generation
   */
  private async smartContentAnalysis(
    document: Document,
    options: PPTXOptions
  ): Promise<EnhancedSlideContent[]> {
    const slides: EnhancedSlideContent[] = [];
    
    // Extract and analyze document structure
    const sections = this.extractSections(document);
    
    for (const section of sections) {
      const slideContent = await this.analyzeSection(section);
      
      // Apply intelligent splitting if content is too long
      if (this.shouldSplitSlide(slideContent)) {
        const splitSlides = this.intelligentSplit(slideContent);
        slides.push(...splitSlides);
      } else {
        slides.push(slideContent);
      }
    }
    
    // Add title slide if not present
    if (slides.length === 0 || !this.isTitleSlide(slides[0])) {
      slides.unshift(this.createTitleSlide(document));
    }
    
    // Add conclusion slide if appropriate
    if (options.addConclusion) {
      slides.push(this.createConclusionSlide(slides));
    }
    
    return slides;
  }

  /**
   * Extract logical sections from HTML
   */
  private extractSections(document: Document): Element[] {
    const sections: Element[] = [];
    
    // Look for semantic HTML5 sections
    const semanticSections = document.querySelectorAll('section, article');
    if (semanticSections.length > 0) {
      return Array.from(semanticSections);
    }
    
    // Fall back to heading-based sections
    const headings = document.querySelectorAll('h1, h2, h3');
    let currentSection: Element | null = null;
    
    headings.forEach((heading, index) => {
      const section = document.createElement('section');
      section.appendChild(heading.cloneNode(true));
      
      // Collect content until next heading
      let sibling = heading.nextElementSibling;
      while (sibling && !['H1', 'H2', 'H3'].includes(sibling.tagName)) {
        section.appendChild(sibling.cloneNode(true));
        sibling = sibling.nextElementSibling;
      }
      
      sections.push(section);
    });
    
    // If no structure found, treat whole body as one section
    if (sections.length === 0) {
      sections.push(document.body);
    }
    
    return sections;
  }

  /**
   * Analyze section content and determine best layout
   */
  private async analyzeSection(section: Element): Promise<EnhancedSlideContent> {
    const content: any[] = [];
    const images = section.querySelectorAll('img');
    const tables = section.querySelectorAll('table');
    const lists = section.querySelectorAll('ul, ol');
    const codeBlocks = section.querySelectorAll('pre, code');
    const blockquotes = section.querySelectorAll('blockquote');
    
    // Extract title and subtitle
    const h1 = section.querySelector('h1');
    const h2 = section.querySelector('h2');
    const h3 = section.querySelector('h3');
    
    const title = h1?.textContent || h2?.textContent || h3?.textContent || '';
    const subtitle = h1 && h2 ? h2.textContent : '';
    
    // Process tables
    tables.forEach(table => {
      content.push({
        type: 'table',
        data: this.extractTableData(table),
        style: this.analyzeTableStyle(table)
      });
    });
    
    // Process lists
    lists.forEach(list => {
      content.push({
        type: 'list',
        data: this.extractListItems(list),
        style: { ordered: list.tagName === 'OL' }
      });
    });
    
    // Process code blocks
    codeBlocks.forEach(code => {
      content.push({
        type: 'code',
        data: code.textContent,
        style: { language: code.className || 'plain' }
      });
    });
    
    // Process blockquotes
    blockquotes.forEach(quote => {
      content.push({
        type: 'quote',
        data: quote.textContent,
        style: { italic: true }
      });
    });
    
    // Process images with optimization
    for (const img of Array.from(images)) {
      content.push({
        type: 'image',
        data: await this.optimizeImage(img as HTMLImageElement),
        style: this.analyzeImagePlacement(img as HTMLImageElement, section)
      });
    }
    
    // Process remaining text
    const textContent = this.extractTextContent(section, [
      'h1', 'h2', 'h3', 'table', 'ul', 'ol', 'pre', 'code', 'blockquote', 'img'
    ]);
    
    if (textContent) {
      content.push({
        type: 'text',
        data: textContent,
        style: {}
      });
    }
    
    // Determine optimal layout
    const layout = this.determineLayout(content, images.length > 0);
    
    return {
      title,
      subtitle,
      content,
      layout,
      notes: this.extractSpeakerNotes(section)
    };
  }

  /**
   * Extract table data with styling
   */
  private extractTableData(table: Element): TableData {
    const headers: string[] = [];
    const rows: string[][] = [];
    
    // Extract headers
    const headerCells = table.querySelectorAll('th');
    headerCells.forEach(th => headers.push(th.textContent || ''));
    
    // If no th elements, use first row as headers
    if (headers.length === 0) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        firstRow.querySelectorAll('td').forEach(td => 
          headers.push(td.textContent || '')
        );
      }
    }
    
    // Extract data rows
    const dataRows = table.querySelectorAll('tr');
    dataRows.forEach((tr, index) => {
      if (index === 0 && headers.length > 0) return; // Skip header row
      
      const row: string[] = [];
      tr.querySelectorAll('td').forEach(td => 
        row.push(td.textContent || '')
      );
      
      if (row.length > 0) rows.push(row);
    });
    
    return {
      headers,
      rows,
      style: {
        headerColor: '#4472C4',
        alternateRows: true
      }
    };
  }

  /**
   * Extract list items preserving hierarchy
   */
  private extractListItems(list: Element): string[] {
    const items: string[] = [];
    
    list.querySelectorAll('li').forEach(li => {
      // Check for nested lists
      const nestedList = li.querySelector('ul, ol');
      if (nestedList) {
        items.push(li.firstChild?.textContent || '');
        // Add nested items with indentation
        this.extractListItems(nestedList).forEach(nestedItem => {
          items.push('  • ' + nestedItem);
        });
      } else {
        items.push(li.textContent || '');
      }
    });
    
    return items;
  }

  /**
   * Optimize images for presentation
   */
  private async optimizeImage(img: HTMLImageElement): Promise<any> {
    const src = img.src || img.getAttribute('src') || '';
    
    // For data URLs or external images, optimize size
    if (src.startsWith('data:') || src.startsWith('http')) {
      try {
        // Download and optimize image
        const response = await fetch(src);
        const buffer = await response.arrayBuffer();
        
        // Resize if too large (max 1920x1080 for presentations)
        const optimized = await sharp(Buffer.from(buffer))
          .resize(1920, 1080, { 
            fit: 'inside',
            withoutEnlargement: true 
          })
          .jpeg({ quality: 85 })
          .toBuffer();
        
        return {
          data: `data:image/jpeg;base64,${optimized.toString('base64')}`,
          alt: img.alt,
          width: img.width,
          height: img.height
        };
      } catch (error) {
        console.warn('Image optimization failed:', error);
        return { data: src, alt: img.alt };
      }
    }
    
    return { data: src, alt: img.alt };
  }

  /**
   * Analyze image placement for optimal layout
   */
  private analyzeImagePlacement(img: HTMLImageElement, section: Element): any {
    const imgRect = img.getBoundingClientRect?.() || { width: 0, height: 0 };
    const sectionText = section.textContent || '';
    
    // Determine if image should be full-width, side-by-side, or background
    if (imgRect.width > 600 || sectionText.length < 100) {
      return { placement: 'full', size: 'large' };
    } else if (sectionText.length > 300) {
      return { placement: 'side', size: 'medium' };
    } else {
      return { placement: 'inline', size: 'small' };
    }
  }

  /**
   * Determine optimal slide layout based on content
   */
  private determineLayout(
    content: any[],
    hasImages: boolean
  ): EnhancedSlideContent['layout'] {
    const hasTable = content.some(c => c.type === 'table');
    const hasList = content.some(c => c.type === 'list');
    const hasCode = content.some(c => c.type === 'code');
    const textCount = content.filter(c => c.type === 'text').length;
    
    if (hasTable && hasImages) {
      return 'two-column';
    } else if (hasList && hasImages) {
      return 'image-text';
    } else if (hasCode) {
      return 'content';
    } else if (textCount > 1 && hasImages) {
      return 'comparison';
    } else if (hasImages) {
      return 'image-text';
    } else {
      return 'content';
    }
  }

  /**
   * Extract speaker notes from comments or special elements
   */
  private extractSpeakerNotes(section: Element): string {
    // Look for elements with class 'notes' or 'speaker-notes'
    const notesElement = section.querySelector('.notes, .speaker-notes, aside');
    if (notesElement) {
      return notesElement.textContent || '';
    }
    
    // Look for HTML comments
    const comments = [];
    const walker = document.createTreeWalker(
      section,
      NodeFilter.SHOW_COMMENT,
      null
    );
    
    let node;
    while (node = walker.nextNode()) {
      comments.push(node.textContent || '');
    }
    
    return comments.join('\n');
  }

  /**
   * Create professional slide with enhanced layouts
   */
  private async createProfessionalSlide(
    slideContent: EnhancedSlideContent,
    options: PPTXOptions
  ): Promise<void> {
    const slide = this.pptx.addSlide();
    const schemeName = (options.colorScheme || 'professional') as keyof typeof this.colorSchemes;
    const scheme = this.colorSchemes[schemeName];
    
    // Apply background
    if (slideContent.background) {
      slide.background = { color: slideContent.background };
    } else {
      slide.background = { color: scheme.background };
    }
    
    // Apply layout-specific design
    switch (slideContent.layout) {
      case 'title':
        this.createTitleLayout(slide, slideContent, scheme);
        break;
      case 'two-column':
        this.createTwoColumnLayout(slide, slideContent, scheme);
        break;
      case 'comparison':
        this.createComparisonLayout(slide, slideContent, scheme);
        break;
      case 'image-text':
        this.createImageTextLayout(slide, slideContent, scheme);
        break;
      default:
        this.createContentLayout(slide, slideContent, scheme);
    }
    
    // Add speaker notes
    if (slideContent.notes) {
      slide.addNotes(slideContent.notes);
    }
  }

  /**
   * Create title slide layout
   */
  private createTitleLayout(slide: any, content: EnhancedSlideContent, scheme: any): void {
    // Title
    slide.addText(content.title || '', {
      x: 0.5,
      y: '40%',
      w: '90%',
      h: 1,
      fontSize: 44,
      bold: true,
      color: scheme.primary,
      align: 'center',
      fontFace: 'Segoe UI'
    });
    
    // Subtitle
    if (content.subtitle) {
      slide.addText(content.subtitle, {
        x: 0.5,
        y: '55%',
        w: '90%',
        h: 0.75,
        fontSize: 24,
        color: scheme.secondary,
        align: 'center',
        fontFace: 'Segoe UI Light'
      });
    }
    
    // Add decorative element
    slide.addShape('rect', {
      x: '35%',
      y: '48%',
      w: '30%',
      h: 0.01,
      fill: { color: scheme.accent }
    });
  }

  /**
   * Create two-column layout
   */
  private createTwoColumnLayout(slide: any, content: EnhancedSlideContent, scheme: any): void {
    // Title bar
    this.addTitleBar(slide, content.title || '', scheme);
    
    // Split content into two columns
    const leftContent = content.content.filter((_, i) => i % 2 === 0);
    const rightContent = content.content.filter((_, i) => i % 2 === 1);
    
    // Left column
    let yPos = 1.5;
    leftContent.forEach(item => {
      yPos = this.renderContentItem(slide, item, {
        x: 0.5,
        y: yPos,
        w: 4.5,
        scheme
      });
    });
    
    // Right column
    yPos = 1.5;
    rightContent.forEach(item => {
      yPos = this.renderContentItem(slide, item, {
        x: 5.5,
        y: yPos,
        w: 4.5,
        scheme
      });
    });
  }

  /**
   * Render individual content items
   */
  private renderContentItem(slide: any, item: any, options: any): number {
    const { x, y, w, scheme } = options;
    let nextY = y;
    
    switch (item.type) {
      case 'text':
        slide.addText(item.data, {
          x,
          y,
          w,
          h: 'auto',
          fontSize: 14,
          color: scheme.text,
          fontFace: 'Segoe UI',
          valign: 'top'
        });
        nextY += 1;
        break;
        
      case 'list':
        const bullets = item.data.map((text: string) => ({ text }));
        slide.addText(bullets, {
          x,
          y,
          w,
          h: 'auto',
          fontSize: 14,
          color: scheme.text,
          fontFace: 'Segoe UI',
          bullet: true,
          valign: 'top'
        });
        nextY += item.data.length * 0.3;
        break;
        
      case 'table':
        this.renderTable(slide, item.data, { x, y, w });
        nextY += 2;
        break;
        
      case 'image':
        slide.addImage({
          data: item.data.data,
          x,
          y,
          w: Math.min(w, 3),
          h: 2
        });
        nextY += 2.5;
        break;
        
      case 'code':
        slide.addText(item.data, {
          x,
          y,
          w,
          h: 'auto',
          fontSize: 12,
          fontFace: 'Courier New',
          color: scheme.text,
          fill: { color: scheme.lightBg },
          margin: 0.1
        });
        nextY += 1.5;
        break;
        
      case 'quote':
        slide.addText('"' + item.data + '"', {
          x,
          y,
          w,
          h: 'auto',
          fontSize: 16,
          italic: true,
          color: scheme.secondary,
          fontFace: 'Georgia',
          align: 'center'
        });
        nextY += 1;
        break;
    }
    
    return nextY;
  }

  /**
   * Render table with professional styling
   */
  private renderTable(slide: any, tableData: TableData, position: any): void {
    const rows = [
      tableData.headers.map(h => ({ 
        text: h, 
        options: { 
          fill: { color: '4472C4' },
          color: 'FFFFFF',
          bold: true 
        } 
      })),
      ...tableData.rows.map((row, i) => 
        row.map(cell => ({
          text: cell,
          options: {
            fill: { color: i % 2 === 0 ? 'FFFFFF' : 'F2F2F2' }
          }
        }))
      )
    ];
    
    slide.addTable(rows, {
      x: position.x,
      y: position.y,
      w: position.w,
      colW: Array(tableData.headers.length).fill(position.w / tableData.headers.length),
      border: { type: 'solid', pt: 0.5, color: 'CCCCCC' },
      fontSize: 12,
      fontFace: 'Segoe UI'
    });
  }

  /**
   * Add title bar to slide
   */
  private addTitleBar(slide: any, title: string, scheme: any): void {
    // Title background
    slide.addShape('rect', {
      x: 0,
      y: 0,
      w: '100%',
      h: 1,
      fill: { color: scheme.lightBg }
    });
    
    // Title text
    slide.addText(title, {
      x: 0.5,
      y: 0.2,
      w: 9,
      h: 0.6,
      fontSize: 28,
      bold: true,
      color: scheme.primary,
      fontFace: 'Segoe UI'
    });
    
    // Accent line
    slide.addShape('rect', {
      x: 0.5,
      y: 0.95,
      w: 2,
      h: 0.02,
      fill: { color: scheme.accent }
    });
  }

  // ... Additional helper methods ...

  private shouldSplitSlide(content: EnhancedSlideContent): boolean {
    const totalItems = content.content.length;
    const hasLongText = content.content.some(
      c => c.type === 'text' && c.data.length > 500
    );
    return totalItems > 5 || hasLongText;
  }

  private intelligentSplit(content: EnhancedSlideContent): EnhancedSlideContent[] {
    // Implementation for intelligent content splitting
    // This would split long content into multiple slides while maintaining context
    return [content]; // Simplified for now
  }

  private isTitleSlide(slide: EnhancedSlideContent): boolean {
    return slide.layout === 'title' || 
           (slide.content.length <= 2 && !slide.content.some(c => c.type === 'list'));
  }

  private createTitleSlide(document: Document): EnhancedSlideContent {
    return {
      title: document.title || 'Presentation',
      subtitle: new Date().toLocaleDateString(),
      content: [],
      layout: 'title'
    };
  }

  private createConclusionSlide(slides: EnhancedSlideContent[]): EnhancedSlideContent {
    return {
      title: 'Thank You',
      content: [{
        type: 'text',
        data: 'Questions?',
        style: { align: 'center' }
      }],
      layout: 'title'
    };
  }

  private createImageTextLayout(slide: any, content: EnhancedSlideContent, scheme: any): void {
    // Implementation for image-text layout
    this.createContentLayout(slide, content, scheme);
  }

  private createComparisonLayout(slide: any, content: EnhancedSlideContent, scheme: any): void {
    // Implementation for comparison layout
    this.createTwoColumnLayout(slide, content, scheme);
  }

  private createContentLayout(slide: any, content: EnhancedSlideContent, scheme: any): void {
    // Add title
    if (content.title) {
      this.addTitleBar(slide, content.title, scheme);
    }
    
    // Render content items
    let yPos = content.title ? 1.5 : 0.5;
    content.content.forEach(item => {
      yPos = this.renderContentItem(slide, item, {
        x: 0.5,
        y: yPos,
        w: 9,
        scheme
      });
    });
  }

  private extractTextContent(section: Element, excludeTags: string[]): string {
    const clone = section.cloneNode(true) as Element;
    excludeTags.forEach(tag => {
      clone.querySelectorAll(tag).forEach(el => el.remove());
    });
    return clone.textContent?.trim() || '';
  }

  private analyzeTableStyle(table: Element): any {
    // Analyze table styling from HTML/CSS
    return {
      borderColor: '#CCCCCC',
      headerBg: '#4472C4'
    };
  }

  private setupPresentation(options: PPTXOptions): void {
    // Set presentation metadata
    if (options.title) this.pptx.title = options.title;
    if (options.author) this.pptx.author = options.author;
    if (options.company) this.pptx.company = options.company;
    
    // Set layout
    this.pptx.defineLayout({
      name: 'CUSTOM',
      width: options.slideWidth || 10,
      height: options.slideHeight || 5.625
    });
  }

  private async resolveHTMLContent(html: string | HTMLInput): Promise<string> {
    if (typeof html === 'string') return html;
    if (typeof html === 'object' && html !== null && 'content' in html && html.content) {
      return html.content;
    }
    // ... handle other input types
    return '';
  }
}

// Export enhanced converter
export const enhancedPptxConverter = new EnhancedPPTXConverter();
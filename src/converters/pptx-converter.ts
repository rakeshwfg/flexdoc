/**
 * PPTX Converter Module
 * Handles HTML to PowerPoint conversion using pptxgenjs
 */

import PptxGenJS from 'pptxgenjs';
import { JSDOM } from 'jsdom';
import { convert as htmlToText } from 'html-to-text';
import { 
  PPTXOptions, 
  ConversionResult, 
  IConverter, 
  FlexDocError, 
  ErrorType,
  HTMLInput,
  PPTXTheme
} from '../types';
import { validateHTML, normalizeHTML, extractImages } from '../utils/validators';
import { readFileIfExists, writeFileIfPath, downloadImage } from '../utils/file-handler';
import * as path from 'path';

interface SlideContent {
  title?: string;
  content: string;
  images?: Array<{ src: string; alt?: string }>;
  level: number;
}

export class PPTXConverter implements IConverter {
  private defaultOptions: Partial<PPTXOptions> = {
    layout: '16x9',
    slideWidth: 10,
    slideHeight: 5.625,
    splitBy: 'h2',
    includeImages: true,
    maxContentPerSlide: 500,
    timeout: 30000,
    theme: {
      primary: '#2E86C1',
      secondary: '#85C1E9',
      background: '#FFFFFF',
      textColor: '#333333',
      fontFace: 'Arial',
      fontSize: 14
    }
  };

  /**
   * Convert HTML to PPTX
   */
  async convert(
    html: string | HTMLInput, 
    options: PPTXOptions = {}
  ): Promise<ConversionResult> {
    const startTime = Date.now();
    const mergedOptions = { ...this.defaultOptions, ...options };

    try {
      // Validate options
      this.validateOptions(mergedOptions);

      // Progress callback
      const reportProgress = (step: string, percentage: number, details?: string) => {
        if (mergedOptions.onProgress) {
          mergedOptions.onProgress({ step, percentage, details });
        }
      };

      reportProgress('Initializing', 0, 'Starting PPTX conversion');

      // Get HTML content
      const htmlContent = await this.resolveHTMLContent(html);
      reportProgress('HTML Resolved', 15, 'HTML content loaded');

      // Parse HTML
      const dom = new JSDOM(htmlContent);
      const document = dom.window.document;
      reportProgress('DOM Parsed', 25, 'HTML parsed successfully');

      // Inject custom CSS if provided
      if (mergedOptions.customCSS) {
        const style = document.createElement('style');
        style.textContent = mergedOptions.customCSS;
        document.head.appendChild(style);
      }

      // Execute custom script if provided
      if (mergedOptions.executeScript) {
        const script = document.createElement('script');
        script.textContent = mergedOptions.executeScript;
        document.body.appendChild(script);
      }

      // Extract slides content
      const slides = await this.extractSlides(document, mergedOptions);
      reportProgress('Content Extracted', 40, `${slides.length} slides prepared`);

      // Create presentation
      const pptx = new PptxGenJS();
      this.configurePresentationMetadata(pptx, mergedOptions);
      reportProgress('Presentation Created', 50, 'PPTX object initialized');

      // Apply theme
      this.applyTheme(pptx, mergedOptions.theme!);
      reportProgress('Theme Applied', 55, 'Presentation theme configured');

      // Create master slide if specified
      if (mergedOptions.masterSlide) {
        this.createMasterSlide(pptx, mergedOptions.masterSlide);
        reportProgress('Master Slide', 60, 'Master slide created');
      }

      // Add slides
      let slideProgress = 60;
      const progressIncrement = 30 / slides.length;
      
      for (let i = 0; i < slides.length; i++) {
        await this.createSlide(pptx, slides[i], mergedOptions);
        slideProgress += progressIncrement;
        reportProgress('Creating Slides', Math.round(slideProgress), `Slide ${i + 1} of ${slides.length}`);
      }

      reportProgress('Slides Created', 90, 'All slides added to presentation');

      // Generate PPTX buffer
      const pptxBuffer = await pptx.stream() as Buffer;
      reportProgress('Buffer Generated', 95, 'PPTX buffer created');

      // Save to file if path provided
      let filePath: string | undefined;
      if (mergedOptions.outputPath) {
        await writeFileIfPath(mergedOptions.outputPath, pptxBuffer);
        filePath = mergedOptions.outputPath;
        reportProgress('File Saved', 98, `PPTX saved to ${filePath}`);
      }

      reportProgress('Completed', 100, 'PPTX conversion successful');

      return {
        success: true,
        format: 'pptx' as any,
        buffer: mergedOptions.outputPath ? undefined : pptxBuffer,
        filePath,
        size: pptxBuffer.length,
        duration: Date.now() - startTime,
        metadata: {
          slideCount: slides.length,
          options: mergedOptions
        }
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new FlexDocError(
        ErrorType.CONVERSION_FAILED,
        `PPTX conversion failed: ${errorMessage}`,
        error
      );
    }
  }

  /**
   * Validate PPTX options
   */
  validateOptions(options: PPTXOptions): boolean {
    // Validate layout
    const validLayouts = ['16x9', '16x10', '4x3', 'wide'];
    if (options.layout && !validLayouts.includes(options.layout)) {
      throw new FlexDocError(
        ErrorType.VALIDATION_ERROR,
        `Invalid layout: ${options.layout}. Must be one of: ${validLayouts.join(', ')}`
      );
    }

    // Validate splitBy
    const validSplitBy = ['h1', 'h2', 'h3', 'hr', 'section', 'div.slide', 'auto'];
    if (options.splitBy && !validSplitBy.includes(options.splitBy)) {
      throw new FlexDocError(
        ErrorType.VALIDATION_ERROR,
        `Invalid splitBy: ${options.splitBy}. Must be one of: ${validSplitBy.join(', ')}`
      );
    }

    // Validate dimensions
    if (options.slideWidth && options.slideWidth <= 0) {
      throw new FlexDocError(
        ErrorType.VALIDATION_ERROR,
        'Slide width must be positive'
      );
    }

    if (options.slideHeight && options.slideHeight <= 0) {
      throw new FlexDocError(
        ErrorType.VALIDATION_ERROR,
        'Slide height must be positive'
      );
    }

    return true;
  }

  /**
   * Resolve HTML content from various input types
   */
  private async resolveHTMLContent(html: string | HTMLInput): Promise<string> {
    if (typeof html === 'string') {
      return normalizeHTML(html);
    }

    if (html.content) {
      return normalizeHTML(html.content);
    }

    if (html.filePath) {
      const content = await readFileIfExists(html.filePath);
      return normalizeHTML(content);
    }

    if (html.url) {
      // Fetch content from URL
      const response = await fetch(html.url);
      if (!response.ok) {
        throw new FlexDocError(
          ErrorType.NETWORK_ERROR,
          `Failed to fetch HTML from URL: ${response.statusText}`
        );
      }
      const content = await response.text();
      return normalizeHTML(content);
    }

    throw new FlexDocError(
      ErrorType.INVALID_INPUT,
      'Invalid HTML input: must provide content, filePath, or url'
    );
  }

  /**
   * Extract slides from HTML document
   */
  private async extractSlides(
    document: Document, 
    options: PPTXOptions
  ): Promise<SlideContent[]> {
    const slides: SlideContent[] = [];
    const splitBy = options.splitBy || 'h2';

    if (splitBy === 'auto') {
      // Auto-split based on content length
      return this.autoSplitContent(document, options);
    }

    // Split by specific element
    let selector = splitBy;
    if (splitBy === 'div.slide') {
      selector = 'div.slide';
    } else if (['h1', 'h2', 'h3', 'hr', 'section'].includes(splitBy)) {
      selector = splitBy;
    }

    const splitElements = document.querySelectorAll(selector);
    
    if (splitElements.length === 0) {
      // If no split elements found, treat entire content as one slide
      const content = this.extractTextContent(document.body);
      const images = options.includeImages ? extractImages(document.body.innerHTML) : [];
      
      slides.push({
        title: document.title || 'Slide 1',
        content,
        images,
        level: 1
      });
    } else {
      // Process each section
      let currentSlide: SlideContent = {
        title: document.title || 'Introduction',
        content: '',
        images: [],
        level: 1
      };

      // Get content before first split element
      const firstSplitElement = splitElements[0];
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_ELEMENT,
        null
      );

      let node;
      let beforeContent = '';
      while (node = walker.nextNode()) {
        if (node === firstSplitElement) break;
        if (node.textContent) {
          beforeContent += node.textContent + '\n';
        }
      }

      if (beforeContent.trim()) {
        currentSlide.content = beforeContent.trim();
        slides.push({ ...currentSlide });
      }

      // Process each split section
      splitElements.forEach((element, index) => {
        const nextElement = splitElements[index + 1];
        const contentNodes: Node[] = [];
        
        // Get all siblings until next split element
        let sibling = element.nextSibling;
        while (sibling && sibling !== nextElement) {
          contentNodes.push(sibling);
          sibling = sibling.nextSibling;
        }

        // Extract content
        const title = element.textContent || `Slide ${index + 2}`;
        let content = '';
        const images: any[] = [];

        contentNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const elem = node as Element;
            content += this.extractTextContent(elem) + '\n';
            
            if (options.includeImages) {
              const nodeImages = extractImages(elem.outerHTML);
              images.push(...nodeImages);
            }
          } else if (node.nodeType === Node.TEXT_NODE) {
            content += node.textContent + '\n';
          }
        });

        if (content.trim() || images.length > 0) {
          slides.push({
            title,
            content: content.trim(),
            images,
            level: this.getHeadingLevel(element.tagName)
          });
        }
      });
    }

    return slides;
  }

  /**
   * Auto-split content into slides
   */
  private autoSplitContent(
    document: Document, 
    options: PPTXOptions
  ): SlideContent[] {
    const slides: SlideContent[] = [];
    const maxContent = options.maxContentPerSlide || 500;
    
    // Get all text nodes
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null
    );

    let currentSlide: SlideContent = {
      title: `Slide 1`,
      content: '',
      images: [],
      level: 1
    };
    let slideNumber = 1;
    let currentLength = 0;

    let node;
    while (node = walker.nextNode()) {
      const text = node.textContent?.trim() || '';
      if (text) {
        if (currentLength + text.length > maxContent) {
          // Save current slide and start new one
          if (currentSlide.content.trim()) {
            slides.push({ ...currentSlide });
          }
          slideNumber++;
          currentSlide = {
            title: `Slide ${slideNumber}`,
            content: text,
            images: [],
            level: 1
          };
          currentLength = text.length;
        } else {
          currentSlide.content += ' ' + text;
          currentLength += text.length;
        }
      }
    }

    // Add last slide
    if (currentSlide.content.trim()) {
      slides.push(currentSlide);
    }

    return slides;
  }

  /**
   * Extract text content from element
   */
  private extractTextContent(element: Element): string {
    return htmlToText(element.innerHTML, {
      wordwrap: false,
      preserveNewlines: true,
      selectors: [
        { selector: 'img', format: 'skip' },
        { selector: 'a', options: { ignoreHref: true } }
      ]
    });
  }

  /**
   * Get heading level from tag name
   */
  private getHeadingLevel(tagName: string): number {
    const match = tagName.match(/h(\d)/i);
    return match ? parseInt(match[1]) : 1;
  }

  /**
   * Configure presentation metadata
   */
  private configurePresentationMetadata(
    pptx: PptxGenJS, 
    options: PPTXOptions
  ): void {
    if (options.title) pptx.title = options.title;
    if (options.author) pptx.author = options.author;
    if (options.company) pptx.company = options.company;
    if (options.subject) pptx.subject = options.subject;
    if (options.revision) pptx.revision = options.revision;

    // Set layout
    if (options.layout === '16x9') {
      pptx.defineLayout({ name: 'LAYOUT_16x9', width: 10, height: 5.625 });
    } else if (options.layout === '16x10') {
      pptx.defineLayout({ name: 'LAYOUT_16x10', width: 10, height: 6.25 });
    } else if (options.layout === '4x3') {
      pptx.defineLayout({ name: 'LAYOUT_4x3', width: 10, height: 7.5 });
    } else if (options.layout === 'wide') {
      pptx.defineLayout({ name: 'LAYOUT_WIDE', width: 13.33, height: 7.5 });
    }

    // Custom dimensions
    if (options.slideWidth && options.slideHeight) {
      pptx.defineLayout({ 
        name: 'CUSTOM', 
        width: options.slideWidth, 
        height: options.slideHeight 
      });
    }
  }

  /**
   * Apply theme to presentation
   */
  private applyTheme(pptx: PptxGenJS, theme: PPTXTheme): void {
    // Note: pptxgenjs has limited theme support
    // We'll apply theme colors to individual slides
  }

  /**
   * Create master slide
   */
  private createMasterSlide(pptx: PptxGenJS, masterSlide: any): void {
    pptx.defineSlideMaster({
      title: masterSlide.title || 'MASTER_SLIDE',
      background: masterSlide.background || { color: 'FFFFFF' },
      objects: masterSlide.logo ? [
        {
          image: {
            x: 9,
            y: 0.1,
            w: 0.8,
            h: 0.8,
            path: masterSlide.logo
          }
        }
      ] : []
    });
  }

  /**
   * Create individual slide
   */
  private async createSlide(
    pptx: PptxGenJS, 
    slideContent: SlideContent, 
    options: PPTXOptions
  ): Promise<void> {
    const slide = pptx.addSlide();
    const theme = options.theme!;

    // Add background
    if (theme.background) {
      slide.background = { color: theme.background.replace('#', '') };
    }

    // Add title
    if (slideContent.title) {
      slide.addText(slideContent.title, {
        x: 0.5,
        y: 0.5,
        w: 9,
        h: 1,
        fontSize: 24,
        bold: true,
        color: theme.primary?.replace('#', '') || '2E86C1',
        fontFace: theme.fontFace || 'Arial'
      });
    }

    // Add content
    if (slideContent.content) {
      // Split content into bullet points if it contains list markers
      const lines = slideContent.content.split('\n').filter(line => line.trim());
      const bullets = lines.map(line => ({
        text: line.trim(),
        options: { bullet: true }
      }));

      slide.addText(bullets.length > 1 ? bullets : slideContent.content, {
        x: 0.5,
        y: 1.8,
        w: 9,
        h: 3,
        fontSize: theme.fontSize || 14,
        color: theme.textColor?.replace('#', '') || '333333',
        fontFace: theme.fontFace || 'Arial',
        valign: 'top',
        isTextBox: true,
        autoFit: true
      });
    }

    // Add images if available
    if (slideContent.images && slideContent.images.length > 0 && options.includeImages) {
      for (let i = 0; i < Math.min(slideContent.images.length, 2); i++) {
        const image = slideContent.images[i];
        try {
          // Download image if it's a URL
          if (image.src.startsWith('http')) {
            const imageBuffer = await downloadImage(image.src);
            slide.addImage({
              data: `data:image/png;base64,${imageBuffer.toString('base64')}`,
              x: 5 + (i * 2.5),
              y: 2,
              w: 2,
              h: 2
            });
          } else {
            // Local image
            slide.addImage({
              path: image.src,
              x: 5 + (i * 2.5),
              y: 2,
              w: 2,
              h: 2
            });
          }
        } catch (error) {
          console.warn(`Failed to add image: ${image.src}`, error);
        }
      }
    }
  }
}

// Export singleton instance
export const pptxConverter = new PPTXConverter();

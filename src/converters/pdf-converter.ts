/**
 * PDF Converter Module
 * Handles HTML to PDF conversion using Puppeteer
 */

import puppeteer, { Browser, Page, PDFOptions as PuppeteerPDFOptions } from 'puppeteer';
import { 
  PDFOptions, 
  ConversionResult, 
  IConverter, 
  FlexDocError, 
  ErrorType,
  HTMLInput,
  ProgressInfo
} from '../types';
import { validateHTML, normalizeHTML, isValidURL } from '../utils/validators';
import { readFileIfExists, writeFileIfPath } from '../utils/file-handler';
import * as fs from 'fs/promises';
import * as path from 'path';

export class PDFConverter implements IConverter {
  private browser: Browser | null = null;
  private defaultOptions: Partial<PDFOptions> = {
    format: 'A4',
    printBackground: true,
    margin: {
      top: '1cm',
      right: '1cm',
      bottom: '1cm',
      left: '1cm'
    },
    timeout: 30000
  };

  /**
   * Convert HTML to PDF
   */
  async convert(
    html: string | HTMLInput, 
    options: PDFOptions = {}
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

      reportProgress('Initializing', 0, 'Starting PDF conversion');

      // Get HTML content
      const htmlContent = await this.resolveHTMLContent(html);
      reportProgress('HTML Resolved', 20, 'HTML content loaded');

      // Launch browser
      this.browser = await this.launchBrowser();
      reportProgress('Browser Launched', 30, 'Puppeteer browser ready');

      // Create page
      const page = await this.browser.newPage();
      reportProgress('Page Created', 40, 'New page initialized');

      // Set content based on input type
      if (typeof html === 'object' && html.url) {
        await page.goto(html.url, { 
          waitUntil: 'networkidle0',
          timeout: mergedOptions.timeout 
        });
      } else {
        await page.setContent(htmlContent, { 
          waitUntil: 'networkidle0',
          timeout: mergedOptions.timeout 
        });
      }
      reportProgress('Content Loaded', 50, 'HTML content rendered');

      // Inject custom CSS if provided
      if (mergedOptions.customCSS) {
        await page.addStyleTag({ content: mergedOptions.customCSS });
        reportProgress('Styles Applied', 55, 'Custom CSS injected');
      }

      // Execute custom script if provided
      if (mergedOptions.executeScript) {
        await page.evaluate(mergedOptions.executeScript);
        reportProgress('Script Executed', 60, 'Custom JavaScript executed');
      }

      // Wait for selector if specified
      if (mergedOptions.waitForSelector) {
        await page.waitForSelector(mergedOptions.waitForSelector, {
          timeout: mergedOptions.timeout
        });
        reportProgress('Selector Found', 65, `Element ${mergedOptions.waitForSelector} ready`);
      }

      // Prepare PDF options
      const pdfOptions = this.preparePuppeteerOptions(mergedOptions);
      reportProgress('Options Prepared', 70, 'PDF options configured');

      // Generate PDF
      const pdfBuffer = await page.pdf(pdfOptions);
      reportProgress('PDF Generated', 90, 'PDF buffer created');

      // Close page
      await page.close();

      // Save to file if path provided
      let filePath: string | undefined;
      if (mergedOptions.outputPath) {
        await writeFileIfPath(mergedOptions.outputPath, pdfBuffer);
        filePath = mergedOptions.outputPath;
        reportProgress('File Saved', 95, `PDF saved to ${filePath}`);
      }

      reportProgress('Completed', 100, 'PDF conversion successful');

      return {
        success: true,
        format: 'pdf' as any,
        buffer: mergedOptions.outputPath ? undefined : pdfBuffer,
        filePath,
        size: pdfBuffer.length,
        duration: Date.now() - startTime,
        metadata: {
          pages: await this.estimatePageCount(pdfBuffer),
          options: mergedOptions
        }
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new FlexDocError(
        ErrorType.CONVERSION_FAILED,
        `PDF conversion failed: ${errorMessage}`,
        error
      );
    } finally {
      await this.cleanup();
    }
  }

  /**
   * Validate PDF options
   */
  validateOptions(options: PDFOptions): boolean {
    // Validate format
    const validFormats = ['A4', 'A3', 'A2', 'A1', 'A0', 'Letter', 'Legal', 'Tabloid', 'Ledger'];
    if (options.format && !validFormats.includes(options.format)) {
      throw new FlexDocError(
        ErrorType.VALIDATION_ERROR,
        `Invalid format: ${options.format}. Must be one of: ${validFormats.join(', ')}`
      );
    }

    // Validate scale
    if (options.scale !== undefined) {
      if (options.scale < 0.1 || options.scale > 2) {
        throw new FlexDocError(
          ErrorType.VALIDATION_ERROR,
          'Scale must be between 0.1 and 2.0'
        );
      }
    }

    // Validate margins
    if (options.margin) {
      const margins = ['top', 'right', 'bottom', 'left'] as const;
      for (const margin of margins) {
        const value = options.margin[margin];
        if (value !== undefined && typeof value !== 'string' && typeof value !== 'number') {
          throw new FlexDocError(
            ErrorType.VALIDATION_ERROR,
            `Invalid margin ${margin}: must be string or number`
          );
        }
      }
    }

    return true;
  }

  /**
   * Launch Puppeteer browser
   */
  private async launchBrowser(): Promise<Browser> {
    try {
      return await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu'
        ]
      });
    } catch (error) {
      throw new FlexDocError(
        ErrorType.BROWSER_LAUNCH_ERROR,
        'Failed to launch browser',
        error
      );
    }
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
      // URL will be handled differently in convert method
      return '';
    }

    throw new FlexDocError(
      ErrorType.INVALID_INPUT,
      'Invalid HTML input: must provide content, filePath, or url'
    );
  }

  /**
   * Prepare Puppeteer PDF options
   */
  private preparePuppeteerOptions(options: PDFOptions): PuppeteerPDFOptions {
    const pdfOptions: PuppeteerPDFOptions = {
      format: options.format as any,
      printBackground: options.printBackground,
      displayHeaderFooter: options.displayHeaderFooter,
      headerTemplate: options.headerTemplate,
      footerTemplate: options.footerTemplate,
      landscape: options.landscape,
      pageRanges: options.pageRanges,
      scale: options.scale,
      preferCSSPageSize: options.preferCSSPageSize,
      margin: options.margin as any
    };

    // Add custom dimensions if specified
    if (options.width || options.height) {
      pdfOptions.width = options.width;
      pdfOptions.height = options.height;
      delete pdfOptions.format; // Custom size overrides format
    }

    // Remove undefined values
    return Object.fromEntries(
      Object.entries(pdfOptions).filter(([_, v]) => v !== undefined)
    ) as PuppeteerPDFOptions;
  }

  /**
   * Estimate page count from PDF buffer
   */
  private async estimatePageCount(buffer: Buffer): Promise<number> {
    // Simple estimation based on PDF structure
    const content = buffer.toString('latin1');
    const pageMatches = content.match(/\/Type\s*\/Page[^s]/g);
    return pageMatches ? pageMatches.length : 1;
  }

  /**
   * Cleanup browser resources
   */
  private async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

// Export singleton instance
export const pdfConverter = new PDFConverter();

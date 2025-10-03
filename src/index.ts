/**
 * FlexDoc - Main Entry Point
 * Unified API for HTML to PDF/PPTX conversion
 */

import { pdfConverter } from './converters/pdf-converter';
import { pptxConverter } from './converters/pptx-converter';
import {
  ConversionOptions,
  ConversionResult,
  PDFOptions,
  PPTXOptions,
  HTMLInput,
  OutputFormat,
  IFlexDoc,
  FlexDocError,
  ErrorType,
  BatchConversionItem,
  BatchConversionResult
} from './types';

/**
 * FlexDoc - HTML to PDF/PPTX Converter
 * 
 * @example
 * ```typescript
 * const flexdoc = new FlexDoc();
 * 
 * // Convert to PDF
 * const pdfResult = await flexdoc.toPDF('<h1>Hello World</h1>');
 * 
 * // Convert to PPTX
 * const pptxResult = await flexdoc.toPPTX('<h1>Slide 1</h1><h2>Slide 2</h2>');
 * 
 * // Unified API
 * const result = await flexdoc.convert(html, {
 *   format: OutputFormat.PDF,
 *   outputPath: './output.pdf',
 *   pdfOptions: { format: 'A4' }
 * });
 * ```
 */
export class FlexDoc implements IFlexDoc {
  /**
   * Convert HTML to specified format (PDF or PPTX)
   * Unified API for all conversions
   */
  async convert(
    html: string | HTMLInput,
    options: ConversionOptions
  ): Promise<ConversionResult> {
    // Validate format
    if (!options.format) {
      throw new FlexDocError(
        ErrorType.VALIDATION_ERROR,
        'Format is required. Must be either "pdf" or "pptx"'
      );
    }

    // Route to appropriate converter
    switch (options.format) {
      case OutputFormat.PDF:
        const pdfOpts = (options.pdfOptions || options.options || {}) as PDFOptions;
        return this.toPDF(html, pdfOpts);

      case OutputFormat.PPTX:
        const pptxOpts = (options.pptxOptions || options.options || {}) as PPTXOptions;
        return this.toPPTX(html, pptxOpts);

      default:
        throw new FlexDocError(
          ErrorType.VALIDATION_ERROR,
          `Unsupported format: ${options.format}. Must be either "pdf" or "pptx"`
        );
    }
  }

  /**
   * Convert HTML to PDF
   */
  async toPDF(
    html: string | HTMLInput,
    options?: PDFOptions
  ): Promise<ConversionResult> {
    try {
      return await pdfConverter.convert(html, options || {});
    } catch (error) {
      if (error instanceof FlexDocError) {
        throw error;
      }
      throw new FlexDocError(
        ErrorType.CONVERSION_FAILED,
        `PDF conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error
      );
    }
  }

  /**
   * Convert HTML to PPTX
   */
  async toPPTX(
    html: string | HTMLInput,
    options?: PPTXOptions & { professional?: boolean }
  ): Promise<ConversionResult> {
    try {
      // Use professional converter if requested
      if (options?.professional) {
        const { professionalPptxConverter } = await import('./converters/professional-pptx-converter');
        return await professionalPptxConverter.convert(html, options || {});
      }
      
      // Use standard converter
      return await pptxConverter.convert(html, options || {});
    } catch (error) {
      if (error instanceof FlexDocError) {
        throw error;
      }
      throw new FlexDocError(
        ErrorType.CONVERSION_FAILED,
        `PPTX conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error
      );
    }
  }

  /**
   * Batch convert multiple HTML inputs
   */
  async batchConvert(
    inputs: Array<{
      html: string | HTMLInput;
      options: ConversionOptions;
    }>
  ): Promise<ConversionResult[]> {
    const results: ConversionResult[] = [];
    
    for (const input of inputs) {
      try {
        const result = await this.convert(input.html, input.options);
        results.push(result);
      } catch (error) {
        // Add failed result
        results.push({
          success: false,
          format: input.options.format,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return results;
  }

  /**
   * Convert with retry logic
   */
  async convertWithRetry(
    html: string | HTMLInput,
    options: ConversionOptions,
    maxRetries: number = 3
  ): Promise<ConversionResult> {
    let lastError: Error | undefined;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.convert(html, options);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (attempt < maxRetries) {
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }
    
    throw new FlexDocError(
      ErrorType.CONVERSION_FAILED,
      `Conversion failed after ${maxRetries} attempts: ${lastError?.message}`,
      lastError
    );
  }

  /**
   * Convert batch of items
   */
  async convertBatch(items: BatchConversionItem[]): Promise<BatchConversionResult> {
    const startTime = Date.now();
    const results: Array<{ id?: string; result: ConversionResult }> = [];
    let successful = 0;
    let failed = 0;

    for (const item of items) {
      try {
        const result = await this.convert(item.html, {
          format: item.format,
          options: item.options
        });
        results.push({ id: item.id, result });
        if (result.success) successful++;
        else failed++;
      } catch (error) {
        results.push({
          id: item.id,
          result: {
            success: false,
            format: item.format,
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        });
        failed++;
      }
    }

    return {
      total: items.length,
      successful,
      failed,
      results,
      duration: Date.now() - startTime
    };
  }

  /**
   * Validate HTML input
   */
  validateInput(html: string | HTMLInput): boolean {
    if (!html) {
      throw new FlexDocError(
        ErrorType.INVALID_INPUT,
        'HTML input is required'
      );
    }

    if (typeof html === 'string') {
      if (!html.trim()) {
        throw new FlexDocError(
          ErrorType.INVALID_INPUT,
          'HTML content cannot be empty'
        );
      }
      return true;
    }

    // Validate HTMLInput object
    if (typeof html === 'object' && html !== null && !(html instanceof Buffer) && !(html instanceof URL)) {
      if (!('content' in html) && !('url' in html) && !('filePath' in html)) {
        throw new FlexDocError(
          ErrorType.INVALID_INPUT,
          'HTMLInput must have either content, url, or filePath'
        );
      }
      if (!html.content && !html.url && !html.filePath) {
        throw new FlexDocError(
          ErrorType.INVALID_INPUT,
          'HTMLInput must have either content, url, or filePath'
        );
      }
    }

    return true;
  }

  /**
   * Get supported formats
   */
  getSupportedFormats(): string[] {
    return Object.values(OutputFormat);
  }

  /**
   * Get version
   */
  getVersion(): string {
    return '1.0.0'; // This would normally come from package.json
  }
}

// Export everything needed for the library
export * from './types';
export { pdfConverter } from './converters/pdf-converter';
export { pptxConverter } from './converters/pptx-converter';
export { professionalPptxConverter } from './converters/professional-pptx-converter';

// Export engines
export * from './engines/chart-engine';
export * from './engines/image-processing-engine';
export * from './engines/ai-layout-engine';

// Create and export default instance
const flexdoc = new FlexDoc();
export default flexdoc;

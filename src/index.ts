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
  ErrorType
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
        return this.toPDF(html, {
          ...options,
          ...options.pdfOptions
        });

      case OutputFormat.PPTX:
        return this.toPPTX(html, {
          ...options,
          ...options.pptxOptions
        });

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
    if (!html.content && !html.url && !html.filePath) {
      throw new FlexDocError(
        ErrorType.INVALID_INPUT,
        'HTMLInput must have either content, url, or filePath'
      );
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

// Also export the class for custom instances
export { FlexDoc };

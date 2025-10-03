/**
 * FlexDoc - Type Definitions
 * Core types and interfaces for HTML to PDF/PPTX conversion
 */

/**
 * Supported output formats
 */
export enum OutputFormat {
  PDF = 'pdf',
  PPTX = 'pptx'
}

/**
 * Common conversion options for all formats
 */
export interface BaseConversionOptions {
  /** Output file path (optional - if not provided, returns buffer) */
  outputPath?: string;
  /** Enable debug logging */
  debug?: boolean;
  /** Timeout in milliseconds (default: 30000) */
  timeout?: number;
  /** Progress callback function */
  onProgress?: (progress: ProgressInfo) => void;
  /** Custom CSS to inject */
  customCSS?: string;
  /** Wait for specific element before conversion */
  waitForSelector?: string;
  /** JavaScript to execute before conversion */
  executeScript?: string;
}

/**
 * PDF-specific conversion options
 */
export interface PDFOptions extends BaseConversionOptions {
  /** Paper format */
  format?: 'A4' | 'A3' | 'A2' | 'A1' | 'A0' | 'Letter' | 'Legal' | 'Tabloid' | 'Ledger';
  /** Custom width (e.g., '8.5in', '21cm') */
  width?: string | number;
  /** Custom height */
  height?: string | number;
  /** Page margins */
  margin?: {
    top?: string | number;
    right?: string | number;
    bottom?: string | number;
    left?: string | number;
  };
  /** Print background graphics */
  printBackground?: boolean;
  /** Display header and footer */
  displayHeaderFooter?: boolean;
  /** Header template HTML */
  headerTemplate?: string;
  /** Footer template HTML */
  footerTemplate?: string;
  /** Paper orientation */
  landscape?: boolean;
  /** Page ranges to print (e.g., '1-5, 8, 11-13') */
  pageRanges?: string;
  /** Scale of the webpage rendering (0.1 - 2.0) */
  scale?: number;
  /** Give any CSS @page size declared in the page priority */
  preferCSSPageSize?: boolean;
}

/**
 * PPTX-specific conversion options
 */
export interface PPTXOptions extends BaseConversionOptions {
  /** Slide layout (16:9, 16:10, 4:3) */
  layout?: '16x9' | '16x10' | '4x3' | 'wide';
  /** Slide width in inches (default: 10) */
  slideWidth?: number;
  /** Slide height in inches (default: 5.625 for 16:9) */
  slideHeight?: number;
  /** Title for the presentation */
  title?: string;
  /** Author of the presentation */
  author?: string;
  /** Company name */
  company?: string;
  /** Subject of the presentation */
  subject?: string;
  /** Revision number */
  revision?: string;
  /** Theme/template to use */
  theme?: PPTXTheme;
  /** How to split HTML into slides */
  splitBy?: 'h1' | 'h2' | 'h3' | 'hr' | 'section' | 'div.slide' | 'auto';
  /** Maximum content per slide before auto-split */
  maxContentPerSlide?: number;
  /** Include images from HTML */
  includeImages?: boolean;
  /** Master slide settings */
  masterSlide?: {
    title?: string;
    background?: string | { color?: string; image?: string };
    logo?: string;
  };
}

/**
 * PPTX Theme options
 */
export interface PPTXTheme {
  /** Primary color */
  primary?: string;
  /** Secondary color */
  secondary?: string;
  /** Background color */
  background?: string;
  /** Text color */
  textColor?: string;
  /** Font family */
  fontFace?: string;
  /** Font size */
  fontSize?: number;
}

/**
 * Unified conversion options
 */
export interface ConversionOptions extends BaseConversionOptions {
  /** Output format */
  format: OutputFormat;
  /** PDF-specific options */
  pdfOptions?: Omit<PDFOptions, keyof BaseConversionOptions>;
  /** PPTX-specific options */
  pptxOptions?: Omit<PPTXOptions, keyof BaseConversionOptions>;
}

/**
 * Progress information
 */
export interface ProgressInfo {
  /** Current step */
  step: string;
  /** Percentage complete (0-100) */
  percentage: number;
  /** Additional details */
  details?: string;
}

/**
 * Conversion result
 */
export interface ConversionResult {
  /** Success status */
  success: boolean;
  /** Output format */
  format: OutputFormat;
  /** File buffer (if outputPath not provided) */
  buffer?: Buffer;
  /** Output file path (if provided) */
  filePath?: string;
  /** File size in bytes */
  size?: number;
  /** Conversion duration in milliseconds */
  duration?: number;
  /** Error message if failed */
  error?: string;
  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * HTML input options
 */
export interface HTMLInput {
  /** HTML content as string */
  content?: string;
  /** URL to fetch HTML from */
  url?: string;
  /** File path to read HTML from */
  filePath?: string;
}

/**
 * Converter interface
 */
export interface IConverter {
  convert(html: string | HTMLInput, options?: any): Promise<ConversionResult>;
  validateOptions(options: any): boolean;
}

/**
 * FlexDoc main class interface
 */
export interface IFlexDoc {
  convert(html: string | HTMLInput, options: ConversionOptions): Promise<ConversionResult>;
  toPDF(html: string | HTMLInput, options?: PDFOptions): Promise<ConversionResult>;
  toPPTX(html: string | HTMLInput, options?: PPTXOptions): Promise<ConversionResult>;
}

/**
 * Error types
 */
export enum ErrorType {
  INVALID_INPUT = 'INVALID_INPUT',
  CONVERSION_FAILED = 'CONVERSION_FAILED',
  TIMEOUT = 'TIMEOUT',
  FILE_WRITE_ERROR = 'FILE_WRITE_ERROR',
  BROWSER_LAUNCH_ERROR = 'BROWSER_LAUNCH_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR'
}

/**
 * Custom error class
 */
export class FlexDocError extends Error {
  constructor(
    public type: ErrorType,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'FlexDocError';
  }
}

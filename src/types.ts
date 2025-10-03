// Core types and interfaces for FlexDoc

/**
 * Supported output formats
 */
export enum OutputFormat {
  PDF = 'pdf',
  PPTX = 'pptx'
}

/**
 * Common conversion options
 */
export interface BaseConversionOptions {
  /** Output file path (optional - if not provided, returns buffer) */
  outputPath?: string;
  /** Enable debug logging */
  debug?: boolean;
  /** Timeout in milliseconds */
  timeout?: number;
  /** Progress callback */
  onProgress?: (progress: Progress) => void;
}

/**
 * PDF-specific conversion options
 */
export interface PDFOptions extends BaseConversionOptions {
  /** Paper format (A4, Letter, etc.) */
  format?: 'A4' | 'A3' | 'Letter' | 'Legal' | 'Tabloid';
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
  /** Display header and footer */
  displayHeaderFooter?: boolean;
  /** Header HTML template */
  headerTemplate?: string;
  /** Footer HTML template */
  footerTemplate?: string;
  /** Print background graphics */
  printBackground?: boolean;
  /** Landscape orientation */
  landscape?: boolean;
  /** Page ranges (e.g., '1-5, 8, 11-13') */
  pageRanges?: string;
  /** Scale of the content */
  scale?: number;
  /** Wait for specific element or time before conversion */
  waitFor?: string | number;
  /** Custom CSS to inject */
  customCSS?: string;
  /** JavaScript to execute before conversion */
  executeScript?: string;
  /** Wait for selector before conversion */
  waitForSelector?: string;
  /** Prefer CSS page size over options */
  preferCSSPageSize?: boolean;
}

/**
 * PPTX-specific conversion options
 */
export interface PPTXOptions extends BaseConversionOptions {
  /** Slide layout (16:9, 16:10, 4:3) */
  layout?: '16x9' | '16x10' | '4x3';
  /** Author information */
  author?: string;
  /** Presentation title */
  title?: string;
  /** Subject of presentation */
  subject?: string;
  /** Company name */
  company?: string;
  /** Slide master configuration */
  masterSlide?: {
    title?: string;
    background?: string | { color?: string; image?: string };
    fonts?: {
      title?: string;
      body?: string;
    };
  };
  /** How to split HTML into slides */
  slideSplitRule?: 'h1' | 'h2' | 'hr' | 'pagebreak' | 'custom';
  /** Custom split selector (if slideSplitRule is 'custom') */
  customSplitSelector?: string;
  /** Include slide numbers */
  slideNumbers?: boolean;
  /** Theme/template to use */
  theme?: 'default' | 'dark' | 'corporate' | 'creative';
  /** Add conclusion slide */
  addConclusion?: boolean;
  /** Color scheme */
  colorScheme?: string;
  /** Slide width in inches */
  slideWidth?: number;
  /** Slide height in inches */
  slideHeight?: number;
  /** Custom CSS to inject */
  customCSS?: string;
  /** JavaScript to execute before conversion */
  executeScript?: string;
  /** Wait for selector before conversion */
  waitForSelector?: string;
  /** Template configuration */
  template?: any;
  /** How to split content into slides */
  splitBy?: string;
  /** Include images in slides */
  includeImages?: boolean;
  /** Maximum content per slide */
  maxContentPerSlide?: number;
  /** Revision number */
  revision?: string;
}

/**
 * Unified conversion options
 */
export interface ConversionOptions {
  /** Output format */
  format: OutputFormat;
  /** Format-specific options */
  options?: PDFOptions | PPTXOptions;
  /** PDF-specific options (for backward compatibility) */
  pdfOptions?: PDFOptions;
  /** PPTX-specific options (for backward compatibility) */
  pptxOptions?: PPTXOptions;
}

/**
 * Progress information
 */
export interface Progress {
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
  /** File path (if saved to disk) */
  filePath?: string;
  /** Buffer data (if not saved to disk) */
  buffer?: Buffer;
  /** File size in bytes */
  size?: number;
  /** Conversion duration in milliseconds */
  duration?: number;
  /** Error message (if any) */
  error?: string;
  /** Additional metadata */
  metadata?: {
    pageCount?: number;
    slideCount?: number;
    [key: string]: any;
  };
}

/**
 * FlexDoc configuration
 */
export interface FlexDocConfig {
  /** Puppeteer executable path (optional) */
  puppeteerExecutablePath?: string;
  /** Default PDF options */
  defaultPDFOptions?: Partial<PDFOptions>;
  /** Default PPTX options */
  defaultPPTXOptions?: Partial<PPTXOptions>;
  /** Enable caching */
  enableCache?: boolean;
  /** Cache directory */
  cacheDir?: string;
  /** Maximum parallel conversions */
  maxConcurrency?: number;
}

/**
 * HTML input types
 */
export type HTMLInput = string | Buffer | URL | {
  content?: string;
  url?: string;
  filePath?: string;
};

/**
 * Batch conversion item
 */
export interface BatchConversionItem {
  /** Unique identifier */
  id?: string;
  /** HTML content */
  html: HTMLInput;
  /** Output format */
  format: OutputFormat;
  /** Conversion options */
  options?: PDFOptions | PPTXOptions;
}

/**
 * Batch conversion result
 */
export interface BatchConversionResult {
  /** Total items processed */
  total: number;
  /** Successful conversions */
  successful: number;
  /** Failed conversions */
  failed: number;
  /** Individual results */
  results: Array<{
    id?: string;
    result: ConversionResult;
  }>;
  /** Total duration */
  duration: number;
}

/**
 * Error types
 */
export enum ErrorType {
  VALIDATION = 'VALIDATION',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  CONVERSION = 'CONVERSION',
  CONVERSION_FAILED = 'CONVERSION_FAILED',
  FILE_SYSTEM = 'FILE_SYSTEM',
  FILE_ERROR = 'FILE_ERROR',
  FILE_WRITE_ERROR = 'FILE_WRITE_ERROR',
  NETWORK = 'NETWORK',
  NETWORK_ERROR = 'NETWORK_ERROR',
  BROWSER_LAUNCH_ERROR = 'BROWSER_LAUNCH_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  TIMEOUT = 'TIMEOUT',
  UNKNOWN = 'UNKNOWN'
}

/**
 * FlexDoc error class
 */
export class FlexDocError extends Error {
  public originalError?: Error;

  constructor(
    public type: ErrorType,
    message: string,
    originalError?: unknown
  ) {
    super(message);
    this.name = 'FlexDocError';
    this.originalError = originalError instanceof Error ? originalError : undefined;
  }
}

/**
 * Converter interface
 */
export interface IConverter {
  convert(html: HTMLInput, options?: PDFOptions | PPTXOptions): Promise<ConversionResult>;
}

/**
 * FlexDoc interface
 */
export interface IFlexDoc {
  convert(html: HTMLInput, options: ConversionOptions): Promise<ConversionResult>;
  convertBatch(items: BatchConversionItem[]): Promise<BatchConversionResult>;
}

/**
 * Progress info (alias for Progress for backward compatibility)
 */
export type ProgressInfo = Progress;

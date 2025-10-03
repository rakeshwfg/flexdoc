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
}

/**
 * Unified conversion options
 */
export interface ConversionOptions {
  /** Output format */
  format: OutputFormat;
  /** Format-specific options */
  options?: PDFOptions | PPTXOptions;
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
export type HTMLInput = string | Buffer | URL;

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

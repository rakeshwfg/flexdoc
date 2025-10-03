// Core types and interfaces for FlexDoc

/**
 * Supported output formats
 */
export enum OutputFormat {
  PDF = 'pdf',
  PPTX = 'pptx',
  DOCX = 'docx'
}

/**
 * Common conversion options
 */
export interface BaseConversionOptions {
  /** Output file path (optional - if not provided, returns buffer) */
  outputPath?: string;
  /** Cloud storage output URL (e.g., s3://bucket/file.pdf) */
  cloudOutput?: string;
  /** Cloud storage credentials */
  cloudCredentials?: import('./cloud').CloudCredentials;
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
  /** Watermark configuration */
  watermark?: {
    /** Watermark text */
    text?: string;
    /** Watermark image path or URL */
    image?: string;
    /** Position of watermark */
    position?: 'center' | 'diagonal' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
    /** Opacity (0-1) */
    opacity?: number;
    /** Font size for text watermark */
    fontSize?: number;
    /** Text color */
    color?: string;
    /** Rotation angle in degrees */
    rotation?: number;
    /** Repeat watermark across page */
    repeat?: boolean;
    /** Font family for text watermark */
    fontFamily?: string;
    /** Font weight */
    fontWeight?: string | number;
    /** Image width (for image watermarks) */
    imageWidth?: number;
    /** Image height (for image watermarks) */
    imageHeight?: number;
  };
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
  /** Theme/template to use - can be a preset ID, legacy name, or custom Theme object */
  theme?: string | import('./themes').Theme;
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
  /** Automatically convert tables to charts when appropriate */
  autoCharts?: boolean;
  /** Chart generation preferences */
  chartOptions?: {
    /** Prefer specific chart types when auto-detecting */
    preferredTypes?: ('bar' | 'line' | 'pie' | 'area' | 'scatter' | 'doughnut' | 'radar' | 'bubble')[];
    /** Minimum rows required to generate a chart (default: 2) */
    minRows?: number;
    /** Maximum rows for chart generation (default: 50) */
    maxRows?: number;
    /** Show data values on charts */
    showValues?: boolean;
    /** Show chart legend */
    showLegend?: boolean;
    /** Chart theme: light, dark, colorful */
    theme?: 'light' | 'dark' | 'colorful';
    /** Position: replace table or show both */
    position?: 'replace' | 'alongside' | 'both';
  };
  /** Theme customization options */
  themeOptions?: {
    /** Quick primary color override */
    primaryColor?: string;
    /** Quick secondary color override */
    secondaryColor?: string;
    /** Quick accent color override */
    accentColor?: string;
    /** Quick font family override */
    fontFamily?: string;
    /** Enable/disable effects */
    enableEffects?: boolean;
    /** Dark mode variant */
    darkMode?: boolean;
  };
}

/**
 * DOCX-specific conversion options
 */
export interface DOCXOptions extends BaseConversionOptions {
  /** Document orientation */
  orientation?: 'portrait' | 'landscape';
  /** Page size */
  pageSize?: 'A4' | 'A3' | 'Letter' | 'Legal' | 'Tabloid';
  /** Custom page width in twips (1/1440 of an inch) */
  pageWidth?: number;
  /** Custom page height in twips */
  pageHeight?: number;
  /** Page margins in twips */
  margins?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  /** Document title (metadata) */
  title?: string;
  /** Document subject (metadata) */
  subject?: string;
  /** Document author (metadata) */
  author?: string;
  /** Company name (metadata) */
  company?: string;
  /** Document description (metadata) */
  description?: string;
  /** Document keywords (metadata) */
  keywords?: string[];
  /** Theme/template to use - can be a preset ID or custom Theme object */
  theme?: string | import('./themes').Theme;
  /** Theme customization options */
  themeOptions?: {
    /** Quick primary color override */
    primaryColor?: string;
    /** Quick secondary color override */
    secondaryColor?: string;
    /** Quick accent color override */
    accentColor?: string;
    /** Quick font family override */
    fontFamily?: string;
    /** Enable/disable effects */
    enableEffects?: boolean;
    /** Dark mode variant */
    darkMode?: boolean;
  };
  /** Header configuration */
  header?: {
    /** Header text */
    text?: string;
    /** Include page numbers in header */
    includePageNumber?: boolean;
    /** Page number format */
    pageNumberFormat?: 'decimal' | 'roman' | 'letter';
    /** Alignment */
    alignment?: 'left' | 'center' | 'right';
  };
  /** Footer configuration */
  footer?: {
    /** Footer text */
    text?: string;
    /** Include page numbers in footer */
    includePageNumber?: boolean;
    /** Page number format */
    pageNumberFormat?: 'decimal' | 'roman' | 'letter';
    /** Alignment */
    alignment?: 'left' | 'center' | 'right';
  };
  /** Line spacing */
  lineSpacing?: number;
  /** Font size for body text */
  fontSize?: number;
  /** Font family for body text */
  fontFamily?: string;
  /** Include table of contents */
  includeTableOfContents?: boolean;
  /** Table of contents depth (heading levels to include) */
  tocDepth?: number;
  /** Number pages */
  numberPages?: boolean;
  /** Page number start */
  pageNumberStart?: number;
}

/**
 * Unified conversion options
 */
export interface ConversionOptions {
  /** Output format */
  format: OutputFormat;
  /** Format-specific options */
  options?: PDFOptions | PPTXOptions | DOCXOptions;
  /** PDF-specific options (for backward compatibility) */
  pdfOptions?: PDFOptions;
  /** PPTX-specific options (for backward compatibility) */
  pptxOptions?: PPTXOptions;
  /** DOCX-specific options (for backward compatibility) */
  docxOptions?: DOCXOptions;
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
  /** Default DOCX options */
  defaultDOCXOptions?: Partial<DOCXOptions>;
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
  options?: PDFOptions | PPTXOptions | DOCXOptions;
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
  convert(html: HTMLInput, options?: PDFOptions | PPTXOptions | DOCXOptions): Promise<ConversionResult>;
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

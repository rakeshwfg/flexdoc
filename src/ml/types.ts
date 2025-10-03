/**
 * ML-based Layout Detection Types
 */

export enum ContentType {
  TITLE = 'title',
  HEADING = 'heading',
  PARAGRAPH = 'paragraph',
  LIST = 'list',
  TABLE = 'table',
  IMAGE = 'image',
  CODE = 'code',
  QUOTE = 'quote',
  CHART = 'chart',
  CALLOUT = 'callout',
  FOOTER = 'footer'
}

export enum LayoutPattern {
  DOCUMENT = 'document',           // Standard document flow
  PRESENTATION = 'presentation',   // Slide-based layout
  REPORT = 'report',              // Formal report structure
  ARTICLE = 'article',            // Article/blog layout
  TUTORIAL = 'tutorial',          // Step-by-step guide
  DASHBOARD = 'dashboard',        // Data visualization heavy
  LANDING_PAGE = 'landing-page'   // Marketing/landing page
}

export enum ImportanceLevel {
  CRITICAL = 5,    // Must include, primary content
  HIGH = 4,        // Very important
  MEDIUM = 3,      // Standard content
  LOW = 2,         // Supporting content
  MINIMAL = 1      // Can be summarized or omitted
}

export interface MLContentBlock {
  id: string;
  type: ContentType;
  content: string;
  htmlElement?: HTMLElement;
  importance: ImportanceLevel;
  position: number;
  wordCount: number;
  hasMedia: boolean;
  metadata: {
    depth?: number;           // Heading level depth
    listItems?: number;       // Number of list items
    columns?: number;         // Table columns
    rows?: number;           // Table rows
    imageCount?: number;     // Number of images
    isNumeric?: boolean;     // Contains numeric data
    sentiment?: 'positive' | 'neutral' | 'negative';
    keywords?: string[];
  };
}

export interface MLSection {
  id: string;
  title: string;
  blocks: MLContentBlock[];
  totalImportance: number;
  shouldStartNewPage: boolean;
  layoutHint?: 'title-slide' | 'content' | 'two-column' | 'image-focus' | 'data-viz';
}

export interface MLLayoutAnalysis {
  pattern: LayoutPattern;
  confidence: number;
  sections: MLSection[];
  totalBlocks: number;
  suggestedPageBreaks: number[];
  metadata: {
    hasTableOfContents: boolean;
    hasTitle: boolean;
    hasSubtitles: boolean;
    averageWordsPerSection: number;
    contentDensity: number;
    mediaRatio: number;
  };
}

export interface MLLayoutOptions {
  /** Enable ML-based layout detection */
  enableMLLayout?: boolean;

  /** Minimum importance level to include */
  minImportance?: ImportanceLevel;

  /** Target words per page/slide */
  targetWordsPerPage?: number;

  /** Maximum words per page/slide */
  maxWordsPerPage?: number;

  /** Enable smart section grouping */
  smartGrouping?: boolean;

  /** Enable content summarization for low-importance content */
  enableSummarization?: boolean;

  /** Prefer certain layout patterns */
  preferredPattern?: LayoutPattern;

  /** Enable intelligent page breaking */
  smartPageBreaks?: boolean;

  /** Keep related content together */
  keepRelatedTogether?: boolean;
}

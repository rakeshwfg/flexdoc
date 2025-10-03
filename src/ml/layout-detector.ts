/**
 * Layout Detector - ML-based intelligent layout pattern detection
 */

import { JSDOM } from 'jsdom';
import { ContentAnalyzer } from './content-analyzer';
import {
  LayoutPattern,
  MLLayoutAnalysis,
  MLSection,
  MLContentBlock,
  ContentType,
  ImportanceLevel,
  MLLayoutOptions
} from './types';

export class LayoutDetector {
  private analyzer: ContentAnalyzer;

  constructor() {
    this.analyzer = new ContentAnalyzer();
  }

  /**
   * Analyze HTML and detect layout pattern
   */
  async analyze(html: string, options: MLLayoutOptions = {}): Promise<MLLayoutAnalysis> {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const body = document.body;

    // Analyze all content blocks
    const blocks = this.analyzeBlocks(body);

    // Detect layout pattern
    const pattern = this.detectPattern(blocks);

    // Group blocks into sections
    const sections = this.groupIntoSections(blocks, options);

    // Calculate page breaks
    const pageBreaks = this.calculatePageBreaks(sections, options);

    // Calculate metadata
    const metadata = this.calculateMetadata(blocks, sections);

    return {
      pattern,
      confidence: this.calculateConfidence(pattern, blocks),
      sections,
      totalBlocks: blocks.length,
      suggestedPageBreaks: pageBreaks,
      metadata
    };
  }

  /**
   * Analyze all blocks in document
   */
  private analyzeBlocks(body: HTMLElement): MLContentBlock[] {
    const blocks: MLContentBlock[] = [];
    let position = 0;

    const traverse = (element: HTMLElement) => {
      // Skip script, style, and other non-content elements
      const tagName = element.tagName.toLowerCase();
      if (['script', 'style', 'meta', 'link'].includes(tagName)) {
        return;
      }

      // Analyze this element if it's a block-level element
      if (this.isBlockElement(element)) {
        const block = this.analyzer.analyzeElement(element, position++);
        if (block.content.trim()) {
          blocks.push(block);
        }
      }

      // Traverse children
      Array.from(element.children).forEach(child => {
        traverse(child as HTMLElement);
      });
    };

    traverse(body);
    return blocks;
  }

  /**
   * Check if element is a block-level element
   */
  private isBlockElement(element: HTMLElement): boolean {
    const blockElements = [
      'p', 'div', 'section', 'article', 'header', 'footer',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'table', 'blockquote', 'pre',
      'figure', 'aside'
    ];

    return blockElements.includes(element.tagName.toLowerCase());
  }

  /**
   * Detect layout pattern from content blocks
   */
  private detectPattern(blocks: MLContentBlock[]): LayoutPattern {
    const features = this.extractFeatures(blocks);

    // Rule-based pattern detection
    if (features.hasTitle && features.headingRatio > 0.3) {
      return LayoutPattern.PRESENTATION;
    }

    if (features.tableCount > blocks.length * 0.4 || features.chartCount > 0) {
      return LayoutPattern.DASHBOARD;
    }

    if (features.hasTableOfContents) {
      return LayoutPattern.REPORT;
    }

    if (features.listRatio > 0.4 && features.codeBlockCount > 0) {
      return LayoutPattern.TUTORIAL;
    }

    if (features.hasHeroSection && features.calloutCount > 2) {
      return LayoutPattern.LANDING_PAGE;
    }

    if (features.averageWordsPerBlock > 100) {
      return LayoutPattern.ARTICLE;
    }

    return LayoutPattern.DOCUMENT;
  }

  /**
   * Extract features for pattern detection
   */
  private extractFeatures(blocks: MLContentBlock[]) {
    return {
      hasTitle: blocks.some(b => b.type === ContentType.TITLE),
      hasTableOfContents: blocks.some(b =>
        b.content.toLowerCase().includes('table of contents') ||
        b.content.toLowerCase().includes('contents')
      ),
      hasHeroSection: blocks.some(b =>
        b.importance === ImportanceLevel.CRITICAL &&
        b.position < 2
      ),
      headingRatio: blocks.filter(b =>
        b.type === ContentType.HEADING || b.type === ContentType.TITLE
      ).length / blocks.length,
      tableCount: blocks.filter(b => b.type === ContentType.TABLE).length,
      chartCount: blocks.filter(b => b.type === ContentType.CHART).length,
      listRatio: blocks.filter(b => b.type === ContentType.LIST).length / blocks.length,
      codeBlockCount: blocks.filter(b => b.type === ContentType.CODE).length,
      calloutCount: blocks.filter(b => b.type === ContentType.CALLOUT).length,
      averageWordsPerBlock: blocks.reduce((sum, b) => sum + b.wordCount, 0) / blocks.length,
      mediaRatio: blocks.filter(b => b.hasMedia).length / blocks.length
    };
  }

  /**
   * Group blocks into logical sections
   */
  private groupIntoSections(blocks: MLContentBlock[], options: MLLayoutOptions): MLSection[] {
    const sections: MLSection[] = [];
    let currentSection: MLSection | null = null;
    let sectionId = 0;

    blocks.forEach((block, index) => {
      // Start new section on titles and major headings
      if (
        block.type === ContentType.TITLE ||
        (block.type === ContentType.HEADING && block.metadata.depth === 2)
      ) {
        if (currentSection) {
          sections.push(currentSection);
        }

        currentSection = {
          id: `section-${sectionId++}`,
          title: block.content,
          blocks: [block],
          totalImportance: block.importance,
          shouldStartNewPage: true,
          layoutHint: block.type === ContentType.TITLE ? 'title-slide' : 'content'
        };
      } else {
        // Add to current section or create new one
        if (!currentSection) {
          currentSection = {
            id: `section-${sectionId++}`,
            title: 'Introduction',
            blocks: [block],
            totalImportance: block.importance,
            shouldStartNewPage: index === 0,
            layoutHint: 'content'
          };
        } else {
          currentSection.blocks.push(block);
          currentSection.totalImportance += block.importance;

          // Determine layout hint based on content
          if (block.type === ContentType.TABLE || block.type === ContentType.CHART) {
            currentSection.layoutHint = 'data-viz';
          } else if (block.type === ContentType.IMAGE && block.importance >= ImportanceLevel.HIGH) {
            currentSection.layoutHint = 'image-focus';
          }
        }
      }
    });

    // Add last section
    if (currentSection) {
      sections.push(currentSection);
    }

    // Apply smart grouping if enabled
    if (options.smartGrouping) {
      return this.applySmartGrouping(sections, options);
    }

    return sections;
  }

  /**
   * Apply smart grouping to combine or split sections
   */
  private applySmartGrouping(sections: MLSection[], options: MLLayoutOptions): MLSection[] {
    const targetWords = options.targetWordsPerPage || 300;
    const maxWords = options.maxWordsPerPage || 500;
    const result: MLSection[] = [];

    let currentGroup: MLSection | null = null;

    sections.forEach(section => {
      const sectionWords = this.calculateSectionWords(section);

      if (!currentGroup) {
        currentGroup = section;
      } else {
        const groupWords = this.calculateSectionWords(currentGroup);

        // If adding this section doesn't exceed max, and we're below target, combine
        if (groupWords + sectionWords <= maxWords && groupWords < targetWords) {
          currentGroup.blocks.push(...section.blocks);
          currentGroup.totalImportance += section.totalImportance;
        } else {
          // Push current group and start new one
          result.push(currentGroup);
          currentGroup = section;
        }
      }
    });

    if (currentGroup) {
      result.push(currentGroup);
    }

    return result;
  }

  /**
   * Calculate total words in a section
   */
  private calculateSectionWords(section: MLSection): number {
    return section.blocks.reduce((sum, block) => sum + block.wordCount, 0);
  }

  /**
   * Calculate intelligent page breaks
   */
  private calculatePageBreaks(sections: MLSection[], options: MLLayoutOptions): number[] {
    if (!options.smartPageBreaks) {
      return sections.map((_, index) => index);
    }

    const breaks: number[] = [];
    let currentPosition = 0;

    sections.forEach((section, index) => {
      if (section.shouldStartNewPage || currentPosition === 0) {
        breaks.push(currentPosition);
      }
      currentPosition += section.blocks.length;
    });

    return breaks;
  }

  /**
   * Calculate metadata about the document
   */
  private calculateMetadata(blocks: MLContentBlock[], sections: MLSection[]) {
    const totalWords = blocks.reduce((sum, b) => sum + b.wordCount, 0);

    return {
      hasTableOfContents: blocks.some(b =>
        b.content.toLowerCase().includes('table of contents')
      ),
      hasTitle: blocks.some(b => b.type === ContentType.TITLE),
      hasSubtitles: blocks.some(b =>
        b.type === ContentType.HEADING && b.metadata.depth === 2
      ),
      averageWordsPerSection: sections.length > 0
        ? totalWords / sections.length
        : 0,
      contentDensity: totalWords / blocks.length,
      mediaRatio: blocks.filter(b => b.hasMedia).length / blocks.length
    };
  }

  /**
   * Calculate confidence score for detected pattern
   */
  private calculateConfidence(pattern: LayoutPattern, blocks: MLContentBlock[]): number {
    const features = this.extractFeatures(blocks);
    let confidence = 0.5; // Base confidence

    switch (pattern) {
      case LayoutPattern.PRESENTATION:
        if (features.hasTitle) confidence += 0.2;
        if (features.headingRatio > 0.3) confidence += 0.2;
        break;

      case LayoutPattern.DASHBOARD:
        if (features.tableCount > 0) confidence += 0.2;
        if (features.chartCount > 0) confidence += 0.3;
        break;

      case LayoutPattern.REPORT:
        if (features.hasTableOfContents) confidence += 0.4;
        break;

      case LayoutPattern.TUTORIAL:
        if (features.listRatio > 0.3) confidence += 0.2;
        if (features.codeBlockCount > 0) confidence += 0.3;
        break;
    }

    return Math.min(1.0, confidence);
  }
}

/**
 * Content Analyzer - Intelligent content classification and scoring
 */

import { ContentType, MLContentBlock, ImportanceLevel } from './types';

export class ContentAnalyzer {
  /**
   * Analyze HTML element and classify its content
   */
  analyzeElement(element: HTMLElement, position: number): MLContentBlock {
    const tagName = element.tagName.toLowerCase();
    const content = this.extractText(element);
    const wordCount = this.countWords(content);

    // Determine content type
    const type = this.classifyContentType(element, tagName);

    // Calculate importance score
    const importance = this.calculateImportance(element, type, content, wordCount, position);

    // Extract metadata
    const metadata = this.extractMetadata(element, type, content);

    return {
      id: `block-${position}`,
      type,
      content,
      htmlElement: element,
      importance,
      position,
      wordCount,
      hasMedia: this.hasMedia(element),
      metadata
    };
  }

  /**
   * Classify content type from HTML element
   */
  private classifyContentType(element: HTMLElement, tagName: string): ContentType {
    // Check for specific patterns first
    if (this.isCallout(element)) return ContentType.CALLOUT;
    if (this.isChart(element)) return ContentType.CHART;

    // Standard HTML tags
    switch (tagName) {
      case 'h1':
        return ContentType.TITLE;
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        return ContentType.HEADING;
      case 'p':
        return ContentType.PARAGRAPH;
      case 'ul':
      case 'ol':
        return ContentType.LIST;
      case 'table':
        return ContentType.TABLE;
      case 'img':
      case 'figure':
        return ContentType.IMAGE;
      case 'pre':
      case 'code':
        return ContentType.CODE;
      case 'blockquote':
        return ContentType.QUOTE;
      default:
        // Analyze content to determine type
        if (element.querySelector('img, figure')) return ContentType.IMAGE;
        if (element.querySelector('table')) return ContentType.TABLE;
        if (element.querySelector('ul, ol')) return ContentType.LIST;
        return ContentType.PARAGRAPH;
    }
  }

  /**
   * Calculate importance level for content
   */
  private calculateImportance(
    element: HTMLElement,
    type: ContentType,
    content: string,
    wordCount: number,
    position: number
  ): ImportanceLevel {
    let score = 3; // Start with MEDIUM

    // Type-based importance
    switch (type) {
      case ContentType.TITLE:
        score = 5;
        break;
      case ContentType.HEADING:
        score = 4;
        break;
      case ContentType.CHART:
      case ContentType.TABLE:
        score = 4;
        break;
      case ContentType.CALLOUT:
        score = 4;
        break;
      case ContentType.IMAGE:
        score = 3;
        break;
      case ContentType.FOOTER:
        score = 1;
        break;
    }

    // Position bias - earlier content is often more important
    if (position < 3) score += 1;
    if (position > 20) score -= 1;

    // Word count consideration
    if (wordCount > 100) score += 1; // Substantial content
    if (wordCount < 10 && type === ContentType.PARAGRAPH) score -= 1;

    // Keyword analysis
    if (this.hasImportantKeywords(content)) score += 1;

    // Check for emphasis
    if (this.hasEmphasis(element)) score += 0.5;

    // Check for class/id hints
    if (this.hasImportanceHints(element)) score += 1;

    // Normalize to ImportanceLevel enum
    score = Math.max(1, Math.min(5, Math.round(score)));
    return score as ImportanceLevel;
  }

  /**
   * Extract metadata from element
   */
  private extractMetadata(element: HTMLElement, type: ContentType, content: string): any {
    const metadata: any = {};

    switch (type) {
      case ContentType.HEADING:
      case ContentType.TITLE:
        metadata.depth = parseInt(element.tagName.charAt(1)) || 1;
        break;

      case ContentType.LIST:
        metadata.listItems = element.querySelectorAll('li').length;
        break;

      case ContentType.TABLE:
        metadata.rows = element.querySelectorAll('tr').length;
        metadata.columns = element.querySelector('tr')?.querySelectorAll('td, th').length || 0;
        metadata.isNumeric = this.isNumericTable(element);
        break;

      case ContentType.IMAGE:
        metadata.imageCount = element.querySelectorAll('img').length;
        break;
    }

    // Extract keywords
    metadata.keywords = this.extractKeywords(content);

    // Sentiment analysis (basic)
    metadata.sentiment = this.analyzeSentiment(content);

    return metadata;
  }

  /**
   * Check if element has media (images, videos)
   */
  private hasMedia(element: HTMLElement): boolean {
    return !!(
      element.querySelector('img') ||
      element.querySelector('video') ||
      element.querySelector('svg') ||
      element.querySelector('canvas')
    );
  }

  /**
   * Check if element is a callout/alert box
   */
  private isCallout(element: HTMLElement): boolean {
    const className = element.className.toLowerCase();
    const id = element.id.toLowerCase();

    return (
      className.includes('callout') ||
      className.includes('alert') ||
      className.includes('note') ||
      className.includes('tip') ||
      className.includes('warning') ||
      id.includes('callout') ||
      id.includes('alert')
    );
  }

  /**
   * Check if element contains a chart
   */
  private isChart(element: HTMLElement): boolean {
    const className = element.className.toLowerCase();

    return (
      className.includes('chart') ||
      className.includes('graph') ||
      element.querySelector('canvas') !== null ||
      element.querySelector('[class*="chart"]') !== null
    );
  }

  /**
   * Check for important keywords
   */
  private hasImportantKeywords(content: string): boolean {
    const importantKeywords = [
      'important', 'critical', 'key', 'essential', 'must', 'required',
      'summary', 'conclusion', 'overview', 'introduction',
      'warning', 'caution', 'note', 'attention'
    ];

    const lowerContent = content.toLowerCase();
    return importantKeywords.some(keyword => lowerContent.includes(keyword));
  }

  /**
   * Check for emphasis (bold, italic, underline)
   */
  private hasEmphasis(element: HTMLElement): boolean {
    return !!(
      element.querySelector('strong') ||
      element.querySelector('b') ||
      element.querySelector('em') ||
      element.querySelector('mark')
    );
  }

  /**
   * Check for importance hints in class or ID
   */
  private hasImportanceHints(element: HTMLElement): boolean {
    const className = element.className.toLowerCase();
    const id = element.id.toLowerCase();

    const hints = ['important', 'primary', 'key', 'main', 'hero', 'featured'];
    return hints.some(hint => className.includes(hint) || id.includes(hint));
  }

  /**
   * Check if table contains numeric data
   */
  private isNumericTable(table: HTMLElement): boolean {
    const cells = table.querySelectorAll('td');
    let numericCells = 0;

    cells.forEach(cell => {
      const text = cell.textContent?.trim() || '';
      // Check if cell contains numbers (with optional currency/percentage symbols)
      if (/^[0-9$€£¥%,.\s-]+$/.test(text) && text.length > 0) {
        numericCells++;
      }
    });

    // If more than 50% of cells are numeric, consider it a numeric table
    return numericCells > cells.length * 0.5;
  }

  /**
   * Extract keywords from content
   */
  private extractKeywords(content: string): string[] {
    // Remove common words and extract significant terms
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);

    const words = content
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.has(word));

    // Count frequency
    const frequency: Record<string, number> = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    // Return top keywords
    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);
  }

  /**
   * Basic sentiment analysis
   */
  private analyzeSentiment(content: string): 'positive' | 'neutral' | 'negative' {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'best', 'success', 'improve', 'growth', 'increase', 'benefit'];
    const negativeWords = ['bad', 'poor', 'worst', 'fail', 'problem', 'issue', 'decrease', 'decline', 'loss', 'error'];

    const lowerContent = content.toLowerCase();
    let score = 0;

    positiveWords.forEach(word => {
      if (lowerContent.includes(word)) score += 1;
    });

    negativeWords.forEach(word => {
      if (lowerContent.includes(word)) score -= 1;
    });

    if (score > 0) return 'positive';
    if (score < 0) return 'negative';
    return 'neutral';
  }

  /**
   * Extract text from HTML element
   */
  private extractText(element: HTMLElement): string {
    return element.textContent?.trim() || '';
  }

  /**
   * Count words in text
   */
  private countWords(text: string): number {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }
}

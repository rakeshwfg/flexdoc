/**
 * AI Layout Optimization Engine
 * Intelligent slide layout and content optimization
 */

import { JSDOM } from 'jsdom';

export interface LayoutAnalysis {
  contentDensity: number;
  visualBalance: number;
  readability: number;
  whiteSpace: number;
  hierarchy: number;
  recommendations: LayoutRecommendation[];
}

export interface LayoutRecommendation {
  type: 'split' | 'merge' | 'reorder' | 'resize' | 'emphasize' | 'simplify';
  priority: 'high' | 'medium' | 'low';
  description: string;
  action: () => void;
}

export interface ContentBlock {
  type: 'text' | 'image' | 'chart' | 'table' | 'list' | 'quote';
  content: any;
  weight: number; // Visual weight (0-1)
  importance: number; // Content importance (0-1)
  position?: { x: number; y: number; w: number; h: number };
}

/**
 * AI-Powered Layout Optimizer
 */
export class AILayoutOptimizer {
  /**
   * Optimize slide layout using AI principles
   */
  static optimizeLayout(
    content: ContentBlock[],
    slideSize: { width: number; height: number }
  ): ContentBlock[] {
    // Analyze current layout
    const analysis = this.analyzeLayout(content, slideSize);
    
    // Apply optimizations based on analysis
    let optimized = [...content];
    
    if (analysis.contentDensity > 0.8) {
      optimized = this.reduceDensity(optimized);
    }
    
    if (analysis.visualBalance < 0.5) {
      optimized = this.improveBalance(optimized, slideSize);
    }
    
    if (analysis.readability < 0.6) {
      optimized = this.enhanceReadability(optimized);
    }
    
    if (analysis.whiteSpace < 0.2) {
      optimized = this.increaseWhiteSpace(optimized);
    }
    
    if (analysis.hierarchy < 0.5) {
      optimized = this.establishHierarchy(optimized);
    }
    
    // Apply golden ratio and rule of thirds
    optimized = this.applyDesignPrinciples(optimized, slideSize);
    
    return optimized;
  }

  /**
   * Analyze layout quality
   */
  private static analyzeLayout(
    content: ContentBlock[],
    slideSize: { width: number; height: number }
  ): LayoutAnalysis {
    const totalArea = slideSize.width * slideSize.height;
    const contentArea = this.calculateContentArea(content);
    const contentDensity = contentArea / totalArea;
    
    const visualBalance = this.calculateVisualBalance(content, slideSize);
    const readability = this.assessReadability(content);
    const whiteSpace = 1 - contentDensity;
    const hierarchy = this.assessHierarchy(content);
    
    const recommendations = this.generateRecommendations({
      contentDensity,
      visualBalance,
      readability,
      whiteSpace,
      hierarchy
    });
    
    return {
      contentDensity,
      visualBalance,
      readability,
      whiteSpace,
      hierarchy,
      recommendations
    };
  }

  /**
   * Calculate total content area
   */
  private static calculateContentArea(content: ContentBlock[]): number {
    return content.reduce((total, block) => {
      if (block.position) {
        return total + (block.position.w * block.position.h);
      }
      // Estimate based on content type
      switch (block.type) {
        case 'text':
          return total + (block.content.length * 0.01); // Rough estimate
        case 'image':
          return total + 4; // Default image area
        case 'chart':
        case 'table':
          return total + 6; // Larger default for complex elements
        default:
          return total + 2;
      }
    }, 0);
  }

  /**
   * Calculate visual balance of layout
   */
  private static calculateVisualBalance(
    content: ContentBlock[],
    slideSize: { width: number; height: number }
  ): number {
    if (content.length === 0) return 1;
    
    // Calculate center of mass for content
    let totalWeight = 0;
    let centerX = 0;
    let centerY = 0;
    
    content.forEach(block => {
      const weight = block.weight || 0.5;
      const pos = block.position || { x: slideSize.width / 2, y: slideSize.height / 2 };
      
      centerX += pos.x * weight;
      centerY += pos.y * weight;
      totalWeight += weight;
    });
    
    if (totalWeight === 0) return 0.5;
    
    centerX /= totalWeight;
    centerY /= totalWeight;
    
    // Calculate distance from ideal center
    const idealX = slideSize.width / 2;
    const idealY = slideSize.height / 2;
    
    const distance = Math.sqrt(
      Math.pow(centerX - idealX, 2) + Math.pow(centerY - idealY, 2)
    );
    
    const maxDistance = Math.sqrt(
      Math.pow(slideSize.width / 2, 2) + Math.pow(slideSize.height / 2, 2)
    );
    
    return 1 - (distance / maxDistance);
  }

  /**
   * Assess readability of content
   */
  private static assessReadability(content: ContentBlock[]): number {
    let totalScore = 0;
    let textBlocks = 0;
    
    content.forEach(block => {
      if (block.type === 'text') {
        textBlocks++;
        const text = block.content;
        
        // Check text length
        const lengthScore = text.length < 50 ? 1 : 
                           text.length < 100 ? 0.8 :
                           text.length < 200 ? 0.6 :
                           text.length < 400 ? 0.4 : 0.2;
        
        // Check sentence complexity (simplified)
        const sentences = text.split(/[.!?]/).length;
        const avgSentenceLength = text.length / Math.max(sentences, 1);
        const complexityScore = avgSentenceLength < 15 ? 1 :
                               avgSentenceLength < 25 ? 0.8 :
                               avgSentenceLength < 35 ? 0.6 : 0.4;
        
        totalScore += (lengthScore + complexityScore) / 2;
      }
    });
    
    return textBlocks > 0 ? totalScore / textBlocks : 0.8;
  }

  /**
   * Assess visual hierarchy
   */
  private static assessHierarchy(content: ContentBlock[]): number {
    if (content.length < 2) return 1;
    
    // Check if there's clear importance variation
    const importanceValues = content.map(b => b.importance);
    const uniqueImportance = new Set(importanceValues).size;
    
    // More variation in importance = better hierarchy
    return Math.min(uniqueImportance / content.length, 1);
  }

  /**
   * Generate layout recommendations
   */
  private static generateRecommendations(analysis: any): LayoutRecommendation[] {
    const recommendations: LayoutRecommendation[] = [];
    
    if (analysis.contentDensity > 0.8) {
      recommendations.push({
        type: 'split',
        priority: 'high',
        description: 'Content is too dense. Consider splitting into multiple slides.',
        action: () => {}
      });
    }
    
    if (analysis.visualBalance < 0.5) {
      recommendations.push({
        type: 'reorder',
        priority: 'medium',
        description: 'Layout is unbalanced. Redistribute content for better visual flow.',
        action: () => {}
      });
    }
    
    if (analysis.readability < 0.6) {
      recommendations.push({
        type: 'simplify',
        priority: 'high',
        description: 'Text is too complex. Simplify and use bullet points.',
        action: () => {}
      });
    }
    
    if (analysis.whiteSpace < 0.2) {
      recommendations.push({
        type: 'resize',
        priority: 'medium',
        description: 'Not enough white space. Reduce content size.',
        action: () => {}
      });
    }
    
    return recommendations;
  }

  /**
   * Reduce content density
   */
  private static reduceDensity(content: ContentBlock[]): ContentBlock[] {
    return content.map(block => {
      if (block.type === 'text' && block.content.length > 100) {
        // Summarize long text
        return {
          ...block,
          content: this.summarizeText(block.content)
        };
      }
      if (block.position) {
        // Reduce size slightly
        return {
          ...block,
          position: {
            ...block.position,
            w: block.position.w * 0.9,
            h: block.position.h * 0.9
          }
        };
      }
      return block;
    });
  }

  /**
   * Improve visual balance
   */
  private static improveBalance(
    content: ContentBlock[],
    slideSize: { width: number; height: number }
  ): ContentBlock[] {
    // Sort by visual weight
    const sorted = [...content].sort((a, b) => (b.weight || 0.5) - (a.weight || 0.5));
    
    // Apply symmetrical or asymmetrical balance
    const useSymmetry = sorted.length % 2 === 0;
    
    if (useSymmetry) {
      // Arrange in pairs
      for (let i = 0; i < sorted.length; i += 2) {
        if (i + 1 < sorted.length) {
          sorted[i].position = {
            x: slideSize.width * 0.25,
            y: (i / 2 + 1) * (slideSize.height / (sorted.length / 2 + 1)),
            w: slideSize.width * 0.2,
            h: slideSize.height * 0.2
          };
          sorted[i + 1].position = {
            x: slideSize.width * 0.75,
            y: (i / 2 + 1) * (slideSize.height / (sorted.length / 2 + 1)),
            w: slideSize.width * 0.2,
            h: slideSize.height * 0.2
          };
        }
      }
    } else {
      // Asymmetrical balance with golden ratio
      const phi = 1.618;
      sorted.forEach((block, i) => {
        const row = Math.floor(i / 2);
        const col = i % 2;
        
        block.position = {
          x: col === 0 ? slideSize.width / (phi * 2) : slideSize.width * (1 - 1 / (phi * 2)),
          y: (row + 1) * (slideSize.height / (Math.ceil(sorted.length / 2) + 1)),
          w: slideSize.width / (phi * 2) * 0.8,
          h: slideSize.height / (Math.ceil(sorted.length / 2) + 1) * 0.8
        };
      });
    }
    
    return sorted;
  }

  /**
   * Enhance readability
   */
  private static enhanceReadability(content: ContentBlock[]): ContentBlock[] {
    return content.map(block => {
      if (block.type === 'text') {
        const enhanced = this.enhanceText(block.content);
        return { ...block, content: enhanced };
      }
      return block;
    });
  }

  /**
   * Enhance text content
   */
  private static enhanceText(text: string): string {
    // Convert long paragraphs to bullet points
    const sentences = text.split(/[.!?]/).filter(s => s.trim());
    
    if (sentences.length > 3) {
      // Convert to bullet points
      return sentences
        .slice(0, 5) // Limit to 5 points
        .map(s => `• ${s.trim()}`)
        .join('\n');
    }
    
    // Simplify complex sentences
    return sentences
      .map(s => {
        const words = s.split(' ');
        if (words.length > 20) {
          // Break into shorter sentences
          const mid = Math.floor(words.length / 2);
          return words.slice(0, mid).join(' ') + '.\n' + words.slice(mid).join(' ');
        }
        return s;
      })
      .join('. ');
  }

  /**
   * Increase white space
   */
  private static increaseWhiteSpace(content: ContentBlock[]): ContentBlock[] {
    const margin = 0.1; // 10% margin
    
    return content.map(block => {
      if (block.position) {
        return {
          ...block,
          position: {
            x: block.position.x + block.position.w * margin,
            y: block.position.y + block.position.h * margin,
            w: block.position.w * (1 - 2 * margin),
            h: block.position.h * (1 - 2 * margin)
          }
        };
      }
      return block;
    });
  }

  /**
   * Establish visual hierarchy
   */
  private static establishHierarchy(content: ContentBlock[]): ContentBlock[] {
    // Sort by importance
    const sorted = [...content].sort((a, b) => (b.importance || 0.5) - (a.importance || 0.5));
    
    // Assign sizes based on importance
    return sorted.map((block, index) => {
      const scale = 1 - (index * 0.1); // Gradually decrease size
      
      if (block.position) {
        return {
          ...block,
          position: {
            ...block.position,
            w: block.position.w * scale,
            h: block.position.h * scale
          }
        };
      }
      
      return block;
    });
  }

  /**
   * Apply design principles (golden ratio, rule of thirds)
   */
  private static applyDesignPrinciples(
    content: ContentBlock[],
    slideSize: { width: number; height: number }
  ): ContentBlock[] {
    const phi = 1.618;
    const thirdW = slideSize.width / 3;
    const thirdH = slideSize.height / 3;
    
    // Define key positions based on rule of thirds
    const keyPositions = [
      { x: thirdW, y: thirdH },           // Top-left intersection
      { x: thirdW * 2, y: thirdH },       // Top-right intersection
      { x: thirdW, y: thirdH * 2 },       // Bottom-left intersection
      { x: thirdW * 2, y: thirdH * 2 },   // Bottom-right intersection
      { x: slideSize.width / 2, y: slideSize.height / phi }, // Golden ratio point
    ];
    
    // Place most important content at key positions
    const sorted = [...content].sort((a, b) => (b.importance || 0.5) - (a.importance || 0.5));
    
    sorted.forEach((block, index) => {
      if (index < keyPositions.length) {
        const pos = keyPositions[index];
        block.position = {
          x: pos.x - (block.position?.w || 100) / 2,
          y: pos.y - (block.position?.h || 100) / 2,
          w: block.position?.w || slideSize.width * 0.25,
          h: block.position?.h || slideSize.height * 0.25
        };
      }
    });
    
    return sorted;
  }

  /**
   * Summarize text content
   */
  private static summarizeText(text: string): string {
    // Simple extractive summarization
    const sentences = text.split(/[.!?]/).filter(s => s.trim());
    
    if (sentences.length <= 3) return text;
    
    // Score sentences based on word frequency
    const words = text.toLowerCase().split(/\s+/);
    const frequency: Record<string, number> = {};
    
    words.forEach(word => {
      if (word.length > 4) { // Ignore short words
        frequency[word] = (frequency[word] || 0) + 1;
      }
    });
    
    // Score each sentence
    const scored = sentences.map(sentence => {
      const sentWords = sentence.toLowerCase().split(/\s+/);
      const score = sentWords.reduce((sum, word) => 
        sum + (frequency[word] || 0), 0
      ) / sentWords.length;
      
      return { sentence, score };
    });
    
    // Return top 3 sentences
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(s => s.sentence.trim())
      .join('. ') + '.';
  }
}

/**
 * Content Intelligence Engine
 * Smart content analysis and optimization
 */
export class ContentIntelligence {
  /**
   * Analyze content for presentation suitability
   */
  static analyzeContent(html: string): ContentAnalysis {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    return {
      structure: this.analyzeStructure(document),
      complexity: this.calculateComplexity(document),
      topics: this.extractTopics(document),
      sentiment: this.analyzeSentiment(document),
      keyPoints: this.extractKeyPoints(document),
      suggestions: this.generateSuggestions(document)
    };
  }

  /**
   * Analyze document structure
   */
  private static analyzeStructure(document: Document): any {
    const headings = {
      h1: document.querySelectorAll('h1').length,
      h2: document.querySelectorAll('h2').length,
      h3: document.querySelectorAll('h3').length,
      total: 0
    };
    headings.total = headings.h1 + headings.h2 + headings.h3;

    return {
      headings,
      paragraphs: document.querySelectorAll('p').length,
      lists: document.querySelectorAll('ul, ol').length,
      tables: document.querySelectorAll('table').length,
      images: document.querySelectorAll('img').length,
      links: document.querySelectorAll('a').length,
      sections: this.identifySections(document)
    };
  }

  /**
   * Calculate content complexity
   */
  private static calculateComplexity(document: Document): number {
    const text = document.body.textContent || '';
    const words = text.split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).length;
    const paragraphs = document.querySelectorAll('p').length;
    
    // Average sentence length
    const avgSentenceLength = words / Math.max(sentences, 1);
    
    // Lexical diversity (unique words / total words)
    const uniqueWords = new Set(text.toLowerCase().split(/\s+/)).size;
    const lexicalDiversity = uniqueWords / Math.max(words, 1);
    
    // Structure complexity
    const structureComplexity = 
      (document.querySelectorAll('table').length * 2 +
       document.querySelectorAll('ul, ol').length +
       document.querySelectorAll('blockquote').length) / 10;
    
    // Combined complexity score (0-1)
    const complexity = Math.min(
      (avgSentenceLength / 30) * 0.3 +
      (1 - lexicalDiversity) * 0.3 +
      structureComplexity * 0.4,
      1
    );
    
    return complexity;
  }

  /**
   * Extract main topics using TF-IDF
   */
  private static extractTopics(document: Document): string[] {
    const text = document.body.textContent || '';
    const words = text.toLowerCase().split(/\s+/);
    
    // Remove common stop words
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be',
      'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
      'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this',
      'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they'
    ]);
    
    // Calculate term frequency
    const termFreq: Record<string, number> = {};
    words.forEach(word => {
      if (!stopWords.has(word) && word.length > 3) {
        termFreq[word] = (termFreq[word] || 0) + 1;
      }
    });
    
    // Sort by frequency and return top topics
    return Object.entries(termFreq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }

  /**
   * Analyze sentiment of content
   */
  private static analyzeSentiment(document: Document): string {
    const text = (document.body.textContent || '').toLowerCase();
    
    // Simple sentiment word lists
    const positive = [
      'excellent', 'good', 'nice', 'wonderful', 'best', 'great',
      'love', 'perfect', 'happy', 'beautiful', 'amazing', 'successful',
      'positive', 'fortunate', 'correct', 'superior', 'benefit', 'advantage'
    ];
    
    const negative = [
      'bad', 'worst', 'terrible', 'poor', 'negative', 'wrong',
      'hate', 'ugly', 'fail', 'unfortunate', 'incorrect', 'inferior',
      'disadvantage', 'problem', 'issue', 'difficult', 'hard', 'complex'
    ];
    
    let score = 0;
    positive.forEach(word => {
      score += (text.match(new RegExp(word, 'g')) || []).length;
    });
    negative.forEach(word => {
      score -= (text.match(new RegExp(word, 'g')) || []).length;
    });
    
    if (score > 5) return 'positive';
    if (score < -5) return 'negative';
    return 'neutral';
  }

  /**
   * Extract key points from content
   */
  private static extractKeyPoints(document: Document): string[] {
    const keyPoints: string[] = [];
    
    // Extract from headings
    document.querySelectorAll('h1, h2, h3').forEach(heading => {
      keyPoints.push(heading.textContent?.trim() || '');
    });
    
    // Extract from emphasized text
    document.querySelectorAll('strong, em, b, i').forEach(element => {
      const text = element.textContent?.trim() || '';
      if (text.length > 10 && text.length < 100) {
        keyPoints.push(text);
      }
    });
    
    // Extract from first sentence of paragraphs
    document.querySelectorAll('p').forEach(p => {
      const firstSentence = p.textContent?.split(/[.!?]/)[0]?.trim();
      if (firstSentence && firstSentence.length > 20 && firstSentence.length < 150) {
        keyPoints.push(firstSentence);
      }
    });
    
    // Remove duplicates and return
    return [...new Set(keyPoints)].slice(0, 15);
  }

  /**
   * Generate content improvement suggestions
   */
  private static generateSuggestions(document: Document): string[] {
    const suggestions: string[] = [];
    const text = document.body.textContent || '';
    const wordCount = text.split(/\s+/).length;
    
    // Check content length
    if (wordCount > 1000) {
      suggestions.push('Consider breaking content into multiple slides for better engagement');
    }
    
    // Check paragraph length
    const longParagraphs = Array.from(document.querySelectorAll('p'))
      .filter(p => (p.textContent?.length || 0) > 300);
    if (longParagraphs.length > 0) {
      suggestions.push('Break long paragraphs into bullet points for better readability');
    }
    
    // Check for tables
    const tables = document.querySelectorAll('table');
    if (tables.length > 0) {
      suggestions.push('Consider converting tables to charts or infographics for visual impact');
    }
    
    // Check for lists
    const lists = document.querySelectorAll('ul, ol');
    if (lists.length === 0 && wordCount > 200) {
      suggestions.push('Add bullet points to structure information better');
    }
    
    // Check for images
    const images = document.querySelectorAll('img');
    if (images.length === 0) {
      suggestions.push('Add relevant images to make content more engaging');
    }
    
    // Check heading structure
    const h1Count = document.querySelectorAll('h1').length;
    const h2Count = document.querySelectorAll('h2').length;
    if (h1Count === 0) {
      suggestions.push('Add a clear main heading (H1) to establish hierarchy');
    }
    if (h2Count === 0 && wordCount > 300) {
      suggestions.push('Add subheadings (H2) to organize content into sections');
    }
    
    return suggestions;
  }

  /**
   * Identify logical sections in document
   */
  private static identifySections(document: Document): any[] {
    const sections: any[] = [];
    let currentSection: any = null;
    
    const walker = document.createTreeWalker(
      document.body,
      1, // NodeFilter.SHOW_ELEMENT
      null
    );
    
    let node;
    while (node = walker.nextNode()) {
      if (node.nodeName.match(/^H[1-6]$/)) {
        // New section starts with heading
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          title: node.textContent,
          level: parseInt(node.nodeName[1]),
          content: [],
          elements: 0
        };
      } else if (currentSection && node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE') {
        currentSection.content.push(node.nodeName);
        currentSection.elements++;
      }
    }
    
    if (currentSection) {
      sections.push(currentSection);
    }
    
    return sections;
  }
}

/**
 * Smart Split Engine
 * Intelligently splits content into multiple slides
 */
export class SmartSplitEngine {
  /**
   * Split content into optimal slides
   */
  static splitContent(
    html: string,
    maxSlidesHint?: number
  ): Array<{ title: string; content: string; type: string }> {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Analyze content structure
    const sections = this.extractSections(document);
    
    // Determine optimal number of slides
    const optimalSlideCount = this.calculateOptimalSlideCount(
      sections,
      maxSlidesHint
    );
    
    // Split content
    const slides = this.performSplit(sections, optimalSlideCount);
    
    // Optimize each slide
    return slides.map(slide => this.optimizeSlide(slide));
  }

  /**
   * Extract sections from document
   */
  private static extractSections(document: Document): any[] {
    const sections: any[] = [];
    
    // Try semantic sections first
    const semanticSections = document.querySelectorAll('section, article');
    if (semanticSections.length > 0) {
      semanticSections.forEach(section => {
        sections.push({
          element: section,
          content: section.innerHTML,
          text: section.textContent,
          wordCount: (section.textContent?.split(/\s+/).length || 0),
          complexity: this.calculateSectionComplexity(section),
          type: this.detectSectionType(section)
        });
      });
      return sections;
    }
    
    // Fall back to heading-based splitting
    const headings = document.querySelectorAll('h1, h2, h3');
    let currentSection: any = {
      heading: null,
      content: [],
      text: '',
      wordCount: 0
    };
    
    const walker = document.createTreeWalker(
      document.body,
      1, // NodeFilter.SHOW_ELEMENT
      null
    );
    
    let node;
    while (node = walker.nextNode()) {
      if (node.nodeName.match(/^H[1-3]$/)) {
        if (currentSection.content.length > 0) {
          sections.push(this.processSectionData(currentSection));
        }
        currentSection = {
          heading: node,
          content: [],
          text: '',
          wordCount: 0
        };
      } else {
        currentSection.content.push(node);
        currentSection.text += node.textContent || '';
        currentSection.wordCount = currentSection.text.split(/\s+/).length;
      }
    }
    
    if (currentSection.content.length > 0) {
      sections.push(this.processSectionData(currentSection));
    }
    
    return sections;
  }

  /**
   * Calculate optimal number of slides
   */
  private static calculateOptimalSlideCount(
    sections: any[],
    maxSlidesHint?: number
  ): number {
    const totalWords = sections.reduce((sum, s) => sum + s.wordCount, 0);
    const avgComplexity = sections.reduce((sum, s) => sum + s.complexity, 0) / sections.length;
    
    // Base calculation: ~100 words per slide for simple content
    // ~50 words per slide for complex content
    const wordsPerSlide = 100 - (avgComplexity * 50);
    let optimal = Math.ceil(totalWords / wordsPerSlide);
    
    // Adjust based on section count
    optimal = Math.max(optimal, Math.ceil(sections.length / 2));
    
    // Apply hint if provided
    if (maxSlidesHint) {
      optimal = Math.min(optimal, maxSlidesHint);
    }
    
    // Practical limits
    return Math.max(1, Math.min(optimal, 50));
  }

  /**
   * Perform the actual split
   */
  private static performSplit(
    sections: any[],
    targetSlideCount: number
  ): any[] {
    if (sections.length === 0) return [];
    
    // If we have fewer sections than target slides, split large sections
    if (sections.length < targetSlideCount) {
      return this.splitLargeSections(sections, targetSlideCount);
    }
    
    // If we have more sections than target slides, merge small sections
    if (sections.length > targetSlideCount) {
      return this.mergeSmallSections(sections, targetSlideCount);
    }
    
    // Perfect match
    return sections;
  }

  /**
   * Split large sections into multiple slides
   */
  private static splitLargeSections(sections: any[], target: number): any[] {
    const result: any[] = [];
    const splitsNeeded = target - sections.length;
    
    // Sort by word count to find largest sections
    const sorted = [...sections].sort((a, b) => b.wordCount - a.wordCount);
    const toSplit = sorted.slice(0, splitsNeeded + 1);
    
    sections.forEach(section => {
      if (toSplit.includes(section) && section.wordCount > 100) {
        // Split this section
        const parts = this.splitSection(section, 2);
        result.push(...parts);
      } else {
        result.push(section);
      }
    });
    
    return result;
  }

  /**
   * Merge small sections into fewer slides
   */
  private static mergeSmallSections(sections: any[], target: number): any[] {
    const result: any[] = [];
    const sectionsPerSlide = Math.ceil(sections.length / target);
    
    for (let i = 0; i < sections.length; i += sectionsPerSlide) {
      const group = sections.slice(i, i + sectionsPerSlide);
      
      if (group.length === 1) {
        result.push(group[0]);
      } else {
        // Merge sections
        result.push({
          heading: group[0].heading,
          content: group.flatMap(s => s.content),
          text: group.map(s => s.text).join(' '),
          wordCount: group.reduce((sum, s) => sum + s.wordCount, 0),
          complexity: group.reduce((sum, s) => sum + s.complexity, 0) / group.length,
          type: 'merged'
        });
      }
    }
    
    return result;
  }

  /**
   * Split a single section into multiple parts
   */
  private static splitSection(section: any, parts: number): any[] {
    const result: any[] = [];
    const contentPerPart = Math.ceil(section.content.length / parts);
    
    for (let i = 0; i < parts; i++) {
      const start = i * contentPerPart;
      const end = Math.min(start + contentPerPart, section.content.length);
      const partContent = section.content.slice(start, end);
      
      result.push({
        heading: i === 0 ? section.heading : null,
        content: partContent,
        text: partContent.map((el: any) => el.textContent || '').join(' '),
        wordCount: partContent.reduce(
          (sum: number, el: any) => sum + (el.textContent?.split(/\s+/).length || 0),
          0
        ),
        complexity: section.complexity,
        type: section.type
      });
    }
    
    return result;
  }

  /**
   * Optimize individual slide
   */
  private static optimizeSlide(slide: any): any {
    return {
      title: this.extractTitle(slide),
      content: this.optimizeContent(slide),
      type: slide.type || 'content'
    };
  }

  /**
   * Extract title from slide
   */
  private static extractTitle(slide: any): string {
    if (slide.heading) {
      return slide.heading.textContent || 'Untitled';
    }
    
    // Try to extract from content
    const firstLine = slide.text.split(/[.\n]/)[0];
    if (firstLine && firstLine.length < 100) {
      return firstLine;
    }
    
    return 'Slide';
  }

  /**
   * Optimize slide content
   */
  private static optimizeContent(slide: any): string {
    // Convert to clean HTML
    let html = '';
    
    if (slide.content && Array.isArray(slide.content)) {
      slide.content.forEach((element: any) => {
        if (element.outerHTML) {
          html += element.outerHTML;
        } else if (element.textContent) {
          html += `<p>${element.textContent}</p>`;
        }
      });
    } else if (slide.text) {
      // Convert text to HTML with proper formatting
      const sentences = slide.text.split(/[.!?]/);
      if (sentences.length > 3) {
        html = '<ul>' + sentences
          .filter((s: string) => s.trim())
          .slice(0, 5)
          .map((s: string) => `<li>${s.trim()}</li>`)
          .join('') + '</ul>';
      } else {
        html = `<p>${slide.text}</p>`;
      }
    }
    
    return html;
  }

  // Helper methods
  private static calculateSectionComplexity(section: Element): number {
    const tables = section.querySelectorAll('table').length;
    const lists = section.querySelectorAll('ul, ol').length;
    const images = section.querySelectorAll('img').length;
    const code = section.querySelectorAll('pre, code').length;
    
    return Math.min(
      (tables * 0.3 + lists * 0.1 + images * 0.2 + code * 0.4),
      1
    );
  }

  private static detectSectionType(section: Element): string {
    if (section.querySelector('h1') && !section.querySelector('p')) return 'title';
    if (section.querySelectorAll('img').length > 2) return 'gallery';
    if (section.querySelector('table')) return 'data';
    if (section.querySelector('blockquote')) return 'quote';
    if (section.querySelectorAll('li').length > 5) return 'list';
    return 'content';
  }

  private static processSectionData(section: any): any {
    return {
      ...section,
      complexity: this.calculateSectionComplexity(section.heading?.parentElement || section.content[0]),
      type: this.detectSectionType(section.heading?.parentElement || section.content[0])
    };
  }
}

export interface ContentAnalysis {
  structure: any;
  complexity: number;
  topics: string[];
  sentiment: string;
  keyPoints: string[];
  suggestions: string[];
}

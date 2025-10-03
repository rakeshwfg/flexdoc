/**
 * Font Pairings for Theme System
 * Curated font combinations that work well together
 */

import { FontPairing } from './theme-types';

export class FontPairings {
  /**
   * Get all font pairings
   */
  static getAll(): FontPairing[] {
    return [
      // Modern & Clean
      {
        name: 'Modern Professional',
        heading: 'Montserrat',
        body: 'Open Sans',
        style: 'modern',
        recommendedFor: ['business', 'corporate', 'presentations'],
      },
      {
        name: 'Clean & Minimal',
        heading: 'Poppins',
        body: 'Inter',
        style: 'modern',
        recommendedFor: ['tech', 'startup', 'portfolio'],
      },
      {
        name: 'Tech Forward',
        heading: 'IBM Plex Sans',
        body: 'IBM Plex Sans',
        style: 'technical',
        recommendedFor: ['technology', 'documentation', 'engineering'],
      },

      // Classic & Elegant
      {
        name: 'Classic Elegance',
        heading: 'Playfair Display',
        body: 'Lato',
        style: 'elegant',
        recommendedFor: ['luxury', 'fashion', 'editorial'],
      },
      {
        name: 'Timeless Serif',
        heading: 'Merriweather',
        body: 'Open Sans',
        style: 'classic',
        recommendedFor: ['publishing', 'academic', 'reports'],
      },
      {
        name: 'Editorial',
        heading: 'Lora',
        body: 'Source Sans Pro',
        style: 'classic',
        recommendedFor: ['blogs', 'magazines', 'articles'],
      },

      // Bold & Impactful
      {
        name: 'Bold Statement',
        heading: 'Oswald',
        body: 'Roboto',
        style: 'professional',
        recommendedFor: ['marketing', 'advertising', 'impact'],
      },
      {
        name: 'Strong & Direct',
        heading: 'Bebas Neue',
        body: 'Raleway',
        style: 'modern',
        recommendedFor: ['sports', 'events', 'announcements'],
      },

      // Playful & Creative
      {
        name: 'Friendly & Approachable',
        heading: 'Quicksand',
        body: 'Nunito',
        style: 'playful',
        recommendedFor: ['education', 'children', 'community'],
      },
      {
        name: 'Creative Flow',
        heading: 'Comfortaa',
        body: 'Karla',
        style: 'playful',
        recommendedFor: ['creative', 'design', 'art'],
      },

      // Professional & Corporate
      {
        name: 'Corporate Standard',
        heading: 'Arial',
        body: 'Arial',
        style: 'professional',
        recommendedFor: ['corporate', 'finance', 'legal'],
      },
      {
        name: 'Business Classic',
        heading: 'Georgia',
        body: 'Verdana',
        style: 'classic',
        recommendedFor: ['business', 'consulting', 'formal'],
      },
      {
        name: 'Executive',
        heading: 'Times New Roman',
        body: 'Calibri',
        style: 'classic',
        recommendedFor: ['executive', 'formal', 'traditional'],
      },

      // Technical & Code
      {
        name: 'Developer Docs',
        heading: 'Fira Sans',
        body: 'Fira Sans',
        style: 'technical',
        recommendedFor: ['documentation', 'technical', 'coding'],
      },
      {
        name: 'Code & Content',
        heading: 'Source Code Pro',
        body: 'Source Sans Pro',
        style: 'technical',
        recommendedFor: ['programming', 'technical', 'api-docs'],
      },

      // Safe Fallbacks (System Fonts)
      {
        name: 'System Default',
        heading: 'Helvetica',
        body: 'Helvetica',
        style: 'modern',
        recommendedFor: ['universal', 'cross-platform', 'safe'],
      },
      {
        name: 'Cross-Platform',
        heading: 'Segoe UI',
        body: 'Segoe UI',
        style: 'modern',
        recommendedFor: ['windows', 'microsoft', 'standard'],
      },
    ];
  }

  /**
   * Get font pairing by name
   */
  static getByName(name: string): FontPairing | undefined {
    return this.getAll().find(p => p.name === name);
  }

  /**
   * Get font pairings by style
   */
  static getByStyle(style: FontPairing['style']): FontPairing[] {
    return this.getAll().filter(p => p.style === style);
  }

  /**
   * Get recommended font pairings for a use case
   */
  static getRecommended(useCase: string): FontPairing[] {
    return this.getAll().filter(p =>
      p.recommendedFor.some(r => r.toLowerCase().includes(useCase.toLowerCase()))
    );
  }

  /**
   * Get a random font pairing
   */
  static getRandom(): FontPairing {
    const pairings = this.getAll();
    return pairings[Math.floor(Math.random() * pairings.length)];
  }

  /**
   * Get font pairing for a specific theme style
   */
  static getForTheme(themeStyle: 'modern' | 'classic' | 'elegant' | 'playful' | 'professional' | 'technical'): FontPairing {
    const pairings = this.getByStyle(themeStyle);
    return pairings[0] || this.getAll()[0];
  }
}

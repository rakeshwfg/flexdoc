/**
 * Theme Presets
 * Collection of professional, pre-configured themes
 */

import { ThemePreset, Theme } from './theme-types';
import { ThemeBuilder } from './theme-builder';

export class ThemePresets {
  /**
   * Get all available theme presets
   */
  static getAll(): ThemePreset[] {
    return [
      // Business & Corporate
      this.createCorporateBlue(),
      this.createProfessionalGray(),
      this.createExecutiveGold(),
      this.createFinancialGreen(),
      this.createConsultingNavy(),

      // Tech & Startup
      this.createTechPurple(),
      this.createStartupOrange(),
      this.createInnovationTeal(),
      this.createDigitalCyan(),
      this.createSaasModern(),

      // Creative & Design
      this.createCreativePink(),
      this.createDesignerVibrant(),
      this.createArtisticRainbow(),
      this.createModernMinimal(),
      this.createBoldImpact(),

      // Education & Academic
      this.createAcademicSerif(),
      this.createEducationFriendly(),
      this.createScientificClean(),

      // Special Purpose
      this.createDarkMode(),
      this.createHighContrast(),
      this.createPrintOptimized(),
      this.createElegantLuxury(),
      this.createPlayfulFun(),
      this.createNatureGreen(),
      this.createOceanBlue(),
    ];
  }

  /**
   * Get theme preset by ID
   */
  static getById(id: string): Theme | undefined {
    const preset = this.getAll().find(p => p.id === id);
    return preset?.theme;
  }

  /**
   * Get presets by category
   */
  static getByCategory(category: ThemePreset['category']): ThemePreset[] {
    return this.getAll().filter(p => p.category === category);
  }

  /**
   * Get presets by tag
   */
  static getByTag(tag: string): ThemePreset[] {
    return this.getAll().filter(p => p.tags.includes(tag));
  }

  // === Business & Corporate Themes ===

  private static createCorporateBlue(): ThemePreset {
    const theme = new ThemeBuilder('Corporate Blue')
      .setDescription('Professional corporate theme with trustworthy blue tones')
      .setPrimaryColor('#1E40AF')
      .setFontPairing('Modern Professional')
      .setShadows(true, 0.2)
      .setGradients(false)
      .build();

    return {
      id: 'corporate-blue',
      name: 'Corporate Blue',
      description: 'Professional and trustworthy for business presentations',
      category: 'business',
      tags: ['corporate', 'professional', 'blue', 'business'],
      theme,
    };
  }

  private static createProfessionalGray(): ThemePreset {
    const theme = new ThemeBuilder('Professional Gray')
      .setDescription('Elegant gray theme for sophisticated presentations')
      .setPrimaryColor('#64748B')
      .setFontPairing('Business Classic')
      .setShadows(true, 0.15)
      .build();

    return {
      id: 'professional-gray',
      name: 'Professional Gray',
      description: 'Sophisticated and neutral for any business context',
      category: 'business',
      tags: ['professional', 'gray', 'neutral', 'elegant'],
      theme,
    };
  }

  private static createExecutiveGold(): ThemePreset {
    const theme = new ThemeBuilder('Executive Gold')
      .setDescription('Premium theme with gold accents for executive presentations')
      .setColors({
        primary: '#B45309',
        secondary: '#78350F',
        accent: '#FCD34D',
        background: '#FFFFFF',
        surface: '#FFFBEB',
        text: '#1F2937',
        textSecondary: '#6B7280',
        border: '#FDE68A',
      })
      .setFontPairing('Executive')
      .setShadows(true, 0.3)
      .build();

    return {
      id: 'executive-gold',
      name: 'Executive Gold',
      description: 'Premium and luxurious for high-level presentations',
      category: 'business',
      tags: ['executive', 'premium', 'gold', 'luxury'],
      theme,
    };
  }

  private static createFinancialGreen(): ThemePreset {
    const theme = new ThemeBuilder('Financial Green')
      .setDescription('Financial sector theme with growth-oriented green')
      .setPrimaryColor('#059669')
      .setFontPairing('Corporate Standard')
      .setShadows(true)
      .build();

    return {
      id: 'financial-green',
      name: 'Financial Green',
      description: 'Growth and prosperity for financial presentations',
      category: 'business',
      tags: ['financial', 'green', 'growth', 'money'],
      theme,
    };
  }

  private static createConsultingNavy(): ThemePreset {
    const theme = new ThemeBuilder('Consulting Navy')
      .setDescription('Deep navy theme for consulting presentations')
      .setPrimaryColor('#1E3A8A')
      .setFontPairing('Modern Professional')
      .setShadows(true)
      .build();

    return {
      id: 'consulting-navy',
      name: 'Consulting Navy',
      description: 'Authority and expertise for consulting firms',
      category: 'business',
      tags: ['consulting', 'navy', 'professional', 'authority'],
      theme,
    };
  }

  // === Tech & Startup Themes ===

  private static createTechPurple(): ThemePreset {
    const theme = new ThemeBuilder('Tech Purple')
      .setDescription('Modern tech theme with purple accent')
      .setPrimaryColor('#7C3AED')
      .setFontPairing('Tech Forward')
      .setShadows(true)
      .setGradients(true)
      .build();

    return {
      id: 'tech-purple',
      name: 'Tech Purple',
      description: 'Modern and innovative for tech companies',
      category: 'tech',
      tags: ['tech', 'purple', 'modern', 'innovation'],
      theme,
    };
  }

  private static createStartupOrange(): ThemePreset {
    const theme = new ThemeBuilder('Startup Orange')
      .setDescription('Energetic startup theme with orange highlights')
      .setPrimaryColor('#EA580C')
      .setFontPairing('Clean & Minimal')
      .setShadows(true)
      .setGradients(true)
      .setAnimations('energetic')
      .build();

    return {
      id: 'startup-orange',
      name: 'Startup Orange',
      description: 'Energy and enthusiasm for startup pitches',
      category: 'tech',
      tags: ['startup', 'orange', 'energy', 'pitch'],
      theme,
    };
  }

  private static createInnovationTeal(): ThemePreset {
    const theme = new ThemeBuilder('Innovation Teal')
      .setDescription('Fresh teal theme for innovative products')
      .setPrimaryColor('#0D9488')
      .setFontPairing('Modern Professional')
      .setShadows(true)
      .setGradients(true)
      .build();

    return {
      id: 'innovation-teal',
      name: 'Innovation Teal',
      description: 'Fresh and forward-thinking for innovation',
      category: 'tech',
      tags: ['innovation', 'teal', 'fresh', 'modern'],
      theme,
    };
  }

  private static createDigitalCyan(): ThemePreset {
    const theme = new ThemeBuilder('Digital Cyan')
      .setDescription('Digital-first theme with cyan accents')
      .setPrimaryColor('#0891B2')
      .setFontPairing('Tech Forward')
      .setShadows(true)
      .setGradients(true)
      .build();

    return {
      id: 'digital-cyan',
      name: 'Digital Cyan',
      description: 'Digital and tech-focused presentations',
      category: 'tech',
      tags: ['digital', 'cyan', 'tech', 'modern'],
      theme,
    };
  }

  private static createSaasModern(): ThemePreset {
    const theme = new ThemeBuilder('SaaS Modern')
      .setDescription('Clean SaaS theme with modern aesthetics')
      .setPrimaryColor('#6366F1')
      .setFontPairing('Clean & Minimal')
      .setShadows(true, 0.25)
      .setGradients(true)
      .build();

    return {
      id: 'saas-modern',
      name: 'SaaS Modern',
      description: 'Clean and modern for SaaS products',
      category: 'tech',
      tags: ['saas', 'modern', 'clean', 'software'],
      theme,
    };
  }

  // === Creative & Design Themes ===

  private static createCreativePink(): ThemePreset {
    const theme = new ThemeBuilder('Creative Pink')
      .setDescription('Vibrant pink theme for creative projects')
      .setPrimaryColor('#DB2777')
      .setFontPairing('Creative Flow')
      .setShadows(true)
      .setGradients(true)
      .setAnimations('energetic')
      .build();

    return {
      id: 'creative-pink',
      name: 'Creative Pink',
      description: 'Bold and creative for design projects',
      category: 'creative',
      tags: ['creative', 'pink', 'bold', 'design'],
      theme,
    };
  }

  private static createDesignerVibrant(): ThemePreset {
    const theme = new ThemeBuilder('Designer Vibrant')
      .setDescription('Multi-color vibrant theme for designers')
      .setColorHarmony('#EC4899', 'triadic')
      .setFontPairing('Creative Flow')
      .setShadows(true)
      .setGradients(true)
      .build();

    return {
      id: 'designer-vibrant',
      name: 'Designer Vibrant',
      description: 'Colorful and expressive for designers',
      category: 'creative',
      tags: ['designer', 'vibrant', 'colorful', 'expressive'],
      theme,
    };
  }

  private static createArtisticRainbow(): ThemePreset {
    const theme = new ThemeBuilder('Artistic Rainbow')
      .setDescription('Rainbow-inspired theme for artistic work')
      .setColors({
        primary: '#F59E0B',
        secondary: '#EC4899',
        tertiary: '#8B5CF6',
        accent: '#10B981',
        background: '#FFFFFF',
        surface: '#F9FAFB',
        text: '#1F2937',
        textSecondary: '#6B7280',
        border: '#E5E7EB',
      })
      .setFontPairing('Creative Flow')
      .setShadows(true)
      .setGradients(true)
      .build();

    return {
      id: 'artistic-rainbow',
      name: 'Artistic Rainbow',
      description: 'Playful and artistic with rainbow colors',
      category: 'creative',
      tags: ['artistic', 'rainbow', 'playful', 'colorful'],
      theme,
    };
  }

  private static createModernMinimal(): ThemePreset {
    const theme = new ThemeBuilder('Modern Minimal')
      .setDescription('Ultra-minimal theme with maximum impact')
      .setColors({
        primary: '#000000',
        secondary: '#374151',
        accent: '#3B82F6',
        background: '#FFFFFF',
        surface: '#F9FAFB',
        text: '#1F2937',
        textSecondary: '#6B7280',
        border: '#E5E7EB',
      })
      .setFontPairing('Clean & Minimal')
      .setShadows(false)
      .setGradients(false)
      .build();

    return {
      id: 'modern-minimal',
      name: 'Modern Minimal',
      description: 'Less is more - minimal and impactful',
      category: 'minimal',
      tags: ['minimal', 'modern', 'clean', 'simple'],
      theme,
    };
  }

  private static createBoldImpact(): ThemePreset {
    const theme = new ThemeBuilder('Bold Impact')
      .setDescription('High-contrast bold theme for maximum impact')
      .setColors({
        primary: '#DC2626',
        secondary: '#991B1B',
        accent: '#FDE047',
        background: '#FFFFFF',
        surface: '#F9FAFB',
        text: '#000000',
        textSecondary: '#374151',
        border: '#E5E7EB',
      })
      .setFontPairing('Bold Statement')
      .setShadows(true, 0.4)
      .build();

    return {
      id: 'bold-impact',
      name: 'Bold Impact',
      description: 'Maximum impact with bold contrasts',
      category: 'bold',
      tags: ['bold', 'impact', 'contrast', 'striking'],
      theme,
    };
  }

  // === Education & Academic Themes ===

  private static createAcademicSerif(): ThemePreset {
    const theme = new ThemeBuilder('Academic Serif')
      .setDescription('Traditional academic theme with serif fonts')
      .setPrimaryColor('#1E40AF')
      .setFontPairing('Timeless Serif')
      .setShadows(false)
      .build();

    return {
      id: 'academic-serif',
      name: 'Academic Serif',
      description: 'Traditional and scholarly for academic work',
      category: 'academic',
      tags: ['academic', 'serif', 'traditional', 'scholarly'],
      theme,
    };
  }

  private static createEducationFriendly(): ThemePreset {
    const theme = new ThemeBuilder('Education Friendly')
      .setDescription('Friendly theme for educational content')
      .setPrimaryColor('#3B82F6')
      .setFontPairing('Friendly & Approachable')
      .setShadows(true)
      .setGradients(true)
      .build();

    return {
      id: 'education-friendly',
      name: 'Education Friendly',
      description: 'Approachable and clear for learning',
      category: 'academic',
      tags: ['education', 'friendly', 'learning', 'teaching'],
      theme,
    };
  }

  private static createScientificClean(): ThemePreset {
    const theme = new ThemeBuilder('Scientific Clean')
      .setDescription('Clean scientific theme for research')
      .setPrimaryColor('#0369A1')
      .setFontPairing('Developer Docs')
      .setShadows(false)
      .build();

    return {
      id: 'scientific-clean',
      name: 'Scientific Clean',
      description: 'Clarity and precision for scientific work',
      category: 'academic',
      tags: ['scientific', 'research', 'clean', 'precise'],
      theme,
    };
  }

  // === Special Purpose Themes ===

  private static createDarkMode(): ThemePreset {
    const theme = new ThemeBuilder('Dark Mode')
      .setDescription('Dark theme optimized for low-light viewing')
      .setPrimaryColor('#3B82F6')
      .setFontPairing('Modern Professional')
      .setShadows(true, 0.5)
      .setGradients(true)
      .convertToDarkMode()
      .build();

    return {
      id: 'dark-mode',
      name: 'Dark Mode',
      description: 'Dark theme for modern presentations',
      category: 'minimal',
      tags: ['dark', 'modern', 'night', 'low-light'],
      theme,
    };
  }

  private static createHighContrast(): ThemePreset {
    const theme = new ThemeBuilder('High Contrast')
      .setDescription('Maximum contrast for accessibility')
      .setColors({
        primary: '#000000',
        secondary: '#1F2937',
        accent: '#0000FF',
        background: '#FFFFFF',
        surface: '#FFFFFF',
        text: '#000000',
        textSecondary: '#000000',
        border: '#000000',
      })
      .setFontPairing('Corporate Standard')
      .setShadows(false)
      .build();

    return {
      id: 'high-contrast',
      name: 'High Contrast',
      description: 'Maximum accessibility with high contrast',
      category: 'minimal',
      tags: ['accessibility', 'high-contrast', 'readable', 'wcag'],
      theme,
    };
  }

  private static createPrintOptimized(): ThemePreset {
    const theme = new ThemeBuilder('Print Optimized')
      .setDescription('Optimized for printing - minimal ink usage')
      .setColors({
        primary: '#1F2937',
        secondary: '#374151',
        accent: '#6B7280',
        background: '#FFFFFF',
        surface: '#FFFFFF',
        text: '#000000',
        textSecondary: '#374151',
        border: '#D1D5DB',
      })
      .setFontPairing('Business Classic')
      .setShadows(false)
      .setGradients(false)
      .build();

    return {
      id: 'print-optimized',
      name: 'Print Optimized',
      description: 'Printer-friendly with minimal ink usage',
      category: 'minimal',
      tags: ['print', 'ink-saving', 'economical', 'black-white'],
      theme,
    };
  }

  private static createElegantLuxury(): ThemePreset {
    const theme = new ThemeBuilder('Elegant Luxury')
      .setDescription('Luxurious theme with elegant typography')
      .setColors({
        primary: '#1F2937',
        secondary: '#713F12',
        accent: '#F59E0B',
        background: '#FFFBEB',
        surface: '#FEF3C7',
        text: '#1F2937',
        textSecondary: '#78350F',
        border: '#FCD34D',
      })
      .setFontPairing('Classic Elegance')
      .setShadows(true, 0.2)
      .setGradients(true)
      .build();

    return {
      id: 'elegant-luxury',
      name: 'Elegant Luxury',
      description: 'Sophisticated luxury for premium brands',
      category: 'elegant',
      tags: ['luxury', 'elegant', 'premium', 'sophisticated'],
      theme,
    };
  }

  private static createPlayfulFun(): ThemePreset {
    const theme = new ThemeBuilder('Playful Fun')
      .setDescription('Fun and playful theme for casual content')
      .setColorHarmony('#EC4899', 'triadic')
      .setFontPairing('Friendly & Approachable')
      .setShadows(true)
      .setGradients(true)
      .setAnimations('energetic')
      .build();

    return {
      id: 'playful-fun',
      name: 'Playful Fun',
      description: 'Fun and engaging for casual presentations',
      category: 'creative',
      tags: ['playful', 'fun', 'casual', 'engaging'],
      theme,
    };
  }

  private static createNatureGreen(): ThemePreset {
    const theme = new ThemeBuilder('Nature Green')
      .setDescription('Natural green theme inspired by nature')
      .setColors({
        primary: '#059669',
        secondary: '#047857',
        accent: '#84CC16',
        background: '#F0FDF4',
        surface: '#DCFCE7',
        text: '#14532D',
        textSecondary: '#166534',
        border: '#86EFAC',
      })
      .setFontPairing('Modern Professional')
      .setShadows(true)
      .build();

    return {
      id: 'nature-green',
      name: 'Nature Green',
      description: 'Earth-friendly for environmental topics',
      category: 'creative',
      tags: ['nature', 'green', 'eco', 'environmental'],
      theme,
    };
  }

  private static createOceanBlue(): ThemePreset {
    const theme = new ThemeBuilder('Ocean Blue')
      .setDescription('Calming ocean-inspired blue theme')
      .setColors({
        primary: '#0284C7',
        secondary: '#0369A1',
        accent: '#06B6D4',
        background: '#F0F9FF',
        surface: '#E0F2FE',
        text: '#0C4A6E',
        textSecondary: '#075985',
        border: '#7DD3FC',
      })
      .setFontPairing('Modern Professional')
      .setShadows(true)
      .setGradients(true)
      .build();

    return {
      id: 'ocean-blue',
      name: 'Ocean Blue',
      description: 'Calm and trustworthy ocean theme',
      category: 'creative',
      tags: ['ocean', 'blue', 'calm', 'water'],
      theme,
    };
  }
}

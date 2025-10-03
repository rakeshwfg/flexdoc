/**
 * Theme Builder
 * Create and customize themes for FlexDoc
 */

import {
  Theme,
  ColorScheme,
  TypographyConfig,
  LayoutConfig,
  EffectsConfig,
  BrandingConfig,
  ThemeOptions,
} from './theme-types';
import { ColorUtils } from './color-utils';
import { FontPairings } from './font-pairings';

export class ThemeBuilder {
  private theme: Partial<Theme>;

  constructor(baseName: string = 'Custom Theme') {
    this.theme = {
      name: baseName,
      colors: this.getDefaultColors(),
      typography: this.getDefaultTypography(),
      layout: this.getDefaultLayout(),
      effects: this.getDefaultEffects(),
    };
  }

  /**
   * Set theme name
   */
  setName(name: string): this {
    this.theme.name = name;
    return this;
  }

  /**
   * Set theme description
   */
  setDescription(description: string): this {
    this.theme.description = description;
    return this;
  }

  /**
   * Set primary color and generate complementary colors
   */
  setPrimaryColor(color: string): this {
    if (!this.theme.colors) this.theme.colors = this.getDefaultColors();

    this.theme.colors.primary = color;
    this.theme.colors.secondary = ColorUtils.darken(color, 10);
    this.theme.colors.accent = ColorUtils.complementary(color);

    // Adjust text color based on background
    if (this.theme.colors.background) {
      this.theme.colors.text = ColorUtils.isLight(this.theme.colors.background) ? '#1F2937' : '#F9FAFB';
    }

    return this;
  }

  /**
   * Set color scheme
   */
  setColors(colors: Partial<ColorScheme>): this {
    this.theme.colors = { ...this.theme.colors!, ...colors };
    return this;
  }

  /**
   * Generate color scheme from single color using harmony
   */
  setColorHarmony(baseColor: string, harmony: 'complementary' | 'analogous' | 'triadic' | 'monochromatic' = 'complementary'): this {
    if (!this.theme.colors) this.theme.colors = this.getDefaultColors();

    const palette = ColorUtils.generatePalette(baseColor, harmony);

    this.theme.colors.primary = palette.colors[0];
    this.theme.colors.secondary = palette.colors[1] || ColorUtils.darken(palette.colors[0], 10);
    this.theme.colors.tertiary = palette.colors[2];
    this.theme.colors.accent = palette.colors[palette.colors.length - 1];

    return this;
  }

  /**
   * Set font pairing
   */
  setFontPairing(pairingName: string): this {
    const pairing = FontPairings.getByName(pairingName);
    if (pairing && this.theme.typography) {
      this.theme.typography.headingFont = pairing.heading;
      this.theme.typography.bodyFont = pairing.body;
    }
    return this;
  }

  /**
   * Set fonts by style
   */
  setFontStyle(style: 'modern' | 'classic' | 'elegant' | 'playful' | 'professional' | 'technical'): this {
    const pairing = FontPairings.getForTheme(style);
    if (this.theme.typography) {
      this.theme.typography.headingFont = pairing.heading;
      this.theme.typography.bodyFont = pairing.body;
    }
    return this;
  }

  /**
   * Set custom fonts
   */
  setFonts(headingFont: string, bodyFont: string, accentFont?: string): this {
    if (!this.theme.typography) this.theme.typography = this.getDefaultTypography();

    this.theme.typography.headingFont = headingFont;
    this.theme.typography.bodyFont = bodyFont;
    if (accentFont) this.theme.typography.accentFont = accentFont;

    return this;
  }

  /**
   * Set typography configuration
   */
  setTypography(typography: Partial<TypographyConfig>): this {
    this.theme.typography = { ...this.theme.typography!, ...typography };
    return this;
  }

  /**
   * Set layout configuration
   */
  setLayout(layout: Partial<LayoutConfig>): this {
    this.theme.layout = { ...this.theme.layout!, ...layout };
    return this;
  }

  /**
   * Set effects configuration
   */
  setEffects(effects: Partial<EffectsConfig>): this {
    this.theme.effects = { ...this.theme.effects!, ...effects };
    return this;
  }

  /**
   * Enable/disable shadows
   */
  setShadows(enabled: boolean, intensity?: number): this {
    if (!this.theme.effects) this.theme.effects = this.getDefaultEffects();
    this.theme.effects.shadows = enabled;
    if (intensity !== undefined) this.theme.effects.shadowIntensity = intensity;
    return this;
  }

  /**
   * Enable/disable gradients
   */
  setGradients(enabled: boolean): this {
    if (!this.theme.effects) this.theme.effects = this.getDefaultEffects();
    this.theme.effects.gradients = enabled;
    return this;
  }

  /**
   * Set animations
   */
  setAnimations(animations: boolean | 'subtle' | 'normal' | 'energetic'): this {
    if (!this.theme.effects) this.theme.effects = this.getDefaultEffects();
    this.theme.effects.animations = animations;
    return this;
  }

  /**
   * Set branding configuration
   */
  setBranding(branding: BrandingConfig): this {
    this.theme.branding = branding;
    return this;
  }

  /**
   * Set company branding
   */
  setCompanyBranding(companyName: string, logo?: string, tagline?: string): this {
    if (!this.theme.branding) this.theme.branding = {};
    this.theme.branding.companyName = companyName;
    if (logo) this.theme.branding.logo = logo;
    if (tagline) this.theme.branding.tagline = tagline;
    return this;
  }

  /**
   * Set metadata
   */
  setMetadata(metadata: Record<string, any>): this {
    this.theme.metadata = { ...this.theme.metadata, ...metadata };
    return this;
  }

  /**
   * Apply quick theme options
   */
  applyOptions(options: ThemeOptions): this {
    if (options.primaryColor) {
      this.setPrimaryColor(options.primaryColor);
    }

    if (options.secondaryColor && this.theme.colors) {
      this.theme.colors.secondary = options.secondaryColor;
    }

    if (options.accentColor && this.theme.colors) {
      this.theme.colors.accent = options.accentColor;
    }

    if (options.fontFamily && this.theme.typography) {
      this.theme.typography.headingFont = options.fontFamily;
      this.theme.typography.bodyFont = options.fontFamily;
    }

    if (options.enableEffects !== undefined && this.theme.effects) {
      this.theme.effects.shadows = options.enableEffects;
      this.theme.effects.gradients = options.enableEffects;
    }

    if (options.darkMode && this.theme.colors) {
      this.convertToDarkMode();
    }

    return this;
  }

  /**
   * Convert theme to dark mode
   */
  convertToDarkMode(): this {
    if (!this.theme.colors) return this;

    // Swap background and text colors
    const temp = this.theme.colors.background;
    this.theme.colors.background = '#1F2937';
    this.theme.colors.surface = '#374151';
    this.theme.colors.text = '#F9FAFB';
    this.theme.colors.textSecondary = '#D1D5DB';
    this.theme.colors.border = '#4B5563';

    // Adjust colors for dark mode
    this.theme.colors.primary = ColorUtils.lighten(this.theme.colors.primary, 10);
    this.theme.colors.secondary = ColorUtils.lighten(this.theme.colors.secondary, 10);

    return this;
  }

  /**
   * Validate theme for accessibility
   */
  validate(): { valid: boolean; warnings: string[] } {
    const warnings: string[] = [];

    if (!this.theme.colors) {
      warnings.push('Colors not configured');
      return { valid: false, warnings };
    }

    // Check contrast ratios
    const bgTextRatio = ColorUtils.contrastRatio(this.theme.colors.background, this.theme.colors.text);
    if (bgTextRatio < 4.5) {
      warnings.push(`Background/text contrast ratio (${bgTextRatio.toFixed(2)}) does not meet WCAG AA standards`);
    }

    const primaryBgRatio = ColorUtils.contrastRatio(this.theme.colors.primary, this.theme.colors.background);
    if (primaryBgRatio < 3) {
      warnings.push(`Primary color contrast with background is too low (${primaryBgRatio.toFixed(2)})`);
    }

    return {
      valid: warnings.length === 0,
      warnings,
    };
  }

  /**
   * Build and return the complete theme
   */
  build(): Theme {
    return {
      name: this.theme.name || 'Custom Theme',
      description: this.theme.description,
      displayName: this.theme.displayName,
      author: this.theme.author,
      version: this.theme.version || '1.0.0',
      colors: this.theme.colors || this.getDefaultColors(),
      typography: this.theme.typography || this.getDefaultTypography(),
      layout: this.theme.layout || this.getDefaultLayout(),
      effects: this.theme.effects || this.getDefaultEffects(),
      branding: this.theme.branding,
      metadata: this.theme.metadata,
    };
  }

  /**
   * Export theme to JSON
   */
  toJSON(): string {
    return JSON.stringify(this.build(), null, 2);
  }

  /**
   * Create theme from JSON
   */
  static fromJSON(json: string): Theme {
    return JSON.parse(json) as Theme;
  }

  /**
   * Get default color scheme
   */
  private getDefaultColors(): ColorScheme {
    return {
      primary: '#3B82F6',
      secondary: '#1E40AF',
      accent: '#F59E0B',
      background: '#FFFFFF',
      surface: '#F9FAFB',
      text: '#1F2937',
      textSecondary: '#6B7280',
      error: '#EF4444',
      warning: '#F59E0B',
      success: '#10B981',
      info: '#3B82F6',
      border: '#E5E7EB',
    };
  }

  /**
   * Get default typography
   */
  private getDefaultTypography(): TypographyConfig {
    return {
      headingFont: 'Montserrat',
      bodyFont: 'Open Sans',
      monoFont: 'Courier New',
      sizes: {
        h1: 36,
        h2: 30,
        h3: 24,
        h4: 20,
        body: 14,
        small: 12,
        tiny: 10,
      },
      weights: {
        light: 300,
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      lineHeight: 1.5,
      letterSpacing: 0,
    };
  }

  /**
   * Get default layout
   */
  private getDefaultLayout(): LayoutConfig {
    return {
      margins: {
        top: 1,
        right: 1,
        bottom: 1,
        left: 1,
      },
      spacing: {
        xs: 0.25,
        sm: 0.5,
        md: 1,
        lg: 1.5,
        xl: 2,
      },
      borderRadius: {
        sm: 0.1,
        md: 0.2,
        lg: 0.4,
        full: 999,
      },
      gridColumns: 12,
    };
  }

  /**
   * Get default effects
   */
  private getDefaultEffects(): EffectsConfig {
    return {
      shadows: true,
      shadowIntensity: 0.3,
      gradients: false,
      animations: 'subtle',
      borders: 'minimal',
      corners: 'rounded',
    };
  }
}

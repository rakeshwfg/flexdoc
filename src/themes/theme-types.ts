/**
 * Theme System Types
 * Complete theming system for FlexDoc documents
 */

export interface Theme {
  /** Unique theme identifier */
  name: string;
  /** Theme description */
  description?: string;
  /** Display name for UI */
  displayName?: string;
  /** Theme author */
  author?: string;
  /** Theme version */
  version?: string;
  /** Color scheme configuration */
  colors: ColorScheme;
  /** Typography configuration */
  typography: TypographyConfig;
  /** Layout configuration */
  layout: LayoutConfig;
  /** Visual effects configuration */
  effects: EffectsConfig;
  /** Branding configuration */
  branding?: BrandingConfig;
  /** Custom metadata */
  metadata?: Record<string, any>;
}

export interface ColorScheme {
  /** Primary brand color */
  primary: string;
  /** Secondary color */
  secondary: string;
  /** Tertiary color */
  tertiary?: string;
  /** Accent color for highlights */
  accent: string;
  /** Background color */
  background: string;
  /** Surface color (cards, panels) */
  surface: string;
  /** Text color */
  text: string;
  /** Muted/secondary text color */
  textSecondary: string;
  /** Error color */
  error?: string;
  /** Warning color */
  warning?: string;
  /** Success color */
  success?: string;
  /** Info color */
  info?: string;
  /** Border color */
  border?: string;
  /** Gradient definitions */
  gradients?: {
    primary?: string[];
    secondary?: string[];
    accent?: string[];
  };
}

export interface TypographyConfig {
  /** Primary heading font family */
  headingFont: string;
  /** Body text font family */
  bodyFont: string;
  /** Accent/decorative font */
  accentFont?: string;
  /** Monospace font for code */
  monoFont?: string;
  /** Font sizes */
  sizes: {
    h1: number;
    h2: number;
    h3: number;
    h4: number;
    body: number;
    small: number;
    tiny: number;
  };
  /** Font weights */
  weights: {
    light: number;
    regular: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  /** Line height multiplier */
  lineHeight: number;
  /** Letter spacing (em units) */
  letterSpacing: number;
}

export interface LayoutConfig {
  /** Page margins */
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  /** Content spacing */
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  /** Border radius */
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    full: number;
  };
  /** Grid columns */
  gridColumns?: number;
  /** Content max width */
  maxWidth?: number;
}

export interface EffectsConfig {
  /** Enable drop shadows */
  shadows: boolean;
  /** Shadow intensity (0-1) */
  shadowIntensity?: number;
  /** Enable reflections */
  reflections?: boolean;
  /** Enable gradients */
  gradients: boolean;
  /** Enable animations */
  animations?: boolean | 'subtle' | 'normal' | 'energetic';
  /** Border style */
  borders?: 'none' | 'minimal' | 'normal' | 'bold';
  /** Corner style */
  corners?: 'sharp' | 'rounded' | 'soft' | 'pill';
}

export interface BrandingConfig {
  /** Logo image path or URL */
  logo?: string;
  /** Logo position */
  logoPosition?: 'header' | 'footer' | 'corner';
  /** Company name */
  companyName?: string;
  /** Tagline or slogan */
  tagline?: string;
  /** Watermark text */
  watermark?: string;
  /** Show branding on all pages */
  showOnAllPages?: boolean;
}

export interface ThemePreset {
  /** Preset identifier */
  id: string;
  /** Display name */
  name: string;
  /** Preset description */
  description: string;
  /** Category */
  category: 'business' | 'creative' | 'minimal' | 'bold' | 'elegant' | 'tech' | 'academic';
  /** Tags for filtering */
  tags: string[];
  /** Preview image URL */
  preview?: string;
  /** The complete theme */
  theme: Theme;
}

export interface ThemeOptions {
  /** Quick color override */
  primaryColor?: string;
  /** Quick secondary color override */
  secondaryColor?: string;
  /** Quick accent color override */
  accentColor?: string;
  /** Quick font override */
  fontFamily?: string;
  /** Enable/disable effects */
  enableEffects?: boolean;
  /** Dark mode variant */
  darkMode?: boolean;
}

export interface ColorPalette {
  /** Palette name */
  name: string;
  /** Base colors */
  colors: string[];
  /** Harmony type */
  harmony: 'monochromatic' | 'complementary' | 'analogous' | 'triadic' | 'tetradic' | 'split-complementary';
}

export interface FontPairing {
  /** Pairing name */
  name: string;
  /** Heading font */
  heading: string;
  /** Body font */
  body: string;
  /** Style description */
  style: 'modern' | 'classic' | 'elegant' | 'playful' | 'professional' | 'technical';
  /** Recommended for */
  recommendedFor: string[];
}

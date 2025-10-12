/**
 * License tier types for FlexDoc
 */
export type LicenseTier = 'free' | 'pro' | 'enterprise';

/**
 * Available Pro features that can be gated by license
 */
export type ProFeature =
  | 'professional-mode'
  | 'premium-themes'
  | 'cloud-storage'
  | 'api-server'
  | 'advanced-watermarks'
  | 'custom-branding'
  | 'white-label'
  | 'priority-support'
  | 'sla-guarantee'
  | 'on-premise'
  | 'volume-licensing';

/**
 * License information decoded from JWT
 */
export interface LicenseInfo {
  /** License tier (free, pro, enterprise) */
  tier: LicenseTier;

  /** Customer email address */
  email: string;

  /** Customer name (optional) */
  name?: string;

  /** Unix timestamp when license was issued */
  issued: number;

  /** Unix timestamp when license expires (undefined = never expires) */
  expires?: number;

  /** Array of enabled features */
  features: ProFeature[];

  /** License key ID for tracking */
  licenseId?: string;

  /** Company name for enterprise licenses */
  company?: string;

  /** Custom metadata */
  metadata?: Record<string, any>;
}

/**
 * License validation result
 */
export interface LicenseValidationResult {
  /** Whether the license is valid */
  valid: boolean;

  /** License information if valid */
  license?: LicenseInfo;

  /** Error message if invalid */
  error?: string;

  /** Error code for programmatic handling */
  errorCode?: 'INVALID_TOKEN' | 'EXPIRED' | 'MISSING' | 'MALFORMED';
}

/**
 * Options for FlexDoc constructor related to licensing
 */
export interface LicenseOptions {
  /** Pro license key (JWT token) */
  licenseKey?: string;

  /** Whether to throw errors on license validation failure (default: false) */
  strictLicenseValidation?: boolean;

  /** Whether to suppress license warnings in console (default: false) */
  suppressLicenseWarnings?: boolean;
}

/**
 * Feature gate configuration
 */
export interface FeatureGateConfig {
  /** Feature identifier */
  feature: ProFeature;

  /** User-friendly feature name */
  featureName: string;

  /** Custom error message (optional) */
  customMessage?: string;

  /** Whether to allow feature in development mode (default: false) */
  allowInDev?: boolean;
}

/**
 * Premium theme tiers
 */
export const PREMIUM_THEMES = [
  // Business themes
  'corporate-blue',
  'professional-gray',
  'executive-gold',
  'financial-green',
  'consulting-navy',

  // Tech themes
  'tech-purple',
  'startup-orange',
  'innovation-teal',
  'digital-cyan',
  'saas-modern',

  // Creative themes
  'creative-pink',
  'designer-vibrant',
  'artistic-rainbow',
  'modern-minimal',
  'bold-impact',

  // Academic themes
  'academic-serif',
  'education-friendly',
  'scientific-clean',

  // Special themes
  'dark-mode',
  'high-contrast',
  'elegant-luxury',
  'playful-fun',
  'nature-green',
  'ocean-blue',
] as const;

/**
 * Free themes available to all users
 */
export const FREE_THEMES = ['default', 'dark', 'corporate', 'creative', 'minimal'] as const;

/**
 * Feature to tier mapping
 */
export const FEATURE_REQUIREMENTS: Record<ProFeature, LicenseTier[]> = {
  'professional-mode': ['pro', 'enterprise'],
  'premium-themes': ['pro', 'enterprise'],
  'cloud-storage': ['pro', 'enterprise'],
  'api-server': ['pro', 'enterprise'],
  'advanced-watermarks': ['pro', 'enterprise'],
  'custom-branding': ['pro', 'enterprise'],
  'white-label': ['enterprise'],
  'priority-support': ['pro', 'enterprise'],
  'sla-guarantee': ['enterprise'],
  'on-premise': ['enterprise'],
  'volume-licensing': ['enterprise'],
};

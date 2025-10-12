import jwt from 'jsonwebtoken';
import {
  LicenseInfo,
  LicenseValidationResult,
  ProFeature,
  LicenseTier,
  FEATURE_REQUIREMENTS,
  PREMIUM_THEMES,
  FREE_THEMES,
} from './license-types';

/**
 * Public key for verifying license signatures
 * This is safe to embed in the code - it can only verify, not sign
 */
const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAu5ZFtKZ03WCyONCEHJrX
mrfwzAflrleZ3gQpskFQcXCAza9Xdg88Ps/ob67Rn8XXLz52P9vCG0IjcH95Re9+
088XkH8BTBHxE9Ol7DVS4x5DcAbozQrjvhRd9A3AjBHoYeaDHWeKn8jBUkrv3m1E
G/gq0+lOvR4qjCANB2/dyXGf0OiiPpf/PfEv/jTUssKhjIRyQZ0BlicdtPGT8BK0
9e3ORVafpSR4MKHfSCAFipqe1KQ0jMTHOzzfQ0lfG3mdvsWKEH8lWYnadBF2KSR+
TAKxKhCRAMGp4ChpWJ6131cYqQA4egvCz1RVPEA1im9Ww+H08EwrT3QIDC+vnSRF
EQIDAQAB
-----END PUBLIC KEY-----`;

/**
 * License validator for FlexDoc Pro features
 * Uses JWT with RSA signatures for offline validation
 */
export class LicenseValidator {
  private cachedLicense: LicenseInfo | null = null;
  private lastValidation: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Validate a license key
   * @param licenseKey JWT token containing license information
   * @returns Validation result with license info or error
   */
  validateLicense(licenseKey: string): LicenseValidationResult {
    if (!licenseKey || typeof licenseKey !== 'string') {
      return {
        valid: false,
        error: 'License key is required',
        errorCode: 'MISSING',
      };
    }

    try {
      // Decode and verify JWT signature
      const decoded = jwt.verify(licenseKey, PUBLIC_KEY, {
        algorithms: ['RS256'],
      }) as LicenseInfo;

      // Validate required fields
      if (!decoded.tier || !decoded.email || !decoded.issued || !Array.isArray(decoded.features)) {
        return {
          valid: false,
          error: 'License key is malformed - missing required fields',
          errorCode: 'MALFORMED',
        };
      }

      // Check expiration
      if (decoded.expires && Date.now() > decoded.expires) {
        return {
          valid: false,
          error: `License expired on ${new Date(decoded.expires).toLocaleDateString()}`,
          errorCode: 'EXPIRED',
        };
      }

      // Cache the validated license
      this.cachedLicense = decoded;
      this.lastValidation = Date.now();

      return {
        valid: true,
        license: decoded,
      };
    } catch (error: any) {
      // Handle specific JWT errors
      if (error.name === 'TokenExpiredError') {
        return {
          valid: false,
          error: 'License has expired',
          errorCode: 'EXPIRED',
        };
      }

      if (error.name === 'JsonWebTokenError') {
        return {
          valid: false,
          error: 'Invalid license key - signature verification failed',
          errorCode: 'INVALID_TOKEN',
        };
      }

      return {
        valid: false,
        error: `License validation failed: ${error.message}`,
        errorCode: 'INVALID_TOKEN',
      };
    }
  }

  /**
   * Check if a license has a specific feature
   * @param license License info (or null for free tier)
   * @param feature Feature to check
   * @returns Whether the feature is available
   */
  hasFeature(license: LicenseInfo | null, feature: ProFeature): boolean {
    if (!license) {
      // Free tier has no Pro features
      return false;
    }

    // Check if feature is in the license
    return license.features.includes(feature);
  }

  /**
   * Check if a license tier supports a feature
   * @param tier License tier
   * @param feature Feature to check
   * @returns Whether the tier supports the feature
   */
  tierSupportsFeature(tier: LicenseTier, feature: ProFeature): boolean {
    const requiredTiers = FEATURE_REQUIREMENTS[feature];
    return requiredTiers.includes(tier);
  }

  /**
   * Check if a theme requires a Pro license
   * @param theme Theme name
   * @returns Whether the theme is premium
   */
  isPremiumTheme(theme: string): boolean {
    return PREMIUM_THEMES.includes(theme as any);
  }

  /**
   * Check if a theme is available in free tier
   * @param theme Theme name
   * @returns Whether the theme is free
   */
  isFreeTheme(theme: string): boolean {
    return FREE_THEMES.includes(theme as any);
  }

  /**
   * Get license info from cache if still valid
   * @returns Cached license or null
   */
  getCachedLicense(): LicenseInfo | null {
    if (this.cachedLicense && Date.now() - this.lastValidation < this.CACHE_DURATION) {
      return this.cachedLicense;
    }
    return null;
  }

  /**
   * Clear cached license
   */
  clearCache(): void {
    this.cachedLicense = null;
    this.lastValidation = 0;
  }

  /**
   * Get user-friendly error message for feature requirement
   * @param feature Feature identifier
   * @param featureName User-friendly feature name
   * @param currentTier Current license tier
   * @returns Error message with upgrade link
   */
  getFeatureRequirementMessage(
    feature: ProFeature,
    featureName: string,
    currentTier: LicenseTier = 'free'
  ): string {
    const requiredTiers = FEATURE_REQUIREMENTS[feature];
    const lowestRequiredTier = requiredTiers[0];

    let message = `${featureName} requires FlexDoc ${lowestRequiredTier === 'enterprise' ? 'Enterprise' : 'Pro'}.\n\n`;

    if (currentTier === 'free') {
      message += `Current tier: Free\n`;
      message += `Upgrade at: https://rakeshwfg.github.io/flexdoc/pricing\n\n`;
    } else {
      message += `Current tier: ${currentTier}\n`;
      message += `Required tier: ${lowestRequiredTier}\n`;
      message += `Contact sales: rakesh16@gmail.com\n\n`;
    }

    message += `📖 Learn more: https://github.com/rakeshwfg/flexdoc#pro-features`;

    return message;
  }

  /**
   * Get license summary for display
   * @param license License info
   * @returns Human-readable summary
   */
  getLicenseSummary(license: LicenseInfo): string {
    const tier = license.tier.charAt(0).toUpperCase() + license.tier.slice(1);
    const expires = license.expires
      ? new Date(license.expires).toLocaleDateString()
      : 'Never';

    return [
      `FlexDoc ${tier} License`,
      `Licensed to: ${license.name || license.email}`,
      license.company ? `Company: ${license.company}` : null,
      `Expires: ${expires}`,
      `Features: ${license.features.length}`,
    ]
      .filter(Boolean)
      .join('\n');
  }
}

/**
 * Singleton instance for easy access
 */
export const licenseValidator = new LicenseValidator();

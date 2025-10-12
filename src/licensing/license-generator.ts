import jwt from 'jsonwebtoken';
import * as fs from 'fs';
import * as path from 'path';
import { LicenseInfo, LicenseTier, ProFeature } from './license-types';

/**
 * Options for generating a license
 */
export interface GenerateLicenseOptions {
  /** Customer email (required) */
  email: string;

  /** Customer name (optional) */
  name?: string;

  /** License tier */
  tier: LicenseTier;

  /** Company name for enterprise */
  company?: string;

  /** Duration in days (undefined = never expires) */
  durationDays?: number;

  /** Custom features (optional, defaults to tier features) */
  customFeatures?: ProFeature[];

  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * License generator for FlexDoc Pro
 * SECURITY: This should only be used server-side with private key secured
 */
export class LicenseGenerator {
  private privateKey: string;

  constructor(privateKeyPath?: string) {
    // Load private key
    const keyPath =
      privateKeyPath || path.join(process.cwd(), 'keys', 'license_key');

    if (!fs.existsSync(keyPath)) {
      throw new Error(
        `Private key not found at ${keyPath}. Generate keys with: ssh-keygen -t rsa -b 2048 -m PEM -f keys/license_key`
      );
    }

    this.privateKey = fs.readFileSync(keyPath, 'utf8');
  }

  /**
   * Generate a license key
   * @param options License generation options
   * @returns JWT license key
   */
  generateLicense(options: GenerateLicenseOptions): string {
    const { email, name, tier, company, durationDays, customFeatures, metadata } = options;

    // Validate email
    if (!email || !this.isValidEmail(email)) {
      throw new Error('Valid email address is required');
    }

    // Calculate expiration
    const issued = Date.now();
    const expires = durationDays
      ? issued + durationDays * 24 * 60 * 60 * 1000
      : undefined;

    // Determine features based on tier or custom
    const features = customFeatures || this.getDefaultFeaturesForTier(tier);

    // Generate unique license ID
    const licenseId = this.generateLicenseId();

    // Create license payload
    const payload: LicenseInfo = {
      tier,
      email,
      name,
      issued,
      expires,
      features,
      licenseId,
      company,
      metadata,
    };

    // Sign with private key
    const token = jwt.sign(payload, this.privateKey, {
      algorithm: 'RS256',
      expiresIn: durationDays ? `${durationDays}d` : undefined,
    });

    return token;
  }

  /**
   * Generate a Pro license (most common)
   * @param email Customer email
   * @param name Customer name
   * @param durationDays Duration in days (365 for annual, undefined for lifetime)
   * @returns License key
   */
  generateProLicense(email: string, name?: string, durationDays: number = 365): string {
    return this.generateLicense({
      email,
      name,
      tier: 'pro',
      durationDays,
    });
  }

  /**
   * Generate an Enterprise license
   * @param email Customer email
   * @param company Company name
   * @param name Customer name
   * @returns License key (never expires)
   */
  generateEnterpriseLicense(
    email: string,
    company: string,
    name?: string
  ): string {
    return this.generateLicense({
      email,
      name,
      company,
      tier: 'enterprise',
      // Enterprise licenses never expire
    });
  }

  /**
   * Generate multiple licenses (for team/volume licensing)
   * @param emails Array of customer emails
   * @param tier License tier
   * @param company Company name (for enterprise)
   * @param durationDays Duration in days
   * @returns Array of license keys
   */
  generateBulkLicenses(
    emails: string[],
    tier: LicenseTier,
    company?: string,
    durationDays?: number
  ): string[] {
    return emails.map((email) =>
      this.generateLicense({
        email,
        tier,
        company,
        durationDays,
      })
    );
  }

  /**
   * Get default features for a tier
   */
  private getDefaultFeaturesForTier(tier: LicenseTier): ProFeature[] {
    switch (tier) {
      case 'pro':
        return [
          'professional-mode',
          'premium-themes',
          'cloud-storage',
          'api-server',
          'advanced-watermarks',
          'custom-branding',
          'priority-support',
        ];

      case 'enterprise':
        return [
          'professional-mode',
          'premium-themes',
          'cloud-storage',
          'api-server',
          'advanced-watermarks',
          'custom-branding',
          'white-label',
          'priority-support',
          'sla-guarantee',
          'on-premise',
          'volume-licensing',
        ];

      case 'free':
      default:
        return [];
    }
  }

  /**
   * Generate unique license ID
   */
  private generateLicenseId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 10);
    return `FD-${timestamp}-${random}`.toUpperCase();
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Decode a license key without validation (for debugging)
   * @param licenseKey License key to decode
   * @returns Decoded payload
   */
  decodeLicense(licenseKey: string): any {
    return jwt.decode(licenseKey);
  }

  /**
   * Pretty print license info
   * @param licenseKey License key
   * @returns Formatted string
   */
  formatLicense(licenseKey: string): string {
    const decoded = this.decodeLicense(licenseKey) as LicenseInfo;

    if (!decoded) {
      return 'Invalid license key';
    }

    const lines = [
      '=' .repeat(60),
      'FlexDoc License Key',
      '='.repeat(60),
      '',
      `License ID: ${decoded.licenseId}`,
      `Tier: ${decoded.tier.toUpperCase()}`,
      `Email: ${decoded.email}`,
      decoded.name ? `Name: ${decoded.name}` : null,
      decoded.company ? `Company: ${decoded.company}` : null,
      `Issued: ${new Date(decoded.issued).toLocaleString()}`,
      decoded.expires
        ? `Expires: ${new Date(decoded.expires).toLocaleString()}`
        : 'Expires: Never',
      '',
      'Features:',
      ...decoded.features.map((f) => `  - ${f}`),
      '',
      'License Key:',
      this.wrapText(licenseKey, 60),
      '',
      '='.repeat(60),
    ];

    return lines.filter(Boolean).join('\n');
  }

  /**
   * Wrap long text
   */
  private wrapText(text: string, width: number): string {
    const regex = new RegExp(`.{1,${width}}`, 'g');
    return text.match(regex)?.join('\n') || text;
  }
}

/**
 * CLI helper for generating licenses
 * Usage: ts-node src/licensing/license-generator.ts <email> <tier> [name] [days]
 */
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log('Usage: ts-node src/licensing/license-generator.ts <email> <tier> [name] [days]');
    console.log('');
    console.log('Examples:');
    console.log('  ts-node src/licensing/license-generator.ts user@example.com pro');
    console.log('  ts-node src/licensing/license-generator.ts user@example.com pro "John Doe"');
    console.log('  ts-node src/licensing/license-generator.ts user@example.com pro "John Doe" 365');
    console.log('  ts-node src/licensing/license-generator.ts user@example.com enterprise "John Doe"');
    process.exit(1);
  }

  const [email, tier, name, daysStr] = args;
  const durationDays = daysStr ? parseInt(daysStr, 10) : tier === 'pro' ? 365 : undefined;

  try {
    const generator = new LicenseGenerator();
    const licenseKey = generator.generateLicense({
      email,
      tier: tier as LicenseTier,
      name,
      durationDays,
    });

    console.log('\n' + generator.formatLicense(licenseKey));
    console.log('\n✅ License generated successfully!');
  } catch (error: any) {
    console.error('\n❌ Error generating license:', error.message);
    process.exit(1);
  }
}

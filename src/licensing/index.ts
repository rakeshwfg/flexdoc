/**
 * FlexDoc Pro Licensing Module
 *
 * This module provides license validation and feature gating for FlexDoc Pro.
 *
 * @example
 * ```typescript
 * import { FlexDoc } from 'flexdoc';
 *
 * // With environment variable
 * process.env.FLEXDOC_LICENSE_KEY = 'your-license-key';
 * const flexdoc = new FlexDoc();
 *
 * // Or pass directly
 * const flexdoc = new FlexDoc({
 *   licenseKey: 'your-license-key'
 * });
 * ```
 *
 * @packageDocumentation
 */

export {
  LicenseValidator,
  licenseValidator,
} from './license-validator';

export {
  LicenseGenerator,
} from './license-generator';

export * from './license-types';

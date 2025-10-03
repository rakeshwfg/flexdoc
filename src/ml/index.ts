/**
 * ML-based Layout Detection Module
 *
 * Export all ML types, analyzer, and detector
 */

export * from './types';
export { ContentAnalyzer } from './content-analyzer';
export { LayoutDetector } from './layout-detector';

// Import for singleton
import { LayoutDetector } from './layout-detector';

// Create singleton instance
export const layoutDetector = new LayoutDetector();

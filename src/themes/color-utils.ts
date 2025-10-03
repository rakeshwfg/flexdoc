/**
 * Color Utilities for Theme System
 * Provides color manipulation, palette generation, and harmony algorithms
 */

import { ColorPalette } from './theme-types';

export class ColorUtils {
  /**
   * Convert hex color to RGB
   */
  static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  /**
   * Convert RGB to hex
   */
  static rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }

  /**
   * Convert hex to HSL
   */
  static hexToHsl(hex: string): { h: number; s: number; l: number } | null {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return null;

    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }

  /**
   * Convert HSL to hex
   */
  static hslToHex(h: number, s: number, l: number): string {
    h = h / 360;
    s = s / 100;
    l = l / 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return this.rgbToHex(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
  }

  /**
   * Lighten a color by percentage
   */
  static lighten(hex: string, percent: number): string {
    const hsl = this.hexToHsl(hex);
    if (!hsl) return hex;

    hsl.l = Math.min(100, hsl.l + percent);
    return this.hslToHex(hsl.h, hsl.s, hsl.l);
  }

  /**
   * Darken a color by percentage
   */
  static darken(hex: string, percent: number): string {
    const hsl = this.hexToHsl(hex);
    if (!hsl) return hex;

    hsl.l = Math.max(0, hsl.l - percent);
    return this.hslToHex(hsl.h, hsl.s, hsl.l);
  }

  /**
   * Adjust saturation
   */
  static saturate(hex: string, percent: number): string {
    const hsl = this.hexToHsl(hex);
    if (!hsl) return hex;

    hsl.s = Math.min(100, Math.max(0, hsl.s + percent));
    return this.hslToHex(hsl.h, hsl.s, hsl.l);
  }

  /**
   * Get complementary color
   */
  static complementary(hex: string): string {
    const hsl = this.hexToHsl(hex);
    if (!hsl) return hex;

    hsl.h = (hsl.h + 180) % 360;
    return this.hslToHex(hsl.h, hsl.s, hsl.l);
  }

  /**
   * Generate analogous colors
   */
  static analogous(hex: string): string[] {
    const hsl = this.hexToHsl(hex);
    if (!hsl) return [hex];

    return [
      this.hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l),
      hex,
      this.hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l),
    ];
  }

  /**
   * Generate triadic colors
   */
  static triadic(hex: string): string[] {
    const hsl = this.hexToHsl(hex);
    if (!hsl) return [hex];

    return [
      hex,
      this.hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
      this.hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l),
    ];
  }

  /**
   * Generate tetradic colors
   */
  static tetradic(hex: string): string[] {
    const hsl = this.hexToHsl(hex);
    if (!hsl) return [hex];

    return [
      hex,
      this.hslToHex((hsl.h + 90) % 360, hsl.s, hsl.l),
      this.hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
      this.hslToHex((hsl.h + 270) % 360, hsl.s, hsl.l),
    ];
  }

  /**
   * Generate split complementary colors
   */
  static splitComplementary(hex: string): string[] {
    const hsl = this.hexToHsl(hex);
    if (!hsl) return [hex];

    return [
      hex,
      this.hslToHex((hsl.h + 150) % 360, hsl.s, hsl.l),
      this.hslToHex((hsl.h + 210) % 360, hsl.s, hsl.l),
    ];
  }

  /**
   * Generate monochromatic palette
   */
  static monochromatic(hex: string, count: number = 5): string[] {
    const hsl = this.hexToHsl(hex);
    if (!hsl) return [hex];

    const colors: string[] = [];
    const step = 100 / (count + 1);

    for (let i = 1; i <= count; i++) {
      colors.push(this.hslToHex(hsl.h, hsl.s, Math.round(step * i)));
    }

    return colors;
  }

  /**
   * Generate color palette based on harmony type
   */
  static generatePalette(baseColor: string, harmonyType: ColorPalette['harmony']): ColorPalette {
    let colors: string[];
    let name: string;

    switch (harmonyType) {
      case 'complementary':
        colors = [baseColor, this.complementary(baseColor)];
        name = 'Complementary';
        break;
      case 'analogous':
        colors = this.analogous(baseColor);
        name = 'Analogous';
        break;
      case 'triadic':
        colors = this.triadic(baseColor);
        name = 'Triadic';
        break;
      case 'tetradic':
        colors = this.tetradic(baseColor);
        name = 'Tetradic';
        break;
      case 'split-complementary':
        colors = this.splitComplementary(baseColor);
        name = 'Split Complementary';
        break;
      case 'monochromatic':
      default:
        colors = this.monochromatic(baseColor);
        name = 'Monochromatic';
        break;
    }

    return {
      name,
      colors,
      harmony: harmonyType,
    };
  }

  /**
   * Check if color is light or dark
   */
  static isLight(hex: string): boolean {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return true;

    // Calculate relative luminance
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    return luminance > 0.5;
  }

  /**
   * Get contrasting text color (black or white)
   */
  static getContrastingColor(hex: string): string {
    return this.isLight(hex) ? '#000000' : '#FFFFFF';
  }

  /**
   * Calculate contrast ratio between two colors
   */
  static contrastRatio(hex1: string, hex2: string): number {
    const getLuminance = (hex: string): number => {
      const rgb = this.hexToRgb(hex);
      if (!rgb) return 0;

      const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
        val = val / 255;
        return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
      });

      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const lum1 = getLuminance(hex1);
    const lum2 = getLuminance(hex2);
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);

    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Check if contrast meets WCAG AA standards
   */
  static meetsWCAG(hex1: string, hex2: string, level: 'AA' | 'AAA' = 'AA', large: boolean = false): boolean {
    const ratio = this.contrastRatio(hex1, hex2);
    const required = level === 'AAA' ? (large ? 4.5 : 7) : (large ? 3 : 4.5);
    return ratio >= required;
  }
}

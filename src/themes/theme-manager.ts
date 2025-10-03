/**
 * Theme Manager
 * Central manager for loading, saving, and applying themes
 */

import * as fs from 'fs';
import * as path from 'path';
import { Theme, ThemeOptions } from './theme-types';
import { ThemeBuilder } from './theme-builder';
import { ThemePresets } from './theme-presets';

export class ThemeManager {
  /**
   * Get a theme by name (preset or custom)
   */
  static getTheme(nameOrId: string): Theme {
    // Try to get from presets first
    const preset = ThemePresets.getById(nameOrId);
    if (preset) return preset;

    // Try legacy theme names (backward compatibility)
    const legacyMap: Record<string, string> = {
      'default': 'corporate-blue',
      'dark': 'dark-mode',
      'corporate': 'corporate-blue',
      'creative': 'creative-pink',
    };

    const mappedId = legacyMap[nameOrId];
    if (mappedId) {
      const mappedPreset = ThemePresets.getById(mappedId);
      if (mappedPreset) return mappedPreset;
    }

    // Fall back to default theme
    return ThemePresets.getById('corporate-blue')!;
  }

  /**
   * Create a custom theme
   */
  static createTheme(name: string): ThemeBuilder {
    return new ThemeBuilder(name);
  }

  /**
   * Apply theme options to a theme
   */
  static applyThemeOptions(theme: Theme, options?: ThemeOptions): Theme {
    if (!options) return theme;

    const builder = new ThemeBuilder(theme.name);

    // Copy existing theme
    builder['theme'] = { ...theme };

    // Apply options
    builder.applyOptions(options);

    return builder.build();
  }

  /**
   * Load theme from JSON file
   */
  static loadThemeFromFile(filePath: string): Theme {
    try {
      const absolutePath = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
      const json = fs.readFileSync(absolutePath, 'utf-8');
      return ThemeBuilder.fromJSON(json);
    } catch (error) {
      throw new Error(`Failed to load theme from ${filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Save theme to JSON file
   */
  static saveThemeToFile(theme: Theme, filePath: string): void {
    try {
      const absolutePath = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
      const json = JSON.stringify(theme, null, 2);
      fs.writeFileSync(absolutePath, json, 'utf-8');
    } catch (error) {
      throw new Error(`Failed to save theme to ${filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * List all available preset themes
   */
  static listPresets(): Array<{ id: string; name: string; description: string; category: string }> {
    return ThemePresets.getAll().map(preset => ({
      id: preset.id,
      name: preset.name,
      description: preset.description,
      category: preset.category,
    }));
  }

  /**
   * Get themes by category
   */
  static getThemesByCategory(category: string) {
    return ThemePresets.getByCategory(category as any);
  }

  /**
   * Get themes by tag
   */
  static getThemesByTag(tag: string) {
    return ThemePresets.getByTag(tag);
  }

  /**
   * Search themes
   */
  static searchThemes(query: string) {
    const lowerQuery = query.toLowerCase();
    return ThemePresets.getAll().filter(preset =>
      preset.name.toLowerCase().includes(lowerQuery) ||
      preset.description.toLowerCase().includes(lowerQuery) ||
      preset.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Validate theme structure
   */
  static validateTheme(theme: Theme): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!theme.name) errors.push('Theme name is required');
    if (!theme.colors) errors.push('Colors configuration is required');
    if (!theme.typography) errors.push('Typography configuration is required');
    if (!theme.layout) errors.push('Layout configuration is required');
    if (!theme.effects) errors.push('Effects configuration is required');

    if (theme.colors) {
      if (!theme.colors.primary) errors.push('Primary color is required');
      if (!theme.colors.background) errors.push('Background color is required');
      if (!theme.colors.text) errors.push('Text color is required');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Clone a theme with a new name
   */
  static cloneTheme(theme: Theme, newName: string): Theme {
    return {
      ...theme,
      name: newName,
      version: '1.0.0',
      author: undefined,
    };
  }

  /**
   * Merge two themes (second theme overrides first)
   */
  static mergeThemes(baseTheme: Theme, overrideTheme: Partial<Theme>): Theme {
    return {
      ...baseTheme,
      ...overrideTheme,
      colors: { ...baseTheme.colors, ...(overrideTheme.colors || {}) },
      typography: { ...baseTheme.typography, ...(overrideTheme.typography || {}) },
      layout: { ...baseTheme.layout, ...(overrideTheme.layout || {}) },
      effects: { ...baseTheme.effects, ...(overrideTheme.effects || {}) },
      branding: { ...baseTheme.branding, ...(overrideTheme.branding || {}) },
      metadata: { ...baseTheme.metadata, ...(overrideTheme.metadata || {}) },
    };
  }
}

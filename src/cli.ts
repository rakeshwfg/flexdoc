#!/usr/bin/env node

/**
 * FlexDoc CLI - Command-line interface for HTML to PDF/PPTX conversion
 */

import { Command } from 'commander';
import { FlexDoc, OutputFormat, PDFOptions, PPTXOptions, DOCXOptions } from './index';
import * as fs from 'fs';
import * as path from 'path';

const program = new Command();
const flexdoc = new FlexDoc();

// Package version
const packageJson = require('../package.json');

program
  .name('flexdoc')
  .description('Convert HTML to PDF, PPTX, or DOCX formats')
  .version(packageJson.version);

// PDF Command
program
  .command('pdf')
  .description('Convert HTML to PDF')
  .argument('<input>', 'Input HTML file or URL')
  .option('-o, --output <path>', 'Output PDF file path', 'output.pdf')
  .option('-f, --format <format>', 'Paper format (A4, A3, Letter, Legal, Tabloid)', 'A4')
  .option('-l, --landscape', 'Landscape orientation', false)
  .option('--margin-top <size>', 'Top margin (e.g., 1cm, 0.5in)', '1cm')
  .option('--margin-right <size>', 'Right margin', '1cm')
  .option('--margin-bottom <size>', 'Bottom margin', '1cm')
  .option('--margin-left <size>', 'Left margin', '1cm')
  .option('--scale <number>', 'Scale factor (0.1 to 2.0)', '1')
  .option('--header <template>', 'HTML header template')
  .option('--footer <template>', 'HTML footer template')
  .option('--no-background', 'Disable background graphics')
  .option('--css <file>', 'Custom CSS file to inject')
  .option('--wait <selector>', 'Wait for selector before conversion')
  .option('--watermark-text <text>', 'Watermark text')
  .option('--watermark-image <path>', 'Watermark image file path')
  .option('--watermark-position <position>', 'Watermark position (center, diagonal, top-left, etc.)', 'center')
  .option('--watermark-opacity <number>', 'Watermark opacity (0-1)', '0.3')
  .option('--watermark-font-size <number>', 'Watermark font size', '72')
  .option('--watermark-color <color>', 'Watermark color', '#000000')
  .option('--watermark-rotation <degrees>', 'Watermark rotation in degrees', '0')
  .option('--watermark-repeat', 'Repeat watermark across page', false)
  .option('--debug', 'Enable debug mode')
  .action(async (input, options) => {
    try {
      console.log('🔄 Converting HTML to PDF...');

      // Read input
      const html = await readInput(input);

      // Read custom CSS if provided
      let customCSS: string | undefined;
      if (options.css) {
        customCSS = fs.readFileSync(options.css, 'utf-8');
      }

      // Build PDF options
      const pdfOptions: PDFOptions = {
        outputPath: options.output,
        format: options.format as any,
        landscape: options.landscape,
        printBackground: options.background !== false,
        margin: {
          top: options.marginTop,
          right: options.marginRight,
          bottom: options.marginBottom,
          left: options.marginLeft
        },
        scale: parseFloat(options.scale),
        debug: options.debug,
        customCSS,
        waitForSelector: options.wait
      };

      if (options.header) {
        pdfOptions.displayHeaderFooter = true;
        pdfOptions.headerTemplate = options.header;
      }

      if (options.footer) {
        pdfOptions.displayHeaderFooter = true;
        pdfOptions.footerTemplate = options.footer;
      }

      // Add watermark if provided
      if (options.watermarkText || options.watermarkImage) {
        pdfOptions.watermark = {
          text: options.watermarkText,
          image: options.watermarkImage,
          position: options.watermarkPosition as any,
          opacity: parseFloat(options.watermarkOpacity),
          fontSize: parseInt(options.watermarkFontSize),
          color: options.watermarkColor,
          rotation: parseInt(options.watermarkRotation),
          repeat: options.watermarkRepeat
        };
      }

      // Show progress
      pdfOptions.onProgress = (progress) => {
        console.log(`  ${progress.percentage}% - ${progress.step}`);
      };

      // Convert
      const result = await flexdoc.toPDF(html, pdfOptions);

      if (result.success) {
        console.log(`✅ PDF created successfully!`);
        console.log(`   File: ${result.filePath}`);
        console.log(`   Size: ${formatBytes(result.size || 0)}`);
        console.log(`   Duration: ${result.duration}ms`);
      } else {
        console.error(`❌ Conversion failed: ${result.error}`);
        process.exit(1);
      }
    } catch (error) {
      console.error(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      process.exit(1);
    }
  });

// PPTX Command
program
  .command('pptx')
  .description('Convert HTML to PPTX')
  .argument('<input>', 'Input HTML file or URL')
  .option('-o, --output <path>', 'Output PPTX file path', 'output.pptx')
  .option('-l, --layout <layout>', 'Slide layout (16x9, 16x10, 4x3)', '16x9')
  .option('-s, --split <element>', 'Element to split slides by (h1, h2, h3, hr)', 'h2')
  .option('-t, --title <title>', 'Presentation title')
  .option('-a, --author <author>', 'Presentation author')
  .option('-c, --company <company>', 'Company name')
  .option('--theme <theme>', 'Theme preset ID or name (corporate-blue, dark-mode, tech-purple, etc.)', 'corporate-blue')
  .option('--theme-file <file>', 'Custom theme JSON file')
  .option('--primary-color <color>', 'Override theme primary color (hex)')
  .option('--no-images', 'Exclude images from slides')
  .option('--max-content <chars>', 'Max characters per slide', '500')
  .option('--no-auto-charts', 'Disable automatic chart generation from tables')
  .option('--chart-types <types>', 'Preferred chart types (comma-separated: bar,line,pie,area,scatter)', '')
  .option('--chart-position <position>', 'Chart position (replace, alongside, both)', 'replace')
  .option('--css <file>', 'Custom CSS file to inject')
  .option('--debug', 'Enable debug mode')
  .action(async (input, options) => {
    try {
      console.log('🔄 Converting HTML to PPTX...');

      // Read input
      const html = await readInput(input);

      // Read custom CSS if provided
      let customCSS: string | undefined;
      if (options.css) {
        customCSS = fs.readFileSync(options.css, 'utf-8');
      }

      // Load theme if theme-file is provided
      let theme: any = options.theme;
      if (options.themeFile) {
        const { ThemeManager } = await import('./themes');
        theme = ThemeManager.loadThemeFromFile(options.themeFile);
        console.log(`✅ Loaded custom theme from ${options.themeFile}`);
      }

      // Build PPTX options
      const pptxOptions: PPTXOptions = {
        outputPath: options.output,
        layout: options.layout as any,
        splitBy: options.split,
        title: options.title,
        author: options.author,
        company: options.company,
        theme,
        themeOptions: options.primaryColor ? {
          primaryColor: options.primaryColor
        } : undefined,
        includeImages: options.images !== false,
        maxContentPerSlide: parseInt(options.maxContent),
        autoCharts: options.autoCharts !== false,
        chartOptions: {
          preferredTypes: options.chartTypes ? options.chartTypes.split(',').map((t: string) => t.trim()) : undefined,
          position: options.chartPosition as any
        },
        debug: options.debug,
        customCSS
      };

      // Show progress
      pptxOptions.onProgress = (progress) => {
        console.log(`  ${progress.percentage}% - ${progress.step}`);
      };

      // Convert
      const result = await flexdoc.toPPTX(html, pptxOptions);

      if (result.success) {
        console.log(`✅ PPTX created successfully!`);
        console.log(`   File: ${result.filePath}`);
        console.log(`   Size: ${formatBytes(result.size || 0)}`);
        console.log(`   Slides: ${result.metadata?.slideCount || 'N/A'}`);
        console.log(`   Duration: ${result.duration}ms`);
      } else {
        console.error(`❌ Conversion failed: ${result.error}`);
        process.exit(1);
      }
    } catch (error) {
      console.error(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      process.exit(1);
    }
  });

// DOCX Command
program
  .command('docx')
  .description('Convert HTML to Word document (DOCX)')
  .argument('<input>', 'Input HTML file or URL')
  .option('-o, --output <path>', 'Output DOCX file path', 'output.docx')
  .option('-t, --title <title>', 'Document title')
  .option('-a, --author <author>', 'Document author')
  .option('-c, --company <company>', 'Company name')
  .option('-s, --subject <subject>', 'Document subject')
  .option('--orientation <orientation>', 'Page orientation (portrait, landscape)', 'portrait')
  .option('--page-size <size>', 'Page size (A4, A3, Letter, Legal, Tabloid)', 'A4')
  .option('--theme <theme>', 'Theme preset ID or name (corporate-blue, dark-mode, tech-purple, etc.)', 'corporate-blue')
  .option('--theme-file <file>', 'Custom theme JSON file')
  .option('--primary-color <color>', 'Override theme primary color (hex)')
  .option('--font-family <font>', 'Body text font family')
  .option('--font-size <size>', 'Body text font size', '11')
  .option('--line-spacing <spacing>', 'Line spacing (e.g., 1.15, 1.5, 2.0)', '1.15')
  .option('--header-text <text>', 'Header text')
  .option('--footer-text <text>', 'Footer text')
  .option('--page-numbers', 'Include page numbers in footer', false)
  .option('--toc', 'Include table of contents', false)
  .option('--toc-depth <depth>', 'TOC heading depth (1-6)', '3')
  .option('--margin-top <twips>', 'Top margin in twips (1/1440 inch)', '1440')
  .option('--margin-right <twips>', 'Right margin in twips', '1440')
  .option('--margin-bottom <twips>', 'Bottom margin in twips', '1440')
  .option('--margin-left <twips>', 'Left margin in twips', '1440')
  .option('--css <file>', 'Custom CSS file to inject')
  .option('--debug', 'Enable debug mode')
  .action(async (input, options) => {
    try {
      console.log('🔄 Converting HTML to DOCX...');

      // Read input
      const html = await readInput(input);

      // Read custom CSS if provided
      let customCSS: string | undefined;
      if (options.css) {
        customCSS = fs.readFileSync(options.css, 'utf-8');
      }

      // Load theme if theme-file is provided
      let theme: any = options.theme;
      if (options.themeFile) {
        const { ThemeManager } = await import('./themes');
        theme = ThemeManager.loadThemeFromFile(options.themeFile);
        console.log(`✅ Loaded custom theme from ${options.themeFile}`);
      }

      // Build DOCX options
      const docxOptions: DOCXOptions = {
        outputPath: options.output,
        title: options.title,
        author: options.author,
        company: options.company,
        subject: options.subject,
        orientation: options.orientation as any,
        pageSize: options.pageSize as any,
        theme,
        themeOptions: options.primaryColor ? {
          primaryColor: options.primaryColor
        } : undefined,
        fontFamily: options.fontFamily,
        fontSize: parseInt(options.fontSize),
        lineSpacing: parseFloat(options.lineSpacing),
        margins: {
          top: parseInt(options.marginTop),
          right: parseInt(options.marginRight),
          bottom: parseInt(options.marginBottom),
          left: parseInt(options.marginLeft)
        },
        includeTableOfContents: options.toc,
        tocDepth: parseInt(options.tocDepth),
        debug: options.debug
      };

      // Add header if provided
      if (options.headerText) {
        docxOptions.header = {
          text: options.headerText,
          alignment: 'left'
        };
      }

      // Add footer if provided
      if (options.footerText || options.pageNumbers) {
        docxOptions.footer = {
          text: options.footerText,
          includePageNumber: options.pageNumbers,
          alignment: 'center'
        };
      }

      // Show progress
      docxOptions.onProgress = (progress) => {
        console.log(`  ${progress.percentage}% - ${progress.step}`);
      };

      // Convert
      const result = await flexdoc.toWord(html, docxOptions);

      if (result.success) {
        console.log(`✅ DOCX created successfully!`);
        console.log(`   File: ${result.filePath}`);
        console.log(`   Size: ${formatBytes(result.size || 0)}`);
        console.log(`   Pages: ~${result.metadata?.pageCount || 'N/A'}`);
        console.log(`   Duration: ${result.duration}ms`);
      } else {
        console.error(`❌ Conversion failed: ${result.error}`);
        process.exit(1);
      }
    } catch (error) {
      console.error(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      process.exit(1);
    }
  });

// Batch Command
program
  .command('batch')
  .description('Convert multiple files using a JSON config')
  .argument('<config>', 'JSON configuration file')
  .option('--debug', 'Enable debug mode')
  .action(async (configFile, options) => {
    try {
      console.log('🔄 Running batch conversion...');

      // Read config
      const configContent = fs.readFileSync(configFile, 'utf-8');
      const config = JSON.parse(configContent);

      if (!Array.isArray(config.items)) {
        throw new Error('Config must have an "items" array');
      }

      // Process items
      const items = await Promise.all(
        config.items.map(async (item: any) => {
          const html = await readInput(item.input);
          return {
            html,
            format: item.format === 'pdf' ? OutputFormat.PDF : OutputFormat.PPTX,
            options: {
              ...item.options,
              debug: options.debug
            }
          };
        })
      );

      // Convert
      const result = await flexdoc.convertBatch(items);

      console.log(`\n✅ Batch conversion complete!`);
      console.log(`   Total: ${result.total}`);
      console.log(`   Successful: ${result.successful}`);
      console.log(`   Failed: ${result.failed}`);
      console.log(`   Duration: ${result.duration}ms`);

      if (result.failed > 0) {
        console.log('\n⚠️  Failed conversions:');
        result.results.forEach((r, i) => {
          if (!r.result.success) {
            console.log(`   ${i + 1}. ${r.result.error}`);
          }
        });
      }
    } catch (error) {
      console.error(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      process.exit(1);
    }
  });

// Info Command
program
  .command('info')
  .description('Display system and library information')
  .action(() => {
    console.log('\n📦 FlexDoc Information');
    console.log('========================');
    console.log(`Version: ${packageJson.version}`);
    console.log(`Node: ${process.version}`);
    console.log(`Platform: ${process.platform}`);
    console.log(`Architecture: ${process.arch}`);
    console.log('\nSupported Formats:');
    console.log('  - PDF (via Puppeteer)');
    console.log('  - PPTX (via PptxGenJS)');
    console.log('  - DOCX (via docx library)');
    console.log('\nFor help: flexdoc --help');
    console.log('For themes: flexdoc themes');
    console.log('Documentation: https://github.com/yourusername/flexdoc\n');
  });

// Themes Command
program
  .command('themes')
  .description('List all available theme presets')
  .option('--category <category>', 'Filter by category (business, tech, creative, academic, etc.)')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    const { ThemeManager } = await import('./themes');

    let presets = ThemeManager.listPresets();

    if (options.category) {
      presets = ThemeManager.getThemesByCategory(options.category).map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        category: p.category
      }));
    }

    if (options.json) {
      console.log(JSON.stringify(presets, null, 2));
      return;
    }

    console.log('\n🎨 Available Theme Presets');
    console.log('==========================\n');

    // Group by category
    const grouped: Record<string, typeof presets> = {};
    presets.forEach(p => {
      if (!grouped[p.category]) grouped[p.category] = [];
      grouped[p.category].push(p);
    });

    Object.entries(grouped).forEach(([category, themes]) => {
      console.log(`📁 ${category.toUpperCase()}`);
      themes.forEach(theme => {
        console.log(`  • ${theme.id.padEnd(25)} - ${theme.name}`);
        console.log(`    ${theme.description}`);
      });
      console.log('');
    });

    console.log('Usage: flexdoc pptx input.html --theme <theme-id>');
    console.log('Example: flexdoc pptx input.html --theme tech-purple\n');
  });

/**
 * Helper: Read input from file or URL
 */
async function readInput(input: string): Promise<string | { url?: string; filePath?: string }> {
  // Check if it's a URL
  if (input.startsWith('http://') || input.startsWith('https://')) {
    return { url: input };
  }

  // Check if it's a file
  if (fs.existsSync(input)) {
    const ext = path.extname(input).toLowerCase();
    if (ext === '.html' || ext === '.htm') {
      return { filePath: input };
    } else {
      // Read as HTML content
      return fs.readFileSync(input, 'utf-8');
    }
  }

  // Treat as HTML string
  return input;
}

/**
 * Helper: Format bytes to human-readable size
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Parse command line arguments
program.parse(process.argv);

// Show help if no arguments
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

#!/usr/bin/env node

/**
 * FlexDoc CLI - Command-line interface for HTML to PDF/PPTX conversion
 */

import { Command } from 'commander';
import { FlexDoc, OutputFormat, PDFOptions, PPTXOptions } from './index';
import * as fs from 'fs';
import * as path from 'path';

const program = new Command();
const flexdoc = new FlexDoc();

// Package version
const packageJson = require('../package.json');

program
  .name('flexdoc')
  .description('Convert HTML to PDF or PPTX formats')
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
  .option('--theme <theme>', 'Theme (default, dark, corporate, creative)', 'default')
  .option('--no-images', 'Exclude images from slides')
  .option('--max-content <chars>', 'Max characters per slide', '500')
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

      // Build PPTX options
      const pptxOptions: PPTXOptions = {
        outputPath: options.output,
        layout: options.layout as any,
        splitBy: options.split,
        title: options.title,
        author: options.author,
        company: options.company,
        theme: options.theme as any,
        includeImages: options.images !== false,
        maxContentPerSlide: parseInt(options.maxContent),
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
    console.log('\nFor help: flexdoc --help');
    console.log('Documentation: https://github.com/yourusername/flexdoc\n');
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

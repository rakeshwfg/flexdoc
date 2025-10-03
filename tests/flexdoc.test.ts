/**
 * FlexDoc Main Class Tests
 */

import { FlexDoc, OutputFormat, FlexDocError, ErrorType } from '../src';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('FlexDoc', () => {
  let flexdoc: FlexDoc;
  const testOutputDir = path.join(__dirname, 'test-output');

  beforeAll(async () => {
    // Create test output directory
    await fs.mkdir(testOutputDir, { recursive: true });
  });

  beforeEach(() => {
    flexdoc = new FlexDoc();
  });

  afterAll(async () => {
    // Clean up test output directory
    await fs.rm(testOutputDir, { recursive: true, force: true });
  });

  describe('Initialization', () => {
    test('should create FlexDoc instance', () => {
      expect(flexdoc).toBeInstanceOf(FlexDoc);
    });

    test('should have all required methods', () => {
      expect(flexdoc.convert).toBeDefined();
      expect(flexdoc.toPDF).toBeDefined();
      expect(flexdoc.toPPTX).toBeDefined();
      expect(flexdoc.batchConvert).toBeDefined();
      expect(flexdoc.convertWithRetry).toBeDefined();
    });

    test('should return supported formats', () => {
      const formats = flexdoc.getSupportedFormats();
      expect(formats).toContain(OutputFormat.PDF);
      expect(formats).toContain(OutputFormat.PPTX);
    });

    test('should return version', () => {
      const version = flexdoc.getVersion();
      expect(version).toBe('1.0.0');
    });
  });

  describe('Input Validation', () => {
    test('should validate valid HTML string', () => {
      expect(() => flexdoc.validateInput('<h1>Test</h1>')).not.toThrow();
    });

    test('should validate valid HTML input object', () => {
      expect(() => flexdoc.validateInput({ content: '<h1>Test</h1>' })).not.toThrow();
      expect(() => flexdoc.validateInput({ url: 'https://example.com' })).not.toThrow();
      expect(() => flexdoc.validateInput({ filePath: './test.html' })).not.toThrow();
    });

    test('should throw error for empty input', () => {
      expect(() => flexdoc.validateInput('')).toThrow(FlexDocError);
      expect(() => flexdoc.validateInput('   ')).toThrow(FlexDocError);
    });

    test('should throw error for invalid input object', () => {
      expect(() => flexdoc.validateInput({} as any)).toThrow(FlexDocError);
    });
  });

  describe('PDF Conversion', () => {
    test('should convert simple HTML to PDF buffer', async () => {
      const html = '<h1>Test PDF</h1><p>This is a test document.</p>';
      const result = await flexdoc.toPDF(html);

      expect(result.success).toBe(true);
      expect(result.format).toBe('pdf');
      expect(result.buffer).toBeInstanceOf(Buffer);
      expect(result.size).toBeGreaterThan(0);
      expect(result.duration).toBeGreaterThan(0);
    });

    test('should convert HTML to PDF file', async () => {
      const html = '<h1>Test PDF File</h1>';
      const outputPath = path.join(testOutputDir, 'test.pdf');
      
      const result = await flexdoc.toPDF(html, { outputPath });

      expect(result.success).toBe(true);
      expect(result.filePath).toBe(outputPath);
      expect(result.buffer).toBeUndefined();

      // Verify file exists
      const fileExists = await fs.access(outputPath).then(() => true).catch(() => false);
      expect(fileExists).toBe(true);
    });

    test('should apply PDF options', async () => {
      const html = '<h1>Custom PDF</h1>';
      const result = await flexdoc.toPDF(html, {
        format: 'A3',
        landscape: true,
        printBackground: false,
        scale: 0.8
      });

      expect(result.success).toBe(true);
      expect(result.metadata?.options.format).toBe('A3');
      expect(result.metadata?.options.landscape).toBe(true);
    });

    test('should handle progress callback', async () => {
      const html = '<h1>Progress Test</h1>';
      const progressUpdates: any[] = [];

      await flexdoc.toPDF(html, {
        onProgress: (progress) => {
          progressUpdates.push(progress);
        }
      });

      expect(progressUpdates.length).toBeGreaterThan(0);
      expect(progressUpdates[0].percentage).toBe(0);
      expect(progressUpdates[progressUpdates.length - 1].percentage).toBe(100);
    });
  });

  describe('PPTX Conversion', () => {
    test('should convert simple HTML to PPTX buffer', async () => {
      const html = '<h1>Slide 1</h1><h2>Slide 2</h2><p>Content</p>';
      const result = await flexdoc.toPPTX(html);

      expect(result.success).toBe(true);
      expect(result.format).toBe('pptx');
      expect(result.buffer).toBeInstanceOf(Buffer);
      expect(result.size).toBeGreaterThan(0);
      expect(result.metadata?.slideCount).toBeGreaterThan(0);
    });

    test('should convert HTML to PPTX file', async () => {
      const html = '<h1>Test Presentation</h1>';
      const outputPath = path.join(testOutputDir, 'test.pptx');
      
      const result = await flexdoc.toPPTX(html, { outputPath });

      expect(result.success).toBe(true);
      expect(result.filePath).toBe(outputPath);

      // Verify file exists
      const fileExists = await fs.access(outputPath).then(() => true).catch(() => false);
      expect(fileExists).toBe(true);
    });

    test('should split slides by specified element', async () => {
      const html = `
        <h1>Title 1</h1>
        <p>Content 1</p>
        <h1>Title 2</h1>
        <p>Content 2</p>
        <h1>Title 3</h1>
        <p>Content 3</p>
      `;

      const result = await flexdoc.toPPTX(html, {
        splitBy: 'h1'
      });

      expect(result.success).toBe(true);
      expect(result.metadata?.slideCount).toBe(3);
    });

    test('should apply PPTX theme', async () => {
      const html = '<h1>Themed Presentation</h1>';
      const result = await flexdoc.toPPTX(html, {
        title: 'Test Presentation',
        author: 'Test Author',
        theme: 'corporate',
        template: {
          primary: '#FF0000',
          secondary: '#00FF00',
          background: '#FFFFFF',
          textColor: '#000000'
        }
      });

      expect(result.success).toBe(true);
      expect(result.metadata?.options?.title).toBe('Test Presentation');
    });
  });

  describe('Unified Convert Method', () => {
    test('should convert to PDF using unified API', async () => {
      const html = '<h1>Unified PDF</h1>';
      const result = await flexdoc.convert(html, {
        format: OutputFormat.PDF,
        pdfOptions: {
          format: 'A4'
        }
      });

      expect(result.success).toBe(true);
      expect(result.format).toBe('pdf');
    });

    test('should convert to PPTX using unified API', async () => {
      const html = '<h1>Unified PPTX</h1>';
      const result = await flexdoc.convert(html, {
        format: OutputFormat.PPTX,
        pptxOptions: {
          layout: '16x9'
        }
      });

      expect(result.success).toBe(true);
      expect(result.format).toBe('pptx');
    });

    test('should throw error for invalid format', async () => {
      const html = '<h1>Invalid Format</h1>';
      
      await expect(flexdoc.convert(html, {
        format: 'invalid' as any
      })).rejects.toThrow(FlexDocError);
    });
  });

  describe('Batch Conversion', () => {
    test('should convert multiple documents', async () => {
      const inputs = [
        {
          html: '<h1>Doc 1</h1>',
          options: { format: OutputFormat.PDF }
        },
        {
          html: '<h1>Doc 2</h1>',
          options: { format: OutputFormat.PPTX }
        }
      ];

      const results = await flexdoc.batchConvert(inputs);

      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(true);
      expect(results[0].format).toBe('pdf');
      expect(results[1].success).toBe(true);
      expect(results[1].format).toBe('pptx');
    });

    test('should handle failures in batch conversion', async () => {
      const inputs = [
        {
          html: '<h1>Valid Doc</h1>',
          options: { format: OutputFormat.PDF }
        },
        {
          html: '',  // Invalid - empty
          options: { format: OutputFormat.PDF }
        }
      ];

      const results = await flexdoc.batchConvert(inputs);

      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(false);
      expect(results[1].error).toBeDefined();
    });
  });

  describe('Retry Logic', () => {
    test('should succeed on first attempt', async () => {
      const html = '<h1>Retry Test</h1>';
      const result = await flexdoc.convertWithRetry(html, {
        format: OutputFormat.PDF
      }, 3);

      expect(result.success).toBe(true);
    });

    // Note: Testing actual retry behavior would require mocking
    // the convert method to fail initially
  });

  describe('Error Handling', () => {
    test('should handle invalid HTML gracefully', async () => {
      await expect(flexdoc.toPDF('')).rejects.toThrow(FlexDocError);
    });

    test('should handle invalid options', async () => {
      const html = '<h1>Test</h1>';
      await expect(flexdoc.toPDF(html, {
        scale: 5  // Invalid scale
      })).rejects.toThrow(FlexDocError);
    });

    test('should provide error details', async () => {
      try {
        await flexdoc.toPDF('');
      } catch (error) {
        expect(error).toBeInstanceOf(FlexDocError);
        expect((error as FlexDocError).type).toBeDefined();
        expect((error as FlexDocError).message).toBeDefined();
      }
    });
  });
});

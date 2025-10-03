/**
 * Basic Usage Example
 * Demonstrates simple HTML to PDF and PPTX conversion
 */

const FlexDoc = require('../dist').FlexDoc;
const fs = require('fs').promises;
const path = require('path');

async function basicExample() {
  // Initialize FlexDoc
  const flexdoc = new FlexDoc();

  // Sample HTML content
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Sample Document</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { color: #2E86C1; }
          h2 { color: #85C1E9; }
          .highlight { background-color: #FEF9E7; padding: 10px; }
        </style>
      </head>
      <body>
        <h1>Welcome to FlexDoc</h1>
        <p>This is a sample document demonstrating FlexDoc's capabilities.</p>
        
        <h2>Features</h2>
        <ul>
          <li>Convert HTML to PDF</li>
          <li>Convert HTML to PPTX</li>
          <li>Support for custom CSS</li>
          <li>Progress tracking</li>
        </ul>
        
        <h2>Benefits</h2>
        <div class="highlight">
          <p>FlexDoc is lightweight, fast, and enterprise-ready.</p>
          <p>It uses only open-source dependencies with no paid services required.</p>
        </div>
        
        <h2>Get Started</h2>
        <p>Install FlexDoc via npm:</p>
        <code>npm install flexdoc</code>
      </body>
    </html>
  `;

  console.log('Starting conversions...\n');

  try {
    // Convert to PDF
    console.log('Converting to PDF...');
    const pdfResult = await flexdoc.toPDF(htmlContent, {
      outputPath: path.join(__dirname, 'output', 'sample.pdf'),
      format: 'A4',
      printBackground: true,
      margin: {
        top: '2cm',
        right: '2cm',
        bottom: '2cm',
        left: '2cm'
      },
      onProgress: (progress) => {
        console.log(`  PDF Progress: ${progress.percentage}% - ${progress.step}`);
      }
    });

    if (pdfResult.success) {
      console.log(`✓ PDF created successfully: ${pdfResult.filePath}`);
      console.log(`  Size: ${(pdfResult.size / 1024).toFixed(2)} KB`);
      console.log(`  Duration: ${pdfResult.duration}ms\n`);
    }

    // Convert to PPTX
    console.log('Converting to PPTX...');
    const pptxResult = await flexdoc.toPPTX(htmlContent, {
      outputPath: path.join(__dirname, 'output', 'sample.pptx'),
      layout: '16x9',
      splitBy: 'h2',
      title: 'FlexDoc Presentation',
      author: 'FlexDoc User',
      company: 'Your Company',
      theme: {
        primary: '#2E86C1',
        secondary: '#85C1E9',
        background: '#FFFFFF',
        textColor: '#333333',
        fontFace: 'Arial',
        fontSize: 14
      },
      onProgress: (progress) => {
        console.log(`  PPTX Progress: ${progress.percentage}% - ${progress.step}`);
      }
    });

    if (pptxResult.success) {
      console.log(`✓ PPTX created successfully: ${pptxResult.filePath}`);
      console.log(`  Size: ${(pptxResult.size / 1024).toFixed(2)} KB`);
      console.log(`  Slides: ${pptxResult.metadata.slideCount}`);
      console.log(`  Duration: ${pptxResult.duration}ms\n`);
    }

    console.log('All conversions completed successfully!');

  } catch (error) {
    console.error('Conversion failed:', error.message);
    if (error.details) {
      console.error('Details:', error.details);
    }
  }
}

// Ensure output directory exists
async function ensureOutputDir() {
  const outputDir = path.join(__dirname, 'output');
  try {
    await fs.mkdir(outputDir, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
}

// Run example
(async () => {
  await ensureOutputDir();
  await basicExample();
})();

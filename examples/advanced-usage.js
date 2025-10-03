/**
 * Advanced Usage Example
 * Demonstrates advanced features like batch conversion, URL input, and custom options
 */

const { FlexDoc, OutputFormat } = require('../dist');
const fs = require('fs').promises;
const path = require('path');

async function advancedExample() {
  const flexdoc = new FlexDoc();

  console.log('=== FlexDoc Advanced Examples ===\n');

  // 1. Convert from URL
  console.log('1. Converting from URL...');
  try {
    const urlResult = await flexdoc.convert({
      url: 'https://example.com'
    }, {
      format: OutputFormat.PDF,
      outputPath: path.join(__dirname, 'output', 'website.pdf'),
      pdfOptions: {
        format: 'A4',
        landscape: true,
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: '<div style="font-size: 10px; text-align: center;">FlexDoc Example</div>',
        footerTemplate: '<div style="font-size: 10px; text-align: center;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>'
      }
    });
    console.log('✓ URL conversion completed\n');
  } catch (error) {
    console.log('⚠ URL conversion skipped (requires internet connection)\n');
  }

  // 2. Convert from File
  console.log('2. Converting from HTML file...');
  const sampleHtmlPath = path.join(__dirname, 'sample.html');
  
  // Create sample HTML file
  await fs.writeFile(sampleHtmlPath, `
    <html>
      <head><title>File Example</title></head>
      <body>
        <h1>Slide 1: Introduction</h1>
        <p>This presentation was created from an HTML file.</p>
        
        <h1>Slide 2: Features</h1>
        <ul>
          <li>File-based input</li>
          <li>Automatic slide splitting</li>
          <li>Theme customization</li>
        </ul>
        
        <h1>Slide 3: Conclusion</h1>
        <p>FlexDoc makes document conversion easy!</p>
      </body>
    </html>
  `);

  const fileResult = await flexdoc.toPPTX({
    filePath: sampleHtmlPath
  }, {
    outputPath: path.join(__dirname, 'output', 'from-file.pptx'),
    splitBy: 'h1',
    layout: '16x9',
    masterSlide: {
      title: 'Master Slide',
      background: { color: 'F0F0F0' }
    }
  });
  console.log('✓ File conversion completed\n');

  // 3. Batch Conversion
  console.log('3. Batch conversion of multiple documents...');
  const batchInputs = [
    {
      html: '<h1>Document 1</h1><p>First document content</p>',
      options: {
        format: OutputFormat.PDF,
        outputPath: path.join(__dirname, 'output', 'batch-1.pdf'),
        pdfOptions: { format: 'A5' }
      }
    },
    {
      html: '<h1>Document 2</h1><p>Second document content</p>',
      options: {
        format: OutputFormat.PPTX,
        outputPath: path.join(__dirname, 'output', 'batch-2.pptx')
      }
    },
    {
      html: '<h1>Document 3</h1><p>Third document content</p>',
      options: {
        format: OutputFormat.PDF,
        outputPath: path.join(__dirname, 'output', 'batch-3.pdf'),
        pdfOptions: { landscape: true }
      }
    }
  ];

  const batchResults = await flexdoc.batchConvert(batchInputs);
  console.log(`✓ Batch conversion completed: ${batchResults.filter(r => r.success).length}/${batchResults.length} successful\n`);

  // 4. Convert with Custom CSS and JavaScript
  console.log('4. Conversion with custom CSS and JavaScript...');
  const customHtml = `
    <html>
      <body>
        <h1>Dynamic Content</h1>
        <div id="dynamic-content">Loading...</div>
        <div class="custom-style">This will be styled</div>
      </body>
    </html>
  `;

  const customResult = await flexdoc.toPDF(customHtml, {
    outputPath: path.join(__dirname, 'output', 'custom-styled.pdf'),
    customCSS: `
      .custom-style {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px;
        border-radius: 10px;
        font-size: 18px;
        font-weight: bold;
      }
    `,
    executeScript: `
      document.getElementById('dynamic-content').innerHTML = 'Content generated at: ' + new Date().toLocaleString();
    `,
    waitForSelector: '#dynamic-content'
  });
  console.log('✓ Custom styled conversion completed\n');

  // 5. Convert with Retry Logic
  console.log('5. Conversion with retry logic...');
  try {
    const retryResult = await flexdoc.convertWithRetry(
      '<h1>Retry Example</h1><p>This conversion will retry on failure</p>',
      {
        format: OutputFormat.PDF,
        outputPath: path.join(__dirname, 'output', 'with-retry.pdf'),
        timeout: 5000
      },
      3 // max retries
    );
    console.log('✓ Conversion with retry completed\n');
  } catch (error) {
    console.log('✗ Conversion failed after retries\n');
  }

  // 6. Generate presentation with multiple slides and images
  console.log('6. Creating presentation with images...');
  const presentationHtml = `
    <html>
      <body>
        <section>
          <h2>Welcome to FlexDoc</h2>
          <p>The flexible document converter</p>
        </section>
        
        <section>
          <h2>Key Features</h2>
          <ul>
            <li>PDF Generation</li>
            <li>PPTX Creation</li>
            <li>Batch Processing</li>
            <li>Custom Styling</li>
          </ul>
        </section>
        
        <section>
          <h2>Architecture</h2>
          <p>Built with TypeScript and modern libraries</p>
          <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZsZXhEb2M8L3RleHQ+PC9zdmc+" alt="FlexDoc Logo"/>
        </section>
        
        <section>
          <h2>Thank You!</h2>
          <p>Visit our GitHub for more information</p>
        </section>
      </body>
    </html>
  `;

  const presentationResult = await flexdoc.toPPTX(presentationHtml, {
    outputPath: path.join(__dirname, 'output', 'presentation.pptx'),
    splitBy: 'section',
    includeImages: true,
    title: 'FlexDoc Advanced Presentation',
    theme: {
      primary: '#1E88E5',
      secondary: '#64B5F6',
      background: '#FAFAFA',
      textColor: '#212121'
    }
  });
  console.log('✓ Presentation with images created\n');

  // Clean up
  await fs.unlink(sampleHtmlPath).catch(() => {});

  console.log('=== All advanced examples completed! ===');
  console.log('Check the ./output directory for generated files.');
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
  await advancedExample();
})().catch(console.error);

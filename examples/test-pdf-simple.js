/**
 * Simple PDF Test
 */

const { FlexDoc } = require('../dist');
const path = require('path');

async function testPDF() {
  const flexdoc = new FlexDoc();

  const simpleHTML = `
    <!DOCTYPE html>
    <html>
      <head><title>Test PDF</title></head>
      <body>
        <h1>Test PDF Document</h1>
        <p>This is a simple test to verify PDF conversion works after dependency updates.</p>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>
      </body>
    </html>
  `;

  try {
    console.log('Testing PDF Conversion...\n');
    const result = await flexdoc.toPDF(simpleHTML, {
      outputPath: path.join(__dirname, 'output', 'test-simple.pdf'),
      format: 'A4'
    });

    console.log('✅ Success!');
    console.log(`   File: ${result.filePath}`);
    console.log(`   Size: ${(result.size / 1024).toFixed(2)} KB`);
    console.log(`   Duration: ${result.duration}ms\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testPDF();

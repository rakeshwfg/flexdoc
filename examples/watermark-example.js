/**
 * Watermark Example
 * Demonstrates PDF watermark functionality
 */

const { FlexDoc } = require('../dist/index');
const path = require('path');

const flexdoc = new FlexDoc();

async function runWatermarkExamples() {
  console.log('🎨 FlexDoc Watermark Examples\n');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Confidential Document</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 40px;
          max-width: 800px;
          margin: 0 auto;
        }
        h1 {
          color: #2c3e50;
          border-bottom: 3px solid #3498db;
          padding-bottom: 10px;
        }
        .section {
          margin: 30px 0;
        }
        p {
          line-height: 1.6;
          color: #34495e;
        }
      </style>
    </head>
    <body>
      <h1>Confidential Business Report</h1>

      <div class="section">
        <h2>Executive Summary</h2>
        <p>This document contains confidential information about Q4 2024 financial performance and strategic initiatives.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      </div>

      <div class="section">
        <h2>Financial Overview</h2>
        <p>Revenue increased by 25% year-over-year, exceeding our projections by $2M. Key growth drivers include:</p>
        <ul>
          <li>Enterprise customer acquisition</li>
          <li>Product line expansion</li>
          <li>International market penetration</li>
        </ul>
      </div>

      <div class="section">
        <h2>Strategic Initiatives</h2>
        <p>For Q1 2025, we are focusing on three main initiatives to sustain our growth trajectory and enhance market position.</p>
      </div>
    </body>
    </html>
  `;

  try {
    // Example 1: Text watermark (diagonal)
    console.log('1️⃣  Creating PDF with diagonal "CONFIDENTIAL" watermark...');
    await flexdoc.toPDF(html, {
      outputPath: path.join(__dirname, '../output/watermark-diagonal.pdf'),
      watermark: {
        text: 'CONFIDENTIAL',
        position: 'diagonal',
        opacity: 0.2,
        fontSize: 80,
        color: '#FF0000'
      }
    });
    console.log('   ✅ Created: output/watermark-diagonal.pdf\n');

    // Example 2: Text watermark (center)
    console.log('2️⃣  Creating PDF with centered "DRAFT" watermark...');
    await flexdoc.toPDF(html, {
      outputPath: path.join(__dirname, '../output/watermark-center.pdf'),
      watermark: {
        text: 'DRAFT',
        position: 'center',
        opacity: 0.15,
        fontSize: 120,
        color: '#999999',
        fontFamily: 'Arial Black'
      }
    });
    console.log('   ✅ Created: output/watermark-center.pdf\n');

    // Example 3: Repeating watermark
    console.log('3️⃣  Creating PDF with repeating watermark pattern...');
    await flexdoc.toPDF(html, {
      outputPath: path.join(__dirname, '../output/watermark-repeat.pdf'),
      watermark: {
        text: 'INTERNAL',
        repeat: true,
        opacity: 0.1,
        fontSize: 40,
        color: '#000000'
      }
    });
    console.log('   ✅ Created: output/watermark-repeat.pdf\n');

    // Example 4: Corner watermark
    console.log('4️⃣  Creating PDF with corner watermark...');
    await flexdoc.toPDF(html, {
      outputPath: path.join(__dirname, '../output/watermark-corner.pdf'),
      watermark: {
        text: 'SAMPLE',
        position: 'top-right',
        opacity: 0.5,
        fontSize: 24,
        color: '#3498db',
        fontWeight: 'bold'
      }
    });
    console.log('   ✅ Created: output/watermark-corner.pdf\n');

    // Example 5: Rotated watermark
    console.log('5️⃣  Creating PDF with rotated watermark...');
    await flexdoc.toPDF(html, {
      outputPath: path.join(__dirname, '../output/watermark-rotated.pdf'),
      watermark: {
        text: 'FOR REVIEW ONLY',
        position: 'center',
        opacity: 0.25,
        fontSize: 60,
        color: '#e74c3c',
        rotation: -30
      }
    });
    console.log('   ✅ Created: output/watermark-rotated.pdf\n');

    console.log('🎉 All watermark examples completed successfully!');
    console.log('\n📁 Check the output folder for generated PDFs');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run examples
runWatermarkExamples();

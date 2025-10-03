/**
 * Simple PPTX Test
 */

const { FlexDoc } = require('../dist');
const path = require('path');

async function testPPTX() {
  const flexdoc = new FlexDoc();

  const simpleHTML = `
    <!DOCTYPE html>
    <html>
      <head><title>Test</title></head>
      <body>
        <section>
          <h1>Welcome</h1>
          <p>This is a simple test presentation.</p>
        </section>

        <section>
          <h2>Key Points</h2>
          <ul>
            <li>Point 1: Easy to use</li>
            <li>Point 2: Professional quality</li>
            <li>Point 3: Free forever</li>
          </ul>
        </section>

        <section>
          <h2>Data Table</h2>
          <table>
            <tr>
              <th>Metric</th>
              <th>Q1</th>
              <th>Q2</th>
            </tr>
            <tr>
              <td>Revenue</td>
              <td>100</td>
              <td>150</td>
            </tr>
            <tr>
              <td>Users</td>
              <td>500</td>
              <td>750</td>
            </tr>
          </table>
        </section>
      </body>
    </html>
  `;

  try {
    console.log('Testing Standard PPTX Conversion...\n');
    const result = await flexdoc.toPPTX(simpleHTML, {
      outputPath: path.join(__dirname, 'output', 'test-simple.pptx'),
      layout: '16x9',
      splitBy: 'section',
      includeImages: true
    });

    console.log('✅ Success!');
    console.log(`   File: ${result.filePath}`);
    console.log(`   Slides: ${result.metadata.slideCount}`);
    console.log(`   Size: ${(result.size / 1024).toFixed(2)} KB`);
    console.log(`   Duration: ${result.duration}ms\n`);

    console.log('Testing Professional PPTX Conversion...\n');
    const professionalResult = await flexdoc.toPPTX(simpleHTML, {
      professional: true,
      outputPath: path.join(__dirname, 'output', 'test-professional.pptx'),
      layout: '16x9',
      theme: 'corporate',
      splitBy: 'section'
    });

    console.log('✅ Professional Success!');
    console.log(`   File: ${professionalResult.filePath}`);
    console.log(`   Slides: ${professionalResult.metadata.slideCount}`);
    console.log(`   Size: ${(professionalResult.size / 1024).toFixed(2)} KB`);
    console.log(`   Duration: ${professionalResult.duration}ms\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testPPTX();

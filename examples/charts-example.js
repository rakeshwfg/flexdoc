/**
 * Charts Example - Automatic Chart Generation from Tables
 * Demonstrates FlexDoc's ability to automatically convert HTML tables to charts in presentations
 */

const { FlexDoc } = require('../dist/index');
const path = require('path');
const fs = require('fs');

async function main() {
  console.log('📊 FlexDoc Charts Example\n');

  const flexdoc = new FlexDoc();

  // Ensure output directory exists
  const outputDir = path.join(__dirname, '../output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Example 1: Sales Data - Converts to Bar Chart
  console.log('Example 1: Sales data (Bar Chart)...');
  const salesHTML = `
    <h1>Quarterly Sales Report</h1>
    <p>Our sales performance across different regions</p>

    <table>
      <tr>
        <th>Region</th>
        <th>Q1 Sales</th>
        <th>Q2 Sales</th>
        <th>Q3 Sales</th>
        <th>Q4 Sales</th>
      </tr>
      <tr>
        <td>North America</td>
        <td>125000</td>
        <td>132000</td>
        <td>145000</td>
        <td>158000</td>
      </tr>
      <tr>
        <td>Europe</td>
        <td>98000</td>
        <td>105000</td>
        <td>112000</td>
        <td>120000</td>
      </tr>
      <tr>
        <td>Asia Pacific</td>
        <td>87000</td>
        <td>95000</td>
        <td>108000</td>
        <td>125000</td>
      </tr>
      <tr>
        <td>Latin America</td>
        <td>45000</td>
        <td>52000</td>
        <td>58000</td>
        <td>67000</td>
      </tr>
    </table>
  `;

  await flexdoc.toPPTX(salesHTML, {
    outputPath: path.join(outputDir, 'charts-sales.pptx'),
    title: 'Sales Report with Auto Charts',
    autoCharts: true, // Enable automatic chart conversion (default)
    theme: 'corporate'
  });
  console.log('✅ Created charts-sales.pptx with bar chart\n');

  // Example 2: Market Share Data - Converts to Pie Chart
  console.log('Example 2: Market share (Pie Chart)...');
  const marketShareHTML = `
    <h1>Market Share Analysis 2024</h1>

    <table>
      <tr>
        <th>Company</th>
        <th>Market Share %</th>
      </tr>
      <tr>
        <td>Company A</td>
        <td>35</td>
      </tr>
      <tr>
        <td>Company B</td>
        <td>28</td>
      </tr>
      <tr>
        <td>Company C</td>
        <td>18</td>
      </tr>
      <tr>
        <td>Company D</td>
        <td>12</td>
      </tr>
      <tr>
        <td>Others</td>
        <td>7</td>
      </tr>
    </table>
  `;

  await flexdoc.toPPTX(marketShareHTML, {
    outputPath: path.join(outputDir, 'charts-market-share.pptx'),
    title: 'Market Share Analysis',
    autoCharts: true,
    theme: 'corporate'
  });
  console.log('✅ Created charts-market-share.pptx with pie chart\n');

  // Example 3: Time Series Data - Converts to Line Chart
  console.log('Example 3: Time series data (Line Chart)...');
  const timeSeriesHTML = `
    <h1>Revenue Growth Over Time</h1>

    <table>
      <tr>
        <th>Year</th>
        <th>Revenue (millions)</th>
        <th>Profit (millions)</th>
      </tr>
      <tr>
        <td>2019</td>
        <td>150</td>
        <td>25</td>
      </tr>
      <tr>
        <td>2020</td>
        <td>175</td>
        <td>32</td>
      </tr>
      <tr>
        <td>2021</td>
        <td>210</td>
        <td>45</td>
      </tr>
      <tr>
        <td>2022</td>
        <td>265</td>
        <td>62</td>
      </tr>
      <tr>
        <td>2023</td>
        <td>320</td>
        <td>85</td>
      </tr>
      <tr>
        <td>2024</td>
        <td>385</td>
        <td>108</td>
      </tr>
    </table>
  `;

  await flexdoc.toPPTX(timeSeriesHTML, {
    outputPath: path.join(outputDir, 'charts-time-series.pptx'),
    title: 'Revenue Growth',
    autoCharts: true,
    theme: 'corporate'
  });
  console.log('✅ Created charts-time-series.pptx with line chart\n');

  // Example 4: Multiple Charts in One Presentation
  console.log('Example 4: Multiple charts in one presentation...');
  const multiChartHTML = `
    <h1>Business Performance Dashboard</h1>

    <h2>Revenue by Product Line</h2>
    <table>
      <tr>
        <th>Product</th>
        <th>Revenue</th>
      </tr>
      <tr>
        <td>Software Licenses</td>
        <td>5200000</td>
      </tr>
      <tr>
        <td>Cloud Services</td>
        <td>3800000</td>
      </tr>
      <tr>
        <td>Consulting</td>
        <td>2100000</td>
      </tr>
      <tr>
        <td>Training</td>
        <td>900000</td>
      </tr>
    </table>

    <h2>Customer Satisfaction Scores</h2>
    <table>
      <tr>
        <th>Quarter</th>
        <th>Score</th>
      </tr>
      <tr>
        <td>Q1</td>
        <td>87</td>
      </tr>
      <tr>
        <td>Q2</td>
        <td>89</td>
      </tr>
      <tr>
        <td>Q3</td>
        <td>91</td>
      </tr>
      <tr>
        <td>Q4</td>
        <td>93</td>
      </tr>
    </table>

    <h2>Employee Count by Department</h2>
    <table>
      <tr>
        <th>Department</th>
        <th>Employees</th>
      </tr>
      <tr>
        <td>Engineering</td>
        <td>145</td>
      </tr>
      <tr>
        <td>Sales</td>
        <td>78</td>
      </tr>
      <tr>
        <td>Marketing</td>
        <td>42</td>
      </tr>
      <tr>
        <td>Operations</td>
        <td>35</td>
      </tr>
      <tr>
        <td>HR</td>
        <td>18</td>
      </tr>
    </table>
  `;

  await flexdoc.toPPTX(multiChartHTML, {
    outputPath: path.join(outputDir, 'charts-dashboard.pptx'),
    title: 'Business Dashboard',
    splitBy: 'h2',
    autoCharts: true,
    theme: 'corporate'
  });
  console.log('✅ Created charts-dashboard.pptx with multiple charts\n');

  // Example 5: Disable Auto Charts (Keep Tables)
  console.log('Example 5: Disable auto charts (keep as tables)...');
  await flexdoc.toPPTX(salesHTML, {
    outputPath: path.join(outputDir, 'charts-disabled.pptx'),
    title: 'Sales Report with Tables',
    autoCharts: false, // Disable automatic chart conversion
    theme: 'corporate'
  });
  console.log('✅ Created charts-disabled.pptx with tables (no charts)\n');

  // Example 6: Chart with Specific Preferences
  console.log('Example 6: Chart with preferred types...');
  await flexdoc.toPPTX(salesHTML, {
    outputPath: path.join(outputDir, 'charts-preferred-type.pptx'),
    title: 'Sales Report',
    autoCharts: true,
    chartOptions: {
      preferredTypes: ['line', 'area'], // Prefer line/area charts
      position: 'replace' // Replace table with chart
    },
    theme: 'corporate'
  });
  console.log('✅ Created charts-preferred-type.pptx with preferred chart types\n');

  // Example 7: Show Both Chart and Table
  console.log('Example 7: Show both chart and table...');
  await flexdoc.toPPTX(marketShareHTML, {
    outputPath: path.join(outputDir, 'charts-both.pptx'),
    title: 'Market Share',
    autoCharts: true,
    chartOptions: {
      position: 'both' // Show both chart and original table
    },
    theme: 'corporate'
  });
  console.log('✅ Created charts-both.pptx with both chart and table\n');

  console.log('🎉 All chart examples completed!');
  console.log(`\n📁 Check the output directory: ${outputDir}`);
  console.log('\n💡 Key Features Demonstrated:');
  console.log('   • Automatic table-to-chart conversion');
  console.log('   • Smart chart type detection (bar, pie, line)');
  console.log('   • Multiple charts in one presentation');
  console.log('   • Chart preferences and customization');
  console.log('   • Option to keep tables instead of charts');
  console.log('   • Show both charts and tables together');
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});

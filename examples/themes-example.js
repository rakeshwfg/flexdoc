/**
 * Themes Example - Advanced Theming System
 * Demonstrates FlexDoc's comprehensive theming capabilities
 */

const { FlexDoc, ThemeBuilder, ThemeManager, ThemePresets, ColorUtils } = require('../dist/index');
const path = require('path');
const fs = require('fs');

async function main() {
  console.log('🎨 FlexDoc Themes Example\n');

  const flexdoc = new FlexDoc();

  // Ensure output directory exists
  const outputDir = path.join(__dirname, '../output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const sampleHTML = `
    <h1>Quarterly Business Review</h1>
    <p>Q4 2024 Performance Overview</p>

    <h2>Revenue Growth</h2>
    <p>Our revenue continues to show strong growth across all segments.</p>
    <ul>
      <li>Total revenue: $5.2M (+25% YoY)</li>
      <li>Recurring revenue: $3.8M (+32% YoY)</li>
      <li>New customer acquisition: +150 accounts</li>
    </ul>

    <h2>Market Performance</h2>
    <table>
      <tr>
        <th>Region</th>
        <th>Q3</th>
        <th>Q4</th>
        <th>Growth</th>
      </tr>
      <tr>
        <td>North America</td>
        <td>145000</td>
        <td>158000</td>
        <td>9%</td>
      </tr>
      <tr>
        <td>Europe</td>
        <td>112000</td>
        <td>120000</td>
        <td>7%</td>
      </tr>
      <tr>
        <td>Asia Pacific</td>
        <td>108000</td>
        <td>125000</td>
        <td>16%</td>
      </tr>
    </table>

    <h2>Key Achievements</h2>
    <ul>
      <li>Launched 3 major product features</li>
      <li>Expanded to 2 new markets</li>
      <li>Customer satisfaction: 92%</li>
      <li>Team growth: 25 new hires</li>
    </ul>
  `;

  // Example 1: Using Theme Presets
  console.log('Example 1: Theme presets...');
  const themes = [
    'corporate-blue',
    'tech-purple',
    'creative-pink',
    'dark-mode',
    'startup-orange'
  ];

  for (const themeId of themes) {
    await flexdoc.toPPTX(sampleHTML, {
      outputPath: path.join(outputDir, `theme-${themeId}.pptx`),
      title: `Presentation with ${themeId}`,
      theme: themeId,
      splitBy: 'h2',
      autoCharts: true
    });
    console.log(`  ✅ Created theme-${themeId}.pptx`);
  }

  // Example 2: Custom Theme with ThemeBuilder
  console.log('\nExample 2: Custom theme with ThemeBuilder...');
  const customTheme = new ThemeBuilder('My Brand Theme')
    .setDescription('Custom branded theme for our company')
    .setPrimaryColor('#6366F1')
    .setFontPairing('Modern Professional')
    .setShadows(true)
    .setGradients(true)
    .setAnimations('subtle')
    .build();

  await flexdoc.toPPTX(sampleHTML, {
    outputPath: path.join(outputDir, 'theme-custom-builder.pptx'),
    title: 'Custom Built Theme',
    theme: customTheme,
    splitBy: 'h2'
  });
  console.log('  ✅ Created theme-custom-builder.pptx');

  // Example 3: Theme with Quick Customization
  console.log('\nExample 3: Theme with quick customization...');
  await flexdoc.toPPTX(sampleHTML, {
    outputPath: path.join(outputDir, 'theme-customized.pptx'),
    title: 'Customized Theme',
    theme: 'corporate-blue',
    themeOptions: {
      primaryColor: '#DB2777', // Override to pink
      enableEffects: true
    },
    splitBy: 'h2'
  });
  console.log('  ✅ Created theme-customized.pptx');

  // Example 4: Color Harmony Themes
  console.log('\nExample 4: Color harmony themes...');
  const baseColor = '#3B82F6';
  const harmonies = ['complementary', 'analogous', 'triadic'];

  for (const harmony of harmonies) {
    const harmonyTheme = new ThemeBuilder(`${harmony} Theme`)
      .setColorHarmony(baseColor, harmony)
      .setFontPairing('Clean & Minimal')
      .build();

    await flexdoc.toPPTX(sampleHTML, {
      outputPath: path.join(outputDir, `theme-${harmony}.pptx`),
      title: `${harmony} Color Harmony`,
      theme: harmonyTheme,
      splitBy: 'h2'
    });
    console.log(`  ✅ Created theme-${harmony}.pptx`);
  }

  // Example 5: Dark Mode Theme
  console.log('\nExample 5: Dark mode theme...');
  const darkTheme = new ThemeBuilder('Dark Professional')
    .setPrimaryColor('#3B82F6')
    .setFontPairing('Modern Professional')
    .setShadows(true, 0.5)
    .setGradients(true)
    .convertToDarkMode()
    .build();

  await flexdoc.toPPTX(sampleHTML, {
    outputPath: path.join(outputDir, 'theme-dark-custom.pptx'),
    title: 'Dark Mode Presentation',
    theme: darkTheme,
    splitBy: 'h2'
  });
  console.log('  ✅ Created theme-dark-custom.pptx');

  // Example 6: Save and Load Theme
  console.log('\nExample 6: Save and load theme...');
  const brandTheme = new ThemeBuilder('Acme Corp Brand')
    .setPrimaryColor('#FF6B6B')
    .setFontPairing('Bold Statement')
    .setShadows(true)
    .setCompanyBranding('Acme Corp', undefined, 'Innovation Through Technology')
    .build();

  // Save theme to JSON
  const themePath = path.join(outputDir, 'acme-brand-theme.json');
  ThemeManager.saveThemeToFile(brandTheme, themePath);
  console.log(`  ✅ Saved theme to ${themePath}`);

  // Load and use theme
  const loadedTheme = ThemeManager.loadThemeFromFile(themePath);
  await flexdoc.toPPTX(sampleHTML, {
    outputPath: path.join(outputDir, 'theme-loaded.pptx'),
    title: 'Loaded from File',
    theme: loadedTheme,
    splitBy: 'h2'
  });
  console.log('  ✅ Created theme-loaded.pptx');

  // Example 7: Browse Available Themes
  console.log('\nExample 7: Browse available themes...');
  const allPresets = ThemeManager.listPresets();
  console.log(`  Available themes: ${allPresets.length}`);

  // Group by category
  const byCategory: Record<string, number> = {};
  allPresets.forEach(p => {
    byCategory[p.category] = (byCategory[p.category] || 0) + 1;
  });

  console.log('  By category:');
  Object.entries(byCategory).forEach(([cat, count]) => {
    console.log(`    • ${cat}: ${count} themes`);
  });

  // Example 8: Advanced Theme Customization
  console.log('\nExample 8: Advanced theme customization...');
  const advancedTheme = new ThemeBuilder('Advanced Custom')
    .setPrimaryColor('#7C3AED')
    .setFonts('Montserrat', 'Inter', 'Playfair Display')
    .setColors({
      primary: '#7C3AED',
      secondary: '#6366F1',
      accent: '#F59E0B',
      background: '#FFFFFF',
      surface: '#F9FAFB',
      text: '#1F2937',
      textSecondary: '#6B7280'
    })
    .setEffects({
      shadows: true,
      shadowIntensity: 0.3,
      gradients: true,
      animations: 'energetic',
      borders: 'minimal',
      corners: 'rounded'
    })
    .build();

  await flexdoc.toPPTX(sampleHTML, {
    outputPath: path.join(outputDir, 'theme-advanced.pptx'),
    title: 'Advanced Customization',
    theme: advancedTheme,
    splitBy: 'h2'
  });
  console.log('  ✅ Created theme-advanced.pptx');

  // Example 9: Theme Validation
  console.log('\nExample 9: Theme validation...');
  const testTheme = new ThemeBuilder('Test Theme')
    .setPrimaryColor('#3B82F6')
    .setFontPairing('Modern Professional');

  const validation = testTheme.validate();
  if (validation.valid) {
    console.log('  ✅ Theme is valid and accessible');
  } else {
    console.log('  ⚠️  Theme has warnings:');
    validation.warnings.forEach(w => console.log(`    - ${w}`));
  }

  // Example 10: Color Utilities
  console.log('\nExample 10: Color utilities...');
  const color = '#3B82F6';
  console.log(`  Base color: ${color}`);
  console.log(`  Lighter: ${ColorUtils.lighten(color, 20)}`);
  console.log(`  Darker: ${ColorUtils.darken(color, 20)}`);
  console.log(`  Complementary: ${ColorUtils.complementary(color)}`);
  console.log(`  Is light? ${ColorUtils.isLight(color)}`);
  console.log(`  Contrasting text: ${ColorUtils.getContrastingColor(color)}`);

  const palette = ColorUtils.generatePalette(color, 'triadic');
  console.log(`  Triadic palette: ${palette.colors.join(', ')}`);

  console.log('\n🎉 All theme examples completed!');
  console.log(`\n📁 Check the output directory: ${outputDir}`);
  console.log('\n💡 Key Features Demonstrated:');
  console.log('   • 25+ professional theme presets');
  console.log('   • Custom theme creation with ThemeBuilder');
  console.log('   • Quick theme customization');
  console.log('   • Color harmony generation');
  console.log('   • Dark mode support');
  console.log('   • Theme save/load to JSON');
  console.log('   • Theme browsing and discovery');
  console.log('   • Advanced customization');
  console.log('   • Theme validation');
  console.log('   • Color manipulation utilities');
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});

/**
 * FlexDoc Pro Licensing Example
 *
 * This example demonstrates:
 * 1. Using FlexDoc without a license (Free tier)
 * 2. Using FlexDoc with a Pro license
 * 3. Feature gating and error handling
 * 4. License validation
 *
 * For Pro license, set environment variable:
 *   FLEXDOC_LICENSE_KEY="your-license-key"
 *
 * Or pass license key in constructor
 */

const { FlexDoc } = require('../dist/index');

// Example HTML content
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #2563eb; }
        .highlight { background: #fef3c7; padding: 10px; margin: 10px 0; }
    </style>
</head>
<body>
    <h1>FlexDoc Pro Features Demo</h1>
    <p>This document demonstrates FlexDoc Pro features.</p>

    <div class="highlight">
        <h2>Professional Mode</h2>
        <p>With Pro license, you get ML-powered layout detection for better presentations.</p>
    </div>

    <div class="highlight">
        <h2>Premium Themes</h2>
        <p>Access to 25+ professional themes including corporate-blue, tech-purple, and more.</p>
    </div>

    <div class="highlight">
        <h2>Cloud Storage</h2>
        <p>Direct upload to S3, Azure Blob, and Google Drive.</p>
    </div>
</body>
</html>
`;

async function demonstrateFreeTier() {
    console.log('\n='.repeat(60));
    console.log('1. FREE TIER DEMO');
    console.log('='.repeat(60));

    const flexdoc = new FlexDoc();

    console.log('✅ FlexDoc initialized (Free tier)');
    console.log(`   License tier: ${flexdoc.getLicenseTier()}`);
    console.log(`   License info: ${flexdoc.getLicense() ? 'Active' : 'None'}`);

    // Free tier features work fine
    try {
        console.log('\n📄 Converting to PDF (Free feature)...');
        const result = await flexdoc.toPDF(htmlContent, {
            format: 'A4',
            outputPath: './output/licensing-free-pdf.pdf'
        });
        console.log(`✅ PDF created: ${result.filePath}`);
    } catch (error) {
        console.error('❌ Error:', error.message);
    }

    // Try to use Pro feature - should fail
    try {
        console.log('\n🚫 Attempting to use Pro feature (Professional mode)...');
        await flexdoc.toPPTX(htmlContent, {
            professional: true, // Pro feature
            outputPath: './output/licensing-free-pptx.pptx'
        });
    } catch (error) {
        console.log('❌ Expected error:');
        console.log(error.message);
    }

    // Try to use premium theme - should fail
    try {
        console.log('\n🚫 Attempting to use premium theme...');
        await flexdoc.toPPTX(htmlContent, {
            theme: 'corporate-blue', // Premium theme
            outputPath: './output/licensing-free-theme.pptx'
        });
    } catch (error) {
        console.log('❌ Expected error:');
        console.log(error.message);
    }
}

async function demonstrateProTier() {
    console.log('\n='.repeat(60));
    console.log('2. PRO TIER DEMO');
    console.log('='.repeat(60));

    // Check for license key
    const licenseKey = process.env.FLEXDOC_LICENSE_KEY;

    if (!licenseKey) {
        console.log('\n⚠️  No license key found!');
        console.log('   Set FLEXDOC_LICENSE_KEY environment variable to test Pro features.');
        console.log('   Example: export FLEXDOC_LICENSE_KEY="your-license-key"');
        return;
    }

    // Initialize with license key
    const flexdoc = new FlexDoc({
        licenseKey: licenseKey
    });

    const license = flexdoc.getLicense();

    if (!license) {
        console.log('❌ Invalid license key provided');
        return;
    }

    console.log('✅ FlexDoc Pro activated!');
    console.log(`   License tier: ${license.tier.toUpperCase()}`);
    console.log(`   Licensed to: ${license.email}`);
    if (license.name) console.log(`   Name: ${license.name}`);
    if (license.company) console.log(`   Company: ${license.company}`);
    if (license.expires) {
        console.log(`   Expires: ${new Date(license.expires).toLocaleDateString()}`);
    } else {
        console.log(`   Expires: Never (Lifetime)`);
    }
    console.log(`   Features: ${license.features.length}`);

    // Use Pro features
    try {
        console.log('\n✨ Using Professional Mode...');
        const result = await flexdoc.toPPTX(htmlContent, {
            professional: true, // Pro feature
            outputPath: './output/licensing-pro-professional.pptx',
            splitBy: 'section',
            includeImages: true
        });
        console.log(`✅ Professional PPTX created: ${result.filePath}`);
        console.log(`   Quality: ${result.metadata?.quality || 'standard'}`);
        console.log(`   Enhanced: ${result.metadata?.enhanced || false}`);
    } catch (error) {
        console.error('❌ Error:', error.message);
    }

    try {
        console.log('\n🎨 Using Premium Theme (corporate-blue)...');
        const result = await flexdoc.toPPTX(htmlContent, {
            theme: 'corporate-blue', // Premium theme
            outputPath: './output/licensing-pro-theme.pptx'
        });
        console.log(`✅ Themed PPTX created: ${result.filePath}`);
    } catch (error) {
        console.error('❌ Error:', error.message);
    }

    // Note: Cloud storage requires actual credentials
    console.log('\n☁️  Cloud Storage: Available (requires cloud credentials)');
    console.log('   Supports: AWS S3, Azure Blob, Google Drive');
}

async function demonstrateLicenseValidation() {
    console.log('\n='.repeat(60));
    console.log('3. LICENSE VALIDATION DEMO');
    console.log('='.repeat(60));

    const { LicenseValidator } = require('../dist/licensing');
    const validator = new LicenseValidator();

    // Test with invalid license
    console.log('\n🔍 Testing with invalid license key...');
    const invalidResult = validator.validateLicense('invalid-license-key');
    console.log(`Valid: ${invalidResult.valid}`);
    console.log(`Error: ${invalidResult.error}`);
    console.log(`Error Code: ${invalidResult.errorCode}`);

    // Test with environment variable
    const licenseKey = process.env.FLEXDOC_LICENSE_KEY;
    if (licenseKey) {
        console.log('\n🔍 Validating license from environment...');
        const result = validator.validateLicense(licenseKey);

        if (result.valid && result.license) {
            console.log('✅ License is valid!');
            console.log(validator.getLicenseSummary(result.license));
        } else {
            console.log(`❌ Validation failed: ${result.error}`);
        }
    }

    // Feature checks
    console.log('\n🔍 Feature availability checks:');
    const license = licenseKey ? validator.validateLicense(licenseKey).license : null;

    const features = [
        'professional-mode',
        'premium-themes',
        'cloud-storage',
        'api-server',
        'white-label'
    ];

    features.forEach(feature => {
        const hasFeature = validator.hasFeature(license, feature);
        const icon = hasFeature ? '✅' : '❌';
        console.log(`${icon} ${feature}: ${hasFeature ? 'Available' : 'Requires Pro'}`);
    });

    // Theme checks
    console.log('\n🎨 Theme availability:');
    const themes = ['default', 'corporate-blue', 'tech-purple'];
    themes.forEach(theme => {
        const isPremium = validator.isPremiumTheme(theme);
        const isFree = validator.isFreeTheme(theme);
        if (isFree) {
            console.log(`✅ ${theme}: Free theme`);
        } else if (isPremium) {
            console.log(`⭐ ${theme}: Premium theme (Pro only)`);
        } else {
            console.log(`❓ ${theme}: Unknown theme`);
        }
    });
}

async function demonstrateLicenseOptions() {
    console.log('\n='.repeat(60));
    console.log('4. LICENSE OPTIONS DEMO');
    console.log('='.repeat(60));

    // Option 1: Environment variable
    console.log('\n📌 Option 1: Environment Variable (Recommended for production)');
    console.log('   export FLEXDOC_LICENSE_KEY="your-license-key"');
    console.log('   const flexdoc = new FlexDoc();');

    // Option 2: Constructor
    console.log('\n📌 Option 2: Constructor (Recommended for code)');
    console.log('   const flexdoc = new FlexDoc({');
    console.log('     licenseKey: "your-license-key"');
    console.log('   });');

    // Option 3: Strict validation
    console.log('\n📌 Option 3: Strict Validation (Throw on invalid license)');
    console.log('   const flexdoc = new FlexDoc({');
    console.log('     licenseKey: "your-license-key",');
    console.log('     strictLicenseValidation: true  // Throws error if invalid');
    console.log('   });');

    // Option 4: Suppress warnings
    console.log('\n📌 Option 4: Suppress Warnings');
    console.log('   const flexdoc = new FlexDoc({');
    console.log('     licenseKey: "your-license-key",');
    console.log('     suppressLicenseWarnings: true  // No console output');
    console.log('   });');

    // Demonstrate strict validation
    if (process.env.FLEXDOC_LICENSE_KEY) {
        console.log('\n🔒 Testing strict validation with invalid key...');
        try {
            const strictFlexdoc = new FlexDoc({
                licenseKey: 'invalid-key',
                strictLicenseValidation: true
            });
        } catch (error) {
            console.log('❌ Caught expected error:', error.message);
        }
    }
}

// Main execution
async function main() {
    console.log('\n');
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║                                                            ║');
    console.log('║            FlexDoc Pro Licensing Demo                     ║');
    console.log('║                                                            ║');
    console.log('╚════════════════════════════════════════════════════════════╝');

    // Create output directory
    const fs = require('fs');
    const path = require('path');
    const outputDir = path.join(__dirname, '..', 'output');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    try {
        // Run demonstrations
        await demonstrateFreeTier();
        await demonstrateProTier();
        await demonstrateLicenseValidation();
        await demonstrateLicenseOptions();

        console.log('\n' + '='.repeat(60));
        console.log('SUMMARY');
        console.log('='.repeat(60));
        console.log('✅ Free tier: Basic conversions work');
        console.log('⭐ Pro tier: Professional mode, premium themes, cloud storage');
        console.log('🔒 License validation: JWT-based, offline validation');
        console.log('📚 Documentation: https://github.com/rakeshwfg/flexdoc#pro-features');
        console.log('💳 Get Pro: https://rakeshwfg.github.io/flexdoc/pricing');
        console.log('');

    } catch (error) {
        console.error('\n❌ Error running demo:', error);
        process.exit(1);
    }
}

// Run if executed directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = {
    demonstrateFreeTier,
    demonstrateProTier,
    demonstrateLicenseValidation,
    demonstrateLicenseOptions
};

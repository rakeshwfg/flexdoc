/**
 * Generate Test License Script
 *
 * This script generates a test license for development/testing purposes
 *
 * Usage:
 *   node scripts/generate-test-license.js
 *   node scripts/generate-test-license.js pro "test@example.com" "Test User"
 *   node scripts/generate-test-license.js enterprise "test@example.com" "Test User" "Test Company"
 */

const { LicenseGenerator } = require('../dist/licensing');
const fs = require('fs');
const path = require('path');

// Default test values
const DEFAULT_EMAIL = 'test@flexdoc.dev';
const DEFAULT_NAME = 'Test User';
const DEFAULT_TIER = 'pro';

function printUsage() {
    console.log('Usage:');
    console.log('  node scripts/generate-test-license.js');
    console.log('  node scripts/generate-test-license.js <tier> [email] [name] [company] [days]');
    console.log('');
    console.log('Arguments:');
    console.log('  tier     License tier: pro, enterprise (default: pro)');
    console.log('  email    Customer email (default: test@flexdoc.dev)');
    console.log('  name     Customer name (default: Test User)');
    console.log('  company  Company name (enterprise only)');
    console.log('  days     Duration in days (default: 365 for pro, never for enterprise)');
    console.log('');
    console.log('Examples:');
    console.log('  node scripts/generate-test-license.js');
    console.log('  node scripts/generate-test-license.js pro');
    console.log('  node scripts/generate-test-license.js pro test@example.com');
    console.log('  node scripts/generate-test-license.js pro test@example.com "John Doe"');
    console.log('  node scripts/generate-test-license.js pro test@example.com "John Doe" "" 30');
    console.log('  node scripts/generate-test-license.js enterprise admin@company.com "Admin" "Acme Corp"');
}

async function generateLicense() {
    const args = process.argv.slice(2);

    // Show help
    if (args.includes('--help') || args.includes('-h')) {
        printUsage();
        process.exit(0);
    }

    // Parse arguments
    const tier = (args[0] || DEFAULT_TIER).toLowerCase();
    const email = args[1] || DEFAULT_EMAIL;
    const name = args[2] || DEFAULT_NAME;
    const company = args[3] || undefined;
    const daysStr = args[4];
    const durationDays = daysStr
        ? parseInt(daysStr, 10)
        : tier === 'enterprise'
        ? undefined
        : 365;

    // Validate tier
    if (!['pro', 'enterprise'].includes(tier)) {
        console.error('❌ Error: Invalid tier. Must be "pro" or "enterprise"');
        console.log('');
        printUsage();
        process.exit(1);
    }

    console.log('\n' + '='.repeat(70));
    console.log('🔑 FlexDoc License Generator');
    console.log('='.repeat(70));
    console.log('');

    try {
        // Initialize generator
        console.log('📋 License Details:');
        console.log(`   Tier: ${tier.toUpperCase()}`);
        console.log(`   Email: ${email}`);
        console.log(`   Name: ${name}`);
        if (company) console.log(`   Company: ${company}`);
        console.log(`   Duration: ${durationDays ? `${durationDays} days` : 'Lifetime'}`);
        console.log('');

        console.log('🔧 Generating license...');
        const generator = new LicenseGenerator();

        const licenseKey = generator.generateLicense({
            email,
            name,
            tier,
            company,
            durationDays,
        });

        console.log('');
        console.log(generator.formatLicense(licenseKey));
        console.log('');

        // Save to file
        const outputDir = path.join(__dirname, '..', 'output');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
        const filename = `license-${tier}-${timestamp}.txt`;
        const filepath = path.join(outputDir, filename);

        const fileContent = [
            'FlexDoc License Key',
            '='.repeat(70),
            '',
            `Tier: ${tier.toUpperCase()}`,
            `Email: ${email}`,
            `Name: ${name}`,
            company ? `Company: ${company}` : null,
            `Duration: ${durationDays ? `${durationDays} days` : 'Lifetime'}`,
            `Generated: ${new Date().toISOString()}`,
            '',
            'License Key:',
            '-'.repeat(70),
            licenseKey,
            '-'.repeat(70),
            '',
            'How to use:',
            '',
            '1. Set as environment variable:',
            `   export FLEXDOC_LICENSE_KEY="${licenseKey}"`,
            '',
            '2. Or pass in constructor:',
            '   const flexdoc = new FlexDoc({',
            `     licenseKey: "${licenseKey}"`,
            '   });',
            '',
            '3. Test with example:',
            '   FLEXDOC_LICENSE_KEY="' + licenseKey + '" node examples/licensing-example.js',
            '',
        ]
            .filter(Boolean)
            .join('\n');

        fs.writeFileSync(filepath, fileContent);
        console.log(`💾 License saved to: ${filepath}`);
        console.log('');

        // Show quick setup commands
        console.log('🚀 Quick Setup:');
        console.log('');
        console.log('Option 1: Environment Variable (Recommended)');
        console.log('-'.repeat(70));
        console.log(`export FLEXDOC_LICENSE_KEY="${licenseKey}"`);
        console.log('');
        console.log('Option 2: Test immediately');
        console.log('-'.repeat(70));
        console.log(`FLEXDOC_LICENSE_KEY="${licenseKey}" \\`);
        console.log('  node examples/licensing-example.js');
        console.log('');

        console.log('✅ License generated successfully!');
        console.log('');

    } catch (error) {
        console.error('\n❌ Error generating license:');
        console.error(error.message);
        console.error('');

        if (error.message.includes('Private key not found')) {
            console.log('💡 Tip: Make sure RSA keys are generated:');
            console.log('   ssh-keygen -t rsa -b 2048 -m PEM -f keys/license_key -N ""');
            console.log('');
        }

        process.exit(1);
    }
}

// Run
if (require.main === module) {
    generateLicense().catch(console.error);
}

module.exports = { generateLicense };

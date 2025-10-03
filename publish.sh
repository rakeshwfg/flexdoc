#!/bin/bash

# FlexDoc NPM Publishing Script
# This script helps publish the flexdoc package to npm

echo "========================================="
echo "       FlexDoc NPM Publishing Tool       "
echo "========================================="
echo ""

# Check if user is logged into npm
echo "Checking npm login status..."
npm whoami &> /dev/null
if [ $? -ne 0 ]; then
    echo "❌ You are not logged into npm"
    echo "Please run: npm login"
    exit 1
fi

echo "✅ Logged in to npm as: $(npm whoami)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Run tests
echo "🧪 Running tests..."
npm test

if [ $? -ne 0 ]; then
    echo "❌ Tests failed. Please fix the issues before publishing."
    exit 1
fi

echo "✅ All tests passed!"
echo ""

# Check if package name is available
echo "Checking if 'flexdoc' is available on npm..."
npm view flexdoc version &> /dev/null
if [ $? -eq 0 ]; then
    echo "⚠️  Warning: 'flexdoc' already exists on npm"
    echo "Current version: $(npm view flexdoc version)"
    echo ""
    read -p "Do you want to publish an update? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Publishing cancelled."
        exit 1
    fi
else
    echo "✅ 'flexdoc' is available on npm!"
fi

echo ""
echo "Current package version: $(node -p "require('./package.json').version")"
echo ""

# Prompt for version bump
echo "How would you like to version this release?"
echo "1) Patch (bug fixes) - X.X.+1"
echo "2) Minor (new features) - X.+1.0"
echo "3) Major (breaking changes) - +1.0.0"
echo "4) Keep current version"
echo ""
read -p "Enter your choice (1-4): " version_choice

case $version_choice in
    1)
        npm version patch
        ;;
    2)
        npm version minor
        ;;
    3)
        npm version major
        ;;
    4)
        echo "Keeping current version"
        ;;
    *)
        echo "Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "New version: $(node -p "require('./package.json').version")"
echo ""

# Final confirmation
echo "========================================="
echo "Ready to publish flexdoc to npm"
echo "Version: $(node -p "require('./package.json').version")"
echo "========================================="
echo ""
read -p "Do you want to proceed with publishing? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Publishing to npm..."
    npm publish
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "========================================="
        echo "🎉 Success! flexdoc has been published to npm"
        echo "========================================="
        echo ""
        echo "Users can now install it with:"
        echo "  npm install flexdoc"
        echo ""
        echo "View on npm: https://www.npmjs.com/package/flexdoc"
    else
        echo "❌ Publishing failed. Please check the error messages above."
        exit 1
    fi
else
    echo "Publishing cancelled."
    exit 1
fi

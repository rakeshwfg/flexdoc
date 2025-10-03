# 🚀 FlexDoc Deployment Guide

This guide will help you deploy FlexDoc to GitHub and npm, making it publicly available for everyone to use.

## 📋 Pre-Deployment Checklist

### 1. Check Name Availability

```bash
# Make the script executable
chmod +x check-availability.sh

# Run availability checker
./check-availability.sh
```

This will check if "flexdoc" is available on:
- npm registry
- GitHub (for your username)

### Alternative Names (if flexdoc is taken)
- `flexdoc-converter`
- `html-flexdoc`
- `@yourusername/flexdoc` (scoped package)
- `flex-document`
- `flexdocs`

## 🔧 Step-by-Step Deployment

### Step 1: Prepare Your Code

1. **Update package.json** (if using different name):
```json
{
  "name": "your-chosen-name",
  "version": "1.0.0",
  ...
}
```

2. **Build the project**:
```bash
npm install
npm run build
npm test
```

### Step 2: Create GitHub Repository

1. **Go to GitHub**:
   - Visit: https://github.com/new
   - Repository name: `flexdoc` (or your chosen name)
   - Description: "Professional HTML to PDF/PPTX converter - Free Adobe API alternative"
   - ✅ Public
   - ✅ Add README
   - License: MIT

2. **Initialize Git** (in your flexdoc directory):
```bash
# Initialize repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "🎉 Initial release: FlexDoc - Professional HTML to PDF/PPTX converter"

# Add remote origin (replace 'yourusername' with your GitHub username)
git remote add origin https://github.com/yourusername/flexdoc.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Setup GitHub Pages

1. **Push docs folder**:
```bash
# The docs folder is already created
git add docs/
git commit -m "📚 Add GitHub Pages documentation"
git push
```

2. **Enable GitHub Pages**:
   - Go to: `https://github.com/yourusername/flexdoc/settings/pages`
   - Source: Deploy from a branch
   - Branch: main
   - Folder: /docs
   - Click Save

3. **Update documentation URLs**:
   - Edit `docs/index.html`
   - Replace `yourusername` with your GitHub username
   - Commit and push changes

Your documentation will be live at: `https://yourusername.github.io/flexdoc`

### Step 4: Publish to npm

1. **Create npm account** (if you don't have one):
   - Visit: https://www.npmjs.com/signup
   - Verify your email

2. **Login to npm**:
```bash
npm login
# Enter your username, password, and email
```

3. **Publish the package**:
```bash
# First publication
npm publish

# If the name is taken, try scoped package
npm publish --access=public
```

Your package will be available at: `https://www.npmjs.com/package/flexdoc`

### Step 5: Setup CI/CD (GitHub Actions)

1. **Create npm token**:
   - Go to: https://www.npmjs.com/settings/your-username/tokens
   - Generate New Token → Automation
   - Copy the token

2. **Add token to GitHub secrets**:
   - Go to: `https://github.com/yourusername/flexdoc/settings/secrets/actions`
   - New repository secret
   - Name: `NPM_TOKEN`
   - Value: [paste your npm token]

3. **GitHub Actions is already configured** in `.github/workflows/ci-cd.yml`

### Step 6: Create GitHub Release

1. **Create a release**:
```bash
# Tag the version
git tag -a v1.0.0 -m "Version 1.0.0 - Initial Release"
git push origin v1.0.0
```

2. **On GitHub**:
   - Go to: `https://github.com/yourusername/flexdoc/releases/new`
   - Choose tag: v1.0.0
   - Release title: "FlexDoc v1.0.0 - Professional HTML Converter"
   - Description: Add release notes
   - ✅ Set as latest release
   - Publish release

This will automatically trigger npm publication via GitHub Actions!

## 📢 Post-Deployment: Promotion

### 1. Update README Badges

Add these badges to your README.md:

```markdown
[![npm version](https://badge.fury.io/js/flexdoc.svg)](https://www.npmjs.com/package/flexdoc)
[![GitHub stars](https://img.shields.io/github/stars/yourusername/flexdoc)](https://github.com/yourusername/flexdoc)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Downloads](https://img.shields.io/npm/dm/flexdoc)](https://www.npmjs.com/package/flexdoc)
```

### 2. Share on Social Media

**Twitter/X Template**:
```
🚀 Just released FlexDoc - A FREE alternative to Adobe's expensive HTML to PDF/PPTX APIs!

✅ Professional quality output
✅ 100% free & open source
✅ Privacy-first (on-premise)
✅ No rate limits
✅ AI-powered optimization

Save $1000s/month!

GitHub: github.com/yourusername/flexdoc
npm: npmjs.com/package/flexdoc

#OpenSource #JavaScript #WebDev
```

**LinkedIn Template**:
```
Excited to announce FlexDoc - A professional HTML to PDF/PPTX converter that rivals Adobe's paid APIs!

Key Features:
• Adobe-quality output
• Completely free and open source
• AI-powered layout optimization
• Automatic chart generation
• Professional templates
• On-premise (data never leaves your servers)

Perfect for enterprises looking to reduce costs while maintaining quality.

Try it: npm install flexdoc
GitHub: github.com/yourusername/flexdoc

#OpenSource #EnterpriseSOftware #CostSavings
```

### 3. Submit to Directories

- **Product Hunt**: https://www.producthunt.com/posts/new
- **Hacker News**: https://news.ycombinator.com/submit
- **Reddit**: 
  - r/javascript
  - r/webdev
  - r/opensource
  - r/node
- **Dev.to**: Write an article about it
- **Awesome Lists**: 
  - awesome-nodejs
  - awesome-javascript

### 4. SEO Optimization

Update `docs/index.html` with:
- Meta descriptions
- Open Graph tags
- Schema.org structured data
- Sitemap

## 🔍 Monitoring

### Check Your Stats

1. **npm stats**:
   - Visit: `https://www.npmjs.com/package/flexdoc`
   - Monitor downloads

2. **GitHub insights**:
   - Visit: `https://github.com/yourusername/flexdoc/insights`
   - Track stars, forks, contributors

3. **GitHub Pages analytics**:
   - Add Google Analytics to `docs/index.html`
   - Monitor visitor traffic

## 🐛 Troubleshooting

### If npm publish fails:

1. **Name taken error**:
```bash
# Use scoped package
npm publish --access=public
# Package will be: @yourusername/flexdoc
```

2. **Authentication error**:
```bash
npm logout
npm login
npm publish
```

3. **Version conflict**:
```bash
# Bump version
npm version patch
npm publish
```

### If GitHub Pages doesn't work:

1. Check repository settings
2. Ensure docs/index.html exists
3. Wait 10 minutes for propagation
4. Check: `https://yourusername.github.io/flexdoc`

## 🎉 Success Checklist

Once deployed, verify:

- [ ] GitHub repository is public
- [ ] GitHub Pages site is live
- [ ] npm package is published
- [ ] CI/CD pipeline is green
- [ ] Documentation is accessible
- [ ] Examples work correctly
- [ ] Installation via `npm install flexdoc` works

## 📞 Support

If you encounter any issues:

1. Check existing issues: https://github.com/yourusername/flexdoc/issues
2. Create new issue with details
3. Join discussions: https://github.com/yourusername/flexdoc/discussions

## 🚀 Next Steps

1. **Gather Feedback**: Monitor issues and feature requests
2. **Iterate**: Release updates based on user feedback
3. **Build Community**: Encourage contributions
4. **Marketing**: Write blog posts, create tutorials
5. **Partnerships**: Reach out to companies using Adobe APIs

---

## Quick Deployment Commands

```bash
# Complete deployment in one go
npm install
npm run build
npm test

git init
git add .
git commit -m "Initial release"
git remote add origin https://github.com/yourusername/flexdoc.git
git push -u origin main

npm login
npm publish

git tag -a v1.0.0 -m "Version 1.0.0"
git push origin v1.0.0
```

Congratulations! 🎊 FlexDoc is now live and helping developers worldwide save money and maintain privacy!

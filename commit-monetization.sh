#!/bin/bash

# FlexDoc Monetization Plan - Git Commit Script
# Run this script to commit and push all monetization files to GitHub

set -e

echo "🚀 FlexDoc Monetization Plan - Git Commit"
echo "=========================================="
echo ""

cd /Users/rakeshsingh/work/wadhwani/flexdoc

# Check if we're in a git repo
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

echo "✅ Git repository found"
echo ""

# Show what will be committed
echo "📋 Files to be committed:"
echo ""
git status --short .github/FUNDING.yml docs/monetization/ 2>/dev/null || echo "Checking files..."
echo ""

# Add files to git
echo "➕ Adding files to git..."
git add .github/FUNDING.yml
git add docs/monetization/

# Show what was added
echo ""
echo "✅ Files staged for commit:"
git diff --cached --name-only
echo ""

# Create the commit
echo "💾 Creating commit..."
git commit -m "Add monetization plan and GitHub Sponsors setup

🎯 What's New:
- Added GitHub Sponsors configuration (.github/FUNDING.yml)
- Added comprehensive 4-week monetization plan
- Includes pricing strategy, email templates, and technical guides
- Added Week 1-4 implementation checklist

📚 Documentation includes:
- README.md: Overview of monetization strategy
- week-1-checklist.md: Day-by-day action plan
- pricing-page.md: Complete pricing page content
- email-template.md: User outreach templates
- readme-updates.md: README additions for Pro features
- blog-post-template.md: Marketing content for launch
- github-sponsors-tiers.md: Sponsor tier structure
- technical-setup-guide.md: License validation & Stripe integration

🎯 Goals:
- Week 1: Foundation & validation (50+ waitlist signups)
- Week 4: Launch Pro features at \$49/mo
- Month 3: Target \$2,000-5,000 MRR
- Year 1: Build sustainable \$100k+ ARR business

📖 Start here: docs/monetization/README-START-HERE.md"

echo ""
echo "✅ Commit created successfully!"
echo ""

# Ask before pushing
read -p "🚀 Push to GitHub? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "⬆️  Pushing to GitHub..."
    git push origin main || git push origin master
    
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🎉 Next Steps:"
    echo "1. Go to https://github.com/rakeshwfg/flexdoc"
    echo "2. You should see a 'Sponsor' button (may take 5-10 min)"
    echo "3. Go to https://github.com/sponsors to complete your profile"
    echo "4. Read docs/monetization/README-START-HERE.md"
    echo "5. Start Week 1: docs/monetization/week-1-checklist.md"
    echo ""
    echo "🚀 Let's monetize FlexDoc!"
else
    echo ""
    echo "⏸️  Push cancelled. You can push later with:"
    echo "   git push origin main"
fi

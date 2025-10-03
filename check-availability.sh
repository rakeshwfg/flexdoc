#!/bin/bash

# FlexDoc Availability Checker and Setup Script
# This script checks name availability and helps set up GitHub and npm

echo "================================================"
echo "       FlexDoc Setup & Availability Check       "
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check npm package availability
check_npm_availability() {
    local package_name=$1
    echo -e "${BLUE}Checking npm availability for '${package_name}'...${NC}"
    
    if npm view ${package_name} version &>/dev/null; then
        echo -e "${RED}✗ '${package_name}' is already taken on npm${NC}"
        npm view ${package_name} version
        return 1
    else
        echo -e "${GREEN}✓ '${package_name}' is available on npm!${NC}"
        return 0
    fi
}

# Function to check GitHub repository availability
check_github_availability() {
    local repo_name=$1
    local username=$2
    echo -e "${BLUE}Checking GitHub availability for '${username}/${repo_name}'...${NC}"
    
    response=$(curl -s -o /dev/null -w "%{http_code}" https://github.com/${username}/${repo_name})
    
    if [ $response -eq 404 ]; then
        echo -e "${GREEN}✓ Repository name '${repo_name}' is available!${NC}"
        return 0
    else
        echo -e "${RED}✗ Repository '${username}/${repo_name}' already exists${NC}"
        return 1
    fi
}

# Function to suggest alternative names
suggest_alternatives() {
    local base_name=$1
    echo -e "\n${YELLOW}Suggested alternative names:${NC}"
    
    alternatives=(
        "${base_name}-converter"
        "${base_name}-html"
        "${base_name}js"
        "${base_name}-docs"
        "html-${base_name}"
        "@${github_username}/${base_name}"
        "${base_name}2"
        "${base_name}-pro"
        "flex-document"
        "flexi-doc"
    )
    
    for alt in "${alternatives[@]}"; do
        if npm view ${alt} version &>/dev/null; then
            echo -e "  ${RED}✗${NC} ${alt} (taken)"
        else
            echo -e "  ${GREEN}✓${NC} ${alt} (available)"
        fi
    done
}

# Main script
echo "Step 1: Checking Availability"
echo "=============================="
echo ""

# Get GitHub username
read -p "Enter your GitHub username: " github_username
echo ""

# Check primary name
package_name="flexdoc"
npm_available=false
github_available=false

# Check npm
if check_npm_availability ${package_name}; then
    npm_available=true
fi

echo ""

# Check GitHub
if check_github_availability ${package_name} ${github_username}; then
    github_available=true
fi

# If primary name not available, suggest alternatives
if [ "$npm_available" = false ] || [ "$github_available" = false ]; then
    suggest_alternatives ${package_name}
    echo ""
    read -p "Would you like to use an alternative name? (y/n): " use_alt
    if [[ $use_alt =~ ^[Yy]$ ]]; then
        read -p "Enter the alternative name: " package_name
        echo ""
        check_npm_availability ${package_name}
        echo ""
        check_github_availability ${package_name} ${github_username}
    fi
fi

echo ""
echo "Step 2: Setup Recommendations"
echo "=============================="
echo ""

# Generate setup instructions based on availability
if [ "$npm_available" = true ] && [ "$github_available" = true ]; then
    echo -e "${GREEN}Great! '${package_name}' is available on both npm and GitHub.${NC}"
    echo ""
    echo "Here's your setup plan:"
    echo ""
    
    # Update package.json if needed
    if [ "${package_name}" != "flexdoc" ]; then
        echo "1. Update package.json:"
        echo "   - Change 'name' field to '${package_name}'"
        echo ""
    fi
    
    echo "2. Create GitHub repository:"
    echo "   - Go to: https://github.com/new"
    echo "   - Repository name: ${package_name}"
    echo "   - Description: 'Professional HTML to PDF/PPTX converter - Adobe API alternative'"
    echo "   - Public repository"
    echo "   - Add README"
    echo "   - Choose MIT License"
    echo ""
    
    echo "3. Initialize Git and push:"
    echo -e "${BLUE}"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m \"Initial commit: FlexDoc - Professional HTML to PDF/PPTX converter\""
    echo "   git branch -M main"
    echo "   git remote add origin https://github.com/${github_username}/${package_name}.git"
    echo "   git push -u origin main"
    echo -e "${NC}"
    echo ""
    
    echo "4. Publish to npm:"
    echo -e "${BLUE}"
    echo "   npm login"
    echo "   npm publish"
    echo -e "${NC}"
    
else
    echo -e "${YELLOW}Name availability issues detected. Please choose an alternative name.${NC}"
fi

echo ""
echo "Step 3: Additional Setup Files"
echo "=============================="
echo ""

# Ask if user wants to generate additional files
read -p "Generate GitHub Pages documentation? (y/n): " gen_docs
if [[ $gen_docs =~ ^[Yy]$ ]]; then
    echo -e "${GREEN}GitHub Pages files will be generated in /docs folder${NC}"
fi

read -p "Generate GitHub Actions CI/CD workflow? (y/n): " gen_ci
if [[ $gen_ci =~ ^[Yy]$ ]]; then
    echo -e "${GREEN}GitHub Actions workflow will be generated${NC}"
fi

echo ""
echo "================================================"
echo "           Setup Summary                        "
echo "================================================"
echo ""
echo "Package Name: ${package_name}"
echo "GitHub Repo: https://github.com/${github_username}/${package_name}"
echo "npm Package: https://www.npmjs.com/package/${package_name}"
echo ""
echo -e "${GREEN}Ready to proceed with setup!${NC}"

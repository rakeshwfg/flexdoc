# FlexDoc CLI - Quick Reference Guide

## Installation

```bash
# Global installation (recommended)
npm install -g flexdoc

# Use with npx (no installation)
npx flexdoc --help
```

## Quick Start

```bash
# Convert HTML to PDF
flexdoc pdf document.html -o output.pdf

# Convert HTML to PPTX
flexdoc pptx slides.html -o presentation.pptx

# Get help
flexdoc --help
flexdoc pdf --help
flexdoc pptx --help
```

## Commands

### 1. PDF Conversion

```bash
flexdoc pdf <input> [options]
```

**Examples:**

```bash
# Basic conversion
flexdoc pdf document.html -o report.pdf

# With custom format and margins
flexdoc pdf document.html -o report.pdf --format A3 --margin-top 2cm

# Landscape orientation
flexdoc pdf document.html -o landscape.pdf --landscape

# From URL
flexdoc pdf https://example.com -o webpage.pdf

# With custom CSS
flexdoc pdf document.html --css custom.css -o styled.pdf

# With header and footer
flexdoc pdf document.html \
  --header "<div style='text-align: center'>My Document</div>" \
  --footer "<div>Page <span class='pageNumber'></span></div>" \
  -o document.pdf

# No background graphics
flexdoc pdf document.html --no-background -o simple.pdf
```

**Options:**
- `-o, --output <path>` - Output file path (default: output.pdf)
- `-f, --format <format>` - Paper format: A4, A3, Letter, Legal, Tabloid (default: A4)
- `-l, --landscape` - Landscape orientation
- `--margin-top <size>` - Top margin (default: 1cm)
- `--margin-right <size>` - Right margin (default: 1cm)
- `--margin-bottom <size>` - Bottom margin (default: 1cm)
- `--margin-left <size>` - Left margin (default: 1cm)
- `--scale <number>` - Scale factor 0.1 to 2.0 (default: 1)
- `--header <template>` - HTML header template
- `--footer <template>` - HTML footer template
- `--no-background` - Disable background graphics
- `--css <file>` - Custom CSS file to inject
- `--wait <selector>` - Wait for CSS selector before conversion
- `--debug` - Enable debug mode

### 2. PPTX Conversion

```bash
flexdoc pptx <input> [options]
```

**Examples:**

```bash
# Basic conversion
flexdoc pptx slides.html -o presentation.pptx

# With custom layout and theme
flexdoc pptx slides.html -o presentation.pptx --layout 16x9 --theme corporate

# Split by H1 tags
flexdoc pptx document.html -o slides.pptx --split h1

# With metadata
flexdoc pptx content.html \
  -o presentation.pptx \
  --title "Q4 Report" \
  --author "John Doe" \
  --company "Acme Corp"

# From URL
flexdoc pptx https://example.com/slides -o presentation.pptx

# Without images
flexdoc pptx content.html --no-images -o text-only.pptx
```

**Options:**
- `-o, --output <path>` - Output file path (default: output.pptx)
- `-l, --layout <layout>` - Slide layout: 16x9, 16x10, 4x3 (default: 16x9)
- `-s, --split <element>` - Split slides by: h1, h2, h3, hr (default: h2)
- `-t, --title <title>` - Presentation title
- `-a, --author <author>` - Presentation author
- `-c, --company <company>` - Company name
- `--theme <theme>` - Theme: default, dark, corporate, creative (default: default)
- `--no-images` - Exclude images from slides
- `--max-content <chars>` - Max characters per slide (default: 500)
- `--css <file>` - Custom CSS file to inject
- `--debug` - Enable debug mode

### 3. Batch Conversion

```bash
flexdoc batch <config.json> [options]
```

**Example config.json:**

```json
{
  "items": [
    {
      "input": "report.html",
      "format": "pdf",
      "options": {
        "outputPath": "output/report.pdf",
        "format": "A4",
        "printBackground": true,
        "margin": {
          "top": "2cm",
          "bottom": "2cm"
        }
      }
    },
    {
      "input": "slides.html",
      "format": "pptx",
      "options": {
        "outputPath": "output/presentation.pptx",
        "layout": "16x9",
        "theme": "corporate",
        "splitBy": "h1"
      }
    },
    {
      "input": "https://example.com",
      "format": "pdf",
      "options": {
        "outputPath": "output/webpage.pdf",
        "format": "Letter"
      }
    }
  ]
}
```

**Usage:**

```bash
flexdoc batch batch-config.json
flexdoc batch batch-config.json --debug
```

### 4. System Information

```bash
flexdoc info
```

Shows:
- FlexDoc version
- Node.js version
- Platform and architecture
- Supported output formats

## Input Types

FlexDoc CLI accepts multiple input types:

1. **HTML File**: `document.html`
2. **URL**: `https://example.com`
3. **HTML String**: `<h1>Hello World</h1>` (direct HTML)

## Common Workflows

### Generate PDF Reports

```bash
# Monthly report
flexdoc pdf monthly-report.html \
  -o reports/2024-03.pdf \
  --format Letter \
  --header "<div>Monthly Report - March 2024</div>" \
  --footer "<div>Page <span class='pageNumber'></span> of <span class='totalPages'></span></div>"
```

### Create Presentations

```bash
# Quarterly presentation
flexdoc pptx q4-slides.html \
  -o presentations/Q4-2024.pptx \
  --theme corporate \
  --title "Q4 2024 Results" \
  --author "Finance Team" \
  --company "Acme Corp" \
  --split h1
```

### Batch Processing

```bash
# Convert all documents in a config
flexdoc batch conversions.json

# With debug output
flexdoc batch conversions.json --debug
```

### Web Page Archiving

```bash
# Save webpage as PDF
flexdoc pdf https://important-site.com/article \
  -o archive/article.pdf \
  --format A4 \
  --printBackground true
```

## Tips & Best Practices

1. **Use custom CSS** for better styling control
2. **Wait for selectors** when dealing with dynamic content
3. **Batch conversion** for processing multiple files efficiently
4. **Debug mode** helps troubleshoot conversion issues
5. **Use npx** if you don't want global installation

## Troubleshooting

**Problem**: Command not found
```bash
# Solution 1: Install globally
npm install -g flexdoc

# Solution 2: Use npx
npx flexdoc --help
```

**Problem**: Conversion fails
```bash
# Use debug mode
flexdoc pdf document.html -o output.pdf --debug
```

**Problem**: Missing content
```bash
# Wait for content to load
flexdoc pdf document.html -o output.pdf --wait ".content-loaded"
```

## Version

Current version: **1.0.1**

Check version:
```bash
flexdoc --version
```

## Support

- Documentation: [GitHub Repository](https://github.com/yourusername/flexdoc)
- Issues: [GitHub Issues](https://github.com/yourusername/flexdoc/issues)
- npm: [npm package](https://www.npmjs.com/package/flexdoc)

---

Made with ❤️ by Rakesh Singh

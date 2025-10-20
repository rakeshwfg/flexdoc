# FlexDoc - Complete Specification & Documentation

> **Professional-grade HTML to PDF, PPTX, and DOCX conversion library**
>
> Complete technical specification, architecture, and implementation guide for FlexDoc

---

## Table of Contents

### 1. [Project Overview](#1-project-overview)
- [Core Value Proposition](#core-value-proposition)
- [Key Features](#key-features)
- [Current Status](#current-status)

### 2. [Architecture](#2-architecture)
- [System Architecture](#system-architecture)
- [Core Components](#core-components)
- [Data Flow](#data-flow)
- [Technology Stack](#technology-stack)
- [Design Patterns](#design-patterns)

### 3. [API Specification](#3-api-specification)
- [Main FlexDoc Class](#main-flexdoc-class)
- [PDF Conversion](#pdf-conversion)
- [PPTX Conversion](#pptx-conversion)
- [DOCX Conversion](#docx-conversion)
- [Input/Output Options](#inputoutput-options)

### 4. [CLI Tool](#4-cli-tool)
- [Installation](#cli-installation)
- [PDF Commands](#pdf-commands)
- [PPTX Commands](#pptx-commands)
- [DOCX Commands](#docx-commands)
- [Batch Processing](#batch-processing)

### 5. [Advanced Features](#5-advanced-features)
- [Professional PPTX Mode](#professional-pptx-mode)
- [Theme System](#theme-system)
- [Chart Generation](#chart-generation)
- [Cloud Storage Integration](#cloud-storage-integration)
- [ML Layout Detection](#ml-layout-detection)
- [Watermarking](#watermarking)

### 6. [Licensing System](#6-licensing-system)
- [License Tiers](#license-tiers)
- [Pro Features](#pro-features)
- [License Activation](#license-activation)
- [Technical Implementation](#licensing-technical-implementation)

### 7. [REST API Server](#7-rest-api-server)
- [Server Setup](#server-setup)
- [API Endpoints](#api-endpoints)
- [Docker Deployment](#docker-deployment)

### 8. [Deployment](#8-deployment)
- [Library Usage](#library-usage)
- [API Server Deployment](#api-server-deployment)
- [Docker](#docker)
- [Cloud Platforms](#cloud-platforms)

### 9. [Monetization & Payment](#9-monetization--payment)
- [Stripe Integration](#stripe-integration)
- [Webhook Setup](#webhook-setup)
- [Email Delivery](#email-delivery)

### 10. [Performance & Benchmarks](#10-performance--benchmarks)
- [Performance Metrics](#performance-metrics)
- [Optimization Strategies](#optimization-strategies)
- [Scaling](#scaling)

### 11. [Version History](#11-version-history)
- [v1.9.0 - Pro Licensing](#v190---pro-licensing-system)
- [v1.8.0 - PPTX Enhancements](#v180---pptx-enhancement-release)
- [Previous Versions](#previous-versions)

### 12. [Development](#12-development)
- [Setup](#development-setup)
- [Testing](#testing)
- [Publishing](#publishing)
- [Contributing](#contributing)

---

## 1. Project Overview

### Core Value Proposition

**FlexDoc** is a professional-grade, open-source npm library that converts HTML to PDF, PPTX, and DOCX formats. It's designed as a **free alternative to Adobe's expensive APIs**, providing enterprise-quality output without any cost, rate limits, or privacy concerns.

**Key Benefits:**
- **Replace Adobe APIs** ($0.05 per operation) with a free solution
- **Professional quality** output matching Adobe's standards
- **Complete privacy** - all processing happens locally
- **No limitations** - no rate limits, quotas, or restrictions
- **Full customization** - open source with complete control

### Key Features

#### Core Capabilities
- 🚀 **Multi-Format Support**: Convert HTML to PDF, PPTX, and DOCX formats
- 🎯 **Unified API**: Single interface for all conversions with format-specific options
- 📦 **Zero Paid Dependencies**: Uses only open-source libraries
- 💪 **Enterprise Ready**: TypeScript support, error handling, and retry logic
- 🌐 **Multiple Input Sources**: HTML string, file path, or URL

#### PPTX Features
- 📊 **Structured Content**: Native tables, lists, and formatted text in slides
- 🎨 **25+ Professional Themes**: Beautiful pre-designed themes
- 🛠️ **Custom Theme Builder**: Create and save your own branded themes
- 📈 **Auto Charts**: Automatic table-to-chart conversion
- 🎭 **Professional Mode**: ML-powered layout optimization
- 🔄 **Smart Splitting**: Automatic slide creation

#### PDF & DOCX Features
- 💧 **PDF Watermarks**: Text and image watermarks
- 📄 **Word Documents**: Full DOCX support with styling
- 🎨 **Rich Formatting**: Headers, footers, margins, and layouts

#### Developer Experience
- 🖥️ **CLI Tool**: Command-line interface
- 🔄 **Batch Processing**: Convert multiple documents
- 🌩️ **Cloud Storage**: Direct upload to S3, Azure Blob, Google Drive
- 🔌 **REST API Server**: Docker-ready API
- 🤖 **ML Layout Detection**: Intelligent content analysis

### Current Status

**Version**: 1.9.0 (Pro Licensing Release)

**Phase 2 Complete** ✅
- 8 major releases (v1.0.0 → v1.9.0)
- All planned Phase 2 features delivered
- Production-ready
- 149KB package size
- 123 total files in distribution

---

## 2. Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FlexDoc Library                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   FlexDoc    │  │  CLI Tool    │  │  REST API    │      │
│  │  Main Class  │  │  (Commander) │  │  (Express)   │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                  │              │
│         └─────────────────┴──────────────────┘              │
│                           │                                 │
│         ┌─────────────────┴─────────────────┐              │
│         │      Converter Layer               │              │
│  ┌──────▼──────┐  ┌──────────┐  ┌──────────┐              │
│  │ PDF         │  │ PPTX     │  │ DOCX     │              │
│  │ Converter   │  │ Converter│  │ Converter│              │
│  └──────┬──────┘  └────┬─────┘  └────┬─────┘              │
│         │              │              │                     │
│  ┌──────▼──────────────▼──────────────▼─────┐              │
│  │         Engine Layer                      │              │
│  │  - AI Layout Engine                       │              │
│  │  - Chart Engine                           │              │
│  │  - Image Processing Engine                │              │
│  │  - ML Layout Detection                    │              │
│  └───────────────────────────────────────────┘              │
│                                                              │
│  ┌─────���──────────────────────────────────────┐             │
│  │         Support Modules                    │             │
│  │  - Theme System                            │             │
│  │  - Cloud Storage Manager                   │             │
│  │  - Licensing System                        │             │
│  │  - Validators & Utils                      │             │
│  └────────────────────────────────────────────┘             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Core Components

#### 1. FlexDoc Main Class (`src/index.ts`)

```typescript
class FlexDoc {
  // Unified conversion
  async convert(html: string, options: ConversionOptions): Promise<ConversionResult>

  // Format-specific methods
  async toPDF(html: string, options: PDFOptions): Promise<ConversionResult>
  async toPPTX(html: string, options: PPTXOptions): Promise<ConversionResult>
  async toWord(html: string, options: DOCXOptions): Promise<ConversionResult>

  // Batch processing
  async batchConvert(inputs: BatchInput[]): Promise<ConversionResult[]>

  // Licensing
  getLicense(): LicenseInfo | null
  getLicenseTier(): string
}
```

**Responsibilities**:
- Route requests to appropriate converters
- Handle cloud upload integration
- Manage batch processing
- License validation and feature gating
- Error handling and retry logic

#### 2. PDF Converter (`src/converters/pdf-converter.ts`)

**Flow**:
```
HTML Input → Puppeteer Launch → Load Content → Generate PDF → Buffer Output
```

**Key Features**:
- Uses Puppeteer (headless Chrome)
- Supports custom CSS/JS injection
- Watermark support
- Multiple page formats (A4, Letter, Legal, etc.)
- Headers/footers

**Dependencies**: `puppeteer`, `sharp` (for watermarks)

#### 3. PPTX Converter (`src/converters/pptx-converter.ts`)

**Flow**:
```
HTML Input → Parse with JSDOM → Extract Sections → Create Slides → Generate PPTX
```

**Modes**:
1. **Standard Mode**: Basic HTML to slides
2. **Enhanced Mode**: Advanced layout features
3. **Professional Mode**: ML-powered optimization (Pro feature)

**Key Features**:
- Semantic HTML support (`<section>`, `<article>`)
- Structured content extraction (tables, lists)
- Native PPTX table rendering
- Theme system integration
- Chart auto-generation

**Dependencies**: `pptxgenjs`, `jsdom`, `html-to-text`

#### 4. DOCX Converter (`src/converters/docx-converter.ts`)

**Flow**:
```
HTML Input → Parse with JSDOM → Convert to DOCX Elements → Generate Document
```

**Key Features**:
- Paragraph and heading conversion
- Table support
- Image embedding
- Style preservation
- Table of contents generation

**Dependencies**: `docx`, `jsdom`

### Data Flow

#### PDF Generation Flow

```
┌─────────────┐
│ HTML Input  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Validate   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Launch Puppeteer│
│  (Chrome)       │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Load HTML/CSS   │
│ Execute JS      │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Apply Watermark │ (optional)
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Generate PDF    │
│ (Uint8Array)    │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Save/Return     │
│ + Cloud Upload  │
└─────────────────┘
```

#### PPTX Generation Flow (Professional Mode)

```
┌─────────────┐
│ HTML Input  │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Parse with JSDOM│
└──────┬──────────┘
       │
       ▼
┌─────────────────────┐
│ ML Content Analysis │
│ - Classify elements │
│ - Score importance  │
│ - Extract keywords  │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Pattern Detection   │
│ - Detect layout     │
│ - Group sections    │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Extract Structured  │
│ Content:            │
│ - Tables → Native   │
│ - Lists → Bullets   │
│ - Text → Paragraphs │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Apply Theme         │
│ (colors, fonts)     │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Generate Slides     │
│ (pptxgenjs)         │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Optional:           │
│ - Chart generation  │
│ - Image processing  │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Create PPTX Buffer  │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Save/Return         │
│ + Cloud Upload      │
└─────────────────────┘
```

### Technology Stack

#### Production Dependencies
```json
{
  "puppeteer": "^24.23.0",      // PDF generation (headless Chrome)
  "pptxgenjs": "^4.0.1",        // PPTX creation
  "docx": "^9.5.1",             // DOCX creation
  "jsdom": "^27.0.0",           // HTML parsing
  "sharp": "^0.34.4",           // Image processing
  "html-to-text": "^9.0.5",    // Text extraction

  // REST API
  "express": "^5.1.0",          // Web framework
  "multer": "^2.0.2",           // File upload
  "cors": "^2.8.5",             // CORS middleware
  "helmet": "^8.1.0",           // Security
  "express-rate-limit": "^8.1.0", // Rate limiting
  "swagger-ui-express": "^5.0.1", // API docs

  // Cloud Storage
  "@aws-sdk/client-s3": "^3.901.0",
  "@aws-sdk/lib-storage": "^3.901.0",
  "@azure/storage-blob": "^12.28.0",

  // Licensing
  "jsonwebtoken": "^9.0.0",     // JWT for licenses

  // CLI
  "commander": "^14.0.1"        // CLI framework
}
```

### Design Patterns

#### 1. Strategy Pattern (Converters)
Each format has its own converter implementing `IConverter`:

```typescript
interface IConverter {
  convert(html: string, options: any): Promise<ConversionResult>
}

class PDFConverter implements IConverter { ... }
class PPTXConverter implements IConverter { ... }
class DOCXConverter implements IConverter { ... }
```

#### 2. Factory Pattern (Theme Creation)
```typescript
class ThemeBuilder {
  static createTheme(category: ThemeCategory): Theme {
    switch(category) {
      case 'corporate': return new CorporateTheme()
      case 'creative': return new CreativeTheme()
      // ...
    }
  }
}
```

#### 3. Adapter Pattern (Cloud Storage)
```typescript
interface ICloudStorageAdapter {
  upload(file: string, options: UploadOptions): Promise<UploadResult>
  download(url: string): Promise<Buffer>
}

class S3Adapter implements ICloudStorageAdapter { ... }
class AzureAdapter implements ICloudStorageAdapter { ... }
```

#### 4. Singleton Pattern (Converter Instances)
```typescript
// Export singleton instances
export const pdfConverter = new PDFConverter()
export const pptxConverter = new PPTXConverter()
export const docxConverter = new DOCXConverter()
```

---

## 3. API Specification

### Main FlexDoc Class

#### Constructor
```typescript
constructor(options?: FlexDocOptions)

interface FlexDocOptions {
  licenseKey?: string;      // Pro license key
  debug?: boolean;          // Enable debug logging
  timeout?: number;         // Default timeout (ms)
}
```

### PDF Conversion

#### Method: `toPDF(html, options?)`

```typescript
async toPDF(
  html: HTMLInput,
  options?: PDFOptions
): Promise<ConversionResult>
```

#### PDF Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `format` | string | 'A4' | Paper format (A4, A3, Letter, Legal, Tabloid) |
| `width` | string/number | - | Custom page width |
| `height` | string/number | - | Custom page height |
| `margin` | object | {top:'1cm',...} | Page margins |
| `printBackground` | boolean | true | Print background graphics |
| `landscape` | boolean | false | Landscape orientation |
| `scale` | number | 1 | Scale of rendering (0.1 to 2.0) |
| `displayHeaderFooter` | boolean | false | Display header and footer |
| `headerTemplate` | string | - | HTML template for header |
| `footerTemplate` | string | - | HTML template for footer |
| `pageRanges` | string | - | Page ranges to print |
| `preferCSSPageSize` | boolean | false | Use CSS-defined page size |
| `watermark` | object | - | Watermark configuration |
| `outputPath` | string | - | Output file path |

#### Example
```typescript
const result = await flexdoc.toPDF(html, {
  outputPath: './document.pdf',
  format: 'A4',
  printBackground: true,
  margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' },
  watermark: {
    text: 'CONFIDENTIAL',
    position: 'diagonal',
    opacity: 0.2
  }
});
```

### PPTX Conversion

#### Method: `toPPTX(html, options?)`

```typescript
async toPPTX(
  html: HTMLInput,
  options?: PPTXOptions
): Promise<ConversionResult>
```

#### PPTX Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `layout` | string | '16x9' | Slide layout (16x9, 16x10, 4x3) |
| `slideWidth` | number | 10 | Slide width in inches |
| `slideHeight` | number | 5.625 | Slide height in inches |
| `splitBy` | string | 'h2' | Element to split slides by (h1, h2, h3, section, hr) |
| `title` | string | - | Presentation title |
| `author` | string | - | Presentation author |
| `company` | string | - | Company name |
| `theme` | string | 'default' | Theme name or custom theme object |
| `professional` | boolean | false | Enable professional mode (Pro feature) |
| `includeImages` | boolean | true | Include images from HTML |
| `maxContentPerSlide` | number | 500 | Max characters per slide |
| `autoCharts` | boolean | true | Auto-generate charts from tables |
| `chartOptions` | object | - | Chart generation options |
| `outputPath` | string | - | Output file path |

#### Example
```typescript
const result = await flexdoc.toPPTX(html, {
  outputPath: './presentation.pptx',
  layout: '16x9',
  splitBy: 'section',
  theme: 'corporate-blue',
  professional: true,  // Pro feature
  autoCharts: true
});
```

### DOCX Conversion

#### Method: `toDOCX(html, options?)`

```typescript
async toDOCX(
  html: HTMLInput,
  options?: DOCXOptions
): Promise<ConversionResult>
```

#### DOCX Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `orientation` | string | 'portrait' | Page orientation (portrait, landscape) |
| `pageSize` | string | 'A4' | Page size (A4, Letter, Legal, A3, Tabloid) |
| `pageWidth` | number | - | Custom page width (overrides pageSize) |
| `pageHeight` | number | - | Custom page height (overrides pageSize) |
| `margins` | object | {top:1440,...} | Page margins in twips (1 inch = 1440 twips) |
| `title` | string | - | Document title |
| `author` | string | - | Document author |
| `company` | string | - | Company name |
| `theme` | string | 'default' | Document theme |
| `fontFamily` | string | 'Arial' | Default font family |
| `fontSize` | number | 11 | Default font size in points |
| `lineSpacing` | number | 1.15 | Line spacing multiplier |
| `includeImages` | boolean | true | Include images from HTML |
| `header` | object/string | - | Header configuration or text |
| `footer` | object/string | - | Footer configuration or text |
| `tableOfContents` | boolean/object | false | Generate table of contents |
| `tocTitle` | string | 'Table of Contents' | TOC title |
| `outputPath` | string | - | Output file path |

#### Example
```typescript
const result = await flexdoc.toDOCX(html, {
  outputPath: './document.docx',
  orientation: 'portrait',
  pageSize: 'A4',
  theme: 'professional',
  header: 'Company Confidential',
  footer: 'Page {PAGE} of {TOTAL}',
  tableOfContents: true
});
```

### Input/Output Options

#### HTML Input Types

```typescript
type HTMLInput = string | {
  content?: string;
  filePath?: string;
  url?: string;
}

// String input
await flexdoc.toPDF('<h1>Hello</h1>');

// File input
await flexdoc.toPDF({ filePath: './document.html' });

// URL input
await flexdoc.toPDF({ url: 'https://example.com' });

// Content object
await flexdoc.toPDF({ content: '<h1>Hello</h1>' });
```

#### Conversion Result

```typescript
interface ConversionResult {
  success: boolean;
  format: 'pdf' | 'pptx' | 'docx';
  buffer?: Buffer;        // If no outputPath specified
  filePath?: string;      // If outputPath specified
  size: number;           // File size in bytes
  duration: number;       // Processing time in ms
  metadata: {
    slideCount?: number;  // For PPTX
    pageCount?: number;   // For PDF
    analysis?: any;       // Content analysis
    quality?: string;     // Quality assessment
  };
}
```

---

## 4. CLI Tool

### CLI Installation

```bash
# Global installation
npm install -g flexdoc

# Use with npx (no installation)
npx flexdoc --help
```

### PDF Commands

```bash
# Basic usage
flexdoc pdf input.html -o output.pdf

# With options
flexdoc pdf input.html \
  --output document.pdf \
  --format A4 \
  --landscape \
  --margin-top 2cm \
  --margin-bottom 2cm

# With watermark
flexdoc pdf document.html \
  --watermark-text "CONFIDENTIAL" \
  --watermark-position diagonal \
  --watermark-opacity 0.3 \
  -o confidential.pdf
```

**PDF CLI Options:**
- `-o, --output <path>` - Output file path
- `-f, --format <format>` - Paper format (A4, A3, Letter, Legal, Tabloid)
- `-l, --landscape` - Landscape orientation
- `--margin-top <size>` - Top margin (default: 1cm)
- `--margin-right <size>` - Right margin (default: 1cm)
- `--margin-bottom <size>` - Bottom margin (default: 1cm)
- `--margin-left <size>` - Left margin (default: 1cm)
- `--scale <number>` - Scale factor 0.1 to 2.0
- `--header <template>` - HTML header template
- `--footer <template>` - HTML footer template
- `--no-background` - Disable background graphics
- `--watermark-text <text>` - Watermark text
- `--watermark-image <path>` - Watermark image
- `--watermark-position <position>` - Position (center, diagonal, etc.)
- `--watermark-opacity <number>` - Opacity (0-1)

### PPTX Commands

```bash
# Basic usage
flexdoc pptx input.html -o presentation.pptx

# With theme and professional mode
flexdoc pptx input.html \
  --output slides.pptx \
  --layout 16x9 \
  --split h1 \
  --theme corporate-blue \
  --professional

# With charts
flexdoc pptx data.html \
  -o charts.pptx \
  --theme corporate \
  --chart-types bar,line
```

**PPTX CLI Options:**
- `-o, --output <path>` - Output file path
- `-l, --layout <layout>` - Slide layout (16x9, 16x10, 4x3)
- `-s, --split <element>` - Split slides by (h1, h2, h3, hr, section)
- `-t, --title <title>` - Presentation title
- `-a, --author <author>` - Presentation author
- `-c, --company <company>` - Company name
- `--theme <theme>` - Theme name
- `--professional` - Enable professional mode (Pro feature)
- `--no-images` - Exclude images
- `--no-auto-charts` - Disable automatic chart generation
- `--chart-types <types>` - Preferred chart types

### DOCX Commands

```bash
# Basic usage
flexdoc docx input.html -o document.docx

# With theme and TOC
flexdoc docx documentation.html \
  --output docs.docx \
  --theme professional \
  --toc \
  --header "Company Documentation" \
  --footer "Page {PAGE}"
```

**DOCX CLI Options:**
- `-o, --output <path>` - Output file path
- `--orientation <orientation>` - Page orientation (portrait, landscape)
- `--page-size <size>` - Page size (A4, Letter, Legal, A3, Tabloid)
- `-t, --title <title>` - Document title
- `-a, --author <author>` - Document author
- `--theme <theme>` - Document theme
- `--header <text>` - Header text
- `--footer <text>` - Footer text
- `--toc` - Generate table of contents
- `--font-family <font>` - Font family
- `--font-size <size>` - Font size in points
- `--line-spacing <spacing>` - Line spacing multiplier

### Batch Processing

```bash
flexdoc batch config.json
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
        "printBackground": true
      }
    },
    {
      "input": "slides.html",
      "format": "pptx",
      "options": {
        "outputPath": "output/presentation.pptx",
        "layout": "16x9",
        "theme": "corporate"
      }
    }
  ]
}
```

---

## 5. Advanced Features

### Professional PPTX Mode

Professional mode enables ML-powered layout optimization for Adobe-quality presentations.

**Features:**
- ✅ ML-powered content analysis
- ✅ Intelligent layout optimization
- ✅ Enhanced visual hierarchy
- ✅ Better spacing and positioning
- ✅ Professional metadata markers
- ✅ No browser overhead (4x faster!)

**Usage:**
```typescript
await flexdoc.toPPTX(html, {
  professional: true,  // Enable Pro mode
  theme: 'corporate',
  splitBy: 'section',
  outputPath: './professional.pptx'
});
```

**Performance:**
- Standard mode: 131ms for 11 slides
- Professional mode: 32ms for 11 slides (4x faster!)

### Theme System

FlexDoc includes 25+ professional themes and a powerful theme builder.

#### Theme Categories

**Business (5 themes):**
- corporate-blue, professional-gray, executive-gold, financial-green, consulting-navy

**Tech (5 themes):**
- tech-purple, startup-orange, innovation-teal, digital-cyan, saas-modern

**Creative (5 themes):**
- creative-pink, designer-vibrant, artistic-rainbow, modern-minimal, bold-impact

**Academic (3 themes):**
- academic-serif, education-friendly, scientific-clean

**Special (7 themes):**
- dark-mode, high-contrast, print-optimized, elegant-luxury, playful-fun, nature-green, ocean-blue

#### Using Themes

```typescript
// Use a preset theme
await flexdoc.toPPTX(html, {
  theme: 'corporate-blue',
  outputPath: './presentation.pptx'
});

// Create custom theme
const { ThemeBuilder } = require('flexdoc');

const myTheme = new ThemeBuilder('My Brand')
  .setPrimaryColor('#6366F1')
  .setFontPairing('Modern Professional')
  .setShadows(true)
  .setGradients(true)
  .build();

await flexdoc.toPPTX(html, {
  theme: myTheme,
  outputPath: './branded.pptx'
});

// Save and load themes
const { ThemeManager } = require('flexdoc');
ThemeManager.saveThemeToFile(myTheme, './my-theme.json');
const loadedTheme = ThemeManager.loadThemeFromFile('./my-theme.json');
```

### Chart Generation

FlexDoc automatically converts HTML tables into beautiful charts in presentations.

**Smart Chart Detection:**
- **Bar Charts**: Multi-series comparison data
- **Line Charts**: Time series data (years, months, quarters)
- **Pie Charts**: Single-series data with few categories (≤8)
- **Area Charts**: Large datasets (>20 points)
- **Scatter Charts**: Correlation data (2 numeric columns)

**Usage:**
```typescript
await flexdoc.toPPTX(html, {
  outputPath: './charts.pptx',
  autoCharts: true,  // Enabled by default
  chartOptions: {
    preferredTypes: ['bar', 'line'],
    minRows: 3,
    maxRows: 50,
    showValues: true,
    showLegend: true,
    theme: 'colorful',
    position: 'replace'  // 'replace', 'alongside', or 'both'
  }
});
```

### Cloud Storage Integration

Upload generated documents directly to cloud storage.

**Supported Providers:**
- AWS S3
- Azure Blob Storage
- Google Drive (coming soon)

**Usage:**
```typescript
// Upload to S3
await flexdoc.toPDF(html, {
  outputPath: 's3://my-bucket/report.pdf',
  s3Config: {
    region: 'us-east-1',
    credentials: {
      accessKeyId: 'YOUR_KEY',
      secretAccessKey: 'YOUR_SECRET'
    }
  }
});

// Azure Blob Storage
await flexdoc.toPDF(html, {
  outputPath: 'azure://container/doc.pdf',
  azureConfig: {
    accountName: 'YOUR_ACCOUNT',
    accountKey: 'YOUR_KEY'
  }
});
```

### ML Layout Detection

Intelligent content analysis and optimization (Pro feature).

**Content Types Detected (11):**
- Title, Heading, Paragraph, List, Table
- Image, Code, Quote, Chart, Callout, Footer

**Layout Patterns Detected (7):**
- Document, Presentation, Report, Article
- Tutorial, Dashboard, Landing Page

**Importance Scoring:**
```typescript
calculateImportance(element, type, position) → ImportanceLevel {
  // 5 levels: CRITICAL, HIGH, MEDIUM, LOW, MINIMAL
  // Factors: type, position, keywords, emphasis
}
```

### Watermarking

Add text or image watermarks to PDFs.

**Watermark Options:**
```typescript
await flexdoc.toPDF(html, {
  outputPath: './confidential.pdf',
  watermark: {
    text: 'CONFIDENTIAL',
    position: 'diagonal',  // center, diagonal, top-left, etc.
    opacity: 0.2,
    fontSize: 80,
    color: '#FF0000',
    rotation: -45,
    fontFamily: 'Arial Black',
    fontWeight: 'bold',
    repeat: false  // Repeat across page
  }
});

// Image watermark
await flexdoc.toPDF(html, {
  watermark: {
    image: './logo.png',
    position: 'bottom-right',
    opacity: 0.5,
    imageWidth: 100,
    imageHeight: 100
  }
});
```

---

## 6. Licensing System

### License Tiers

| Feature | Free | Pro ($49/mo) | Enterprise (Custom) |
|---------|------|--------------|---------------------|
| HTML to PDF/PPTX/DOCX | ✅ | ✅ | ✅ |
| Basic Themes (5) | ✅ | ✅ | ✅ |
| Premium Themes (25+) | ❌ | ✅ | ✅ |
| Professional Mode | ❌ | ✅ | ✅ |
| Cloud Storage | ❌ | ✅ | ✅ |
| REST API Server | ❌ | ✅ | ✅ |
| Advanced Watermarks | ❌ | ✅ | ✅ |
| Custom Branding | ❌ | ✅ | ✅ |
| Priority Support | ❌ | ✅ | ✅ |
| White Label | ❌ | ❌ | ✅ |
| SLA Guarantee | ❌ | ❌ | ✅ |
| Volume Licensing | ❌ | ❌ | ✅ |

### Pro Features

**Professional Mode**: ML-powered layout optimization for presentations
**Premium Themes**: Access to all 25+ professional themes
**Cloud Storage**: Direct upload to S3, Azure, Google Drive
**REST API Server**: Production-ready API with authentication
**Advanced Watermarks**: Complex watermark configurations
**Custom Branding**: Remove "Generated by FlexDoc" attribution
**Priority Support**: Direct email support with 24-48h response time

### License Activation

#### Option 1: Environment Variable (Recommended for Production)
```bash
export FLEXDOC_LICENSE_KEY="your-license-key-here"
```

#### Option 2: Constructor (Recommended for Code)
```typescript
const { FlexDoc } = require('flexdoc');

const flexdoc = new FlexDoc({
  licenseKey: 'your-license-key-here'
});
```

#### Option 3: .env File
```
FLEXDOC_LICENSE_KEY=your-license-key-here
```

### Licensing Technical Implementation

#### License Structure (JWT-based)

```typescript
interface LicenseInfo {
  tier: 'free' | 'pro' | 'enterprise';
  email: string;
  issued: number;
  expires?: number;
  features: string[];
}
```

**License Features:**
- JWT-based signed licenses using RSA signatures
- Offline validation (no API calls)
- Cannot be forged
- Expires automatically
- Feature-based gating

#### License Validation

```typescript
import { LicenseValidator } from 'flexdoc';

const validator = new LicenseValidator();
const result = validator.validateLicense(licenseKey);

if (result.valid) {
  console.log('License is valid!');
  console.log(`Tier: ${result.license.tier}`);
  console.log(`Features: ${result.license.features.join(', ')}`);
} else {
  console.error(`Invalid license: ${result.error}`);
}
```

#### Feature Gating Implementation

```typescript
class FlexDoc {
  private requireProFeature(feature: string, featureName: string) {
    if (!this.validator.hasFeature(this.license, feature)) {
      throw new Error(
        `${featureName} requires FlexDoc Pro.\n` +
        `Upgrade at: https://rakeshwfg.github.io/flexdoc/pricing\n` +
        `Current tier: ${this.license?.tier || 'free'}`
      );
    }
  }

  async toPPTX(html: HTMLInput, options?: PPTXOptions) {
    // Check professional mode
    if (options?.professional) {
      this.requireProFeature('professional-mode', 'Professional mode');
    }

    // Check premium themes
    if (options?.theme && this.isPremiumTheme(options.theme)) {
      this.requireProFeature('premium-themes', `Premium theme "${options.theme}"`);
    }

    // Continue with conversion...
  }
}
```

#### License Generation (Admin Tool)

```bash
# Generate Pro license
npm run license:generate

# Usage
node scripts/generate-license.js customer@example.com pro
```

---

## 7. REST API Server

### Server Setup

**Start the API server:**
```bash
# Development
npm run api:dev

# Production
npm run api:start

# With PM2
pm2 start dist/api/server.js --name flexdoc-api

# Docker
docker run -p 3000:3000 flexdoc/api
```

### API Endpoints

#### POST /api/convert
Convert HTML to document format

**Request:**
```json
{
  "html": "<h1>Hello World</h1>",
  "format": "pdf",
  "options": {
    "format": "A4",
    "printBackground": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "jobId": "abc123",
  "status": "processing"
}
```

#### GET /api/jobs/:id
Get job status

**Response:**
```json
{
  "jobId": "abc123",
  "status": "completed",
  "result": {
    "success": true,
    "format": "pdf",
    "size": 12345,
    "duration": 234
  }
}
```

#### GET /api/jobs/:id/download
Download generated document

Returns the document file as attachment.

#### API Documentation
Interactive Swagger UI available at: `http://localhost:3000/api-docs`

### Docker Deployment

**Build image:**
```bash
docker build -t flexdoc-api .
```

**Run container:**
```bash
docker run -d \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -v ./uploads:/app/uploads \
  -v ./outputs:/app/outputs \
  --name flexdoc-api \
  flexdoc-api
```

**Docker Compose:**
```yaml
version: '3.8'
services:
  flexdoc-api:
    image: flexdoc:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - FLEXDOC_LICENSE_KEY=${LICENSE_KEY}
    volumes:
      - ./uploads:/app/uploads
      - ./outputs:/app/outputs
```

---

## 8. Deployment

### Library Usage

Direct integration in Node.js applications:

```typescript
import { FlexDoc } from 'flexdoc';

const flexdoc = new FlexDoc({
  licenseKey: process.env.FLEXDOC_LICENSE_KEY
});

// Use in your application
const pdf = await flexdoc.toPDF(html, options);
```

**Use Cases:**
- Server-side rendering in Next.js/Remix
- Background job processors
- Serverless functions (Lambda, Cloud Functions)
- Build-time document generation

### API Server Deployment

#### Vercel
```bash
vercel deploy
```

#### Railway
```bash
railway up
```

#### Heroku
```bash
git push heroku main
```

### Docker

Production-ready Docker deployment:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/api/server.js"]
```

### Cloud Platforms

**AWS Lambda:**
- Package size: ~50MB (with dependencies)
- Memory: 512MB recommended
- Timeout: 30s for most conversions

**Google Cloud Functions:**
- Runtime: Node.js 18
- Memory: 1GB recommended
- Timeout: 60s

**Azure Functions:**
- Runtime: Node.js 18
- Plan: Premium (for Puppeteer)
- Memory: 1.5GB recommended

---

## 9. Monetization & Payment

### Stripe Integration

#### Product Setup

Create products in Stripe dashboard:

1. **FlexDoc Pro - Monthly**
   - Price: $49/month
   - Billing: Recurring monthly
   - Metadata: `tier: pro`, `duration_days: 30`

2. **FlexDoc Pro - Annual**
   - Price: $490/year
   - Billing: Recurring yearly
   - Metadata: `tier: pro`, `duration_days: 365`

3. **FlexDoc Pro - Lifetime**
   - Price: $999 one-time
   - Billing: One-time payment
   - Metadata: `tier: pro`

### Webhook Setup

**Webhook endpoint:** `/webhook/stripe`

**Events to listen for:**
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

**Webhook handler flow:**
```
Payment Success → Generate License Key → Store in Database → Email to Customer
```

### Email Delivery

**License delivery email template:**
```
Subject: Your FlexDoc Pro License Key 🎉

Thank you for purchasing FlexDoc Pro! Here's your license key:

License Key: eyJhbGciOiJIUzI1NiIs...
Tier: Pro
Expires: [Date] or Never

How to activate:

1. Environment variable:
   export FLEXDOC_LICENSE_KEY="your-key-here"

2. In your code:
   const flexdoc = new FlexDoc({
     licenseKey: 'your-key-here'
   });

Documentation: https://github.com/rakeshwfg/flexdoc#pro-features
```

**Email providers supported:**
- SendGrid
- Resend
- SMTP (Gmail, Office 365, etc.)

---

## 10. Performance & Benchmarks

### Performance Metrics

#### PDF Generation
```
Simple PDF (1 page):    ~500ms
Complex PDF (10 pages): ~2000ms
PDF with images:        ~1500ms + image load time
```

#### PPTX Generation
```
Standard mode (3 slides):     ~50ms
Standard mode (11 slides):    ~130ms
Professional mode (11 slides): ~32ms (4x faster!)
```

#### Memory Usage
```
Typical document:  < 500MB
Large document:    < 1GB
Concurrent jobs:   ~100-200MB per job
```

### Optimization Strategies

#### PDF
- Browser reuse (keep browser instance alive)
- Page pooling for concurrent requests
- Lazy loading images
- CSS/JS minification

#### PPTX
- JSDOM caching for repeated conversions
- Parallel slide generation
- Lazy chart rendering
- Professional mode skips Puppeteer (no browser overhead)

#### Memory Management
- Stream large files instead of buffering
- Clean up temp files after conversion
- Limit concurrent conversions (queue)
- Browser instance limits

### Scaling

#### Horizontal Scaling
```
┌──────────┐   ┌──────────┐   ┌──────────┐
│ FlexDoc  │   │ FlexDoc  │   │ FlexDoc  │
│ Instance │   │ Instance │   │ Instance │
└────┬─────┘   └────┬─────┘   └────┬─────┘
     │              │              │
     └──────────────┴──────────────┘
                    │
              ┌─────▼─────┐
              │   Load    │
              │  Balancer │
              └───────────┘
```

#### Vertical Scaling
- Increase Node.js heap size (`--max-old-space-size`)
- More CPU cores for parallel processing
- SSD for faster I/O

---

## 11. Version History

### v1.9.0 - Pro Licensing System
**Released**: 2025-10-20

**Focus**: Monetization and Pro tier implementation

**Features:**
- 🔑 JWT-based licensing with RSA signatures
- ⭐ Feature gating for Pro features
- 💎 Pro tier: Professional mode, premium themes, cloud storage, API server
- 📊 Three tiers: Free, Pro ($49/mo), Enterprise (custom)
- 🛠️ Easy activation via environment variable, constructor, or .env
- 🔐 Secure offline validation, cannot be forged
- 📖 Comprehensive licensing documentation

### v1.8.0 - PPTX Enhancement Release
**Released**: 2025-10-04

**Focus**: Major improvements to HTML to PowerPoint conversion

**Features:**
- ✨ Enhanced structured content extraction (tables, lists)
- 📋 Native PPTX table rendering with proper formatting
- 🎯 Semantic HTML support (`<section>`, `<article>`)
- 🚀 Professional mode refactored (removed Puppeteer, 4x faster)
- 🎨 Better content layout with dynamic Y-positioning

**Performance:**
- Complex presentation: 11 slides, 219KB in 131ms
- Professional mode: 32ms (4x faster than standard)

**Bug Fixes:**
- Fixed 0 slides bug in section-based splitting
- Fixed NodeFilter compatibility with JSDOM
- Fixed Node type references
- Fixed professional mode errors

### Previous Versions

**v1.7.0 - ML Layout Detection**
- Content classification (11 types)
- Layout pattern detection (7 patterns)
- Importance scoring algorithm
- Smart section grouping

**v1.6.0 - Cloud Storage Integration**
- AWS S3 and Azure Blob Storage support
- Cloud URL parsing
- Automatic uploads after conversion

**v1.5.0 - REST API Server**
- Express.js REST API
- Job management and tracking
- OpenAPI/Swagger documentation
- Docker support

**v1.4.0 - Word Document Support**
- HTML to DOCX conversion
- Document structure preservation
- Styling and formatting

**v1.3.0 - Advanced Theming Engine**
- 25+ professional theme presets
- Custom theme builder
- Color scheme management

**v1.2.0 - Chart Generation**
- Auto chart generation from tables
- Multiple chart types
- Smart chart type selection

**v1.1.0 - CLI & Watermarks**
- Full CLI with Commander.js
- PDF watermark support
- Batch conversion

**v1.0.0 - Initial Release**
- HTML to PDF using Puppeteer
- HTML to PPTX using pptxgenjs
- Basic and professional modes

---

## 12. Development

### Development Setup

```bash
# Clone repository
git clone https://github.com/rakeshwfg/flexdoc.git
cd flexdoc

# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test

# Build
npm run build

# Run examples
npm run example
npm run example:pdf
npm run example:pptx
npm run example:licensing
```

### Testing

```bash
# Run all tests
npm test

# Run specific test
npm test -- pdf-converter.test.ts

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Publishing

#### Pre-publish Checklist
- [ ] All tests passing
- [ ] Version bumped in package.json
- [ ] CHANGELOG updated
- [ ] README updated
- [ ] Build successful

#### Publishing to npm

```bash
# Login to npm
npm login

# Publish
npm publish

# Or with version bump
npm version patch  # 1.9.0 → 1.9.1
npm version minor  # 1.9.0 → 1.10.0
npm version major  # 1.9.0 → 2.0.0
npm publish
```

### Contributing

#### Contribution Guidelines

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit changes** (`git commit -m 'Add AmazingFeature'`)
4. **Push to branch** (`git push origin feature/AmazingFeature`)
5. **Open Pull Request**

#### Code Style
- Follow existing code patterns
- Use TypeScript for new code
- Add JSDoc comments for public APIs
- Write tests for new features
- Update documentation

#### Pull Request Process
1. Ensure all tests pass
2. Update README if needed
3. Add example if adding new feature
4. Request review from maintainers

---

## Appendix

### A. Complete File Structure

```
flexdoc/
├── src/
│   ├── index.ts                          # Main FlexDoc class
│   ├── types/
│   │   └── index.ts                      # TypeScript definitions
│   ├── converters/
│   │   ├── pdf-converter.ts              # PDF converter
│   │   ├── pptx-converter.ts             # Basic PPTX converter
│   │   ├── enhanced-pptx-converter.ts    # Enhanced PPTX
│   │   ├── professional-pptx-converter.ts # Pro PPTX
│   │   └── docx-converter.ts             # DOCX converter
│   ├── engines/
│   │   ├── chart-engine.ts               # Chart generation
│   │   ├── image-processing-engine.ts    # Image optimization
│   │   └── ai-layout-engine.ts           # AI layout
│   ├── licensing/
│   │   ├── license-validator.ts          # License validation
│   │   ├── license-types.ts              # License types
│   │   └── index.ts
│   ├── themes/
│   │   ├── theme-types.ts                # Theme definitions
│   │   ├── theme-presets.ts              # 25+ themes
│   │   ├── theme-builder.ts              # Custom themes
│   │   ├── theme-manager.ts              # Theme management
│   │   ├── color-utils.ts                # Color manipulation
│   │   └── font-pairings.ts              # Font combinations
│   ├── cloud/
│   │   ├── cloud-storage-manager.ts      # Unified API
│   │   ├── s3-adapter.ts                 # AWS S3
│   │   └── azure-adapter.ts              # Azure Blob
│   ├── ml/
│   │   ├── content-analyzer.ts           # Content classification
│   │   └── layout-detector.ts            # Layout detection
│   ├── api/
│   │   ├── server.ts                     # Express server
│   │   ├── routes.ts                     # API routes
│   │   └── job-manager.ts                # Job tracking
│   ├── cli/
│   │   └── index.ts                      # CLI tool
│   ├── payment/
│   │   ├── webhook-server.ts             # Stripe webhooks
│   │   └── license-generator.ts          # Generate licenses
│   └── utils/
│       ├── validators.ts                 # Input validation
│       └── file-handler.ts               # File operations
├── examples/
│   ├── basic-pdf.ts
│   ├── basic-pptx.ts
│   ├── basic-docx.ts
│   ├── professional-pptx.ts
│   ├── themes.ts
│   ├── watermarks.ts
│   ├── licensing.ts
│   └── cloud-storage.ts
├── tests/
│   ├── pdf-converter.test.ts
│   ├── pptx-converter.test.ts
│   ├── docx-converter.test.ts
│   ├── licensing.test.ts
│   └── integration.test.ts
├── scripts/
│   └── generate-license.ts               # License generation CLI
├── docs/
│   ├── index.md                          # Landing page
│   ├── pricing.md                        # Pricing page
│   ├── features.md                       # Features page
│   └── docs.md                           # Documentation
├── .github/
│   └── workflows/
│       ├── ci-cd.yml                     # CI/CD pipeline
│       └── pages.yml                     # GitHub Pages
├── README.md                             # Main documentation
├── flexdoc-spec.md                       # This file
├── package.json
├── tsconfig.json
├── .env.example
└── LICENSE
```

### B. Environment Variables

```bash
# License Key
FLEXDOC_LICENSE_KEY=your-license-key

# API Server
PORT=3000
NODE_ENV=production

# Stripe (for payments)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# License Generation
LICENSE_PRIVATE_KEY_PATH=./keys/license_key

# Email (for license delivery)
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.xxx
EMAIL_FROM=licenses@yourdomain.com

# Database (optional, for license storage)
DATABASE_PROVIDER=firebase
FIREBASE_PROJECT_ID=your-project
FIREBASE_PRIVATE_KEY=...
FIREBASE_CLIENT_EMAIL=...

# Cloud Storage (optional)
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AZURE_STORAGE_ACCOUNT=...
AZURE_STORAGE_KEY=...
```

### C. Useful Links

- **GitHub Repository**: https://github.com/rakeshwfg/flexdoc
- **npm Package**: https://www.npmjs.com/package/flexdoc
- **Documentation**: https://rakeshwfg.github.io/flexdoc
- **Pricing**: https://rakeshwfg.github.io/flexdoc/pricing
- **GitHub Sponsors**: https://github.com/sponsors/rakeshwfg
- **Issues**: https://github.com/rakeshwfg/flexdoc/issues

### D. Support

- **Email**: rakesh16@gmail.com
- **GitHub Issues**: https://github.com/rakeshwfg/flexdoc/issues
- **GitHub Discussions**: https://github.com/rakeshwfg/flexdoc/discussions
- **Twitter**: [@rakesh8116](https://x.com/rakesh8116)

---

**Document Version**: 1.0
**Last Updated**: 2025-10-20
**Maintained by**: Rakesh Singh


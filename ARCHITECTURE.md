# FlexDoc Architecture

## Table of Contents
- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Core Components](#core-components)
- [Data Flow](#data-flow)
- [Deployment Architectures](#deployment-architectures)
- [Technology Stack](#technology-stack)
- [Design Patterns](#design-patterns)
- [Performance Considerations](#performance-considerations)

---

## Overview

FlexDoc is a **server-side Node.js library** for converting HTML to PDF, PPTX, and DOCX formats. It's designed for enterprise use with professional-grade output quality, matching Adobe API standards without the cost.

### Key Characteristics
- **Runtime**: Node.js (v14+)
- **Architecture**: Modular, converter-based
- **API Style**: Unified interface with format-specific converters
- **Distribution**: npm package, REST API server, Docker container
- **Dependencies**: Zero paid dependencies (Puppeteer, pptxgenjs, docx, jsdom)

---

## System Architecture

### High-Level Architecture

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
│  ┌────────────────────────────────────────────┐             │
│  │         Support Modules                    │             │
│  │  - Theme System                            │             │
│  │  - Cloud Storage Manager                   │             │
│  │  - Validators & Utils                      │             │
│  └────────────────────────────────────────────┘             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Layer Breakdown

#### 1. **Interface Layer** (Entry Points)
- **FlexDoc Class**: Main unified API
- **CLI Tool**: Command-line interface using Commander.js
- **REST API**: Express.js server with OpenAPI/Swagger

#### 2. **Converter Layer** (Format Handlers)
- **PDF Converter**: Puppeteer-based (headless Chrome)
- **PPTX Converter**:
  - Standard mode (pptxgenjs)
  - Enhanced mode (advanced features)
  - Professional mode (ML-enhanced)
- **DOCX Converter**: Using docx library

#### 3. **Engine Layer** (Core Processing)
- **AI Layout Engine**: Content analysis and optimization
- **Chart Engine**: Table-to-chart conversion
- **Image Processing Engine**: Image optimization and manipulation
- **ML Layout Detection**: Intelligent content classification

#### 4. **Support Layer** (Cross-Cutting Concerns)
- **Theme System**: 25+ professional themes
- **Cloud Storage**: S3, Azure Blob, Google Drive
- **Utilities**: Validators, file handlers, watermarks

---

## Core Components

### 1. FlexDoc Main Class (`src/index.ts`)

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
}
```

**Responsibilities**:
- Route requests to appropriate converters
- Handle cloud upload integration
- Manage batch processing
- Error handling and retry logic

### 2. Converter Pattern

All converters implement the `IConverter` interface:

```typescript
interface IConverter {
  convert(html: string | HTMLInput, options: FormatOptions): Promise<ConversionResult>
}
```

#### PDF Converter (`src/converters/pdf-converter.ts`)

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

#### PPTX Converter (`src/converters/pptx-converter.ts`)

**Flow**:
```
HTML Input → Parse with JSDOM → Extract Sections → Create Slides → Generate PPTX
```

**Modes**:
1. **Standard Mode**: Basic HTML to slides
2. **Enhanced Mode**: Advanced layout features
3. **Professional Mode**: ML-powered optimization

**Key Features**:
- Semantic HTML support (`<section>`, `<article>`)
- Structured content extraction (tables, lists)
- Native PPTX table rendering
- Theme system integration
- Chart auto-generation

**Dependencies**: `pptxgenjs`, `jsdom`, `html-to-text`

#### DOCX Converter (`src/converters/docx-converter.ts`)

**Flow**:
```
HTML Input → Parse with JSDOM → Convert to DOCX Elements → Generate Document
```

**Key Features**:
- Paragraph and heading conversion
- Table support
- Image embedding
- Style preservation

**Dependencies**: `docx`, `jsdom`

### 3. Engine Layer

#### AI Layout Engine (`src/engines/ai-layout-engine.ts`)

**Purpose**: Intelligent content analysis and layout optimization

**Components**:
- `AILayoutOptimizer`: Analyzes content structure
- `ContentIntelligence`: Topic extraction, sentiment analysis
- `SmartSplitEngine`: Intelligent section detection

**Key Algorithms**:
```typescript
// Content Analysis
analyzeContent(html: string) → {
  structure: StructureAnalysis
  complexity: ComplexityScore
  topics: string[]
  sentiment: SentimentScore
}

// Layout Optimization
optimizeLayout(content: ContentBlock[]) → {
  visualBalance: number
  contentDensity: number
  whitespace: number
}
```

#### Chart Engine (`src/engines/chart-engine.ts`)

**Purpose**: Automatic table-to-chart conversion

**Flow**:
```
HTML Table → Data Extraction → Chart Type Detection → Chart Generation
```

**Supported Chart Types**:
- Bar (vertical/horizontal)
- Line (single/multi-series)
- Pie/Doughnut
- Area
- Scatter

**Algorithm**:
```typescript
detectChartType(data: TableData) → ChartType {
  if (hasCategories && hasSingleSeries) return 'bar'
  if (hasTimeSeries) return 'line'
  if (hasPercentages) return 'pie'
  // ... intelligent detection
}
```

#### Image Processing Engine (`src/engines/image-processing-engine.ts`)

**Purpose**: Image optimization and manipulation

**Features**:
- Smart cropping with focal point detection
- Background removal
- Enhancement (contrast, sharpness)
- Collage creation (grid, masonry, hero)
- Watermarking

**Dependencies**: `sharp`

#### ML Layout Detection (`src/ml/`)

**Purpose**: Heuristic-based content classification

**Components**:
```
src/ml/
├── types.ts              # ML type definitions
├── content-analyzer.ts   # Content classification
└── layout-detector.ts    # Pattern recognition
```

**Content Types** (11):
- Title, Heading, Paragraph, List, Table
- Image, Code, Quote, Chart, Callout, Footer

**Layout Patterns** (7):
- Document, Presentation, Report, Article
- Tutorial, Dashboard, Landing Page

**Importance Scoring**:
```typescript
calculateImportance(element, type, position) → ImportanceLevel {
  // 5 levels: CRITICAL, HIGH, MEDIUM, LOW, MINIMAL
  // Factors: type, position, keywords, emphasis
}
```

### 4. Theme System (`src/themes/`)

**Structure**:
```
src/themes/
├── theme-types.ts        # Type definitions
├── theme-presets.ts      # 25+ predefined themes
├── theme-builder.ts      # Custom theme creation
├── theme-manager.ts      # Theme management
├── color-utils.ts        # Color manipulation
└── font-pairings.ts      # Font combinations
```

**Theme Categories**:
- Business (Corporate, Professional, Executive)
- Creative (Vibrant, Playful, Artistic)
- Tech (Modern, Futuristic, Developer)
- Academic (Research, Educational)
- Minimal (Clean, Simple, Elegant)

**Theme Properties**:
```typescript
interface Theme {
  name: string
  category: ThemeCategory
  colors: ColorScheme      // primary, secondary, accent, etc.
  typography: Typography   // fonts, sizes, weights
  effects: Effects         // shadows, gradients, animations
  layout: LayoutPresets    // spacing, padding, margins
}
```

### 5. Cloud Storage Manager (`src/cloud/`)

**Architecture**:
```
CloudStorageManager (Unified API)
    │
    ├── S3Adapter (AWS S3)
    ├── AzureAdapter (Azure Blob)
    └── DriveAdapter (Google Drive - planned)
```

**Flow**:
```
Document Generated → Upload to Cloud → Return URL
```

**URL Format**:
```
s3://bucket-name/path/to/file.pdf
azure://container/path/to/file.pptx
drive://folder-id/file.docx
```

**Features**:
- Multipart uploads for large files
- Streaming downloads
- Credential management
- Provider abstraction

---

## Data Flow

### 1. PDF Generation Flow

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
│ Convert to      │
│ Buffer          │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Save/Return     │
│ + Cloud Upload  │
└─────────────────┘
```

### 2. PPTX Generation Flow (Professional Mode)

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

### 3. REST API Request Flow

```
┌──────────────┐
│ HTTP Request │
│ POST /api/   │
│ convert/pptx │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Middleware   │
│ - Auth       │
│ - Rate Limit │
│ - CORS       │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Upload File  │
│ (Multer)     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Create Job   │
│ (JobManager) │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Call FlexDoc │
│ Converter    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Save Output  │
│ to temp file │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Return Job   │
│ ID & Status  │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ Client Downloads │
│ GET /jobs/:id/   │
│ download         │
└──────────────────┘
```

---

## Deployment Architectures

### 1. Direct Library Usage (Node.js Apps)

```
┌────────────────────────────────┐
│   Your Node.js Application     │
│                                 │
│  ┌──────────────────────────┐  │
│  │  const { FlexDoc }       │  │
│  │  const flexdoc = new...  │  │
│  │  await flexdoc.toPDF()   │  │
│  └──────────────────────────┘  │
│                                 │
│  Dependencies:                  │
│  - flexdoc (npm)                │
│  - Node.js runtime              │
└────────────────────────────────┘
```

**Use Cases**:
- Server-side rendering in Next.js/Remix
- Background job processors
- Serverless functions (Lambda, Cloud Functions)
- Build-time document generation

### 2. REST API Server

```
┌─────────────┐     HTTP      ┌──────────────────┐
│  Frontend   │ ◄────────────► │  FlexDoc API     │
│  React/Vue  │   REST API     │  (Express)       │
│  Mobile App │                │  Port 3000       │
└─────────────┘                └────────┬─────────┘
                                        │
┌─────────────┐                ┌────────▼─────────┐
│  Python App │ ◄──────────────│  FlexDoc Library │
└─────────────┘                └──────────────────┘
```

**Command**:
```bash
flexdoc serve --port 3000
```

**API Endpoints**:
- `POST /api/convert/pdf`
- `POST /api/convert/pptx`
- `POST /api/convert/docx`
- `POST /api/convert/batch`
- `GET /api/jobs/:id`
- `GET /api/jobs/:id/download`

### 3. Docker Deployment

```
┌────────────────────────────────────────┐
│           Docker Container              │
│  ┌──────────────────────────────────┐  │
│  │     FlexDoc API Server           │  │
│  │     Node.js + Chrome             │  │
│  │     Port 3000                    │  │
│  └──────────────────────────────────┘  │
│                                         │
│  Volumes:                               │
│  - /app/uploads  (input files)          │
│  - /app/outputs  (generated files)      │
└────────────────────────────────────────┘
```

**Docker Compose**:
```yaml
services:
  flexdoc-api:
    image: flexdoc:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    volumes:
      - ./uploads:/app/uploads
      - ./outputs:/app/outputs
```

### 4. Microservices Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   API       │────►│  FlexDoc    │────►│   Cloud     │
│   Gateway   │     │  Service    │     │   Storage   │
└─────────────┘     └─────────────┘     │   (S3)      │
                                        └─────────────┘
       │                   │
       │                   ▼
       │            ┌─────────────┐
       │            │  Message    │
       │            │  Queue      │
       │            │  (Redis)    │
       │            └─────────────┘
       │
       ▼
┌─────────────┐
│  Database   │
│  (Postgres) │
└─────────────┘
```

**Benefits**:
- Horizontal scaling
- Job queue for async processing
- Centralized storage
- Load balancing

---

## Technology Stack

### Core Dependencies

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

  // CLI
  "commander": "^14.0.1"        // CLI framework
}
```

#### Development Dependencies
```json
{
  "typescript": "^5.9.3",       // Type checking
  "jest": "^30.2.0",            // Testing
  "eslint": "^9.36.0",          // Linting
  "@types/node": "^24.6.2"      // Node.js types
}
```

### Technology Choices & Rationale

| Technology | Purpose | Why Chosen |
|------------|---------|------------|
| **Puppeteer** | PDF Generation | Industry standard, Chrome rendering engine, high fidelity |
| **pptxgenjs** | PPTX Creation | Native PowerPoint generation, no dependencies on Office |
| **docx** | DOCX Creation | Open source, Office Open XML format support |
| **jsdom** | HTML Parsing | Server-side DOM, fast, lightweight |
| **sharp** | Image Processing | High performance, libvips-based, native modules |
| **Express** | REST API | Minimal, flexible, widely adopted |
| **TypeScript** | Development | Type safety, better DX, compile-time checks |

---

## Design Patterns

### 1. **Strategy Pattern** (Converters)

Each format has its own converter implementing `IConverter`:

```typescript
interface IConverter {
  convert(html: string, options: any): Promise<ConversionResult>
}

class PDFConverter implements IConverter { ... }
class PPTXConverter implements IConverter { ... }
class DOCXConverter implements IConverter { ... }
```

### 2. **Factory Pattern** (Theme Creation)

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

### 3. **Adapter Pattern** (Cloud Storage)

```typescript
interface ICloudStorageAdapter {
  upload(file: string, options: UploadOptions): Promise<UploadResult>
  download(url: string): Promise<Buffer>
}

class S3Adapter implements ICloudStorageAdapter { ... }
class AzureAdapter implements ICloudStorageAdapter { ... }
```

### 4. **Singleton Pattern** (Converter Instances)

```typescript
// Export singleton instances
export const pdfConverter = new PDFConverter()
export const pptxConverter = new PPTXConverter()
export const docxConverter = new DOCXConverter()
```

### 5. **Builder Pattern** (Options Construction)

```typescript
const options = new PDFOptionsBuilder()
  .withFormat('A4')
  .withMargins({ top: '1cm', bottom: '1cm' })
  .withWatermark({ text: 'Confidential' })
  .build()
```

---

## Performance Considerations

### 1. **PDF Generation**

**Bottlenecks**:
- Puppeteer browser launch (~500-1000ms)
- Page rendering (depends on HTML complexity)

**Optimizations**:
- Browser reuse (keep browser instance alive)
- Page pooling for concurrent requests
- Lazy loading images
- CSS/JS minification

**Benchmarks**:
```
Simple PDF (1 page):    ~500ms
Complex PDF (10 pages): ~2000ms
PDF with images:        ~1500ms + image load time
```

### 2. **PPTX Generation**

**Bottlenecks**:
- DOM parsing with jsdom
- Table/list extraction
- Chart generation

**Optimizations**:
- JSDOM caching for repeated conversions
- Parallel slide generation
- Lazy chart rendering

**Benchmarks**:
```
Simple PPTX (3 slides):    ~50ms
Complex PPTX (11 slides):  ~130ms
Professional mode:         ~30ms (no Puppeteer!)
```

### 3. **Memory Management**

**Strategies**:
- Stream large files instead of buffering
- Clean up temp files after conversion
- Limit concurrent conversions (queue)
- Browser instance limits

**Limits**:
```
Max file size:          50MB (configurable)
Max concurrent jobs:    10 (configurable)
Temp file retention:    1 hour (configurable)
```

### 4. **Scaling**

**Horizontal Scaling**:
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

**Vertical Scaling**:
- Increase Node.js heap size (`--max-old-space-size`)
- More CPU cores for parallel processing
- SSD for faster I/O

---

## Security Considerations

### 1. **Input Validation**
- Sanitize HTML input
- Validate file uploads (size, type)
- Check for malicious scripts

### 2. **Rate Limiting**
```typescript
rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100                    // 100 requests per window
})
```

### 3. **Authentication**
- API key support
- JWT tokens
- OAuth integration (future)

### 4. **File System**
- Sandboxed temp directories
- File path validation
- Automatic cleanup

### 5. **Cloud Storage**
- Encrypted credentials
- IAM role support
- Signed URLs for downloads

---

## Future Architecture Enhancements

### Planned Features

1. **Browser-Based Version**
   - WebAssembly PDF generation
   - Client-side PPTX creation
   - No server required for simple conversions

2. **Plugin System**
   ```typescript
   flexdoc.use(customPlugin({
     beforeConvert: (html) => transform(html),
     afterConvert: (result) => postProcess(result)
   }))
   ```

3. **Real-time Collaboration**
   - WebSocket support
   - Live preview
   - Multi-user editing

4. **Template Marketplace**
   - Community-contributed themes
   - Template versioning
   - Rating system

---

## Conclusion

FlexDoc's architecture is designed for:

✅ **Modularity** - Easy to extend with new formats/features
✅ **Performance** - Optimized for speed and memory efficiency
✅ **Scalability** - Horizontal and vertical scaling support
✅ **Flexibility** - Multiple deployment options (library, API, Docker)
✅ **Enterprise-Ready** - Security, error handling, monitoring

The architecture supports both simple use cases (single library import) and complex deployments (microservices, cloud-native).

---

**Version**: 1.8.2
**Last Updated**: 2025-10-04
**Maintained by**: Rakesh Singh

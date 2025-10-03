# FlexDoc - Complete Project Requirements & Context

## 🎯 Project Overview

**FlexDoc** is a professional-grade, open-source npm library that converts HTML to PDF and PPTX (PowerPoint) formats. It's designed as a **free alternative to Adobe's expensive APIs**, providing enterprise-quality output without any cost, rate limits, or privacy concerns.

### Core Value Proposition
- **Replace Adobe APIs** ($0.05 per operation) with a free solution
- **Professional quality** output matching Adobe's standards
- **Complete privacy** - all processing happens locally
- **No limitations** - no rate limits, quotas, or restrictions
- **Full customization** - open source with complete control

## 📋 Detailed Requirements

### 1. Primary Functionality

#### 1.1 HTML to PDF Conversion
- **Engine**: Puppeteer (headless Chrome)
- **Features**:
  - Multiple page formats (A4, Letter, Legal, etc.)
  - Custom page dimensions
  - Headers and footers
  - Page margins and orientation
  - Background graphics
  - Scale adjustment
  - Page ranges
  - CSS preservation

#### 1.2 HTML to PPTX Conversion
- **Engine**: pptxgenjs + custom AI optimization
- **Standard Mode Features**:
  - Basic HTML to slides conversion
  - Automatic content splitting
  - Simple layouts
  - Basic styling

- **Professional Mode Features** (Adobe-quality):
  - AI-powered layout optimization
  - Automatic chart generation from tables
  - Professional design templates
  - Smart image processing
  - Content intelligence (summarization, key points)
  - Visual hierarchy establishment
  - Golden ratio and rule of thirds application
  - Multiple master slides
  - Theme support (Corporate, Creative, Minimal, Tech)

### 2. Technical Architecture

```
flexdoc/
├── src/
│   ├── index.ts                     # Main FlexDoc class
│   ├── types/                       # TypeScript definitions
│   │   └── index.ts                 # All interfaces and types
│   ├── converters/                  # Conversion engines
│   │   ├── pdf-converter.ts         # Puppeteer-based PDF
│   │   ├── pptx-converter.ts        # Basic PPTX conversion
│   │   ├── enhanced-pptx-converter.ts # Enhanced features
│   │   └── professional-pptx-converter.ts # Adobe-quality
│   ├── engines/                     # Supporting engines
│   │   ├── chart-engine.ts          # Table to chart conversion
│   │   ├── image-processing-engine.ts # Image optimization
│   │   └── ai-layout-engine.ts      # AI layout optimization
│   └── utils/                       # Utilities
│       ├── validators.ts            # Input validation
│       └── file-handler.ts          # File operations
├── examples/                        # Usage examples
├── tests/                          # Test files
└── docs/                           # GitHub Pages site
```

### 3. API Design

#### 3.1 Unified API
```typescript
const flexdoc = new FlexDoc();

// Unified conversion
const result = await flexdoc.convert(html, {
  format: 'pdf' | 'pptx',
  outputPath?: string,
  // format-specific options
});
```

#### 3.2 Format-Specific APIs
```typescript
// PDF conversion
const pdfResult = await flexdoc.toPDF(html, {
  format?: 'A4' | 'Letter' | etc,
  margin?: { top, right, bottom, left },
  landscape?: boolean,
  // ... other PDF options
});

// PPTX conversion
const pptxResult = await flexdoc.toPPTX(html, {
  professional?: boolean,  // Enable Adobe-quality mode
  theme?: 'corporate' | 'creative' | 'minimal' | 'tech',
  splitBy?: 'h1' | 'h2' | 'section' | 'auto',
  // ... other PPTX options
});
```

#### 3.3 Additional Methods
```typescript
// Batch processing
await flexdoc.batchConvert(inputs);

// With retry logic
await flexdoc.convertWithRetry(html, options, maxRetries);
```

#### 3.4 CLI Interface ✅ v1.0.1
```bash
# PDF conversion
flexdoc pdf input.html -o output.pdf --format A4 --landscape

# PPTX conversion
flexdoc pptx input.html -o slides.pptx --theme corporate --split h1

# Batch conversion
flexdoc batch config.json

# System info
flexdoc info
```

**CLI Features**:
- Full command-line interface using Commander.js
- Support for all PDF and PPTX options
- Batch conversion with JSON config
- Progress tracking in terminal
- Human-readable output formatting
- Works with npx (no global installation needed)

### 4. Professional PPTX Features (Adobe-level)

#### 4.1 AI-Powered Layout Optimization
- **Content Analysis**:
  - Structure detection
  - Complexity assessment
  - Topic extraction
  - Sentiment analysis
  - Key points identification

- **Layout Optimization**:
  - Visual balance calculation
  - Content density management
  - White space optimization
  - Hierarchy establishment
  - Golden ratio application

#### 4.2 Smart Content Processing
- **Automatic Splitting**:
  - Intelligent section detection
  - Optimal slide count calculation
  - Content distribution
  - Merge/split decisions

- **Content Enhancement**:
  - Text summarization
  - Bullet point conversion
  - Complex sentence simplification
  - Reading time estimation

#### 4.3 Visual Intelligence
- **Chart Generation**:
  - Automatic table analysis
  - Chart type selection (bar, line, pie, etc.)
  - Data visualization
  - Professional color schemes

- **Image Processing**:
  - Smart cropping with focal detection
  - Background removal
  - Enhancement (contrast, sharpness)
  - Collage creation (grid, masonry, hero)

- **Watermark Support** ✅ v1.1.0:
  - Text and image watermarks
  - Multiple positioning options (center, diagonal, corners)
  - Opacity control
  - Rotation support
  - Repeating patterns
  - Custom styling (font, color, size)

#### 4.4 Template System
- **Professional Templates**:
  ```javascript
  corporate: {
    colors: { primary: '#1B365D', secondary: '#4A90E2', ... },
    typography: { headingFont: 'Segoe UI', ... },
    effects: { shadows: true, gradients: true, ... }
  }
  ```

- **Template Matching**:
  - Content type detection
  - Automatic template selection
  - Layout adaptation

### 5. Input/Output Specifications

#### 5.1 Input Types
```typescript
// String input
await flexdoc.toPDF('<h1>Hello</h1>');

// File input
await flexdoc.toPDF({ filePath: './document.html' });

// URL input
await flexdoc.toPDF({ url: 'https://example.com' });

// Content object
await flexdoc.toPDF({ content: '<h1>Hello</h1>' });
```

#### 5.2 Output Format
```typescript
interface ConversionResult {
  success: boolean;
  format: 'pdf' | 'pptx';
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

### 6. Quality Benchmarks

#### Adobe API Parity Targets:
- **Layout Preservation**: 95% accuracy
- **Typography**: 95% fidelity
- **Image Quality**: 98% retention
- **Chart Generation**: 90% automation success
- **Overall Aesthetics**: 95% professional quality

### 7. Dependencies

```json
{
  "dependencies": {
    "puppeteer": "^21.0.0",      // PDF generation
    "pptxgenjs": "^3.12.0",      // PPTX creation
    "jsdom": "^23.0.0",          // HTML parsing
    "sharp": "^0.33.0",          // Image processing
    "html-to-text": "^9.0.5",    // Text extraction
    "commander": "^14.0.1"       // CLI interface ✅ v1.0.1
  }
}
```

### 8. Performance Requirements

- **PDF Generation**: < 2 seconds for 10-page document
- **PPTX Generation**: < 3 seconds for 20-slide presentation
- **Memory Usage**: < 500MB for typical documents
- **Concurrent Processing**: Support for parallel conversions

### 9. Error Handling

```typescript
enum ErrorType {
  INVALID_INPUT = 'INVALID_INPUT',
  CONVERSION_FAILED = 'CONVERSION_FAILED',
  TIMEOUT = 'TIMEOUT',
  FILE_WRITE_ERROR = 'FILE_WRITE_ERROR',
  BROWSER_LAUNCH_ERROR = 'BROWSER_LAUNCH_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR'
}

class FlexDocError extends Error {
  constructor(type: ErrorType, message: string, details?: any);
}
```

### 10. Progressive Enhancement Strategy

#### Phase 1 (Current - MVP):
- ✅ Basic PDF conversion
- ✅ Basic PPTX conversion
- ✅ Professional PPTX mode
- ✅ AI layout optimization
- ✅ Chart generation
- ✅ Image processing

#### Phase 2 (In Progress):
- [x] ~~Word document (.docx) support~~ ✅ **COMPLETED v1.4.0**
- [ ] Excel (.xlsx) generation
- [ ] Advanced ML-based layout detection
- [ ] Cloud storage integration
- [ ] REST API wrapper
- [x] ~~CLI tool~~ ✅ **COMPLETED v1.1.0**
- [x] ~~Watermark support for PDFs~~ ✅ **COMPLETED v1.1.0**
- [x] ~~Automatic chart generation from tables~~ ✅ **COMPLETED v1.2.0**
- [x] ~~Advanced theming engine with 25+ presets~~ ✅ **COMPLETED v1.3.0**

#### Phase 3 (Future):
- [ ] Browser-based version
- [ ] Real-time collaboration
- [ ] Template marketplace
- [ ] Plugin system
- [ ] SaaS offering (optional paid tier)

## 🎯 Success Criteria

1. **Adoption Metrics**:
   - 1,000+ npm downloads/month within 3 months
   - 100+ GitHub stars within 6 months
   - Active community contributions

2. **Quality Metrics**:
   - 95% user satisfaction with output quality
   - < 5% conversion failure rate
   - Performance on par or better than Adobe APIs

3. **Business Impact**:
   - Save users $1,000+ per month
   - Process 1M+ documents monthly across all users
   - Become the go-to Adobe alternative

## 🔧 Implementation Notes for AI/LLMs

### Key Design Decisions:

1. **Modular Architecture**: Each converter is independent, allowing easy extension
2. **TypeScript First**: Full type safety for better DX and fewer runtime errors
3. **Progressive Enhancement**: Basic features work immediately, professional features are optional
4. **Dual Mode**: Standard (fast, simple) vs Professional (Adobe-quality, AI-powered)
5. **Privacy by Design**: No external services except for URL fetching
6. **Zero Configuration**: Works out of the box with sensible defaults

### Critical Code Paths:

1. **PDF Generation**: `src/converters/pdf-converter.ts` - Uses Puppeteer
2. **PPTX Professional**: `src/converters/professional-pptx-converter.ts` - Adobe-quality
3. **AI Layout**: `src/engines/ai-layout-engine.ts` - Intelligence layer
4. **Chart Generation**: `src/engines/chart-engine.ts` - Auto visualization
5. **Image Processing**: `src/engines/image-processing-engine.ts` - Optimization

### Testing Strategy:

```javascript
// Test coverage targets
- Unit tests: 80% coverage
- Integration tests: Key workflows
- E2E tests: Real document conversions
- Performance tests: Benchmark against targets
```

### Common Customizations:

1. **Adding new themes**: Extend `DesignTemplates` in professional converter
2. **Custom chart types**: Extend `ChartEngine`
3. **New image layouts**: Add to `ImageLayoutEngine`
4. **Additional formats**: Create new converter in `src/converters/`

## 📦 Package Distribution

### npm Package Structure:
```
flexdoc/
├── dist/           # Compiled JavaScript
├── README.md       # Documentation
├── LICENSE         # MIT License
└── package.json    # Package metadata
```

### GitHub Repository:
```
flexdoc/
├── Source code (all files)
├── Examples
├── Tests
├── Documentation site
└── CI/CD configuration
```

## 🚀 Deployment Checklist

- [ ] Name availability checked (npm & GitHub)
- [ ] Code built and tested
- [ ] Documentation complete
- [ ] Examples working
- [ ] GitHub repository created
- [ ] GitHub Pages enabled
- [ ] npm package published
- [ ] CI/CD pipeline active
- [ ] Social media announced

## 💡 Unique Selling Points

1. **Free Forever**: No subscription, no per-operation costs
2. **Privacy First**: Data never leaves your servers
3. **No Limits**: Unlimited conversions, no rate limiting
4. **Professional Quality**: 95% parity with Adobe APIs
5. **Open Source**: Full transparency and customization
6. **Offline Capable**: Works without internet connection
7. **Enterprise Ready**: TypeScript, testing, documentation
8. **AI-Powered**: Intelligent optimization and enhancement

## 📝 Context for Future Development

This project aims to democratize document conversion by providing enterprise-quality tools for free. The vision is to become the standard solution for HTML to document conversion, saving millions of dollars for businesses worldwide while ensuring data privacy and sovereignty.

The codebase is designed to be:
- **Maintainable**: Clear structure, TypeScript, documented
- **Extensible**: Easy to add new formats and features
- **Performant**: Optimized for speed and memory
- **Reliable**: Comprehensive error handling and testing
- **Accessible**: Great documentation and examples

---

*This requirements document contains all necessary context for any AI/LLM to understand, maintain, and extend the FlexDoc project. Use this as the single source of truth for project understanding.*

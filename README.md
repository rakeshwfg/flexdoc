# FlexDoc 📄

<p align="center">
  <strong>A flexible, lightweight npm library for converting HTML to PDF and PPTX formats</strong>
  <br>
  <em>Professional-grade, open-source alternative to Adobe's expensive APIs</em>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#api-documentation">API</a> •
  <a href="#examples">Examples</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#support-this-project">Support</a>
</p>

---

## 🌟 Features

- 🚀 **Dual Format Support**: Convert HTML to both PDF and PPTX formats
- 🎯 **Unified API**: Single interface for all conversions with format-specific options
- 📦 **Zero Paid Dependencies**: Uses only open-source libraries (Puppeteer, pptxgenjs)
- 🎨 **Custom Styling**: Support for custom CSS and JavaScript injection
- 📊 **Progress Tracking**: Real-time conversion progress updates
- 🔄 **Batch Processing**: Convert multiple documents simultaneously
- 💪 **Enterprise Ready**: TypeScript support, error handling, and retry logic
- 🌐 **Multiple Input Sources**: HTML string, file path, or URL
- ⚙️ **Highly Configurable**: Extensive options for both PDF and PPTX generation

## 📦 Installation

```bash
npm install flexdoc
```

or with yarn:

```bash
yarn add flexdoc
```

## 🚀 Quick Start

### Basic Usage

```javascript
const { FlexDoc } = require('flexdoc');
// or ES6: import { FlexDoc } from 'flexdoc';

const flexdoc = new FlexDoc();

// Convert HTML to PDF
const pdfResult = await flexdoc.toPDF('<h1>Hello World</h1>', {
  outputPath: './output.pdf',
  format: 'A4'
});

// Convert HTML to PPTX
const pptxResult = await flexdoc.toPPTX('<h1>Slide 1</h1><h2>Slide 2</h2>', {
  outputPath: './presentation.pptx',
  splitBy: 'h2'
});
```

### TypeScript Usage

```typescript
import { FlexDoc, OutputFormat, PDFOptions, PPTXOptions } from 'flexdoc';

const flexdoc = new FlexDoc();

// With full type safety
const options: PDFOptions = {
  format: 'A4',
  printBackground: true,
  margin: {
    top: '2cm',
    bottom: '2cm'
  }
};

const result = await flexdoc.toPDF(htmlContent, options);
```

## 🖥️ CLI Usage

FlexDoc includes a powerful command-line interface for quick conversions.

### Installation

After installing FlexDoc globally or in your project, the `flexdoc` command becomes available:

```bash
# Global installation
npm install -g flexdoc

# Or use with npx (no installation needed)
npx flexdoc --help
```

### Commands

#### Convert to PDF

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

# From URL
flexdoc pdf https://example.com -o webpage.pdf

# With custom CSS
flexdoc pdf input.html --css styles.css -o styled.pdf

# With header and footer
flexdoc pdf input.html \
  --header "<div>My Header</div>" \
  --footer "<div>Page <span class='pageNumber'></span></div>" \
  -o document.pdf

# With watermark
flexdoc pdf document.html \
  --watermark-text "CONFIDENTIAL" \
  --watermark-position diagonal \
  --watermark-opacity 0.3 \
  -o confidential.pdf
```

**PDF Options:**
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
- `--watermark-text <text>` - Watermark text
- `--watermark-image <path>` - Watermark image file path
- `--watermark-position <position>` - Watermark position: center, diagonal, top-left, top-right, bottom-left, bottom-right, top-center, bottom-center (default: center)
- `--watermark-opacity <number>` - Watermark opacity 0-1 (default: 0.3)
- `--watermark-font-size <number>` - Watermark font size (default: 72)
- `--watermark-color <color>` - Watermark color (default: #000000)
- `--watermark-rotation <degrees>` - Watermark rotation in degrees (default: 0)
- `--watermark-repeat` - Repeat watermark across page
- `--debug` - Enable debug mode

#### Convert to PPTX

```bash
# Basic usage
flexdoc pptx input.html -o presentation.pptx

# With options
flexdoc pptx input.html \
  --output slides.pptx \
  --layout 16x9 \
  --split h1 \
  --title "My Presentation" \
  --author "John Doe" \
  --theme corporate

# From URL
flexdoc pptx https://example.com/slides -o presentation.pptx

# With custom settings
flexdoc pptx content.html \
  --split h2 \
  --theme dark \
  --max-content 300 \
  --no-images
```

**PPTX Options:**
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

#### Batch Conversion

Convert multiple files using a JSON configuration:

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

#### System Information

```bash
flexdoc info
```

Shows FlexDoc version, Node.js version, and supported formats.

### CLI Examples

```bash
# Convert HTML file to PDF with custom margins
flexdoc pdf document.html -o report.pdf --margin-top 3cm --margin-bottom 3cm

# Convert webpage to landscape PDF
flexdoc pdf https://github.com -o github.pdf --landscape --format Letter

# Add diagonal confidential watermark
flexdoc pdf report.html --watermark-text "CONFIDENTIAL" --watermark-position diagonal --watermark-opacity 0.2 -o secure.pdf

# Add image watermark
flexdoc pdf document.html --watermark-image logo.png --watermark-position bottom-right --watermark-opacity 0.5 -o branded.pdf

# Create presentation from HTML with custom theme
flexdoc pptx content.html -o slides.pptx --theme dark --split h1 --title "Q4 Report"

# Batch convert multiple documents
flexdoc batch conversions.json --debug

# Get help for a specific command
flexdoc pdf --help
flexdoc pptx --help
```

## 📖 API Documentation

### Main Class: `FlexDoc`

#### Methods

##### `toPDF(html, options?)`
Convert HTML to PDF format.

```javascript
const result = await flexdoc.toPDF(html, {
  outputPath: './document.pdf',
  format: 'A4',
  printBackground: true,
  margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' },
  landscape: false,
  scale: 1,
  displayHeaderFooter: true,
  headerTemplate: '<div>Header</div>',
  footerTemplate: '<div>Page <span class="pageNumber"></span></div>'
});
```

##### `toPPTX(html, options?)`
Convert HTML to PowerPoint presentation.

```javascript
const result = await flexdoc.toPPTX(html, {
  outputPath: './presentation.pptx',
  layout: '16x9',
  splitBy: 'h2',
  title: 'My Presentation',
  author: 'John Doe',
  theme: 'corporate'
});
```

##### `convert(html, options)`
Unified API for both formats.

```javascript
const result = await flexdoc.convert(html, {
  format: OutputFormat.PDF, // or OutputFormat.PPTX
  outputPath: './output.pdf',
  pdfOptions: { /* PDF-specific options */ },
  pptxOptions: { /* PPTX-specific options */ }
});
```

##### `convertBatch(items)`
Process multiple conversions.

```javascript
const results = await flexdoc.convertBatch([
  { html: content1, format: OutputFormat.PDF, options: { format: 'A4' } },
  { html: content2, format: OutputFormat.PPTX, options: { layout: '16x9' } }
]);
```

### Input Options

FlexDoc accepts HTML in multiple formats:

```javascript
// 1. HTML String
await flexdoc.toPDF('<h1>Hello</h1>');

// 2. File Path
await flexdoc.toPDF({ filePath: './document.html' });

// 3. URL
await flexdoc.toPDF({ url: 'https://example.com' });

// 4. HTML Content Object
await flexdoc.toPDF({ content: '<h1>Hello</h1>' });
```

### PDF Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `format` | string | 'A4' | Paper format (A4, A3, Letter, etc.) |
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

### PPTX Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `layout` | string | '16x9' | Slide layout (16x9, 16x10, 4x3) |
| `slideWidth` | number | 10 | Slide width in inches |
| `slideHeight` | number | 5.625 | Slide height in inches |
| `splitBy` | string | 'h2' | Element to split slides by |
| `title` | string | - | Presentation title |
| `author` | string | - | Presentation author |
| `company` | string | - | Company name |
| `theme` | string | 'default' | Presentation theme (default, dark, corporate, creative) |
| `includeImages` | boolean | true | Include images from HTML |
| `maxContentPerSlide` | number | 500 | Max characters per slide (auto-split) |

### Common Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `outputPath` | string | - | Output file path |
| `debug` | boolean | false | Enable debug logging |
| `timeout` | number | 30000 | Timeout in milliseconds |
| `onProgress` | function | - | Progress callback |
| `customCSS` | string | - | Custom CSS to inject |
| `executeScript` | string | - | JavaScript to execute |
| `waitForSelector` | string | - | Wait for element before conversion |

## 📝 Examples

### Convert a Website to PDF

```javascript
const result = await flexdoc.toPDF({
  url: 'https://github.com'
}, {
  outputPath: './github.pdf',
  format: 'A4',
  printBackground: true
});
```

### Create a Presentation from HTML

```javascript
const html = `
  <h1>Introduction</h1>
  <p>Welcome to our presentation</p>

  <h1>Features</h1>
  <ul>
    <li>Feature 1</li>
    <li>Feature 2</li>
  </ul>

  <h1>Conclusion</h1>
  <p>Thank you!</p>
`;

const result = await flexdoc.toPPTX(html, {
  outputPath: './slides.pptx',
  splitBy: 'h1',
  theme: 'corporate'
});
```

### Add Watermarks to PDFs

```javascript
// Text watermark
await flexdoc.toPDF(html, {
  outputPath: './confidential.pdf',
  watermark: {
    text: 'CONFIDENTIAL',
    position: 'diagonal',  // or 'center', 'top-left', 'top-right', etc.
    opacity: 0.2,
    fontSize: 80,
    color: '#FF0000'
  }
});

// Image watermark
await flexdoc.toPDF(html, {
  outputPath: './branded.pdf',
  watermark: {
    image: './logo.png',
    position: 'bottom-right',
    opacity: 0.5,
    imageWidth: 100,
    imageHeight: 100
  }
});

// Repeating watermark pattern
await flexdoc.toPDF(html, {
  outputPath: './draft.pdf',
  watermark: {
    text: 'DRAFT',
    repeat: true,
    opacity: 0.1,
    fontSize: 40
  }
});

// Custom styled watermark
await flexdoc.toPDF(html, {
  outputPath: './sample.pdf',
  watermark: {
    text: 'SAMPLE',
    position: 'center',
    opacity: 0.3,
    fontSize: 72,
    color: '#3498db',
    rotation: -45,
    fontFamily: 'Arial Black',
    fontWeight: 'bold'
  }
});
```

**Watermark Options:**
- `text` - Watermark text
- `image` - Path to watermark image
- `position` - Placement: center, diagonal, top-left, top-right, bottom-left, bottom-right, top-center, bottom-center
- `opacity` - Transparency (0-1)
- `fontSize` - Font size for text watermarks
- `color` - Text color (hex or named)
- `rotation` - Rotation angle in degrees
- `repeat` - Repeat across entire page
- `fontFamily` - Font family for text
- `fontWeight` - Font weight
- `imageWidth` / `imageHeight` - Image dimensions

### Progress Tracking

```javascript
await flexdoc.toPDF(html, {
  outputPath: './document.pdf',
  onProgress: (progress) => {
    console.log(`${progress.percentage}% - ${progress.step}`);
  }
});
```

### Custom Styling and Scripts

```javascript
await flexdoc.toPDF(html, {
  customCSS: `
    body { font-family: 'Helvetica', sans-serif; }
    .highlight { background-color: yellow; }
  `,
  executeScript: `
    document.querySelectorAll('h1').forEach(h => {
      h.style.color = 'blue';
    });
  `,
  waitForSelector: '.dynamic-content'
});
```

### Error Handling

```javascript
try {
  const result = await flexdoc.toPDF(html, options);
  if (result.success) {
    console.log('Conversion successful!');
    console.log('File size:', result.size);
    console.log('Duration:', result.duration, 'ms');
  }
} catch (error) {
  if (error.type === 'VALIDATION_ERROR') {
    console.error('Invalid options:', error.message);
  } else if (error.type === 'CONVERSION_FAILED') {
    console.error('Conversion failed:', error.message);
  }
}
```

### Batch Processing

```javascript
const documents = [
  { content: '<h1>Doc 1</h1>', name: 'doc1.pdf' },
  { content: '<h1>Doc 2</h1>', name: 'doc2.pdf' },
  { content: '<h1>Doc 3</h1>', name: 'doc3.pptx' }
];

const inputs = documents.map(doc => ({
  html: doc.content,
  format: doc.name.endsWith('.pdf') ? OutputFormat.PDF : OutputFormat.PPTX,
  options: {
    outputPath: `./output/${doc.name}`
  }
}));

const results = await flexdoc.convertBatch(inputs);
console.log(`Converted ${results.successful} of ${results.total} documents`);
```

## 🏗️ Architecture

FlexDoc is built with a modular architecture:

```
flexdoc/
├── src/
│   ├── index.ts           # Main FlexDoc class
│   ├── types.ts           # TypeScript definitions
│   ├── converters/        # PDF and PPTX converters
│   │   ├── pdf-converter.ts
│   │   ├── pptx-converter.ts
│   │   ├── enhanced-pptx-converter.ts
│   │   └── professional-pptx-converter.ts
│   ├── engines/           # Processing engines
│   │   ├── chart-engine.ts
│   │   ├── image-processing-engine.ts
│   │   └── ai-layout-engine.ts
│   └── utils/             # Utility functions
│       ├── validators.ts
│       └── file-handler.ts
```

## 🧪 Testing

Run tests with:

```bash
npm test
```

Run examples:

```bash
npm run example
npm run example:pdf
npm run example:pptx
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### How to Contribute

1. **Fork the repository**
2. **Create your feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Development Setup

```bash
# Clone your fork
git clone https://github.com/yourusername/flexdoc.git
cd flexdoc

# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test

# Build
npm run build
```

### Contribution Guidelines

- Write clear, concise commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style
- Ensure all tests pass before submitting PR

## 💖 Support This Project

If FlexDoc has helped you or your organization, consider supporting its development!

### ☕ Buy Me a Coffee

Your support helps maintain and improve FlexDoc:

- ⭐ **Star this repository** on [GitHub](https://github.com/rakeshwfg/flexdoc)
- 💝 **Sponsor on GitHub**: [Become a sponsor](https://github.com/sponsors/rakeshwfg)
- ☕ **Buy me a coffee**: [ko-fi.com/rakeshsingh16](https://ko-fi.com/rakeshsingh16)
- 💳 **One-time donation**: [PayPal](https://paypal.me/rakesh8116)

### 🌟 Other Ways to Support

- 📢 **Share** FlexDoc with your network
- 🐛 **Report bugs** and suggest features
- 📝 **Write** blog posts or tutorials about FlexDoc
- 💻 **Contribute** code, documentation, or examples
- 💬 **Help others** in GitHub discussions

### 🏢 Enterprise Support

Need dedicated support, custom features, or consulting?

- 📧 Email: rakesh16@gmail.com
- 🔗 LinkedIn: [Your LinkedIn Profile](https://www.linkedin.com/in/rakesh-singh-1ab4563/)
- 💼 Custom development and integration services available

### 🙏 Thank You!

Every contribution, no matter how small, makes a difference. Thank you for supporting open source!

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Puppeteer](https://github.com/puppeteer/puppeteer) for PDF generation
- [PptxGenJS](https://github.com/gitbrent/PptxGenJS) for PPTX creation
- [jsdom](https://github.com/jsdom/jsdom) for HTML parsing
- [html-to-text](https://github.com/html-to-text/node-html-to-text) for text extraction
- [Sharp](https://github.com/lovell/sharp) for image processing

## 📞 Support

For issues, questions, or suggestions, please:
- 📋 Open an issue on [GitHub](https://github.com/yourusername/flexdoc/issues)
- 💬 Start a discussion on [GitHub Discussions](https://github.com/yourusername/flexdoc/discussions)
- 📖 Check the [examples](./examples) directory
- 📚 Read the [API documentation](#api-documentation)

## 🚀 Roadmap

- [ ] Add support for Excel/CSV export
- [ ] Implement Word document (.docx) generation
- [x] ~~Add watermark support for PDFs~~ ✅ **COMPLETED v1.1.0**
- [ ] Support for charts and graphs in presentations
- [ ] Cloud storage integration (S3, Google Drive)
- [x] ~~CLI tool for command-line conversions~~ ✅ **COMPLETED v1.1.0**
- [ ] Browser-based version
- [ ] Template marketplace
- [ ] Advanced theming engine
- [ ] Multi-language support

## 🌍 Community

Join our community:

- 🐦 Twitter: [@rakesh8116](https://x.com/rakesh8116)
- 💬 Discord: [Join our server](https://discord.gg/yourserver)
- 📱 Telegram: [FlexDoc Community](https://t.me/flexdoc)

---

<p align="center">
  <strong>Made with ❤️ by <a href="https://github.com/yourusername">Rakesh Singh</a></strong>
  <br>
  <sub>Free and Open Source • Enterprise Ready • Zero Dependencies Cost</sub>
</p>

<p align="center">
  <a href="https://github.com/yourusername/flexdoc/stargazers">⭐ Star us on GitHub!</a>
</p>

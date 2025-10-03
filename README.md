<<<<<<< HEAD
# flexdoc
**FlexDoc** is a professional-grade, open-source npm library that converts HTML to PDF and PPTX (PowerPoint) formats. It's designed as a **free alternative to Adobe's expensive APIs**, providing enterprise-quality output without any cost, rate limits, or privacy concerns.
=======
# FlexDoc 📄

<p align="center">
  <strong>A flexible, lightweight npm library for converting HTML to PDF and PPTX formats</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#api-documentation">API</a> •
  <a href="#examples">Examples</a> •
  <a href="#license">License</a>
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
  theme: {
    primary: '#2E86C1',
    secondary: '#85C1E9',
    background: '#FFFFFF',
    textColor: '#333333'
  }
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

##### `batchConvert(inputs)`
Process multiple conversions.

```javascript
const results = await flexdoc.batchConvert([
  { html: content1, options: { format: OutputFormat.PDF } },
  { html: content2, options: { format: OutputFormat.PPTX } }
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
| `layout` | string | '16x9' | Slide layout (16x9, 16x10, 4x3, wide) |
| `slideWidth` | number | 10 | Slide width in inches |
| `slideHeight` | number | 5.625 | Slide height in inches |
| `splitBy` | string | 'h2' | Element to split slides by |
| `title` | string | - | Presentation title |
| `author` | string | - | Presentation author |
| `company` | string | - | Company name |
| `theme` | object | - | Presentation theme colors |
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
  theme: {
    primary: '#1E88E5',
    background: '#FFFFFF'
  }
});
```

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
  options: {
    format: doc.name.endsWith('.pdf') ? OutputFormat.PDF : OutputFormat.PPTX,
    outputPath: `./output/${doc.name}`
  }
}));

const results = await flexdoc.batchConvert(inputs);
console.log(`Converted ${results.filter(r => r.success).length} documents`);
```

## 🏗️ Architecture

FlexDoc is built with a modular architecture:

```
flexdoc/
├── src/
│   ├── index.ts           # Main FlexDoc class
│   ├── types/             # TypeScript definitions
│   ├── converters/        # PDF and PPTX converters
│   │   ├── pdf-converter.ts
│   │   └── pptx-converter.ts
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

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Puppeteer](https://github.com/puppeteer/puppeteer) for PDF generation
- [PptxGenJS](https://github.com/gitbrent/PptxGenJS) for PPTX creation
- [jsdom](https://github.com/jsdom/jsdom) for HTML parsing
- [html-to-text](https://github.com/html-to-text/node-html-to-text) for text extraction

## 📞 Support

For issues, questions, or suggestions, please:
- Open an issue on [GitHub](https://github.com/yourusername/flexdoc/issues)
- Check the [examples](./examples) directory
- Read the [API documentation](#api-documentation)

## 🚀 Roadmap

- [ ] Add support for Excel/CSV export
- [ ] Implement Word document (.docx) generation
- [ ] Add watermark support for PDFs
- [ ] Support for charts and graphs in presentations
- [ ] Cloud storage integration (S3, Google Drive)
- [ ] CLI tool for command-line conversions
- [ ] Browser-based version

---

<p align="center">
  Made with ❤️ by Rakesh Singh
</p>
>>>>>>> 5dd093d (🎉 Initial release: FlexDoc - Professional HTML to PDF/PPTX converter)

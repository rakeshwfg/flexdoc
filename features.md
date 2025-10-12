---
layout: default
title: Features - FlexDoc
---

<div class="features-hero">
  <h1>Powerful Features for Document Generation</h1>
  <p>Everything you need to convert HTML to professional documents</p>
</div>

<div class="feature-section">
  <div class="feature-content">
    <div class="feature-text">
      <h2>📄 Multi-Format Support</h2>
      <p class="feature-lead">One library, three powerful output formats</p>
      <ul class="feature-list">
        <li><strong>PDF:</strong> High-quality PDFs with custom layouts, watermarks, headers/footers</li>
        <li><strong>PowerPoint (PPTX):</strong> Professional presentations with themes and auto-charts</li>
        <li><strong>Word (DOCX):</strong> Formatted documents with TOC, styling, and pagination</li>
      </ul>
      <a href="https://github.com/rakeshwfg/flexdoc#quick-start" class="btn btn-primary">View Examples</a>
    </div>
    <div class="feature-code">
      <pre><code>const { FlexDoc } = require('flexdoc');
const flexdoc = new FlexDoc();

// One API, three formats
await flexdoc.toPDF(html, {
  outputPath: './doc.pdf'
});

await flexdoc.toPPTX(html, {
  outputPath: './slides.pptx'
});

await flexdoc.toDOCX(html, {
  outputPath: './document.docx'
});</code></pre>
    </div>
  </div>
</div>

<div class="feature-section feature-section-alt">
  <div class="feature-content feature-content-reverse">
    <div class="feature-text">
      <h2>🎨 Professional Themes</h2>
      <p class="feature-lead">25+ beautifully designed themes for every occasion</p>
      <ul class="feature-list">
        <li><strong>Business:</strong> corporate-blue, professional-gray, executive-gold, financial-green</li>
        <li><strong>Tech:</strong> tech-purple, startup-orange, innovation-teal, digital-cyan</li>
        <li><strong>Creative:</strong> creative-pink, designer-vibrant, artistic-rainbow, modern-minimal</li>
        <li><strong>Custom:</strong> Build your own themes with the theme builder</li>
      </ul>
      <a href="/flexdoc/pricing" class="btn btn-primary">Unlock Pro Themes</a>
    </div>
    <div class="feature-visual">
      <div class="theme-showcase">
        <div class="theme-card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
          <span>Corporate Blue</span>
        </div>
        <div class="theme-card" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
          <span>Creative Pink</span>
        </div>
        <div class="theme-card" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
          <span>Tech Cyan</span>
        </div>
        <div class="theme-card" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
          <span>Financial Green</span>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="feature-section">
  <div class="feature-content">
    <div class="feature-text">
      <h2>⚡ Lightning Fast Performance</h2>
      <p class="feature-lead">ML-powered professional mode with incredible speed</p>
      <ul class="feature-list">
        <li><strong>Standard Mode:</strong> 11-slide presentation in ~131ms</li>
        <li><strong>Professional Mode:</strong> Same presentation in ~32ms (4x faster!)</li>
        <li><strong>No Browser Overhead:</strong> Professional mode skips Puppeteer entirely</li>
        <li><strong>Batch Processing:</strong> Convert hundreds of documents in parallel</li>
      </ul>
      <div class="performance-metrics">
        <div class="metric">
          <div class="metric-value">4x</div>
          <div class="metric-label">Faster</div>
        </div>
        <div class="metric">
          <div class="metric-value">32ms</div>
          <div class="metric-label">Per Slide</div>
        </div>
        <div class="metric">
          <div class="metric-value">100+</div>
          <div class="metric-label">Parallel Jobs</div>
        </div>
      </div>
    </div>
    <div class="feature-code">
      <pre><code>// Professional mode - ML-enhanced
await flexdoc.toPPTX(html, {
  professional: true,  // 4x faster!
  theme: 'corporate',
  splitBy: 'section'
});

// Batch processing
await flexdoc.convertBatch([
  { html: doc1, format: 'pdf' },
  { html: doc2, format: 'pptx' },
  { html: doc3, format: 'docx' }
]);</code></pre>
    </div>
  </div>
</div>

<div class="feature-section feature-section-alt">
  <div class="feature-content feature-content-reverse">
    <div class="feature-text">
      <h2>📊 Automatic Chart Generation</h2>
      <p class="feature-lead">HTML tables automatically convert to beautiful charts</p>
      <ul class="feature-list">
        <li><strong>Smart Detection:</strong> Automatically detects the best chart type</li>
        <li><strong>Multiple Types:</strong> Bar, line, pie, area, and scatter charts</li>
        <li><strong>Customizable:</strong> Control chart appearance and position</li>
        <li><strong>Keep Tables:</strong> Option to show both table and chart</li>
      </ul>
      <a href="https://github.com/rakeshwfg/flexdoc#automatic-chart-generation-from-tables" class="btn btn-primary">Learn More</a>
    </div>
    <div class="feature-visual">
      <div class="chart-example">
        <svg viewBox="0 0 200 150" style="width: 100%; max-width: 400px;">
          <rect x="20" y="110" width="30" height="30" fill="#667eea"/>
          <rect x="60" y="90" width="30" height="50" fill="#667eea"/>
          <rect x="100" y="60" width="30" height="80" fill="#667eea"/>
          <rect x="140" y="40" width="30" height="100" fill="#667eea"/>
          <text x="100" y="25" text-anchor="middle" fill="#333" font-size="12" font-weight="600">Sales Growth</text>
        </svg>
      </div>
    </div>
  </div>
</div>

<div class="feature-section">
  <div class="feature-content">
    <div class="feature-text">
      <h2>☁️ Cloud Storage Integration</h2>
      <p class="feature-lead">Direct upload to your favorite cloud storage (Pro)</p>
      <ul class="feature-list">
        <li><strong>AWS S3:</strong> Upload directly to S3 buckets</li>
        <li><strong>Azure Blob:</strong> Seamless Azure integration</li>
        <li><strong>Google Drive:</strong> Coming soon!</li>
        <li><strong>URL Support:</strong> Generate pre-signed URLs automatically</li>
      </ul>
    </div>
    <div class="feature-code">
      <pre><code>// Upload to S3 automatically
await flexdoc.toPDF(html, {
  outputPath: 's3://my-bucket/report.pdf',
  s3Config: {
    region: 'us-east-1',
    credentials: { /* ... */ }
  }
});

// Azure Blob Storage
await flexdoc.toPDF(html, {
  outputPath: 'azure://container/doc.pdf',
  azureConfig: { /* ... */ }
});</code></pre>
    </div>
  </div>
</div>

<div class="feature-section feature-section-alt">
  <div class="feature-content feature-content-reverse">
    <div class="feature-text">
      <h2>💧 Advanced Watermarking</h2>
      <p class="feature-lead">Protect your PDFs with custom watermarks</p>
      <ul class="feature-list">
        <li><strong>Text Watermarks:</strong> Custom text with rotation and styling</li>
        <li><strong>Image Watermarks:</strong> Add logos or stamps</li>
        <li><strong>Positions:</strong> Center, diagonal, corners, top/bottom</li>
        <li><strong>Repeating:</strong> Create watermark patterns across pages</li>
      </ul>
    </div>
    <div class="feature-code">
      <pre><code>await flexdoc.toPDF(html, {
  watermark: {
    text: 'CONFIDENTIAL',
    position: 'diagonal',
    opacity: 0.2,
    fontSize: 80,
    color: '#FF0000',
    rotation: -45
  }
});</code></pre>
    </div>
  </div>
</div>

<div class="feature-section">
  <div class="feature-content">
    <div class="feature-text">
      <h2>🖥️ Powerful CLI Tool</h2>
      <p class="feature-lead">Convert documents from the command line</p>
      <ul class="feature-list">
        <li><strong>Simple Commands:</strong> Convert files with a single command</li>
        <li><strong>Batch Processing:</strong> Process multiple files at once</li>
        <li><strong>All Options:</strong> Access every feature from the CLI</li>
        <li><strong>Scriptable:</strong> Integrate into your build pipeline</li>
      </ul>
    </div>
    <div class="feature-code">
      <pre><code># Convert HTML to PDF
flexdoc pdf input.html -o output.pdf

# Create presentation with theme
flexdoc pptx slides.html \
  --theme corporate-blue \
  --split h2

# Batch convert
flexdoc batch config.json

# With watermark
flexdoc pdf doc.html \
  --watermark-text "DRAFT" \
  --watermark-position diagonal</code></pre>
    </div>
  </div>
</div>

<div class="feature-section feature-section-alt">
  <div class="feature-content feature-content-reverse">
    <div class="feature-text">
      <h2>🔌 REST API Server</h2>
      <p class="feature-lead">Self-hosted API with Docker support (Pro)</p>
      <ul class="feature-list">
        <li><strong>RESTful API:</strong> HTTP endpoints for all conversions</li>
        <li><strong>Job Management:</strong> Async processing with status tracking</li>
        <li><strong>Swagger Docs:</strong> Interactive API documentation</li>
        <li><strong>Docker Ready:</strong> One command deployment</li>
      </ul>
    </div>
    <div class="feature-code">
      <pre><code># Start API server
docker run -p 3000:3000 flexdoc/api

# POST /api/convert
curl -X POST http://localhost:3000/api/convert \
  -H "Content-Type: application/json" \
  -d '{
    "html": "&lt;h1&gt;Hello&lt;/h1&gt;",
    "format": "pdf"
  }'

# View Swagger docs
open http://localhost:3000/api-docs</code></pre>
    </div>
  </div>
</div>

<div class="feature-section">
  <div class="feature-content">
    <div class="feature-text">
      <h2>🤖 ML-Powered Layout Optimization</h2>
      <p class="feature-lead">Intelligent content analysis and optimization (Pro)</p>
      <ul class="feature-list">
        <li><strong>Content Analysis:</strong> Detects 11+ content types automatically</li>
        <li><strong>Layout Detection:</strong> Recognizes 7 layout patterns</li>
        <li><strong>Smart Grouping:</strong> Groups related content intelligently</li>
        <li><strong>Visual Hierarchy:</strong> Optimizes spacing and positioning</li>
      </ul>
    </div>
    <div class="feature-visual">
      <div class="ai-visualization">
        <div class="ai-node">Text Analysis</div>
        <div class="ai-node">Layout Detection</div>
        <div class="ai-node">Content Grouping</div>
        <div class="ai-node">Optimization</div>
        <div class="ai-arrow">→</div>
        <div class="ai-result">Perfect Layout</div>
      </div>
    </div>
  </div>
</div>

<div class="feature-grid-section">
  <h2>More Powerful Features</h2>

  <div class="feature-grid">
    <div class="feature-card">
      <div class="feature-icon">📝</div>
      <h3>Table of Contents</h3>
      <p>Automatic TOC generation for Word documents with page numbers and links</p>
    </div>

    <div class="feature-card">
      <div class="feature-icon">🎯</div>
      <h3>Custom Headers/Footers</h3>
      <p>Add branded headers and footers with page numbers and dynamic content</p>
    </div>

    <div class="feature-card">
      <div class="feature-icon">📐</div>
      <h3>Flexible Layouts</h3>
      <p>Support for portrait/landscape, custom page sizes, and margins</p>
    </div>

    <div class="feature-card">
      <div class="feature-icon">🖼️</div>
      <h3>Image Processing</h3>
      <p>Automatic image optimization, resizing, and format conversion</p>
    </div>

    <div class="feature-card">
      <div class="feature-icon">📊</div>
      <h3>Table Rendering</h3>
      <p>Beautiful table rendering in all formats with styling preserved</p>
    </div>

    <div class="feature-card">
      <div class="feature-icon">🎨</div>
      <h3>Custom CSS</h3>
      <p>Inject custom CSS for complete styling control</p>
    </div>

    <div class="feature-card">
      <div class="feature-icon">⚙️</div>
      <h3>TypeScript Support</h3>
      <p>Full TypeScript definitions for type-safe development</p>
    </div>

    <div class="feature-card">
      <div class="feature-icon">🔄</div>
      <h3>Auto-Retry Logic</h3>
      <p>Built-in retry mechanism for reliable conversions</p>
    </div>

    <div class="feature-card">
      <div class="feature-icon">📦</div>
      <h3>Zero Config</h3>
      <p>Works out of the box with sensible defaults</p>
    </div>

    <div class="feature-card">
      <div class="feature-icon">🛡️</div>
      <h3>Error Handling</h3>
      <p>Comprehensive error handling with detailed messages</p>
    </div>

    <div class="feature-card">
      <div class="feature-icon">📈</div>
      <h3>Progress Tracking</h3>
      <p>Real-time progress callbacks for long operations</p>
    </div>

    <div class="feature-card">
      <div class="feature-icon">🌐</div>
      <h3>URL Support</h3>
      <p>Convert web pages directly from URLs</p>
    </div>
  </div>
</div>

<div class="comparison-cta">
  <h2>Ready to Experience FlexDoc?</h2>
  <p>Start with the free tier or unlock Pro features for your business</p>
  <div class="cta-buttons">
    <a href="https://github.com/rakeshwfg/flexdoc" class="btn btn-primary btn-large">Get Started Free</a>
    <a href="/flexdoc/pricing" class="btn btn-secondary btn-large">Compare Plans</a>
  </div>
</div>

<style>
.features-hero {
  text-align: center;
  padding: 80px 20px 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin: -20px -20px 0 -20px;
}

.features-hero h1 {
  font-size: 3em;
  margin-bottom: 20px;
}

.features-hero p {
  font-size: 1.3em;
  opacity: 0.95;
}

.feature-section {
  padding: 80px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-section-alt {
  background: #f8f9fa;
  margin: 0 -20px;
  padding: 80px 20px;
}

.feature-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.feature-content-reverse {
  direction: rtl;
}

.feature-content-reverse > * {
  direction: ltr;
}

.feature-text h2 {
  font-size: 2.5em;
  margin-bottom: 20px;
  color: #333;
}

.feature-lead {
  font-size: 1.2em;
  color: #666;
  margin-bottom: 25px;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin-bottom: 30px;
}

.feature-list li {
  padding: 12px 0;
  line-height: 1.6;
  color: #555;
}

.feature-list strong {
  color: #667eea;
}

.feature-code {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 30px;
  border-radius: 12px;
  overflow-x: auto;
}

.feature-code pre {
  margin: 0;
}

.feature-code code {
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 0.9em;
  line-height: 1.6;
}

.feature-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.theme-showcase {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  width: 100%;
}

.theme-card {
  aspect-ratio: 16/9;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.1em;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
}

.theme-card:hover {
  transform: scale(1.05);
}

.performance-metrics {
  display: flex;
  gap: 40px;
  margin-top: 30px;
}

.metric {
  text-align: center;
}

.metric-value {
  font-size: 3em;
  font-weight: 700;
  color: #667eea;
  line-height: 1;
}

.metric-label {
  font-size: 0.9em;
  color: #666;
  margin-top: 5px;
}

.chart-example {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
}

.ai-visualization {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
  align-items: center;
}

.ai-node {
  background: #667eea;
  color: white;
  padding: 15px 25px;
  border-radius: 8px;
  font-weight: 600;
}

.ai-arrow {
  font-size: 2em;
  color: #667eea;
}

.ai-result {
  background: #28a745;
  color: white;
  padding: 15px 25px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1.2em;
}

.feature-grid-section {
  padding: 80px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-grid-section h2 {
  text-align: center;
  font-size: 2.5em;
  margin-bottom: 50px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
}

.feature-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  text-align: center;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.15);
}

.feature-icon {
  font-size: 3em;
  margin-bottom: 15px;
}

.feature-card h3 {
  color: #667eea;
  margin-bottom: 15px;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

.comparison-cta {
  text-align: center;
  padding: 80px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin: 0 -20px -20px -20px;
}

.comparison-cta h2 {
  font-size: 2.5em;
  margin-bottom: 20px;
}

.comparison-cta p {
  font-size: 1.2em;
  margin-bottom: 40px;
  opacity: 0.95;
}

.cta-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  display: inline-block;
  padding: 15px 40px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.btn-primary {
  background: white;
  color: #667eea;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}

.btn-secondary {
  background: rgba(255,255,255,0.2);
  color: white;
  border: 2px solid white;
}

.btn-secondary:hover {
  background: rgba(255,255,255,0.3);
}

.btn-large {
  padding: 18px 40px;
  font-size: 1.1em;
}

@media (max-width: 768px) {
  .features-hero h1 {
    font-size: 2em;
  }

  .feature-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .feature-text h2 {
    font-size: 2em;
  }

  .theme-showcase {
    grid-template-columns: 1fr;
  }

  .performance-metrics {
    gap: 20px;
  }

  .metric-value {
    font-size: 2em;
  }
}
</style>

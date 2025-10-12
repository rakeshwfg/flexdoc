---
layout: default
title: FlexDoc - Professional HTML to PDF, PPTX, and DOCX Conversion
---

<div class="hero">
  <div class="hero-content">
    <h1 class="hero-title">Convert HTML to Beautiful Documents</h1>
    <p class="hero-subtitle">
      Professional-grade, open-source library for converting HTML to PDF, PowerPoint, and Word documents.
      The free alternative to Adobe's expensive APIs.
    </p>
    <div class="hero-buttons">
      <a href="https://github.com/rakeshwfg/flexdoc" class="btn btn-primary">Get Started Free</a>
      <a href="/flexdoc/pricing" class="btn btn-secondary">View Pricing</a>
      <a href="https://github.com/sponsors/rakeshwfg" class="btn btn-sponsor">💝 Sponsor</a>
    </div>
    <div class="hero-stats">
      <div class="stat">
        <span class="stat-number">3</span>
        <span class="stat-label">Output Formats</span>
      </div>
      <div class="stat">
        <span class="stat-number">25+</span>
        <span class="stat-label">Premium Themes</span>
      </div>
      <div class="stat">
        <span class="stat-number">100%</span>
        <span class="stat-label">Open Source</span>
      </div>
      <div class="stat">
        <span class="stat-number">0</span>
        <span class="stat-label">Paid Dependencies</span>
      </div>
    </div>
  </div>
</div>

<div class="section">
  <h2 class="section-title">Why Choose FlexDoc?</h2>
  <div class="features-grid">
    <div class="feature-card">
      <div class="feature-icon">📄</div>
      <h3>Multi-Format Support</h3>
      <p>Convert HTML to PDF, PowerPoint (PPTX), and Word (DOCX) with a single unified API.</p>
    </div>

    <div class="feature-card">
      <div class="feature-icon">🎨</div>
      <h3>Professional Themes</h3>
      <p>25+ beautifully designed themes for presentations and documents. Custom theme builder included.</p>
    </div>

    <div class="feature-card">
      <div class="feature-icon">⚡</div>
      <h3>Lightning Fast</h3>
      <p>ML-powered professional mode creates 11-slide presentations in under 150ms.</p>
    </div>

    <div class="feature-card">
      <div class="feature-icon">🔧</div>
      <h3>CLI & API</h3>
      <p>Use from command line or integrate into your Node.js application. REST API server included.</p>
    </div>

    <div class="feature-card">
      <div class="feature-icon">☁️</div>
      <h3>Cloud Integration</h3>
      <p>Direct upload to AWS S3, Azure Blob Storage, and Google Drive (Pro tier).</p>
    </div>

    <div class="feature-card">
      <div class="feature-icon">🤖</div>
      <h3>AI-Powered Layouts</h3>
      <p>Machine learning algorithms optimize document layouts for professional results.</p>
    </div>
  </div>
</div>

<div class="section section-dark">
  <h2 class="section-title">Quick Start</h2>
  <div class="code-example">
    <pre><code class="language-bash"># Install FlexDoc
npm install flexdoc</code></pre>

    <pre><code class="language-javascript">// Convert HTML to PDF
const { FlexDoc } = require('flexdoc');
const flexdoc = new FlexDoc();

await flexdoc.toPDF('&lt;h1&gt;Hello World&lt;/h1&gt;', {
  outputPath: './output.pdf',
  format: 'A4'
});

// Create PowerPoint presentation
await flexdoc.toPPTX(htmlContent, {
  outputPath: './presentation.pptx',
  theme: 'corporate-blue',
  splitBy: 'section'
});

// Generate Word document
await flexdoc.toDOCX(htmlContent, {
  outputPath: './document.docx',
  theme: 'professional',
  tableOfContents: true
});</code></pre>
  </div>
</div>

<div class="section">
  <h2 class="section-title">Trusted by Developers Worldwide</h2>
  <div class="use-cases">
    <div class="use-case">
      <h3>📊 Report Generation</h3>
      <p>Generate beautiful PDF reports from HTML templates with charts, tables, and custom branding.</p>
    </div>

    <div class="use-case">
      <h3>📑 Documentation</h3>
      <p>Convert documentation websites to professional Word documents with automatic table of contents.</p>
    </div>

    <div class="use-case">
      <h3>📈 Business Presentations</h3>
      <p>Transform data dashboards into PowerPoint presentations with automatic chart generation.</p>
    </div>

    <div class="use-case">
      <h3>📧 Invoice Generation</h3>
      <p>Create professional PDF invoices with watermarks and custom styling.</p>
    </div>
  </div>
</div>

<div class="section section-cta">
  <h2 class="section-title">Ready to Get Started?</h2>
  <p class="section-subtitle">Join thousands of developers using FlexDoc for document generation</p>
  <div class="cta-buttons">
    <a href="https://github.com/rakeshwfg/flexdoc" class="btn btn-primary btn-large">Get Started Free</a>
    <a href="/flexdoc/pricing" class="btn btn-secondary btn-large">Compare Plans</a>
  </div>
  <p class="section-note">
    Open source MIT license • No credit card required • Free tier forever
  </p>
</div>

<div class="section">
  <h2 class="section-title">Support Open Source</h2>
  <p class="section-subtitle">
    FlexDoc is free and open source. If it helps your business, consider supporting development:
  </p>
  <div class="support-options">
    <a href="https://github.com/sponsors/rakeshwfg" class="support-card">
      <span class="support-icon">💝</span>
      <span class="support-title">GitHub Sponsors</span>
      <span class="support-desc">Monthly or one-time</span>
    </a>

    <a href="https://ko-fi.com/rakeshsingh16" class="support-card">
      <span class="support-icon">☕</span>
      <span class="support-title">Buy Me a Coffee</span>
      <span class="support-desc">One-time donation</span>
    </a>

    <a href="https://paypal.me/rakesh8116" class="support-card">
      <span class="support-icon">💳</span>
      <span class="support-title">PayPal</span>
      <span class="support-desc">Direct payment</span>
    </a>

    <a href="/flexdoc/pricing" class="support-card">
      <span class="support-icon">⭐</span>
      <span class="support-title">Pro Subscription</span>
      <span class="support-desc">Premium features</span>
    </a>
  </div>
</div>

<style>
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 80px 20px;
  text-align: center;
  margin: -20px -20px 40px -20px;
}

.hero-title {
  font-size: 3em;
  margin-bottom: 20px;
  font-weight: 700;
}

.hero-subtitle {
  font-size: 1.3em;
  margin-bottom: 40px;
  opacity: 0.95;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.hero-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 60px;
}

.btn {
  padding: 15px 30px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  display: inline-block;
  transition: all 0.3s ease;
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

.btn-sponsor {
  background: #ea4aaa;
  color: white;
}

.btn-sponsor:hover {
  background: #d63384;
  transform: translateY(-2px);
}

.btn-large {
  padding: 18px 40px;
  font-size: 1.1em;
}

.hero-stats {
  display: flex;
  gap: 40px;
  justify-content: center;
  flex-wrap: wrap;
}

.stat {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 2.5em;
  font-weight: 700;
}

.stat-label {
  font-size: 0.9em;
  opacity: 0.9;
}

.section {
  padding: 60px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-dark {
  background: #f8f9fa;
  margin: 40px -20px;
  padding: 60px 20px;
}

.section-cta {
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin: 40px -20px;
}

.section-title {
  font-size: 2.5em;
  text-align: center;
  margin-bottom: 50px;
}

.section-subtitle {
  text-align: center;
  font-size: 1.2em;
  margin-bottom: 40px;
  opacity: 0.95;
}

.section-note {
  text-align: center;
  margin-top: 20px;
  opacity: 0.9;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.feature-card {
  padding: 30px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
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
  margin-bottom: 15px;
  color: #667eea;
}

.code-example {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 30px;
  border-radius: 12px;
  overflow-x: auto;
}

.code-example pre {
  margin: 0 0 20px 0;
}

.code-example code {
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 0.9em;
}

.use-cases {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.use-case {
  padding: 25px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.use-case h3 {
  margin-bottom: 10px;
  color: #667eea;
}

.cta-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  margin: 30px 0;
}

.support-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 40px;
}

.support-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}

.support-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.15);
}

.support-icon {
  font-size: 3em;
  margin-bottom: 15px;
}

.support-title {
  font-weight: 600;
  font-size: 1.1em;
  margin-bottom: 5px;
}

.support-desc {
  font-size: 0.9em;
  color: #666;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2em;
  }

  .hero-subtitle {
    font-size: 1.1em;
  }

  .section-title {
    font-size: 2em;
  }

  .hero-stats {
    gap: 20px;
  }
}
</style>

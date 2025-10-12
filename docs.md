---
layout: default
title: Documentation - FlexDoc
---

<div class="docs-hero">
  <h1>Documentation</h1>
  <p>Complete guides and API reference for FlexDoc</p>
</div>

<div class="docs-container">
  <div class="docs-nav">
    <h3>Quick Links</h3>
    <ul>
      <li><a href="#installation">Installation</a></li>
      <li><a href="#quick-start">Quick Start</a></li>
      <li><a href="#api-reference">API Reference</a></li>
      <li><a href="#examples">Examples</a></li>
      <li><a href="#cli">CLI Usage</a></li>
    </ul>
  </div>

  <div class="docs-content">
    <section id="installation">
      <h2>Installation</h2>
      <pre><code>npm install flexdoc</code></pre>
      <p>Or with yarn:</p>
      <pre><code>yarn add flexdoc</code></pre>
    </section>

    <section id="quick-start">
      <h2>Quick Start</h2>
      <p>For detailed documentation, examples, and API reference, please visit our <a href="https://github.com/rakeshwfg/flexdoc#readme">GitHub README</a>.</p>

      <h3>Basic Example</h3>
      <pre><code>const { FlexDoc } = require('flexdoc');
const flexdoc = new FlexDoc();

// Convert to PDF
await flexdoc.toPDF('&lt;h1&gt;Hello World&lt;/h1&gt;', {
  outputPath: './output.pdf'
});

// Convert to PPTX
await flexdoc.toPPTX('&lt;h1&gt;Slide 1&lt;/h1&gt;', {
  outputPath: './presentation.pptx'
});

// Convert to DOCX
await flexdoc.toDOCX('&lt;h1&gt;Document&lt;/h1&gt;', {
  outputPath: './document.docx'
});</code></pre>
    </section>

    <section id="api-reference">
      <h2>API Reference</h2>
      <p>Complete API documentation is available on <a href="https://github.com/rakeshwfg/flexdoc#api-documentation">GitHub</a>.</p>

      <div class="api-links">
        <a href="https://github.com/rakeshwfg/flexdoc#topdfhtml-options" class="api-card">
          <h3>toPDF()</h3>
          <p>Convert HTML to PDF with custom options</p>
        </a>

        <a href="https://github.com/rakeshwfg/flexdoc#topptxhtml-options" class="api-card">
          <h3>toPPTX()</h3>
          <p>Generate PowerPoint presentations</p>
        </a>

        <a href="https://github.com/rakeshwfg/flexdoc#todocxhtml-options" class="api-card">
          <h3>toDOCX()</h3>
          <p>Create Word documents</p>
        </a>

        <a href="https://github.com/rakeshwfg/flexdoc#converthtml-options" class="api-card">
          <h3>convert()</h3>
          <p>Unified conversion API</p>
        </a>
      </div>
    </section>

    <section id="examples">
      <h2>Examples</h2>
      <p>Comprehensive examples are available in the <a href="https://github.com/rakeshwfg/flexdoc/tree/main/examples">examples directory</a> on GitHub.</p>
    </section>

    <section id="cli">
      <h2>CLI Usage</h2>
      <p>Complete CLI documentation is available on <a href="https://github.com/rakeshwfg/flexdoc#cli-usage">GitHub</a>.</p>

      <h3>Quick Example</h3>
      <pre><code># Convert to PDF
flexdoc pdf input.html -o output.pdf

# Convert to PPTX
flexdoc pptx slides.html --theme corporate

# Convert to DOCX
flexdoc docx document.html --toc</code></pre>
    </section>
  </div>
</div>

<style>
.docs-hero {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin: -20px -20px 0 -20px;
}

.docs-hero h1 {
  font-size: 3em;
  margin-bottom: 15px;
}

.docs-container {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 40px;
}

.docs-nav {
  position: sticky;
  top: 100px;
  align-self: start;
}

.docs-nav h3 {
  margin-bottom: 20px;
  color: #667eea;
}

.docs-nav ul {
  list-style: none;
  padding: 0;
}

.docs-nav li {
  margin-bottom: 10px;
}

.docs-nav a {
  color: #666;
  display: block;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.docs-nav a:hover {
  background: #f8f9fa;
  color: #667eea;
}

.docs-content section {
  margin-bottom: 60px;
}

.docs-content h2 {
  font-size: 2.5em;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 3px solid #667eea;
}

.docs-content h3 {
  font-size: 1.8em;
  margin: 30px 0 15px;
  color: #667eea;
}

.api-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.api-card {
  padding: 25px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  transition: all 0.3s ease;
  display: block;
  text-decoration: none;
  color: inherit;
}

.api-card:hover {
  border-color: #667eea;
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.api-card h3 {
  margin: 0 0 10px 0;
  color: #667eea;
  font-size: 1.3em;
}

.api-card p {
  margin: 0;
  color: #666;
}

@media (max-width: 768px) {
  .docs-container {
    grid-template-columns: 1fr;
  }

  .docs-nav {
    position: static;
  }

  .docs-hero h1 {
    font-size: 2em;
  }

  .docs-content h2 {
    font-size: 2em;
  }
}
</style>

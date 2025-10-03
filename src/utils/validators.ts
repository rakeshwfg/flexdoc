/**
 * Validation Utilities
 * HTML validation and normalization functions
 */

/**
 * Validate HTML string
 */
export function validateHTML(html: string): boolean {
  if (!html || typeof html !== 'string') {
    return false;
  }

  // Check for basic HTML structure
  const hasHTMLTags = /<[^>]+>/.test(html);
  return hasHTMLTags || html.trim().length > 0;
}

/**
 * Normalize HTML content
 */
export function normalizeHTML(html: string): string {
  // If it's plain text, wrap in basic HTML
  if (!html.includes('<') && !html.includes('>')) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Document</title>
        </head>
        <body>
          <p>${html}</p>
        </body>
      </html>
    `;
  }

  // If it doesn't have html/body tags, wrap it
  if (!html.toLowerCase().includes('<html') && !html.toLowerCase().includes('<body')) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Document</title>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;
  }

  // Add DOCTYPE if missing
  if (!html.toLowerCase().includes('<!doctype')) {
    return `<!DOCTYPE html>${html}`;
  }

  return html;
}

/**
 * Check if string is valid URL
 */
export function isValidURL(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

/**
 * Extract images from HTML
 */
export function extractImages(html: string): Array<{ src: string; alt?: string }> {
  const images: Array<{ src: string; alt?: string }> = [];
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*(?:alt=["']([^"']+)["'])?[^>]*>/gi;
  
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    images.push({
      src: match[1],
      alt: match[2] || undefined
    });
  }

  return images;
}

/**
 * Extract text from HTML
 */
export function extractText(html: string): string {
  // Remove script and style elements
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  
  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, ' ');
  
  // Replace multiple spaces with single space
  text = text.replace(/\s+/g, ' ');
  
  // Decode HTML entities
  text = decodeHTMLEntities(text);
  
  return text.trim();
}

/**
 * Decode HTML entities
 */
export function decodeHTMLEntities(text: string): string {
  const entities: { [key: string]: string } = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&nbsp;': ' ',
    '&copy;': '©',
    '&reg;': '®',
    '&trade;': '™'
  };

  return text.replace(/&[^;]+;/g, (entity) => entities[entity] || entity);
}

/**
 * Sanitize filename
 */
export function sanitizeFilename(filename: string): string {
  // Remove invalid characters
  return filename.replace(/[<>:"/\\|?*]/g, '_');
}

/**
 * Get file extension
 */
export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  return lastDot === -1 ? '' : filename.substring(lastDot + 1).toLowerCase();
}

/**
 * Validate file path
 */
export function validateFilePath(path: string): boolean {
  // Check for basic path validity
  if (!path || typeof path !== 'string') {
    return false;
  }

  // Check for invalid characters
  const invalidChars = /[<>"|?*]/;
  if (invalidChars.test(path)) {
    return false;
  }

  return true;
}

/**
 * Parse CSS string to object
 */
export function parseCSSString(css: string): Record<string, string> {
  const styles: Record<string, string> = {};
  
  if (!css) return styles;
  
  const declarations = css.split(';');
  
  declarations.forEach(declaration => {
    const [property, value] = declaration.split(':');
    if (property && value) {
      styles[property.trim()] = value.trim();
    }
  });
  
  return styles;
}

/**
 * Convert CSS object to string
 */
export function cssObjectToString(styles: Record<string, string>): string {
  return Object.entries(styles)
    .map(([property, value]) => `${property}: ${value}`)
    .join('; ');
}

/**
 * Estimate reading time
 */
export function estimateReadingTime(text: string, wordsPerMinute: number = 200): number {
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Truncate text
 */
export function truncateText(text: string, maxLength: number, ellipsis: string = '...'): string {
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength - ellipsis.length) + ellipsis;
}

/**
 * Check if HTML contains specific element
 */
export function hasElement(html: string, selector: string): boolean {
  const regex = new RegExp(`<${selector}[^>]*>`, 'i');
  return regex.test(html);
}

/**
 * Count occurrences of element
 */
export function countElements(html: string, tagName: string): number {
  const regex = new RegExp(`<${tagName}[^>]*>`, 'gi');
  const matches = html.match(regex);
  return matches ? matches.length : 0;
}

/**
 * Extract meta information from HTML
 */
export function extractMetaInfo(html: string): Record<string, string> {
  const meta: Record<string, string> = {};
  
  // Extract title
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  if (titleMatch) {
    meta.title = titleMatch[1];
  }
  
  // Extract meta tags
  const metaRegex = /<meta\s+(?:name|property)=["']([^"']+)["']\s+content=["']([^"']+)["'][^>]*>/gi;
  let match;
  
  while ((match = metaRegex.exec(html)) !== null) {
    meta[match[1]] = match[2];
  }
  
  return meta;
}

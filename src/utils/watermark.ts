/**
 * Watermark utility for PDF generation
 */

import { PDFOptions } from '../types';
import * as fs from 'fs';
import * as path from 'path';

export interface WatermarkConfig {
  text?: string;
  image?: string;
  position?: 'center' | 'diagonal' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
  opacity?: number;
  fontSize?: number;
  color?: string;
  rotation?: number;
  repeat?: boolean;
  fontFamily?: string;
  fontWeight?: string | number;
  imageWidth?: number;
  imageHeight?: number;
}

/**
 * Generate CSS for watermark
 */
export function generateWatermarkCSS(watermark: WatermarkConfig): string {
  const {
    text,
    image,
    position = 'center',
    opacity = 0.3,
    fontSize = 72,
    color = '#000000',
    rotation = 0,
    repeat = false,
    fontFamily = 'Arial, sans-serif',
    fontWeight = 'bold',
    imageWidth,
    imageHeight
  } = watermark;

  if (!text && !image) {
    return '';
  }

  const watermarkId = 'flexdoc-watermark';

  // Position styles
  const positionStyles = getPositionStyles(position, repeat);

  // Base styles
  let styles = `
    #${watermarkId} {
      position: fixed;
      z-index: 9999;
      pointer-events: none;
      user-select: none;
      opacity: ${opacity};
      ${positionStyles}
    }
  `;

  // Text watermark styles
  if (text) {
    styles += `
      #${watermarkId} {
        font-size: ${fontSize}px;
        color: ${color};
        font-family: ${fontFamily};
        font-weight: ${fontWeight};
        transform: rotate(${rotation}deg);
        white-space: nowrap;
        letter-spacing: 0.1em;
      }
    `;
  }

  // Image watermark styles
  if (image) {
    styles += `
      #${watermarkId} img {
        display: block;
        ${imageWidth ? `width: ${imageWidth}px;` : ''}
        ${imageHeight ? `height: ${imageHeight}px;` : ''}
        transform: rotate(${rotation}deg);
      }
    `;
  }

  // Repeat pattern styles
  if (repeat) {
    styles += `
      body {
        position: relative;
      }

      body::before {
        content: "${text || ''}";
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9998;
        pointer-events: none;
        background-image: ${getRepeatPattern(text, image, fontSize, color, fontFamily, fontWeight)};
        background-repeat: repeat;
        background-size: 400px 400px;
        opacity: ${opacity};
      }
    `;
  }

  return `<style>${styles}</style>`;
}

/**
 * Generate HTML for watermark
 */
export async function generateWatermarkHTML(watermark: WatermarkConfig): Promise<string> {
  const { text, image } = watermark;

  if (!text && !image) {
    return '';
  }

  const watermarkId = 'flexdoc-watermark';

  // Text watermark
  if (text) {
    return `<div id="${watermarkId}">${escapeHtml(text)}</div>`;
  }

  // Image watermark
  if (image) {
    // Convert image to base64 if it's a file path
    let imageSrc = image;

    if (fs.existsSync(image)) {
      const imageBuffer = fs.readFileSync(image);
      const ext = path.extname(image).toLowerCase();
      const mimeType = getMimeType(ext);
      const base64 = imageBuffer.toString('base64');
      imageSrc = `data:${mimeType};base64,${base64}`;
    }

    return `<div id="${watermarkId}"><img src="${imageSrc}" alt="Watermark" /></div>`;
  }

  return '';
}

/**
 * Get position styles based on position type
 */
function getPositionStyles(position: string, repeat: boolean): string {
  if (repeat) {
    return '';
  }

  switch (position) {
    case 'center':
      return `
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      `;

    case 'diagonal':
      return `
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
      `;

    case 'top-left':
      return `
        top: 50px;
        left: 50px;
      `;

    case 'top-right':
      return `
        top: 50px;
        right: 50px;
      `;

    case 'top-center':
      return `
        top: 50px;
        left: 50%;
        transform: translateX(-50%);
      `;

    case 'bottom-left':
      return `
        bottom: 50px;
        left: 50px;
      `;

    case 'bottom-right':
      return `
        bottom: 50px;
        right: 50px;
      `;

    case 'bottom-center':
      return `
        bottom: 50px;
        left: 50%;
        transform: translateX(-50%);
      `;

    default:
      return `
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      `;
  }
}

/**
 * Generate repeat pattern for background
 */
function getRepeatPattern(
  text: string | undefined,
  image: string | undefined,
  fontSize: number,
  color: string,
  fontFamily: string,
  fontWeight: string | number
): string {
  if (text) {
    // Create SVG pattern for text
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
        <text
          x="200"
          y="200"
          text-anchor="middle"
          dominant-baseline="middle"
          font-family="${fontFamily}"
          font-size="${fontSize}"
          font-weight="${fontWeight}"
          fill="${color}"
          opacity="0.3"
          transform="rotate(-45 200 200)"
        >${escapeHtml(text)}</text>
      </svg>
    `.trim();

    const base64 = Buffer.from(svg).toString('base64');
    return `url('data:image/svg+xml;base64,${base64}')`;
  }

  return 'none';
}

/**
 * Get MIME type from file extension
 */
function getMimeType(ext: string): string {
  const mimeTypes: { [key: string]: string } = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp'
  };

  return mimeTypes[ext] || 'image/png';
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Inject watermark into HTML content
 */
export async function injectWatermark(html: string, watermark: WatermarkConfig): Promise<string> {
  const watermarkCSS = generateWatermarkCSS(watermark);
  const watermarkHTML = await generateWatermarkHTML(watermark);

  // Insert watermark CSS in head
  let modifiedHtml = html;

  if (html.includes('</head>')) {
    modifiedHtml = html.replace('</head>', `${watermarkCSS}</head>`);
  } else if (html.includes('<body>')) {
    modifiedHtml = html.replace('<body>', `<head>${watermarkCSS}</head><body>`);
  } else {
    modifiedHtml = `<head>${watermarkCSS}</head><body>${html}</body>`;
  }

  // Insert watermark HTML in body (unless repeat mode)
  if (!watermark.repeat && watermarkHTML) {
    if (modifiedHtml.includes('</body>')) {
      modifiedHtml = modifiedHtml.replace('</body>', `${watermarkHTML}</body>`);
    } else {
      modifiedHtml += watermarkHTML;
    }
  }

  return modifiedHtml;
}

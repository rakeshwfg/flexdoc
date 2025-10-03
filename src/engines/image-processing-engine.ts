/**
 * Image Processing Engine
 * Advanced image optimization and processing for presentations
 */

import sharp from 'sharp';
import { FlexDocError, ErrorType } from '../types';

export interface ImageProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
  background?: string;
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  position?: string;
  removeBackground?: boolean;
  enhance?: boolean;
  watermark?: {
    text?: string;
    image?: Buffer;
    position?: string;
    opacity?: number;
  };
}

export interface ProcessedImage {
  buffer: Buffer;
  format: string;
  width: number;
  height: number;
  aspectRatio: number;
  size: number;
  metadata: {
    dominantColor?: string;
    hasTransparency?: boolean;
    quality?: string;
  };
}

export class ImageProcessingEngine {
  /**
   * Process and optimize image for presentation
   */
  static async processImage(
    input: string | Buffer,
    options: ImageProcessingOptions = {}
  ): Promise<ProcessedImage> {
    try {
      let image = sharp(input);
      const metadata = await image.metadata();
      
      // Apply smart resizing
      image = await this.smartResize(image, metadata, options);
      
      // Apply enhancements if requested
      if (options.enhance) {
        image = await this.enhanceImage(image);
      }
      
      // Remove background if requested (simplified version)
      if (options.removeBackground) {
        image = await this.removeBackground(image);
      }
      
      // Apply watermark if provided
      if (options.watermark) {
        image = await this.applyWatermark(image, options.watermark);
      }
      
      // Convert to optimal format
      const format = options.format || this.detectOptimalFormat(metadata);
      image = this.convertFormat(image, format, options.quality);
      
      // Get final buffer and metadata
      const buffer = await image.toBuffer();
      const finalMetadata = await sharp(buffer).metadata();
      
      // Analyze image for additional metadata
      const analysis = await this.analyzeImage(buffer);
      
      return {
        buffer,
        format: finalMetadata.format || format,
        width: finalMetadata.width || 0,
        height: finalMetadata.height || 0,
        aspectRatio: (finalMetadata.width || 1) / (finalMetadata.height || 1),
        size: buffer.length,
        metadata: {
          dominantColor: analysis.dominantColor,
          hasTransparency: finalMetadata.hasAlpha,
          quality: this.assessQuality(finalMetadata)
        }
      };
    } catch (error) {
      throw new FlexDocError(
        ErrorType.CONVERSION_FAILED,
        `Image processing failed: ${error}`,
        error
      );
    }
  }

  /**
   * Smart resize with aspect ratio preservation
   */
  private static async smartResize(
    image: sharp.Sharp,
    metadata: sharp.Metadata,
    options: ImageProcessingOptions
  ): Promise<sharp.Sharp> {
    const maxWidth = options.maxWidth || 1920;
    const maxHeight = options.maxHeight || 1080;
    
    // Calculate optimal dimensions
    const { width, height } = metadata;
    if (!width || !height) return image;
    
    const aspectRatio = width / height;
    let newWidth = width;
    let newHeight = height;
    
    if (width > maxWidth) {
      newWidth = maxWidth;
      newHeight = Math.round(maxWidth / aspectRatio);
    }
    
    if (newHeight > maxHeight) {
      newHeight = maxHeight;
      newWidth = Math.round(maxHeight * aspectRatio);
    }
    
    // Only resize if necessary
    if (newWidth < width || newHeight < height) {
      return image.resize(newWidth, newHeight, {
        fit: options.fit || 'inside',
        position: options.position || 'center',
        kernel: sharp.kernel.lanczos3,
        withoutEnlargement: true
      });
    }
    
    return image;
  }

  /**
   * Enhance image quality
   */
  private static async enhanceImage(image: sharp.Sharp): Promise<sharp.Sharp> {
    return image
      .normalize() // Enhance contrast
      .sharpen({ sigma: 0.5 }) // Subtle sharpening
      .modulate({
        brightness: 1.05, // Slight brightness boost
        saturation: 1.1   // Slight saturation boost
      });
  }

  /**
   * Remove background (simplified implementation)
   */
  private static async removeBackground(image: sharp.Sharp): Promise<sharp.Sharp> {
    // This is a simplified version
    // In production, you'd use a service like remove.bg API or ML model
    
    const { data, info } = await image
      .raw()
      .toBuffer({ resolveWithObject: true });
    
    // Apply basic transparency based on white/light backgrounds
    // This is very basic - real implementation would need ML
    const threshold = 240;
    const pixels = new Uint8ClampedArray(data);
    
    for (let i = 0; i < pixels.length; i += info.channels) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      
      // If pixel is close to white, make transparent
      if (r > threshold && g > threshold && b > threshold) {
        if (info.channels === 4) {
          pixels[i + 3] = 0; // Set alpha to 0
        }
      }
    }
    
    return sharp(Buffer.from(pixels), {
      raw: {
        width: info.width,
        height: info.height,
        channels: info.channels
      }
    }).png(); // Convert to PNG to preserve transparency
  }

  /**
   * Apply watermark to image
   */
  private static async applyWatermark(
    image: sharp.Sharp,
    watermark: any
  ): Promise<sharp.Sharp> {
    const metadata = await image.metadata();
    
    if (watermark.text) {
      // Text watermark
      const svg = `
        <svg width="${metadata.width}" height="${metadata.height}">
          <text x="50%" y="95%" text-anchor="middle" 
                font-family="Arial" font-size="${Math.min(metadata.width || 100, 40)}"
                fill="white" fill-opacity="${watermark.opacity || 0.5}">
            ${watermark.text}
          </text>
        </svg>
      `;
      
      return image.composite([{
        input: Buffer.from(svg),
        gravity: watermark.position || 'southeast'
      }]);
    } else if (watermark.image) {
      // Image watermark
      const watermarkImage = await sharp(watermark.image)
        .resize(Math.round((metadata.width || 100) * 0.2))
        .toBuffer();
      
      return image.composite([{
        input: watermarkImage,
        gravity: watermark.position || 'southeast',
        blend: 'over'
      }]);
    }
    
    return image;
  }

  /**
   * Detect optimal format based on image characteristics
   */
  private static detectOptimalFormat(metadata: sharp.Metadata): string {
    // Use PNG for images with transparency
    if (metadata.hasAlpha) {
      return 'png';
    }
    
    // Use JPEG for photos
    if (metadata.density && metadata.density > 72) {
      return 'jpeg';
    }
    
    // Default to JPEG for smaller file size
    return 'jpeg';
  }

  /**
   * Convert image format
   */
  private static convertFormat(
    image: sharp.Sharp,
    format: string,
    quality?: number
  ): sharp.Sharp {
    switch (format) {
      case 'jpeg':
        return image.jpeg({
          quality: quality || 85,
          progressive: true,
          mozjpeg: true
        });
      case 'png':
        return image.png({
          quality: quality || 90,
          compressionLevel: 9,
          progressive: true
        });
      case 'webp':
        return image.webp({
          quality: quality || 85,
          lossless: false
        });
      default:
        return image;
    }
  }

  /**
   * Analyze image for metadata
   */
  private static async analyzeImage(buffer: Buffer): Promise<any> {
    const image = sharp(buffer);
    const stats = await image.stats();
    
    // Calculate dominant color from channel statistics
    const dominantColor = `rgb(
      ${Math.round(stats.channels[0].mean)},
      ${Math.round(stats.channels[1].mean)},
      ${Math.round(stats.channels[2].mean)}
    )`;
    
    return {
      dominantColor,
      entropy: stats.entropy,
      sharpness: stats.sharpness
    };
  }

  /**
   * Assess image quality
   */
  private static assessQuality(metadata: sharp.Metadata): string {
    const { width = 0, height = 0, density = 72 } = metadata;
    const pixels = width * height;
    
    if (pixels > 2000000 && density >= 150) return 'high';
    if (pixels > 1000000 && density >= 72) return 'medium';
    return 'low';
  }
}

/**
 * Image Layout Engine
 * Handles image placement and collage creation
 */
export class ImageLayoutEngine {
  /**
   * Create image collage for presentation
   */
  static async createCollage(
    images: Buffer[],
    options: {
      layout?: 'grid' | 'masonry' | 'hero' | 'mosaic';
      width?: number;
      height?: number;
      gap?: number;
      background?: string;
    } = {}
  ): Promise<Buffer> {
    const layout = options.layout || 'grid';
    const width = options.width || 1920;
    const height = options.height || 1080;
    const gap = options.gap || 10;
    const background = options.background || '#ffffff';
    
    switch (layout) {
      case 'grid':
        return this.createGridCollage(images, width, height, gap, background);
      case 'masonry':
        return this.createMasonryCollage(images, width, height, gap, background);
      case 'hero':
        return this.createHeroCollage(images, width, height, gap, background);
      case 'mosaic':
        return this.createMosaicCollage(images, width, height, gap, background);
      default:
        return this.createGridCollage(images, width, height, gap, background);
    }
  }

  /**
   * Create grid layout collage
   */
  private static async createGridCollage(
    images: Buffer[],
    width: number,
    height: number,
    gap: number,
    background: string
  ): Promise<Buffer> {
    const count = images.length;
    const cols = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / cols);
    
    const cellWidth = Math.floor((width - gap * (cols - 1)) / cols);
    const cellHeight = Math.floor((height - gap * (rows - 1)) / rows);
    
    // Process each image to fit cell
    const processedImages = await Promise.all(
      images.map(img =>
        sharp(img)
          .resize(cellWidth, cellHeight, { fit: 'cover' })
          .toBuffer()
      )
    );
    
    // Create composite array
    const composites = processedImages.map((img, index) => ({
      input: img,
      left: (index % cols) * (cellWidth + gap),
      top: Math.floor(index / cols) * (cellHeight + gap)
    }));
    
    // Create final collage
    return sharp({
      create: {
        width,
        height,
        channels: 4,
        background
      }
    })
      .composite(composites)
      .jpeg({ quality: 90 })
      .toBuffer();
  }

  /**
   * Create masonry layout collage
   */
  private static async createMasonryCollage(
    images: Buffer[],
    width: number,
    height: number,
    gap: number,
    background: string
  ): Promise<Buffer> {
    // Implement Pinterest-style masonry layout
    const cols = 3;
    const colWidth = Math.floor((width - gap * (cols - 1)) / cols);
    const columnHeights = new Array(cols).fill(0);
    const composites = [];
    
    for (const img of images) {
      // Find shortest column
      const shortestCol = columnHeights.indexOf(Math.min(...columnHeights));
      
      // Get image metadata
      const metadata = await sharp(img).metadata();
      const aspectRatio = (metadata.width || 1) / (metadata.height || 1);
      const imgHeight = Math.round(colWidth / aspectRatio);
      
      // Resize image
      const resized = await sharp(img)
        .resize(colWidth, imgHeight, { fit: 'cover' })
        .toBuffer();
      
      // Add to composite
      composites.push({
        input: resized,
        left: shortestCol * (colWidth + gap),
        top: columnHeights[shortestCol]
      });
      
      // Update column height
      columnHeights[shortestCol] += imgHeight + gap;
    }
    
    return sharp({
      create: {
        width,
        height,
        channels: 4,
        background
      }
    })
      .composite(composites)
      .jpeg({ quality: 90 })
      .toBuffer();
  }

  /**
   * Create hero layout collage (one large, others small)
   */
  private static async createHeroCollage(
    images: Buffer[],
    width: number,
    height: number,
    gap: number,
    background: string
  ): Promise<Buffer> {
    if (images.length === 0) {
      return Buffer.from('');
    }
    
    const composites = [];
    
    // Hero image (first image) takes 2/3 of space
    const heroWidth = Math.floor(width * 0.66);
    const heroHeight = height;
    
    const heroImage = await sharp(images[0])
      .resize(heroWidth, heroHeight, { fit: 'cover' })
      .toBuffer();
    
    composites.push({
      input: heroImage,
      left: 0,
      top: 0
    });
    
    // Remaining images in a column on the right
    if (images.length > 1) {
      const sideWidth = width - heroWidth - gap;
      const sideImages = images.slice(1);
      const sideHeight = Math.floor((height - gap * (sideImages.length - 1)) / sideImages.length);
      
      for (let i = 0; i < sideImages.length; i++) {
        const resized = await sharp(sideImages[i])
          .resize(sideWidth, sideHeight, { fit: 'cover' })
          .toBuffer();
        
        composites.push({
          input: resized,
          left: heroWidth + gap,
          top: i * (sideHeight + gap)
        });
      }
    }
    
    return sharp({
      create: {
        width,
        height,
        channels: 4,
        background
      }
    })
      .composite(composites)
      .jpeg({ quality: 90 })
      .toBuffer();
  }

  /**
   * Create mosaic layout collage
   */
  private static async createMosaicCollage(
    images: Buffer[],
    width: number,
    height: number,
    gap: number,
    background: string
  ): Promise<Buffer> {
    // Create a varied grid with different sized cells
    const patterns = [
      { w: 2, h: 2 }, // Large
      { w: 1, h: 1 }, // Small
      { w: 2, h: 1 }, // Wide
      { w: 1, h: 2 }  // Tall
    ];
    
    const gridSize = 4;
    const cellWidth = Math.floor((width - gap * (gridSize - 1)) / gridSize);
    const cellHeight = Math.floor((height - gap * (gridSize - 1)) / gridSize);
    
    const composites = [];
    const used = new Set();
    
    let imageIndex = 0;
    for (let row = 0; row < gridSize && imageIndex < images.length; row++) {
      for (let col = 0; col < gridSize && imageIndex < images.length; col++) {
        const key = `${row},${col}`;
        if (used.has(key)) continue;
        
        // Choose a random pattern that fits
        const pattern = patterns[imageIndex % patterns.length];
        const fitW = col + pattern.w <= gridSize;
        const fitH = row + pattern.h <= gridSize;
        
        const actualW = fitW ? pattern.w : 1;
        const actualH = fitH ? pattern.h : 1;
        
        // Mark cells as used
        for (let r = row; r < row + actualH; r++) {
          for (let c = col; c < col + actualW; c++) {
            used.add(`${r},${c}`);
          }
        }
        
        // Resize and add image
        const imgWidth = actualW * cellWidth + (actualW - 1) * gap;
        const imgHeight = actualH * cellHeight + (actualH - 1) * gap;
        
        const resized = await sharp(images[imageIndex])
          .resize(imgWidth, imgHeight, { fit: 'cover' })
          .toBuffer();
        
        composites.push({
          input: resized,
          left: col * (cellWidth + gap),
          top: row * (cellHeight + gap)
        });
        
        imageIndex++;
      }
    }
    
    return sharp({
      create: {
        width,
        height,
        channels: 4,
        background
      }
    })
      .composite(composites)
      .jpeg({ quality: 90 })
      .toBuffer();
  }
}

/**
 * Smart Cropping Engine
 * Intelligent image cropping for presentations
 */
export class SmartCroppingEngine {
  /**
   * Smart crop to focus on important content
   */
  static async smartCrop(
    image: Buffer,
    targetWidth: number,
    targetHeight: number
  ): Promise<Buffer> {
    // Get image metadata
    const metadata = await sharp(image).metadata();
    const { width = 0, height = 0 } = metadata;
    
    // Calculate target aspect ratio
    const targetRatio = targetWidth / targetHeight;
    const currentRatio = width / height;
    
    if (Math.abs(targetRatio - currentRatio) < 0.1) {
      // Aspect ratios are close, just resize
      return sharp(image)
        .resize(targetWidth, targetHeight, { fit: 'fill' })
        .toBuffer();
    }
    
    // Detect focal point (simplified - would use ML in production)
    const focalPoint = await this.detectFocalPoint(image, metadata);
    
    // Calculate crop dimensions
    let cropWidth, cropHeight;
    if (targetRatio > currentRatio) {
      // Target is wider
      cropWidth = width;
      cropHeight = Math.round(width / targetRatio);
    } else {
      // Target is taller
      cropHeight = height;
      cropWidth = Math.round(height * targetRatio);
    }
    
    // Calculate crop position based on focal point
    const left = Math.max(0, Math.min(width - cropWidth, focalPoint.x - cropWidth / 2));
    const top = Math.max(0, Math.min(height - cropHeight, focalPoint.y - cropHeight / 2));
    
    return sharp(image)
      .extract({
        left: Math.round(left),
        top: Math.round(top),
        width: Math.round(cropWidth),
        height: Math.round(cropHeight)
      })
      .resize(targetWidth, targetHeight)
      .toBuffer();
  }

  /**
   * Detect focal point in image
   */
  private static async detectFocalPoint(
    image: Buffer,
    metadata: sharp.Metadata
  ): Promise<{ x: number; y: number }> {
    // This is a simplified version
    // In production, you'd use face detection or saliency detection
    
    const { width = 0, height = 0 } = metadata;
    
    // For now, use entropy to find the most "interesting" region
    const stats = await sharp(image).stats();
    
    // Default to center with slight bias towards upper third (rule of thirds)
    return {
      x: width / 2,
      y: height / 3
    };
  }
}

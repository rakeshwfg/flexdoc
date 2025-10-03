/**
 * File Handler Utilities
 * File system operations and network utilities
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { FlexDocError, ErrorType } from '../types';

/**
 * Read file if it exists
 */
export async function readFileIfExists(filePath: string): Promise<string> {
  try {
    const absolutePath = path.resolve(filePath);
    await fs.access(absolutePath, fs.constants.R_OK);
    const content = await fs.readFile(absolutePath, 'utf-8');
    return content;
  } catch (error) {
    throw new FlexDocError(
      ErrorType.FILE_WRITE_ERROR,
      `Failed to read file: ${filePath}`,
      error
    );
  }
}

/**
 * Write file to specified path
 */
export async function writeFileIfPath(filePath: string, data: Buffer | string): Promise<void> {
  try {
    const absolutePath = path.resolve(filePath);
    const directory = path.dirname(absolutePath);
    
    // Ensure directory exists
    await fs.mkdir(directory, { recursive: true });
    
    // Write file
    await fs.writeFile(absolutePath, data);
  } catch (error) {
    throw new FlexDocError(
      ErrorType.FILE_WRITE_ERROR,
      `Failed to write file: ${filePath}`,
      error
    );
  }
}

/**
 * Check if file exists
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get file size
 */
export async function getFileSize(filePath: string): Promise<number> {
  try {
    const stats = await fs.stat(filePath);
    return stats.size;
  } catch (error) {
    throw new FlexDocError(
      ErrorType.FILE_WRITE_ERROR,
      `Failed to get file size: ${filePath}`,
      error
    );
  }
}

/**
 * Download image from URL
 */
export async function downloadImage(url: string): Promise<Buffer> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    throw new FlexDocError(
      ErrorType.NETWORK_ERROR,
      `Failed to download image: ${url}`,
      error
    );
  }
}

/**
 * Create temporary file
 */
export async function createTempFile(
  content: string | Buffer, 
  extension: string = 'html'
): Promise<string> {
  const tempDir = await fs.mkdtemp(path.join(process.cwd(), 'flexdoc-temp-'));
  const tempFile = path.join(tempDir, `temp.${extension}`);
  await fs.writeFile(tempFile, content);
  return tempFile;
}

/**
 * Clean up temporary files
 */
export async function cleanupTempFiles(tempPath: string): Promise<void> {
  try {
    const stats = await fs.stat(tempPath);
    if (stats.isDirectory()) {
      await fs.rm(tempPath, { recursive: true, force: true });
    } else {
      await fs.unlink(tempPath);
    }
  } catch (error) {
    // Ignore cleanup errors
    console.warn(`Failed to cleanup temp file: ${tempPath}`, error);
  }
}

/**
 * Ensure directory exists
 */
export async function ensureDirectory(dirPath: string): Promise<void> {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    throw new FlexDocError(
      ErrorType.FILE_WRITE_ERROR,
      `Failed to create directory: ${dirPath}`,
      error
    );
  }
}

/**
 * Copy file
 */
export async function copyFile(source: string, destination: string): Promise<void> {
  try {
    await fs.copyFile(source, destination);
  } catch (error) {
    throw new FlexDocError(
      ErrorType.FILE_WRITE_ERROR,
      `Failed to copy file from ${source} to ${destination}`,
      error
    );
  }
}

/**
 * Get mime type from file extension
 */
export function getMimeType(extension: string): string {
  const mimeTypes: Record<string, string> = {
    'html': 'text/html',
    'pdf': 'application/pdf',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'css': 'text/css',
    'js': 'application/javascript',
    'json': 'application/json'
  };
  
  return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * Get unique filename
 */
export async function getUniqueFilename(basePath: string): Promise<string> {
  const dir = path.dirname(basePath);
  const ext = path.extname(basePath);
  const name = path.basename(basePath, ext);
  
  let counter = 0;
  let uniquePath = basePath;
  
  while (await fileExists(uniquePath)) {
    counter++;
    uniquePath = path.join(dir, `${name}_${counter}${ext}`);
  }
  
  return uniquePath;
}

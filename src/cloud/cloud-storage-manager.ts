/**
 * Cloud Storage Manager
 *
 * Unified interface for all cloud storage operations
 */

import * as fs from 'fs';
import * as path from 'path';
import { S3Adapter } from './adapters/s3-adapter';
import { AzureAdapter } from './adapters/azure-adapter';
import {
  CloudProvider,
  CloudUploadOptions,
  CloudDownloadOptions,
  CloudUploadResult,
  CloudDownloadResult,
  ICloudStorageAdapter,
  CloudCredentials
} from './types';
import { parseCloudUrl, isCloudUrl, validateCredentials } from './utils';

export class CloudStorageManager {
  private adapters: Map<CloudProvider, ICloudStorageAdapter> = new Map();
  private defaultCredentials: Map<CloudProvider, CloudCredentials> = new Map();

  constructor() {
    // Initialize adapters
    this.adapters.set(CloudProvider.S3, new S3Adapter());
    this.adapters.set(CloudProvider.AZURE_BLOB, new AzureAdapter());
    // Note: Google Drive adapter would be added here
  }

  /**
   * Set default credentials for a provider
   */
  setDefaultCredentials(provider: CloudProvider, credentials: CloudCredentials): void {
    this.defaultCredentials.set(provider, credentials);
  }

  /**
   * Upload file to cloud storage
   *
   * @param filePath - Local file path to upload
   * @param cloudUrl - Cloud URL (e.g., s3://bucket/path/file.pdf)
   * @param credentials - Optional credentials (uses default if not provided)
   * @param options - Additional upload options
   */
  async upload(
    filePath: string,
    cloudUrl: string,
    credentials?: CloudCredentials,
    options: Partial<CloudUploadOptions> = {}
  ): Promise<CloudUploadResult> {
    const parsed = parseCloudUrl(cloudUrl);
    if (!parsed) {
      return {
        success: false,
        provider: CloudProvider.S3,
        path: cloudUrl,
        error: 'Invalid cloud URL format'
      };
    }

    const adapter = this.adapters.get(parsed.provider);
    if (!adapter) {
      return {
        success: false,
        provider: parsed.provider,
        path: cloudUrl,
        error: `Unsupported provider: ${parsed.provider}`
      };
    }

    // Use provided credentials or fall back to default
    const creds = credentials || this.defaultCredentials.get(parsed.provider);
    if (!creds || !validateCredentials(parsed.provider, creds)) {
      return {
        success: false,
        provider: parsed.provider,
        path: cloudUrl,
        error: `Invalid or missing credentials for ${parsed.provider}`
      };
    }

    // Build full path
    const fullPath = parsed.bucket
      ? `${parsed.bucket}/${parsed.path}`
      : parsed.path;

    const uploadOptions: CloudUploadOptions = {
      provider: parsed.provider,
      path: fullPath,
      credentials: creds,
      ...options
    };

    return adapter.upload(filePath, uploadOptions);
  }

  /**
   * Download file from cloud storage
   */
  async download(
    cloudUrl: string,
    credentials?: CloudCredentials
  ): Promise<CloudDownloadResult> {
    const parsed = parseCloudUrl(cloudUrl);
    if (!parsed) {
      return {
        success: false,
        provider: CloudProvider.S3,
        error: 'Invalid cloud URL format'
      };
    }

    const adapter = this.adapters.get(parsed.provider);
    if (!adapter) {
      return {
        success: false,
        provider: parsed.provider,
        error: `Unsupported provider: ${parsed.provider}`
      };
    }

    const creds = credentials || this.defaultCredentials.get(parsed.provider);
    if (!creds || !validateCredentials(parsed.provider, creds)) {
      return {
        success: false,
        provider: parsed.provider,
        error: `Invalid or missing credentials for ${parsed.provider}`
      };
    }

    const fullPath = parsed.bucket
      ? `${parsed.bucket}/${parsed.path}`
      : parsed.path;

    const downloadOptions: CloudDownloadOptions = {
      provider: parsed.provider,
      path: fullPath,
      credentials: creds
    };

    return adapter.download(downloadOptions);
  }

  /**
   * Download file and save to local path
   */
  async downloadToFile(
    cloudUrl: string,
    outputPath: string,
    credentials?: CloudCredentials
  ): Promise<boolean> {
    try {
      const result = await this.download(cloudUrl, credentials);

      if (!result.success || !result.buffer) {
        console.error('Download failed:', result.error);
        return false;
      }

      // Ensure directory exists
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Write to file
      fs.writeFileSync(outputPath, result.buffer);
      return true;
    } catch (error) {
      console.error('Error downloading to file:', error);
      return false;
    }
  }

  /**
   * Delete file from cloud storage
   */
  async delete(cloudUrl: string, credentials?: CloudCredentials): Promise<boolean> {
    const parsed = parseCloudUrl(cloudUrl);
    if (!parsed) {
      return false;
    }

    const adapter = this.adapters.get(parsed.provider);
    if (!adapter) {
      return false;
    }

    const creds = credentials || this.defaultCredentials.get(parsed.provider);
    if (!creds) {
      return false;
    }

    const fullPath = parsed.bucket
      ? `${parsed.bucket}/${parsed.path}`
      : parsed.path;

    const options: CloudDownloadOptions = {
      provider: parsed.provider,
      path: fullPath,
      credentials: creds
    };

    return adapter.delete(options);
  }

  /**
   * Get public URL for a cloud file
   */
  getPublicUrl(cloudUrl: string): string | null {
    const parsed = parseCloudUrl(cloudUrl);
    if (!parsed) {
      return null;
    }

    const adapter = this.adapters.get(parsed.provider);
    if (!adapter) {
      return null;
    }

    const fullPath = parsed.bucket
      ? `${parsed.bucket}/${parsed.path}`
      : parsed.path;

    return adapter.getPublicUrl(fullPath);
  }

  /**
   * Check if a URL is a cloud URL
   */
  isCloudUrl(url: string): boolean {
    return isCloudUrl(url);
  }

  /**
   * Get supported providers
   */
  getSupportedProviders(): CloudProvider[] {
    return Array.from(this.adapters.keys());
  }
}

// Export singleton instance
export const cloudStorage = new CloudStorageManager();

/**
 * Azure Blob Storage Adapter
 */

import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';
import * as fs from 'fs';
import * as path from 'path';
import {
  ICloudStorageAdapter,
  CloudUploadOptions,
  CloudDownloadOptions,
  CloudUploadResult,
  CloudDownloadResult,
  CloudProvider
} from '../types';

export class AzureAdapter implements ICloudStorageAdapter {
  /**
   * Get Azure Blob Service Client
   */
  private getClient(credentials: any): BlobServiceClient {
    if (credentials.connectionString) {
      return BlobServiceClient.fromConnectionString(credentials.connectionString);
    }

    if (credentials.accountName && credentials.accountKey) {
      const sharedKeyCredential = new StorageSharedKeyCredential(
        credentials.accountName,
        credentials.accountKey
      );
      return new BlobServiceClient(
        `https://${credentials.accountName}.blob.core.windows.net`,
        sharedKeyCredential
      );
    }

    throw new Error('Azure credentials must include either connectionString or (accountName + accountKey)');
  }

  /**
   * Upload file to Azure Blob Storage
   */
  async upload(filePath: string, options: CloudUploadOptions): Promise<CloudUploadResult> {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      const client = this.getClient(options.credentials);

      // Parse Azure path: container-name/path/to/file.pdf
      const pathParts = options.path.split('/');
      const containerName = pathParts[0];
      const blobName = pathParts.slice(1).join('/');

      if (!containerName || !blobName) {
        throw new Error('Invalid Azure path. Format: container-name/path/to/file.pdf');
      }

      const containerClient = client.getContainerClient(containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      // Determine content type
      const contentType = options.contentType || this.getContentType(filePath);

      // Upload
      const uploadResponse = await blockBlobClient.uploadFile(filePath, {
        blobHTTPHeaders: {
          blobContentType: contentType
        },
        metadata: options.metadata
      });

      const stats = fs.statSync(filePath);
      const url = `azure://${containerName}/${blobName}`;
      const publicUrl = blockBlobClient.url;

      return {
        success: true,
        provider: CloudProvider.AZURE_BLOB,
        path: options.path,
        url,
        publicUrl,
        size: stats.size,
        etag: uploadResponse.etag
      };
    } catch (error) {
      return {
        success: false,
        provider: CloudProvider.AZURE_BLOB,
        path: options.path,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Download file from Azure Blob Storage
   */
  async download(options: CloudDownloadOptions): Promise<CloudDownloadResult> {
    try {
      const client = this.getClient(options.credentials);

      const pathParts = options.path.split('/');
      const containerName = pathParts[0];
      const blobName = pathParts.slice(1).join('/');

      if (!containerName || !blobName) {
        throw new Error('Invalid Azure path. Format: container-name/path/to/file.pdf');
      }

      const containerClient = client.getContainerClient(containerName);
      const blobClient = containerClient.getBlobClient(blobName);

      const downloadResponse = await blobClient.download();

      if (!downloadResponse.readableStreamBody) {
        throw new Error('No data received from Azure');
      }

      const buffer = await this.streamToBuffer(downloadResponse.readableStreamBody);

      return {
        success: true,
        provider: CloudProvider.AZURE_BLOB,
        buffer,
        contentType: downloadResponse.contentType,
        size: downloadResponse.contentLength
      };
    } catch (error) {
      return {
        success: false,
        provider: CloudProvider.AZURE_BLOB,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Delete file from Azure Blob Storage
   */
  async delete(options: CloudDownloadOptions): Promise<boolean> {
    try {
      const client = this.getClient(options.credentials);

      const pathParts = options.path.split('/');
      const containerName = pathParts[0];
      const blobName = pathParts.slice(1).join('/');

      const containerClient = client.getContainerClient(containerName);
      const blobClient = containerClient.getBlobClient(blobName);

      await blobClient.delete();
      return true;
    } catch (error) {
      console.error('Error deleting from Azure:', error);
      return false;
    }
  }

  /**
   * Get public URL for Azure blob
   */
  getPublicUrl(path: string): string | null {
    try {
      const pathParts = path.split('/');
      const containerName = pathParts[0];
      const blobName = pathParts.slice(1).join('/');

      // Note: This assumes default Azure storage account, actual account should be provided
      return `https://<account>.blob.core.windows.net/${containerName}/${blobName}`;
    } catch (error) {
      return null;
    }
  }

  /**
   * Helper: Convert stream to buffer
   */
  private async streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(chunk instanceof Buffer ? chunk : Buffer.from(chunk)));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }

  /**
   * Helper: Get content type from file extension
   */
  private getContentType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const contentTypes: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.html': 'text/html',
      '.json': 'application/json',
      '.txt': 'text/plain'
    };
    return contentTypes[ext] || 'application/octet-stream';
  }
}

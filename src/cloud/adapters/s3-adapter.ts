/**
 * AWS S3 Storage Adapter
 */

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
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

export class S3Adapter implements ICloudStorageAdapter {
  private client: S3Client | null = null;

  /**
   * Initialize S3 client with credentials
   */
  private getClient(credentials: any): S3Client {
    if (!credentials.accessKeyId || !credentials.secretAccessKey || !credentials.region) {
      throw new Error('S3 credentials must include accessKeyId, secretAccessKey, and region');
    }

    return new S3Client({
      region: credentials.region,
      credentials: {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
        sessionToken: credentials.sessionToken
      }
    });
  }

  /**
   * Upload file to S3
   */
  async upload(filePath: string, options: CloudUploadOptions): Promise<CloudUploadResult> {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      const client = this.getClient(options.credentials);

      // Parse S3 path: bucket-name/path/to/file.pdf
      const pathParts = options.path.split('/');
      const bucket = pathParts[0];
      const key = pathParts.slice(1).join('/');

      if (!bucket || !key) {
        throw new Error('Invalid S3 path. Format: bucket-name/path/to/file.pdf');
      }

      // Read file
      const fileStream = fs.createReadStream(filePath);
      const stats = fs.statSync(filePath);

      // Determine content type
      const contentType = options.contentType || this.getContentType(filePath);

      // Upload using multipart upload for large files
      const upload = new Upload({
        client,
        params: {
          Bucket: bucket,
          Key: key,
          Body: fileStream,
          ContentType: contentType,
          Metadata: options.metadata || {},
          ACL: options.makePublic ? 'public-read' : 'private'
        }
      });

      const result = await upload.done();

      // Build URLs
      const url = `s3://${bucket}/${key}`;
      const publicUrl = options.makePublic
        ? `https://${bucket}.s3.${options.credentials?.region}.amazonaws.com/${key}`
        : undefined;

      return {
        success: true,
        provider: CloudProvider.S3,
        path: options.path,
        url,
        publicUrl,
        size: stats.size,
        etag: result.ETag
      };
    } catch (error) {
      return {
        success: false,
        provider: CloudProvider.S3,
        path: options.path,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Download file from S3
   */
  async download(options: CloudDownloadOptions): Promise<CloudDownloadResult> {
    try {
      const client = this.getClient(options.credentials);

      // Parse S3 path
      const pathParts = options.path.split('/');
      const bucket = pathParts[0];
      const key = pathParts.slice(1).join('/');

      if (!bucket || !key) {
        throw new Error('Invalid S3 path. Format: bucket-name/path/to/file.pdf');
      }

      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key
      });

      const response = await client.send(command);

      // Convert stream to buffer
      const buffer = await this.streamToBuffer(response.Body as any);

      return {
        success: true,
        provider: CloudProvider.S3,
        buffer,
        contentType: response.ContentType,
        size: response.ContentLength
      };
    } catch (error) {
      return {
        success: false,
        provider: CloudProvider.S3,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Delete file from S3
   */
  async delete(options: CloudDownloadOptions): Promise<boolean> {
    try {
      const client = this.getClient(options.credentials);

      const pathParts = options.path.split('/');
      const bucket = pathParts[0];
      const key = pathParts.slice(1).join('/');

      const command = new DeleteObjectCommand({
        Bucket: bucket,
        Key: key
      });

      await client.send(command);
      return true;
    } catch (error) {
      console.error('Error deleting from S3:', error);
      return false;
    }
  }

  /**
   * Get public URL for S3 object
   */
  getPublicUrl(path: string): string | null {
    try {
      const pathParts = path.split('/');
      const bucket = pathParts[0];
      const key = pathParts.slice(1).join('/');

      // Note: This assumes us-east-1, actual region should be provided
      return `https://${bucket}.s3.amazonaws.com/${key}`;
    } catch (error) {
      return null;
    }
  }

  /**
   * Helper: Convert stream to buffer
   */
  private async streamToBuffer(stream: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk: Buffer) => chunks.push(chunk));
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

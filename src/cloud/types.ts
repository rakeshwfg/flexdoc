/**
 * Cloud Storage Types and Interfaces
 */

export enum CloudProvider {
  S3 = 's3',
  GOOGLE_DRIVE = 'drive',
  AZURE_BLOB = 'azure',
  DROPBOX = 'dropbox'
}

export interface CloudCredentials {
  // AWS S3
  accessKeyId?: string;
  secretAccessKey?: string;
  sessionToken?: string;
  region?: string;

  // Google Drive
  clientId?: string;
  clientSecret?: string;
  refreshToken?: string;
  accessToken?: string;

  // Azure
  accountName?: string;
  accountKey?: string;
  sasToken?: string;
  connectionString?: string;

  // Dropbox
  dropboxToken?: string;
}

export interface CloudUploadOptions {
  provider: CloudProvider;
  path: string; // e.g., "bucket-name/path/to/file.pdf" or "folder-id/file.pdf"
  credentials?: CloudCredentials;
  metadata?: Record<string, string>;
  contentType?: string;
  makePublic?: boolean;
}

export interface CloudDownloadOptions {
  provider: CloudProvider;
  path: string;
  credentials?: CloudCredentials;
}

export interface CloudUploadResult {
  success: boolean;
  provider: CloudProvider;
  path: string;
  url?: string;
  publicUrl?: string;
  size?: number;
  etag?: string;
  error?: string;
}

export interface CloudDownloadResult {
  success: boolean;
  provider: CloudProvider;
  buffer?: Buffer;
  contentType?: string;
  size?: number;
  error?: string;
}

/**
 * Base interface for cloud storage adapters
 */
export interface ICloudStorageAdapter {
  upload(filePath: string, options: CloudUploadOptions): Promise<CloudUploadResult>;
  download(options: CloudDownloadOptions): Promise<CloudDownloadResult>;
  delete(options: CloudDownloadOptions): Promise<boolean>;
  getPublicUrl(path: string): string | null;
}

/**
 * Cloud URL format:
 * s3://bucket-name/path/to/file.pdf
 * drive://folder-id/file-name.pdf
 * azure://container-name/path/to/file.pdf
 * dropbox://path/to/file.pdf
 */
export interface ParsedCloudUrl {
  provider: CloudProvider;
  bucket?: string;  // S3 bucket or Azure container
  path: string;     // File path within bucket/container
  fileId?: string;  // Google Drive file ID
}

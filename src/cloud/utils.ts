/**
 * Cloud Storage Utilities
 */

import { CloudProvider, ParsedCloudUrl } from './types';

/**
 * Parse cloud URL into components
 *
 * Supported formats:
 * - s3://bucket-name/path/to/file.pdf
 * - drive://folder-id/file-name.pdf or drive://file-id
 * - azure://container-name/path/to/file.pdf
 * - dropbox://path/to/file.pdf
 */
export function parseCloudUrl(url: string): ParsedCloudUrl | null {
  try {
    // Match pattern: protocol://path
    const match = url.match(/^([a-z]+):\/\/(.+)$/);
    if (!match) return null;

    const [, protocol, rest] = match;
    const provider = protocol as CloudProvider;

    switch (provider) {
      case CloudProvider.S3: {
        // s3://bucket-name/path/to/file.pdf
        const parts = rest.split('/');
        const bucket = parts[0];
        const path = parts.slice(1).join('/');
        return { provider, bucket, path };
      }

      case CloudProvider.GOOGLE_DRIVE: {
        // drive://file-id or drive://folder-id/file-name
        if (rest.includes('/')) {
          const [folderId, ...pathParts] = rest.split('/');
          return {
            provider,
            fileId: folderId,
            path: pathParts.join('/')
          };
        } else {
          return {
            provider,
            fileId: rest,
            path: rest
          };
        }
      }

      case CloudProvider.AZURE_BLOB: {
        // azure://container-name/path/to/file.pdf
        const parts = rest.split('/');
        const bucket = parts[0]; // container name
        const path = parts.slice(1).join('/');
        return { provider, bucket, path };
      }

      case CloudProvider.DROPBOX: {
        // dropbox://path/to/file.pdf
        return { provider, path: rest };
      }

      default:
        return null;
    }
  } catch (error) {
    console.error('Error parsing cloud URL:', error);
    return null;
  }
}

/**
 * Check if a string is a cloud URL
 */
export function isCloudUrl(url: string): boolean {
  if (typeof url !== 'string') return false;
  return /^(s3|drive|azure|dropbox):\/\/.+$/.test(url);
}

/**
 * Build cloud URL from components
 */
export function buildCloudUrl(provider: CloudProvider, bucket: string, path: string): string {
  switch (provider) {
    case CloudProvider.S3:
      return `s3://${bucket}/${path}`;
    case CloudProvider.GOOGLE_DRIVE:
      return `drive://${bucket}/${path}`;
    case CloudProvider.AZURE_BLOB:
      return `azure://${bucket}/${path}`;
    case CloudProvider.DROPBOX:
      return `dropbox://${path}`;
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

/**
 * Extract file name from path
 */
export function getFileNameFromPath(path: string): string {
  const parts = path.split('/');
  return parts[parts.length - 1] || 'file';
}

/**
 * Validate cloud credentials
 */
export function validateCredentials(provider: CloudProvider, credentials: any): boolean {
  switch (provider) {
    case CloudProvider.S3:
      return !!(credentials.accessKeyId && credentials.secretAccessKey && credentials.region);
    case CloudProvider.GOOGLE_DRIVE:
      return !!(credentials.clientId && credentials.clientSecret && credentials.refreshToken);
    case CloudProvider.AZURE_BLOB:
      return !!(credentials.accountName && (credentials.accountKey || credentials.sasToken || credentials.connectionString));
    case CloudProvider.DROPBOX:
      return !!credentials.dropboxToken;
    default:
      return false;
  }
}

/**
 * Conversion Routes - Handle PDF/PPTX/DOCX conversion requests
 */

import { Router, Request, Response } from 'express';
import { Multer } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { FlexDoc } from '../../index';
import { JobManager, JobStatus } from '../jobs/job-manager';
import { ServerConfig } from '../server';

const flexdoc = new FlexDoc();

export function conversionRoutes(upload: Multer, jobManager: JobManager, config: Required<ServerConfig>): Router {
  const router = Router();

  /**
   * POST /api/convert/pdf
   * Convert HTML to PDF
   */
  router.post('/pdf', upload.single('file'), async (req: Request, res: Response) => {
    try {
      // Get HTML content
      const html = await getHTMLContent(req);
      if (!html) {
        res.status(400).json({
          success: false,
          error: 'No HTML content provided. Use "html" field or upload a file.'
        });
        return;
      }

      // Parse options
      const options = parseOptions(req.body.options);

      // Create job
      const job = jobManager.createJob('pdf', options);

      // Start conversion asynchronously
      convertAsync(job.id, 'pdf', html, options, jobManager, config.outputDir);

      // Return job ID immediately
      res.json({
        success: true,
        jobId: job.id,
        status: job.status,
        message: 'Conversion started. Check job status at /api/jobs/' + job.id
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      // Cleanup uploaded file
      cleanupUpload(req);
    }
  });

  /**
   * POST /api/convert/pptx
   * Convert HTML to PPTX
   */
  router.post('/pptx', upload.single('file'), async (req: Request, res: Response) => {
    try {
      const html = await getHTMLContent(req);
      if (!html) {
        res.status(400).json({
          success: false,
          error: 'No HTML content provided. Use "html" field or upload a file.'
        });
        return;
      }

      const options = parseOptions(req.body.options);
      const job = jobManager.createJob('pptx', options);

      convertAsync(job.id, 'pptx', html, options, jobManager, config.outputDir);

      res.json({
        success: true,
        jobId: job.id,
        status: job.status,
        message: 'Conversion started. Check job status at /api/jobs/' + job.id
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      cleanupUpload(req);
    }
  });

  /**
   * POST /api/convert/docx
   * Convert HTML to DOCX
   */
  router.post('/docx', upload.single('file'), async (req: Request, res: Response) => {
    try {
      const html = await getHTMLContent(req);
      if (!html) {
        res.status(400).json({
          success: false,
          error: 'No HTML content provided. Use "html" field or upload a file.'
        });
        return;
      }

      const options = parseOptions(req.body.options);
      const job = jobManager.createJob('docx', options);

      convertAsync(job.id, 'docx', html, options, jobManager, config.outputDir);

      res.json({
        success: true,
        jobId: job.id,
        status: job.status,
        message: 'Conversion started. Check job status at /api/jobs/' + job.id
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      cleanupUpload(req);
    }
  });

  /**
   * POST /api/convert/batch
   * Batch convert multiple documents
   */
  router.post('/batch', async (req: Request, res: Response) => {
    try {
      const { conversions } = req.body;

      if (!Array.isArray(conversions) || conversions.length === 0) {
        res.status(400).json({
          success: false,
          error: 'Invalid batch request. Provide array of conversions.'
        });
        return;
      }

      const jobs = conversions.map(item => {
        const job = jobManager.createJob(item.format, item.options);
        convertAsync(job.id, item.format, item.html, item.options, jobManager, config.outputDir);
        return {
          jobId: job.id,
          format: item.format,
          status: job.status
        };
      });

      res.json({
        success: true,
        jobs,
        message: 'Batch conversion started. Check individual job statuses.'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  return router;
}

/**
 * Get HTML content from request
 */
async function getHTMLContent(req: Request): Promise<string | null> {
  // Check for uploaded file
  if (req.file) {
    try {
      return fs.readFileSync(req.file.path, 'utf-8');
    } catch (error) {
      console.error('Error reading uploaded file:', error);
      return null;
    }
  }

  // Check for HTML in body
  if (req.body.html) {
    return req.body.html;
  }

  // Check for URL
  if (req.body.url) {
    // TODO: Fetch HTML from URL
    // For now, just return null
    return null;
  }

  return null;
}

/**
 * Parse options from request body
 */
function parseOptions(optionsStr?: string): any {
  if (!optionsStr) return {};

  try {
    return typeof optionsStr === 'string' ? JSON.parse(optionsStr) : optionsStr;
  } catch (error) {
    console.error('Error parsing options:', error);
    return {};
  }
}

/**
 * Cleanup uploaded file
 */
function cleanupUpload(req: Request): void {
  if (req.file && fs.existsSync(req.file.path)) {
    try {
      fs.unlinkSync(req.file.path);
    } catch (error) {
      console.error('Error cleaning up upload:', error);
    }
  }
}

/**
 * Perform conversion asynchronously
 */
async function convertAsync(
  jobId: string,
  format: 'pdf' | 'pptx' | 'docx',
  html: string,
  options: any,
  jobManager: JobManager,
  outputDir: string
): Promise<void> {
  try {
    // Update job status
    jobManager.updateJobStatus(jobId, JobStatus.PROCESSING);

    // Generate output file path
    const extension = format;
    const filename = `${jobId}.${extension}`;
    const outputPath = path.join(outputDir, filename);

    // Add output path to options
    options.outputPath = outputPath;

    // Perform conversion
    let result;
    switch (format) {
      case 'pdf':
        result = await flexdoc.toPDF(html, options);
        break;
      case 'pptx':
        result = await flexdoc.toPPTX(html, options);
        break;
      case 'docx':
        result = await flexdoc.toWord(html, options);
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }

    if (result.success && result.filePath) {
      // Get file size
      const stats = fs.statSync(result.filePath);
      jobManager.completeJob(jobId, result.filePath, stats.size);
    } else {
      jobManager.failJob(jobId, result.error || 'Conversion failed');
    }
  } catch (error) {
    console.error(`Conversion error for job ${jobId}:`, error);
    jobManager.failJob(jobId, error instanceof Error ? error.message : 'Unknown error');
  }
}

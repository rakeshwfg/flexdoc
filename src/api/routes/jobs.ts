/**
 * Job Routes - Handle job status and management
 */

import { Router, Request, Response } from 'express';
import * as fs from 'fs';
import { JobManager } from '../jobs/job-manager';

export function jobRoutes(jobManager: JobManager): Router {
  const router = Router();

  /**
   * GET /api/jobs
   * List all jobs
   */
  router.get('/', (req: Request, res: Response) => {
    try {
      const jobs = jobManager.getAllJobs();
      const stats = jobManager.getStats();

      res.json({
        success: true,
        total: jobs.length,
        stats,
        jobs: jobs.map(job => ({
          id: job.id,
          status: job.status,
          format: job.format,
          createdAt: new Date(job.createdAt).toISOString(),
          completedAt: job.completedAt ? new Date(job.completedAt).toISOString() : null,
          fileSize: job.fileSize,
          error: job.error
        }))
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  /**
   * GET /api/jobs/:id
   * Get job status
   */
  router.get('/:id', (req: Request, res: Response) => {
    try {
      const job = jobManager.getJob(req.params.id);

      if (!job) {
        res.status(404).json({
          success: false,
          error: 'Job not found'
        });
        return;
      }

      res.json({
        success: true,
        job: {
          id: job.id,
          status: job.status,
          format: job.format,
          createdAt: new Date(job.createdAt).toISOString(),
          startedAt: job.startedAt ? new Date(job.startedAt).toISOString() : null,
          completedAt: job.completedAt ? new Date(job.completedAt).toISOString() : null,
          fileSize: job.fileSize,
          error: job.error,
          downloadUrl: job.filePath ? `/api/jobs/${job.id}/download` : null
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  /**
   * GET /api/jobs/:id/download
   * Download converted file
   */
  router.get('/:id/download', (req: Request, res: Response) => {
    try {
      const job = jobManager.getJob(req.params.id);

      if (!job) {
        res.status(404).json({
          success: false,
          error: 'Job not found'
        });
        return;
      }

      if (job.status !== 'completed' || !job.filePath) {
        res.status(400).json({
          success: false,
          error: 'Job not completed or file not available',
          status: job.status
        });
        return;
      }

      if (!fs.existsSync(job.filePath)) {
        res.status(404).json({
          success: false,
          error: 'File not found on server'
        });
        return;
      }

      // Determine content type
      const contentTypes: Record<string, string> = {
        pdf: 'application/pdf',
        pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      };

      const contentType = contentTypes[job.format] || 'application/octet-stream';

      // Set headers
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="document.${job.format}"`);
      res.setHeader('Content-Length', job.fileSize || 0);

      // Stream file
      const fileStream = fs.createReadStream(job.filePath);
      fileStream.pipe(res);

      fileStream.on('error', (error) => {
        console.error('Error streaming file:', error);
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            error: 'Error downloading file'
          });
        }
      });
    } catch (error) {
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  });

  /**
   * DELETE /api/jobs/:id
   * Delete a job
   */
  router.delete('/:id', (req: Request, res: Response) => {
    try {
      const deleted = jobManager.deleteJob(req.params.id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Job not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Job deleted successfully'
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

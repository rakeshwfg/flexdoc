/**
 * Job Manager - Handles async job processing and tracking
 */

import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

export enum JobStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export interface Job {
  id: string;
  status: JobStatus;
  format: 'pdf' | 'pptx' | 'docx';
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  filePath?: string;
  fileSize?: number;
  error?: string;
  options?: any;
}

export class JobManager {
  private jobs: Map<string, Job> = new Map();
  private outputDir: string;
  private retentionMs: number;

  constructor(outputDir: string, retentionMs: number = 3600000) {
    this.outputDir = outputDir;
    this.retentionMs = retentionMs;

    // Start cleanup interval (every 10 minutes)
    setInterval(() => this.cleanup(), 10 * 60 * 1000);
  }

  /**
   * Create a new job
   */
  public createJob(format: 'pdf' | 'pptx' | 'docx', options?: any): Job {
    const job: Job = {
      id: randomUUID(),
      status: JobStatus.PENDING,
      format,
      createdAt: Date.now(),
      options
    };

    this.jobs.set(job.id, job);
    return job;
  }

  /**
   * Get a job by ID
   */
  public getJob(jobId: string): Job | undefined {
    return this.jobs.get(jobId);
  }

  /**
   * Get all jobs
   */
  public getAllJobs(): Job[] {
    return Array.from(this.jobs.values());
  }

  /**
   * Update job status
   */
  public updateJobStatus(jobId: string, status: JobStatus, data?: Partial<Job>): void {
    const job = this.jobs.get(jobId);
    if (!job) return;

    job.status = status;

    if (status === JobStatus.PROCESSING && !job.startedAt) {
      job.startedAt = Date.now();
    }

    if (status === JobStatus.COMPLETED || status === JobStatus.FAILED) {
      job.completedAt = Date.now();
    }

    if (data) {
      Object.assign(job, data);
    }

    this.jobs.set(jobId, job);
  }

  /**
   * Mark job as completed
   */
  public completeJob(jobId: string, filePath: string, fileSize: number): void {
    this.updateJobStatus(jobId, JobStatus.COMPLETED, { filePath, fileSize });
  }

  /**
   * Mark job as failed
   */
  public failJob(jobId: string, error: string): void {
    this.updateJobStatus(jobId, JobStatus.FAILED, { error });
  }

  /**
   * Delete a job
   */
  public deleteJob(jobId: string): boolean {
    const job = this.jobs.get(jobId);
    if (!job) return false;

    // Delete output file if it exists
    if (job.filePath && fs.existsSync(job.filePath)) {
      try {
        fs.unlinkSync(job.filePath);
      } catch (error) {
        console.error(`Failed to delete file: ${job.filePath}`, error);
      }
    }

    this.jobs.delete(jobId);
    return true;
  }

  /**
   * Cleanup old jobs and files
   */
  public cleanup(): void {
    const now = Date.now();
    const jobsToDelete: string[] = [];

    // Find jobs older than retention period
    this.jobs.forEach((job, jobId) => {
      const age = now - job.createdAt;
      if (age > this.retentionMs) {
        jobsToDelete.push(jobId);
      }
    });

    // Delete old jobs
    jobsToDelete.forEach(jobId => {
      this.deleteJob(jobId);
    });

    if (jobsToDelete.length > 0) {
      console.log(`Cleaned up ${jobsToDelete.length} old jobs`);
    }

    // Cleanup orphaned files in output directory
    this.cleanupOrphanedFiles();
  }

  /**
   * Cleanup orphaned files that don't have a job
   */
  private cleanupOrphanedFiles(): void {
    try {
      if (!fs.existsSync(this.outputDir)) return;

      const files = fs.readdirSync(this.outputDir);
      const jobFiles = new Set(
        Array.from(this.jobs.values())
          .filter(job => job.filePath)
          .map(job => path.basename(job.filePath!))
      );

      files.forEach(file => {
        if (!jobFiles.has(file)) {
          const filePath = path.join(this.outputDir, file);
          const stats = fs.statSync(filePath);
          const age = Date.now() - stats.mtimeMs;

          // Delete files older than retention period
          if (age > this.retentionMs) {
            try {
              fs.unlinkSync(filePath);
              console.log(`Deleted orphaned file: ${file}`);
            } catch (error) {
              console.error(`Failed to delete orphaned file: ${file}`, error);
            }
          }
        }
      });
    } catch (error) {
      console.error('Error cleaning up orphaned files:', error);
    }
  }

  /**
   * Get job statistics
   */
  public getStats(): {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    failed: number;
  } {
    const stats = {
      total: this.jobs.size,
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0
    };

    this.jobs.forEach(job => {
      switch (job.status) {
        case JobStatus.PENDING:
          stats.pending++;
          break;
        case JobStatus.PROCESSING:
          stats.processing++;
          break;
        case JobStatus.COMPLETED:
          stats.completed++;
          break;
        case JobStatus.FAILED:
          stats.failed++;
          break;
      }
    });

    return stats;
  }
}

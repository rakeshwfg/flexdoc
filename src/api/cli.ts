#!/usr/bin/env node

/**
 * FlexDoc API Server CLI
 * Start the REST API server
 */

import { startServer, ServerConfig } from './server';

// Parse environment variables
const config: ServerConfig = {
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  host: process.env.HOST || '0.0.0.0',
  uploadDir: process.env.UPLOAD_DIR || './uploads',
  outputDir: process.env.OUTPUT_DIR || './outputs',
  maxFileSize: process.env.MAX_FILE_SIZE ? parseInt(process.env.MAX_FILE_SIZE) : 50 * 1024 * 1024,
  enableAuth: process.env.ENABLE_AUTH === 'true',
  apiKey: process.env.API_KEY || '',
  corsOrigins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['*'],
  rateLimit: {
    windowMs: process.env.RATE_LIMIT_WINDOW_MS ? parseInt(process.env.RATE_LIMIT_WINDOW_MS) : 15 * 60 * 1000,
    max: process.env.RATE_LIMIT_MAX ? parseInt(process.env.RATE_LIMIT_MAX) : 100
  },
  jobRetention: process.env.JOB_RETENTION_MS ? parseInt(process.env.JOB_RETENTION_MS) : 3600000
};

// Start server
startServer(config).catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\nReceived SIGTERM signal. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nReceived SIGINT signal. Shutting down gracefully...');
  process.exit(0);
});

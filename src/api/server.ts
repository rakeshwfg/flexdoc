/**
 * FlexDoc REST API Server
 *
 * Provides HTTP endpoints for document conversion services
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';

import { conversionRoutes } from './routes/conversion';
import { jobRoutes } from './routes/jobs';
import { infoRoutes } from './routes/info';
import { JobManager } from './jobs/job-manager';
import { errorHandler } from './middleware/error-handler';
import { swaggerSpec } from './swagger';

export interface ServerConfig {
  port?: number;
  host?: string;
  uploadDir?: string;
  outputDir?: string;
  maxFileSize?: number;
  enableAuth?: boolean;
  apiKey?: string;
  corsOrigins?: string[];
  rateLimit?: {
    windowMs?: number;
    max?: number;
  };
  jobRetention?: number;
}

export class FlexDocServer {
  private app: Express;
  private config: Required<ServerConfig>;
  private jobManager: JobManager;
  private upload: multer.Multer;

  constructor(config: ServerConfig = {}) {
    this.config = {
      port: config.port || 3000,
      host: config.host || '0.0.0.0',
      uploadDir: config.uploadDir || path.join(process.cwd(), 'uploads'),
      outputDir: config.outputDir || path.join(process.cwd(), 'outputs'),
      maxFileSize: config.maxFileSize || 50 * 1024 * 1024, // 50MB
      enableAuth: config.enableAuth || false,
      apiKey: config.apiKey || '',
      corsOrigins: config.corsOrigins || ['*'],
      rateLimit: {
        windowMs: config.rateLimit?.windowMs || 15 * 60 * 1000, // 15 minutes
        max: config.rateLimit?.max || 100
      },
      jobRetention: config.jobRetention || 3600000 // 1 hour
    };

    // Initialize Express app
    this.app = express();

    // Initialize job manager
    this.jobManager = new JobManager(this.config.outputDir, this.config.jobRetention);

    // Initialize multer for file uploads
    this.upload = multer({
      dest: this.config.uploadDir,
      limits: {
        fileSize: this.config.maxFileSize
      }
    });

    // Setup directories
    this.setupDirectories();

    // Setup middleware
    this.setupMiddleware();

    // Setup routes
    this.setupRoutes();

    // Setup error handling
    this.setupErrorHandling();
  }

  private setupDirectories(): void {
    // Create directories if they don't exist
    [this.config.uploadDir, this.config.outputDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  private setupMiddleware(): void {
    // Security
    this.app.use(helmet());

    // CORS
    const corsOptions = {
      origin: this.config.corsOrigins.includes('*')
        ? '*'
        : this.config.corsOrigins,
      methods: ['GET', 'POST', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
    };
    this.app.use(cors(corsOptions));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: this.config.rateLimit.windowMs,
      max: this.config.rateLimit.max,
      message: 'Too many requests from this IP, please try again later.',
      standardHeaders: true,
      legacyHeaders: false
    });
    this.app.use('/api/', limiter);

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // API key authentication (if enabled)
    if (this.config.enableAuth) {
      this.app.use('/api/', this.authMiddleware.bind(this));
    }

    // Request logging
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });
  }

  private authMiddleware(req: Request, res: Response, next: NextFunction): void {
    const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');

    if (!apiKey || apiKey !== this.config.apiKey) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized - Invalid or missing API key'
      });
      return;
    }

    next();
  }

  private setupRoutes(): void {
    // Health check
    this.app.get('/health', (req: Request, res: Response) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    });

    // API documentation
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // API routes
    this.app.use('/api/convert', conversionRoutes(this.upload, this.jobManager, this.config));
    this.app.use('/api/jobs', jobRoutes(this.jobManager));
    this.app.use('/api', infoRoutes());

    // Root endpoint
    this.app.get('/', (req: Request, res: Response) => {
      res.json({
        name: 'FlexDoc API',
        version: '1.5.0',
        description: 'REST API for HTML to PDF/PPTX/DOCX conversion',
        documentation: '/api-docs',
        endpoints: {
          health: '/health',
          convert: {
            pdf: 'POST /api/convert/pdf',
            pptx: 'POST /api/convert/pptx',
            docx: 'POST /api/convert/docx'
          },
          jobs: {
            status: 'GET /api/jobs/:id',
            download: 'GET /api/jobs/:id/download',
            list: 'GET /api/jobs',
            delete: 'DELETE /api/jobs/:id'
          },
          info: {
            themes: 'GET /api/themes',
            formats: 'GET /api/formats',
            version: 'GET /api/version'
          }
        }
      });
    });
  }

  private setupErrorHandling(): void {
    // 404 handler
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        path: req.path
      });
    });

    // Global error handler
    this.app.use(errorHandler);
  }

  /**
   * Start the server
   */
  public start(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.app.listen(this.config.port, this.config.host, () => {
          console.log('');
          console.log('╔════════════════════════════════════════════════════════════╗');
          console.log('║              FlexDoc API Server Started! 🚀                ║');
          console.log('╚════════════════════════════════════════════════════════════╝');
          console.log('');
          console.log(`  Server:        http://${this.config.host}:${this.config.port}`);
          console.log(`  Documentation: http://${this.config.host}:${this.config.port}/api-docs`);
          console.log(`  Health Check:  http://${this.config.host}:${this.config.port}/health`);
          console.log('');
          console.log(`  Upload Dir:    ${this.config.uploadDir}`);
          console.log(`  Output Dir:    ${this.config.outputDir}`);
          console.log(`  Max File Size: ${(this.config.maxFileSize / 1024 / 1024).toFixed(2)} MB`);
          console.log(`  Auth Enabled:  ${this.config.enableAuth ? 'Yes' : 'No'}`);
          console.log('');
          console.log('  Press Ctrl+C to stop the server');
          console.log('');

          resolve();
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Stop the server
   */
  public stop(): void {
    // Cleanup: remove old files
    this.jobManager.cleanup();
    console.log('\nFlexDoc API Server stopped.');
  }

  /**
   * Get the Express app instance
   */
  public getApp(): Express {
    return this.app;
  }
}

// Export a convenience function to create and start server
export async function startServer(config?: ServerConfig): Promise<FlexDocServer> {
  const server = new FlexDocServer(config);
  await server.start();
  return server;
}

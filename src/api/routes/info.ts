/**
 * Info Routes - Provide information about the API
 */

import { Router, Request, Response } from 'express';
import { ThemeManager } from '../../themes';

const packageJson = require('../../../package.json');

export function infoRoutes(): Router {
  const router = Router();

  /**
   * GET /api/version
   * Get API version
   */
  router.get('/version', (req: Request, res: Response) => {
    res.json({
      success: true,
      version: packageJson.version,
      name: packageJson.name,
      description: packageJson.description
    });
  });

  /**
   * GET /api/formats
   * Get supported formats
   */
  router.get('/formats', (req: Request, res: Response) => {
    res.json({
      success: true,
      formats: [
        {
          format: 'pdf',
          name: 'PDF',
          description: 'Portable Document Format',
          mimeType: 'application/pdf',
          endpoint: '/api/convert/pdf'
        },
        {
          format: 'pptx',
          name: 'PowerPoint',
          description: 'Microsoft PowerPoint Presentation',
          mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          endpoint: '/api/convert/pptx'
        },
        {
          format: 'docx',
          name: 'Word',
          description: 'Microsoft Word Document',
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          endpoint: '/api/convert/docx'
        }
      ]
    });
  });

  /**
   * GET /api/themes
   * Get available themes
   */
  router.get('/themes', (req: Request, res: Response) => {
    try {
      const presets = ThemeManager.listPresets();

      // Group by category
      const grouped: Record<string, typeof presets> = {};
      presets.forEach(preset => {
        if (!grouped[preset.category]) {
          grouped[preset.category] = [];
        }
        grouped[preset.category].push(preset);
      });

      res.json({
        success: true,
        total: presets.length,
        categories: Object.keys(grouped),
        themes: grouped,
        allThemes: presets
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  /**
   * GET /api/stats
   * Get API statistics
   */
  router.get('/stats', (req: Request, res: Response) => {
    res.json({
      success: true,
      stats: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        platform: process.platform,
        nodeVersion: process.version
      }
    });
  });

  return router;
}

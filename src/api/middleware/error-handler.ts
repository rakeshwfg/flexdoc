/**
 * Global Error Handler Middleware
 */

import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Error:', error);

  // Handle multer file size error
  if (error.message.includes('File too large')) {
    res.status(413).json({
      success: false,
      error: 'File too large. Maximum file size exceeded.'
    });
    return;
  }

  // Handle JSON parse error
  if (error instanceof SyntaxError && 'body' in error) {
    res.status(400).json({
      success: false,
      error: 'Invalid JSON in request body'
    });
    return;
  }

  // Default error response
  res.status(500).json({
    success: false,
    error: error.message || 'Internal server error'
  });
}

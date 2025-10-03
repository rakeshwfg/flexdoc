/**
 * OpenAPI/Swagger Documentation
 */

export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'FlexDoc API',
    version: '1.5.0',
    description: 'REST API for converting HTML to PDF, PPTX, and DOCX formats with professional themes',
    contact: {
      name: 'FlexDoc',
      url: 'https://github.com/yourusername/flexdoc'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server'
    }
  ],
  tags: [
    { name: 'Conversion', description: 'Document conversion endpoints' },
    { name: 'Jobs', description: 'Job management endpoints' },
    { name: 'Info', description: 'API information endpoints' }
  ],
  paths: {
    '/health': {
      get: {
        summary: 'Health check',
        description: 'Check if the API is running',
        responses: {
          '200': {
            description: 'API is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'healthy' },
                    timestamp: { type: 'string', format: 'date-time' },
                    uptime: { type: 'number' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/convert/pdf': {
      post: {
        tags: ['Conversion'],
        summary: 'Convert HTML to PDF',
        description: 'Convert HTML content to PDF format',
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  file: {
                    type: 'string',
                    format: 'binary',
                    description: 'HTML file to convert'
                  },
                  html: {
                    type: 'string',
                    description: 'HTML content as string'
                  },
                  options: {
                    type: 'string',
                    description: 'JSON string of conversion options',
                    example: '{"format":"A4","landscape":false}'
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Conversion started successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    jobId: { type: 'string', format: 'uuid' },
                    status: { type: 'string', example: 'pending' },
                    message: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/convert/pptx': {
      post: {
        tags: ['Conversion'],
        summary: 'Convert HTML to PPTX',
        description: 'Convert HTML content to PowerPoint format',
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  file: {
                    type: 'string',
                    format: 'binary'
                  },
                  html: {
                    type: 'string'
                  },
                  options: {
                    type: 'string',
                    example: '{"theme":"corporate-blue","layout":"16x9"}'
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Conversion started successfully'
          }
        }
      }
    },
    '/api/convert/docx': {
      post: {
        tags: ['Conversion'],
        summary: 'Convert HTML to DOCX',
        description: 'Convert HTML content to Word document format',
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  file: {
                    type: 'string',
                    format: 'binary'
                  },
                  html: {
                    type: 'string'
                  },
                  options: {
                    type: 'string',
                    example: '{"theme":"professional-gray","orientation":"portrait"}'
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Conversion started successfully'
          }
        }
      }
    },
    '/api/jobs': {
      get: {
        tags: ['Jobs'],
        summary: 'List all jobs',
        description: 'Get a list of all conversion jobs',
        responses: {
          '200': {
            description: 'Jobs retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    total: { type: 'number' },
                    jobs: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          status: { type: 'string', enum: ['pending', 'processing', 'completed', 'failed'] },
                          format: { type: 'string', enum: ['pdf', 'pptx', 'docx'] },
                          createdAt: { type: 'string', format: 'date-time' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/jobs/{id}': {
      get: {
        tags: ['Jobs'],
        summary: 'Get job status',
        description: 'Get the status of a specific conversion job',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Job found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    job: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        status: { type: 'string' },
                        format: { type: 'string' },
                        createdAt: { type: 'string' },
                        completedAt: { type: 'string' },
                        fileSize: { type: 'number' },
                        downloadUrl: { type: 'string' }
                      }
                    }
                  }
                }
              }
            }
          },
          '404': {
            description: 'Job not found'
          }
        }
      },
      delete: {
        tags: ['Jobs'],
        summary: 'Delete a job',
        description: 'Delete a conversion job and its output file',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid'
            }
          }
        ],
        responses: {
          '200': {
            description: 'Job deleted successfully'
          },
          '404': {
            description: 'Job not found'
          }
        }
      }
    },
    '/api/jobs/{id}/download': {
      get: {
        tags: ['Jobs'],
        summary: 'Download converted file',
        description: 'Download the converted document for a completed job',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid'
            }
          }
        ],
        responses: {
          '200': {
            description: 'File download',
            content: {
              'application/pdf': {},
              'application/vnd.openxmlformats-officedocument.presentationml.presentation': {},
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {}
            }
          },
          '404': {
            description: 'Job or file not found'
          }
        }
      }
    },
    '/api/themes': {
      get: {
        tags: ['Info'],
        summary: 'Get available themes',
        description: 'Get list of all available themes for PPTX and DOCX',
        responses: {
          '200': {
            description: 'Themes retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    total: { type: 'number' },
                    categories: {
                      type: 'array',
                      items: { type: 'string' }
                    },
                    themes: { type: 'object' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/version': {
      get: {
        tags: ['Info'],
        summary: 'Get API version',
        description: 'Get the current API version',
        responses: {
          '200': {
            description: 'Version retrieved successfully'
          }
        }
      }
    },
    '/api/formats': {
      get: {
        tags: ['Info'],
        summary: 'Get supported formats',
        description: 'Get list of all supported output formats',
        responses: {
          '200': {
            description: 'Formats retrieved successfully'
          }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
        description: 'API key for authentication (if enabled)'
      }
    }
  }
};

/**
 * Test setup file
 */

// Increase timeout for integration tests
jest.setTimeout(30000);

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

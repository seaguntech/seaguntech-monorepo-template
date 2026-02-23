import { createHttpLogger, createLogger } from '../src';
import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('logger', () => {
  it('creates a pino logger instance', () => {
    const log = createLogger({ name: 'test' });
    expect(typeof log.info).toBe('function');
  });

  it('creates a pino-http logger', () => {
    const httpLogger = createHttpLogger();
    expect(typeof httpLogger).toBe('function');
  });

  it('creates logger in production without pretty transport', () => {
    vi.stubEnv('NODE_ENV', 'production');

    const log = createLogger();

    expect(typeof log.info).toBe('function');
  });
});

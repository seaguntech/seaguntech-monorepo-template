import type { UserConfig } from 'vitest/config';

export const COVERAGE_THRESHOLDS = {
  lines: 80,
  functions: 80,
  branches: 80,
  statements: 80,
};

export const baseConfig: UserConfig = {
  test: {
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      all: true,
      thresholds: COVERAGE_THRESHOLDS,
    },
  },
};

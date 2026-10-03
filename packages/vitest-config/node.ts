import { baseConfig } from './index.ts';
import { defineConfig, mergeConfig } from 'vitest/config';

export const nodeConfig = defineConfig(
  mergeConfig(baseConfig, {
    test: {
      environment: 'node',
    },
  }),
);

import { reactConfig } from '@seaguntech/vitest-config/react';
import { defineConfig, mergeConfig } from 'vitest/config';

export default mergeConfig(
  reactConfig,
  defineConfig({
    test: {
      include: ['tests/**/*.{test,spec}.{ts,tsx}'],
      coverage: {
        all: false,
      },
    },
  }),
);

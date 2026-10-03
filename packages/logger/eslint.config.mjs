import { config } from '@seaguntech/eslint-config/base';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  ...config,
  {
    ignores: ['dist/**', 'coverage/**'],
  },
]);

import { config as reactConfig } from './react-internal-library.js';
import storybook from 'eslint-plugin-storybook';

/**
 * A custom ESLint configuration for Storybook projects.
 *
 * @type {import("eslint").Linter.Config[]} */
export const storybookConfig = [
  ...reactConfig,
  ...storybook.configs['flat/recommended'],
  {
    files: ['**/*.stories.@(ts|tsx|js|jsx|mjs|cjs)'],
    rules: {
      // Allow default exports in stories
      'import/no-default-export': 'off',
      // Stories can have any structure
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },
  {
    files: ['**/*.mdx'],
    rules: {
      // MDX files have different requirements
      'react/jsx-no-undef': 'off',
    },
  },
  {
    ignores: ['dist/**', 'storybook-static/**'],
  },
];

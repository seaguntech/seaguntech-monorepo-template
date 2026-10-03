import { config as baseConfig } from './base.js';
import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactNative from 'eslint-plugin-react-native';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/**
 * A custom ESLint configuration for React Native mobile applications.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const config = [
  ...baseConfig,
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.es2024,
        // React Native globals
        __DEV__: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        Alert: 'readonly',
        AnimationFrame: 'readonly',
        Blob: 'readonly',
        console: 'readonly',
        fetch: 'readonly',
        File: 'readonly',
        FileReader: 'readonly',
        FormData: 'readonly',
        global: 'readonly',
        Headers: 'readonly',
        Intl: 'readonly',
        navigator: 'readonly',
        process: 'readonly',
        Promise: 'readonly',
        Request: 'readonly',
        Response: 'readonly',
        setImmediate: 'readonly',
        setInterval: 'readonly',
        setTimeout: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        WebSocket: 'readonly',
        XMLHttpRequest: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  },
  {
    plugins: {
      'react-hooks': pluginReactHooks,
      'react-native': pluginReactNative,
    },
    settings: {
      react: { version: 'detect' },
      'react-native/style-sheet-object-names': ['StyleSheet', 'styles'],
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      ...pluginReactNative.configs.all.rules,

      // React rules for React Native
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off', // TypeScript handles this
      'react/jsx-filename-extension': [
        'warn',
        { extensions: ['.tsx', '.jsx'] },
      ],
      'react/display-name': 'off',
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',

      // React Native specific rules
      'react-native/no-unused-styles': 'error',
      'react-native/split-platform-components': 'error',
      'react-native/no-inline-styles': 'warn',
      'react-native/no-color-literals': 'warn',
      'react-native/no-raw-text': 'off', // Too restrictive for many use cases
      'react-native/sort-styles': ['error', 'asc'],

      // Performance optimizations
      'react-hooks/exhaustive-deps': 'warn',
      'react/jsx-no-useless-fragment': 'warn',
      'react/self-closing-comp': 'warn',

      // TypeScript rules for React Native
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    files: ['**/*.test.{js,ts,jsx,tsx}', '**/*.spec.{js,ts,jsx,tsx}'],
    rules: {
      // Relax some rules for test files
      '@typescript-eslint/no-explicit-any': 'off',
      'react-native/no-inline-styles': 'off',
    },
  },
  {
    files: ['**/*.stories.{js,ts,jsx,tsx}'],
    rules: {
      // Relax some rules for Storybook files
      'react-native/no-inline-styles': 'off',
      'react-native/no-color-literals': 'off',
    },
  },
];

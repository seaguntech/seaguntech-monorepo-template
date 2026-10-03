# Architecture

## Overview

This Seaguntech monorepo template provides:

- A Next.js web app (App Router)
- A Storybook app for UI development
- Shared UI, logger, utility, and design system packages
- Shared tooling configs for ESLint, Prettier, TS, and Vitest

## Design goals

- Fast local development with Turborepo
- Consistent linting/formatting across packages
- CSS-first Tailwind v4 design system
- Reusable packages ready for publishing

## Apps

- `apps/web`: Next.js app using shared UI + utils
- `apps/storybook`: Storybook app for UI exploration

## Packages

- `packages/ui`: shadcn-style UI components with cva
- `packages/utils`: small utilities + runtime helpers
- `packages/logger`: pino-based logging helpers
- `packages/design-system`: Tailwind v4 tokens, themes, and globals

## Tooling

- ESLint 9 flat config in `packages/eslint-config`
- Prettier config in `packages/prettier-config`
- TS config in `packages/typescript-config`
- Vitest config in `packages/vitest-config`
- Design system tokens/themes in `packages/design-system`

## Build pipeline

- Turborepo orchestrates build/test/lint
- Packages build via `tsup`
- Apps build via Next.js / Vite

## Design system

- Tokens defined in `@theme` (`design-tokens.css`)
- Themes override semantic tokens (`theme-light.css`, `theme-dark.css`)
- Base styles and utilities in `globals.css`

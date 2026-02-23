# Agents Guide

This repository is a Turborepo + pnpm workspace monorepo. Use this file as
the single reference for commands and style expectations when working here.

## Quick Environment

- Node.js >= 20
- pnpm 10.25.0
- Package manager: pnpm (workspaces)
- Task runner: Turborepo

## Repo Layout

- `apps/web` - Next.js app
- `apps/storybook` - Storybook (React + Vite)
- `packages/ui` - shared UI components
- `packages/utils` - shared utilities
- `packages/logger` - logging utilities
- `configs/` - shared ESLint / Prettier / TS / Vitest configs

## Build / Lint / Test Commands

Top-level (runs via Turborepo):

- `pnpm dev` - watch all dev tasks
- `pnpm dev:web` - Next.js app only
- `pnpm dev:storybook` - Storybook only
- `pnpm build` - build all packages/apps
- `pnpm build:apps` - build apps only
- `pnpm build:packages` - build packages only
- `pnpm build:storybook` - build Storybook bundle
- `pnpm lint` - lint all workspaces
- `pnpm lint:fix` - lint and auto-fix
- `pnpm format` - Prettier check
- `pnpm format:fix` - Prettier write
- `pnpm check-types` - TypeScript typecheck across repo
- `pnpm test` - run all tests
- `pnpm test:watch` - watch tests (all)
- `pnpm test:coverage` - coverage for all tests
- `pnpm clean` - remove build output + node_modules

Package-level (run inside a workspace or use pnpm filters):

- `pnpm --filter @seaguntech/utils test`
- `pnpm --filter @seaguntech/logger test`
- `pnpm --filter @seaguntech/ui test`

Turbo filters (handy for lint/build/test per package):

- `pnpm test -- --filter @seaguntech/utils`
- `pnpm lint -- --filter @seaguntech/ui`
- `pnpm build -- --filter @seaguntech/web`

### Run a Single Test

Tests live in `packages/*/tests`. Each package uses Vitest.

- Single file:
  - `pnpm --filter @seaguntech/utils test -- tests/formatDate.test.ts`
  - `pnpm --filter @seaguntech/ui test -- tests/utils.test.ts`
- Single test name:
  - `pnpm --filter @seaguntech/utils test -- -t "formatDate"`

### Storybook

- `pnpm dev:storybook` (turborepo wrapper)
- Or run locally in app: `pnpm --filter @seaguntech/storybook dev`

## Code Style Guidelines

### Formatting (Prettier)

Configured via `@seaguntech/prettier-config/base`.

- Indentation: 2 spaces
- Semicolons: required
- Quotes: single quotes
- Trailing commas: all
- Print width: 80
- Line endings: LF
- Imports are sorted via `@trivago/prettier-plugin-sort-imports`
  - import groups separated
  - specifiers sorted

### Linting (ESLint)

Base config is `@seaguntech/eslint-config/base` (ESLint 9 flat config).

- JS + TS recommended rules enabled
- Prettier conflicts disabled
- Turbo env var rule: `turbo/no-undeclared-env-vars` (warn)
- `eslint-plugin-only-warn` is enabled (rules default to warnings)
- Standard ignores include `dist`, `build`, `.turbo`, `.next`, `out`

React/Next/Storybook packages extend additional rules:

- React: hooks rules enabled, `react/react-in-jsx-scope` off
- Next: `@next/next` recommended + core-web-vitals
- Storybook: `eslint-plugin-storybook` recommended
- Storybook stories allow default exports and flexible return types

### TypeScript

Shared config: `@seaguntech/typescript-config/base.json`.

- `strict: true`
- `noUncheckedIndexedAccess: true`
- `isolatedModules: true`
- `module: NodeNext`, `moduleResolution: NodeNext`
- `target: ES2022`
- Declarations + source maps enabled for packages

### Imports

- Prefer type-only imports using `import type { ... }`.
- Keep imports sorted; let Prettier handle order.
- Use path aliases where configured (see package `tsconfig.json`).

### Naming Conventions

- React components: `PascalCase` (e.g., `Button`)
- Hooks: `useSomething`
- Functions/variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE` when truly constant
- Files/folders: follow existing structure (lowercase folders in `packages/ui`)

### Exports

- Packages generally use named exports.
- Default exports are used where required by frameworks (e.g., Next.js pages).

### Error Handling

- Prefer explicit errors over silent failures.
- Utility helpers available:
  - `invariant(condition, message)` for runtime assertions
  - `assertNever(value)` for exhaustive checks
- For logging, use `@seaguntech/logger` where appropriate.

### React / UI Patterns

- Follow `shadcn/ui` patterns for UI primitives in `packages/ui`.
- Prefer Radix primitives (e.g. label, slot) when a matching primitive exists.
- Use `class-variance-authority` and `cn` helper for class composition.
- Tailwind is the preferred styling approach in UI packages and apps.
- For ref handling, follow the existing component pattern in the package (React 19 ref-as-prop is acceptable for new primitives).

### Testing

- Tests are colocated in `packages/*/tests`.
- Vitest is the test runner; configs come from `@seaguntech/vitest-config`.
- Coverage defaults to 80% across lines/branches/functions/statements.

## Changesets / Releases

This repo uses Changesets for versioning:

- `pnpm changeset`
- `pnpm version-packages`
- `pnpm release`

## Cursor / Copilot Rules

- No Cursor rules found in `.cursor/rules/` or `.cursorrules`.
- No Copilot instructions found in `.github/copilot-instructions.md`.

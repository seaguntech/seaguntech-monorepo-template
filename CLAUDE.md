# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo Architecture

This is a **Turborepo + pnpm workspace** monorepo with the following structure:

- **apps/** - Applications (Next.js, Storybook)
- **packages/** - Shared libraries (ui, logger, utils, design system)
- **packages/{eslint,prettier,typescript,vitest}-config/** - Shared configurations (eslint, prettier, typescript, vitest)

### Key Dependencies

- **Turborepo**: Task orchestration with caching and parallel execution
- **pnpm workspaces**: Package management with catalog feature for centralized version control
- **Changesets**: Package versioning and release management

### Workspace Naming Convention

Internal packages use the `@seaguntech/*` prefix:

- `@seaguntech/web` - Next.js app
- `@seaguntech/storybook` - Storybook app
- `@seaguntech/ui` - UI components (shadcn/ui based)
- `@seaguntech/logger` - Logging utilities (pino)
- `@seaguntech/utils` - Shared utilities
- `@seaguntech/eslint-config` - ESLint configurations
- `@seaguntech/prettier-config` - Prettier configurations
- `@seaguntech/typescript-config` - TypeScript configurations
- `@seaguntech/design-system` - Tailwind v4 design system
- `@seaguntech/vitest-config` - Vitest configurations

## Common Commands

### Development

```bash
# Run all apps in development mode
pnpm dev

# Run specific app
pnpm dev:web          # Next.js app only
pnpm dev:storybook    # Storybook only
```

### Building

```bash
# Build everything (packages → apps)
pnpm build

# Build only apps
pnpm build:apps

# Build only packages
pnpm build:packages

# Build Storybook
pnpm build:storybook
```

### Testing

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:coverage
```

### Linting & Formatting

```bash
# Lint all packages
pnpm lint
pnpm lint:fix

# Format all packages
pnpm format
pnpm format:fix

# Type checking
pnpm check-types
```

### Package Management

```bash
# Install dependencies
pnpm install

# Clean all build artifacts and node_modules
pnpm clean
```

### Releases (Changesets)

```bash
# Create a changeset (document changes)
pnpm changeset

# Update package versions based on changesets
pnpm version-packages

# Build and publish packages
pnpm release
```

## Turborepo Task Dependencies

Understanding task execution order is critical:

1. **build** - Depends on `^build` (builds dependencies first)
2. **dev** - Depends on `^dev` (starts dependencies first)
3. **test** - Depends on `^build` (packages must be built before testing)
4. **check-types** - Depends on `^build` (requires built packages)
5. **storybook:dev** - Depends on `^build` (requires built UI packages)

The `^` prefix means "run this task on all dependencies first".

## Working with Specific Packages

### Run commands for a single package

```bash
# Use Turbo's --filter flag
turbo run build --filter @seaguntech/ui
turbo run test --filter @seaguntech/logger
turbo run lint --filter @seaguntech/web
```

### Add dependencies to a package

```bash
# Add to specific workspace
pnpm add <package> --filter @seaguntech/ui

# Add dev dependency
pnpm add -D <package> --filter @seaguntech/web

# Use catalog version (centralized in pnpm-workspace.yaml)
# Edit pnpm-workspace.yaml catalog section, then use "catalog:" in package.json
```

## Configuration Packages

Shared configs in `packages/` are consumed by apps and packages:

- **eslint-config**: Provides base, next, react, react-native, and storybook configs
- **prettier-config**: Provides base and react-native configs
- **typescript-config**: Provides base, nextjs-library, react-library, react-native-library configs
- **vitest-config**: Provides base, node, and react test configurations

Design system package lives in `packages/design-system` and provides Tailwind v4
tokens, themes, globals, and PostCSS config.

Apps and packages import these via workspace protocol:

```json
{
  "devDependencies": {
    "@seaguntech/eslint-config": "workspace:*"
  }
}
```

## Git Hooks

The repository uses Husky for git hooks:

- **pre-commit**: Runs `lint-staged` (prettier + eslint on staged files)
- **commit-msg**: Validates commit messages with commitlint (conventional commits format)

## Environment Variables

Turborepo is configured to use these environment variables:

- `NODE_ENV` - Environment (development/production)
- `LOG_LEVEL` - Logging level for logger package
- `CI` - Passes through in CI environments

## Testing Architecture

- **Test framework**: Vitest
- **React testing**: @testing-library/react
- **Coverage**: @vitest/coverage-v8
- **UI**: @vitest/ui for interactive test viewer

Each package with tests has its own `vitest.config.ts` extending `@seaguntech/vitest-config`.

## UI Package Architecture

The `packages/ui` package uses:

- **shadcn/ui** component system
- **Tailwind CSS 4.x** for styling
- **class-variance-authority** for component variants
- **Radix UI** primitives
- **Storybook** for component documentation

Components are built with `tsup` and exported from `src/index.ts`.

## Logger Package

Uses **pino** for structured logging:

- `src/core.ts` - Core logger configuration
- `src/http.ts` - HTTP request logging (pino-http)

## Catalog Feature

This monorepo uses pnpm's **catalog** feature for centralized dependency version management. All shared dependency versions are defined in `pnpm-workspace.yaml` under the `catalog:` and `catalogs:` sections. Reference versions in package.json with `"catalog:"` syntax.

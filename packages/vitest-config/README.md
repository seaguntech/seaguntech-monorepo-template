# @seaguntech/vitest-config

<div align="center">

Shared Vitest configurations for the monorepo. Standardizes testing environment, coverage thresholds, and React ecosystem stability.

[![Vitest](https://img.shields.io/badge/Vitest-3.x-6E9F18)](https://vitest.dev/)

</div>

---

## 📋 Overview

This package provides a unified testing configuration system for the entire monorepo. It handles the complexities of modern testing environments, specifically focusing on path resolution, React 19 instance deduplication, and consistent code coverage reporting.

## 📦 Installation

Add the dependency to your package:

```json
{
  "devDependencies": {
    "@seaguntech/vitest-config": "workspace:*"
  }
}
```

## 🛠 Available Configurations

### `@seaguntech/vitest-config/base`

The foundational configuration for any TypeScript project.

- **Features:**
  - `globals: true` enabled by default.
  - V8 coverage provider with 80% thresholds.
  - Multi-reporter output (`text`, `json`, `html`, `lcov`).

### `@seaguntech/vitest-config/react`

Extended configuration for React-based applications and libraries.

- **Features:**
  - `jsdom` environment.
  - Integrated `@vitejs/plugin-react` and `vite-tsconfig-paths`.
  - Helpers for React instance deduplication (crucial for React 19).

### `@seaguntech/vitest-config/node`

Tailored for backend utilities and CLI tools.

- **Features:**
  - `node` environment.
  - Optimized for performance without DOM overhead.

## 💻 Usage

### For React Libraries (UI, Components)

In `vitest.config.ts`:

```typescript
import { getReactAliases, reactConfig } from '@seaguntech/vitest-config/react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, mergeConfig } from 'vitest/config';

const rootDir = path.resolve(
  fileURLToPath(new URL('.', import.meta.url)),
  '../..',
);

export default mergeConfig(
  reactConfig,
  defineConfig({
    resolve: {
      alias: getReactAliases(rootDir),
    },
    test: {
      setupFiles: ['./tests/vitest.setup.ts'],
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
    },
  }),
);
```

### For Node Utilities

In `vitest.config.ts`:

```typescript
import { nodeConfig } from '@seaguntech/vitest-config/node';
import { defineConfig, mergeConfig } from 'vitest/config';

export default mergeConfig(
  nodeConfig,
  defineConfig({
    test: {
      include: ['src/**/*.test.ts'],
    },
  }),
);
```

## ⚙️ Configuration Details

### Global Coverage Thresholds

We enforce a strict 80% coverage policy by default:

- `lines: 80`
- `functions: 80`
- `branches: 80`
- `statements: 80`

You can override these in your local config if a legacy package requires it.

## 🤝 Contributing

To modify testing standards:

1. Update logic in `src/`.
2. Ensure you don't break existing package tests.
3. Update this README if new features are added.

---

<div align="center">
Part of the Seaguntech monorepo
</div>

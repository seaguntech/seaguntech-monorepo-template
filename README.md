<img width="2048" height="512" alt="background-readme-web" src="https://github.com/user-attachments/assets/bf92b234-1164-4b93-9e30-f5aab1fd66ed" />

# Seaguntech Monorepo Template

Seaguntech Turborepo + pnpm workspace template for product teams and OSS.

## Why this monorepo

- Next.js web app + Storybook
- Shared UI, utilities, and logger packages
- Tailwind CSS v4 (CSS-first) design system
- Centralized ESLint, Prettier, TypeScript, Vitest configs
- Changesets release workflow

## Requirements

- Node.js >= 20
- pnpm 10.25.0

## Quick Start

```bash
pnpm install
pnpm dev
```

### Run specific apps

```bash
pnpm dev:web
pnpm dev:storybook
```

## Customize this template

After cloning:

1. Update repo name and package scope in `package.json` files.
2. Replace `@seaguntech/*` with your org scope if needed.
3. Update `SECURITY.md` and `CODE_OF_CONDUCT.md` contact emails.
4. Update `README.md` branding and add project-specific details.

## Workspace layout

- `apps/web` - Next.js app (App Router)
- `apps/storybook` - Storybook (React + Vite)
- `packages/ui` - shared UI components
- `packages/utils` - shared utilities
- `packages/logger` - logging utilities
- `packages/design-system` - Tailwind v4 design system
- `configs/` - shared ESLint / Prettier / TS / Vitest configs
- `docs/` - project documentation

## Common scripts

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
- `pnpm check-types` - typecheck across repo
- `pnpm test` - run all tests
- `pnpm test:watch` - watch tests
- `pnpm test:coverage` - coverage for all tests
- `pnpm clean` - remove build output + node_modules

### Run a single test

```bash
pnpm --filter @seaguntech/utils test -- tests/formatDate.test.ts
pnpm --filter @seaguntech/utils test -- -t "formatDate"
```

## Design system (Tailwind v4)

The design system is CSS-first. Import globals once per app/library:

```css
@import '@seaguntech/design-system';
```

Tokens live in `packages/design-system/design-tokens.css` via `@theme`. Themes
override semantic tokens in `theme-light.css` and `theme-dark.css`.

## Releases

Changesets is configured for package versioning.

```bash
pnpm changeset
pnpm version-packages
pnpm release
```

## Docs

- `docs/GETTING_STARTED.md`
- `docs/DEVELOPMENT.md`
- `docs/ARCHITECTURE.md`
- `docs/RELEASE.md`

## Contributing & Security

- See `CONTRIBUTING.md` for workflow and standards.
- See `SECURITY.md` for vulnerability reporting.

## License

MIT

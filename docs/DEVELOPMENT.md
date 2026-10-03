# Development

## Environment

- Node.js >= 20
- pnpm 10.25.0

## Install

```bash
pnpm install
```

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

## Workspace structure

- `apps/` - application packages
- `packages/` - shared libraries
- `packages/{eslint,prettier,typescript,vitest}-config/` - shared tooling configs

## Target a single package

Use pnpm filters or Turbo filters:

```bash
pnpm --filter @seaguntech/utils test
pnpm lint -- --filter @seaguntech/ui
pnpm build -- --filter @seaguntech/web
```

## Run a single test

```bash
pnpm --filter @seaguntech/utils test -- tests/formatDate.test.ts
pnpm --filter @seaguntech/utils test -- -t "formatDate"
```

## Formatting & linting

- Prettier: `pnpm format` / `pnpm format:fix`
- ESLint: `pnpm lint` / `pnpm lint:fix`

## Git hooks

- Husky runs lint-staged on commit.
- Lint-staged formats JS/TS and JSON/MD/YAML.

## Troubleshooting

- Clear cache: `pnpm clean`
- Typecheck: `pnpm check-types`

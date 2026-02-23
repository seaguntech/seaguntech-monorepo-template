# Getting Started

## Requirements

- Node.js >= 20
- pnpm 10.25.0

## Install

```bash
pnpm install
pnpm init:template
```

## Develop

```bash
pnpm dev
```

Run specific apps:

```bash
pnpm dev:web
pnpm dev:storybook
```

## Template setup

If you are using this repository as a template, run:

```bash
pnpm init:template
```

Useful flags:

- `pnpm init:template:dry-run` to preview changes.
- `pnpm init:template -- --yes --scope myorg --project-name my-monorepo --owner myorg --repo my-monorepo --email oss@myorg.com` for non-interactive setup.
- `pnpm init:template -- --force` to run setup again after initialization.

After setup, verify:

```bash
pnpm lint && pnpm check-types && pnpm build
```

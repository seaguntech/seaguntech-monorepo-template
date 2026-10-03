# Move Shared Config Packages Under `packages/` Design

## Status

Approved design. This document defines the repository-layout migration before implementation planning.

## Goal

Move the four shared configuration workspaces from `configs/*` into `packages/*` while preserving their package names, public import paths, behavior, and workspace consumers, then qualify the template with all available quality checks.

## Scope

In scope:

- Move `configs/eslint-config` to `packages/eslint-config`.
- Move `configs/prettier-config` to `packages/prettier-config`.
- Move `configs/typescript-config` to `packages/typescript-config`.
- Move `configs/vitest-config` to `packages/vitest-config`.
- Change pnpm workspace discovery so `packages/*` owns these workspaces and `configs/*` is no longer a workspace root.
- Preserve package names and consumer-facing paths such as `@seaguntech/eslint-config/base` and `@seaguntech/typescript-config/base.json`.
- Update repository documentation and references that describe the old `configs/` layout.
- Regenerate the lockfile as required by the workspace relocation.
- Run and record format, lint, typecheck, test, and build checks.

Out of scope:

- Changing config rules, exports, package versions, or dependency policy unless required to make the relocation work.
- Consolidating the four packages into one package.
- Product/application behavior changes.
- Deployment or publishing.

## Architecture

The repository will have one canonical workspace root for reusable packages: `packages/*`. Configuration packages remain independently addressable workspace packages with their existing package names and export subpaths. Consumers continue importing the same package names; only the physical source directories and workspace glob change.

The old `configs/` directory will not remain as a second source of truth. After migration, references to `configs/` in repository guidance are either removed or updated to the corresponding `packages/<config-name>` path. Any generated lockfile entries must resolve to the new workspace locations without duplicate package identities.

## Compatibility and Invariants

- `pnpm-workspace.yaml` includes `packages/*` and no longer includes `configs/*`.
- The four package names remain exactly:
  - `@seaguntech/eslint-config`
  - `@seaguntech/prettier-config`
  - `@seaguntech/typescript-config`
  - `@seaguntech/vitest-config`
- Existing consumer specifiers and export paths remain valid.
- No config rule or runtime behavior changes are intentional.
- The root package continues to resolve its formatter, linter, TypeScript, and Vitest configuration through workspace packages.
- Existing unrelated working-tree changes are preserved.

## Quality Gates

The migration is complete only when each applicable gate is run from the repository root and its result is recorded:

1. `pnpm format`
2. `pnpm lint`
3. `pnpm check-types`
4. `pnpm test`
5. `pnpm build`

If a gate cannot run because of environment, dependency, or sandbox limitations, the plan must record the exact command, failure, and whether it is an implementation failure or an external blocker. No gate is considered passed from static inspection alone.

## Documentation Updates

Update the repository documents that currently describe `configs/` as the shared-config location, including `AGENTS.md`, `CLAUDE.md`, `README.md`, and each moved config package README. References embedded in examples must continue to show the unchanged `@seaguntech/*` package names while filesystem paths point to `packages/`.

## Validation Strategy

Before and after the move, inspect all references to `configs/` and all workspace package manifests. After relocation, verify that pnpm recognizes exactly the expected workspace packages, that imports resolve through the existing package names, and that the complete quality-gate suite passes.

## Risks and Mitigations

- **Workspace discovery drift:** verify `pnpm-workspace.yaml`, `pnpm-lock.yaml`, and `pnpm list --depth -1` after the move.
- **Documentation path drift:** search the full tracked repository for `configs/` and review every remaining match.
- **Broken package export resolution:** run typecheck, tests, and builds that consume each config package.
- **Accidental behavior changes during move:** use a move-only change, compare package contents, and avoid rule/dependency edits.

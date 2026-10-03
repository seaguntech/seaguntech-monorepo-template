# Plan 02: Toolchain and Dependency Modernization

Status: Proposed  
Priority: P0/P1  
Dependencies: Plans 00-01

## Objective

Move the repository to supported, internally consistent dependency families
without performing an unsafe all-at-once upgrade.

## Upgrade waves

### Wave A: Runtime and package manager

- [ ] Pin the approved Node LTS in `.nvmrc`, CI, docs, and package engines.
- [ ] Pin pnpm and document Corepack usage.
- [ ] Define and commit the pnpm dependency-build-script allowlist.
- [ ] Prove fresh install on the supported runtime matrix.

### Wave B: Next.js and React

- [ ] Align Next.js and `@next/eslint-plugin-next` to the same supported family.
- [ ] Align React, React DOM, and their type packages.
- [ ] Review App Router, image, font, metadata, and CSP behavior.
- [ ] Run React Doctor after the upgrade.

### Wave C: Storybook

- [ ] Upgrade all Storybook core, renderer, addon, block, and ESLint packages
      together.
- [ ] Run official automigrations and manually review every produced diff.
- [ ] Remove deprecated configuration and unused addons.
- [ ] Preserve story rendering and theme behavior.

### Wave D: Vite and Vitest

- [ ] Select versions from the Storybook compatibility matrix.
- [ ] Align Vite, plugin-react, Vitest, coverage, UI, jsdom, and path plugins.
- [ ] Verify shared Vitest config remains importable from every workspace.

### Wave E: ESLint and formatting

- [ ] Upgrade ESLint only after all plugins declare compatibility.
- [ ] Align `@eslint/js`, typescript-eslint, React, hooks, Storybook, Next, and
      Turbo plugins.
- [ ] Decide whether to remove `eslint-plugin-only-warn`.
- [ ] Verify Prettier and import sorting across all workspaces.

### Wave F: UI and runtime libraries

- [ ] Upgrade Tailwind and its PostCSS integration together.
- [ ] Upgrade Radix, Tailwind Merge, Lucide, Pino, and Pino HTTP independently.
- [ ] Review whether `pino-pretty` belongs in production dependencies.

## PR rules

- One ecosystem per PR.
- Each PR records old/new versions, breaking changes, migration actions, tests,
  and rollback command.
- No opportunistic component redesign during dependency upgrades.
- Use exact compatibility evidence rather than latest-version assumptions.

## Acceptance criteria

- No mixed Storybook major versions.
- Next.js and its ESLint plugin are aligned.
- Vite, Vitest, and Storybook have a documented compatibility set.
- Fresh install produces no unexplained engine or ignored-build warnings.
- Remaining outdated packages are intentional and documented.
- All baseline gates pass after each wave.

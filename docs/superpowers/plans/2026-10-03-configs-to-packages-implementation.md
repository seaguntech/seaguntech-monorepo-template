# Move Shared Config Packages Under `packages/` Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Relocate the four shared configuration workspaces from `configs/*` to `packages/*` without changing package names, exports, or behavior, then qualify the template with its complete quality-check suite.

**Architecture:** Treat each configuration as an independent workspace package under `packages/`. Keep all `@seaguntech/*` package names and consumer specifiers unchanged; only filesystem locations, workspace discovery, documentation paths, and generated lockfile metadata change. Validate the package graph before running the full quality gates.

**Tech Stack:** pnpm 10 workspace, Turborepo, ESLint 9, Prettier 3, TypeScript 5.9, Vitest 3, Node.js >=20.

**Spec:** `docs/superpowers/specs/2026-10-03-configs-to-packages-design.md`

## Global Constraints

- Preserve the exact package names `@seaguntech/eslint-config`, `@seaguntech/prettier-config`, `@seaguntech/typescript-config`, and `@seaguntech/vitest-config`.
- Preserve existing consumer-facing subpaths such as `@seaguntech/eslint-config/base` and `@seaguntech/typescript-config/base.json`.
- `pnpm-workspace.yaml` must include `packages/*` and must not include `configs/*`.
- Do not change config rules, exports, versions, or dependency policy unless required for relocation.
- Preserve unrelated pre-existing modifications in `pnpm-lock.yaml` and `pnpm-workspace.yaml`.
- Do not leave duplicate config package sources under `configs/`.

## Review Focus

- Workspace discovery must find exactly one copy of each config package after the move; verify with pnpm workspace listing and lockfile inspection in Task 3.
- Existing imports and JSON `extends` paths must continue resolving through package names; verify with typecheck and consumer builds in Task 4.
- Documentation must not send maintainers to obsolete filesystem paths; verify with the repository-wide reference search in Task 2.
- The move must not alter config behavior; verify package-content comparison and the full quality suite in Task 4.
- Existing dirty lockfile/workspace edits must survive the migration; verify `git diff` scope before and after each mutation in Task 1 and Task 4.

---

### Task 1: Capture baseline and relocate the four workspace packages

**Files:**

- Move: `configs/eslint-config/**` → `packages/eslint-config/**`
- Move: `configs/prettier-config/**` → `packages/prettier-config/**`
- Move: `configs/typescript-config/**` → `packages/typescript-config/**`
- Move: `configs/vitest-config/**` → `packages/vitest-config/**`

**Interfaces:**

- Consumes: Existing package manifests, exports, and package contents.
- Produces: Four config packages at their new canonical paths with unchanged package names and files.

- [ ] **Step 1: Record the baseline package identities and contents**

Run:

```bash
find configs -maxdepth 2 -name package.json -print -exec sed -n '1,120p' {} \;
git diff -- pnpm-lock.yaml pnpm-workspace.yaml
```

Expected: the four config manifests are identified, their names are recorded, and only the two pre-existing dirty files are shown before migration.

- [ ] **Step 2: Move each config directory without editing its contents**

Run:

```bash
mv configs/eslint-config packages/eslint-config
mv configs/prettier-config packages/prettier-config
mv configs/typescript-config packages/typescript-config
mv configs/vitest-config packages/vitest-config
```

Expected: each package exists under `packages/`; no config package remains under `configs/`.

- [ ] **Step 3: Verify the move is content-preserving**

Run:

```bash
git status --short
find packages/{eslint-config,prettier-config,typescript-config,vitest-config} -maxdepth 2 -type f -print | sort
```

Expected: Git reports renames/deletions plus the new paths, and all files from the four source directories are present under their matching destination.

### Task 2: Update workspace discovery and repository guidance

**Files:**

- Modify: `pnpm-workspace.yaml`
- Modify: `AGENTS.md`
- Modify: `CLAUDE.md`
- Modify: `README.md`
- Modify: `configs/*/README.md` (at their moved `packages/*/README.md` paths)
- Modify: any additional tracked documentation or examples found by the reference search

**Interfaces:**

- Consumes: The relocated package paths from Task 1.
- Produces: A repository whose workspace configuration and maintainer guidance consistently describe `packages/` as the config-package location while preserving `@seaguntech/*` import examples.

- [ ] **Step 1: Change pnpm workspace globs**

Edit `pnpm-workspace.yaml` so the workspace list contains `packages/*` and removes `configs/*`; preserve all unrelated catalog and existing dirty content.

- [ ] **Step 2: Find every obsolete filesystem reference**

Run:

```bash
rg -n --hidden --glob '!node_modules/**' --glob '!.git/**' 'configs/' .
```

Expected: each match is classified as either an intentional historical/spec reference or a path that must be updated to `packages/<config-name>`; package import specifiers beginning with `@seaguntech/` remain unchanged.

- [ ] **Step 3: Update guidance and examples**

Update `AGENTS.md`, `CLAUDE.md`, `README.md`, and moved package READMEs so filesystem layout, maintenance instructions, and examples point to `packages/`. Do not rename package names or export subpaths.

- [ ] **Step 4: Re-run the reference search**

Run:

```bash
rg -n --hidden --glob '!node_modules/**' --glob '!.git/**' 'configs/' .
```

Expected: no obsolete operational/documentation path remains; any retained match is explicitly part of the migration spec/plan or historical record and is not an active repository instruction.

### Task 3: Reconcile the workspace graph and lockfile

**Files:**

- Modify: `pnpm-lock.yaml`
- Verify: all package manifests and `pnpm-workspace.yaml`

**Interfaces:**

- Consumes: Updated workspace layout and globs from Tasks 1–2.
- Produces: A lockfile and pnpm graph with one workspace entry per config package and no stale `configs/` workspace paths.

- [ ] **Step 1: Reinstall or refresh workspace metadata using the repository’s pinned toolchain**

Run:

```bash
pnpm install --lockfile-only
```

Expected: pnpm updates only workspace/lockfile metadata needed by the relocation; unrelated dependency changes are investigated and avoided.

- [ ] **Step 2: Verify workspace package discovery**

Run:

```bash
pnpm list --depth -1 --json
pnpm --filter @seaguntech/eslint-config exec pwd
pnpm --filter @seaguntech/prettier-config exec pwd
pnpm --filter @seaguntech/typescript-config exec pwd
pnpm --filter @seaguntech/vitest-config exec pwd
```

Expected: each filter resolves exactly once and reports a path under `packages/`; no filter resolves from `configs/`.

- [ ] **Step 3: Inspect lockfile and diff scope**

Run:

```bash
rg -n 'configs/|packages/(eslint-config|prettier-config|typescript-config|vitest-config)' pnpm-lock.yaml
git diff --stat
git diff -- pnpm-workspace.yaml pnpm-lock.yaml
```

Expected: lockfile metadata is consistent with `packages/`; pre-existing edits are preserved and no unrelated package upgrade is introduced.

### Task 4: Run template quality gates and record results

**Files:**

- Modify: none expected beyond generated lockfile/documentation changes from prior tasks.
- Record: command results in the implementation handoff and, if needed, a concise verification note in the plan/PR description.

**Interfaces:**

- Consumes: The reconciled workspace graph from Task 3.
- Produces: Evidence that the relocated template passes or clearly reports each quality gate.

- [ ] **Step 1: Check formatting**

Run `pnpm format`.

Expected: exit 0 with no formatting violations. If it fails, fix only migration-related formatting and rerun.

- [ ] **Step 2: Check lint**

Run `pnpm lint`.

Expected: exit 0. Existing warnings may be recorded, but new errors caused by the move must be fixed before continuing.

- [ ] **Step 3: Check TypeScript**

Run `pnpm check-types`.

Expected: exit 0 and all JSON `extends`/package imports resolve from the new workspace locations.

- [ ] **Step 4: Run tests**

Run `pnpm test`.

Expected: exit 0 for all configured Vitest suites.

- [ ] **Step 5: Build all workspaces**

Run `pnpm build`.

Expected: exit 0 for packages and apps consuming the relocated configs.

- [ ] **Step 6: Perform final migration audit**

Run:

```bash
git status --short --branch
rg -n --hidden --glob '!node_modules/**' --glob '!.git/**' 'configs/' .
git diff --check
```

Expected: branch remains `chore/move-configs-to-packages`, only intended migration files plus the user’s pre-existing modifications are present, no obsolete active path references remain, and diff whitespace is clean.

- [ ] **Step 7: Commit the implementation**

After all gates pass or documented blockers are accepted:

```bash
git add packages pnpm-workspace.yaml pnpm-lock.yaml AGENTS.md CLAUDE.md README.md docs
git commit -m "chore: move shared configs into packages"
```

Expected: one implementation commit containing the relocations, workspace/docs updates, and lockfile reconciliation; do not stage unrelated user changes.

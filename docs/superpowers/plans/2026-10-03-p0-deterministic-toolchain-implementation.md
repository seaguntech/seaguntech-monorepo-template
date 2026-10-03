# P0 Deterministic Toolchain Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make local and CI execution use one Node 24 and pnpm 10.25.0 contract without hidden install-script or Turbo file mutations.

**Architecture:** A repository-level Node verifier reads version-manager files, package metadata, workspace build-script policy, CI setup, and Turbo policy as one contract. Configuration changes are made only after the verifier demonstrates the current mismatch.

**Tech Stack:** Node 24 LTS, Corepack, pnpm 10.25.0, Turborepo 2.11.7, GitHub Actions, Node test runner

**Spec:** `docs/superpowers/specs/2026-10-03-p0-production-readiness-design.md`

## Global Constraints

- Node major 24 is the only required P0 runtime.
- `packageManager` remains exactly `pnpm@10.25.0`.
- `engines.node` is `>=24 <25`; `engines.pnpm` is `10.25.0`.
- Corepack is the only documented and CI pnpm activation mechanism;
  `pnpm/action-setup` is removed.
- `@types/node` uses major 24 to match the supported runtime baseline.
- Only `esbuild` and `sharp` may be allowlisted for dependency build scripts unless a failing verified build proves another package is required.
- Turbo is `2.11.7` in the current working baseline.
- Set `agentGuidance` to `false` so automated commands do not mutate `AGENTS.md`.
- Do not introduce remote cache, affected execution, or workspace boundaries in P0.

## Review Focus

- A developer using Node 22 or 25 must receive a clear contract failure rather than an unexplained downstream error; Task 1 tests metadata consistency.
- CI and local files must not silently disagree on pnpm patch versions; Task 1 tests every source.
- The build-script allowlist must reject an unexpected package rather than expanding automatically; Task 2 tests the exact set.
- Turbo commands must not add or modify `AGENTS.md`; Task 3 verifies tracked-file state.
- A second frozen install must leave both lockfile and tracked files unchanged; Task 4 verifies this in a temporary copy.

---

### Task 1: Define and verify the Node/pnpm contract

**Files:**

- Modify: `.nvmrc`
- Create: `.node-version`
- Modify: `package.json`
- Modify: `pnpm-workspace.yaml`
- Modify: `pnpm-lock.yaml`
- Modify: `.github/composite-actions/prepare/action.yml`
- Create: `scripts/toolchain/contract.mjs`
- Create: `scripts/toolchain/contract.test.mjs`

**Interfaces:**

- Produces: `readToolchainContract(rootDir) -> { nvmNode, nodeVersion, engineNode, packageManager, enginePnpm, nodeTypesRange, ciUsesCorepack, ciPnpmVersion }`.
- Produces: `validateToolchainContract(contract) -> string[]`, returning an empty array only for the approved values.
- Produces: root script `doctor:toolchain` invoking the validator and exiting non-zero on mismatch.

- [ ] **Step 1: Write failing contract tests**

Assert these exact values:

- `.nvmrc`: `24`
- `.node-version`: `24`
- `engines.node`: `>=24 <25`
- `packageManager`: `pnpm@10.25.0`
- `engines.pnpm`: `10.25.0`
- `@types/node` catalog major: `24`
- prepare action uses `corepack enable` and
  `corepack prepare pnpm@10.25.0 --activate`
- prepare action does not use `pnpm/action-setup`
- prepare action Node source: `.nvmrc`

Also test that a fixture with Node `22` returns a mismatch message naming the offending file.

- [ ] **Step 2: Run tests against the current inconsistent contract**

Run: `node --test scripts/toolchain/contract.test.mjs`

Expected: FAIL because `.node-version` is missing and `.nvmrc`/engines target older or wider runtimes.

- [ ] **Step 3: Implement the contract reader and validator**

Use Node built-ins only. Parse JSON structurally and extract the two scalar version values from the composite-action YAML without adding a YAML dependency.

- [ ] **Step 4: Align version-manager, package, and CI files**

Set the approved values, change the CI Node source from `package.json` to
`.nvmrc`, remove `pnpm/action-setup`, and activate pnpm 10.25.0 through Corepack
before install. Move the `@types/node` catalog to compatible major 24 and
regenerate the lockfile; do not change other dependency families in this task.

- [ ] **Step 5: Add and run the toolchain doctor**

Run: `pnpm doctor:toolchain`

Expected: `Node 24 / pnpm 10.25.0 toolchain contract is consistent` and exit `0`.

Run: `node --test scripts/toolchain/contract.test.mjs`

Expected: all contract tests pass.

- [ ] **Step 6: Commit the toolchain contract**

```bash
git add .nvmrc .node-version package.json pnpm-workspace.yaml pnpm-lock.yaml .github/composite-actions/prepare/action.yml scripts/toolchain/contract.mjs scripts/toolchain/contract.test.mjs
git commit -m "chore(toolchain): pin Node and pnpm contract"
```

### Task 2: Version-control the dependency build-script allowlist

**Files:**

- Modify: `pnpm-workspace.yaml`
- Modify: `pnpm-lock.yaml` only if pnpm records policy metadata
- Modify: `scripts/toolchain/contract.mjs`
- Modify: `scripts/toolchain/contract.test.mjs`

**Interfaces:**

- Consumes: `readToolchainContract(rootDir)` from Task 1.
- Extends contract with `onlyBuiltDependencies: string[]`.
- Produces exact allowlist `['esbuild', 'sharp']` in sorted order.

- [ ] **Step 1: Add a failing exact-allowlist test**

Assert that the parsed workspace policy contains exactly `esbuild` and `sharp`; add a fixture assertion proving an extra package produces an error.

- [ ] **Step 2: Run the contract tests**

Run: `node --test scripts/toolchain/contract.test.mjs`

Expected: FAIL because no allowlist exists.

- [ ] **Step 3: Add `onlyBuiltDependencies` to the workspace configuration**

Allow only `esbuild` and `sharp`. Do not use a wildcard, blanket approval, or ignored-build warning suppression.

- [ ] **Step 4: Reinstall and verify native/build dependencies**

Run: `pnpm install --frozen-lockfile`

Expected: exit `0` without an ignored-build-scripts warning for `esbuild` or `sharp`.

Run: `pnpm --filter @seaguntech/web build && pnpm --filter @seaguntech/storybook build`

Expected: both production builds exit `0`.

- [ ] **Step 5: Verify and commit the allowlist**

Run: `node --test scripts/toolchain/contract.test.mjs`

Expected: all tests pass.

```bash
git add pnpm-workspace.yaml pnpm-lock.yaml scripts/toolchain/contract.mjs scripts/toolchain/contract.test.mjs
git commit -m "chore(toolchain): allow required dependency builds"
```

### Task 3: Stabilize Turbo schema and agent guidance

**Files:**

- Modify: `turbo.json`
- Modify: `scripts/toolchain/contract.mjs`
- Modify: `scripts/toolchain/contract.test.mjs`

**Interfaces:**

- Extends toolchain contract with `turboSchema: string` and `agentGuidance: boolean`.
- Produces Turbo schema `https://turbo.build/schema.json` and `agentGuidance: false`.

- [ ] **Step 1: Add failing Turbo policy tests**

Assert the stable schema URL and `agentGuidance === false`. Add a fixture assertion showing a missing value fails closed.

- [ ] **Step 2: Run tests against the current Turbo config**

Run: `node --test scripts/toolchain/contract.test.mjs`

Expected: FAIL because the schema is version-stale and `agentGuidance` is absent.

- [ ] **Step 3: Update only the Turbo global policy**

Change the schema URL and add `agentGuidance: false`. Do not redesign the task graph in P0.

- [ ] **Step 4: Verify Turbo does not mutate tracked instructions**

Record `git diff -- AGENTS.md`, run `pnpm exec turbo run lint --dry`, then run `git diff --exit-code -- AGENTS.md`.

Expected: dry run exits `0`; `AGENTS.md` remains unchanged.

- [ ] **Step 5: Verify and commit the Turbo policy**

Run: `pnpm doctor:toolchain`

Expected: contract is consistent.

```bash
git add turbo.json scripts/toolchain/contract.mjs scripts/toolchain/contract.test.mjs
git commit -m "chore(turbo): stabilize schema and agent guidance"
```

### Task 4: Add clean-copy reproducibility verification

**Files:**

- Create: `scripts/toolchain/verify-reproducibility.mjs`
- Create: `scripts/toolchain/verify-reproducibility.test.mjs`
- Modify: `package.json`
- Modify: `docs/PRODUCTION_READINESS.md`

**Interfaces:**

- Produces: `listTrackedChanges(rootDir) -> Promise<string[]>`.
- Produces: `verifyFrozenInstall(rootDir, installCommand) -> Promise<{ first: string[], second: string[] }>`.
- Produces: root command `verify:reproducibility` that operates on a temporary copy and never mutates the source checkout.

- [ ] **Step 1: Write failing unit tests for tracked-change detection**

Create temporary Git fixtures and assert:

- a clean repository returns `[]`;
- a modified lockfile is reported;
- an untracked `AGENTS.md` mutation is reported;
- ignored `node_modules` and build outputs are not reported.

- [ ] **Step 2: Run tests and verify the module is missing**

Run: `node --test scripts/toolchain/verify-reproducibility.test.mjs`

Expected: FAIL with `ERR_MODULE_NOT_FOUND`.

- [ ] **Step 3: Implement the temporary-copy verifier**

Use `git ls-files`/status for the copy manifest, exclude `.git`, dependencies, and generated outputs, then run two frozen installs through an injected command for testability. Always remove the temporary copy in `finally`.

- [ ] **Step 4: Add the root verification command and documentation**

Document prerequisites, expected duration, network requirement, pass output, and recovery for lockfile drift or install-script warnings.

- [ ] **Step 5: Run unit and live reproducibility checks**

Run: `node --test scripts/toolchain/*.test.mjs`

Expected: all tests pass.

Run: `pnpm verify:reproducibility`

Expected: both frozen installs exit `0`; second install reports no tracked changes.

- [ ] **Step 6: Commit reproducibility verification**

```bash
git add package.json docs/PRODUCTION_READINESS.md scripts/toolchain/verify-reproducibility.mjs scripts/toolchain/verify-reproducibility.test.mjs
git commit -m "test(toolchain): verify clean install reproducibility"
```

### Task 5: Align documentation with the toolchain contract

**Files:**

- Modify: `README.md`
- Modify: `docs/GETTING_STARTED.md`
- Modify: `docs/DEVELOPMENT.md`
- Modify: `AGENTS.md`
- Create: `scripts/toolchain/documentation-contract.test.mjs`

**Interfaces:**

- Consumes: exact values from `readToolchainContract(rootDir)`.
- Produces: documentation consistently naming Node 24 LTS, pnpm 10.25.0, Corepack, `doctor:toolchain`, and `verify:reproducibility`.

- [ ] **Step 1: Write failing documentation consistency tests**

Assert each required document contains Node 24, pnpm 10.25.0, and no active requirement line advertising Node `>=20`. Assert getting-started docs include `corepack enable` and the two verification commands.

- [ ] **Step 2: Run tests against stale documentation**

Run: `node --test scripts/toolchain/documentation-contract.test.mjs`

Expected: FAIL on Node `>=20` references and missing commands.

- [ ] **Step 3: Update documentation only**

Explain supported versions, Corepack activation, build-script policy, toolchain doctor, clean-copy verification, and stop conditions.

- [ ] **Step 4: Verify docs and complete toolchain suite**

Run: `node --test scripts/toolchain/*.test.mjs`

Expected: all tests pass.

Run: `pnpm exec prettier --check README.md docs/GETTING_STARTED.md docs/DEVELOPMENT.md AGENTS.md`

Expected: all matched files use Prettier style.

- [ ] **Step 5: Commit documentation alignment**

```bash
git add README.md docs/GETTING_STARTED.md docs/DEVELOPMENT.md AGENTS.md scripts/toolchain/documentation-contract.test.mjs
git commit -m "docs: document supported toolchain contract"
```

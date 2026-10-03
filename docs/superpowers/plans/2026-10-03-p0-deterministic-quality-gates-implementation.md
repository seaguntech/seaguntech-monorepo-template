# P0 Deterministic Quality Gates Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make coverage, lint, formatting, and tracked-file cleanliness produce the same result regardless of previously generated reports.

**Architecture:** Shared lint/format ignores define the generated-artifact boundary for every workspace. A state-sensitive Node verifier runs the exact coverage-to-cleanliness sequence and CI exposes formatting and coverage as named required jobs without yet expanding UI coverage scope.

**Tech Stack:** ESLint 9 flat config, Prettier 3, Vitest 3 coverage, Turborepo 2.11.7, Git, GitHub Actions, Node test runner

**Spec:** `docs/superpowers/specs/2026-10-03-p0-production-readiness-design.md`

## Global Constraints

- P0 fixes artifact hygiene only; do not change UI coverage scope or thresholds.
- Generated `coverage/**` content must remain ignored at root and workspace depth.
- Existing source lint, format, typecheck, test, and build semantics must not be weakened.
- Do not format generated coverage reports to make checks pass.
- The required state-sensitive order is coverage, lint, format, then tracked-file cleanliness.
- CI job names are `Format` and `Coverage`.
- P0 qualification runs without Turbo remote cache.

## Review Focus

- Coverage generated under any package must be ignored even when ESLint or Prettier runs from that package directory; Task 1 tests this.
- A real source formatting error must still fail after ignore patterns are widened; Task 1 tests this.
- The verifier must fail when a tracked source file changes during the sequence; Task 2 tests this.
- The verifier must clean temporary fixtures even when a child command fails; Task 2 tests this.
- CI coverage must run the repository coverage command rather than plain unit tests; Task 3 tests the workflow structure.

---

### Task 1: Fix recursive generated-artifact ignores

**Files:**

- Modify: `configs/eslint-config/base.js`
- Modify: `.prettierignore`
- Create: `scripts/quality/generated-artifacts.test.mjs`

**Interfaces:**

- Produces: shared ESLint ignore `**/coverage/**` inherited by workspace configs.
- Produces: Prettier ignore `**/coverage/**` for root and workspace execution.
- Produces: regression test that invokes installed ESLint and Prettier binaries from `packages/ui`.

- [ ] **Step 1: Write a failing generated-artifact regression test**

The test creates:

- `packages/ui/coverage/generated.js` containing an unused disable directive;
- `packages/ui/coverage/generated.json` containing deliberately unformatted JSON;
- a temporary unformatted source fixture outside coverage.

Assert workspace-local ESLint and Prettier ignore both coverage files, while Prettier reports the source fixture. Remove all fixtures in `afterEach`/`finally`.

- [ ] **Step 2: Run the regression test against current shared ignores**

Run: `node --test scripts/quality/generated-artifacts.test.mjs`

Expected: FAIL because workspace-local ESLint or Prettier includes a coverage fixture.

- [ ] **Step 3: Add recursive coverage ignores**

Add `**/coverage/**` to the shared ESLint ignore block and `.prettierignore`. Keep existing ignores and do not add a blanket `packages/**` exclusion.

- [ ] **Step 4: Run the regression and normal source checks**

Run: `node --test scripts/quality/generated-artifacts.test.mjs`

Expected: PASS.

Run: `pnpm lint && pnpm format`

Expected: both exit `0` even when existing package coverage reports are present.

- [ ] **Step 5: Commit artifact hygiene**

```bash
git add configs/eslint-config/base.js .prettierignore scripts/quality/generated-artifacts.test.mjs
git commit -m "fix(quality): ignore generated coverage recursively"
```

### Task 2: Add a state-sensitive quality verifier

**Files:**

- Create: `scripts/quality/verify-quality-gates.mjs`
- Create: `scripts/quality/verify-quality-gates.test.mjs`
- Modify: `package.json`

**Interfaces:**

- Produces: `runQualitySequence({ rootDir, runner }) -> Promise<{ commands: string[], changes: string[] }>`.
- Produces: command order `pnpm test:coverage`, `pnpm lint`, `pnpm format`, then `git status --porcelain --untracked-files=no` filtered to changes introduced after the initial snapshot.
- Produces: root script `verify:quality-gates`.

- [ ] **Step 1: Write failing orchestration tests**

Using an injected fake runner, assert:

- commands execute in the required order;
- execution stops at the first failed command;
- cleanup/finalization still runs after failure;
- a newly modified tracked source file causes failure;
- pre-existing tracked modifications are preserved and do not become falsely attributed to the verifier.

- [ ] **Step 2: Run the tests and verify the module is missing**

Run: `node --test scripts/quality/verify-quality-gates.test.mjs`

Expected: FAIL with `ERR_MODULE_NOT_FOUND`.

- [ ] **Step 3: Implement `runQualitySequence`**

Capture the initial tracked status, run each command through the injected runner, compare final tracked status, and report only changes introduced by the sequence. Never reset, restore, or delete user changes.

- [ ] **Step 4: Add the root command**

Add `verify:quality-gates` to `package.json` using the Node script. Do not encode the sequence as a shell `&&` chain.

- [ ] **Step 5: Run unit and live verification**

Run: `node --test scripts/quality/*.test.mjs`

Expected: all tests pass.

Run: `pnpm verify:quality-gates`

Expected: coverage, lint, and format exit `0`; no new tracked change is reported. Existing user modifications remain untouched.

- [ ] **Step 6: Commit the quality verifier**

```bash
git add package.json scripts/quality/verify-quality-gates.mjs scripts/quality/verify-quality-gates.test.mjs
git commit -m "test(quality): verify state-independent gates"
```

### Task 3: Add formatting and coverage CI jobs

**Files:**

- Modify: `.github/workflows/ci.yml`
- Create: `scripts/quality/ci-quality.test.mjs`

**Interfaces:**

- Consumes: existing prepare composite action and root `format`/`test:coverage` commands.
- Produces: CI jobs `format` with display name `Format` and `coverage` with display name `Coverage`.

- [ ] **Step 1: Write failing workflow-structure tests**

Assert `.github/workflows/ci.yml` contains:

- top-level read-only contents permission;
- `format` job with `run: pnpm run format`;
- `coverage` job with `run: pnpm run test:coverage`;
- timeout values for both jobs;
- no deployment permission or secret reference in either job.

- [ ] **Step 2: Run the test against current CI**

Run: `node --test scripts/quality/ci-quality.test.mjs`

Expected: FAIL because Format and Coverage jobs are absent.

- [ ] **Step 3: Add the two CI jobs**

Reuse `./.github/composite-actions/prepare`. Keep validation jobs independent so a failure has an unambiguous required-check name.

- [ ] **Step 4: Verify workflow tests and local commands**

Run: `node --test scripts/quality/ci-quality.test.mjs`

Expected: PASS.

Run: `pnpm format && pnpm test:coverage`

Expected: both exit `0`.

- [ ] **Step 5: Commit CI quality gates**

```bash
git add .github/workflows/ci.yml scripts/quality/ci-quality.test.mjs
git commit -m "ci: enforce formatting and coverage gates"
```

### Task 4: Add the cold P0 qualification command

**Files:**

- Create: `scripts/quality/verify-p0.mjs`
- Create: `scripts/quality/verify-p0.test.mjs`
- Modify: `package.json`
- Modify: `docs/PRODUCTION_READINESS.md`

**Interfaces:**

- Consumes: `audit:security`, `doctor:toolchain`, `verify:reproducibility`, and `verify:quality-gates` from earlier P0 plans.
- Produces: `buildP0CommandList() -> string[]` with frozen install, toolchain doctor, security audit, lint, format, typecheck, test, coverage, web build, Storybook build, post-coverage lint/format, and tracked-file verification.
- Produces: root command `verify:p0` operating in a temporary clean copy with remote cache disabled.

- [ ] **Step 1: Write the failing command-contract test**

Assert `buildP0CommandList()` contains every required gate exactly once except lint and format, which occur once before and once after coverage. Assert the environment passed to Turbo commands disables remote cache.

- [ ] **Step 2: Run tests and verify the module is missing**

Run: `node --test scripts/quality/verify-p0.test.mjs`

Expected: FAIL with `ERR_MODULE_NOT_FOUND`.

- [ ] **Step 3: Implement the P0 verifier**

Use the temporary-copy behavior produced by the toolchain plan. Stream concise command output, stop at the first failure, preserve the temporary directory path only on failure for diagnosis, and delete it on success.

- [ ] **Step 4: Document qualification evidence and stop conditions**

Document the exact command, expected duration, network requirement, evidence retained, and each condition that prevents a P0 pass.

- [ ] **Step 5: Run all P0 unit contracts**

Run: `node --test scripts/security/*.test.mjs scripts/toolchain/*.test.mjs scripts/quality/*.test.mjs`

Expected: all tests pass.

- [ ] **Step 6: Run the live cold qualification**

Run: `pnpm verify:p0`

Expected: every gate exits `0`, no unaccepted security blocker exists, no tracked file changes, and remote cache is not required.

- [ ] **Step 7: Commit the qualification command**

```bash
git add package.json docs/PRODUCTION_READINESS.md scripts/quality/verify-p0.mjs scripts/quality/verify-p0.test.mjs
git commit -m "test: add cold P0 qualification"
```

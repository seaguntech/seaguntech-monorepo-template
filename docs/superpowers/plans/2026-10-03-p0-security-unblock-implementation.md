# P0 Security Unblock Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove applicable critical and high-risk dependency paths and add a deterministic, exception-aware security gate.

**Architecture:** Keep dependency-family upgrades isolated from the audit-policy implementation. A small Node module converts pnpm audit JSON plus version-controlled exceptions into a stable pass/fail result; CI calls that interface after the patched dependency baseline is verified.

**Tech Stack:** Node 24, pnpm 10.25.0, pnpm catalogs, Next.js 16, Vitest 3, Vite 6, GitHub Actions, Node test runner

**Spec:** `docs/superpowers/specs/2026-10-03-p0-production-readiness-design.md`

## Global Constraints

- Retain Next.js major 16 in P0; target `16.3.8` or a newer patched 16.x version verified at execution time.
- Retain Vitest major 3 in P0; target at least `3.2.6`.
- Retain Vite major 6 in P0; target at least `6.4.3`.
- Target PostCSS at least `8.5.23`; prefer the current compatible 8.5.x patch.
- Do not migrate Storybook, ESLint, Tailwind, or React majors in this plan.
- Applicable critical findings always block.
- Applicable high runtime findings block unless a non-expired exception names the exact advisory and dependency path.
- Security changes must remain separate from formatting, component, and architecture refactors.
- Preserve the user's pre-existing dependency edits; reconcile them explicitly instead of overwriting them.

## Review Focus

- A malformed or incomplete pnpm audit document must fail closed with an actionable parse error; Task 1 tests this.
- An exception with an invalid or expired date must not suppress a finding; Task 1 tests this.
- An exception for one dependency path must not suppress the same advisory on another path; Task 1 tests this.
- A patched Next.js version must still complete a production build and static route generation; Task 2 verifies this.
- Development-only findings must remain visible in the report even when they do not block the production policy; Task 1 tests this.

---

### Task 1: Add the exception-aware audit policy

**Files:**

- Create: `scripts/security/audit-policy.mjs`
- Create: `scripts/security/audit-policy.test.mjs`
- Create: `security/audit-exceptions.json`
- Modify: `package.json`

**Interfaces:**

- Consumes: pnpm audit JSON with `advisories` and `metadata` fields; exception records from `security/audit-exceptions.json`.
- Produces: `evaluateAuditReport(report, exceptions, now) -> { blocking, accepted, informational }` from `scripts/security/audit-policy.mjs`.
- Produces: CLI `node scripts/security/audit-policy.mjs --report <path> --exceptions <path>` with exit `0` for no blockers, `1` for blockers, and `2` for invalid input.
- Produces: root script `audit:security` that writes audit JSON to a temporary file and invokes the policy CLI without committing the report.

- [ ] **Step 1: Write failing tests for blocking and accepted findings**

Add Node tests named:

- `blocks applicable critical findings`
- `blocks applicable high runtime findings`
- `accepts only an exact advisory and path match`
- `rejects expired exceptions`
- `fails closed for malformed audit documents`
- `reports development-only findings without hiding them`

Use fixed `now = new Date('2026-10-03T00:00:00Z')`. Assert result-array lengths, advisory URLs, dependency paths, and the invalid-input error message.

- [ ] **Step 2: Run the audit-policy tests and verify the module is missing**

Run: `node --test scripts/security/audit-policy.test.mjs`

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `audit-policy.mjs`.

- [ ] **Step 3: Implement `evaluateAuditReport(report, exceptions, now)`**

Validate required input fields before classification. Match exceptions by both advisory URL and exact dependency path. Treat invalid or expired exceptions as blockers and preserve accepted and informational findings in the returned report.

- [ ] **Step 4: Implement the audit-policy CLI**

Accept only `--report` and `--exceptions`. Print a concise severity/path summary, never the entire environment. Exit with the interface codes defined above.

- [ ] **Step 5: Add an empty exception registry and root security command**

Use this schema in `security/audit-exceptions.json`:

```json
{
  "exceptions": []
}
```

Add `audit:security` to `package.json`. Use a temporary path under the operating-system temp directory and ensure it is removed on success or failure.

- [ ] **Step 6: Run tests and malformed-input CLI verification**

Run: `node --test scripts/security/audit-policy.test.mjs`

Expected: PASS, 6 tests and 0 failures.

Run: `node scripts/security/audit-policy.mjs --report package.json --exceptions security/audit-exceptions.json`

Expected: exit `2` with an invalid-audit-document message.

- [ ] **Step 7: Commit the audit policy**

```bash
git add package.json scripts/security/audit-policy.mjs scripts/security/audit-policy.test.mjs security/audit-exceptions.json
git commit -m "feat(security): add exception-aware audit policy"
```

### Task 2: Patch the Next.js runtime baseline

**Files:**

- Modify: `pnpm-workspace.yaml`
- Modify: `pnpm-lock.yaml`
- Create: `scripts/security/dependency-baseline.test.mjs`

**Interfaces:**

- Consumes: approved Next.js major 16 policy from the spec.
- Produces: catalog key `catalogs.nextjs.next` resolving to `16.3.8` or a later verified patched 16.x version.
- Produces: dependency-baseline test asserting installed Next.js is major 16 and at least `16.3.8`.

- [ ] **Step 1: Write the failing Next.js baseline test**

Read `node_modules/next/package.json`, parse its numeric version parts, and assert major `16` with version greater than or equal to `16.3.8`. Name the test `uses a patched Next.js 16 baseline`.

- [ ] **Step 2: Run the baseline test against the vulnerable install**

Run: `node --test scripts/security/dependency-baseline.test.mjs`

Expected: FAIL showing installed `16.1.4` is below `16.3.8`.

- [ ] **Step 3: Update only the Next.js catalog and lockfile**

Set the Next.js catalog range to start at the selected patched version. Regenerate the lockfile with the approved pnpm version; do not change React, Storybook, ESLint, or Tailwind catalogs.

- [ ] **Step 4: Verify the installed dependency baseline**

Run: `pnpm install --frozen-lockfile`

Expected: exit `0` with `Lockfile is up to date`.

Run: `node --test scripts/security/dependency-baseline.test.mjs`

Expected: PASS for the Next.js baseline test.

- [ ] **Step 5: Verify runtime regression gates**

Run: `pnpm --filter @seaguntech/web check-types`

Expected: exit `0`.

Run: `pnpm --filter @seaguntech/web build`

Expected: exit `0`, route `/` and `/_not-found` generated.

- [ ] **Step 6: Run the production audit policy**

Run: `pnpm audit:security`

Expected: no blocking Next.js critical or high runtime advisory. Any remaining blocker must stop this task and be fixed or recorded through the approved exception process.

- [ ] **Step 7: Commit the Next.js security patch**

```bash
git add pnpm-workspace.yaml pnpm-lock.yaml scripts/security/dependency-baseline.test.mjs
git commit -m "fix(web): patch Next.js security baseline"
```

### Task 3: Patch the compatible test/build-tool baseline

**Files:**

- Modify: `pnpm-workspace.yaml`
- Modify: `pnpm-lock.yaml`
- Modify: `scripts/security/dependency-baseline.test.mjs`

**Interfaces:**

- Consumes: Task 2 dependency-baseline test file.
- Produces: catalog versions Vitest `>=3.2.6 <4`, Vite `>=6.4.3 <7`, and PostCSS `>=8.5.23 <9`.
- Produces: baseline tests for the three installed package versions.

- [ ] **Step 1: Add failing baseline tests for Vitest, Vite, and PostCSS**

Add tests named:

- `uses a patched Vitest 3 baseline`
- `uses a patched Vite 6 baseline`
- `uses a patched PostCSS 8 baseline`

Resolve each installed package from the workspace package that consumes it, not from an assumed root-hoisted location.

- [ ] **Step 2: Run the tests against the current vulnerable baseline**

Run: `node --test scripts/security/dependency-baseline.test.mjs`

Expected: FAIL for Vitest `3.2.4`, Vite `6.4.1`, and PostCSS `8.5.6`.

- [ ] **Step 3: Update compatible catalog ranges and regenerate the lockfile**

Keep Vitest on major 3, Vite on major 6, and PostCSS on major 8. Allow transitive Rollup, Sharp, WebSocket, and glob packages to move to patched versions selected by the refreshed lockfile.

- [ ] **Step 4: Run focused tool regression tests**

Run: `pnpm --filter @seaguntech/utils test && pnpm --filter @seaguntech/logger test && pnpm --filter @seaguntech/ui test`

Expected: all current test files pass.

Run: `pnpm --filter @seaguntech/storybook build`

Expected: exit `0`; warnings must be recorded but no build error is accepted.

- [ ] **Step 5: Run dependency-baseline and audit-policy checks**

Run: `node --test scripts/security/dependency-baseline.test.mjs scripts/security/audit-policy.test.mjs`

Expected: all tests pass.

Run: `pnpm audit:security`

Expected: no unaccepted applicable critical finding and no unaccepted high runtime finding.

- [ ] **Step 6: Commit the compatible tooling patches**

```bash
git add pnpm-workspace.yaml pnpm-lock.yaml scripts/security/dependency-baseline.test.mjs
git commit -m "fix(tooling): patch test and build dependencies"
```

### Task 4: Add Renovate security automation

**Files:**

- Create: `renovate.json`
- Create: `scripts/security/renovate-config.test.mjs`
- Modify: `docs/PRODUCTION_READINESS.md` if created by the toolchain plan; otherwise create it with only the security-policy section.

**Interfaces:**

- Consumes: catalog names from `pnpm-workspace.yaml` and severity policy from Task 1.
- Produces: Renovate groups `next-react`, `storybook`, `vite-vitest`, `eslint`, `tailwind-ui`, and `github-actions`.
- Produces: security updates that are never delayed by a scheduled maintenance group.

- [ ] **Step 1: Write failing Renovate configuration tests**

Parse `renovate.json` and assert that dependency dashboard is enabled, vulnerability alerts are enabled, lockfile maintenance is scheduled weekly, the six groups exist, and vulnerability updates are not assigned to a delayed schedule.

- [ ] **Step 2: Run the test and verify the config is missing**

Run: `node --test scripts/security/renovate-config.test.mjs`

Expected: FAIL with `ENOENT` for `renovate.json`.

- [ ] **Step 3: Create the Renovate configuration**

Extend `config:recommended`, enable the dependency dashboard, group only maintenance updates by ecosystem, and keep vulnerability alerts separate.

- [ ] **Step 4: Document the audit and exception policy**

Document blocking severities, exception schema, expiry behavior, local command, and CI behavior. Do not claim a clean audit when accepted informational findings remain.

- [ ] **Step 5: Verify configuration tests and formatting**

Run: `node --test scripts/security/renovate-config.test.mjs`

Expected: PASS.

Run: `pnpm exec prettier --check renovate.json docs/PRODUCTION_READINESS.md`

Expected: all matched files use Prettier style.

- [ ] **Step 6: Commit security automation**

```bash
git add renovate.json scripts/security/renovate-config.test.mjs docs/PRODUCTION_READINESS.md
git commit -m "chore(security): automate dependency security updates"
```

### Task 5: Add the security CI gate

**Files:**

- Modify: `.github/workflows/ci.yml`
- Create: `scripts/security/ci-security.test.mjs`

**Interfaces:**

- Consumes: root `audit:security` command from Task 1.
- Produces: required CI job named `Security Audit` with read-only repository permission.

- [ ] **Step 1: Write a failing workflow-structure test**

Read `.github/workflows/ci.yml` as text and assert it contains top-level `permissions`, `contents: read`, a `security` job, `name: Security Audit`, and `run: pnpm audit:security`.

- [ ] **Step 2: Run the test and verify the job is absent**

Run: `node --test scripts/security/ci-security.test.mjs`

Expected: FAIL because `Security Audit` is not present.

- [ ] **Step 3: Add the read-only security job**

Reuse the existing prepare composite action. Add a timeout and run only the policy command; do not grant write permissions or access deployment secrets.

- [ ] **Step 4: Verify the workflow and complete security suite**

Run: `node --test scripts/security/*.test.mjs`

Expected: all security tests pass.

Run: `pnpm audit:security`

Expected: exit `0` or an intentional stop for an unaccepted blocker; do not weaken policy to make the command green.

- [ ] **Step 5: Commit the CI security gate**

```bash
git add .github/workflows/ci.yml scripts/security/ci-security.test.mjs
git commit -m "ci: enforce dependency security policy"
```

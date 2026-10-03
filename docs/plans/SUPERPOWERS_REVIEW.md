# Superpowers Review of Production-Ready Roadmap

Review date: 2026-10-03  
Plugin: `superpowers` 6.4.2  
Skills applied: `superpowers:using-superpowers`,
`superpowers:brainstorming`, `superpowers:writing-plans`, and
`superpowers:verification-before-completion`

## Review result

The documents in this directory are useful roadmap and phase-brief artifacts,
but they are not yet executable implementation plans under the
`superpowers:writing-plans` contract.

This is an architectural program containing several independently reviewable
subsystems. The correct flow is:

1. Review and approve the program scope and Phase 00 decisions.
2. Treat each approved phase as its own design/spec cycle.
3. Save the approved design before writing its implementation plan.
4. Generate a task-level implementation plan for that phase only.
5. Select the execution method before implementation begins.

## Conformance summary

| Requirement from `superpowers:writing-plans`  | Current state                             | Result  |
| --------------------------------------------- | ----------------------------------------- | ------- |
| Required agentic-worker header                | Missing from all phase files              | Fail    |
| Goal, architecture, tech stack, and spec path | Only partial objective sections exist     | Fail    |
| Approved spec as source of truth              | No approved phase specs exist yet         | Blocked |
| Global constraints with exact values          | Decisions remain recommendations          | Fail    |
| Five review-focus failure modes               | Missing                                   | Fail    |
| Exact file map                                | Missing                                   | Fail    |
| Interfaces consumed and produced per task     | Missing                                   | Fail    |
| One checkable action per step                 | Current checklists group multiple actions | Fail    |
| Red-green TDD commands and expected failure   | Missing                                   | Fail    |
| Exact passing verification output             | Mostly missing                            | Fail    |
| Commit boundary per task                      | Missing                                   | Fail    |
| Self-review against the approved spec         | Cannot run before spec approval           | Blocked |

## Important interpretation

The files should remain useful as phase briefs. Renaming their status to an
implementation-ready plan before the missing decisions and specs are approved
would be misleading. They define intended outcomes and gates; they do not yet
tell an implementer exactly which test to write, which file to modify, or which
interface later tasks may rely on.

## File-by-file review

### `README.md`

**Strengths**

- Provides a coherent order, dependency graph, milestones, and global
  definition of done.
- Separates safe-development, modern-starter, and production-ready milestones.
- Explicitly discourages large mixed-risk pull requests.

**Required improvements**

- Label linked files as phase briefs rather than executable plans.
- Add the Superpowers approval flow and distinguish phase-spec approval from
  implementation-plan approval.
- Record the location convention for future specs and implementation plans.
- Do not present Phase 02 as one implementable unit; it contains at least six
  independently rejectable upgrade families.

### `00-architecture-decisions-and-baseline.md`

**Strengths**

- Correctly identifies the decisions that block later work.
- Provides recommended defaults and explicit stop conditions.

**Blocking gaps**

- Node 24, ESM-only/dual publishing, Renovate/Dependabot, deployment targets,
  public packages, and operating-system support remain unapproved.
- The phase is a decision/spec activity, not a code implementation plan.
- It needs an approved design artifact before any downstream implementation
  plan can copy exact global constraints.

**Recommended next artifact**

- `docs/superpowers/specs/2026-10-03-production-ready-template-design.md`
  after maintainer decisions are approved.

### `01-security-unblock.md`

**Strengths**

- Correctly isolates security fixes from broad modernization.
- Includes rollback and stop conditions.

**Blocking gaps**

- No exact target versions are defined because the support baseline is not yet
  approved.
- No advisory-to-package-path table or explicit risk-exception schema is
  specified.
- Verification does not state expected audit exit behavior when accepted
  moderate findings remain.
- `pnpm audit --prod` needs interpretation because shared config packages
  currently declare tooling under `dependencies`, which can inflate the
  apparent production graph.

**Required implementation-plan split**

1. Next.js runtime security patch.
2. Vitest/Vite development-tool security patch.
3. Audit policy and automated dependency-security workflow.

### `02-toolchain-and-dependency-modernization.md`

**Strengths**

- Upgrade waves are ordered sensibly.
- Prevents opportunistic UI redesign during dependency upgrades.

**Blocking gaps**

- It is too broad for one implementation plan.
- Exact compatibility sets and target versions are undecided.
- No file maps, migration commands, expected breakages, or per-wave regression
  tests are specified.

**Required implementation-plan split**

1. Node, Corepack, pnpm, and dependency-build policy.
2. Next.js and React family alignment.
3. Storybook 10 migration.
4. Vite and Vitest migration.
5. ESLint and Prettier family alignment.
6. Tailwind, Radix, logger, and runtime-library refresh.

### `03-turborepo-and-workspace-architecture.md`

**Strengths**

- Correctly prioritizes package tasks, cache correctness, env hashing, and
  boundaries.
- Calls out Turbo agent-guidance side effects.

**Blocking gaps**

- The intended final `turbo.json` task graph is not specified.
- No exact environment ownership matrix exists.
- No boundary tags or allowed dependency rules are named.
- A fixture or exact command for proving an intentional boundary violation is
  missing.

**Review focus for the later plan**

- Stale cache after environment changes.
- A generated artifact making a task pass only on a dirty checkout.
- App-to-package reverse imports.
- Deep imports bypassing package exports.
- Turbo commands dirtying tracked agent instructions.

### `04-package-correctness-and-publishing.md`

**Strengths**

- Recognizes that workspace-linked builds do not prove package correctness.
- Includes tarball inspection and external-consumer testing.

**Blocking gaps**

- Publishable package scope and ESM/CJS support are still decisions.
- The temporary consumer layout and exact import/type assertions are missing.
- Expected package contents are not enumerated.
- No interface is defined for a reusable package-contract test runner.

**Required implementation-plan split**

1. Package metadata and export correction.
2. Reusable pack-and-consume harness.
3. Package-by-package contract coverage and release integration.

### `05-testing-storybook-and-accessibility.md`

**Strengths**

- Correctly identifies false UI coverage and generated-report pollution.
- Separates unit, component, Storybook, accessibility, and E2E signals.

**Blocking gaps**

- Browser-test approach remains conditional.
- Exact source include/exclude patterns and coverage thresholds are not
  approved.
- Required story-state inventory is not mapped to current components.
- Storybook addon-a11y configuration alone does not prove CI runtime
  accessibility checks; the runner and commands must be specified.

**Required implementation-plan split**

1. Artifact hygiene regression.
2. Honest per-package coverage.
3. UI component behavior tests.
4. Storybook 10 story/a11y enforcement.
5. Production-preview Playwright smoke suite.

### `06-ci-cd-and-supply-chain-security.md`

**Strengths**

- Covers least privilege, immutable action references, cold validation,
  branch protection, and fork safety.
- Correctly separates validation from deployment authorization.

**Blocking gaps**

- The job dependency graph and required-check names are not fixed.
- Action SHA values and update mechanism are not specified.
- No policy defines which checks use `--affected` and which always run full.
- Remote-cache trust and secret-handling decisions remain open.

**Review focus for the later plan**

- Fork pull requests with no secrets.
- Mutable action supply-chain compromise.
- Cache poisoning or untrusted cache writes.
- Cancelled runs leaving required checks ambiguous.
- Audit output containing accepted advisories but returning a non-zero exit.

### `07-template-initialization-and-dx.md`

**Strengths**

- Includes idempotence, dry run, interruption, temporary-copy validation, and
  stale-brand detection.
- Correctly requires validation before writes and sentinel-last behavior.

**Blocking gaps**

- No explicit transaction or rollback design exists.
- The list of product-facing files and replacement tokens is not specified.
- Exact function interfaces to extract from `scripts/init-template.mjs` are
  missing.
- Expected behavior for an interrupted write and lockfile handling remains
  ambiguous.

**Review focus for the later plan**

- Reinitialization after partial failure.
- Replacement values containing `$`, backslashes, Unicode, or spaces.
- Existing user files that match template text accidentally.
- Dry-run producing any filesystem mutation.
- Sentinel creation before all writes succeed.

### `08-production-application-baseline.md`

**Strengths**

- Keeps product-specific auth and backend choices out of the baseline.
- Covers env separation, redaction, headers, runtime readiness, and bundle
  hygiene.

**Blocking gaps**

- This phase introduces several new subsystems and is not one implementable
  unit.
- The environment-schema library and exact public/server variable contract are
  undecided.
- Header defaults depend on deployment and CSP requirements not yet approved.
- Self-hosted health/readiness scope depends on Phase 00 deployment decisions.

**Required implementation-plan split**

1. Environment contract and validation.
2. Structured logging and redaction.
3. HTTP security headers and tests.
4. Self-hosted runtime lifecycle, only if in scope.
5. Bundle and performance diagnostics.

### `09-release-documentation-and-governance.md`

**Strengths**

- Includes trusted publishing, provenance, release rehearsal, ownership, and
  maintenance cadence.
- Requires documentation commands to reflect the actual repository.

**Blocking gaps**

- Registry and public-package decisions are not approved.
- Changesets automation model is not selected.
- Exact CODEOWNERS teams/users cannot be invented by an implementer.
- Release rollback and deprecation policies need maintainer decisions.

**Required implementation-plan split**

1. Release automation and trusted publishing.
2. Documentation refresh with executable command checks.
3. Ownership and maintenance governance.

### `10-final-production-qualification.md`

**Strengths**

- Defines a strong fresh-clone sequence and evidence inventory.
- Correctly requires post-coverage lint/format, initialized-template checks,
  external package consumers, and cold/warm cache validation.

**Blocking gaps**

- This is a qualification protocol, not an implementation plan.
- Exact command names do not exist yet and must be copied from completed
  earlier phases.
- Pass criteria for accepted audit exceptions and optional OS matrices need
  approved values.
- Sign-off identities and evidence retention location are unresolved.

**Recommended final form**

- Keep this document as the qualification specification.
- After Plans 00-09 are implemented, generate a short executable qualification
  plan referencing the final command interfaces instead of predicting them.

## Cross-plan issues

### 1. Naming and status

The current documents use “Plan” in their titles while functioning as phase
briefs. Until task-level implementation plans exist, their status should be
understood as `Proposed phase brief`, not `Ready to execute`.

### 2. Missing design approval gate

No phase should proceed directly from these documents to implementation. The
architectural flow requires an approved design/spec first, followed by an
implementation plan and execution-method choice.

### 3. Decisions are still delegated to implementers

Target versions, package formats, public packages, deployment support,
dependency bot, browser-test approach, registry, and owners remain open. An
implementation plan must decide these rather than use “if appropriate” or
“where supported.”

### 4. Tasks are not right-sized

Several checklist items combine configuration, implementation, testing, and
documentation. A Superpowers task must be independently reviewable and end in
its own red-green test cycle and commit boundary.

### 5. Interfaces are not defined

Later plans depend on commands such as `test:package`, `test:storybook`,
`test:e2e`, `verify:full`, and `audit:security`, but no earlier task formally
produces their names and behavior.

## Recommended artifact structure

Keep the user-selected `docs/plans` directory for roadmap material, and use the
Superpowers conventions for approved design and implementation artifacts:

```text
docs/
  plans/
    README.md
    SUPERPOWERS_REVIEW.md
    00-...md through 10-...md       # phase briefs
  superpowers/
    specs/
      YYYY-MM-DD-<phase>-design.md
    plans/
      YYYY-MM-DD-<phase>-implementation.md
```

User preference may keep implementation plans under `docs/plans`; if so, use a
distinct `*-implementation.md` suffix and retain the required Superpowers
header.

## Required next gate

Before creating the first executable implementation plan, the maintainer must
review and approve the decisions in
`00-architecture-decisions-and-baseline.md`. After approval:

1. Write the production-ready template design spec.
2. Run the spec self-review for placeholders, contradictions, scope, and
   ambiguity.
3. Ask for written-spec approval.
4. Use `superpowers:writing-plans` to create the first task-level
   implementation plan.
5. Ask the maintainer to choose native or subagent-driven execution.

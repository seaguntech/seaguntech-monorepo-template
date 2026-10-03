# P0 Production Readiness Design

Status: Approved in conversation; pending written-spec review  
Date: 2026-10-03  
Roadmap: `docs/plans/README.md`

## Purpose

Establish a safe, reproducible baseline before the repository begins broad
dependency modernization. P0 removes applicable critical security exposure,
pins the supported development toolchain, and makes quality gates independent
of generated artifacts and prior local state.

P0 does not attempt to complete every production-readiness improvement. It
creates the trustworthy foundation required for the P1 modernization and test
expansion work.

## Approved approach

Use a security-first incremental approach:

1. Patch security-critical dependency paths.
2. Verify the patched runtime and development-tool baseline.
3. Pin Node, pnpm, and dependency-build behavior.
4. Prove clean-install reproducibility.
5. Make coverage, lint, and formatting gates deterministic.
6. Run a cold P0 qualification with no remote cache.

Each subsystem is implemented and reviewed independently. Security fixes must
not be combined with unrelated refactors or major ecosystem migrations.

## Approved platform decisions

- Node 24 LTS is the development and CI baseline.
- pnpm is pinned to an exact version and activated through Corepack.
- The repository remains an ESM-first monorepo.
- `packages/ui`, `packages/utils`, and `packages/logger` are the intended public
  packages; shared configuration packages remain private.
- The web application must remain compatible with Vercel and self-hosted Node.
- Renovate is the preferred dependency automation system, using grouped
  ecosystem updates and separate security updates.
- Playwright is the approved browser/E2E framework, but the full suite belongs
  to P1.
- Storybook 10 is the P1 target. P0 performs only the minimum Storybook-related
  changes required to retain a secure compatible build.
- Linux is the required CI platform. Windows package-consumer validation may be
  added in P1 for public-package compatibility.
- Changesets with trusted publishing and provenance is the intended release
  model; implementation belongs to a later phase.

## Scope

P0 contains three independently reviewable subsystems.

### Subsystem A: Security unblock

Patch known applicable critical and high-risk dependency paths without
performing broad modernization.

Responsibilities:

- Move Next.js from the vulnerable 16.1.x baseline to a patched supported 16.x
  release. The implementation plan must resolve the latest patched 16.x version
  available at execution time and record it explicitly before editing files.
- Move Vitest beyond the known critical UI file-read/execution vulnerability.
- Patch compatible Vite, PostCSS, Rollup, Sharp, WebSocket, glob, and related
  transitive paths where direct dependency updates resolve current advisories.
- Classify every remaining advisory as runtime, build-time, development-only,
  or unreachable.
- Introduce an audit policy that blocks applicable critical and high findings.
- Require every accepted exception to record the advisory, dependency path,
  reachability assessment, mitigation, owner, review date, and expiry date.
- Configure Renovate so security updates are opened separately from grouped
  maintenance updates.

Non-goals:

- Storybook 10 migration.
- ESLint 10 migration.
- Full Vite/Vitest major modernization where a patch/minor security correction
  is sufficient.
- UI refactoring or design changes.

### Subsystem B: Deterministic toolchain

Make local and CI execution use the same supported runtime and dependency
installer behavior.

Responsibilities:

- Pin Node 24 LTS consistently in version-manager files, package engines, CI,
  and documentation.
- Pin pnpm to one exact version through `packageManager` and Corepack.
- Define the supported package-manager invocation for fresh clones.
- Review packages whose install scripts are currently blocked and commit an
  explicit pnpm build-script allowlist for only the dependencies required by
  verified builds.
- Ensure a second frozen install does not change `pnpm-lock.yaml` or any tracked
  file.
- Choose a stable Turbo agent-guidance policy so repository-scoped commands do
  not unexpectedly dirty `AGENTS.md`.

Non-goals:

- Turbo remote cache.
- Changed-package CI optimization.
- Workspace boundary enforcement.
- Multi-OS support expansion.

### Subsystem C: Deterministic quality gates

Ensure quality results do not depend on whether a developer previously ran
coverage or another generated-output command.

Responsibilities:

- Apply recursive generated-artifact ignores to shared ESLint and Prettier
  configuration.
- Ensure workspace-local execution respects the same ignore policy as root
  execution.
- Add a regression sequence that runs coverage, lint, format, and a tracked-file
  cleanliness check in that order.
- Add the minimum P0 CI gates for formatting, coverage, and dependency audit.
- Preserve existing build, lint, test, and typecheck semantics outside the
  generated-artifact correction.

Non-goals:

- Honest full UI component coverage expansion; this belongs to P1.
- Storybook runtime accessibility tests.
- Full Playwright production-preview coverage.
- Turbo affected-task optimization.

## Architecture and boundaries

P0 is intentionally sequential:

```text
Recorded baseline
  -> Security unblock
  -> Patched baseline verification
  -> Toolchain pinning
  -> Clean-install reproducibility
  -> Quality-gate determinism
  -> Cold P0 qualification
```

Subsystem output contracts:

- Security unblock produces an explicit dependency baseline, audit report, and
  exception record format consumed by CI work.
- Deterministic toolchain produces the Node/pnpm/build-script contract consumed
  by local verification and CI.
- Deterministic quality gates produce stable commands that P1 and later phases
  can treat as trusted prerequisites.

No subsystem may silently widen another subsystem's scope. Compatibility work
that requires a major migration moves to P1 unless leaving it out would retain
an applicable critical vulnerability.

## Security data flow

Security findings flow through the following states:

```text
Audit finding
  -> dependency path classification
  -> applicability and reachability assessment
  -> patched OR accepted exception
  -> CI enforcement
```

An audit exit code alone is not the policy. CI must distinguish an unexpected
applicable finding from a reviewed exception. Exceptions are version-controlled
and expire; an expired exception is treated as a failure.

The production audit and full dependency audit remain separate signals because
shared tooling packages can cause development dependencies to appear in the
workspace production graph. Classification must be based on the actual path and
usage, not only the aggregate severity count.

## Failure handling and stop conditions

- If a security patch changes public APIs or production behavior unexpectedly,
  stop that subsystem and isolate the dependency-family change.
- If patching Storybook/Vite requires a Storybook major migration, defer the
  migration to P1 and apply only the minimum safe compatible correction in P0.
- If an applicable critical or high advisory remains, P0 cannot pass without a
  time-bounded approved exception containing reachability evidence.
- If the second frozen install changes the lockfile or tracked files, the
  deterministic-toolchain subsystem fails.
- If coverage causes lint, format, or tracked-file cleanliness to fail, the
  deterministic-quality subsystem fails.
- If Turbo modifies `AGENTS.md` or another tracked instruction file during
  verification, the agent-guidance policy is incomplete and P0 fails.
- If validation succeeds only with remote cache or pre-existing build outputs,
  P0 fails.

## Testing strategy

### Security regression

- Capture the audit and installed-version evidence before each patch.
- Apply one dependency-family correction.
- Run frozen install, typecheck, unit tests, Next.js production build, and
  Storybook production build.
- Re-run production and full audits and compare applicable paths.

### Toolchain reproducibility

- Run from a temporary clean copy using the approved Node and pnpm versions.
- Perform a frozen install twice.
- Confirm the second install changes no tracked file.
- Run the repository build with only the approved dependency build scripts.
- Confirm repository-scoped Turbo commands do not create tracked changes.

### Quality-gate regression

Run this state-sensitive order:

```text
test:coverage -> lint -> format -> tracked-file cleanliness
```

The sequence must pass from a clean copy and when repeated. Generated coverage
reports may exist locally, but they must not be linted, formatted, or committed.

### P0 qualification

Run a cold, no-remote-cache validation containing:

- Frozen install.
- Security policy check.
- Lint.
- Format check.
- Typecheck.
- Unit tests.
- Coverage.
- Next.js production build.
- Storybook production build.
- Post-coverage lint and format regression.
- Tracked-file cleanliness check.

## P0 acceptance criteria

- Zero unaccepted applicable critical vulnerabilities.
- Zero unaccepted applicable high runtime vulnerabilities.
- Every remaining exception has complete metadata and has not expired.
- Node 24 LTS and one exact pnpm version are used locally and in CI.
- Required dependency build scripts are explicitly allowlisted; no broad
  allow-all policy exists.
- Two consecutive frozen installs leave tracked files unchanged.
- Coverage followed by lint and format passes repeatedly.
- Turbo verification does not dirty tracked instruction files.
- Next.js and Storybook production builds pass from a cold clean copy.
- Remote cache is not required for any P0 evidence.

## Deliverables

- Three task-level implementation plans, one per subsystem.
- Updated dependency manifests and lockfile for approved security corrections.
- Version-controlled Node, pnpm, build-script, and Turbo agent-guidance policy.
- Recursive generated-artifact ignore behavior.
- CI formatting, coverage, and audit gates.
- Security audit classification and exception documentation.
- Cold P0 qualification evidence.

## Deferred to P1

- Storybook 10 migration and complete story/a11y enforcement.
- Full Vite/Vitest and ESLint major modernization.
- Honest UI component coverage expansion.
- Package tarball consumer harness.
- Playwright production-preview suite.
- Turbo boundaries, affected execution, and remote cache.
- Complete CI supply-chain hardening and release automation.

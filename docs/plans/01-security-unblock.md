# Plan 01: Security Unblock

Status: Proposed  
Priority: P0  
Dependencies: Plan 00

## Objective

Remove known critical runtime and development-tool vulnerabilities with the
smallest safe change set before broad modernization.

## Scope

- Patch Next.js to a release containing all applicable critical fixes.
- Patch Vitest beyond the known UI file-read/execution vulnerability.
- Patch applicable Vite, PostCSS, Rollup, Sharp, WebSocket, and glob-related
  advisories resolved through direct dependency updates.
- Establish automated security maintenance and exception handling.

## Work items

- [ ] Re-run production and full dependency audits from the approved Node/pnpm
      environment.
- [ ] Classify each advisory as runtime, build-time, local-development, or
      unreachable.
- [ ] Upgrade Next.js in a security-only PR and run production E2E smoke tests.
- [ ] Upgrade Vitest/Vite patches necessary to remove critical paths.
- [ ] Regenerate the lockfile with the pinned toolchain.
- [ ] Document unresolved transitive advisories with exploitability analysis.
- [ ] Add a CI security audit with agreed severity thresholds.
- [ ] Configure Renovate or Dependabot for immediate security PRs.
- [ ] Update `SECURITY.md` with supported versions and response expectations.

## Required tests

- Frozen clean install.
- Next.js production build and preview smoke test.
- Unit and coverage suites.
- Storybook production build.
- `pnpm audit --prod` and full audit report.
- Lockfile unchanged after a second frozen install.

## Acceptance criteria

- Zero unaccepted critical vulnerabilities.
- Zero unaccepted high runtime vulnerabilities.
- Every remaining advisory has scope, mitigation, owner, and expiry.
- Security PRs are not mixed with formatting or architecture refactors.
- The dependency bot opens a validated test PR.

## Rollback strategy

- Revert individual dependency-family PRs rather than the entire lockfile
  modernization.
- Retain the last known-safe lockfile artifact until qualification completes.

## Stop conditions

- Stop if a patch release changes public APIs or build output unexpectedly.
- Stop and isolate the ecosystem if Storybook and Vite compatibility requires a
  major migration.

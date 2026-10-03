# Plan 06: CI/CD and Supply-Chain Security

Status: Proposed  
Priority: P1  
Dependencies: Plans 01, 03, and 05

## Objective

Make CI the authoritative production gate with reproducible installation,
least privilege, immutable dependencies, and useful failure evidence.

## Required CI jobs

- [ ] Install integrity/frozen lockfile.
- [ ] Lint.
- [ ] Format.
- [ ] Typecheck.
- [ ] Unit tests.
- [ ] Coverage thresholds.
- [ ] Package-contract tests.
- [ ] Storybook build and accessibility validation.
- [ ] Production E2E smoke tests.
- [ ] Security audit.
- [ ] Template initialization smoke test.
- [ ] Production build.

## Workflow hardening

- [ ] Set top-level `permissions: contents: read`.
- [ ] Grant additional permissions only to the exact job that needs them.
- [ ] Pin third-party actions to full commit SHAs.
- [ ] Add workflow timeouts and concurrency cancellation.
- [ ] Prevent fork PRs from reaching secrets or privileged workflows.
- [ ] Avoid printing full environment or secret-bearing command output.
- [ ] Set artifact retention and upload only actionable reports.
- [ ] Add CODEOWNERS review for workflows and release files.

## Reproducibility and performance

- [ ] Pin Node and pnpm in one shared setup action.
- [ ] Use frozen lockfile installation.
- [ ] Cache the pnpm store, not `node_modules`.
- [ ] Run scheduled cold installs/builds.
- [ ] Introduce Turbo affected execution only after all full gates pass.
- [ ] Keep full validation on main and nightly schedules.
- [ ] Measure CI duration before adding remote cache.

## Branch protection

- [ ] Require all production gates.
- [ ] Require review and resolved conversations.
- [ ] Use merge queue or require the branch to be current.
- [ ] Protect main and release tags from force-push.
- [ ] Separate validation from deployment authorization.

## Acceptance criteria

- A PR cannot merge when any required gate fails.
- Normal PR validation requires no deployment secret.
- Workflow permissions pass a manual least-privilege review.
- Action updates are automated and reviewable.
- A clean runner reproduces local full verification.

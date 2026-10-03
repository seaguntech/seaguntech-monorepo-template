# Plan 09: Release, Documentation, and Governance

Status: Proposed  
Priority: P2  
Dependencies: Plans 04, 06, 07, and 08

## Objective

Make releases and long-term maintenance safe for maintainers other than the
original author.

## Release workflow

- [ ] Validate required Changesets on relevant PRs.
- [ ] Build and run package-contract tests before publish.
- [ ] Inspect package tarballs before release.
- [ ] Use npm trusted publishing and provenance where supported.
- [ ] Avoid long-lived registry tokens.
- [ ] Generate GitHub releases and tags from the approved process.
- [ ] Document rollback, deprecation, and emergency security release paths.
- [ ] Perform a full release rehearsal without publishing.

## Documentation

- [ ] Update `GETTING_STARTED.md`.
- [ ] Update `ARCHITECTURE.md`.
- [ ] Update `DEVELOPMENT.md`.
- [ ] Add `TESTING.md`.
- [ ] Update `SECURITY.md`.
- [ ] Update `RELEASE.md`.
- [ ] Add `PRODUCTION_READINESS.md`.
- [ ] Add `DEPENDENCY_POLICY.md`.
- [ ] Add `TROUBLESHOOTING.md`.
- [ ] Add guides for adding an app and adding a package.

## Governance and ownership

- [ ] Add CODEOWNERS for CI, configs, design system, releases, and security.
- [ ] Define required reviewers for sensitive files.
- [ ] Document support and deprecation timelines.
- [ ] Define weekly security, monthly maintenance, and quarterly major-review
      cadences.
- [ ] Schedule a periodic clean-build and dependency-health report.

## Documentation quality rules

- Commands must be copyable and exercised by CI where practical.
- Examples must match the current package names and versions.
- Cloud and deployment actions must distinguish local proof from deployed proof.
- Troubleshooting must include expected errors and stop conditions.

## Acceptance criteria

- A new maintainer can initialize, validate, and rehearse a release using docs.
- Publishing credentials are short-lived or federated.
- Every critical path has an owner.
- Dependency drift and support-window changes are reviewed on a schedule.
- No documentation command contradicts package scripts or CI.

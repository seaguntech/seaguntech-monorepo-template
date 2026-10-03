# Plan 10: Final Production Qualification

Status: Proposed  
Priority: Final gate  
Dependencies: Plans 00-09

## Objective

Produce repository-grounded evidence that the template is production-ready and
that an initialized project retains the same guarantees.

## Qualification environments

- Approved Node LTS and pnpm version.
- Clean Linux CI runner.
- Optional Node 22 or Windows compatibility runner if approved in Plan 00.
- Temporary directories without workspace links or developer-global state.

## Required sequence

1. Clone or copy from a clean commit.
2. Enable the approved package manager.
3. Run frozen install.
4. Run lint and format.
5. Run typecheck.
6. Run unit and component tests.
7. Run coverage gates.
8. Run lint and format again after coverage.
9. Build Storybook and execute accessibility checks.
10. Run package tarball consumer tests.
11. Build the production web application.
12. Run production-preview E2E smoke tests.
13. Run production and full security audits.
14. Run template initialization in a temporary copy.
15. Repeat install, validation, build, and package tests in the initialized copy.
16. Confirm lockfiles and tracked files are unchanged.
17. Run a clean cold build and a warm cached build.

## Evidence to retain

- Toolchain versions.
- CI run URLs or exported summaries.
- Audit report and approved exceptions.
- Coverage summary by package.
- Storybook/a11y result.
- E2E result and failure artifacts policy.
- Package tarball inventories and consumer results.
- Initialized-template verification result.
- Cold and cached Turbo summaries.

## Final release gates

- [ ] Zero unaccepted critical vulnerabilities.
- [ ] Zero unaccepted high applicable vulnerabilities.
- [ ] All branch-protection checks pass.
- [ ] Coverage measures intended source and meets thresholds.
- [ ] Storybook and accessibility validation pass.
- [ ] Production E2E smoke tests pass.
- [ ] Package consumers pass outside the workspace.
- [ ] Template initialization smoke passes.
- [ ] Documentation review passes.
- [ ] Fresh clone is reproducible.
- [ ] No hidden manual step is required.

## Sign-off record

Record:

- Commit SHA qualified.
- Date and toolchain versions.
- Reviewers for architecture, security, CI, UI/a11y, and release.
- Accepted risks and expiry dates.
- Final decision: pass, conditional pass, or fail.

## Definition of 10/10

The score is earned by repeatable evidence, not by dependency freshness alone.
Any failed required gate, undocumented exception, non-reproducible clean install,
or unverified initialized template prevents a 10/10 designation.

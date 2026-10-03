# Plan 07: Template Initialization and Developer Experience

Status: Proposed  
Priority: P1/P2  
Dependencies: Plans 03, 04, and 06

## Objective

Make clone-to-running-project safe, repeatable, documented, and automatically
tested.

## Init-script scenarios

- [ ] Interactive initialization.
- [ ] Non-interactive `--yes` initialization.
- [ ] Dry run with a clear change summary.
- [ ] Forced reinitialization.
- [ ] Custom project name, npm scope, owner, repository, and email.
- [ ] Invalid and missing arguments.
- [ ] Second execution after successful initialization.
- [ ] Interrupted or failed execution.
- [ ] Paths and valid metadata containing special characters.

## Safety and atomicity

- [ ] Validate every input before the first write.
- [ ] Build a deterministic change plan.
- [ ] Avoid binary, generated, dependency, and VCS directories.
- [ ] Write the initialized sentinel only after all changes succeed.
- [ ] Avoid leaving a half-initialized repository.
- [ ] Make dry-run output suitable for review.
- [ ] Explicitly define lockfile handling.

## Template smoke fixture

CI should:

1. Copy the repository to a temporary directory.
2. Remove VCS metadata from the copy.
3. Initialize with fixture metadata.
4. Assert old branding is absent from product-facing files.
5. Perform a frozen install.
6. Run lint, format, typecheck, tests, build, and package-contract tests.
7. Confirm the fixture worktree is clean after expected generated cleanup.

## Developer commands

- [ ] Add `doctor` for version and configuration diagnostics.
- [ ] Add `verify:quick` for local feedback.
- [ ] Add `verify:full` matching required CI gates.
- [ ] Add discoverable package, Storybook, and E2E test commands.
- [ ] Keep orchestration in Turbo or tested Node scripts rather than a long shell
      chain.

## Acceptance criteria

- A new project requires no manual search-and-replace.
- Dry run performs no writes.
- Re-running initialization has defined behavior.
- CI validates an initialized copy, not only the source template.
- Error messages identify the invalid input and recovery action.

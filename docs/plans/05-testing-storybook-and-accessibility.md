# Plan 05: Testing, Coverage, Storybook, and Accessibility

Status: Proposed  
Priority: P1  
Dependencies: Plans 02 and 04

## Objective

Replace misleading or incomplete quality signals with tests that cover package
logic, UI behavior, accessibility, and production execution.

## Work items

### Artifact hygiene

- [ ] Add recursive coverage ignores to shared ESLint and Prettier config.
- [ ] Ignore all generated build, test, and report directories consistently.
- [ ] Add a regression sequence: coverage, lint, format, then clean status.

### Coverage policy

- [ ] Remove UI `coverage.all: false` unless a narrower explicit include replaces
      it.
- [ ] Define source includes and justified excludes per package.
- [ ] Start with meaningful thresholds and ratchet them upward.
- [ ] Report branch, function, line, and statement coverage separately.
- [ ] Prevent barrel/type-only files from distorting the score.

### Unit and component tests

- [ ] Test UI variants, disabled state, loading state, focus, keyboard behavior,
      and Slot/asChild behavior.
- [ ] Test logger serialization, redaction, child context, and failure paths.
- [ ] Test utility edge cases and public exports.
- [ ] Test init-script pure functions and validation.

### Storybook

- [ ] Use one supported Storybook version family.
- [ ] Add typed stories and autodocs for every shared visual component.
- [ ] Cover default, variants, disabled, loading, empty, error, long-content,
      light, and dark states where applicable.
- [ ] Enforce addon-a11y with `test: 'error'`.
- [ ] Require rationale for every disabled accessibility rule.

### Browser and E2E validation

- [ ] Prefer supported Storybook/Vitest browser integration when compatible.
- [ ] Otherwise use Playwright to render critical stories and run axe checks.
- [ ] Add production-preview smoke tests for home, theme persistence, 404,
      assets, navigation, and console errors.
- [ ] Upload screenshots/traces only on failure unless visual baselines are
      formally adopted.

## Acceptance criteria

- UI coverage measures component source, not only the `cn` utility.
- Coverage followed by lint and format remains green.
- Accessibility violations fail CI.
- Production preview has at least one critical-path E2E suite.
- Tests are deterministic and do not require developer-global state.

## Stop conditions

- Do not enable unstable Storybook browser tooling that conflicts with the
  approved Vite version.
- Do not accept snapshot volume as a substitute for behavioral assertions.

# Production-Ready Template Roadmap

Status: Proposed

This directory contains the roadmap and phase briefs for turning this
repository into a production-ready, modern internal starter. The briefs are
intentionally split so each phase can be reviewed and prioritized
independently. They are not task-level implementation plans until the phase has
an approved design and a corresponding `superpowers:writing-plans` artifact.

See [SUPERPOWERS_REVIEW.md](./SUPERPOWERS_REVIEW.md) for the conformance review,
blocking decisions, and required transition from phase brief to executable
implementation plan.

## Target outcome

The template is considered complete only when a fresh clone can be initialized,
installed, validated, built, packaged, and smoke-tested without undocumented
manual steps or security exceptions without an owner and expiry date.

## Phase briefs

| Order | Plan                                                                                           | Priority   | Depends on         |
| ----- | ---------------------------------------------------------------------------------------------- | ---------- | ------------------ |
| 00    | [Architecture decisions and baseline](./00-architecture-decisions-and-baseline.md)             | P0         | None               |
| 01    | [Security unblock](./01-security-unblock.md)                                                   | P0         | 00                 |
| 02    | [Toolchain and dependency modernization](./02-toolchain-and-dependency-modernization.md)       | P0/P1      | 00, 01             |
| 03    | [Turborepo and workspace architecture](./03-turborepo-and-workspace-architecture.md)           | P1         | 00, 02             |
| 04    | [Package correctness and publishing](./04-package-correctness-and-publishing.md)               | P1         | 02, 03             |
| 05    | [Testing, coverage, Storybook, and accessibility](./05-testing-storybook-and-accessibility.md) | P1         | 02, 04             |
| 06    | [CI/CD and supply-chain security](./06-ci-cd-and-supply-chain-security.md)                     | P1         | 01, 03, 05         |
| 07    | [Template initialization and developer experience](./07-template-initialization-and-dx.md)     | P1/P2      | 03, 04, 06         |
| 08    | [Production application baseline](./08-production-application-baseline.md)                     | P2         | 02, 05, 06         |
| 09    | [Release, documentation, and governance](./09-release-documentation-and-governance.md)         | P2         | 04, 06, 07, 08     |
| 10    | [Final production qualification](./10-final-production-qualification.md)                       | Final gate | All previous plans |

## Milestones

### Milestone A: Safe development baseline

- Plans 00-01 complete.
- Critical runtime vulnerabilities removed.
- Node and pnpm policy agreed.

### Milestone B: Modern internal starter

- Plans 02-05 complete.
- Supported dependency families are aligned.
- Package and test signals are trustworthy.

### Milestone C: Production-ready template

- Plans 06-10 complete.
- CI enforces all required gates.
- Fresh-clone and initialized-template qualification passes.

## Global implementation rules

- Use one focused pull request per upgrade family or risk boundary.
- Preserve unrelated working-tree changes.
- Start each implementation PR with a failing test or reproducible gate where
  practical.
- Do not combine security patches with unrelated refactors.
- Keep task logic in workspaces; root scripts should orchestrate with
  `turbo run`.
- Every exception needs a rationale, owner, review date, and expiry date.
- A green cached build never replaces a clean cold build.

## Superpowers approval flow

For each phase:

1. Review and approve its scope and unresolved decisions.
2. Create and review the phase design/spec.
3. Create a task-level implementation plan with exact files, interfaces,
   red-green tests, verification commands, and commit boundaries.
4. Choose native or subagent-driven execution.
5. Implement only after those gates are complete.

## Approved P0 artifacts

- [P0 design spec](../superpowers/specs/2026-10-03-p0-production-readiness-design.md)
- [Security unblock implementation plan](../superpowers/plans/2026-10-03-p0-security-unblock-implementation.md)
- [Deterministic toolchain implementation plan](../superpowers/plans/2026-10-03-p0-deterministic-toolchain-implementation.md)
- [Deterministic quality-gates implementation plan](../superpowers/plans/2026-10-03-p0-deterministic-quality-gates-implementation.md)

## Global definition of done

- No unaccepted critical or high vulnerabilities on applicable paths.
- Frozen install, lint, format, typecheck, unit tests, coverage, Storybook,
  package-contract tests, E2E smoke tests, and production build pass.
- Running coverage before lint and format does not change their results.
- Public package tarballs work outside the workspace.
- Template initialization is validated from a temporary clean copy.
- Required GitHub checks protect the default branch.
- Documentation commands are exercised by automation where possible.

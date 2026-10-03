# Plan 00: Architecture Decisions and Baseline

Status: Proposed  
Priority: P0  
Dependencies: None

## Objective

Define the support contract and measurable production-readiness baseline before
changing major dependency families.

## Decisions to approve

| Topic                 | Recommended default                    | Alternative requiring an explicit decision |
| --------------------- | -------------------------------------- | ------------------------------------------ |
| Node                  | Node 24 LTS                            | Also test Node 22 LTS                      |
| Package manager       | Exact pnpm version through Corepack    | Floating pnpm 10 range                     |
| Module format         | ESM-first                              | Dual ESM/CJS for verified consumers        |
| Deployment            | Vercel and self-hosted Node compatible | Vercel-only                                |
| Public packages       | `ui`, `utils`, `logger`                | All packages remain internal               |
| Dependency automation | Renovate with grouped ecosystems       | Dependabot                                 |
| Browser testing       | Playwright                             | Vitest Browser only                        |
| Storybook             | Storybook 10, one version family       | Retain Storybook 8 security-only line      |
| CI OS                 | Linux required                         | Add Windows package-contract matrix        |
| Releases              | Changesets and npm provenance          | Private registry workflow                  |

## Work items

- [ ] Add a support matrix for Node, pnpm, operating systems, package formats,
      and deployment targets.
- [ ] Define which packages are publishable, internal, or application-only.
- [ ] Define runtime, development, and CI compatibility promises.
- [ ] Define vulnerability severity policy and exception format.
- [ ] Record non-goals, especially infrastructure and product-specific choices.
- [ ] Capture the current clean-install, test, build, audit, and outdated report.
- [ ] Define the required checks that will eventually protect the default branch.
- [ ] Create `docs/PRODUCTION_READINESS.md` from the approved decisions.

## Deliverables

- Approved Architecture Decision Records or an equivalent decision section.
- Version and support matrix.
- Baseline quality and security report.
- Explicit definition of production-ready for this template.

## Acceptance criteria

- Every planned major upgrade maps to an approved support decision.
- “Latest” is not used as a support policy.
- Public-package and deployment scope are unambiguous.
- Security exceptions have an owner and expiry date.
- Reviewers can decide whether a later PR is in or out of scope.

## Verification

- Review the decisions against all package manifests and current CI workflows.
- Confirm documentation does not contradict `.nvmrc`, `package.json`, or
  `pnpm-workspace.yaml`.
- Obtain explicit maintainer approval before Plan 02 major upgrades.

## Stop conditions

- Stop if public/private package scope is unresolved.
- Stop if Node or Storybook target versions are unresolved.
- Stop before deployment-specific work unless supported targets are approved.

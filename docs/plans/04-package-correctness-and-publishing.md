# Plan 04: Package Correctness and Publishing

Status: Proposed  
Priority: P1  
Dependencies: Plans 02-03

## Objective

Verify packages as external consumers receive them, not only as linked workspace
dependencies.

## Work items

### Package classification

- [ ] Mark each workspace as public, private infrastructure, or application-only.
- [ ] Define supported Node, module, and framework versions per public package.
- [ ] Confirm package ownership and release policy.

### Export contracts

- [ ] Remove or create the missing `./nextjs.json` TypeScript-config export.
- [ ] Audit `main`, `module`, `types`, `exports`, `files`, and `sideEffects`.
- [ ] Decide ESM-only versus tested ESM/CJS output.
- [ ] Remove misleading `require` conditions if CJS is not supported.
- [ ] Verify CSS and subpath exports.

### Dependency classification

- [ ] Move host frameworks to peer dependencies where appropriate.
- [ ] Keep build/test tools in dev dependencies.
- [ ] Keep runtime libraries in dependencies only when shipped behavior needs
      them.
- [ ] Review logger dependencies and production bundle impact.

### Pack-and-consume tests

For every publishable package:

- [ ] Build and create a package tarball.
- [ ] Install the tarball into a temporary consumer outside the workspace.
- [ ] Test ESM import.
- [ ] Test CommonJS require only if supported.
- [ ] Test TypeScript resolution and declarations.
- [ ] Test Next.js consumption for React/UI packages.
- [ ] Test stylesheet exports.
- [ ] Inspect tarball contents for accidental files or secrets.

## Acceptance criteria

- No export points to a missing file.
- Tarball consumers do not rely on workspace links.
- Module formats and type declarations match package metadata.
- Published files are minimal and intentional.
- Public package README examples compile in the consumer fixture.

## Verification commands to provide

- A package-level `test:package` script.
- A root `test:package` Turbo orchestration command.
- A CI artifact or log containing tarball file inventories.

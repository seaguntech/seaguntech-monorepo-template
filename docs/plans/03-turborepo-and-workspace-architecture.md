# Plan 03: Turborepo and Workspace Architecture

Status: Proposed  
Priority: P1  
Dependencies: Plans 00 and 02

## Objective

Make task execution, caching, environment hashing, and package boundaries
correct and predictable.

## Work items

### Configuration

- [ ] Update the Turbo schema to the installed version.
- [ ] Decide whether to commit Turbo agent guidance or set
      `agentGuidance: false`.
- [ ] Audit inputs, outputs, environment variables, persistence, and caching for
      every task.
- [ ] Keep task implementation in workspaces and root scripts as orchestration.

### Task graph

- [ ] Confirm `build` depends on upstream builds only where artifacts are used.
- [ ] Use transit nodes for lint/type/test ordering when appropriate.
- [ ] Avoid forcing tests or lint to build unrelated packages.
- [ ] Mark development servers persistent and interruptible as appropriate.
- [ ] Ensure fix/clean tasks are never cached.

### Environment correctness

- [ ] Declare cache-affecting environment variables explicitly.
- [ ] Keep secrets out of cached outputs and logs.
- [ ] Ensure `.env` files affect only tasks that consume them.
- [ ] Add cache-debug documentation using dry-run or summaries.

### Boundaries

- [ ] Define allowed dependency direction between apps, packages, and configs.
- [ ] Prevent cross-package source deep imports.
- [ ] Add Turbo boundaries or equivalent static checks.
- [ ] Ensure shared packages never import application code.

### CI optimization

- [ ] Introduce `--affected` only after full CI is reliable.
- [ ] Run full cold validation on main and scheduled builds.
- [ ] Configure the correct SCM base explicitly.
- [ ] Evaluate remote cache after correctness is proven.

## Acceptance criteria

- Cold and cached builds produce equivalent results.
- A second build demonstrates expected cache hits.
- Changing a relevant env variable invalidates the correct tasks only.
- Boundary violations fail with actionable errors.
- Running Turbo does not silently dirty tracked files.
- Root scripts consistently use `turbo run` for committed commands.

## Verification

- Execute clean, cold, warm-cache, and changed-package scenarios.
- Compare Turbo dry-run task graphs before and after configuration changes.
- Test at least one intentional boundary violation in a fixture.

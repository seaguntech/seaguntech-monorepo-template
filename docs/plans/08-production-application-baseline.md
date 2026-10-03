# Plan 08: Production Application Baseline

Status: Proposed  
Priority: P2  
Dependencies: Plans 02, 05, and 06

## Objective

Provide secure and observable application defaults without forcing a
product-specific backend, authentication provider, or deployment platform.

## Environment management

- [ ] Add a safe `.env.example` without credentials.
- [ ] Validate server environment variables at startup/build time as appropriate.
- [ ] Separate public and server-only variables.
- [ ] Fail with actionable errors for missing required values.
- [ ] Ensure server secrets cannot enter client bundles.
- [ ] Include relevant variables in Turbo task hashing.

## Logging and errors

- [ ] Use structured JSON logs in production and readable local logs.
- [ ] Define request/correlation ID conventions.
- [ ] Serialize errors consistently.
- [ ] Redact authorization, cookies, tokens, and known PII fields.
- [ ] Add web error and not-found boundaries.
- [ ] Avoid logging full request bodies by default.

## HTTP security baseline

- [ ] Add and test HSTS where HTTPS deployment is guaranteed.
- [ ] Add CSP appropriate to Next.js and Storybook deployment boundaries.
- [ ] Add Referrer Policy, Permissions Policy, and nosniff protection.
- [ ] Define frame-embedding policy.
- [ ] Document secure cookie defaults.
- [ ] Keep remote image and network origins allowlisted.

## Runtime and operations

- [ ] Define health/readiness conventions for self-hosted deployments.
- [ ] Document graceful shutdown requirements.
- [ ] Add production-start smoke validation.
- [ ] Provide container/deployment examples only if approved in Plan 00.

## Performance baseline

- [ ] Add bundle-analysis tooling behind an explicit command.
- [ ] Verify test/Storybook tooling is excluded from production bundles.
- [ ] Add basic route performance evidence.
- [ ] Add a scheduled Lighthouse baseline if useful, without making unstable
      lab scores an early merge blocker.

## Acceptance criteria

- Missing configuration fails safely and clearly.
- Sensitive fields are covered by logger redaction tests.
- Security headers have automated assertions.
- Production bundle inspection finds no unintended development tooling.
- The baseline works on every approved deployment target.

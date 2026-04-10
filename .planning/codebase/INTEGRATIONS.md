# External Integrations

**Analysis Date:** 2026-04-10

## APIs & External Services

**Particle Rendering SDKs:**
- tsParticles engine ecosystem (`@tsparticles/engine`, `tsparticles`, `@tsparticles/configs`) - Client-side particle/confetti/fireworks rendering in demos and wrapper
  - SDK/Client: `@tsparticles/engine`, `tsparticles`, `@tsparticles/configs`
  - Auth: Not applicable (no credentials required in `apps/vue2/src/main.ts`, `apps/vue2/src/App.vue`, `apps/nuxt2/plugins/vue2-particles.ts`, `components/vue2/src/Particles/vue-particles.vue`)

**CDN Assets:**
- jsDelivr Tailwind CSS link - Styling loaded directly in Nuxt tutorial component
  - SDK/Client: `<link href="https://cdn.jsdelivr.net/...">` in `apps/nuxt2/components/Tutorial.vue`
  - Auth: Not applicable

## Data Storage

**Databases:**
- Not detected
  - Connection: Not applicable
  - Client: Not applicable

**File Storage:**
- Local/browser runtime only (no cloud object storage integration detected)

**Caching:**
- CI dependency cache via GitHub Actions cache action (`actions/cache@v3`) for pnpm store in `.github/workflows/nodejs.yml`

## Authentication & Identity

**Auth Provider:**
- Not detected
  - Implementation: Not applicable

## Monitoring & Observability

**Error Tracking:**
- Not detected (no Sentry/Datadog/Bugsnag SDK imports in scanned source)

**Logs:**
- Minimal console logging only in docs example (`README.md` shows `console.log` in sample callback)

## CI/CD & Deployment

**Hosting:**
- GitHub repository + npm distribution for `@tsparticles/vue2` package (`components/vue2/package.json` publish metadata)
- Demo documentation points to `https://particles.js.org` as public demo site (`README.md`, package `homepage` fields)

**CI Pipeline:**
- GitHub Actions workflow in `.github/workflows/nodejs.yml`
  - Trigger: push/pull_request on `main` and `legacy`
  - Toolchain: Node 16, pnpm setup, `pnpm install`, `npx lerna run build:ci`

## Environment Configuration

**Required env vars:**
- None required by application code (no `process.env`/runtime config usage detected in `apps/` and `components/` sources)
- Optional CI secret shown as commented configuration: `NX_CLOUD_ACCESS_TOKEN` in `.github/workflows/nodejs.yml`

**Secrets location:**
- GitHub Actions secrets (inferred from `${{ secrets.NX_CLOUD_ACCESS_TOKEN }}` reference in `.github/workflows/nodejs.yml`)

## Webhooks & Callbacks

**Incoming:**
- None detected (no webhook endpoints or API route handlers in repository)

**Outgoing:**
- None detected (no HTTP clients/fetch/axios/webhook emitters in scanned source)
- Internal plugin callback pattern only: `init` callback passed to `Vue.use(Particles, { init })` in `apps/vue2/src/main.ts`, `apps/nuxt2/plugins/vue2-particles.ts`, consumed in `components/vue2/src/Particles/index.ts`

---

*Integration audit: 2026-04-10*

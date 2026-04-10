# Architecture

**Analysis Date:** 2026-04-10

## Pattern Overview

**Overall:** Monorepo workspace with a publishable Vue 2 plugin package and two consumer demo apps.

**Key Characteristics:**
- Keep reusable runtime logic in the package at `components/vue2/src/Particles/` and consume it from apps under `apps/`.
- Register the plugin via `Vue.use(...)` at app/plugin entry points (`apps/vue2/src/main.ts`, `apps/nuxt2/plugins/vue2-particles.ts`).
- Initialize `tsParticles` asynchronously through a plugin `init` callback and component lifecycle hooks (`components/vue2/src/Particles/index.ts`, `components/vue2/src/Particles/vue-particles.vue`).

## Layers

**Workspace Orchestration Layer:**
- Purpose: Define package boundaries and multi-project build orchestration.
- Location: `package.json`, `pnpm-workspace.yaml`, `lerna.json`, `nx.json`.
- Contains: Workspace definitions, shared build scripts, orchestrator config.
- Depends on: `pnpm`, `lerna`, `nx`.
- Used by: All projects in `apps/*` and `components/*`.

**Library Plugin Layer (`@tsparticles/vue2`):**
- Purpose: Expose Vue 2 plugin install API and `vue-particles` component for npm consumers.
- Location: `components/vue2/src/Particles/index.ts`, `components/vue2/src/Particles/vue-particles.vue`, `components/vue2/src/Particles/event-bus.ts`.
- Contains: Plugin installer, component class, lifecycle-based load/destroy logic, init event coordination.
- Depends on: `vue`, `vue-property-decorator`, `@tsparticles/engine`.
- Used by: Demo apps and external consumers via `@tsparticles/vue2`.

**App Composition Layer (Vue CLI demo):**
- Purpose: Demonstrate direct Vue 2 integration path.
- Location: `apps/vue2/src/main.ts`, `apps/vue2/src/App.vue`.
- Contains: Vue root bootstrap, plugin registration, sample options usage.
- Depends on: `@tsparticles/vue2`, `tsparticles`, `@tsparticles/configs`.
- Used by: Local demo app in `apps/vue2/`.

**App Composition Layer (Nuxt 2 demo):**
- Purpose: Demonstrate Nuxt plugin registration and page/component usage.
- Location: `apps/nuxt2/nuxt.config.js`, `apps/nuxt2/plugins/vue2-particles.ts`, `apps/nuxt2/pages/index.vue`, `apps/nuxt2/components/Tutorial.vue`.
- Contains: Client-only plugin wiring, app config, page-level component composition.
- Depends on: `nuxt`, `@tsparticles/vue2`, `tsparticles`.
- Used by: Local demo app in `apps/nuxt2/`.

**Build/Bundle Layer:**
- Purpose: Produce distributable artifacts for package and app bundles.
- Location: `components/vue2/rollup.config.mjs`, `apps/vue2/package.json` scripts, `apps/nuxt2/package.json` scripts.
- Contains: Rollup bundling for library, Vue CLI build scripts, Nuxt build scripts.
- Depends on: Rollup plugins, Vue CLI service, Nuxt builder.
- Used by: CI workflow and release process.

## Data Flow

**Plugin Initialization Flow:**

1. Register plugin with init callback in `apps/vue2/src/main.ts` or `apps/nuxt2/plugins/vue2-particles.ts` using `Vue.use(Particles, { init })`.
2. Plugin installer in `components/vue2/src/Particles/index.ts` registers the `vue-particles` global component and executes `options.init(tsParticles)`.
3. Installer emits `particles-init` via `components/vue2/src/Particles/event-bus.ts` after init promise resolves.
4. Component in `components/vue2/src/Particles/vue-particles.vue` listens for `particles-init` and also initializes on `mounted`.
5. Component calls `tsParticles.load({ id, options, url })`, stores returned container, and invokes `particlesLoaded` callback if supplied.

**Component Lifecycle Flow:**

1. `created()` subscribes to event bus (`components/vue2/src/Particles/vue-particles.vue`).
2. `mounted()` triggers a first load on next tick (`components/vue2/src/Particles/vue-particles.vue`).
3. `beforeDestroy()` destroys container and unsubscribes from event bus (`components/vue2/src/Particles/vue-particles.vue`).

**State Management:**
- Keep state local to component instances (`container` field in `components/vue2/src/Particles/vue-particles.vue`).
- Use event bus (`components/vue2/src/Particles/event-bus.ts`) for cross-instance init coordination; no Vuex/global store is present.

## Key Abstractions

**VueParticles Plugin Abstraction:**
- Purpose: Encapsulate global component registration and optional engine preload.
- Examples: `components/vue2/src/Particles/index.ts`.
- Pattern: Vue plugin object with `install(...)` entry.

**Particles Component Abstraction:**
- Purpose: Translate Vue props into a tsParticles container lifecycle.
- Examples: `components/vue2/src/Particles/vue-particles.vue`.
- Pattern: Class-style Vue component with typed props (`id`, `options`, `url`, `particlesLoaded`).

**Init Coordination Abstraction:**
- Purpose: Coordinate async engine initialization and delayed component loading.
- Examples: `components/vue2/src/Particles/event-bus.ts`, `components/vue2/src/Particles/index.ts`, `components/vue2/src/Particles/vue-particles.vue`.
- Pattern: Simple Vue instance event bus emitting/listening on `particles-init`.

## Entry Points

**Workspace build entry:**
- Location: `package.json`
- Triggers: `pnpm run build`, `pnpm run build:ci`, `pnpm run build:lerna`, `pnpm run build:nx`
- Responsibilities: Orchestrate package/app build targets across workspaces.

**Library runtime entry:**
- Location: `components/vue2/src/Particles/index.ts`
- Triggers: Consumer import of `@tsparticles/vue2` and `Vue.use(...)`.
- Responsibilities: Register `vue-particles` component and run init callback.

**Vue demo app entry:**
- Location: `apps/vue2/src/main.ts`
- Triggers: Vue CLI app bootstrap.
- Responsibilities: Register plugin, call `loadFull(engine)`, mount root app.

**Nuxt demo plugin entry:**
- Location: `apps/nuxt2/plugins/vue2-particles.ts`
- Triggers: Nuxt client plugin pipeline via `apps/nuxt2/nuxt.config.js`.
- Responsibilities: Register plugin and run `loadFull(engine)` in Nuxt context.

## Error Handling

**Strategy:** Fail fast for missing required props and rely on promise-based async flow.

**Patterns:**
- Throw explicit runtime error when required `id` is absent in `components/vue2/src/Particles/vue-particles.vue`.
- Use async/await for tsParticles loading in `components/vue2/src/Particles/vue-particles.vue` and plugin initialization in `components/vue2/src/Particles/index.ts`.

## Cross-Cutting Concerns

**Logging:** Not implemented in runtime source files (`components/vue2/src/Particles/*.ts`, `components/vue2/src/Particles/*.vue`).
**Validation:** Required prop validation on `id` and explicit guard in `components/vue2/src/Particles/vue-particles.vue`.
**Authentication:** Not applicable; no auth layer detected in this frontend/plugin repository.

---

*Architecture analysis: 2026-04-10*

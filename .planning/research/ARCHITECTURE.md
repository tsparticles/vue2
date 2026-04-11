# Architecture Research

**Domain:** tsParticles Vue2 monorepo modernization (wrapper package + Vue2/Nuxt2 demo apps)
**Researched:** 2026-04-10
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                    Workspace Orchestration Layer                     │
├──────────────────────────────────────────────────────────────────────┤
│  pnpm-workspace  lerna/nx graph  root scripts  CI build pipeline    │
└───────────────────────────────┬──────────────────────────────────────┘
                                │ build + version inputs
┌───────────────────────────────▼──────────────────────────────────────┐
│                    Library Plugin Layer (source of truth)            │
├──────────────────────────────────────────────────────────────────────┤
│  @tsparticles/vue2 package                                              │
│  - install() plugin contract                                             │
│  - vue-particles component lifecycle                                     │
│  - particles-init event coordination                                    │
└───────────────┬───────────────────────────────────────────────┬──────┘
                │ package consumption                           │ package consumption
┌───────────────▼──────────────────────┐        ┌───────────────▼──────────────────────┐
│ App Layer: Vue CLI demo (apps/vue2)  │        │ App Layer: Nuxt2 demo (apps/nuxt2)   │
├───────────────────────────────────────┤        ├───────────────────────────────────────┤
│ main.ts -> Vue.use(Particles, init)  │        │ plugin.ts -> Vue.use(Particles, init) │
│ App.vue uses <vue-particles />        │        │ pages/components use <vue-particles/> │
└───────────────────────────────────────┘        └───────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Workspace orchestration (`pnpm`, Lerna, Nx, root scripts) | Defines project graph, install/build/test order, shared tooling versions | Root `package.json`, `pnpm-workspace.yaml`, `lerna.json`, `nx.json` |
| Wrapper package (`components/vue2`) | Owns Vue 2 plugin API stability and tsParticles runtime bridge | `Particles/index.ts`, `vue-particles.vue`, `event-bus.ts`, Rollup config |
| Demo app: Vue CLI (`apps/vue2`) | Proves direct Vue 2 consumer integration and catches runtime regressions | `src/main.ts`, `src/App.vue`, app-local deps/scripts |
| Demo app: Nuxt 2 (`apps/nuxt2`) | Proves Nuxt plugin lifecycle/client-only integration path | `nuxt.config.js`, `plugins/vue2-particles.ts`, `pages/index.vue` |
| Build/bundle outputs (`dist`, `.nuxt`) | Artifacts for publish and integration validation | Rollup output + app build outputs |

## Recommended Project Structure

```
components/
└── vue2/                    # publishable wrapper package (primary modernization target)
    ├── src/Particles/       # plugin install contract + component lifecycle
    ├── rollup.config.mjs    # package bundling boundary
    └── package.json         # package-level dependency contract

apps/
├── vue2/                    # direct Vue 2 integration validation app
└── nuxt2/                   # Nuxt 2 integration validation app

root/
├── package.json             # workspace scripts/tooling lockstep
├── pnpm-workspace.yaml      # workspace package membership
├── lerna.json               # package orchestration/version flow
└── nx.json                  # task graph and cache behavior
```

### Structure Rationale

- **`components/vue2` as the compatibility boundary:** public API and lifecycle behavior live here; modernization should preserve this contract first.
- **`apps/*` as verification boundaries:** each app validates a distinct consumer path, so they should move only after the package compiles and passes smoke checks.
- **Root configs as coordination boundary:** dependency upgrades here affect all packages/apps; isolate tooling upgrades from runtime behavior changes to reduce blast radius.

## Architectural Patterns

### Pattern 1: Contract-First Core, Consumer-Second Modernization

**What:** Upgrade and refactor the wrapper package first, then adapt consuming demo apps.
**When to use:** Monorepo where one package is the reusable API and apps are validation clients.
**Trade-offs:** Slower early visible progress in demos, but sharply lower regression risk for published package behavior.

**Example:**
```typescript
// Build order intent
// 1) components/vue2 compiles + plugin behavior unchanged
// 2) apps/vue2 updates imports/config to new package output
// 3) apps/nuxt2 updates plugin wiring/client mode nuances
```

### Pattern 2: Two-Lane Change Streams (Tooling vs Runtime)

**What:** Separate modernization into independent lanes: workspace/toolchain upgrades and runtime/plugin syntax updates.
**When to use:** Dependency upgrades risk mixing infra breakage with behavioral regressions.
**Trade-offs:** More phase bookkeeping, but faster root-cause isolation when failures appear.

**Example:**
```typescript
// Lane A: pnpm/lerna/nx/rollup/vue-cli/nuxt compatibility
// Lane B: plugin/component syntax + tsParticles v4 beta integration behavior
// Integrate lanes only after each lane is green.
```

### Pattern 3: Demo Apps as Progressive Confidence Gates

**What:** Treat apps as staged gates, not equal first-class change targets.
**When to use:** Same package consumed by different app frameworks with different lifecycle semantics.
**Trade-offs:** Temporary drift between demos during migration; lower risk than changing both at once.

## Data Flow

### Request Flow

```
[App bootstrap: Vue.use(Particles, { init })]
    ↓
[Plugin install() in components/vue2]
    ↓
[init(engine) async completion]
    ↓
[event-bus emits particles-init]
    ↓
[vue-particles mounted()/event handler]
    ↓
[tsParticles.load({ id, options/url })]
    ↓
[container instance + particlesLoaded callback]
```

### State Management

```
Component-local container state
    ↓
Lifecycle hooks (created/mounted/beforeDestroy)
    ↓
Event bus only for init synchronization
    ↓
No global store dependency
```

### Key Data Flows

1. **Engine bootstrap flow:** app-level `init` callback configures engine once, then component instances load containers.
2. **Container lifecycle flow:** component props (`id`, `options`, `url`) drive load/destroy transitions; modernization must keep id-required behavior and cleanup guarantees.
3. **Cross-app validation flow:** same package runtime is exercised by Vue CLI and Nuxt 2; regressions can appear in one app due to framework lifecycle differences even if package unit behavior seems stable.

### Data-Flow Implications for Modernization

- Keep the plugin install contract (`Vue.use(..., { init })`) stable through all phases; this is the highest-risk integration seam.
- Avoid replacing event-driven init coordination and lifecycle cleanup in the same phase as dependency upgrades; do one concern at a time.
- Preserve async ordering guarantees (`init` before effective component load) while moving syntax/decorator patterns.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| Current (maintainer-focused package + demos) | Prioritize deterministic builds and compatibility checks over performance tuning |
| More consumers/package variants | Add matrix CI for Vue2/Nuxt2 and lock API contract tests around plugin install/load behavior |
| Broad long-term maintenance | Split shared integration fixtures and smoke tests so wrapper changes are validated once and reused across apps |

### Scaling Priorities

1. **First bottleneck:** hidden breakage from cross-workspace dependency drift; fix with explicit dependency constraints and phased upgrade PRs.
2. **Second bottleneck:** lifecycle regressions across frameworks; fix with app-level smoke tests tied to plugin initialization and teardown.

## Anti-Patterns

### Anti-Pattern 1: Big-Bang Monorepo Upgrade

**What people do:** Upgrade root tooling, wrapper runtime, and both apps in one phase.
**Why it's wrong:** Failure origin becomes ambiguous (toolchain vs runtime vs app wiring), slowing recovery.
**Do this instead:** Run phased modernization with explicit boundaries and green checkpoints.

### Anti-Pattern 2: App-First Refactor

**What people do:** Modernize demo app syntax before stabilizing wrapper package outputs/contracts.
**Why it's wrong:** Demos can be made green while publishable package remains unstable for downstream consumers.
**Do this instead:** Package-first build and behavior validation, then app adaptation.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| `@tsparticles/engine` + related v4 beta packages | Imported in wrapper and initialized via user-supplied `init` callback | Primary runtime dependency stream; upgrade in lockstep with wrapper tests |
| Vue 2 runtime + decorator ecosystem | Wrapper exposes Vue plugin/component contracts | Syntax modernization must preserve Vue 2 compatibility semantics |
| Nuxt 2 plugin runtime | Client plugin registration path in demo app | Sensitive to plugin execution timing and SSR/client boundaries |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Root orchestration -> `components/vue2` | Build graph + package scripts | Build foundation; must pass before app builds are meaningful |
| `components/vue2` -> `apps/vue2` | Package import + plugin API | First consumer gate; lower complexity than Nuxt |
| `components/vue2` -> `apps/nuxt2` | Package import + Nuxt plugin bridge | Second consumer gate; catches lifecycle/timing issues not visible in Vue CLI app |

## Suggested Build Order and Dependency Chain

1. **Phase 1 - Tooling baseline alignment (root + per-package build configs):** update workspace orchestrators/build tooling with no intended runtime behavior changes.
2. **Phase 2 - Wrapper package dependency + syntax modernization (`components/vue2`):** adopt tsParticles v4 beta package set and refactor internal syntax while freezing public plugin/component contract.
3. **Phase 3 - Vue CLI demo adaptation (`apps/vue2`):** update consumer-side usage and verify happy-path integration against modernized wrapper.
4. **Phase 4 - Nuxt2 demo adaptation (`apps/nuxt2`):** align Nuxt plugin wiring and client lifecycle semantics after package and Vue CLI path are stable.
5. **Phase 5 - Monorepo convergence hardening:** run full workspace build/test matrix and finalize version constraints/releases.

Dependency chain: **Root tooling -> Wrapper package -> Vue CLI demo -> Nuxt2 demo -> Full workspace release gate**.

## Sources

- `.planning/PROJECT.md`
- `.planning/codebase/ARCHITECTURE.md`
- `.planning/codebase/STRUCTURE.md`

---
*Architecture research for: tsParticles Vue2 modernization*
*Researched: 2026-04-10*

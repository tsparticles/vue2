# Codebase Structure

**Analysis Date:** 2026-04-10

## Directory Layout

```
vue2/
├── apps/                    # Demo applications consuming the plugin
│   ├── vue2/                # Vue CLI demo app
│   └── nuxt2/               # Nuxt 2 demo app
├── components/              # Publishable packages
│   └── vue2/                # @tsparticles/vue2 plugin source and dist
├── .github/                 # CI workflows and funding metadata
├── .husky/                  # Commit hooks
├── .planning/codebase/      # Generated architecture/codebase docs
├── package.json             # Workspace scripts and root deps
├── pnpm-workspace.yaml      # Workspace package globs
├── lerna.json               # Lerna package orchestration config
└── nx.json                  # Nx task caching defaults
```

## Directory Purposes

**`apps/`:**
- Purpose: Hold consumer/demo applications that exercise package integration patterns.
- Contains: App-specific configs, bootstrap files, demo UI components, local dist outputs.
- Key files: `apps/vue2/src/main.ts`, `apps/vue2/src/App.vue`, `apps/nuxt2/nuxt.config.js`, `apps/nuxt2/plugins/vue2-particles.ts`.

**`components/`:**
- Purpose: Hold reusable/publishable library packages.
- Contains: Source plugin code, package metadata, bundling config, generated dist artifacts.
- Key files: `components/vue2/src/Particles/index.ts`, `components/vue2/src/Particles/vue-particles.vue`, `components/vue2/rollup.config.mjs`, `components/vue2/package.json`.

**`components/vue2/src/Particles/`:**
- Purpose: Core runtime implementation for the Vue 2 particles plugin.
- Contains: Plugin install module, component implementation, event bus, type shims.
- Key files: `components/vue2/src/Particles/index.ts`, `components/vue2/src/Particles/vue-particles.vue`, `components/vue2/src/Particles/event-bus.ts`.

**`apps/vue2/src/`:**
- Purpose: Vue CLI demo source.
- Contains: App root component, bootstrap file, TS shims, static assets.
- Key files: `apps/vue2/src/main.ts`, `apps/vue2/src/App.vue`, `apps/vue2/src/shims-vue.d.ts`.

**`apps/nuxt2/`:**
- Purpose: Nuxt 2 demo project showing client plugin registration.
- Contains: Nuxt config, pages, plugins, demo components, optional store scaffold.
- Key files: `apps/nuxt2/nuxt.config.js`, `apps/nuxt2/pages/index.vue`, `apps/nuxt2/plugins/vue2-particles.ts`.

## Key File Locations

**Entry Points:**
- `components/vue2/src/Particles/index.ts`: Library plugin entry exported by `@tsparticles/vue2`.
- `apps/vue2/src/main.ts`: Vue CLI demo bootstrap.
- `apps/nuxt2/plugins/vue2-particles.ts`: Nuxt client plugin bootstrap.
- `apps/nuxt2/pages/index.vue`: Nuxt route root page.

**Configuration:**
- `package.json`: Root workspace scripts and dependencies.
- `pnpm-workspace.yaml`: Workspace package inclusion (`apps/*`, `components/*`).
- `lerna.json`: Lerna orchestration and versioning message config.
- `nx.json`: Nx task cache defaults.
- `components/vue2/rollup.config.mjs`: Library bundle configuration.
- `apps/nuxt2/nuxt.config.js`: Nuxt runtime/build config.
- `apps/vue2/tsconfig.json`, `components/vue2/tsconfig.json`, `apps/nuxt2/tsconfig.json`: TypeScript configs per project.

**Core Logic:**
- `components/vue2/src/Particles/vue-particles.vue`: tsParticles container lifecycle management.
- `components/vue2/src/Particles/index.ts`: Plugin install contract and init event dispatch.
- `components/vue2/src/Particles/event-bus.ts`: Event bus shared by plugin/component.

**Testing:**
- Not detected: no `*.test.*` or `*.spec.*` files under `apps/` or `components/`.

## Naming Conventions

**Files:**
- Use kebab-case for Vue SFC and utility runtime files in plugin package (`components/vue2/src/Particles/vue-particles.vue`, `components/vue2/src/Particles/event-bus.ts`).
- Use `index.ts` as module entry within implementation folders (`components/vue2/src/Particles/index.ts`).
- Use PascalCase for major Vue app components in demos (`apps/vue2/src/App.vue`, `apps/nuxt2/components/Tutorial.vue`, `apps/nuxt2/components/NuxtLogo.vue`).

**Directories:**
- Keep top-level workspace domains plural and role-based: `apps/`, `components/`.
- Keep package name directories explicit by framework target (`components/vue2/`, `apps/vue2/`, `apps/nuxt2/`).

## Where to Add New Code

**New Feature:**
- Primary code: `components/vue2/src/Particles/` for reusable plugin behavior.
- Tests: Not currently established; add a new test folder under `components/vue2/tests/` and wire scripts in `components/vue2/package.json`.

**New Component/Module:**
- Implementation: Add new SFC/module under `components/vue2/src/Particles/` and export from `components/vue2/src/Particles/index.ts` when part of public API.

**Utilities:**
- Shared helpers: Place plugin-scoped helpers in `components/vue2/src/Particles/` adjacent to consumers (for example alongside `event-bus.ts`).

## Special Directories

**`components/vue2/dist/`:**
- Purpose: Built package artifacts (`vue2-particles.js`, `vue2-particles.min.js`).
- Generated: Yes.
- Committed: Yes (directory exists with distributable files in repository).

**`apps/vue2/dist/`:**
- Purpose: Built Vue CLI demo output.
- Generated: Yes.
- Committed: Yes (directory exists with app build output in repository).

**`apps/nuxt2/.nuxt/`:**
- Purpose: Nuxt generated build/runtime internals.
- Generated: Yes.
- Committed: Yes (directory exists in repository snapshot).

**`node_modules/` (root and project-local):**
- Purpose: Dependency install artifacts.
- Generated: Yes.
- Committed: No (ignored via `.gitignore`).

---

*Structure analysis: 2026-04-10*

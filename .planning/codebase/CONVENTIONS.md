# Coding Conventions

**Analysis Date:** 2026-04-10

## Naming Patterns

**Files:**
- Use kebab-case for Vue Single File Components and helper modules in the core component package: `components/vue2/src/Particles/vue-particles.vue`, `components/vue2/src/Particles/event-bus.ts`.
- Use framework-default naming in app demos: PascalCase component files in Nuxt (`apps/nuxt2/components/Tutorial.vue`) and framework entrypoint names (`apps/vue2/src/App.vue`, `apps/vue2/src/main.ts`).

**Functions:**
- Use camelCase for function names and callbacks, including async setup callbacks: `particlesInit` in `components/vue2/src/Particles/vue-particles.vue`, `init` callback in `components/vue2/src/Particles/index.ts` and `apps/nuxt2/plugins/vue2-particles.ts`.

**Variables:**
- Use camelCase for runtime variables and instances: `eventBus` in `components/vue2/src/Particles/event-bus.ts`, `container` in `components/vue2/src/Particles/vue-particles.vue`.

**Types:**
- Prefix public interface-like aliases with `I` in component package TypeScript: `IParticlesProps` in `components/vue2/src/Particles/vue-particles.vue`.

## Code Style

**Formatting:**
- Tool used: Prettier (explicit in `apps/nuxt2/.prettierrc`, and package scripts in `apps/nuxt2/package.json`, `components/vue2/package.json`).
- Key settings:
  - Nuxt app enforces no semicolons and single quotes via `apps/nuxt2/.prettierrc`.
  - Nuxt app uses 2-space indentation and LF line endings via `apps/nuxt2/.editorconfig`.
  - Component package uses shared Prettier config (`"prettier": "@tsparticles/prettier-config"`) in `components/vue2/package.json`.
- Apply package-local formatting conventions consistently when editing files in each package instead of normalizing all packages to one style.

**Linting:**
- Tool used: ESLint in Nuxt app (`apps/nuxt2/.eslintrc.js`, `apps/nuxt2/package.json`).
- Key rules:
  - Extend `@nuxtjs/eslint-config-typescript`, `plugin:nuxt/recommended`, and `prettier` in `apps/nuxt2/.eslintrc.js`.
  - Keep custom rule overrides minimal unless needed (`rules: {}` currently in `apps/nuxt2/.eslintrc.js`).
- Other packages (`apps/vue2`, `components/vue2`) do not include local ESLint config files; rely on TypeScript strictness and Prettier-driven formatting there.

## Import Organization

**Order:**
1. Framework/core imports first (for example `vue`, decorators) in `components/vue2/src/Particles/vue-particles.vue`.
2. External package imports next (for example `@tsparticles/engine`, `tsparticles`) in `apps/vue2/src/main.ts` and `apps/nuxt2/plugins/vue2-particles.ts`.
3. Local module imports last (for example `./event-bus.js`, `./App.vue`) in `components/vue2/src/Particles/index.ts` and `apps/vue2/src/main.ts`.

**Path Aliases:**
- `@/*` → `src/*` in `apps/vue2/tsconfig.json` and `components/vue2/tsconfig.json`.
- `~/*` and `@/*` → project root in `apps/nuxt2/tsconfig.json`.

## Error Handling

**Patterns:**
- Validate required component props early and throw explicit errors for invalid state: `throw new Error("Prop 'id' is required!")` in `components/vue2/src/Particles/vue-particles.vue`.
- Prefer promise/async flow without local `try/catch` blocks unless translating or handling domain-specific errors (`components/vue2/src/Particles/index.ts`, `components/vue2/src/Particles/vue-particles.vue`).

## Logging

**Framework:** console (documentation/example only)

**Patterns:**
- Runtime source code does not use `console.*` in `components/vue2/src/**/*`, `apps/vue2/src/**/*`, or `apps/nuxt2/plugins/**/*`.
- `console.log` appears in usage documentation example only in `components/vue2/README.md`; avoid introducing debug logging in library runtime paths.

## Comments

**When to Comment:**
- Keep comments sparse in runtime code; rely on clear naming and type annotations (`components/vue2/src/Particles/*.ts`, `components/vue2/src/Particles/*.vue`).
- Use comments primarily in config files and docs to explain build/runtime intent (`apps/nuxt2/nuxt.config.js`, `apps/vue2/rollup.config.js`, `components/vue2/README.md`).

**JSDoc/TSDoc:**
- Not detected in source files under `components/vue2/src/`, `apps/vue2/src/`, and `apps/nuxt2/`.

## Function Design

**Size:**
- Keep functions focused and small; key logic is compact (`particlesInit` in `components/vue2/src/Particles/vue-particles.vue`, `install` in `components/vue2/src/Particles/index.ts`).

**Parameters:**
- Type all public-facing callback parameters in TypeScript (`engine: Engine` in `apps/vue2/src/main.ts`, `container: Container` in `components/vue2/src/Particles/vue-particles.vue`).

**Return Values:**
- Use explicit async return types (`Promise<void>`) for initialization workflows in `components/vue2/src/Particles/vue-particles.vue`.

## Module Design

**Exports:**
- Prefer default export for primary module entry and named exports for supplementary items (`export default VueParticles` and `export { particles as ParticlesComponent }` in `components/vue2/src/Particles/index.ts`).
- Use default export for Vue SFC class/component modules (`components/vue2/src/Particles/vue-particles.vue`, `apps/nuxt2/pages/index.vue`).

**Barrel Files:**
- Use package entry barrels for plugin exposure (`components/vue2/src/Particles/index.ts`).
- Dedicated multi-module barrel directories are not detected beyond direct entry modules.

---

*Convention analysis: 2026-04-10*

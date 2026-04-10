# Technology Stack

**Analysis Date:** 2026-04-10

## Languages

**Primary:**
- TypeScript (5.x toolchain) - Component library and app code in `components/vue2/src/Particles/index.ts`, `components/vue2/src/Particles/vue-particles.vue`, `apps/vue2/src/main.ts`, `apps/nuxt2/plugins/vue2-particles.ts`
- JavaScript (ES module/CommonJS config) - Build and framework config in `components/vue2/rollup.config.mjs`, `apps/vue2/rollup.config.js`, `apps/nuxt2/nuxt.config.js`, `apps/vue2/babel.config.js`

**Secondary:**
- Vue Single File Components (`.vue`) - UI/templates in `apps/vue2/src/App.vue`, `apps/nuxt2/components/Tutorial.vue`, `components/vue2/src/Particles/vue-particles.vue`
- YAML - CI/workspace config in `.github/workflows/nodejs.yml`, `pnpm-workspace.yaml`

## Runtime

**Environment:**
- Node.js 16 in CI (`.github/workflows/nodejs.yml`)

**Package Manager:**
- pnpm (`packageManager` pinned to `pnpm@10.33.0` in `package.json`)
- Lockfile: present (`pnpm-lock.yaml`)

## Frameworks

**Core:**
- Vue 2.7 (`vue`) - UI framework for library and demo app (`components/vue2/package.json`, `apps/vue2/package.json`)
- Nuxt 2.17 (`nuxt`) - Demo app framework for static Nuxt example (`apps/nuxt2/package.json`, `apps/nuxt2/nuxt.config.js`)
- tsParticles 3.9 (`@tsparticles/engine`, `tsparticles`) - Particle engine and full loader integration (`components/vue2/src/Particles/vue-particles.vue`, `apps/vue2/src/main.ts`, `apps/nuxt2/plugins/vue2-particles.ts`)

**Testing:**
- Not detected (no Jest/Vitest config or test scripts in `package.json`, `apps/vue2/package.json`, `apps/nuxt2/package.json`, `components/vue2/package.json`)

**Build/Dev:**
- Rollup 2.x - Library/demo bundling (`components/vue2/rollup.config.mjs`, `apps/vue2/rollup.config.js`)
- Vue CLI Service 5.x - Vue demo dev/build (`apps/vue2/package.json` scripts)
- Nuxt CLI 2.x - Nuxt demo dev/build/generate (`apps/nuxt2/package.json` scripts)
- TypeScript compiler 5.x - TS transpilation/type checking (`components/vue2/tsconfig.json`, `apps/vue2/tsconfig.json`, `apps/nuxt2/tsconfig.json`)
- Babel 7 - Transpilation presets/plugins (`components/vue2/babel.config.js`, `apps/vue2/babel.config.js`, `apps/nuxt2/package.json`)
- Lerna 8 + Nx 20 - Monorepo orchestration (`package.json`, `lerna.json`, `nx.json`)

## Key Dependencies

**Critical:**
- `@tsparticles/vue2` - Published Vue 2 wrapper package entrypoint (`components/vue2/package.json`, `components/vue2/src/Particles/index.ts`)
- `@tsparticles/engine` - Core particle API (`components/vue2/src/Particles/index.ts`, `components/vue2/src/Particles/vue-particles.vue`)
- `tsparticles` - Full feature loader used during plugin initialization (`apps/vue2/src/main.ts`, `apps/nuxt2/plugins/vue2-particles.ts`)
- `vue-property-decorator` + `vue-class-component` - Class/decorator component pattern (`components/vue2/src/Particles/vue-particles.vue`)

**Infrastructure:**
- `rollup`, `rollup-plugin-vue`, `rollup-plugin-typescript2`, `rollup-plugin-terser` - Package build output to `dist/` (`components/vue2/rollup.config.mjs`)
- `@vue/cli-service` - Demo app build/serve (`apps/vue2/package.json`)
- `@nuxt/typescript-build` - TypeScript support in Nuxt app (`apps/nuxt2/nuxt.config.js`, `apps/nuxt2/package.json`)
- `eslint`, `prettier` - Static analysis/formatting in Nuxt app and package scripts (`apps/nuxt2/package.json`, `components/vue2/package.json`)
- `husky`, `@commitlint/*` - Commit tooling at workspace root (`package.json`)

## Configuration

**Environment:**
- Runtime env-variable usage is not detected in source/config (`apps/nuxt2/nuxt.config.js`, `apps/vue2/src/main.ts`, `components/vue2/src/Particles/index.ts`)
- `.env*` files: Not detected at repository root during scan
- CI secret reference exists as commented example: `secrets.NX_CLOUD_ACCESS_TOKEN` in `.github/workflows/nodejs.yml`

**Build:**
- Workspace orchestration: `package.json`, `lerna.json`, `nx.json`, `pnpm-workspace.yaml`
- Library bundling: `components/vue2/rollup.config.mjs`
- Vue demo bundling: `apps/vue2/rollup.config.js`, `apps/vue2/babel.config.js`, `apps/vue2/tsconfig.json`
- Nuxt demo build settings: `apps/nuxt2/nuxt.config.js`, `apps/nuxt2/tsconfig.json`

## Platform Requirements

**Development:**
- Node.js + pnpm workspace tooling (`package.json`, `pnpm-workspace.yaml`)
- Monorepo commands via Lerna/Nx (`package.json` scripts: `build:lerna`, `build:nx`)

**Production:**
- Package publish target: npm package artifacts from `components/vue2/dist` (`components/vue2/package.json`)
- Demo targets: Vue CLI static build (`apps/vue2/package.json`) and Nuxt static target (`apps/nuxt2/nuxt.config.js` with `target: 'static'`)

---

*Stack analysis: 2026-04-10*

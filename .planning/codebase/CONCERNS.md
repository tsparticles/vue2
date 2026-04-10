# Codebase Concerns

**Analysis Date:** 2026-04-10

## Tech Debt

**Dual build orchestration (Lerna + Nx) increases maintenance surface:**
- Issue: Build orchestration is split across Lerna and Nx, while CI executes Lerna only and Nx Cloud setup is present but commented. This keeps multiple partially-overlapping execution paths active.
- Files: `package.json`, `lerna.json`, `nx.json`, `.github/workflows/nodejs.yml`
- Impact: Build/debug behavior diverges between local and CI paths, and maintenance effort increases when pipeline logic changes.
- Fix approach: Keep one orchestrator as the required path for CI and local documentation, or enforce a clear ownership split (for example, Lerna release orchestration + Nx task graph) with one canonical CI path.

**Outdated/stale demo scaffolding in app workspace:**
- Issue: The Vue demo includes placeholder README content and a Rollup config that points to non-existent source paths.
- Files: `apps/vue2/README.md`, `apps/vue2/rollup.config.js`
- Impact: Contributors can run incorrect commands or attempt builds with broken config, increasing onboarding friction and accidental failures.
- Fix approach: Remove unused config or align it to actual files under `apps/vue2/src/`; replace placeholder README with runnable demo instructions.

## Known Bugs

**Potential double initialization of tsParticles container:**
- Symptoms: Particle load can be triggered both from component mount and from global event emission after plugin init.
- Files: `components/vue2/src/Particles/vue-particles.vue`, `components/vue2/src/Particles/index.ts`, `components/vue2/src/Particles/event-bus.ts`
- Trigger: Using `Vue.use(Particles, { init: async ... })` while `<vue-particles>` mounts in the same lifecycle window.
- Workaround: Prefer one initialization trigger path (mounted OR event bus). Avoid event bus emission if component self-initializes.

**Invalid Rollup input path in Vue demo config:**
- Symptoms: Rollup build path references `src/components/Particles/Particles.vue`, which is absent in the workspace.
- Files: `apps/vue2/rollup.config.js`, `apps/vue2/src/App.vue`, `apps/vue2/src/main.ts`
- Trigger: Running a build command that uses `apps/vue2/rollup.config.js`.
- Workaround: Use `vue-cli-service build` from `apps/vue2/package.json` instead of this Rollup file until paths are corrected.

## Security Considerations

**Unvalidated external config URL input:**
- Risk: The `url` prop is passed directly into `tsParticles.load`, allowing runtime fetch from arbitrary URLs in consumer apps.
- Files: `components/vue2/src/Particles/vue-particles.vue`, `components/vue2/README.md`
- Current mitigation: Vue escapes template content by default, and fetch happens in browser context.
- Recommendations: Validate/whitelist URL origins in consuming applications; document trusted-source-only usage for `url` prop.

**No dedicated security scanning workflow detected:**
- Risk: Dependency vulnerabilities rely on external tooling/manual checks instead of explicit CI jobs.
- Files: `.github/workflows/nodejs.yml`, `renovate.json`
- Current mitigation: Renovate is configured for dependency updates.
- Recommendations: Add CI steps for dependency audit/SCA and fail on critical findings.

## Performance Bottlenecks

**Full engine loading in demos increases bundle size and startup work:**
- Problem: Demo integrations load `loadFull(engine)` instead of a slimmer profile.
- Files: `apps/vue2/src/main.ts`, `apps/nuxt2/plugins/vue2-particles.ts`, `README.md`
- Cause: Full bundle initialization imports all tsParticles features.
- Improvement path: Default demos to slim/basic loaders for startup performance; keep full loader as optional example.

**Repeated initialization risk adds unnecessary runtime work:**
- Problem: Component can invoke `particlesInit` more than once from separate triggers.
- Files: `components/vue2/src/Particles/vue-particles.vue`, `components/vue2/src/Particles/index.ts`
- Cause: `mounted` hook and `particles-init` event both call initialization.
- Improvement path: Add an idempotence guard per component instance (for example, skip if `container` already exists).

## Fragile Areas

**Event-bus-based lifecycle coupling:**
- Files: `components/vue2/src/Particles/event-bus.ts`, `components/vue2/src/Particles/index.ts`, `components/vue2/src/Particles/vue-particles.vue`
- Why fragile: Global event-driven init creates implicit ordering constraints between plugin installation and component mounting.
- Safe modification: Preserve backward compatibility while introducing explicit init state on component/plugin boundary before removing event bus behavior.
- Test coverage: No automated tests detected for plugin/component lifecycle behavior in `components/vue2/`.

**Legacy ecosystem dependency stack (Vue 2 / Nuxt 2 / Webpack 4):**
- Files: `components/vue2/package.json`, `apps/nuxt2/package.json`, `apps/vue2/package.json`, `.github/workflows/nodejs.yml`
- Why fragile: The stack depends on older major versions with limited long-term ecosystem movement.
- Safe modification: Keep compatibility matrix explicit and validate changes in both demo apps before version bumps.
- Test coverage: No automated compatibility test matrix detected across runtime/toolchain versions.

## Scaling Limits

**Library scales by consumer integration quality, not internal service architecture:**
- Current capacity: No server-side throughput limits apply; rendering/load cost scales with particle configuration and feature bundle size.
- Limit: Client performance degrades under high particle counts or full-feature bundles in constrained devices.
- Scaling path: Prefer preset/slim loaders and conservative defaults in examples (`apps/vue2/src/App.vue`, `apps/nuxt2/components/Tutorial.vue`, `README.md`).

## Dependencies at Risk

**Vue 2 / Nuxt 2 platform lifecycle risk:**
- Risk: Core framework ecosystem is legacy and receives reduced upstream evolution.
- Impact: Future toolchain/security/library compatibility work becomes harder and slower.
- Migration plan: Maintain this package for Vue 2 consumers while documenting migration path to actively maintained framework targets in sibling packages.

**CI toolchain version drift:**
- Risk: Repository declares `pnpm@10` in root while CI installs pnpm 8 and Node 16.
- Impact: Lockfile/install behavior can diverge between local and CI environments.
- Migration plan: Align CI versions with `package.json#packageManager` and current supported Node engines.

## Missing Critical Features

**No automated test suite for component/plugin behavior:**
- Problem: Core lifecycle and integration behavior has no unit/integration coverage in repository test directories.
- Blocks: Safe refactoring of initialization flow, event handling, and compatibility changes.

**No explicit compatibility CI matrix:**
- Problem: CI executes single environment build path and does not validate multiple Node/pnpm combinations.
- Blocks: Confident dependency/toolchain upgrades.

## Test Coverage Gaps

**Component lifecycle and init flow are untested:**
- What's not tested: `created`/`mounted`/`beforeDestroy` behavior, single-init guarantees, and callback invocation semantics.
- Files: `components/vue2/src/Particles/vue-particles.vue`, `components/vue2/src/Particles/index.ts`
- Risk: Regressions in initialization order and cleanup can ship unnoticed.
- Priority: High

**Demo integration paths are untested in CI:**
- What's not tested: Runtime behavior of `apps/vue2` and `apps/nuxt2` beyond build success.
- Files: `apps/vue2/src/main.ts`, `apps/nuxt2/plugins/vue2-particles.ts`, `.github/workflows/nodejs.yml`
- Risk: Functional regressions in consumer setup examples are detected late.
- Priority: Medium

---

*Concerns audit: 2026-04-10*

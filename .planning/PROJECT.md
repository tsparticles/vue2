# tsParticles Vue2 v4 Modernization

## What This Is

This project evolves the `@tsparticles/vue2` monorepo to align with the latest ecosystem while preserving the current Vue 2 integration path. It focuses on upgrading dependencies to current versions, adopting the `tsParticles` 4.0.0 beta packages being developed, and modernizing legacy syntax and build patterns. The target users are maintainers and downstream Vue 2/Nuxt 2 consumers who need continuity with improved maintainability.

## Core Value

Keep the Vue 2 wrapper reliable and release-ready while upgrading to modern dependencies and syntax around `tsParticles` 4.0.0 beta.

## Requirements

### Validated

- ✓ Vue 2 plugin installation path works via `Vue.use(...)` and global `vue-particles` component registration — existing
- ✓ Demo integrations exist for Vue CLI (`apps/vue2`) and Nuxt 2 (`apps/nuxt2`) — existing
- ✓ Package build and workspace orchestration flow exist (pnpm + Lerna/Nx + Rollup) — existing

### Active

- [ ] Upgrade workspace dependencies and tooling to latest stable-compatible versions where possible
- [ ] Adopt and validate `tsParticles` 4.0.0 beta package usage consistently across package and demo apps
- [ ] Migrate legacy/class-style syntax and older config patterns to more modern, maintainable syntax
- [ ] Preserve public plugin behavior and compatibility expectations for current Vue 2 consumers

### Out of Scope

- Full migration to Vue 3-only implementation — this effort prioritizes Vue 2 continuity
- Net-new product features unrelated to modernization/upgrade goals — focus remains on upgrade and migration quality

## Context

The repository is a brownfield monorepo with a mapped codebase under `.planning/codebase/`. The core package (`components/vue2`) provides the Vue 2 wrapper and lifecycle logic, while `apps/vue2` and `apps/nuxt2` demonstrate consumer integration patterns. Existing architecture relies on plugin registration, async engine init hooks, and component lifecycle container management. The current milestone is modernization-focused rather than feature-expansion-focused.

## Constraints

- **Compatibility**: Keep Vue 2/Nuxt 2 integration viable during migration — existing adopters still rely on this path
- **Dependency Strategy**: Use `tsParticles` 4.0.0 beta packages under active development — required by project direction
- **Stability**: Avoid regressions in plugin install/load behavior and demo app functionality — migration must remain shippable
- **Scope**: Prioritize upgrades and syntax modernization before broader architectural rewrites — maximize delivery focus

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Prioritize upgrade + modernization milestone first | Reduces technical drift and unlocks cleaner follow-up work | — Pending |
| Keep Vue 2 support as explicit requirement | Existing package purpose and consumers depend on it | — Pending |
| Track v4 beta alignment as core stream | `tsParticles` 4.0.0 beta is the target runtime baseline | — Pending |

---
*Last updated: 2026-04-10 after initialization*

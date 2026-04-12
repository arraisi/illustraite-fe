# Implementation Plan: Advanced Brand Configuration Toggle

**Branch**: `001-advance-brand-config` | **Date**: 2026-04-12 | **Spec**: `/specs/001-advance-brand-config/spec.md`
**Input**: Feature specification from `/specs/001-advance-brand-config/spec.md`

## Summary

Move the Brand Colors section in the Workspace view behind an "Advanced" toggle button. By default, the brand color pickers are hidden, simplifying the default UI. Clicking an "Advanced" button reveals the brand color inputs with a smooth transition. No new dependencies required — pure Vue reactivity + Tailwind CSS.

## Technical Context

**Language/Version**: JavaScript (Vue 3.4+ SFC with `<script setup>`)
**Primary Dependencies**: Vue 3, PrimeVue (unstyled), Tailwind CSS v4
**Storage**: N/A (component-local UI state only)
**Testing**: None (no test infrastructure in project)
**Target Platform**: Web SPA (modern browsers)
**Project Type**: Web application (Vue SPA)
**Performance Goals**: Instant toggle (<16ms), smooth CSS transition
**Constraints**: No new npm dependencies; maintain dark mode support
**Scale/Scope**: Single view modification (`src/views/Workspace.vue`)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Component Architecture | PASS | Change is scoped to `Workspace.vue`. Brand colors section stays inline (not extracted) since it's view-specific UI. No new component needed. |
| II. Unstyled PrimeVue | PASS | No new PrimeVue components introduced. Toggle uses native HTML button styled with Tailwind. |
| III. Composition API First | PASS | Toggle state uses `ref()`. `<script setup>` syntax preserved. |
| IV. State Management | PASS | Toggle visibility is ephemeral UI state — correctly kept as component-local `ref`, not in Pinia store. |
| V. API Integration | PASS | No API changes. Colors are still optional in the generation request body. |

No violations. No complexity tracking needed.

## Project Structure

### Documentation (this feature)

```text
specs/001-advance-brand-config/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
└── quickstart.md        # Phase 1 output
```

### Source Code (repository root)

```text
src/
└── views/
    └── Workspace.vue    # Only file modified
```

**Structure Decision**: Single file change within existing project structure. The "Advanced" toggle is view-specific UI state — no new components, stores, or composables warranted.

## Implementation Details

### What changes in `Workspace.vue`

**Script section** (lines 1-109):
1. Add `const showAdvanced = ref(false)` (after line 48)
2. Initialize `primaryColor` and `secondaryColor` to `null` instead of preset values — colors should start empty when hidden by default
3. Update watchers to handle null values gracefully

**Template section** (lines 111-238):
1. Replace the Brand Colors `<div>` block (lines 151-179) with:
   - An "Advanced" toggle button at the same location
   - The existing Brand Colors content wrapped in a `v-show="showAdvanced"` container
   - Smooth height transition using Tailwind's `transition-all` or Vue's `<Transition>`
2. The toggle button:
   - Text: "Advanced" with a chevron icon (rotates when open)
   - Styled as a subtle text button matching the section's visual language
   - Includes `aria-expanded` for accessibility

### What does NOT change
- ColorPickerPopup component (untouched)
- Generator store (untouched)
- API request payload structure (untouched)
- Any other view or component

### Default behavior change
- Currently: primary=`FF5722`, secondary=`4a90e2` are pre-selected on mount
- After: both colors start as `null`. No colors sent to API unless user explicitly opens Advanced and picks colors
- This aligns with the user's intent: brand colors are optional

## Verification

1. `npm run dev` — open Workspace
2. Verify Brand Colors section is hidden by default
3. Click "Advanced" button — verify colors section appears with smooth transition
4. Pick a primary color — verify color badge appears and hex is shown
5. Click "Generate" without opening Advanced — verify no `colors` field in request body (check Network tab)
6. Click "Generate" with colors set — verify `colors` object in request body
7. Toggle Advanced closed/open — verify colors persist while panel is toggled
8. Verify dark mode styling on the toggle button
9. `npm run build` — verify no build errors

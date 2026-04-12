# Tasks: Advanced Brand Configuration — Color Picker Fix

**Input**: Design documents from `/specs/001-advance-brand-config/`
**Prerequisites**: plan.md (required). No spec.md — user stories derived from plan.md and bug report.

**Tests**: Not requested — no test tasks included.

**Organization**: Single user story (bug fix). No parallel phases needed.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: No setup needed — existing project, existing branch

(No tasks — project already initialized on branch `001-advance-brand-config`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: No foundational work needed — bug fix in existing components

(No tasks)

---

## Phase 3: User Story 1 — Fix Color Picker Popup Clipping (Priority: P1) MVP

**Goal**: Color picker popup renders fully visible when opened inside the Advanced collapse section

**Independent Test**: Open Workspace → click Advanced → click color swatch → popup appears uncropped with working canvas, hue slider, hex/RGB inputs, and preset swatches

### Implementation for User Story 1

- [ ] T001 [US1] Teleport popup panel to body in `src/components/ui/ColorPickerPopup.vue` — wrap `<div v-if="open" ...>` (line 310) with `<Teleport to="body">`, compute trigger position via `getBoundingClientRect()` on toggle, apply `position: fixed` + computed `top`/`left` to popup
- [ ] T002 [US1] Update click-outside handling in `src/components/ui/ColorPickerPopup.vue` — ensure `onClickOutside` covers both the trigger button and the teleported popup panel (use a wrapper ref or array of refs)
- [ ] T003 [US1] Fix null model initialization in `src/components/ui/ColorPickerPopup.vue` — in `onMounted` (line 285), call `syncInputsFromHsv()` even when model is null so hex/RGB inputs reflect the default HSV state on first open

**Checkpoint**: Color picker popup fully visible and functional inside the Advanced collapse section

---

## Phase 4: Polish & Cross-Cutting Concerns

- [ ] T004 Verify dark mode rendering of teleported popup in `src/components/ui/ColorPickerPopup.vue`
- [ ] T005 Run `npm run build` to confirm no build errors
- [ ] T006 Run quickstart.md validation (manual — steps in `/specs/001-advance-brand-config/quickstart.md`)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 3 (US1)**: No prerequisites — can start immediately
- **Phase 4 (Polish)**: Depends on Phase 3 completion

### Within User Story 1

- T001 → T002 (click-outside depends on teleport structure)
- T001 → T003 can run in parallel (independent fix in same file, different section)
- T002 depends on T001

### Parallel Opportunities

- T001 and T003 touch different sections of the same file but can be implemented together in one pass
- T004, T005, T006 can run in parallel after US1 is complete

---

## Summary

| Metric | Value |
|--------|-------|
| Total tasks | 6 |
| US1 tasks | 3 |
| Polish tasks | 3 |
| Parallel opportunities | T004/T005/T006 |
| MVP scope | US1 (T001-T003) |
| Files modified | 1 (`src/components/ui/ColorPickerPopup.vue`) |
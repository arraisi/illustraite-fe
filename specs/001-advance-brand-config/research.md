# Research: Advanced Brand Configuration Toggle

## Decision: Toggle mechanism

**Chosen**: `v-show` with CSS transition
**Rationale**: `v-show` keeps DOM elements mounted, preserving color picker state when toggled closed. `v-if` would destroy/recreate the color pickers, losing user selections if they toggle the panel closed and reopen.
**Alternatives considered**:
- `v-if` — simpler but destroys state on close. Rejected.
- `<Transition>` component with `v-if` — same destruction issue.
- Accordion/disclosure PrimeVue component — adds PrimeVue dependency for a simple toggle. Rejected per constitution (no new PrimeVue components without justification).

## Decision: Toggle button styling

**Chosen**: Inline text button with chevron icon, styled as subtle secondary action
**Rationale**: Matches the existing section label aesthetic (small, uppercase, muted). A full PrimeVue `Button` component would be visually heavy for a section toggle.
**Alternatives considered**:
- PrimeVue `Button` with `text` severity — viable but heavier markup. Not needed.
- Separate "Advanced Settings" card — over-engineering for a single toggle.

## Decision: Default color values

**Chosen**: Initialize `primaryColor` and `secondaryColor` as `null` (no color selected)
**Rationale**: If brand colors are optional and hidden by default, pre-selecting colors contradicts the UX intent. Users should explicitly opt into colors.
**Alternatives considered**:
- Keep current defaults (`FF5722`, `4a90e2`) — contradicts "optional" intent. Rejected.

## Decision: Transition effect

**Chosen**: CSS `max-height` + `opacity` transition via Tailwind utility classes
**Rationale**: Pure CSS, no JS animation library needed. Tailwind's `transition-all duration-300` provides smooth reveal. `overflow-hidden` prevents content flash during expand.
**Alternatives considered**:
- Vue `<Transition>` with CSS classes — works but `v-show` doesn't pair as cleanly with enter/leave transitions for height animation. `max-height` hack is simpler.
- No transition — functional but feels abrupt. Small cost for better UX.

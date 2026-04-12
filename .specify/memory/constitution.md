<!--
  Sync Impact Report
  ==================
  Version change: 0.0.0 → 1.0.0 (initial ratification)
  Modified principles: N/A (first version)
  Added sections:
    - Core Principles (5): Component Architecture, Unstyled PrimeVue,
      Composition API First, State Management, API Integration
    - Technology Constraints
    - Development Workflow
    - Governance
  Removed sections: N/A
  Templates requiring updates:
    - .specify/templates/plan-template.md — OK (no changes needed)
    - .specify/templates/spec-template.md — OK (no changes needed)
    - .specify/templates/tasks-template.md — OK (no changes needed)
    - .specify/templates/checklist-template.md — OK (no changes needed)
  Follow-up TODOs: None
-->

# IllustrAIte Frontend Constitution

## Core Principles

### I. Component Architecture

All page-level components live in `src/views/`. Reusable UI elements
live in `src/components/ui/`. Layout components (AppShell, Navbar) live
in `src/components/layout/`. Composables for shared logic live in
`src/composables/`.

- Components MUST be single-responsibility and self-contained.
- Shared state MUST flow through Pinia stores, never through deep
  prop drilling beyond two levels.
- Auth pages (Login, Register) MUST render as standalone centered
  cards without the app shell.
- App pages MUST use the top navbar layout (no sidebar).

### II. Unstyled PrimeVue

PrimeVue MUST be used exclusively in Unstyled/Pass Through mode.
No default PrimeVue themes are permitted. All styling is applied
through Tailwind CSS via the custom preset in `src/presets/`.

- Importing or enabling any PrimeVue built-in theme is prohibited.
- New PrimeVue components MUST have Pass Through definitions in the
  preset file before use.
- Visual consistency MUST follow the design direction: warm
  orange/amber accent (`~#fe9a00`), soft shadows, `rounded-xl`,
  generous whitespace, light/dark mode support.

### III. Composition API First

All components MUST use Vue 3 Composition API with `<script setup>`
syntax. Options API is prohibited.

- Reusable logic MUST be extracted into composables (`use*` pattern)
  in `src/composables/`.
- Composables MUST return reactive refs or computed properties, not
  raw values.
- Template refs, lifecycle hooks, and watchers MUST use Composition
  API equivalents (`ref`, `onMounted`, `watch`).

### IV. State Management

Pinia is the sole state management solution. Each domain has its own
store: `useAuthStore` (JWT + credits), `useGeneratorStore`
(style/color/angle), `useGalleryStore` (image cache).

- New global state MUST be added to an existing store or a new
  dedicated Pinia store — never as component-local shared state.
- Stores MUST be defined using the setup syntax (Composition API
  style).
- Auth tokens and user session data MUST only be accessed through
  `useAuthStore`.

### V. API Integration

The backend integration follows a hybrid REST + WebSocket pattern.
REST calls use Axios or native fetch via composables. WebSocket
connections use `@vueuse/core` (`useWebSocket`).

- Generation workflow MUST follow: POST `/generate` -> receive
  `generation_id` -> open WebSocket at `/ws/v1/status` -> handle
  completion event -> close socket.
- All API base URLs MUST come from environment variables
  (`VITE_API_BASE_URL`, `VITE_WS_BASE_URL`), never hardcoded.
- HTTP clients MUST handle auth token injection and 401 responses
  centrally (interceptors or composable wrapper).

## Technology Constraints

- **Runtime**: Vue 3.4+, Node.js >= 18
- **Build**: Vite 5 with `@vitejs/plugin-vue`
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite` plugin.
  Theme customization uses `@theme` in CSS — no `tailwind.config.js`.
- **Path alias**: `@` resolves to `./src` (configured in
  `vite.config.js`)
- **Language**: JavaScript (no TypeScript). Components use `.vue`
  and `.js` extensions.
- **Package manager**: npm
- **Deployment**: SPA with `_redirects` for client-side routing

## Development Workflow

- Run `npm run dev` for local development.
- Run `npm run build` before merging to verify production builds.
- Environment variables MUST be prefixed with `VITE_` to be exposed
  to the client bundle.
- New dependencies MUST be justified — prefer existing packages and
  browser APIs over adding new libraries.
- All feature work SHOULD branch from `main` and merge back via PR.

## Governance

This constitution defines the non-negotiable standards for the
IllustrAIte frontend codebase. All code contributions MUST comply.

- **Amendments**: Any change to this constitution MUST be documented
  with a version bump, rationale, and migration plan for existing
  code that no longer complies.
- **Versioning**: Constitution follows semantic versioning.
  MAJOR = principle removal/redefinition. MINOR = new principle or
  material expansion. PATCH = clarification or wording fix.
- **Compliance**: All specifications, plans, and task lists generated
  by speckit commands MUST be validated against these principles.
  The plan template's "Constitution Check" section MUST reference
  the active principles.
- **Guidance**: See `CLAUDE.md` at the project root for runtime
  development guidance and conventions.

**Version**: 1.0.0 | **Ratified**: 2026-04-12 | **Last Amended**: 2026-04-12

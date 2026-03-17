# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

IllustrAIte is a B2B/B2C SaaS frontend for generating visually consistent 3D minimalist assets. It's a Vue 3 SPA.

## Tech Stack

- **Framework:** Vue 3 with Composition API and `<script setup>` syntax
- **Build:** Vite
- **Routing:** Vue Router 4
- **State:** Pinia
- **Styling:** Tailwind CSS
- **UI Components:** PrimeVue in Unstyled/Pass Through mode (styled via Tailwind presets)
- **HTTP:** Axios or native fetch
- **WebSocket:** `@vueuse/core` (`useWebSocket`)

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Production build
```

## Architecture

### Key Directories

- `src/views/` — Page components (Workspace, Gallery, Billing, Login, Register)
- `src/stores/` — Pinia stores: `useAuthStore` (JWT + credits), `useGeneratorStore` (style/color/angle), `useGalleryStore` (image cache)
- `src/composables/` — Reusable logic (e.g., `useApi`, `useImageDownload`)
- `src/components/layout/` — AppShell (top navbar + content), Navbar (no sidebar — minimal top-nav layout)
- `src/components/ui/` — Shared PrimeVue wrappers
- `src/router/` — Route config and guards

### API Integration Pattern

The Workspace uses a hybrid REST + WebSocket flow:
1. `POST /api/v1/generate` returns `202 Accepted` with `{ generation_id }`
2. Frontend opens WebSocket at `ws://.../ws/v1/status?generation_id={uuid}`
3. On `{ "status": "completed", "image_url": "..." }` — display image, deduct credit, close socket

### Environment Variables

Required in `.env`:
```
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_WS_BASE_URL=ws://localhost:8080/ws/v1
```

## Design Direction

Target UI style: [isometricon.com](https://www.isometricon.com/) — modern minimalist SaaS aesthetic:
- Light/dark mode with warm orange/amber accent (`~#fe9a00`)
- Soft shadows, rounded corners (`rounded-xl`), generous whitespace
- Display font for headings + Inter for body
- Auth pages: standalone centered cards (no app shell)
- App pages: top navbar only (no sidebar), content-focused

## Conventions

- PrimeVue must be used in **Unstyled/Pass Through** mode only — no default PrimeVue themes
- All components use Vue 3 Composition API with `<script setup>`
- Tailwind v4 — uses `@tailwindcss/vite` plugin, `@theme` in CSS for customization (no `tailwind.config.js`)
- Node.js >= 18 required

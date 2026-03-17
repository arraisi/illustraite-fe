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
- `src/components/layout/` — AppShell, Navbar, Sidebar
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

## Conventions

- PrimeVue must be used in **Unstyled/Pass Through** mode only — no default PrimeVue themes
- All components use Vue 3 Composition API with `<script setup>`
- Node.js >= 18 required

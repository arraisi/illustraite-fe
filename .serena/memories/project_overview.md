# IllustrAIte Frontend - Project Overview

## Purpose
B2B/B2C SaaS frontend for generating visually consistent 3D minimalist assets. Vue 3 SPA.

## Tech Stack
- **Framework:** Vue 3 (Composition API, `<script setup>`)
- **Build:** Vite 5
- **Routing:** Vue Router 4
- **State:** Pinia
- **Styling:** Tailwind CSS v4 (via `@tailwindcss/vite` plugin, no tailwind.config.js)
- **UI Components:** PrimeVue 4 in Unstyled/Pass Through mode (styled via Tailwind presets)
- **HTTP:** Axios / native fetch
- **WebSocket:** `@vueuse/core` (`useWebSocket`)
- **Platform:** macOS (Darwin)

## Key Architecture
- Hybrid REST + WebSocket flow for image generation
- POST /api/v1/generate → 202 + generation_id → WebSocket for status → display image
- Auth pages: standalone centered cards (no app shell)
- App pages: top navbar only (no sidebar)

# Code Style & Conventions

## Vue Components
- All components use Vue 3 Composition API with `<script setup>` syntax
- No Options API

## Styling
- Tailwind CSS v4 — uses `@tailwindcss/vite` plugin, `@theme` in CSS for customization
- **No `tailwind.config.js`** — config via CSS `@theme` directive
- PrimeVue must be **Unstyled/Pass Through mode only** — no default PrimeVue themes
- Custom PrimeVue preset at `src/presets/illustraite.js`

## Design
- Light/dark mode with warm orange/amber accent (`~#fe9a00`)
- Soft shadows, rounded corners (`rounded-xl`), generous whitespace
- Display font for headings + Inter for body

## Project Structure
```
src/
├── views/          # Page components (Workspace, Gallery, Billing, Login, Register, NotFound)
├── stores/         # Pinia stores (auth, gallery, generator)
├── composables/    # Reusable logic (useApi, useDarkMode, useImageDownload, useGenerationSocket)
├── components/
│   ├── layout/     # AppShell, Navbar
│   └── ui/         # Shared UI components (ColorPickerPopup)
├── presets/        # PrimeVue pass-through presets
├── router/         # Route config and guards
├── assets/         # CSS (main.css)
├── App.vue
└── main.js
```

## Naming
- JavaScript files (not TypeScript)
- Store files: lowercase (auth.js, gallery.js, generator.js)
- Composables: camelCase with `use` prefix
- Components: PascalCase .vue files

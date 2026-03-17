# IllustrAIte - Frontend

[![Vue 3](https://img.shields.io/badge/Vue-3-4FC08D?logo=vuedotjs)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PrimeVue](https://img.shields.io/badge/PrimeVue-Unstyled-41B883)](https://primevue.org/)

A B2B/B2C SaaS platform frontend for generating visually consistent 3D minimalist assets. Built as a Single Page Application (SPA) with Vue 3 Composition API and Vite.

## Tech Stack

| Category             | Technology                                          |
| -------------------- | --------------------------------------------------- |
| Framework            | Vue 3 (Composition API, `<script setup>`)           |
| Build Tool           | Vite                                                |
| Routing              | Vue Router 4                                        |
| State Management     | Pinia                                               |
| Styling              | Tailwind CSS                                        |
| UI Components        | PrimeVue (Unstyled / Pass Through mode)             |
| HTTP Client          | Axios / native fetch                                |
| WebSocket            | `@vueuse/core` (`useWebSocket`)                     |

## Project Structure

```
/src
  /assets              # Static images, Tailwind main CSS
  /components
    /layout            # AppShell, Navbar, Sidebar
    /ui                # Shared PrimeVue wrappers (if needed)
  /composables         # Reusable logic (e.g., useApi, useImageDownload)
  /router              # Vue Router configuration & route guards
  /stores              # Pinia stores (auth, generator, gallery)
  /views               # Page components (Workspace.vue, Gallery.vue)
  App.vue              # Root component
  main.js/ts           # App initialization, Pinia, PrimeVue, Router setup
```

## Getting Started

### Prerequisites

- Node.js >= 18
- npm or pnpm

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd illustraite-fe

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_WS_BASE_URL=ws://localhost:8080/ws/v1
```

## Core Features

### Authentication (`/login` & `/register`)

Login and registration views with JWT-based authentication.

### Workspace / Generator (`/`)

The main application view containing:
- **Style Configurator** - Select style presets, brand colors, and camera angles
- **Prompt Input** - Auto-resizing textarea for image generation prompts
- **Real-time Result Viewer** - Live feedback via WebSocket during generation

### Gallery (`/gallery`)

Masonry/grid layout displaying previously generated assets with pagination and image preview/download.

### Billing (`/billing`)

Displays current credit balance and top-up/subscription packages.

## State Management (Pinia Stores)

### `useAuthStore`
Manages JWT token, user profile data, and `credit_balance`. Handles login/logout actions.

### `useGeneratorStore`
Manages the currently selected `style_preset`, `colors`, and `camera_angle`.

### `useGalleryStore`
Caches previously generated images to prevent redundant API calls when navigating between Workspace and Gallery.

## UI Components (PrimeVue Unstyled)

PrimeVue is configured strictly in **Unstyled / Pass Through** mode using Tailwind presets to maintain a clean, custom minimalist aesthetic.

| Feature           | Components Used                                                     |
| ----------------- | ------------------------------------------------------------------- |
| Generator Form    | `Textarea`, `Dropdown`, `ColorPicker`, `Button` (loading state)     |
| Real-time Feedback| `Skeleton` (placeholder during WebSocket generation)                |
| Gallery           | `DataView` (image grid), `Image` (preview & download)              |
| Feedback          | `Toast` (success/error notifications)                               |

## API & WebSocket Integration Flow

The Workspace view implements a **hybrid REST + WebSocket** pattern:

```
1. User clicks "Generate"
   └─> POST /api/v1/generate  (prompt + style payload)

2. Backend returns 202 Accepted
   └─> Response contains { generation_id }

3. Frontend establishes WebSocket connection
   └─> ws://[BACKEND_URL]/ws/v1/status?generation_id={uuid}

4. Frontend displays Skeleton loader & listens for updates
   └─> On { "status": "completed", "image_url": "..." }:
       ├─ Display the generated image
       ├─ Deduct 1 credit in useAuthStore
       └─ Close WebSocket connection
```

## Routes

| Path        | View             | Description                        |
| ----------- | ---------------- | ---------------------------------- |
| `/login`    | Login.vue        | User authentication                |
| `/register` | Register.vue     | User registration                  |
| `/`         | Workspace.vue    | Main generator workspace           |
| `/gallery`  | Gallery.vue      | Past generated assets              |
| `/billing`  | Billing.vue      | Credits & subscription management  |

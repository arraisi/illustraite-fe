# Quickstart: Advanced Brand Configuration Toggle

## Setup

```bash
git checkout 001-advance-brand-config
npm install
npm run dev
```

## Verify

1. Open `http://localhost:5173` and navigate to Workspace
2. The Style Configuration card shows Style Preset, Camera Angle, and an "Advanced" button
3. Brand Colors section is NOT visible by default
4. Click "Advanced" — Brand Colors section slides open with primary/secondary pickers
5. Select colors, then generate — colors appear in API request body
6. Generate without opening Advanced — no `colors` in request body
7. Toggle dark mode — verify button and section render correctly

## Build check

```bash
npm run build
```

No errors expected — this is a template-only change with one new `ref`.

# Data Model: Advanced Brand Configuration Toggle

## No data model changes

This feature is purely a UI visibility toggle. No new entities, store properties, or API contracts are introduced.

### Existing entities (unchanged)

- **Generator Store `colors`**: `{ primary: string|null, secondary: string|null }` — unchanged
- **API request `colors` field**: Optional object, included only when at least one color is set — unchanged

### New component-local state

| State | Type | Default | Scope |
|-------|------|---------|-------|
| `showAdvanced` | `ref<boolean>` | `false` | `Workspace.vue` only |

This is ephemeral UI state — not persisted, not shared via store.

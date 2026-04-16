# Smokeless source layout

This app renders two surfaces from a single codebase:

- The **React web UI** in the iPhone WebView (`src/App.tsx` and everything under `src/features/`)
- The **glasses HUD** on the Even G2 (`src/glasses/` and `src/glasses-main.ts`)

Both surfaces read from the same in-memory store and call the same action methods. Neither "owns" the other.

## Layering

```
┌─────────────────────────────────────────────────────────────┐
│  main.tsx  ──imports──►  glasses-main.ts                    │
│    │                         │                              │
│    ▼                         ▼                              │
│  App.tsx                   Router + Views                   │
│  (pages, hooks)            (home / stats / history / menu)  │
│    │                         │                              │
│    └──────┐            ┌─────┘                              │
│           ▼            ▼                                    │
│         app/store.ts (AppStore singleton)                   │
│                │                                            │
│                ▼                                            │
│        app/bootstrap.ts (auth + Firestore subs)             │
│                │                                            │
│                ▼                                            │
│           services/ (firestore / auth / google-link)        │
└─────────────────────────────────────────────────────────────┘
```

## Key files

| File | Purpose |
|---|---|
| `src/app/store.ts` | `AppStore` — the single source of truth. State + actions. No React, no DOM. |
| `src/app/bootstrap.ts` | Module-scoped auth + Firestore subscriptions. `startBootstrap()` is idempotent. |
| `src/app/selectors.ts` | Memoized derived values (`HudSnapshot`, stats summaries, etc.). |
| `src/app/hooks/useAppSelector.ts` | `useSyncExternalStore` wrapper — use to read state from React. |
| `src/app/hooks/useClock.ts` | 1-second tick for the web home timer (scoped — only components that subscribe re-render). |
| `src/glasses/session.ts` | SDK wrapper. Module-level `pageCreated`; `create → rebuild` fallback on session takeover. |
| `src/glasses/router.ts` | Stack-based view navigation: `push`/`pop`/`reset`. |
| `src/glasses/render-loop.ts` | `scheduleRender()` with `isRendering` + `renderQueued` debouncing. Status-phase override. |
| `src/glasses/events.ts` | Central bridge-event dispatcher. Routes every event to the current view. |
| `src/glasses/home-timer.ts` | 1-second render tick — only active while `HomeView` is current. |
| `src/glasses/screens/*/` | One folder per screen. Each view owns its render state. |

## Rendering rules

1. **`createStartUpPageContainer` is called at most once** per browser session. Module-level `pageCreated` survives component remounts. On failure it falls back to `rebuildPageContainer` for session takeover.
2. **`rebuildPageContainer` fires only when `layout.key` changes** — i.e. the container structure differs. Home ↔ Stats share a key and only upgrade text content.
3. **`textContainerUpgrade` fires only for containers whose text actually changed.** The session caches the last-sent string per container name.
4. **The 1-second timer only runs while the home view is active.** Other views re-render only when the store notifies.

## State rules

- `AppStore` owns anything needed by both surfaces (data, nav tab, selected history day, etc.).
- UI-local state (toast, modal open, selected stats bucket, count-bump animation) stays in React hooks.
- Glasses view instances own their own transient state (e.g. HomeView's success/error animation).

# NoCodeTrader

Plain-English strategy builder for retail algo trading, implemented from the
`NoCodeTrader.dc.html` design project.

**React 19 + Vite + TypeScript + Tailwind v4.** UI only — all market data,
backtests and broker connections are simulated from fixtures in `src/data/mock.ts`.

## Run

```bash
npm install
npm run dev      # dev server
npm run build    # typecheck + production build
npm run lint
```

## Screens

| Screen | Component |
| --- | --- |
| Strategies overview | `src/screens/Strategies.tsx` |
| Strategy Builder | `src/screens/Builder.tsx` |
| Live Monitor | `src/screens/Monitor.tsx` — tabbed, one tab per running strategy |
| Audit Log | `src/screens/Audit.tsx` — rows flow with the page; filters collapse above the table below 1100px |
| Account & Settings | `src/screens/Settings.tsx` |
| Sign up / Log in | `src/screens/Auth.tsx` |
| Broker onboarding | `src/screens/BrokerFlow.tsx` |

## Variants

The design exposed editor props for its alternate states. They are read from the
query string instead (see `src/state/propsFromUrl.ts`):

| Param | Effect |
| --- | --- |
| `?stage=signup` \| `login` \| `broker` \| `app` | Open on that flow (default `app`) |
| `?empty=1` | Zero-data variants of Strategies / Monitor / Audit |
| `?offline=1` | Start with the broker session down |
| `?ghost=0` | Hide the oversized ghost numerals behind stat tiles |
| `?pills=0` | Render strategy sentences without inline value pills |

## Structure

- `src/state/useApp.ts` — all app state and derived view-model, ported from the
  mockup's `DCLogic` component. Screens are presentational.
- Live Monitor keeps per-strategy pause state and feed position, keyed by tab id
  (`pausedIds` / `feedLens`). The builder's own strategy is always the first tab;
  sample strategies from `src/data/mock.ts` follow. Drafts are excluded — they
  route to the Builder instead.
- Strategy names live in `names`, keyed by strategy id, and always override the
  default. The builder's strategy defaults to `<symbol> strategy`; the sample
  strategies default to the names in `src/data/mock.ts`. Clearing a name
  restores the default rather than leaving the strategy blank. Name a strategy
  in the Builder, or rename any of them from its card on the Strategies page.
- `src/state/backtest.ts` — seeded, deterministic simulated backtest.
- `src/lib/theme.ts` — design tokens (colors, type families).
- `src/components/ui.tsx` — shared primitives (fields, segmented controls,
  toggles, stat tiles, sentence renderer).

Styling follows the design's inline-style approach so the port stays
1:1 with the source; Tailwind is available for new work.

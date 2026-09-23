import type { SentencePart } from '../data/mock'

export type Stage = 'landing' | 'app' | 'signup' | 'login' | 'broker'
export type Screen = 'strategies' | 'builder' | 'monitor' | 'audit' | 'settings'
export type Sizing = 'auto' | 'fixed'
export type Density = 'list' | 'grid'

export type Cond = {
  metric: string
  symbol: string
  symbol2: string
  cmp: string
  value: string
}

export type AppProps = {
  /**
   * Which flow the app opens on. Left unset, a returning visitor with a saved
   * session opens the app and everyone else gets the landing page.
   */
  startStage: Stage
  /** Render the zero-data variants of Strategies / Monitor / Audit. */
  emptyState: boolean
  /** Start with the broker session down. */
  connectionLost: boolean
  /** Oversized ghost numerals behind stat tiles. */
  ghostDecor: boolean
  /** Render strategy sentences with inline value pills. */
  showPills: boolean
}

export type BtStat = { label: string; value: string; sign: -1 | 0 | 1 }
export type BtTrade = {
  date: string; pre: string; sym: string; mid: string
  pnl: string; win: boolean; loss: boolean
}
export type Backtest = {
  curve: string; area: string
  lossX: string; lossY: string
  trades: BtTrade[]
  stats: BtStat[]
}

export type AppState = {
  screen: Screen
  stage: Stage | null
  brokerStep: 'select' | 'oauth' | 'done'
  brokerPick: string | null
  brokerName: string
  oClient: string; oPw: string; oTotp: string
  suName: string; suEmail: string; suPw: string; suPw2: string
  liEmail: string; liPw: string
  profileName: string; profileEmail: string
  notifOpen: boolean; readAll: boolean
  connLost: boolean | null
  prefs: { exec: boolean; reject: boolean; pause: boolean }
  disconnect: 'idle' | 'asking'
  deleteText: string
  allPaused: boolean
  conds: Cond[]
  joins: string[]
  suggest: { i: number; field: 1 | 2 } | null
  timeOn: boolean; tStart: string; tEnd: string
  days: Record<string, boolean>
  side: 'BUY' | 'SELL'
  actionSymbol: string
  sizing: Sizing
  qty: string
  exitOpen: boolean
  tpOn: boolean; tp: string
  slOn: boolean; sl: string
  risk: number
  status: 'draft' | 'live'
  algoId: string
  btRange: string
  bt: Backtest | null
  stale: boolean
  /**
   * User-supplied strategy names, keyed by strategy id (the builder's own
   * strategy uses BUILDER_ID). Absent or blank falls back to the auto-derived
   * name, so the field can always be cleared.
   */
  names: Record<string, string>
  /** Which strategy card is being renamed inline on the Strategies page. */
  renaming: string | null
  /** Which Live Monitor tab is selected; null falls back to the builder tab. */
  monitorId: string | null
  /** Per-strategy pause state, keyed by tab id. Absent = use the default. */
  pausedIds: Record<string, boolean>
  /** Per-strategy decision-feed length, keyed by tab id. */
  feedLens: Record<string, number>
  tick: number
  demo: boolean
  filters: { day: string; decision: string; symbol: string }
  density: Density
  openRow: string | null
  exported: boolean
}

export type Pill = SentencePart & { text: boolean }

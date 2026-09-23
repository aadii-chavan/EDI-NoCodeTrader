import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  AUDIT, CMPS, COMPARE, DAYS, FEED_LENGTH, METRICS, NOTIFS, STRATS, SYMS, feedFor,
} from '../data/mock'
import { inr, priceOf, rng } from '../lib/format'
import { clearSession, loadSession, saveSession } from '../lib/session'
import { makeBacktest } from './backtest'
import type { AppProps, AppState, Cond, Pill, Screen } from './types'

/** Cadence of the simulated market clock. */
const TICK_MS = 1400

/** Tab id for the strategy currently open in the builder. */
export const BUILDER_ID = 'builder'

/** How many feed entries a strategy shows before the clock extends it. */
const FEED_START = 6

/**
 * A strategy's pause state before the user touches it: sample strategies follow
 * their own status, and "Deactivate all" in Settings pauses everything.
 */
function defaultPaused(id: string, s: AppState): boolean {
  if (id === BUILDER_ID) return s.allPaused
  const t = STRATS.find(x => x.name === id)
  if (!t) return false
  return s.allPaused || t.status === 'Paused'
}

/** '+₹4,180' / '−₹382' -> 4180 / -382 */
function parsePnl(text: string, up: boolean): number {
  const n = parseInt(text.replace(/[^0-9]/g, ''), 10) || 0
  return up ? n : -n
}

export const DEFAULT_PROPS: AppProps = {
  startStage: 'app',
  emptyState: false,
  connectionLost: false,
  ghostDecor: true,
  showPills: true,
}

const INITIAL: AppState = {
  screen: 'strategies',
  stage: null,
  brokerStep: 'select', brokerPick: null, brokerName: 'Zerodha',
  oClient: '', oPw: '', oTotp: '',
  suName: '', suEmail: '', suPw: '', suPw2: '',
  liEmail: '', liPw: '',
  profileName: 'Ananya Rao', profileEmail: 'ananya.rao@email.com',
  notifOpen: false, readAll: false,
  connLost: null,
  prefs: { exec: true, reject: true, pause: true },
  disconnect: 'idle', deleteText: '', allPaused: false,
  conds: [{ metric: 'Price', symbol: 'RELIANCE', symbol2: 'TCS', cmp: 'crosses above', value: '2,850' }],
  joins: [],
  suggest: null,
  timeOn: false, tStart: '09:20', tEnd: '15:10',
  days: { Mon: true, Tue: true, Wed: true, Thu: true, Fri: true },
  side: 'BUY', actionSymbol: 'RELIANCE', sizing: 'auto', qty: '25',
  exitOpen: false, tpOn: true, tp: '4', slOn: true, sl: '2',
  risk: 5000,
  status: 'draft', algoId: '',
  btRange: '3 months', bt: null, stale: false,
  names: {}, renaming: null,
  monitorId: null, pausedIds: {}, feedLens: {}, tick: 0, demo: false,
  filters: { day: 'All dates', decision: 'All', symbol: 'All' },
  density: 'list', openRow: null, exported: false,
}

type Patch = Partial<AppState> | ((s: AppState) => Partial<AppState>)

export function useApp(propsIn: Partial<AppProps> = {}) {
  const props = { ...DEFAULT_PROPS, ...propsIn }
  // Read once per mount: a saved session decides whether a visitor who hasn't
  // asked for a specific stage lands on the marketing page or straight in.
  const [restored] = useState(loadSession)
  const [S, setRaw] = useState<AppState>(INITIAL)
  // Captured once at mount; render derives every timestamp from this + `tick`,
  // so rendering never reads the wall clock.
  const [mountedAt] = useState(() => Date.now())

  const set = useCallback((patch: Patch) => {
    setRaw(s => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) }))
  }, [])

  /** Any builder edit invalidates an existing backtest. */
  const touch = useCallback(
    (patch: Partial<AppState>) => set(s => ({ ...patch, stale: !!s.bt })),
    [set],
  )

  // Drives the live feed and the oscillating P&L on the monitor screen.
  useEffect(() => {
    const t = setInterval(() => {
      setRaw(s => {
        const next: Partial<AppState> = { tick: s.tick + 1 }
        // Only the strategy the user is watching advances its feed.
        const id = s.monitorId ?? BUILDER_ID
        const paused = s.pausedIds[id] ?? defaultPaused(id, s)
        if (s.screen === 'monitor' && !paused && s.tick % 3 === 2) {
          const len = s.feedLens[id] ?? FEED_START
          next.feedLens = { ...s.feedLens, [id]: Math.min(FEED_LENGTH, len + 1) }
        }
        return { ...s, ...next }
      })
    }, TICK_MS)
    return () => clearInterval(t)
  }, [])

  const go = useCallback(
    (scr: Screen) => () => set({ screen: scr, openRow: null, notifOpen: false }),
    [set],
  )

  const setCond = useCallback(
    (i: number, patch: Partial<Cond>) => {
      set(s => {
        const conds = s.conds.map((c, k) => (k === i ? { ...c, ...patch } : c))
        const out: Partial<AppState> = { conds, stale: !!s.bt, suggest: null }
        if (i === 0 && patch.symbol) out.actionSymbol = patch.symbol
        return out
      })
    },
    [set],
  )

  const locked = S.status === 'live'
  const pills = props.showPills !== false
  const ghost = props.ghostDecor !== false

  /* ── conditions ── */
  const conds = S.conds.map((c, i) => {
    const isCmp = c.metric === COMPARE
    const metricOpts = i === 0 ? METRICS.concat([COMPARE]) : METRICS.slice()
    const m = c.metric
    const pct = c.cmp === 'rises by %' || c.cmp === 'falls by %'
    let valueLabel = 'Value'
    let prefix = ''
    let hint = ''
    if (pct) { valueLabel = 'Percent move'; hint = '%' }
    else if (m === 'Price' || m === 'VWAP' || m === 'Bollinger Band') {
      valueLabel = m === 'Price' ? 'Price level' : 'Level'; prefix = '₹'
    }
    else if (m === 'RSI') { valueLabel = 'RSI level'; hint = '0–100' }
    else if (m === 'Volume') { valueLabel = 'Times average volume'; hint = '×' }
    else if (m === 'MACD') { valueLabel = 'Signal line value' }
    else if (m === 'Moving Average Crossover') { valueLabel = 'Slow MA period'; hint = 'bars' }
    else if (m === 'SuperTrend') { valueLabel = 'ATR multiplier'; hint = '×' }

    const key = S.suggest && S.suggest.i === i ? S.suggest : null
    const q = key ? (key.field === 2 ? c.symbol2 : c.symbol) : ''
    const needle = String(q).toLowerCase()
    const matches = key
      ? SYMS.filter(
          x => x.s.toLowerCase().indexOf(needle) === 0 || x.n.toLowerCase().indexOf(needle) >= 0,
        )
      : []
    const field = key ? key.field : 1

    return {
      num: i + 1,
      metric: c.metric, symbol: c.symbol, symbol2: c.symbol2, cmp: c.cmp, value: c.value,
      metricOpts, isCompare: isCmp, isSingle: !isCmp, locked,
      hasJoin: i > 0, removable: i > 0 && !locked,
      valueLabel, valuePrefix: prefix, valueHint: hint,
      joinOpts: ['AND', 'OR'].map(j => ({
        label: j,
        on: (S.joins[i - 1] || 'AND') === j,
        pick: () =>
          set(s => {
            const joins = s.joins.slice()
            joins[i - 1] = j
            return { joins, stale: !!s.bt }
          }),
      })),
      onMetric: (v: string) =>
        setCond(i, { metric: v, cmp: v === COMPARE ? 'rises by %' : 'crosses above' }),
      onCmp: (v: string) => setCond(i, { cmp: v }),
      onValue: (v: string) => setCond(i, { value: v }),
      onSymbol: (v: string) =>
        set(s => ({
          conds: s.conds.map((x, k) => (k === i ? { ...x, symbol: v } : x)),
          suggest: { i, field: 1 as const },
          stale: !!s.bt,
          actionSymbol: i === 0 ? v : s.actionSymbol,
        })),
      onSymbol2: (v: string) =>
        set(s => ({
          conds: s.conds.map((x, k) => (k === i ? { ...x, symbol2: v } : x)),
          suggest: { i, field: 2 as const },
          stale: !!s.bt,
        })),
      focusSymbol: () => set({ suggest: { i, field: 1 } }),
      focusSymbol2: () => set({ suggest: { i, field: 2 } }),
      showSuggest: !!key && !locked,
      noMatch: !!key && matches.length === 0,
      suggestions: matches.map(x => ({
        sym: x.s,
        name: x.n,
        ltp: x.p.toLocaleString('en-IN'),
        pick: () => setCond(i, field === 2 ? { symbol2: x.s } : { symbol: x.s }),
      })),
      remove: () =>
        set(s => ({
          conds: s.conds.filter((_, k) => k !== i),
          joins: s.joins.slice(0, Math.max(0, s.conds.length - 2)),
          stale: !!s.bt,
        })),
    }
  })

  /* ── plain-English preview sentence ── */
  const previewParts: Pill[] = useMemo(() => {
    const parts: Pill[] = []
    const push = (t: string, isPill: boolean) =>
      parts.push({ t, pill: !!(isPill && pills), text: !(isPill && pills) })

    push('When ', false)
    S.conds.forEach((c, i) => {
      if (i > 0) push(' ' + (S.joins[i - 1] || 'AND').toLowerCase() + ' ', false)
      if (c.metric === COMPARE) {
        push(c.symbol || '—', true)
        push(' outperforms ', false)
        push(c.symbol2 || '—', true)
        push(' by ', false)
        push(c.value + '%', true)
      } else {
        push(c.symbol || '—', true)
        push(' ', false)
        push(c.metric === 'Price' ? 'price' : c.metric, true)
        push(' ' + c.cmp + ' ', false)
        push((c.metric === 'Price' ? '₹' : '') + c.value, true)
      }
    })
    if (S.timeOn) {
      push(' between ', false)
      push(S.tStart + '–' + S.tEnd, true)
      push(' on ' + DAYS.filter(d => S.days[d]).join(', '), false)
    }
    push(', ', false)
    push(S.side === 'BUY' ? 'buy' : 'sell', true)
    push(' ', false)
    push(S.sizing === 'auto' ? 'a volatility-adjusted quantity' : S.qty + ' shares', true)
    push(' of ', false)
    push(S.actionSymbol || '—', true)
    push(', risking no more than ', false)
    push(inr(S.risk), true)
    push(' on the trade', false)
    if (S.exitOpen && (S.tpOn || S.slOn)) {
      push('. Exit at ', false)
      if (S.tpOn) push('+' + S.tp + '% profit', true)
      if (S.tpOn && S.slOn) push(' or ', false)
      if (S.slOn) push('−' + S.sl + '% loss', true)
    }
    push('.', false)
    return parts
  }, [S.conds, S.joins, S.timeOn, S.tStart, S.tEnd, S.days, S.side, S.sizing, S.qty,
      S.actionSymbol, S.risk, S.exitOpen, S.tpOn, S.tp, S.slOn, S.sl, pills])

  /* ── backtest view ── */
  const bt = S.bt
  const btStats = bt
    ? bt.stats.map(s => ({
        label: s.label,
        value: s.value,
        pos: s.sign === 1,
        neg: s.sign === -1,
        neutral: s.sign === 0,
        ghost,
        ghostChar: String(s.value).replace(/[^0-9]/g, '').charAt(0) || '0',
      }))
    : []

  /* ── intraday chart (monitor), seeded per symbol so each tab differs ── */
  const intraday = useCallback((sym: string) => {
    const seed = 97 + sym.split('').reduce((a, ch) => a + ch.charCodeAt(0), 0)
    const r2 = rng(seed)
    let px = priceOf(sym)
    const dpts: number[] = []
    for (let i = 0; i <= 48; i++) {
      px += (r2() - 0.46) * (priceOf(sym) * 0.0032)
      dpts.push(px)
    }
    const dmin = Math.min(...dpts)
    const dmax = Math.max(...dpts)
    const dxy = dpts.map((v, i) => [i * (400 / 48), 150 - ((v - dmin) / (dmax - dmin || 1)) * 130])
    const dayCurve = dxy.map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
    const ei = 14
    return {
      dayCurve,
      dayArea: '0,160 ' + dayCurve + ' 400,160',
      execX: dxy[ei][0].toFixed(1),
      execY: dxy[ei][1].toFixed(1),
    }
  }, [])

  /* ── audit ── */
  const f = S.filters
  const filtered = AUDIT.filter(
    r =>
      (f.day === 'All dates' || r.day === f.day) &&
      (f.decision === 'All' || r.decision === f.decision) &&
      (f.symbol === 'All' || r.sym === f.symbol),
  )
  const rows = filtered.map((r, i) => ({
    ts: r.ts, sym: r.sym, signal: r.signal, qty: r.qty, tag: r.tag,
    bg: i % 2 === 1 ? '#fbfaf6' : '#fffefb',
    accent: r.decision === 'Rejected' ? '#d8a596' : 'transparent',
    tsDate: r.ts.split(' · ')[0],
    tsTime: r.ts.split(' · ')[1] || '',
    hasOrder: !!r.order,
    order: r.order || '—',
    executed: r.decision === 'Executed',
    rejected: r.decision === 'Rejected',
    rationale: r.rationale,
    open: S.openRow === r.ts,
    toggle: () => set(s => ({ openRow: s.openRow === r.ts ? null : r.ts })),
    meta: [
      { k: 'Decision', v: r.decision },
      { k: 'Compliance', v: r.tag },
      { k: 'Broker order', v: r.order || 'none — no order sent' },
      { k: 'Algo-ID', v: 'NCT-4471-XG' },
    ],
  }))

  const mkOpts = (grp: 'day' | 'decision' | 'symbol', list: string[]) =>
    list.map(v => ({
      label: v,
      on: f[grp] === v,
      pick: () => set(s => ({ filters: { ...s.filters, [grp]: v }, openRow: null })),
    }))

  /* ── live monitor: one tab per monitorable strategy ── */
  const monitorId = S.monitorId ?? BUILDER_ID

  /** What we call a strategy when the user hasn't named it. */
  const autoBuilderName = S.actionSymbol ? `${S.actionSymbol} strategy` : 'Untitled strategy'
  const nameOf = (id: string, fallback: string) => S.names[id]?.trim() || fallback
  const builderLabel = nameOf(BUILDER_ID, autoBuilderName)

  type Monitorable = {
    id: string
    name: string
    sym: string
    qty: number
    avgPrice: number
    isBuilder: boolean
    live: boolean
    basePnl: number
    sentence: Pill[]
    feedCtx: Parameters<typeof feedFor>[0]
  }

  const monitorable: Monitorable[] = [
    {
      id: BUILDER_ID,
      name: builderLabel,
      sym: S.actionSymbol || 'RELIANCE',
      qty: 18,
      avgPrice: 2851.4,
      isBuilder: true,
      live: S.status === 'live',
      basePnl: 1240,
      sentence: previewParts,
      feedCtx: {
        sym: S.actionSymbol || 'RELIANCE',
        qty: 18,
        trigger: (S.conds[0]?.metric === 'Price' ? '₹' : '') + (S.conds[0]?.value ?? ''),
        triggerText: 'the entry condition matched on the 1-minute close',
        orderId: 'NSE-8841207',
      },
    },
    ...STRATS.filter(t => t.status !== 'Draft').map(t => ({
      id: t.name,
      name: nameOf(t.name, t.name),
      sym: t.sym,
      qty: t.qty,
      avgPrice: t.avgPrice,
      isBuilder: false,
      live: true,
      basePnl: parsePnl(t.pnl, t.up),
      sentence: t.sentence.map(p => ({ t: p.t, pill: p.pill && pills, text: !(p.pill && pills) })),
      feedCtx: {
        sym: t.sym, qty: t.qty, trigger: t.trigger,
        triggerText: t.triggerText, orderId: t.orderId,
      },
    })),
  ]

  const selected = monitorable.find(m => m.id === monitorId) ?? monitorable[0]
  const selPaused = S.pausedIds[selected.id] ?? defaultPaused(selected.id, S)

  const monitorTabs = monitorable.map(m => {
    const paused = S.pausedIds[m.id] ?? defaultPaused(m.id, S)
    return {
      id: m.id,
      name: m.name,
      sym: m.sym,
      on: m.id === selected.id,
      running: !paused,
      draft: m.isBuilder && !m.live,
      pick: () => set({ monitorId: m.id, notifOpen: false }),
    }
  })

  /* ── live feed for the selected strategy ── */
  const now = mountedAt + S.tick * TICK_MS
  const feedLen = S.feedLens[selected.id] ?? FEED_START
  const feed = feedFor(selected.feedCtx)
    .slice(0, feedLen)
    .map((e, i) => ({
      time: new Date(now - (feedLen - i) * 42000).toLocaleTimeString('en-IN', { hour12: false }),
      tag: e.tag || 'Signal',
      title: e.title,
      body: e.body,
      isReject: e.kind === 'reject',
    }))
    .reverse()

  // A paused strategy holds its last known number rather than ticking.
  const pnl = selPaused
    ? selected.basePnl
    : selected.basePnl + Math.round(Math.sin(S.tick / 2 + selected.qty) * 380)
  const monReady = S.status === 'live' || S.demo || props.emptyState !== true

  /* ── strategies overview ── */
  const emptyState = props.emptyState === true
  const sparks = useMemo(
    () =>
      STRATS.map((t, i) => {
        const r = rng(31 + i * 17)
        let v = 20
        const pts: number[] = []
        for (let k = 0; k <= 22; k++) {
          v += (r() - (t.up ? 0.42 : 0.56)) * 5.5
          pts.push(v)
        }
        const lo = Math.min(...pts)
        const hi = Math.max(...pts)
        return pts
          .map((y, k) => `${(k * (120 / 22)).toFixed(1)},${(36 - ((y - lo) / (hi - lo || 1)) * 32).toFixed(1)}`)
          .join(' ')
      }),
    [],
  )
  const strats = STRATS.map((t, i) => {
    const status = S.allPaused && t.status === 'Active' ? 'Paused' : t.status
    return {
      id: t.name,
      name: nameOf(t.name, t.name),
      renaming: S.renaming === t.name,
      // The field edits the raw override, not the resolved display name, so it
      // can be cleared to fall back to the original name.
      nameDraft: S.names[t.name] ?? '',
      startRename: () =>
        set(s => ({ renaming: t.name, names: { ...s.names, [t.name]: s.names[t.name] ?? t.name } })),
      onRename: (v: string) => set(s => ({ names: { ...s.names, [t.name]: v } })),
      commitRename: () =>
        set(s => {
          const names = { ...s.names }
          if (!names[t.name]?.trim()) delete names[t.name]
          return { renaming: null, names }
        }),
      pnl: t.pnl, pnlLabel: t.pnlLabel, up: t.up, down: !t.up,
      isActive: status === 'Active', isPaused: status === 'Paused', isDraft: status === 'Draft',
      sentence: t.sentence.map(p => ({ t: p.t, pill: p.pill && pills, text: !(p.pill && pills) })),
      spark: sparks[i],
      open: () =>
        set({
          screen: t.status === 'Draft' ? 'builder' : 'monitor',
          monitorId: t.status === 'Draft' ? null : t.name,
          demo: true,
          notifOpen: false,
        }),
    }
  })

  /* ── notifications ── */
  const unread = S.readAll ? 0 : NOTIFS.filter(n => n.unread).length
  const notifs = NOTIFS.map(n => ({
    time: n.time, tag: n.tag, title: n.title, body: n.body,
    unread: n.unread && !S.readAll,
    action: !!n.action,
    actionLabel: n.action,
    onAction: () =>
      set(s => ({
        notifOpen: false,
        connLost: false,
        screen: (n.goTo as Screen) || s.screen,
      })),
  }))

  /* ── signup password strength ── */
  const pw = S.suPw || ''
  let score = 0
  if (pw.length >= 6) score = 1
  if (pw.length >= 9 && /[0-9]/.test(pw)) score = 2
  if (pw.length >= 11 && /[0-9]/.test(pw) && /[^a-zA-Z0-9]/.test(pw)) score = 3
  const pwLabel = pw.length === 0 ? '—' : ['Weak', 'Weak', 'Fair', 'Strong'][score]
  const pwHint =
    pw.length === 0
      ? 'At least 11 characters, with a number and a symbol, reaches Strong.'
      : score === 3
        ? 'Strong. Good to go.'
        : score === 2
          ? 'Fair. Add a symbol to reach Strong.'
          : 'Add length and a number to strengthen it.'

  // An explicit ?stage= always wins, so the landing page stays reachable while
  // signed in; otherwise the saved session decides.
  const stage = S.stage ?? propsIn.startStage ?? (restored ? 'app' : 'landing')
  const inApp = stage === 'app'
  const connDown = S.connLost === null ? props.connectionLost === true : S.connLost
  const initials = (S.profileName || 'NT')
    .split(' ')
    .map(x => x.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const connSummary = [
    {
      label: 'Broker account',
      value:
        (S.brokerPick === 'Upstox' ? 'UP' : S.brokerPick === 'Fyers' ? 'FY' : 'ZR') + '••••4471',
    },
    { label: 'Connected at', value: '17 Sep · 09:04 IST' },
    { label: 'Static IP whitelist', value: '49.36.•••.112 · verified' },
    { label: 'Two-factor authentication', value: 'Active · TOTP' },
  ]

  return {
    props, state: S, set, touch,

    /* nav + chrome */
    navItems: ([
      ['strategies', 'Strategies'],
      ['builder', 'Strategy Builder'],
      ['monitor', 'Live Monitor'],
      ['audit', 'Audit Log'],
    ] as [Screen, string][]).map(([k, l]) => ({
      label: l, active: S.screen === k, go: go(k),
    })),
    brokerMasked: 'XXXX-4471',
    showChrome: stage === 'app',
    isBuilder: inApp && S.screen === 'builder',
    isMonitor: inApp && S.screen === 'monitor',
    isAudit: inApp && S.screen === 'audit',
    isStrategies: inApp && S.screen === 'strategies',
    isSettings: inApp && S.screen === 'settings',
    goBuilder: go('builder'), goMonitor: go('monitor'), goAudit: go('audit'),
    openBuilderInMonitor: () =>
      set({ screen: 'monitor', monitorId: BUILDER_ID, openRow: null, notifOpen: false }),
    ghost,

    isLanding: stage === 'landing',
    isAuth: stage === 'signup' || stage === 'login',
    isSignup: stage === 'signup',
    isLogin: stage === 'login',
    isBrokerSelect: stage === 'broker' && S.brokerStep === 'select',
    isOauth: stage === 'broker' && S.brokerStep === 'oauth',
    isBrokerDone: stage === 'broker' && S.brokerStep === 'done',

    brokerOk: !connDown, brokerDown: connDown,
    goSettings: () => set({ screen: 'settings', notifOpen: false }),
    goBrokerFlow: () =>
      set({ stage: 'broker', brokerStep: 'select', brokerPick: null, notifOpen: false }),
    initials,
    notifOpen: S.notifOpen, notifs, unreadCount: unread, hasUnread: unread > 0,
    toggleNotif: () => set(s => ({ notifOpen: !s.notifOpen })),
    markRead: () => set({ readAll: true }),
    connLost: connDown,
    reconnect: () => set({ connLost: false }),

    /* auth */
    pwBars: [0, 1, 2].map(i => ({ filled: i < score })),
    pwLabel, pwHint,
    pwMismatch: S.suPw2.length > 0 && S.suPw2 !== S.suPw,
    submitSignup: () =>
      set(s => {
        const valid =
          s.suEmail.trim().length > 0 &&
          s.suPw.length > 0 &&
          !(s.suPw2.length > 0 && s.suPw2 !== s.suPw)
        if (!valid) return {}
        const name = s.suName.trim() || s.profileName
        const email = s.suEmail.trim() || s.profileEmail
        saveSession({ name, email })
        // New accounts still have to connect a broker — step 2 of 2 by design.
        return { stage: 'broker', brokerStep: 'select', profileName: name, profileEmail: email }
      }),
    goLogin: () => set({ stage: 'login' }),
    goSignup: () => set({ stage: 'signup' }),
    submitLogin: () =>
      set(s => {
        if (!s.liEmail.trim() || !s.liPw) return {}
        const email = s.liEmail.trim() || s.profileEmail
        saveSession({ name: s.profileName, email })
        // Returning users already connected a broker, so go straight to the app.
        return { stage: 'app', screen: 'strategies', profileEmail: email }
      }),

    /* broker connect */
    brokers: [
      { name: 'Zerodha', mark: 'ZRD', note: 'Kite Connect · most common' },
      { name: 'Upstox', mark: 'UPX', note: 'Upstox API v2' },
      { name: 'Fyers', mark: 'FYR', note: 'Fyers API v3' },
    ].map(b => ({ ...b, on: S.brokerPick === b.name, pick: () => set({ brokerPick: b.name }) })),
    brokerChosen: !!S.brokerPick,
    brokerPick: S.brokerPick || 'your broker',
    oauthUrl:
      'https://' + String(S.brokerPick || 'broker').toLowerCase() + '.com/connect/login?api_key=nct_live',
    startOauth: () => set({ brokerStep: 'oauth' }),
    finishOauth: () => set(s => ({ brokerStep: 'done', brokerName: s.brokerPick || s.brokerName })),
    enterApp: () => set({ stage: 'app', screen: 'strategies' }),
    connSummary,

    /* strategies overview */
    strats, hasStrats: !emptyState, noStrats: emptyState,
    activeCount: strats.filter(t => t.isActive).length,
    aggStats: [
      { label: 'Combined P&L today', value: '+₹6,412', neutral: false, pos: true },
      { label: 'Trades this week', value: '31', neutral: true, pos: false },
      { label: 'Win rate this week', value: '61%', neutral: true, pos: false },
    ].map(s => ({
      ...s, ghost,
      ghostChar: String(s.value).replace(/[^0-9]/g, '').charAt(0) || '0',
    })),

    /* settings */
    notifPrefs: ([
      { k: 'exec', label: 'Trade executed', note: 'Every filled order, with quantity and price.' },
      { k: 'reject', label: 'Signal rejected', note: 'Duplicate guards, risk-ceiling breaches, window blocks.' },
      { k: 'pause', label: 'Strategy paused or errored', note: 'Loss limits, broker session drops, API errors.' },
    ] as const).map(p => ({
      label: p.label, note: p.note, on: !!S.prefs[p.k],
      toggle: () => set(s => ({ prefs: { ...s.prefs, [p.k]: !s.prefs[p.k] } })),
    })),
    disconnectIdle: S.disconnect === 'idle',
    disconnectAsking: S.disconnect === 'asking',
    askDisconnect: () => set({ disconnect: 'asking' }),
    cancelDisconnect: () => set({ disconnect: 'idle' }),
    confirmDisconnect: () =>
      set({ disconnect: 'idle', connLost: true, allPaused: true, pausedIds: {} }),
    deactivateAll: () => set(s => ({ allPaused: !s.allPaused, pausedIds: {} })),
    deactivateLabel: S.allPaused ? 'All deactivated' : 'Deactivate all',
    deleteArmed: S.deleteText.trim().toUpperCase() === 'DELETE',
    doDelete: () => {
      clearSession()
      set({ stage: 'signup', deleteText: '', screen: 'strategies' })
    },

    /* builder */
    // Naming is metadata, so it deliberately does not invalidate the backtest.
    strategyName: S.names[BUILDER_ID] ?? '',
    strategyNamePlaceholder: autoBuilderName,
    strategyDisplayName: builderLabel,
    onStrategyName: (v: string) => set(s => ({ names: { ...s.names, [BUILDER_ID]: v } })),
    conds, condCount: S.conds.length, cmps: CMPS,
    canAddCond: S.conds.length < 3 && !locked,
    addCond: () =>
      set(s => ({
        conds: s.conds.concat([
          { metric: 'RSI', symbol: s.conds[0].symbol, symbol2: 'TCS', cmp: 'is less than', value: '32' },
        ]),
        joins: s.joins.concat(['AND']),
        stale: !!s.bt,
      })),
    toggleTime: () => touch({ timeOn: !S.timeOn }),
    locked,
    dayOpts: DAYS.map(d => ({
      label: d,
      on: !!S.days[d],
      toggle: () => set(s => ({ days: { ...s.days, [d]: !s.days[d] }, stale: !!s.bt })),
    })),
    sideOpts: (['BUY', 'SELL'] as const).map(v => ({
      label: v, on: S.side === v, pick: () => touch({ side: v }),
    })),
    sizeOpts: ([
      { k: 'fixed', l: 'Fixed quantity' },
      { k: 'auto', l: 'Auto-size' },
    ] as const).map(o => ({
      label: o.l, on: S.sizing === o.k, pick: () => touch({ sizing: o.k }),
    })),
    isAuto: S.sizing === 'auto', isFixed: S.sizing === 'fixed',
    exitBtnLabel: S.exitOpen ? '– Hide exit rules' : '+ Add exit rule',
    toggleExit: () => set(s => ({ exitOpen: !s.exitOpen })),
    exitRows: [
      {
        label: 'Take profit at', on: S.tpOn, value: S.tp,
        offNote: 'No profit target — the position runs until your exit condition or square-off.',
        toggle: () => touch({ tpOn: !S.tpOn }),
        onChange: (v: string) => touch({ tp: v }),
      },
      {
        label: 'Stop loss at', on: S.slOn, value: S.sl,
        offNote: 'No stop order. Your per-trade maximum still applies at entry.',
        toggle: () => touch({ slOn: !S.slOn }),
        onChange: (v: string) => touch({ sl: v }),
      },
    ],
    riskText: S.risk.toLocaleString('en-IN'),
    onRisk: (v: string) => {
      const n = parseInt(String(v).replace(/[^0-9]/g, ''), 10)
      touch({ risk: isNaN(n) ? 0 : n })
    },
    riskPresets: [1000, 2500, 5000, 10000, 25000].map(v => ({
      label: '₹' + v.toLocaleString('en-IN'),
      on: S.risk === v,
      pick: () => touch({ risk: v }),
    })),
    riskPctNote: ((S.risk / 500000) * 100).toFixed(1) + '%',
    compliance: [
      { label: 'Broker account', value: 'ZR••••4471', ok: true },
      { label: 'Static IP whitelist', value: '49.36.•••.112 · verified', ok: true },
      { label: 'Two-factor authentication', value: 'Active · TOTP', ok: true },
      { label: 'Algo-ID', value: S.algoId || 'issued on activation', ok: !!S.algoId },
    ],
    previewParts,
    isDraft: S.status === 'draft', isLive: S.status === 'live',
    stateNote:
      S.status === 'live'
        ? 'Live. Fields are locked while the strategy is running.'
        : 'Not saved. Nothing runs until you activate it.',
    hasBT: !!S.bt,
    canActivate: !!S.bt && S.status === 'draft' && !S.stale,
    rangeOpts: ['1 month', '3 months', '6 months', '1 year'].map(v => ({
      label: v,
      on: S.btRange === v,
      pick: () => set(s => ({ btRange: v, bt: makeBacktest(v, s) })),
    })),
    runBacktest: () => set(s => ({ bt: makeBacktest(s.btRange, s), stale: false })),
    activate: () =>
      set({
        status: 'live', algoId: 'NCT-4471-XG', stale: false, suggest: null,
        monitorId: BUILDER_ID,
      }),
    edit: () => set({ status: 'draft' }),
    btStats,
    btCurve: bt?.curve ?? '', btArea: bt?.area ?? '',
    btLossX: bt?.lossX ?? '0', btLossY: bt?.lossY ?? '0',
    btTrades: bt?.trades ?? [],

    /* monitor */
    monEmpty: !monReady, monLive: monReady,
    startDemo: () => set({ demo: true }),
    monitorTabs,
    hasMultipleStrategies: monitorTabs.length > 1,
    selectedStrategy: selected.name,
    selectedIsBuilder: selected.isBuilder,
    selectedIsDraft: selected.isBuilder && !selected.live,
    running: !selPaused,
    togglePause: () =>
      set(s => ({
        pausedIds: { ...s.pausedIds, [selected.id]: !(s.pausedIds[selected.id] ?? defaultPaused(selected.id, s)) },
      })),
    monitorSentence: selected.sentence,
    monitorName: selected.name,
    lastCheck: new Date(now).toLocaleTimeString('en-IN', { hour12: false }),
    algoIdDisplay: selected.isBuilder
      ? S.algoId || 'NCT-4471-XG (sample)'
      : 'NCT-4471-XG',
    feed, feedCount: feed.length,
    posSymbol: selected.sym,
    posQty: String(selected.qty),
    posAvg: '₹' + selected.avgPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 }),
    posLtp: '₹' + (selected.avgPrice + pnl / selected.qty).toFixed(2),
    pnlText: (pnl >= 0 ? '+' : '') + inr(pnl),
    pnlUp: pnl >= 0, pnlDown: pnl < 0,
    ...intraday(selected.sym),

    /* audit */
    auditEmpty: props.emptyState === true,
    auditFull: props.emptyState !== true,
    totalRecords: AUDIT.length, shownCount: rows.length, noRows: rows.length === 0,
    hasRows: rows.length > 0,
    cols: ['Timestamp', 'Symbol', 'Signal type', 'Decision', 'Qty', 'Compliance tag', 'Broker order ID']
      .map(l => ({ label: l, num: l === 'Qty' })),
    rows,
    filterGroups: [
      { label: 'Date range', opts: mkOpts('day', ['All dates', '17 Sep', '16 Sep', '15 Sep', '14 Sep', '13 Sep']) },
      { label: 'Decision', opts: mkOpts('decision', ['All', 'Executed', 'Rejected']) },
      { label: 'Stock symbol', opts: mkOpts('symbol', ['All'].concat(SYMS.map(x => x.s))) },
    ],
    clearFilters: () =>
      set({ filters: { day: 'All dates', decision: 'All', symbol: 'All' }, openRow: null }),
    densityOpts: ([
      { k: 'list', l: 'List' },
      { k: 'grid', l: 'Grid' },
    ] as const).map(o => ({ label: o.l, on: S.density === o.k, pick: () => set({ density: o.k }) })),
    isList: S.density === 'list', isGrid: S.density === 'grid',
    exportLabel: S.exported ? 'Exported' : 'Export CSV',
    exportCsv: () => {
      const head = 'Timestamp,Symbol,Signal,Decision,Quantity,Compliance,BrokerOrderID\n'
      const body = filtered
        .map(r => [r.ts, r.sym, '"' + r.signal + '"', r.decision, r.qty, '"' + r.tag + '"', r.order].join(','))
        .join('\n')
      const url = URL.createObjectURL(new Blob([head + body], { type: 'text/csv' }))
      const a = document.createElement('a')
      a.href = url
      a.download = 'nocodetrader-audit-log.csv'
      a.click()
      setTimeout(() => URL.revokeObjectURL(url), 2000)
      set({ exported: true })
    },
  }
}

export type App = ReturnType<typeof useApp>

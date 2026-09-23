import type { CSSProperties, ReactNode } from 'react'
import { C, F, shadowSm } from '../lib/theme'
import { useMediaQuery } from '../lib/useMediaQuery'
import { HoverBtn } from '../components/Hoverable'
import { Eyebrow, Sentence, StatTile } from '../components/ui'
import { rng } from '../lib/format'
import type { Pill } from '../state/types'
import type { App } from '../state/useApp'

const SHELL: CSSProperties = { maxWidth: 1180, margin: '0 auto', padding: '0 26px' }

/** The example rule in the hero, in the same pill form the app uses. */
const HERO_RULE: Pill[] = [
  { t: 'When ', pill: false, text: true },
  { t: 'RELIANCE', pill: true, text: false },
  { t: ' ', pill: false, text: true },
  { t: 'price', pill: true, text: false },
  { t: ' crosses above ', pill: false, text: true },
  { t: '₹2,850', pill: true, text: false },
  { t: ', buy ', pill: false, text: true },
  { t: 'a volatility-adjusted quantity', pill: true, text: false },
  { t: ', risking no more than ', pill: false, text: true },
  { t: '₹5,000', pill: true, text: false },
  { t: ' on the trade.', pill: false, text: true },
]

/**
 * Seeded equity curve, drawn the same way the Backtest Results panel draws its
 * own — so the marketing visual is the product's visual, not a stock image.
 */
function equityCurve(seed: number, points: number, w: number, h: number) {
  const r = rng(seed)
  let v = 0
  const pts: number[] = []
  for (let i = 0; i < points; i++) {
    v += (r() - 0.4) * 100
    pts.push(v)
  }
  const lo = Math.min(0, ...pts)
  const hi = Math.max(...pts)
  const xy = pts.map((p, i) => [
    i * (w / (points - 1)),
    h - 6 - ((p - lo) / (hi - lo || 1)) * (h - 14),
  ])
  // Largest single-step drop — the point the marker calls out.
  let worst = 1
  let worstDrop = 0
  for (let i = 1; i < pts.length; i++) {
    const drop = pts[i] - pts[i - 1]
    if (drop < worstDrop) {
      worstDrop = drop
      worst = i
    }
  }
  const line = xy.map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
  return {
    line,
    area: `0,${h} ${line} ${w},${h}`,
    lowX: xy[worst][0].toFixed(1),
    lowY: xy[worst][1].toFixed(1),
  }
}

export function Landing({ app }: { app: App }) {
  const narrow = useMediaQuery('(max-width: 900px)')

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.ink }}>
      <LandingHeader app={app} />
      <main>
        <Hero app={app} narrow={narrow} />
        <BrokerStrip narrow={narrow} />
        <Problem narrow={narrow} />
        <HowItWorks narrow={narrow} />
        <Features narrow={narrow} />
        <Numbers narrow={narrow} />
        <Compliance narrow={narrow} />
        <Disclaimer />
        <FinalCta app={app} />
      </main>
      <Footer />
    </div>
  )
}

/* ── shared section scaffolding ── */

function Band({
  children, style, id,
}: {
  children: ReactNode; style?: CSSProperties; id?: string
}) {
  return (
    <section id={id} style={{ padding: '84px 0', ...style }}>
      <div style={SHELL}>{children}</div>
    </section>
  )
}

function SectionHead({
  eyebrow, title, lead, narrow,
}: {
  eyebrow: string; title: string; lead?: string; narrow: boolean
}) {
  return (
    <div style={{ marginBottom: 40, maxWidth: 720 }}>
      <Eyebrow style={{ marginBottom: 14 }}>{eyebrow}</Eyebrow>
      <h2
        style={{
          margin: 0,
          font: `700 ${narrow ? 34 : 44}px/1.04 ${F.display}`,
          letterSpacing: '-.04em',
        }}
      >
        {title}
      </h2>
      {lead && (
        <p style={{ margin: '18px 0 0', font: `500 15px/1.75 ${F.body}`, color: C.muted }}>
          {lead}
        </p>
      )}
    </div>
  )
}

function Card({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        background: C.surface, border: '1px solid rgba(20,20,15,.08)', borderRadius: 24,
        padding: 28, boxShadow: shadowSm,
        display: 'flex', flexDirection: 'column', ...style,
      }}
    >
      {children}
    </div>
  )
}

function Grid({
  min, children, columns,
}: {
  min: number; children: ReactNode; columns?: string
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: columns ?? `repeat(auto-fit,minmax(${min}px,1fr))`,
        gap: 16, alignItems: 'stretch',
      }}
    >
      {children}
    </div>
  )
}

function Mark() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
      <div
        style={{
          width: 30, height: 30, borderRadius: 9, background: C.ink,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <div style={{ width: 9, height: 9, borderRadius: '50%', background: C.lime }} />
      </div>
      <div style={{ font: `700 15px/1 ${F.display}`, letterSpacing: '-.02em' }}>NoCodeTrader</div>
    </div>
  )
}

function CtaBtn({
  onClick, children, size = 'lg',
}: {
  onClick: () => void; children: ReactNode; size?: 'lg' | 'sm'
}) {
  return (
    <HoverBtn
      onClick={onClick}
      hover={{ background: '#2c2c22' }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 11,
        padding: size === 'lg' ? '19px 32px' : '13px 22px',
        borderRadius: 999, border: 'none', background: C.ink, color: C.inkInv,
        cursor: 'pointer', font: `700 ${size === 'lg' ? 12 : 10.5}px/1 ${F.body}`,
        letterSpacing: '.14em', textTransform: 'uppercase',
      }}
    >
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.lime }} />
      {children}
    </HoverBtn>
  )
}

/* ── 1. header ── */

function LandingHeader({ app }: { app: App }) {
  return (
    <header
      style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(241,239,233,.86)', backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${C.line2}`,
      }}
    >
      <div
        style={{
          ...SHELL,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 16, paddingTop: 16, paddingBottom: 16,
        }}
      >
        <Mark />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <HoverBtn
            onClick={app.goLogin}
            hover={{ background: C.hover, color: C.ink }}
            style={{
              border: 'none', cursor: 'pointer', padding: '13px 20px', borderRadius: 999,
              background: 'transparent', color: C.muted, font: `600 11px/1 ${F.body}`,
              letterSpacing: '.11em', textTransform: 'uppercase',
            }}
          >
            Log in
          </HoverBtn>
          <CtaBtn onClick={app.goSignup} size="sm">
            Get started
          </CtaBtn>
        </div>
      </div>
    </header>
  )
}

/* ── 2. hero ── */

function Hero({ app, narrow }: { app: App; narrow: boolean }) {
  return (
    <Band style={{ padding: narrow ? '56px 0 72px' : '92px 0 84px' }}>
      <div style={{ maxWidth: 860 }}>
        <Eyebrow style={{ marginBottom: 20 }}>Algo trading for Indian retail traders</Eyebrow>
        <h1
          style={{
            margin: 0,
            font: `700 ${narrow ? 46 : 74}px/.96 ${F.display}`,
            letterSpacing: '-.05em',
          }}
        >
          Turn a trading idea
          <br />
          into an automated trade.
        </h1>
        <p
          style={{
            margin: '26px 0 0', maxWidth: 620,
            font: `500 ${narrow ? 15 : 17}px/1.7 ${F.body}`, color: C.muted,
          }}
        >
          Built for retail traders on the NSE — not institutional desks. You keep your own broker
          account, your own capital, and a hard ceiling on every trade.
        </p>
      </div>

      <HeroPreview narrow={narrow} />

      <div
        style={{
          marginTop: 34, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 18,
        }}
      >
        <CtaBtn onClick={app.goSignup}>Get started</CtaBtn>
        <span style={{ font: `500 13px/1 ${F.body}`, color: C.muted }}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={app.goLogin}
            style={{
              border: 'none', background: 'transparent', cursor: 'pointer',
              font: `700 13px/1 ${F.body}`, color: C.ink,
              borderBottom: '1px solid rgba(20,20,15,.3)', padding: '0 0 2px',
            }}
          >
            Log in
          </button>
        </span>
      </div>
    </Band>
  )
}

/** A product panel: the rule on the left, its backtest on the right. */
function HeroPreview({ narrow }: { narrow: boolean }) {
  const c = equityCurve(41, 26, 320, 132)
  const stats = [
    { value: '+₹12,480', label: 'Net P&L', color: '#3d6b12', ghostChar: '1' },
    { value: '61%', label: 'Win rate', color: C.ink, ghostChar: '6' },
    { value: '-₹7,296', label: 'Max drawdown', color: '#a8341f', ghostChar: '7' },
  ]

  return (
    <div
      style={{
        marginTop: 44, background: C.surface, border: '1px solid rgba(20,20,15,.08)',
        borderRadius: 26, boxShadow: '0 1px 2px rgba(20,20,15,.04),0 34px 70px -44px rgba(20,20,15,.45)',
        overflow: 'hidden',
        display: 'grid', gridTemplateColumns: narrow ? '1fr' : 'minmax(0,1.05fr) minmax(0,1fr)',
      }}
    >
      <div style={{ padding: narrow ? 26 : 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.lime }} />
          <Eyebrow>A strategy is one plain-English sentence</Eyebrow>
        </div>
        <Sentence parts={HERO_RULE} fontSize={narrow ? '19px/1.7' : '23px/1.72'} />
        <p
          style={{
            margin: '22px 0 0', paddingTop: 20, borderTop: `1px solid ${C.line2}`,
            font: `500 13px/1.7 ${F.body}`, color: C.muted,
          }}
        >
          You define the rule. NoCodeTrader watches the market, validates every signal, and places
          the order through your own broker account. No code, at any point.
        </p>
      </div>

      <div
        style={{
          padding: narrow ? 26 : 32, background: C.surfaceAlt,
          borderLeft: narrow ? 'none' : `1px solid ${C.line2}`,
          borderTop: narrow ? `1px solid ${C.line2}` : 'none',
        }}
      >
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 12, marginBottom: 20,
          }}
        >
          <Eyebrow>Backtested before it runs</Eyebrow>
          <span
            style={{
              display: 'inline-flex', padding: '5px 11px', borderRadius: 999,
              background: C.ink, color: C.inkInv, font: `700 9px/1.3 ${F.body}`,
              letterSpacing: '.12em', textTransform: 'uppercase',
            }}
          >
            3 months
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 8 }}>
          {stats.map(st => (
            <div
              key={st.label}
              style={{
                position: 'relative', overflow: 'hidden', border: `1px solid ${C.line}`,
                borderRadius: 14, padding: '14px 12px', background: C.surface,
              }}
            >
              <div
                aria-hidden
                style={{
                  position: 'absolute', right: -4, bottom: -22, font: `800 58px/1 ${F.display}`,
                  color: 'rgba(20,20,15,.045)', pointerEvents: 'none', userSelect: 'none',
                }}
              >
                {st.ghostChar}
              </div>
              <div
                style={{
                  position: 'relative', font: `700 19px/1 ${F.display}`,
                  letterSpacing: '-.035em', color: st.color, whiteSpace: 'nowrap',
                }}
              >
                {st.value}
              </div>
              <div
                style={{
                  position: 'relative', marginTop: 8, font: `600 9px/1.3 ${F.body}`,
                  letterSpacing: '.1em', textTransform: 'uppercase', color: '#8b877c',
                }}
              >
                {st.label}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 16, border: `1px solid ${C.line}`, borderRadius: 16,
            background: C.surface, padding: 14,
          }}
        >
          <svg viewBox="0 0 320 132" width="100%" height="132" preserveAspectRatio="none" aria-hidden>
            <line x1="0" y1="66" x2="320" y2="66" stroke="rgba(20,20,15,.07)" strokeWidth="1" />
            <polyline points={c.area} fill="rgba(20,20,15,.05)" stroke="none" />
            <polyline
              points={c.line} fill="none" stroke={C.ink} strokeWidth="2" strokeLinejoin="round"
            />
            <circle cx={c.lowX} cy={c.lowY} r="4.5" fill="#a8341f" />
            <circle cx={c.lowX} cy={c.lowY} r="9" fill="none" stroke="#a8341f" strokeWidth="1" opacity=".4" />
          </svg>
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 8, marginTop: 10,
              font: `500 10.5px/1 ${F.body}`, color: '#8b877c',
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#a8341f' }} />
            Largest losing trade · simulated
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── 3. problem ── */

const PROBLEMS = [
  {
    title: 'A good idea you can’t run',
    body: 'You can describe your edge in one sentence. Automating it means writing and hosting code — so the idea stays manual, or stays an idea.',
  },
  {
    title: 'Manual execution misses the moment',
    body: 'Watching a chart to click buy costs you the entry. Miss the close by ninety seconds and the trade you modelled is not the trade you got.',
  },
  {
    title: 'Tools that won’t explain themselves',
    body: 'Most tools tell you what they did, not why — and few were designed around India’s 2026 algorithmic trading rules from the first line.',
  },
]

function Problem({ narrow }: { narrow: boolean }) {
  return (
    <Band>
      <SectionHead
        narrow={narrow}
        eyebrow="The gap"
        title="Retail traders don’t lack ideas. They lack a safe way to run them."
      />
      <Grid min={300}>
        {PROBLEMS.map((p, i) => (
          <Card key={p.title}>
            <div style={{ font: `500 12px/1 ${F.mono}`, color: C.faint, marginBottom: 16 }}>
              0{i + 1}
            </div>
            <h3 style={{ margin: 0, font: `600 20px/1.25 ${F.display}`, letterSpacing: '-.02em' }}>
              {p.title}
            </h3>
            <p style={{ margin: '12px 0 0', font: `500 13.5px/1.7 ${F.body}`, color: C.muted }}>
              {p.body}
            </p>
          </Card>
        ))}
      </Grid>
    </Band>
  )
}

/* ── 4. how it works ── */

const STEPS = [
  {
    title: 'Define your rule',
    screen: 'Strategy Builder',
    body: 'Pick a stock, an indicator and a threshold from dropdowns. The sentence at the bottom of the screen is your strategy, in plain English, updating as you type.',
  },
  {
    title: 'Backtest it',
    screen: 'Backtest Results',
    body: 'Run the exact rule against historical data and read the equity curve, win rate and worst losing trade — before a rupee is at risk.',
  },
  {
    title: 'Activate',
    screen: 'Compliance checks',
    body: 'Four checks pass — broker account, static IP, 2FA session, Algo-ID — and the engine starts watching the market and validating signals continuously.',
  },
  {
    title: 'Monitor and review',
    screen: 'Live Monitor · Audit Log',
    body: 'Follow every decision as it happens, then read the permanent record of everything evaluated — executed or rejected, with the reasoning attached.',
  },
]

/* ── step visuals: each mirrors the real screen the step names ── */

const vizFrame: CSSProperties = {
  height: 96, marginBottom: 20, borderRadius: 14, border: `1px solid ${C.line}`,
  background: C.surfaceAlt, padding: 12, overflow: 'hidden',
  display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 7,
}

function MiniPill({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return (
    <span
      style={{
        display: 'inline-block', padding: '3px 9px', borderRadius: 7,
        border: `1px solid ${dark ? 'transparent' : C.line5}`,
        background: dark ? C.ink : C.surface, color: dark ? C.inkInv : C.ink,
        font: `600 10px/1.4 ${F.body}`, whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  )
}

/** 1 · Strategy Builder — the rule being assembled from pills. */
function VizDefine() {
  return (
    <div style={vizFrame}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, alignItems: 'center' }}>
        <span style={{ font: `500 10px/1.4 ${F.body}`, color: C.muted }}>When</span>
        <MiniPill>RELIANCE</MiniPill>
        <MiniPill>price</MiniPill>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, alignItems: 'center' }}>
        <span style={{ font: `500 10px/1.4 ${F.body}`, color: C.muted }}>crosses above</span>
        <MiniPill>₹2,850</MiniPill>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, alignItems: 'center' }}>
        <MiniPill dark>BUY</MiniPill>
        <span style={{ font: `500 10px/1.4 ${F.body}`, color: C.muted }}>risking ≤</span>
        <MiniPill>₹5,000</MiniPill>
      </div>
    </div>
  )
}

/** 2 · Backtest Results — an equity curve. */
function VizBacktest() {
  const c = equityCurve(7, 22, 220, 60)
  return (
    <div style={{ ...vizFrame, justifyContent: 'space-between' }}>
      <svg viewBox="0 0 220 60" width="100%" height="52" preserveAspectRatio="none" aria-hidden>
        <polyline points={c.area} fill="rgba(20,20,15,.06)" stroke="none" />
        <polyline points={c.line} fill="none" stroke={C.ink} strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
      <div style={{ display: 'flex', gap: 14 }}>
        <span style={{ font: `700 12px/1 ${F.display}`, color: '#3d6b12' }}>+₹12,480</span>
        <span style={{ font: `500 10px/1.2 ${F.body}`, color: '#8b877c' }}>61% win rate</span>
      </div>
    </div>
  )
}

/** 3 · Compliance checks — the four green dots that gate activation. */
function VizActivate() {
  const checks = ['Broker account', 'Static IP', '2FA session', 'Algo-ID']
  return (
    <div style={vizFrame}>
      {checks.map(c => (
        <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.green, flex: 'none' }} />
          <span style={{ font: `500 10.5px/1.3 ${F.body}`, color: C.soft }}>{c}</span>
          <div style={{ flex: 1, height: 1, background: C.line2 }} />
          <span style={{ font: `600 9px/1 ${F.mono}`, color: C.faint }}>OK</span>
        </div>
      ))}
    </div>
  )
}

/** 4 · Live Monitor / Audit Log — an accepted signal and a refused one. */
function VizMonitor() {
  return (
    <div style={{ ...vizFrame, gap: 6 }}>
      <div
        style={{
          borderRadius: 9, border: `1px solid ${C.line}`, background: C.surface,
          padding: '7px 9px', display: 'flex', alignItems: 'center', gap: 7,
        }}
      >
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: C.green, flex: 'none' }} />
        <span style={{ font: `600 10px/1.3 ${F.body}`, color: C.ink }}>Order placed</span>
        <span style={{ font: `500 9px/1 ${F.mono}`, color: C.faint, marginLeft: 'auto' }}>18 × RELIANCE</span>
      </div>
      <div
        style={{
          borderRadius: 9, border: '1px solid #e8c0b4', background: '#fdf1ed',
          padding: '7px 9px', display: 'flex', alignItems: 'center', gap: 7,
        }}
      >
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#a8341f', flex: 'none' }} />
        <span style={{ font: `600 10px/1.3 ${F.body}`, color: '#7d2a19' }}>Duplicate rejected</span>
        <span style={{ font: `500 9px/1 ${F.mono}`, color: '#9c6a5c', marginLeft: 'auto' }}>logged</span>
      </div>
      <div style={{ font: `500 9.5px/1.3 ${F.body}`, color: '#8b877c' }}>
        Both are written to the audit log.
      </div>
    </div>
  )
}

const STEP_VIZ = [VizDefine, VizBacktest, VizActivate, VizMonitor]


function HowItWorks({ narrow }: { narrow: boolean }) {
  return (
    <Band>
      <SectionHead
        narrow={narrow}
        eyebrow="How it works"
        title="Four steps, and you can stop at any one of them."
        lead="Nothing runs until you say so. A strategy sits as a draft until you have backtested it and activated it yourself."
      />
      <Grid
        min={320}
        columns={narrow ? 'repeat(auto-fit,minmax(320px,1fr))' : 'repeat(4,minmax(0,1fr))'}
      >
        {STEPS.map((st, i) => (
          <Card key={st.title}>
            {(() => {
              const Viz = STEP_VIZ[i]
              return <Viz />
            })()}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 26, height: 26, borderRadius: 999, background: C.ink, color: C.inkInv,
                  font: `700 10px/1 ${F.mono}`, flex: 'none',
                }}
              >
                {i + 1}
              </span>
              <h3 style={{ margin: 0, font: `600 18px/1.25 ${F.display}`, letterSpacing: '-.02em' }}>
                {st.title}
              </h3>
            </div>
            <p
              style={{
                margin: '0 0 18px', font: `500 13px/1.7 ${F.body}`, color: C.muted, flex: 1,
              }}
            >
              {st.body}
            </p>
            <span
              style={{
                alignSelf: 'flex-start', display: 'inline-flex', padding: '5px 11px',
                borderRadius: 8, border: `1px solid ${C.line4}`, font: `600 10px/1.4 ${F.mono}`,
                color: C.muted,
              }}
            >
              {st.screen}
            </span>
          </Card>
        ))}
      </Grid>
    </Band>
  )
}

/* ── broker strip ── */

const BROKERS = [
  { mark: 'ZRD', name: 'Zerodha', note: 'Kite Connect' },
  { mark: 'UPX', name: 'Upstox', note: 'API v2' },
  { mark: 'FYR', name: 'Fyers', note: 'API v3' },
]

function BrokerStrip({ narrow }: { narrow: boolean }) {
  return (
    <section style={{ padding: '0 0 84px' }}>
      <div style={SHELL}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: narrow ? '1fr' : 'minmax(0,1fr) minmax(0,1.35fr)',
            gap: narrow ? 24 : 40, alignItems: 'center',
            padding: narrow ? '26px' : '30px 34px',
            background: C.surface, border: '1px solid rgba(20,20,15,.08)',
            borderRadius: 24, boxShadow: shadowSm,
          }}
        >
          <div>
            <Eyebrow style={{ marginBottom: 12 }}>Your broker, your capital</Eyebrow>
            <p style={{ margin: 0, font: `500 14px/1.7 ${F.body}`, color: C.muted }}>
              NoCodeTrader never holds your funds. It connects to the broker account you already
              have, and the session ends automatically at the close of each trading day.
            </p>
          </div>
          <div
            style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 12,
            }}
          >
            {BROKERS.map(b => (
              <div
                key={b.mark}
                style={{
                  border: `1px solid ${C.line3}`, borderRadius: 16, padding: '18px 20px',
                  background: C.surfaceAlt,
                }}
              >
                <div
                  style={{
                    font: `700 24px/1 ${F.display}`, letterSpacing: '-.04em', color: C.ink,
                  }}
                >
                  {b.mark}
                </div>
                <div style={{ marginTop: 10, font: `600 13px/1.2 ${F.body}` }}>{b.name}</div>
                <div style={{ marginTop: 5, font: `500 11px/1.4 ${F.body}`, color: '#8b877c' }}>
                  {b.note}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── numbers band ── */

const NUMBERS = [
  { value: '0', label: 'Lines of code to write', ghostChar: '0' },
  { value: '3', label: 'Conditions per strategy', ghostChar: '3' },
  { value: '4', label: 'Pre-trade compliance checks', ghostChar: '4' },
  { value: '5 yr', label: 'Audit log retention', ghostChar: '5' },
]

function Numbers({ narrow }: { narrow: boolean }) {
  return (
    <section style={{ padding: '0 0 84px' }}>
      <div style={SHELL}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: narrow
              ? 'repeat(auto-fit,minmax(150px,1fr))'
              : 'repeat(4,minmax(0,1fr))',
            gap: 12,
          }}
        >
          {NUMBERS.map(n => (
            <StatTile
              key={n.label}
              value={n.value}
              label={n.label}
              color={C.ink}
              ghost
              ghostChar={n.ghostChar}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── 5. features ── */

const FEATURES = [
  {
    title: 'Multi-condition logic',
    body: 'Combine up to three conditions with AND / OR across moving averages, RSI, MACD, volume, Bollinger bands, SuperTrend and VWAP.',
  },
  {
    title: 'Compare two stocks',
    body: 'Trigger on relative strength — fire when one instrument outperforms another by a percentage you set.',
  },
  {
    title: 'Scheduling',
    body: 'Restrict a strategy to a time window and specific weekdays. Outside it, the strategy stays dormant and signals are only recorded.',
  },
  {
    title: 'A hard risk ceiling',
    body: 'Set the maximum rupees a single trade may risk. Breach it and the signal is rejected and logged — never silently resized.',
  },
  {
    title: 'Volatility-adjusted sizing',
    body: 'Quantity is computed at signal time from 14-day realised volatility, then capped so it can never exceed your ceiling.',
  },
  {
    title: 'A permanent audit trail',
    body: 'Every signal the engine evaluates is written to an append-only log with its reasoning — including the ones it refused to act on.',
  },
]

function Features({ narrow }: { narrow: boolean }) {
  return (
    <Band>
      <SectionHead
        narrow={narrow}
        eyebrow="Core features"
        title="Enough control to express a real strategy. Not enough rope to hang yourself."
      />
      <Grid min={320}>
        {FEATURES.map(f => (
          <Card key={f.title} style={{ padding: 26 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.lime }} />
              <h3
                style={{ margin: 0, font: `600 17px/1.25 ${F.display}`, letterSpacing: '-.02em' }}
              >
                {f.title}
              </h3>
            </div>
            <p style={{ margin: 0, font: `500 13px/1.7 ${F.body}`, color: C.muted }}>{f.body}</p>
          </Card>
        ))}
      </Grid>
    </Band>
  )
}

/* ── 6. compliance ── */

const CONTROLS = [
  {
    label: 'Static IP whitelisting',
    value: '49.36.•••.112',
    body: 'Orders leave from one verified address. Anything else is refused before it reaches the broker.',
  },
  {
    label: 'Two-factor authentication',
    value: 'Active · TOTP',
    body: 'Mandatory, and not switchable. Algo execution requires a fresh 2FA session each trading day.',
  },
  {
    label: 'Regulatory order tagging',
    value: 'NCT-4471-XG',
    body: 'Every order carries its unique Algo-ID, so each execution is attributable to the strategy that produced it.',
  },
  {
    label: 'Audit log retention',
    value: '5 years',
    body: 'Append-only and hash-chained. Records cannot be edited or deleted — by you, or by us.',
  },
]

function Compliance({ narrow }: { narrow: boolean }) {
  return (
    <Band>
      <div
        style={{
          position: 'relative', overflow: 'hidden', background: C.ink, color: C.inkInv,
          borderRadius: 28, padding: narrow ? '38px 26px' : '48px 44px',
          boxShadow: '0 30px 70px -40px rgba(20,20,15,.85)',
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute', right: -18, top: -58, font: `800 240px/1 ${F.display}`,
            letterSpacing: '-.06em', color: 'rgba(253,252,249,.05)',
            pointerEvents: 'none', userSelect: 'none',
          }}
        >
          SEBI
        </div>

        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.lime }} />
            <span
              style={{
                font: `700 10px/1 ${F.body}`, letterSpacing: '.18em',
                textTransform: 'uppercase', color: 'rgba(253,252,249,.6)',
              }}
            >
              Compliance, built in from day one
            </span>
          </div>

          <h2
            style={{
              margin: 0, maxWidth: 780,
              font: `700 ${narrow ? 32 : 44}px/1.06 ${F.display}`, letterSpacing: '-.04em',
            }}
          >
            Designed around SEBI’s algorithmic trading framework — not retrofitted onto it.
          </h2>
          <p
            style={{
              margin: '20px 0 0', maxWidth: 640, font: `500 14px/1.75 ${F.body}`,
              color: 'rgba(253,252,249,.62)',
            }}
          >
            The framework took effect in April 2026. NoCodeTrader was built for the self-hosted,
            individually-operated case under it: one trader, their own broker account, their own
            machine — with the controls the framework expects present by default.
          </p>

          <div
            style={{
              marginTop: 38, display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 2,
            }}
          >
            {CONTROLS.map((k, i) => (
              <div
                key={k.label}
                style={{
                  padding: narrow ? '22px 0' : '4px 26px 4px 0',
                  borderTop: narrow && i > 0 ? '1px solid rgba(253,252,249,.14)' : undefined,
                }}
              >
                <div
                  style={{
                    font: `700 10px/1 ${F.body}`, letterSpacing: '.14em',
                    textTransform: 'uppercase', color: 'rgba(253,252,249,.5)', marginBottom: 12,
                  }}
                >
                  {k.label}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
                  <span
                    style={{
                      width: 7, height: 7, borderRadius: '50%', background: C.lime, flex: 'none',
                    }}
                  />
                  <span style={{ font: `600 15px/1.3 ${F.mono}`, overflowWrap: 'anywhere' }}>
                    {k.value}
                  </span>
                </div>
                <p
                  style={{
                    margin: 0, font: `500 12.5px/1.65 ${F.body}`,
                    color: 'rgba(253,252,249,.55)', maxWidth: 260,
                  }}
                >
                  {k.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Band>
  )
}

/* ── 7. disclaimer ── */

function Disclaimer() {
  return (
    <section style={{ padding: '0 0 84px' }}>
      <div style={SHELL}>
        <div
          style={{
            display: 'flex', gap: 14, padding: '22px 24px', borderRadius: 16,
            border: '1px solid rgba(20,20,15,.12)', background: 'transparent',
          }}
        >
          <div
            aria-hidden
            style={{
              flex: 'none', width: 18, height: 18, borderRadius: '50%',
              border: '1.4px solid #8b877c', display: 'flex', alignItems: 'center',
              justifyContent: 'center', font: `700 11px/1 ${F.display}`, color: '#8b877c',
              marginTop: 2,
            }}
          >
            i
          </div>
          <div style={{ font: `500 13px/1.75 ${F.body}`, color: C.muted, maxWidth: 820 }}>
            NoCodeTrader executes exactly the strategy logic you define — nothing more. It does not
            predict markets, recommend trades, or guarantee profitability. Backtested and simulated
            results are modelled on historical data and do not indicate future performance; live
            results will differ. You trade your own capital, through your own broker, at your own
            risk.
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── 8. final CTA + footer ── */

function FinalCta({ app }: { app: App }) {
  return (
    <Band style={{ padding: '0 0 96px' }}>
      <div
        style={{
          background: C.surface, border: '1px solid rgba(20,20,15,.08)', borderRadius: 28,
          padding: '64px 40px', textAlign: 'center', boxShadow: shadowSm,
          position: 'relative', overflow: 'hidden',
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute', left: '50%', top: -40, transform: 'translateX(-50%)',
            font: `800 210px/1 ${F.display}`, color: 'rgba(20,20,15,.035)',
            pointerEvents: 'none', userSelect: 'none',
          }}
        >
          ₹
        </div>
        <div style={{ position: 'relative' }}>
          <h2
            style={{
              margin: '0 auto', maxWidth: 620,
              font: `700 42px/1.06 ${F.display}`, letterSpacing: '-.04em',
            }}
          >
            Write the rule once. Let it watch the market for you.
          </h2>
          <p
            style={{
              margin: '20px auto 0', maxWidth: 480,
              font: `500 14px/1.75 ${F.body}`, color: C.muted,
            }}
          >
            Build a strategy in plain English, backtest it, and activate it with a hard risk ceiling
            and a permanent record of every decision.
          </p>
          <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center' }}>
            <CtaBtn onClick={app.goSignup}>Get started</CtaBtn>
          </div>
        </div>
      </div>
    </Band>
  )
}

function Footer() {
  const link: CSSProperties = {
    font: `500 12.5px/1 ${F.body}`, color: C.muted, textDecoration: 'none',
    borderBottom: '1px solid transparent', paddingBottom: 2,
  }
  return (
    <footer style={{ borderTop: `1px solid ${C.line2}`, padding: '30px 0 44px' }}>
      <div
        style={{
          ...SHELL,
          display: 'flex', flexWrap: 'wrap', alignItems: 'center',
          justifyContent: 'space-between', gap: 18,
        }}
      >
        <Mark />
        <nav style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
          <a href="#terms" style={link}>
            Terms
          </a>
          <a href="#privacy" style={link}>
            Privacy
          </a>
          <a href="#contact" style={link}>
            Contact
          </a>
        </nav>
        <div style={{ font: `500 12px/1 ${F.body}`, color: C.faint }}>
          Student project · not a live trading service
        </div>
      </div>
    </footer>
  )
}

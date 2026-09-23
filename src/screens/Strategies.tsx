import type { ReactNode } from 'react'
import { C, F, NEG, POS, shadowSm } from '../lib/theme'
import { HoverBtn, HoverDiv } from '../components/Hoverable'
import { Eyebrow, Sentence } from '../components/ui'
import type { App } from '../state/useApp'

export function Strategies({ app }: { app: App }) {
  const deployed = app.strats.filter(t => !t.isDraft)
  const drafts = app.strats.filter(t => t.isDraft)

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto' }}>
      {app.noStrats && <EmptyState app={app} />}
      {app.hasStrats && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
          <Header app={app} />
          <SummaryBar app={app} />

          {deployed.length > 0 && (
            <Group label="Deployed" count={deployed.length}>
              {deployed.map(t => (
                <StrategyCard key={t.id} t={t} />
              ))}
            </Group>
          )}

          {drafts.length > 0 && (
            <Group label="Drafts" count={drafts.length}>
              {drafts.map(t => (
                <StrategyCard key={t.id} t={t} />
              ))}
            </Group>
          )}
        </div>
      )}
    </div>
  )
}

/** A labelled band of strategy cards. */
function Group({
  label, count, children,
}: {
  label: string; count: number; children: ReactNode
}) {
  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <Eyebrow>{label}</Eyebrow>
        <span style={{ font: `500 11px/1 ${F.mono}`, color: C.faint }}>{count}</span>
        <div style={{ flex: 1, height: 1, background: C.line2 }} />
      </div>
      <div
        style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(330px,1fr))', gap: 16,
          alignItems: 'stretch',
        }}
      >
        {children}
      </div>
    </section>
  )
}

/** Compact summary strip — secondary to the strategy cards below it. */
function SummaryBar({ app }: { app: App }) {
  return (
    <div
      style={{
        display: 'flex', flexWrap: 'wrap', background: C.surface,
        border: '1px solid rgba(20,20,15,.08)', borderRadius: 20,
        boxShadow: shadowSm, overflow: 'hidden',
      }}
    >
      {app.aggStats.map((s, i) => (
        <div
          key={s.label}
          style={{
            flex: '1 1 200px', padding: '22px 26px',
            borderLeft: i === 0 ? 'none' : `1px solid ${C.line2}`,
          }}
        >
          <div
            style={{
              font: `700 34px/1 ${F.display}`, letterSpacing: '-.035em',
              color: s.pos ? POS : C.ink,
            }}
          >
            {s.value}
          </div>
          <div
            style={{
              marginTop: 9, font: `600 10px/1 ${F.body}`, letterSpacing: '.13em',
              textTransform: 'uppercase', color: '#8b877c',
            }}
          >
            {s.label}
          </div>
        </div>
      ))}
    </div>
  )
}

function PlusIcon({ fill = C.lime }: { fill?: string }) {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11">
      <rect x="5" y="0" width="1.4" height="11" fill={fill} />
      <rect x="0" y="5" width="11" height="1.4" fill={fill} />
    </svg>
  )
}

function EmptyState({ app }: { app: App }) {
  return (
    <div
      style={{
        position: 'relative', overflow: 'hidden', background: C.surface,
        border: '1px solid rgba(20,20,15,.08)', borderRadius: 28, padding: '66px 48px',
        textAlign: 'center', boxShadow: shadowSm,
      }}
    >
      <div
        style={{
          position: 'absolute', left: '50%', top: -34, transform: 'translateX(-50%)',
          font: `800 210px/1 ${F.display}`, color: 'rgba(20,20,15,.035)',
          pointerEvents: 'none', userSelect: 'none',
        }}
      >
        00
      </div>
      <div style={{ position: 'relative' }}>
        <div
          style={{
            font: `700 10px/1 ${F.body}`, letterSpacing: '.18em',
            textTransform: 'uppercase', color: C.faint,
          }}
        >
          Your strategies
        </div>
        <h1 style={{ margin: '18px 0 0', font: `700 54px/1 ${F.display}`, letterSpacing: '-.04em' }}>
          Nothing built yet
        </h1>
        <p
          style={{
            margin: '18px auto 0', maxWidth: 440, font: `500 14px/1.7 ${F.body}`, color: C.muted,
          }}
        >
          A strategy is one plain-English rule — a condition, an action, and a hard risk ceiling.
          Build your first one, backtest it, and it will appear here with its own live monitor.
        </p>
        <button
          type="button"
          onClick={app.goBuilder}
          style={{
            marginTop: 28, display: 'inline-flex', alignItems: 'center', gap: 11,
            padding: '18px 30px', borderRadius: 999, border: 'none', background: C.ink,
            color: C.inkInv, cursor: 'pointer', font: `700 11px/1 ${F.body}`,
            letterSpacing: '.13em', textTransform: 'uppercase',
          }}
        >
          <PlusIcon />
          New strategy
        </button>
      </div>
    </div>
  )
}

function Header({ app }: { app: App }) {
  return (
    <div
      style={{
        display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end',
        justifyContent: 'space-between', gap: 24,
      }}
    >
      <div>
        <h1 style={{ margin: 0, font: `700 62px/.98 ${F.display}`, letterSpacing: '-.045em' }}>
          Your Strategies
        </h1>
        <div
          style={{
            marginTop: 14, display: 'flex', alignItems: 'center', gap: 10,
            font: `600 12px/1 ${F.body}`, letterSpacing: '.04em', color: C.muted,
          }}
        >
          <span
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 13px',
              borderRadius: 999, background: '#eafbc9', border: '1px solid #bfe479',
              font: `700 10px/1 ${F.body}`, letterSpacing: '.12em',
              textTransform: 'uppercase', color: C.greenInk,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.green }} />
            {app.activeCount} active
          </span>
          <span>{app.strats.length === 1 ? '1 strategy' : `${app.strats.length} strategies`}</span>
        </div>
      </div>

      <HoverBtn
        onClick={app.goBuilder}
        hover={{ background: '#2c2c22' }}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 11,
          padding: '18px 30px', borderRadius: 999, border: 'none', background: C.ink,
          color: C.inkInv, cursor: 'pointer', font: `700 11px/1 ${F.body}`,
          letterSpacing: '.13em', textTransform: 'uppercase',
        }}
      >
        <PlusIcon />
        New strategy
      </HoverBtn>
    </div>
  )
}

function StrategyTitle({ t }: { t: App['strats'][number] }) {
  const stop = (e: { stopPropagation: () => void }) => e.stopPropagation()

  if (t.renaming) {
    return (
      <input
        autoFocus
        value={t.nameDraft}
        aria-label="Strategy name"
        onClick={stop}
        onChange={e => t.onRename(e.target.value)}
        onBlur={t.commitRename}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === 'Escape') (e.target as HTMLInputElement).blur()
        }}
        style={{
          flex: 1, minWidth: 0, padding: '7px 10px', borderRadius: 10,
          border: `1px solid ${C.line4}`, background: '#fff',
          font: `600 15px/1.2 ${F.body}`, letterSpacing: '-.01em', color: C.ink,
        }}
      />
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
      <div
        style={{
          font: `600 15px/1.2 ${F.body}`, letterSpacing: '-.01em',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}
      >
        {t.name}
      </div>
      <HoverBtn
        title="Rename strategy"
        onClick={e => {
          e.stopPropagation()
          t.startRename()
        }}
        hover={{ color: C.ink }}
        style={{
          flex: 'none', border: 'none', background: 'transparent', cursor: 'pointer',
          padding: 2, lineHeight: 0, color: C.faint,
        }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
          <path
            d="M8.4 1.6l2 2L4 10H2V8l6.4-6.4Z"
            fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"
          />
        </svg>
      </HoverBtn>
    </div>
  )
}

function StrategyCard({ t }: { t: App['strats'][number] }) {
  const chip = t.isActive
    ? { bg: '#eafbc9', border: '1px solid #bfe479', color: C.greenInk, dot: C.green, label: 'Active' }
    : t.isPaused
      ? { bg: C.hover, border: '1px solid rgba(20,20,15,.14)', color: C.muted, dot: C.faint, label: 'Paused' }
      : { bg: 'transparent', border: `1px dashed ${C.line5}`, color: '#8b877c', dot: '', label: 'Draft' }

  return (
    <HoverDiv
      onClick={t.open}
      hover={{
        borderColor: 'rgba(20,20,15,.3)',
        boxShadow: '0 18px 40px -30px rgba(20,20,15,.4)',
      }}
      style={{
        // Drafts read as placeholders rather than live, earning strategies.
        background: t.isDraft ? 'transparent' : C.surface,
        border: t.isDraft ? `1px dashed rgba(20,20,15,.22)` : '1px solid rgba(20,20,15,.08)',
        borderRadius: 24, padding: 26, cursor: 'pointer',
        boxShadow: t.isDraft ? 'none' : shadowSm,
        display: 'flex', flexDirection: 'column', minHeight: 244,
      }}
    >
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 12, marginBottom: 16,
        }}
      >
        <StrategyTitle t={t} />
        <span
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 12px',
            flex: 'none', borderRadius: 999, background: chip.bg, border: chip.border,
            font: `700 9px/1.3 ${F.body}`, letterSpacing: '.12em', textTransform: 'uppercase',
            color: chip.color, whiteSpace: 'nowrap',
          }}
        >
          {chip.dot && (
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: chip.dot }} />
          )}
          {chip.label}
        </span>
      </div>

      <Sentence parts={t.sentence} fontSize="15.5px/1.7" pillPad="1px 8px" pillRadius={8} />

      <div
        style={{
          // Pushes every card's footer to a shared baseline across the row.
          marginTop: 'auto', paddingTop: 20,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16,
        }}
      >
        <div>
          <div
            style={{
              font: `700 28px/1 ${F.display}`, letterSpacing: '-.035em',
              color: t.isDraft ? C.faint : t.up ? POS : NEG,
            }}
          >
            {t.pnl}
          </div>
          <div
            style={{
              marginTop: 8, font: `600 10px/1 ${F.body}`, letterSpacing: '.13em',
              textTransform: 'uppercase', color: C.faint,
            }}
          >
            {t.pnlLabel}
          </div>
        </div>
        <svg viewBox="0 0 120 40" width="120" height="40" aria-hidden>
          <polyline
            points={t.spark} fill="none" stroke={C.ink}
            strokeWidth="1.8" strokeLinejoin="round" opacity={t.isDraft ? '.25' : '.75'}
          />
        </svg>
      </div>
    </HoverDiv>
  )
}

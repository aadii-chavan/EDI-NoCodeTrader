import { C, F, NEG, POS, shadowSm } from '../lib/theme'
import { HoverBtn, HoverDiv } from '../components/Hoverable'
import { Sentence } from '../components/ui'
import type { App } from '../state/useApp'

export function Strategies({ app }: { app: App }) {
  return (
    <div style={{ maxWidth: 1180, margin: '0 auto' }}>
      {app.noStrats && <EmptyState app={app} />}
      {app.hasStrats && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          <Header app={app} />
          <div
            style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 14,
            }}
          >
            {app.aggStats.map(s => (
              <div
                key={s.label}
                style={{
                  position: 'relative', overflow: 'hidden', background: C.surface,
                  border: '1px solid rgba(20,20,15,.08)', borderRadius: 22, padding: 26,
                  boxShadow: shadowSm,
                }}
              >
                {s.ghost && (
                  <div
                    style={{
                      position: 'absolute', right: -8, bottom: -40,
                      font: `800 120px/1 ${F.display}`, color: 'rgba(20,20,15,.04)',
                      pointerEvents: 'none', userSelect: 'none',
                    }}
                  >
                    {s.ghostChar}
                  </div>
                )}
                <div
                  style={{
                    position: 'relative', font: `700 54px/1 ${F.display}`,
                    letterSpacing: '-.045em', color: s.pos ? POS : C.ink,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    position: 'relative', marginTop: 12, font: `600 11px/1.3 ${F.body}`,
                    letterSpacing: '.12em', textTransform: 'uppercase', color: '#8b877c',
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(330px,1fr))', gap: 16,
            }}
          >
            {app.strats.map(t => (
              <StrategyCard key={t.name} t={t} />
            ))}
          </div>
        </div>
      )}
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
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 18 }}>
      <h1 style={{ margin: 0, font: `700 66px/.95 ${F.display}`, letterSpacing: '-.045em' }}>
        Your
        <br />
        Strategies
      </h1>
      <span
        style={{
          marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 9,
          padding: '9px 16px', borderRadius: 999, background: '#eafbc9',
          border: '1px solid #bfe479', font: `700 11px/1 ${F.body}`, letterSpacing: '.11em',
          textTransform: 'uppercase', color: C.greenInk,
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.green }} />
        <span>{app.activeCount}&nbsp;active</span>
      </span>
      <div style={{ flex: 1 }} />
      <HoverBtn
        onClick={app.goBuilder}
        hover={{ background: '#2c2c22' }}
        style={{
          marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 11,
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

/** Card title that swaps into a text field for inline renaming. */
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
        background: C.surface, border: '1px solid rgba(20,20,15,.08)', borderRadius: 24,
        padding: 26, cursor: 'pointer', boxShadow: shadowSm,
      }}
    >
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 12, marginBottom: 18,
        }}
      >
        <StrategyTitle t={t} />
        <span
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 12px',
            borderRadius: 999, background: chip.bg, border: chip.border,
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

      <Sentence parts={t.sentence} fontSize="16px/1.75" pillPad="1px 8px" pillRadius={8} />

      <div
        style={{
          marginTop: 22, paddingTop: 18, borderTop: `1px solid ${C.line2}`,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16,
        }}
      >
        <div>
          <div
            style={{
              font: `700 30px/1 ${F.display}`, letterSpacing: '-.035em',
              color: t.up ? POS : NEG,
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
        <svg viewBox="0 0 120 40" width="120" height="40">
          <polyline
            points={t.spark} fill="none" stroke={C.ink}
            strokeWidth="1.8" strokeLinejoin="round" opacity=".75"
          />
        </svg>
      </div>
    </HoverDiv>
  )
}

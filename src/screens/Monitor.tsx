import { C, F, shadowSm } from '../lib/theme'
import { HoverBtn } from '../components/Hoverable'
import { Sentence } from '../components/ui'
import type { App } from '../state/useApp'

export function Monitor({ app }: { app: App }) {
  return (
    <div style={{ maxWidth: 1180, margin: '0 auto' }}>
      {app.monEmpty && <EmptyState app={app} />}
      {app.monLive && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          {app.hasMultipleStrategies && <StrategyTabs app={app} />}
          <StrategyBar app={app} />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0,1.35fr) minmax(0,1fr)',
              gap: 22,
              alignItems: 'start',
            }}
          >
            <DecisionFeed app={app} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              <Position app={app} />
              <IntradayChart app={app} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function EmptyState({ app }: { app: App }) {
  return (
    <div
      style={{
        position: 'relative', overflow: 'hidden', background: C.surface,
        border: '1px solid rgba(20,20,15,.08)', borderRadius: 28, padding: '64px 48px',
        textAlign: 'center', boxShadow: shadowSm,
      }}
    >
      <div
        style={{
          position: 'absolute', left: '50%', top: -30, transform: 'translateX(-50%)',
          font: `800 200px/1 ${F.display}`, color: 'rgba(20,20,15,.035)',
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
          Live Monitor
        </div>
        <h1 style={{ margin: '18px 0 0', font: `700 52px/1 ${F.display}`, letterSpacing: '-.04em' }}>
          Nothing is running
        </h1>
        <p
          style={{
            margin: '18px auto 0', maxWidth: 430, font: `500 14px/1.7 ${F.body}`, color: C.muted,
          }}
        >
          You haven't activated a strategy yet. Build one in the Strategy Builder, run a backtest,
          then activate it — this screen will follow every decision it makes, second by second.
        </p>
        <div
          style={{
            marginTop: 28, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap',
          }}
        >
          <button
            type="button"
            onClick={app.goBuilder}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 11, padding: '17px 28px',
              borderRadius: 999, border: 'none', background: C.ink, color: C.inkInv,
              cursor: 'pointer', font: `700 11px/1 ${F.body}`, letterSpacing: '.13em',
              textTransform: 'uppercase',
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.lime }} />
            Build a strategy
          </button>
          <HoverBtn
            onClick={app.startDemo}
            hover={{ background: 'rgba(20,20,15,.04)' }}
            style={{
              padding: '17px 28px', borderRadius: 999, border: `1px solid ${C.line4}`,
              background: 'transparent', cursor: 'pointer', font: `700 11px/1 ${F.body}`,
              letterSpacing: '.13em', textTransform: 'uppercase', color: C.ink,
            }}
          >
            Preview with sample data
          </HoverBtn>
        </div>
      </div>
    </div>
  )
}

/** Lets the user switch between the strategies they have running. */
function StrategyTabs({ app }: { app: App }) {
  return (
    <div
      role="tablist"
      aria-label="Running strategies"
      style={{
        display: 'flex', gap: 5, padding: 5, borderRadius: 999,
        background: C.surface, border: `1px solid ${C.line}`, boxShadow: shadowSm,
        overflowX: 'auto', width: 'max-content', maxWidth: '100%',
      }}
    >
      {app.monitorTabs.map(t => (
        <HoverBtn
          key={t.id}
          onClick={t.pick}
          hover={t.on ? undefined : { background: C.hover, color: C.ink }}
          style={{
            display: 'flex', alignItems: 'center', gap: 9, flex: 'none',
            border: 'none', cursor: 'pointer', padding: '11px 20px', borderRadius: 999,
            background: t.on ? C.ink : 'transparent',
            color: t.on ? C.inkInv : C.muted,
            font: `${t.on ? 700 : 600} 11px/1 ${F.body}`,
            letterSpacing: '.08em', textTransform: 'uppercase', whiteSpace: 'nowrap',
          }}
        >
          <span
            aria-hidden
            style={{
              width: 7, height: 7, borderRadius: '50%', flex: 'none',
              background: t.draft ? 'transparent' : t.running ? C.lime : C.faint,
              border: t.draft ? `1px dashed ${t.on ? 'rgba(253,252,249,.6)' : C.faint}` : undefined,
              animation: t.running && !t.draft ? 'blip 2.4s ease-in-out infinite' : undefined,
            }}
          />
          {t.name}
        </HoverBtn>
      ))}
    </div>
  )
}

function StrategyBar({ app }: { app: App }) {
  const running = app.running
  return (
    <div
      style={{
        background: C.surface, border: '1px solid rgba(20,20,15,.08)', borderRadius: 24,
        padding: '26px 28px', boxShadow: shadowSm,
      }}
    >
      <div
        style={{
          display: 'flex', flexWrap: 'wrap', gap: 22,
          alignItems: 'flex-start', justifyContent: 'space-between',
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 14,
            }}
          >
            <span
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 9, padding: '8px 15px',
                borderRadius: 999,
                background: running ? '#eafbc9' : 'rgba(20,20,15,.06)',
                border: `1px solid ${running ? '#bfe479' : 'rgba(20,20,15,.14)'}`,
                font: `700 10px/1 ${F.body}`, letterSpacing: '.14em',
                textTransform: 'uppercase', color: running ? C.greenInk : C.muted,
              }}
            >
              <span
                style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: running ? C.green : C.faint,
                  animation: running ? 'blip 1.6s ease-in-out infinite' : undefined,
                }}
              />
              {running ? 'Active' : 'Paused'}
            </span>
            <span
              style={{
                font: `600 13px/1 ${F.body}`, color: C.ink, letterSpacing: '-.01em',
                whiteSpace: 'nowrap',
              }}
            >
              {app.monitorName}
            </span>
            <span style={{ font: `500 12px/1 ${F.mono}`, color: '#c9c5ba' }}>·</span>
            <span style={{ font: `500 12px/1 ${F.mono}`, color: '#8b877c', whiteSpace: 'nowrap' }}>
              Last checked {app.lastCheck}
            </span>
            <span style={{ font: `500 12px/1 ${F.mono}`, color: '#c9c5ba' }}>·</span>
            <span style={{ font: `500 12px/1 ${F.mono}`, color: '#8b877c', whiteSpace: 'nowrap' }}>
              Algo-ID {app.algoIdDisplay}
            </span>
          </div>
          <Sentence
            parts={app.monitorSentence}
            fontSize="20px/1.7"
            pillPad="1px 9px"
            pillRadius={8}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-end' }}>
          <HoverBtn
            onClick={app.togglePause}
            hover={running ? { background: '#2c2c22' } : undefined}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 12, padding: '20px 34px',
              borderRadius: 999, border: 'none', background: C.ink, color: C.inkInv,
              cursor: 'pointer', font: `700 13px/1 ${F.body}`, letterSpacing: '.15em',
              textTransform: 'uppercase',
            }}
          >
            {running ? (
              <svg width="12" height="13" viewBox="0 0 12 13">
                <rect x="1" y="1" width="3.4" height="11" fill={C.lime} />
                <rect x="7.6" y="1" width="3.4" height="11" fill={C.lime} />
              </svg>
            ) : (
              <svg width="12" height="13" viewBox="0 0 12 13">
                <polygon points="2,1 11,6.5 2,12" fill={C.lime} />
              </svg>
            )}
            {running ? 'Pause Strategy' : 'Resume Strategy'}
          </HoverBtn>
          <button
            type="button"
            onClick={app.goBuilder}
            style={{
              border: 'none', background: 'transparent', cursor: 'pointer', padding: '0 0 4px',
              font: `700 10px/1 ${F.body}`, letterSpacing: '.13em', textTransform: 'uppercase',
              color: C.muted, borderBottom: '1px solid rgba(20,20,15,.22)',
            }}
          >
            Edit strategy
          </button>
        </div>
      </div>
    </div>
  )
}

function DecisionFeed({ app }: { app: App }) {
  return (
    <section
      style={{
        background: C.surface, border: '1px solid rgba(20,20,15,.08)', borderRadius: 24,
        padding: 26, boxShadow: shadowSm,
      }}
    >
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 14, marginBottom: 20,
        }}
      >
        <h2 style={{ margin: 0, font: `600 24px/1 ${F.display}`, letterSpacing: '-.03em' }}>
          Decision feed
        </h2>
        <span
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px',
            borderRadius: 999, border: '1px solid rgba(20,20,15,.14)',
            font: `600 10px/1 ${F.body}`, letterSpacing: '.12em',
            textTransform: 'uppercase', color: C.muted,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.lime }} />
          <span>{app.feedCount}&nbsp;entries</span>
        </span>
      </div>

      <div
        style={{
          display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 520, overflow: 'auto',
        }}
      >
        {app.feed.map((f, i) => (
          <div
            key={`${f.title}-${i}`}
            style={{
              border: `1px solid ${f.isReject ? '#e8c0b4' : 'rgba(20,20,15,.08)'}`,
              borderRadius: 16, padding: '16px 18px',
              background: f.isReject ? '#fdf1ed' : C.surfaceAlt,
              animation: 'fadein .3s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span
                style={{ font: `500 11px/1 ${F.mono}`, color: f.isReject ? '#9c6a5c' : C.faint }}
              >
                {f.time}
              </span>
              <span
                style={{
                  display: 'inline-flex', padding: '3px 9px', borderRadius: 7,
                  background: f.isReject ? '#a8341f' : undefined,
                  border: f.isReject ? undefined : '1px solid rgba(20,20,15,.18)',
                  color: f.isReject ? '#fff' : C.muted,
                  font: `700 9px/1.4 ${F.body}`, letterSpacing: '.12em', textTransform: 'uppercase',
                }}
              >
                {f.isReject ? 'Rejected' : f.tag}
              </span>
            </div>
            <div
              style={{ font: `600 14px/1.5 ${F.body}`, color: f.isReject ? '#7d2a19' : C.ink }}
            >
              {f.title}
            </div>
            <div
              style={{
                marginTop: 5, font: `500 12.5px/1.6 ${F.body}`,
                color: f.isReject ? '#9c6a5c' : C.muted,
              }}
            >
              {f.body}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Position({ app }: { app: App }) {
  const stat = (v: string, l: string) => (
    <div key={l}>
      <div style={{ font: `700 28px/1 ${F.display}`, letterSpacing: '-.03em' }}>{v}</div>
      <div
        style={{
          marginTop: 7, font: `600 10px/1 ${F.body}`, letterSpacing: '.13em',
          textTransform: 'uppercase', color: 'rgba(253,252,249,.5)',
        }}
      >
        {l}
      </div>
    </div>
  )
  return (
    <section
      style={{
        position: 'relative', overflow: 'hidden', background: C.ink, color: C.inkInv,
        borderRadius: 24, padding: 28, boxShadow: '0 26px 60px -42px rgba(20,20,15,.8)',
      }}
    >
      {app.ghost && (
        <div
          style={{
            position: 'absolute', right: -10, bottom: -56, font: `800 150px/1 ${F.display}`,
            color: 'rgba(253,252,249,.05)', pointerEvents: 'none', userSelect: 'none',
          }}
        >
          {app.posQty}
        </div>
      )}
      <div style={{ position: 'relative' }}>
        <div
          style={{
            font: `700 10px/1 ${F.body}`, letterSpacing: '.18em', textTransform: 'uppercase',
            color: 'rgba(253,252,249,.5)', marginBottom: 16,
          }}
        >
          Current position
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
          <span
            style={{
              display: 'inline-flex', padding: '4px 11px', borderRadius: 8,
              border: '1px solid rgba(253,252,249,.28)', font: `600 13px/1.3 ${F.mono}`,
            }}
          >
            {app.posSymbol}
          </span>
          <span
            style={{
              font: `600 11px/1 ${F.body}`, letterSpacing: '.12em', textTransform: 'uppercase',
              color: 'rgba(253,252,249,.55)',
            }}
          >
            Long · intraday
          </span>
        </div>
        <div
          style={{
            font: `700 60px/1 ${F.display}`, letterSpacing: '-.045em',
            color: app.pnlUp ? C.lime : '#f0a898',
          }}
        >
          {app.pnlText}
        </div>
        <div
          style={{
            marginTop: 10, font: `600 11px/1 ${F.body}`, letterSpacing: '.14em',
            textTransform: 'uppercase', color: 'rgba(253,252,249,.5)',
          }}
        >
          Unrealised profit / loss
        </div>
        <div
          style={{
            marginTop: 24, display: 'flex', gap: 28, paddingTop: 20,
            borderTop: '1px solid rgba(253,252,249,.14)',
          }}
        >
          {stat(app.posQty, 'Quantity')}
          {stat(app.posAvg, 'Avg price')}
          {stat(app.posLtp, 'Last price')}
        </div>
      </div>
    </section>
  )
}

function IntradayChart({ app }: { app: App }) {
  return (
    <section
      style={{
        background: C.surface, border: '1px solid rgba(20,20,15,.08)', borderRadius: 24,
        padding: 24, boxShadow: shadowSm,
      }}
    >
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 12, marginBottom: 6,
        }}
      >
        <div style={{ font: `600 13px/1 ${F.body}`, color: C.soft }}>Today · 1-minute</div>
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            font: `500 11px/1 ${F.body}`, color: '#8b877c',
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.ink }} />
          Execution
        </div>
      </div>
      <svg viewBox="0 0 400 160" width="100%" height="160" preserveAspectRatio="none">
        <polyline points={app.dayArea} fill="rgba(20,20,15,.05)" stroke="none" />
        <polyline
          points={app.dayCurve} fill="none" stroke={C.ink}
          strokeWidth="2" strokeLinejoin="round"
        />
        <line
          x1={app.execX} y1="0" x2={app.execX} y2="160"
          stroke="rgba(20,20,15,.25)" strokeWidth="1" strokeDasharray="3 4"
        />
        <circle cx={app.execX} cy={app.execY} r="5.5" fill={C.ink} />
        <circle
          cx={app.execX} cy={app.execY} r="10" fill="none"
          stroke={C.ink} strokeWidth="1" opacity=".3"
        />
      </svg>
      <div
        style={{
          display: 'flex', justifyContent: 'space-between', font: `500 10px/1 ${F.mono}`,
          color: C.faint, marginTop: 8,
        }}
      >
        <span>09:15</span>
        <span>12:00</span>
        <span>15:30</span>
      </div>
    </section>
  )
}

import { C, F, NEG, POS, shadowSm } from '../lib/theme'
import { useMediaQuery } from '../lib/useMediaQuery'
import { HoverBtn, HoverDiv } from '../components/Hoverable'
import type { App } from '../state/useApp'

const GRID = '124px 92px minmax(0,1.25fr) 100px 56px minmax(0,1.05fr) 116px'

export function Audit({ app }: { app: App }) {
  // Below this the sidebar would squeeze the table into a horizontal scroll,
  // so the filters move above it and the table takes the full width.
  const narrow = useMediaQuery('(max-width: 1100px)')

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto' }}>
      {app.auditEmpty && <EmptyState app={app} />}
      {app.auditFull && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          <Header app={app} />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: narrow ? 'minmax(0,1fr)' : '270px minmax(0,1fr)',
              gap: 22, alignItems: 'start',
            }}
          >
            <Filters app={app} narrow={narrow} />
            <div style={{ minWidth: 0 }}>
              <Toolbar app={app} />
              {app.isList && <ListView app={app} />}
              {app.isGrid && <GridView app={app} />}
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
        border: '1px solid rgba(20,20,15,.08)', borderRadius: 28,
        padding: '64px 48px', textAlign: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute', left: '50%', top: -24, transform: 'translateX(-50%)',
          font: `800 190px/1 ${F.display}`, color: 'rgba(20,20,15,.035)',
          pointerEvents: 'none', userSelect: 'none',
        }}
      >
        LOG
      </div>
      <div style={{ position: 'relative' }}>
        <div
          style={{
            font: `700 10px/1 ${F.body}`, letterSpacing: '.18em',
            textTransform: 'uppercase', color: C.faint,
          }}
        >
          Audit Log
        </div>
        <h1 style={{ margin: '18px 0 0', font: `700 52px/1 ${F.display}`, letterSpacing: '-.04em' }}>
          No records yet
        </h1>
        <p
          style={{
            margin: '18px auto 0', maxWidth: 430, font: `500 14px/1.7 ${F.body}`, color: C.muted,
          }}
        >
          The log fills itself the moment a strategy goes live. Every signal it sees — executed or
          rejected — lands here permanently.
        </p>
        <button
          type="button"
          onClick={app.goBuilder}
          style={{
            marginTop: 28, display: 'inline-flex', alignItems: 'center', gap: 11,
            padding: '17px 28px', borderRadius: 999, border: 'none', background: C.ink,
            color: C.inkInv, cursor: 'pointer', font: `700 11px/1 ${F.body}`,
            letterSpacing: '.13em', textTransform: 'uppercase',
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.lime }} />
          Build a strategy
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
          Audit Log
        </h1>
        <div
          style={{
            marginTop: 14, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
            font: `500 12.5px/1.5 ${F.body}`, color: C.muted,
          }}
        >
          <span
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 13px',
              borderRadius: 999, background: C.ink, color: C.inkInv,
              font: `700 10px/1 ${F.body}`, letterSpacing: '.12em', textTransform: 'uppercase',
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.lime }} />
            {app.totalRecords} records
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
            <svg width="11" height="13" viewBox="0 0 11 13" aria-hidden>
              <rect
                x="1" y="5" width="9" height="7.2" rx="1.6"
                fill="none" stroke="#8b877c" strokeWidth="1.3"
              />
              <path
                d="M3.2 5V3.4a2.3 2.3 0 0 1 4.6 0V5"
                fill="none" stroke="#8b877c" strokeWidth="1.3"
              />
            </svg>
            Append-only — records cannot be edited or deleted, by you or by us.
          </span>
        </div>
      </div>

      <HoverBtn
        onClick={app.exportCsv}
        hover={{ background: '#fff', borderColor: 'rgba(20,20,15,.4)' }}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 11,
          padding: '16px 26px', borderRadius: 999, border: `1px solid ${C.line4}`,
          background: C.surface, cursor: 'pointer', font: `700 11px/1 ${F.body}`,
          letterSpacing: '.13em', textTransform: 'uppercase', color: C.ink,
        }}
      >
        <svg width="12" height="13" viewBox="0 0 12 13" aria-hidden>
          <path d="M6 1v8" stroke={C.ink} strokeWidth="1.5" fill="none" />
          <path d="M2.5 6L6 9.5 9.5 6" stroke={C.ink} strokeWidth="1.5" fill="none" />
          <rect x="1" y="11" width="10" height="1.5" fill={C.ink} />
        </svg>
        {app.exportLabel}
      </HoverBtn>
    </div>
  )
}

/** Record count and view controls, sitting directly above the table. */
function Toolbar({ app }: { app: App }) {
  return (
    <div
      style={{
        display: 'flex', flexWrap: 'wrap', alignItems: 'center',
        justifyContent: 'space-between', gap: 16, marginBottom: 14,
      }}
    >
      <div style={{ font: `500 12.5px/1 ${F.body}`, color: '#8b877c' }}>
        Showing <span style={{ font: `700 1em/1 ${F.body}`, color: C.ink }}>{app.shownCount}</span>{' '}
        of {app.totalRecords} records
      </div>
      <div style={{ display: 'flex', gap: 4, padding: 4, borderRadius: 12, background: C.hover }}>
        {app.densityOpts.map(d => (
          <button
            key={d.label}
            type="button"
            onClick={d.pick}
            style={{
              border: 'none', cursor: 'pointer', padding: '9px 18px', borderRadius: 9,
              background: d.on ? C.ink : 'transparent',
              color: d.on ? C.inkInv : '#8b877c',
              font: `${d.on ? 700 : 600} 10px/1 ${F.body}`,
              letterSpacing: '.11em', textTransform: 'uppercase',
            }}
          >
            {d.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function Filters({ app, narrow }: { app: App; narrow: boolean }) {
  return (
    <aside
      style={{
        background: C.surface, border: '1px solid rgba(20,20,15,.08)', borderRadius: 22,
        padding: 24, boxShadow: shadowSm,
        ...(narrow ? null : { position: 'sticky' as const, top: 22 }),
      }}
    >
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 10, marginBottom: 20,
        }}
      >
        <span
          style={{
            font: `700 10px/1 ${F.body}`, letterSpacing: '.16em',
            textTransform: 'uppercase', color: C.faint,
          }}
        >
          Filters
        </span>
        <HoverBtn
          onClick={app.clearFilters}
          hover={{ color: C.ink }}
          style={{
            border: 'none', background: 'transparent', cursor: 'pointer',
            font: `600 10px/1 ${F.body}`, letterSpacing: '.1em',
            textTransform: 'uppercase', color: C.faint,
          }}
        >
          Clear
        </HoverBtn>
      </div>

      <div
        style={
          narrow
            ? { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 24 }
            : undefined
        }
      >
      {app.filterGroups.map((g, i) => (
        <div
          key={g.label}
          style={
            narrow || i === app.filterGroups.length - 1
              ? undefined
              : { paddingBottom: 20, marginBottom: 20, borderBottom: `1px solid ${C.line2}` }
          }
        >
          <div
            style={{
              font: `600 11px/1 ${F.body}`, letterSpacing: '.1em',
              textTransform: 'uppercase', color: C.muted, marginBottom: 12,
            }}
          >
            {g.label}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {g.opts.map(o => (
              <HoverBtn
                key={o.label}
                onClick={o.pick}
                hover={o.on ? undefined : { borderColor: 'rgba(20,20,15,.4)', color: C.ink }}
                style={{
                  cursor: 'pointer', padding: '8px 13px', borderRadius: 999,
                  background: o.on ? C.ink : 'transparent',
                  border: o.on ? 'none' : '1px solid rgba(20,20,15,.14)',
                  color: o.on ? C.inkInv : C.muted,
                  font: `${o.on ? 600 : 500} 11px/1 ${F.body}`,
                }}
              >
                {o.label}
              </HoverBtn>
            ))}
          </div>
        </div>
      ))}
      </div>
    </aside>
  )
}

function DecisionChip({ executed }: { executed: boolean }) {
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        font: `600 12px/1.4 ${F.body}`, color: executed ? POS : NEG, whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: 5, height: 5, borderRadius: '50%', flex: 'none',
          background: executed ? C.green : NEG,
        }}
      />
      {executed ? 'Executed' : 'Rejected'}
    </span>
  )
}

function ListView({ app }: { app: App }) {
  return (
    <div
      style={{
        // Rows flow with the page: an inner scroller clipped the last row and
        // hid the footer, and a table nested in a scrolling page reads badly.
        background: C.surface, border: `1px solid ${C.line3}`, borderRadius: 16,
        overflowX: 'auto', boxShadow: shadowSm,
      }}
    >
      <div style={{ minWidth: 800 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: GRID, gap: 14, padding: '12px 22px 10px',
            background: '#f4f2ec', borderBottom: `1.5px solid ${C.line5}`,
            borderTopLeftRadius: 15, borderTopRightRadius: 15,
          }}
        >
          {app.cols.map(h => (
            <div
              key={h.label}
              style={{
                font: `700 9px/1.3 ${F.body}`, letterSpacing: '.14em',
                textTransform: 'uppercase', color: '#7f7b71',
                textAlign: h.num ? 'right' : 'left',
              }}
            >
              {h.label}
            </div>
          ))}
        </div>

        {app.rows.map(r => (
          <div
            key={r.ts}
            style={{
              borderBottom: `1px solid ${C.line2}`,
              background: r.bg,
              borderLeft: `2px solid ${r.accent}`,
            }}
          >
            <HoverDiv
              onClick={r.toggle}
              hover={{ background: '#f4f2ec' }}
              style={{
                display: 'grid', gridTemplateColumns: GRID, gap: 14,
                padding: '10px 22px 10px 20px', cursor: 'pointer', alignItems: 'center',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              <div style={{ font: `500 11.5px/1.4 ${F.mono}`, whiteSpace: 'nowrap' }}>
                <span style={{ color: C.faint }}>{r.tsDate}</span>{' '}
                <span style={{ color: C.soft }}>{r.tsTime}</span>
              </div>
              <div
                style={{
                  font: `600 12px/1.4 ${F.mono}`, letterSpacing: '-.01em', color: C.ink,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}
              >
                {r.sym}
              </div>
              <div style={{ font: `500 13px/1.4 ${F.body}`, color: C.ink }}>{r.signal}</div>
              <div>
                <DecisionChip executed={r.executed} />
              </div>
              <div style={{ font: `600 12.5px/1.4 ${F.mono}`, color: C.ink, textAlign: 'right' }}>
                {r.qty}
              </div>
              <div
                style={{
                  font: `500 11.5px/1.4 ${F.body}`, color: '#8b877c',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}
              >
                {r.tag}
              </div>
              <div
                style={{
                  font: `500 11.5px/1.4 ${F.mono}`,
                  color: r.hasOrder ? C.muted : '#c9c5ba',
                  whiteSpace: r.hasOrder ? 'nowrap' : undefined,
                }}
              >
                {r.order}
              </div>
            </HoverDiv>

            {r.open && (
              <div style={{ padding: '0 22px 16px' }}>
                <div
                  style={{
                    borderLeft: '2px solid rgba(20,20,15,.18)', padding: '4px 0 4px 18px',
                    animation: 'fadein .2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <span style={{ font: `500 11px/1 ${F.mono}`, color: C.faint }}>{r.ts}</span>
                    <span
                      style={{
                        font: `700 9px/1.4 ${F.body}`, letterSpacing: '.14em',
                        textTransform: 'uppercase', color: '#8b877c',
                      }}
                    >
                      Rationale
                    </span>
                  </div>
                  <div style={{ font: `500 14px/1.75 ${F.body}`, color: C.soft, maxWidth: 720 }}>
                    {r.rationale}
                  </div>
                  <div
                    style={{
                      marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 22,
                      paddingTop: 16, borderTop: '1px solid rgba(20,20,15,.08)',
                    }}
                  >
                    {r.meta.map(m => (
                      <div key={m.k}>
                        <div
                          style={{
                            font: `700 9px/1 ${F.body}`, letterSpacing: '.14em',
                            textTransform: 'uppercase', color: C.faint, marginBottom: 7,
                          }}
                        >
                          {m.k}
                        </div>
                        <div style={{ font: `600 13px/1 ${F.mono}`, color: C.ink }}>{m.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {app.noRows && (
          <div
            style={{
              padding: '46px 22px', textAlign: 'center',
              font: `500 14px/1.6 ${F.body}`, color: C.faint,
            }}
          >
            No records match these filters.
          </div>
        )}

        {app.hasRows && (
          <div
            style={{
              display: 'flex', flexWrap: 'wrap', alignItems: 'center',
              justifyContent: 'space-between', gap: 12, padding: '11px 22px',
              background: '#f4f2ec', borderTop: '1.5px solid rgba(20,20,15,.14)',
              borderBottomLeftRadius: 15, borderBottomRightRadius: 15,
              font: `600 9.5px/1.4 ${F.body}`, letterSpacing: '.13em',
              textTransform: 'uppercase', color: '#8b877c',
            }}
          >
            <span>End of records · {app.shownCount} shown</span>
            <span
              style={{
                font: `500 10px/1.4 ${F.mono}`, letterSpacing: 0, textTransform: 'none',
              }}
            >
              Append-only ledger · hash-chained
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

function GridView({ app }: { app: App }) {
  return (
    <>
      <div
        style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 14,
        }}
      >
        {app.rows.map(r => (
          <HoverDiv
            key={r.ts}
            onClick={r.toggle}
            hover={{ borderColor: 'rgba(20,20,15,.28)' }}
            style={{
              background: C.surface, border: '1px solid rgba(20,20,15,.08)', borderRadius: 20,
              padding: 22, cursor: 'pointer', boxShadow: shadowSm,
            }}
          >
            <div
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: 10, marginBottom: 16,
              }}
            >
              <span
                style={{
                  display: 'inline-flex', padding: '4px 10px', borderRadius: 8,
                  border: '1px solid rgba(20,20,15,.2)', font: `600 12px/1.3 ${F.mono}`,
                }}
              >
                {r.sym}
              </span>
              <span
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 11px',
                  borderRadius: 999,
                  background: r.executed ? '#eafbc9' : '#fdf1ed',
                  border: `1px solid ${r.executed ? '#bfe479' : '#e8c0b4'}`,
                  font: `700 9px/1.3 ${F.body}`, letterSpacing: '.11em',
                  textTransform: 'uppercase', color: r.executed ? C.greenInk : '#8d3120',
                }}
              >
                <span
                  style={{
                    width: 5, height: 5, borderRadius: '50%',
                    background: r.executed ? C.green : NEG,
                  }}
                />
                {r.executed ? 'Executed' : 'Rejected'}
              </span>
            </div>
            <div
              style={{
                font: `700 30px/1 ${F.display}`, letterSpacing: '-.035em',
                // A rejected record has no quantity; don't let the placeholder shout.
                color: r.executed ? C.ink : C.faint,
              }}
            >
              {r.qty}
            </div>
            <div
              style={{
                marginTop: 8, font: `600 10px/1 ${F.body}`, letterSpacing: '.13em',
                textTransform: 'uppercase', color: C.faint,
              }}
            >
              Quantity
            </div>
            <div style={{ marginTop: 18, font: `500 13px/1.55 ${F.body}`, color: C.soft }}>
              {r.signal}
            </div>
            <div
              style={{
                marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center',
              }}
            >
              <span style={{ font: `500 11px/1 ${F.mono}`, color: C.faint }}>{r.ts}</span>
              <span
                style={{
                  display: 'inline-flex', padding: '3px 9px', borderRadius: 7,
                  background: 'rgba(20,20,15,.055)', font: `600 10px/1.4 ${F.body}`,
                  color: C.muted,
                }}
              >
                {r.tag}
              </span>
            </div>
            {r.open && (
              <div
                style={{
                  marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(20,20,15,.08)',
                  font: `500 13px/1.7 ${F.body}`, color: C.muted, animation: 'fadein .2s ease',
                }}
              >
                {r.rationale}
              </div>
            )}
          </HoverDiv>
        ))}
      </div>
      {app.noRows && (
        <div
          style={{
            padding: '46px 22px', textAlign: 'center', font: `500 14px/1.6 ${F.body}`,
            color: C.faint, background: C.surface, border: '1px solid rgba(20,20,15,.08)',
            borderRadius: 22,
          }}
        >
          No records match these filters.
        </div>
      )}
    </>
  )
}

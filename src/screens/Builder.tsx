import { C, F, NEG, POS, shadowSm } from '../lib/theme'
import { HoverBtn, HoverDiv } from '../components/Hoverable'
import {
  Eyebrow, Label, LinkBtn, PrimaryBtn, Section, SelectField, Segmented,
  Sentence, StatTile, TextField, Toggle,
} from '../components/ui'
import type { App } from '../state/useApp'

export function Builder({ app }: { app: App }) {
  const S = app.state
  return (
    <div
      style={{
        maxWidth: 1180, margin: '0 auto', display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) 320px', gap: 26, alignItems: 'start',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22, minWidth: 0 }}>
        <Header app={app} />

        {S.stale && (
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '15px 20px',
              borderRadius: 16, background: '#fff6e0', border: '1px solid #edd49a',
              animation: 'fadein .3s ease',
            }}
          >
            <span
              style={{
                width: 9, height: 9, borderRadius: 2, background: '#c08a12',
                transform: 'rotate(45deg)',
              }}
            />
            <span style={{ font: `600 13px/1.4 ${F.body}`, color: '#6b4e07' }}>
              Strategy changed — backtest results may be outdated. Re-run the backtest before activating.
            </span>
          </div>
        )}

        <Conditions app={app} />
        <ActionStep app={app} />
        <ExitRules app={app} />
        <RiskCeiling app={app} />

        <Section style={{ boxShadow: undefined }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.lime }} />
            <Eyebrow>Plain-language preview · updates live</Eyebrow>
          </div>
          <Sentence parts={app.previewParts} fontSize="25px/1.75" />
        </Section>

        <Actions app={app} />
        {app.hasBT && <BacktestResults app={app} />}
      </div>

      <ComplianceRail app={app} />
    </div>
  )
}

function Header({ app }: { app: App }) {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', padding: '4px 2px 2px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' }}>
        <h1 style={{ margin: 0, font: `700 66px/.92 ${F.display}`, letterSpacing: '-.045em' }}>
          Strategy
          <br />
          Builder
        </h1>
        <div
          style={{
            paddingBottom: 10, display: 'flex', flexDirection: 'column',
            alignItems: 'flex-start', gap: 10,
          }}
        >
          {app.isDraft && (
            <StatusChip dot={C.faint} bg="rgba(20,20,15,.06)" border={C.line3} color={C.muted}>
              Draft
            </StatusChip>
          )}
          {app.isLive && (
            <StatusChip dot={C.green} bg="#eafbc9" border="#bfe479" color={C.greenInk}>
              Activated
            </StatusChip>
          )}
          <div style={{ font: `500 12px/1.5 ${F.body}`, color: '#8b877c', maxWidth: 240 }}>
            {app.stateNote}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 22, maxWidth: 420 }}>
        <Label>Strategy name</Label>
        <TextField
          value={app.strategyName}
          onChange={app.onStrategyName}
          placeholder={app.strategyNamePlaceholder}
        />
        <div style={{ marginTop: 8, font: `500 12px/1.5 ${F.body}`, color: '#8b877c' }}>
          {app.strategyName.trim()
            ? 'Used on the Live Monitor tab and anywhere this strategy is listed.'
            : `Leave blank and it will be called “${app.strategyNamePlaceholder}”.`}
        </div>
      </div>
    </div>
  )
}

function StatusChip({
  dot, bg, border, color, children,
}: {
  dot: string; bg: string; border: string; color: string; children: React.ReactNode
}) {
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 15px',
        borderRadius: 999, background: bg, border: `1px solid ${border}`,
        font: `700 10px/1 ${F.body}`, letterSpacing: '.13em', textTransform: 'uppercase', color,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot }} />
      {children}
    </span>
  )
}

function Conditions({ app }: { app: App }) {
  return (
    <Section>
      <div
        style={{
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
          gap: 14, marginBottom: 22,
        }}
      >
        <div>
          <Eyebrow style={{ marginBottom: 9 }}>Step 01</Eyebrow>
          <h2 style={{ margin: 0, font: `600 27px/1 ${F.display}`, letterSpacing: '-.03em' }}>
            When this happens
          </h2>
        </div>
        <div style={{ font: `500 12px/1 ${F.mono}`, color: C.faint }}>{app.condCount}/3</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {app.conds.map(c => (
          <div key={c.num} style={{ display: 'flex', flexDirection: 'column' }}>
            {c.hasJoin && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0 12px 8px' }}>
                <div style={{ width: 1, height: 20, background: 'rgba(20,20,15,.12)' }} />
                <div style={{ display: 'flex', gap: 3, padding: 3, borderRadius: 999, background: C.hover }}>
                  {c.joinOpts.map(j => (
                    <button
                      key={j.label}
                      type="button"
                      onClick={j.pick}
                      style={{
                        border: 'none', cursor: 'pointer', padding: '7px 15px', borderRadius: 999,
                        background: j.on ? C.ink : 'transparent',
                        color: j.on ? C.inkInv : '#8b877c',
                        font: `${j.on ? 700 : 600} 10px/1 ${F.body}`, letterSpacing: '.13em',
                      }}
                    >
                      {j.label}
                    </button>
                  ))}
                </div>
                <div style={{ flex: 1, height: 1, background: C.line2 }} />
              </div>
            )}

            <div
              style={{
                position: 'relative', border: `1px solid ${C.line3}`, borderRadius: 20,
                padding: 22, background: C.surfaceAlt,
              }}
            >
              <div
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: 18,
                }}
              >
                <span
                  style={{
                    display: 'inline-flex', alignItems: 'center', padding: '5px 11px',
                    borderRadius: 8, border: '1px solid rgba(20,20,15,.18)',
                    font: `600 10px/1 ${F.mono}`, letterSpacing: '.06em', color: C.muted,
                  }}
                >
                  CONDITION&nbsp;{c.num}
                </span>
                {c.removable && (
                  <HoverBtn
                    onClick={c.remove}
                    hover={{ color: '#c0392b' }}
                    style={{
                      border: 'none', background: 'transparent', cursor: 'pointer',
                      font: `600 11px/1 ${F.body}`, letterSpacing: '.08em',
                      textTransform: 'uppercase', color: C.faint,
                    }}
                  >
                    Remove
                  </HoverBtn>
                )}
              </div>

              {c.isCompare ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                  <div>
                    <Label>Metric</Label>
                    <SelectField
                      value={c.metric} onChange={c.onMetric}
                      disabled={c.locked} options={c.metricOpts}
                    />
                  </div>
                  <div
                    style={{
                      display: 'grid', gridTemplateColumns: '1fr auto 1fr',
                      gap: 12, alignItems: 'end',
                    }}
                  >
                    <div>
                      <Label>Stock A</Label>
                      <TextField
                        value={c.symbol} onChange={c.onSymbol} onFocus={c.focusSymbol}
                        disabled={c.locked} placeholder="Search symbol"
                      />
                    </div>
                    <div style={{ paddingBottom: 13, font: `600 12px/1 ${F.mono}`, color: '#8b877c' }}>
                      vs
                    </div>
                    <div>
                      <Label>Stock B</Label>
                      <TextField
                        value={c.symbol2} onChange={c.onSymbol2} onFocus={c.focusSymbol2}
                        disabled={c.locked} placeholder="Search symbol"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Relative move over</Label>
                    <SelectField value={c.cmp} onChange={c.onCmp} disabled={c.locked} options={app.cmps} />
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: 16 }}>
                  <div>
                    <Label>Metric</Label>
                    <SelectField
                      value={c.metric} onChange={c.onMetric}
                      disabled={c.locked} options={c.metricOpts}
                    />
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Label>Stock symbol</Label>
                    <TextField
                      value={c.symbol} onChange={c.onSymbol} onFocus={c.focusSymbol}
                      disabled={c.locked} placeholder="Search symbol"
                    />
                  </div>
                  <div>
                    <Label>Comparator</Label>
                    <SelectField value={c.cmp} onChange={c.onCmp} disabled={c.locked} options={app.cmps} />
                  </div>
                  <div>
                    <Label>{c.valueLabel}</Label>
                    <div
                      style={{
                        display: 'flex', alignItems: 'center',
                        border: '1px solid rgba(20,20,15,.14)', borderRadius: 14,
                        background: '#fff', overflow: 'hidden',
                      }}
                    >
                      <span
                        style={{
                          padding: '13px 0 13px 15px', font: `600 15px/1.2 ${F.mono}`,
                          color: '#8b877c',
                        }}
                      >
                        {c.valuePrefix}
                      </span>
                      <input
                        value={c.value}
                        onChange={e => c.onValue(e.target.value)}
                        disabled={c.locked}
                        style={{
                          flex: 1, minWidth: 0, padding: '13px 15px 13px 8px', border: 'none',
                          outline: 'none', background: 'transparent',
                          font: `600 15px/1.2 ${F.body}`, color: C.ink,
                        }}
                      />
                      <span
                        style={{
                          padding: '13px 15px 13px 0', font: `500 11px/1.2 ${F.body}`,
                          color: C.faint,
                        }}
                      >
                        {c.valueHint}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {c.showSuggest && (
                <div
                  style={{
                    marginTop: 14, border: `1px solid ${C.line3}`, borderRadius: 16,
                    background: '#fff', overflow: 'hidden',
                    boxShadow: '0 14px 34px -22px rgba(20,20,15,.45)',
                    animation: 'fadein .16s ease',
                  }}
                >
                  <div
                    style={{
                      padding: '10px 16px', font: `700 9px/1 ${F.body}`, letterSpacing: '.16em',
                      textTransform: 'uppercase', color: C.faint, background: C.surfaceAlt,
                    }}
                  >
                    Matching instruments · NSE
                  </div>
                  {c.suggestions.map(s => (
                    <HoverDiv
                      key={s.sym}
                      onClick={s.pick}
                      hover={{ background: '#f4f2ec' }}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        gap: 12, padding: '12px 16px', cursor: 'pointer',
                        borderTop: `1px solid ${C.line2}`,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span
                          style={{
                            display: 'inline-flex', padding: '4px 9px', borderRadius: 7,
                            border: '1px solid rgba(20,20,15,.2)', font: `600 11px/1 ${F.mono}`,
                          }}
                        >
                          {s.sym}
                        </span>
                        <span style={{ font: `500 13px/1 ${F.body}`, color: C.muted }}>{s.name}</span>
                      </div>
                      <span style={{ font: `500 12px/1 ${F.mono}`, color: C.faint }}>₹{s.ltp}</span>
                    </HoverDiv>
                  ))}
                  {c.noMatch && (
                    <div
                      style={{
                        padding: '14px 16px', font: `500 13px/1 ${F.body}`, color: C.faint,
                        borderTop: `1px solid ${C.line2}`,
                      }}
                    >
                      No instrument matches that search.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {app.canAddCond && (
        <HoverBtn
          onClick={app.addCond}
          hover={{ background: 'rgba(20,20,15,.04)', borderColor: 'rgba(20,20,15,.45)' }}
          style={{
            marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '13px 22px', borderRadius: 999,
            border: `1px dashed ${C.line5}`, background: 'transparent', cursor: 'pointer',
            font: `700 11px/1 ${F.body}`, letterSpacing: '.12em', textTransform: 'uppercase',
            color: C.ink,
          }}
        >
          <svg width="11" height="11" viewBox="0 0 11 11">
            <rect x="5" y="0" width="1.4" height="11" fill={C.ink} />
            <rect x="0" y="5" width="11" height="1.4" fill={C.ink} />
          </svg>
          Add another condition
        </HoverBtn>
      )}

      <TimeWindow app={app} />
    </Section>
  )
}

function TimeWindow({ app }: { app: App }) {
  const S = app.state
  return (
    <div style={{ marginTop: 22, paddingTop: 20, borderTop: '1px solid rgba(20,20,15,.08)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <div style={{ font: `600 14px/1.3 ${F.body}` }}>Only run during specific times</div>
          <div style={{ font: `500 12px/1.4 ${F.body}`, color: '#8b877c', marginTop: 4 }}>
            Outside this window the strategy stays dormant.
          </div>
        </div>
        <Toggle on={S.timeOn} onClick={app.toggleTime} />
      </div>

      {S.timeOn && (
        <div
          style={{
            marginTop: 18, display: 'flex', flexWrap: 'wrap', gap: 22,
            alignItems: 'flex-end', animation: 'fadein .2s ease',
          }}
        >
          <div>
            <Label>Start</Label>
            <TimeInput
              value={S.tStart} disabled={app.locked}
              onChange={v => app.touch({ tStart: v })}
            />
          </div>
          <div>
            <Label>End</Label>
            <TimeInput value={S.tEnd} disabled={app.locked} onChange={v => app.touch({ tEnd: v })} />
          </div>
          <div>
            <Label>Days</Label>
            <div style={{ display: 'flex', gap: 6 }}>
              {app.dayOpts.map(d => (
                <button
                  key={d.label}
                  type="button"
                  onClick={d.toggle}
                  style={{
                    cursor: 'pointer', padding: '10px 13px', borderRadius: 11,
                    background: d.on ? C.ink : '#fff',
                    border: d.on ? 'none' : '1px solid rgba(20,20,15,.14)',
                    color: d.on ? C.inkInv : C.faint,
                    font: `${d.on ? 700 : 600} 11px/1 ${F.body}`, letterSpacing: '.06em',
                  }}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function TimeInput({
  value, onChange, disabled,
}: {
  value: string; onChange: (v: string) => void; disabled?: boolean
}) {
  return (
    <input
      type="time"
      value={value}
      disabled={disabled}
      onChange={e => onChange(e.target.value)}
      style={{
        padding: '12px 14px', border: '1px solid rgba(20,20,15,.14)', borderRadius: 13,
        background: '#fff', font: `600 14px/1 ${F.mono}`,
      }}
    />
  )
}

function ActionStep({ app }: { app: App }) {
  const S = app.state
  return (
    <Section>
      <Eyebrow style={{ marginBottom: 9 }}>Step 02</Eyebrow>
      <h2 style={{ margin: '0 0 22px', font: `600 27px/1 ${F.display}`, letterSpacing: '-.03em' }}>
        Do this
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 16, alignItems: 'end' }}>
        <div>
          <Label>Order side</Label>
          <Segmented items={app.sideOpts} />
        </div>
        <div>
          <Label>Stock symbol · auto-filled from condition</Label>
          <TextField
            value={S.actionSymbol}
            onChange={v => app.touch({ actionSymbol: v })}
            disabled={app.locked}
          />
        </div>
      </div>

      <div style={{ marginTop: 22 }}>
        <Label>Position size</Label>
        <Segmented items={app.sizeOpts} pad="11px 22px" letterSpacing=".1em" upper />

        {app.isAuto && (
          <div
            style={{
              marginTop: 16, display: 'flex', gap: 14, padding: '18px 20px', borderRadius: 16,
              background: C.surfaceAlt, border: '1px solid rgba(20,20,15,.08)',
              animation: 'fadein .2s ease',
            }}
          >
            <div
              style={{
                flex: 'none', width: 8, height: 8, borderRadius: '50%',
                background: C.lime, marginTop: 6,
              }}
            />
            <div style={{ font: `500 13px/1.6 ${F.body}`, color: C.soft, maxWidth: 560 }}>
              Quantity is computed at signal time from the stock's 14-day realised volatility, then
              capped so a single trade can never risk more than your maximum. Quieter stocks get a
              larger quantity; volatile stocks get a smaller one.
            </div>
          </div>
        )}
        {app.isFixed && (
          <div style={{ marginTop: 16, animation: 'fadein .2s ease' }}>
            <Label>Quantity (shares)</Label>
            <TextField
              value={S.qty}
              onChange={v => app.touch({ qty: v })}
              disabled={app.locked}
              style={{ width: 180, font: `600 15px/1.2 ${F.mono}` }}
            />
          </div>
        )}
      </div>
    </Section>
  )
}

function ExitRules({ app }: { app: App }) {
  const S = app.state
  return (
    <Section style={{ padding: '24px 28px', boxShadow: shadowSm }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Eyebrow>Step 03 · optional</Eyebrow>
          <h2 style={{ margin: 0, font: `600 20px/1 ${F.display}`, letterSpacing: '-.02em' }}>
            Exit rules
          </h2>
        </div>
        <HoverBtn
          onClick={app.toggleExit}
          hover={{ background: C.hover }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 9, padding: '11px 18px',
            borderRadius: 999, border: '1px solid rgba(20,20,15,.14)', background: 'transparent',
            cursor: 'pointer', font: `700 10px/1 ${F.body}`, letterSpacing: '.12em',
            textTransform: 'uppercase', color: C.ink,
          }}
        >
          {app.exitBtnLabel}
        </HoverBtn>
      </div>

      {S.exitOpen && (
        <div
          style={{
            marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
            animation: 'fadein .2s ease',
          }}
        >
          {app.exitRows.map(e => (
            <div
              key={e.label}
              style={{
                border: `1px solid ${C.line3}`, borderRadius: 18, padding: 18,
                background: C.surfaceAlt,
              }}
            >
              <div
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                }}
              >
                <div style={{ font: `600 14px/1.2 ${F.body}` }}>{e.label}</div>
                <Toggle on={e.on} onClick={e.toggle} size="sm" />
              </div>
              {e.on ? (
                <div
                  style={{
                    marginTop: 14, display: 'flex', alignItems: 'center',
                    border: '1px solid rgba(20,20,15,.14)', borderRadius: 13, background: '#fff',
                    overflow: 'hidden', width: 150,
                  }}
                >
                  <input
                    value={e.value}
                    onChange={ev => e.onChange(ev.target.value)}
                    disabled={app.locked}
                    style={{
                      flex: 1, minWidth: 0, padding: '12px 6px 12px 14px', border: 'none',
                      outline: 'none', background: 'transparent', font: `600 15px/1 ${F.mono}`,
                    }}
                  />
                  <span
                    style={{ padding: '12px 14px 12px 0', font: `600 13px/1 ${F.body}`, color: '#8b877c' }}
                  >
                    %
                  </span>
                </div>
              ) : (
                <div style={{ marginTop: 14, font: `500 12px/1.5 ${F.body}`, color: C.faint }}>
                  {e.offNote}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Section>
  )
}

function RiskCeiling({ app }: { app: App }) {
  return (
    <section
      style={{
        position: 'relative', overflow: 'hidden', background: C.ink, color: C.inkInv,
        borderRadius: 28, padding: '34px 34px 30px',
        boxShadow: '0 30px 70px -40px rgba(20,20,15,.85)',
      }}
    >
      {app.ghost && (
        <div
          style={{
            position: 'absolute', right: -14, top: -44, font: `800 230px/1 ${F.display}`,
            letterSpacing: '-.06em', color: 'rgba(253,252,249,.055)',
            pointerEvents: 'none', userSelect: 'none',
          }}
        >
          ₹
        </div>
      )}
      <div
        style={{
          position: 'relative', display: 'flex', flexWrap: 'wrap', gap: 34,
          justifyContent: 'space-between', alignItems: 'flex-end',
        }}
      >
        <div style={{ minWidth: 280 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.lime }} />
            <span
              style={{
                font: `700 10px/1 ${F.body}`, letterSpacing: '.18em', textTransform: 'uppercase',
                color: 'rgba(253,252,249,.6)',
              }}
            >
              Hard ceiling · cannot be bypassed
            </span>
          </div>
          <div
            style={{
              font: `700 11px/1 ${F.body}`, letterSpacing: '.16em', textTransform: 'uppercase',
              color: 'rgba(253,252,249,.5)', marginBottom: 14,
            }}
          >
            Maximum risk per trade
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ font: `600 46px/1 ${F.display}`, color: 'rgba(253,252,249,.45)' }}>₹</span>
            <input
              value={app.riskText}
              onChange={e => app.onRisk(e.target.value)}
              disabled={app.locked}
              style={{
                width: 260, background: 'transparent', border: 'none', outline: 'none',
                borderBottom: '2px solid rgba(253,252,249,.25)', color: C.inkInv,
                font: `700 86px/1 ${F.display}`, letterSpacing: '-.05em', padding: '0 0 6px',
              }}
            />
          </div>
          <div
            style={{
              marginTop: 18, font: `500 13px/1.6 ${F.body}`,
              color: 'rgba(253,252,249,.62)', maxWidth: 420,
            }}
          >
            Every order is pre-checked against this number. If a computed position would exceed it,
            the signal is rejected and logged — not resized silently, not queued for later.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div
            style={{
              font: `700 10px/1 ${F.body}`, letterSpacing: '.16em', textTransform: 'uppercase',
              color: 'rgba(253,252,249,.45)',
            }}
          >
            Quick select
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, maxWidth: 300 }}>
            {app.riskPresets.map(p => (
              <button
                key={p.label}
                type="button"
                onClick={p.pick}
                style={{
                  cursor: 'pointer', padding: '11px 17px', borderRadius: 999,
                  background: p.on ? C.lime : 'transparent',
                  border: p.on ? 'none' : '1px solid rgba(253,252,249,.24)',
                  color: p.on ? C.ink : 'rgba(253,252,249,.8)',
                  font: `${p.on ? 700 : 600} 12px/1 ${F.mono}`,
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div
            style={{
              marginTop: 6, padding: '14px 16px', borderRadius: 14,
              background: 'rgba(253,252,249,.07)', font: `500 12px/1.5 ${F.body}`,
              color: 'rgba(253,252,249,.7)', maxWidth: 300,
            }}
          >
            At {app.riskText} per trade, a full stop-out costs roughly {app.riskPctNote} of a
            ₹5,00,000 account.
          </div>
        </div>
      </div>
    </section>
  )
}

function Actions({ app }: { app: App }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14 }}>
      {app.isDraft && (
        <PrimaryBtn onClick={app.runBacktest}>
          <svg width="13" height="13" viewBox="0 0 13 13">
            <circle cx="6.5" cy="6.5" r="6" fill="none" stroke={C.lime} strokeWidth="1.4" />
            <circle cx="6.5" cy="6.5" r="2" fill={C.lime} />
          </svg>
          Run Backtest
        </PrimaryBtn>
      )}
      {app.canActivate && (
        <HoverBtn
          onClick={app.activate}
          hover={{ background: '#fff', borderColor: 'rgba(20,20,15,.4)' }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 12, padding: '19px 32px',
            borderRadius: 999, border: `1px solid ${C.line4}`, background: C.surface,
            color: C.ink, cursor: 'pointer', font: `700 12px/1 ${F.body}`,
            letterSpacing: '.14em', textTransform: 'uppercase', animation: 'fadein .3s ease',
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.green }} />
          Activate Strategy
        </HoverBtn>
      )}
      {app.isLive && (
        <>
          <PrimaryBtn onClick={app.edit}>Edit Strategy</PrimaryBtn>
          <LinkBtn onClick={app.openBuilderInMonitor}>Open Live Monitor →</LinkBtn>
        </>
      )}
    </div>
  )
}

function BacktestResults({ app }: { app: App }) {
  return (
    <Section style={{ animation: 'fadein .35s ease' }}>
      <div
        style={{
          display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end',
          justifyContent: 'space-between', gap: 18, marginBottom: 24,
        }}
      >
        <div>
          <Eyebrow style={{ marginBottom: 9 }}>Simulated</Eyebrow>
          <h2 style={{ margin: 0, font: `600 34px/1 ${F.display}`, letterSpacing: '-.035em' }}>
            Backtest results
          </h2>
        </div>
        <div style={{ display: 'flex', gap: 4, padding: 4, borderRadius: 999, background: C.hover }}>
          {app.rangeOpts.map(r => (
            <button
              key={r.label}
              type="button"
              onClick={r.pick}
              style={{
                border: 'none', cursor: 'pointer', padding: '10px 16px', borderRadius: 999,
                background: r.on ? C.ink : 'transparent',
                color: r.on ? C.inkInv : '#8b877c',
                font: `${r.on ? 700 : 600} 11px/1 ${F.body}`,
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(148px,1fr))', gap: 12,
        }}
      >
        {app.btStats.map(s => (
          <StatTile
            key={s.label}
            value={s.value}
            label={s.label}
            color={s.pos ? POS : s.neg ? NEG : C.ink}
            ghost={s.ghost}
            ghostChar={s.ghostChar}
          />
        ))}
      </div>

      <div
        style={{
          marginTop: 22, border: `1px solid ${C.line}`, borderRadius: 20, padding: 22,
          background: C.surfaceAlt,
        }}
      >
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 14, marginBottom: 14,
          }}
        >
          <div style={{ font: `600 13px/1 ${F.body}`, letterSpacing: '.04em', color: C.soft }}>
            Simulated equity curve
          </div>
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              font: `500 11px/1 ${F.body}`, color: '#8b877c',
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: NEG }} />
            Largest losing trade
          </div>
        </div>
        <div style={{ width: '100%', overflow: 'hidden' }}>
          <svg viewBox="0 0 640 190" width="100%" height="190" preserveAspectRatio="none">
            <line x1="0" y1="95" x2="640" y2="95" stroke="rgba(20,20,15,.08)" strokeWidth="1" />
            <line x1="0" y1="189" x2="640" y2="189" stroke="rgba(20,20,15,.12)" strokeWidth="1" />
            <polyline points={app.btArea} fill="rgba(20,20,15,.05)" stroke="none" />
            <polyline
              points={app.btCurve} fill="none" stroke={C.ink}
              strokeWidth="2.2" strokeLinejoin="round"
            />
            <circle cx={app.btLossX} cy={app.btLossY} r="6" fill={NEG} />
            <circle
              cx={app.btLossX} cy={app.btLossY} r="11" fill="none"
              stroke={NEG} strokeWidth="1" opacity=".4"
            />
          </svg>
        </div>
      </div>

      <div style={{ marginTop: 22 }}>
        <Eyebrow style={{ marginBottom: 12 }}>Recent simulated trades</Eyebrow>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {app.btTrades.map((t, i) => (
            <div
              key={i}
              style={{
                display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8,
                padding: '14px 4px', borderBottom: `1px solid ${C.line2}`,
                font: `400 14px/1.6 ${F.body}`, color: C.soft,
              }}
            >
              <span style={{ font: `500 12px/1 ${F.mono}`, color: C.faint, minWidth: 78 }}>
                {t.date}
              </span>
              <span>{t.pre}</span>
              <span
                style={{
                  display: 'inline-flex', padding: '2px 9px',
                  border: '1px solid rgba(20,20,15,.22)', borderRadius: 8,
                  font: `600 12px/1.5 ${F.mono}`,
                }}
              >
                {t.sym}
              </span>
              <span>{t.mid}</span>
              <span style={{ font: `700 14px/1.6 ${F.body}`, color: t.win ? POS : NEG }}>
                {t.pnl}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          marginTop: 22, display: 'flex', gap: 13, padding: '18px 20px', borderRadius: 16,
          border: '1px solid rgba(20,20,15,.12)', background: 'transparent',
        }}
      >
        <div
          style={{
            flex: 'none', width: 18, height: 18, borderRadius: '50%',
            border: '1.4px solid #8b877c', display: 'flex', alignItems: 'center',
            justifyContent: 'center', font: `700 11px/1 ${F.display}`, color: '#8b877c',
            marginTop: 1,
          }}
        >
          i
        </div>
        <div style={{ font: `500 12.5px/1.65 ${F.body}`, color: C.muted, maxWidth: 660 }}>
          These results are simulated on historical data with modelled slippage and brokerage. They
          are not a record of real trades and do not guarantee or indicate future performance. Live
          results will differ.
        </div>
      </div>
    </Section>
  )
}

function ComplianceRail({ app }: { app: App }) {
  return (
    <aside
      style={{
        display: 'flex', flexDirection: 'column', gap: 18, position: 'sticky', top: 22,
      }}
    >
      <div
        style={{
          background: C.surface, border: '1px solid rgba(20,20,15,.08)', borderRadius: 22,
          padding: 24, boxShadow: shadowSm,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 6 }}>
          <svg width="11" height="13" viewBox="0 0 11 13">
            <rect x="1" y="5" width="9" height="7.2" rx="1.6" fill="none" stroke="#8b877c" strokeWidth="1.3" />
            <path d="M3.2 5V3.4a2.3 2.3 0 0 1 4.6 0V5" fill="none" stroke="#8b877c" strokeWidth="1.3" />
          </svg>
          <Eyebrow>Compliance · read only</Eyebrow>
        </div>
        <div style={{ font: `500 12px/1.55 ${F.body}`, color: '#8b877c', marginBottom: 18 }}>
          Managed by your broker. Not editable here.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {app.compliance.map(k => (
            <div key={k.label} style={{ padding: '14px 0', borderTop: `1px solid ${C.line2}` }}>
              <div
                style={{
                  font: `600 11px/1 ${F.body}`, letterSpacing: '.09em',
                  textTransform: 'uppercase', color: C.faint, marginBottom: 9,
                }}
              >
                {k.label}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <span
                  style={{
                    width: 7, height: 7, borderRadius: '50%', flex: 'none',
                    background: k.ok ? C.green : '#c9c5ba',
                  }}
                />
                <span
                  style={{
                    font: `600 14px/1.3 ${F.mono}`, color: C.ink, overflowWrap: 'anywhere',
                  }}
                >
                  {k.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          position: 'relative', overflow: 'hidden', border: `1px solid ${C.line3}`,
          borderRadius: 22, padding: 24, background: 'transparent',
        }}
      >
        <div style={{ font: `700 44px/1 ${F.display}`, letterSpacing: '-.04em' }}>100%</div>
        <div style={{ marginTop: 10, font: `500 12.5px/1.6 ${F.body}`, color: C.muted }}>
          of signals — executed or rejected — are written to the permanent audit log before any
          order leaves this device.
        </div>
        <button
          type="button"
          onClick={app.goAudit}
          style={{
            marginTop: 16, border: 'none', background: 'transparent', cursor: 'pointer',
            padding: '0 0 4px', font: `700 10px/1 ${F.body}`, letterSpacing: '.13em',
            textTransform: 'uppercase', color: C.ink, borderBottom: `1px solid ${C.line5}`,
          }}
        >
          View audit log
        </button>
      </div>
    </aside>
  )
}

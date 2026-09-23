import type { CSSProperties } from 'react'
import { C, F, shadowSm } from '../lib/theme'
import { HoverBtn, HoverDiv } from '../components/Hoverable'
import { Eyebrow, Label } from '../components/ui'
import type { App } from '../state/useApp'

const oauthInput: CSSProperties = {
  width: '100%',
  padding: '14px 16px',
  border: '1px solid rgba(20,20,15,.18)',
  borderRadius: 10,
  background: '#fff',
  font: `500 15px/1.2 ${F.body}`,
  color: C.ink,
}

function LockIcon() {
  return (
    <svg width="11" height="13" viewBox="0 0 11 13">
      <rect x="1" y="5" width="9" height="7.2" rx="1.6" fill="none" stroke="#8b877c" strokeWidth="1.3" />
      <path d="M3.2 5V3.4a2.3 2.3 0 0 1 4.6 0V5" fill="none" stroke="#8b877c" strokeWidth="1.3" />
    </svg>
  )
}

function ConnSummary({ app, fontSize }: { app: App; fontSize: string }) {
  return (
    <div
      style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 22,
      }}
    >
      {app.connSummary.map(k => (
        <div key={k.label}>
          <div
            style={{
              font: `600 10px/1 ${F.body}`, letterSpacing: '.13em',
              textTransform: 'uppercase', color: C.faint, marginBottom: 9,
            }}
          >
            {k.label}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{ width: 6, height: 6, borderRadius: '50%', background: C.green, flex: 'none' }}
            />
            <span style={{ font: `600 ${fontSize} ${F.mono}`, overflowWrap: 'anywhere' }}>
              {k.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export function BrokerSelect({ app }: { app: App }) {
  return (
    <div style={{ maxWidth: 940, margin: '0 auto', padding: '30px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 34 }}>
        <div
          style={{
            width: 30, height: 30, borderRadius: 9, background: C.ink,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div style={{ width: 9, height: 9, borderRadius: '50%', background: C.lime }} />
        </div>
        <div style={{ font: `700 15px/1 ${F.display}`, letterSpacing: '-.02em' }}>NoCodeTrader</div>
        <span
          style={{
            marginLeft: 6, display: 'inline-flex', padding: '6px 12px', borderRadius: 999,
            border: `1px solid ${C.line4}`, font: `700 9px/1 ${F.body}`, letterSpacing: '.14em',
            textTransform: 'uppercase', color: C.muted,
          }}
        >
          Step 2 of 2 · required
        </span>
      </div>

      <div
        style={{
          background: C.surface, border: '1px solid rgba(20,20,15,.08)', borderRadius: 28,
          padding: 40,
          boxShadow: '0 1px 2px rgba(20,20,15,.04),0 30px 60px -46px rgba(20,20,15,.45)',
        }}
      >
        <h1 style={{ margin: 0, font: `700 52px/1 ${F.display}`, letterSpacing: '-.045em' }}>
          Connect your
          <br />
          broker
        </h1>
        <p
          style={{
            margin: '18px 0 32px', maxWidth: 560, font: `500 14px/1.7 ${F.body}`, color: C.muted,
          }}
        >
          Orders are placed through your own broker account — we never hold your funds. You'll
          authenticate on your broker's site, and the session ends automatically at the close of
          each trading day.
        </p>

        <div
          style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14,
          }}
        >
          {app.brokers.map(b => (
            <HoverDiv
              key={b.name}
              onClick={b.pick}
              hover={b.on ? undefined : { borderColor: 'rgba(20,20,15,.4)', background: C.surfaceAlt }}
              style={{
                border: b.on ? `2px solid ${C.ink}` : '1px solid rgba(20,20,15,.12)',
                borderRadius: 22, padding: '28px 24px',
                background: b.on ? C.surfaceAlt : 'transparent',
                cursor: 'pointer', position: 'relative',
              }}
            >
              {b.on && (
                <span
                  style={{
                    position: 'absolute', top: 18, right: 18, width: 18, height: 18,
                    borderRadius: 999, background: C.ink, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.lime }} />
                </span>
              )}
              <div
                style={{
                  font: `700 30px/1 ${F.display}`, letterSpacing: '-.04em',
                  color: b.on ? C.ink : C.faint,
                }}
              >
                {b.mark}
              </div>
              <div style={{ marginTop: 14, font: `600 15px/1.2 ${F.body}` }}>{b.name}</div>
              <div style={{ marginTop: 7, font: `500 12px/1.5 ${F.body}`, color: '#8b877c' }}>
                {b.note}
              </div>
            </HoverDiv>
          ))}
        </div>

        {app.brokerChosen && (
          <div
            style={{
              marginTop: 28, display: 'flex', flexWrap: 'wrap', alignItems: 'center',
              gap: 16, animation: 'fadein .2s ease',
            }}
          >
            <HoverBtn
              onClick={app.startOauth}
              hover={{ background: '#2c2c22' }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 12, padding: '19px 32px',
                borderRadius: 999, border: 'none', background: C.ink, color: C.inkInv,
                cursor: 'pointer', font: `700 12px/1 ${F.body}`, letterSpacing: '.14em',
                textTransform: 'uppercase',
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.lime }} />
              Connect with {app.brokerPick}
            </HoverBtn>
            <span
              style={{ font: `500 12px/1.6 ${F.body}`, color: '#8b877c', maxWidth: 300 }}
            >
              You'll be handed to {app.brokerPick}'s own login page.
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export function BrokerOauth({ app }: { app: App }) {
  const S = app.state
  return (
    <div style={{ maxWidth: 840, margin: '0 auto', padding: '30px 0' }}>
      <div
        style={{
          textAlign: 'center', font: `600 11px/1 ${F.body}`, letterSpacing: '.14em',
          textTransform: 'uppercase', color: C.faint, marginBottom: 18,
        }}
      >
        You are on your broker's site
      </div>

      <div
        style={{
          border: `1px solid ${C.line4}`, borderRadius: 16, overflow: 'hidden',
          background: '#e7e4dd', boxShadow: '0 30px 60px -40px rgba(20,20,15,.5)',
        }}
      >
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
            background: '#dedad1', borderBottom: '1px solid rgba(20,20,15,.12)',
          }}
        >
          <div style={{ display: 'flex', gap: 6 }}>
            {[0, 1, 2].map(i => (
              <span
                key={i}
                style={{ width: 11, height: 11, borderRadius: '50%', background: '#c4bfb4' }}
              />
            ))}
          </div>
          <div
            style={{
              flex: 1, display: 'flex', alignItems: 'center', gap: 9, padding: '8px 14px',
              borderRadius: 999, background: '#f4f2ec', border: '1px solid rgba(20,20,15,.08)',
            }}
          >
            <svg width="10" height="12" viewBox="0 0 10 12">
              <rect x="0.7" y="4.6" width="8.6" height="6.7" rx="1.5" fill="none" stroke={C.muted} strokeWidth="1.2" />
              <path d="M2.8 4.6V3.1a2.2 2.2 0 0 1 4.4 0v1.5" fill="none" stroke={C.muted} strokeWidth="1.2" />
            </svg>
            <span style={{ font: `500 11.5px/1 ${F.mono}`, color: C.muted }}>{app.oauthUrl}</span>
          </div>
        </div>

        <div style={{ padding: '46px 40px', background: '#fbfaf7' }}>
          <div style={{ maxWidth: 420, margin: '0 auto' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ font: `700 34px/1 ${F.display}`, letterSpacing: '-.04em' }}>
                {app.brokerPick}
              </div>
              <div
                style={{
                  marginTop: 12, font: `600 10px/1 ${F.body}`, letterSpacing: '.16em',
                  textTransform: 'uppercase', color: C.faint,
                }}
              >
                Authorise NoCodeTrader
              </div>
            </div>

            <div style={{ marginTop: 30, display: 'flex', flexDirection: 'column', gap: 15 }}>
              <div>
                <Label>Client ID</Label>
                <input
                  value={S.oClient}
                  onChange={e => app.set({ oClient: e.target.value })}
                  placeholder="AB1234"
                  style={{ ...oauthInput, font: `500 15px/1.2 ${F.mono}` }}
                />
              </div>
              <div>
                <Label>Password</Label>
                <input
                  type="password"
                  value={S.oPw}
                  onChange={e => app.set({ oPw: e.target.value })}
                  placeholder="••••••••"
                  style={oauthInput}
                />
              </div>
              <div>
                <Label>TOTP / 2FA code</Label>
                <input
                  value={S.oTotp}
                  onChange={e => app.set({ oTotp: e.target.value })}
                  placeholder="6-digit code"
                  style={{
                    ...oauthInput, width: 160, font: `500 16px/1.2 ${F.mono}`,
                    letterSpacing: '.22em',
                  }}
                />
              </div>
            </div>

            <div
              style={{
                marginTop: 22, padding: 16, borderRadius: 12, background: '#f2f0ea',
                border: '1px solid rgba(20,20,15,.08)', font: `500 11.5px/1.65 ${F.body}`,
                color: C.muted,
              }}
            >
              NoCodeTrader is requesting permission to place and cancel orders on your behalf, and
              to read your positions and order history. It cannot withdraw funds or change your
              bank details.
            </div>

            <button
              type="button"
              onClick={app.finishOauth}
              style={{
                marginTop: 22, width: '100%', padding: '17px 30px', borderRadius: 10,
                border: 'none', background: C.ink, color: C.inkInv, cursor: 'pointer',
                font: `700 12px/1 ${F.body}`, letterSpacing: '.12em', textTransform: 'uppercase',
              }}
            >
              Authorise &amp; continue
            </button>
            <div
              style={{
                marginTop: 16, textAlign: 'center', font: `500 11px/1.6 ${F.body}`,
                color: C.faint,
              }}
            >
              Simulated broker page for this prototype. No real credentials are sent anywhere.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function BrokerDone({ app }: { app: App }) {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 0' }}>
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: 84, height: 84, margin: '0 auto', borderRadius: 999, background: '#eafbc9',
            border: '1px solid #bfe479', display: 'flex', alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="34" height="26" viewBox="0 0 34 26">
            <polyline
              points="3,13 13,23 31,3" fill="none" stroke="#3d6b12" strokeWidth="3.4"
              strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 style={{ margin: '28px 0 0', font: `700 58px/1 ${F.display}`, letterSpacing: '-.045em' }}>
          Broker
          <br />
          connected
        </h1>
        <p
          style={{
            margin: '18px auto 0', maxWidth: 440, font: `500 14px/1.7 ${F.body}`, color: C.muted,
          }}
        >
          {app.brokerPick} is linked and the compliance checks below are now live on every order
          this platform sends.
        </p>
      </div>

      <div
        style={{
          marginTop: 34, background: C.surface, border: '1px solid rgba(20,20,15,.08)',
          borderRadius: 24, padding: 28, boxShadow: shadowSm,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 20 }}>
          <LockIcon />
          <Eyebrow>Compliance · read only</Eyebrow>
        </div>
        <ConnSummary app={app} fontSize="13px/1.4" />
      </div>

      <div style={{ marginTop: 26, display: 'flex', justifyContent: 'center' }}>
        <HoverBtn
          onClick={app.enterApp}
          hover={{ background: '#2c2c22' }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 12, padding: '19px 34px',
            borderRadius: 999, border: 'none', background: C.ink, color: C.inkInv,
            cursor: 'pointer', font: `700 12px/1 ${F.body}`, letterSpacing: '.14em',
            textTransform: 'uppercase',
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.lime }} />
          Continue to dashboard
        </HoverBtn>
      </div>
    </div>
  )
}

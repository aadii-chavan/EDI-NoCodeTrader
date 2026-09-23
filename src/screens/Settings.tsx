import type { CSSProperties, ReactNode } from 'react'
import { C, F, shadowSm } from '../lib/theme'
import { HoverBtn } from '../components/Hoverable'
import { Eyebrow, Toggle } from '../components/ui'
import type { App } from '../state/useApp'

const panel: CSSProperties = {
  background: C.surface,
  border: '1px solid rgba(20,20,15,.08)',
  borderRadius: 24,
  padding: 28,
  boxShadow: shadowSm,
}

const ghostBtn: CSSProperties = {
  padding: '13px 22px',
  borderRadius: 999,
  border: `1px solid ${C.line4}`,
  background: 'transparent',
  cursor: 'pointer',
  font: `700 10px/1 ${F.body}`,
  letterSpacing: '.13em',
  textTransform: 'uppercase',
  color: C.ink,
}

export function Settings({ app }: { app: App }) {
  const S = app.state
  return (
    <div
      style={{
        maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 22,
      }}
    >
      <h1 style={{ margin: '0 0 4px', font: `700 62px/.96 ${F.display}`, letterSpacing: '-.045em' }}>
        Account
        <br />
        &amp; Settings
      </h1>

      <section style={panel}>
        <Eyebrow style={{ marginBottom: 20 }}>Profile</Eyebrow>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 72, height: 72, borderRadius: 999, background: C.ink, color: C.inkInv,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              font: `700 22px/1 ${F.display}`, letterSpacing: '.02em',
            }}
          >
            {app.initials}
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ font: `600 22px/1.2 ${F.display}`, letterSpacing: '-.02em' }}>
              {S.profileName}
            </div>
            <div style={{ marginTop: 7, font: `500 13px/1 ${F.mono}`, color: '#8b877c' }}>
              {S.profileEmail}
            </div>
          </div>
          <HoverBtn
            onClick={() => {}}
            hover={{ background: C.hover }}
            style={{ ...ghostBtn, padding: '14px 24px' }}
          >
            Edit profile
          </HoverBtn>
        </div>
      </section>

      <BrokerConnection app={app} />
      <SecurityPanel />
      <NotificationPrefs app={app} />
      <DangerZone app={app} />
    </div>
  )
}

function BrokerConnection({ app }: { app: App }) {
  const S = app.state
  return (
    <section style={panel}>
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 14, marginBottom: 20,
        }}
      >
        <Eyebrow>Broker connection</Eyebrow>
        <button
          type="button"
          onClick={app.goBrokerFlow}
          style={{
            border: 'none', background: 'transparent', cursor: 'pointer', padding: '0 0 4px',
            font: `700 10px/1 ${F.body}`, letterSpacing: '.12em', textTransform: 'uppercase',
            color: C.ink, borderBottom: `1px solid ${C.line5}`,
          }}
        >
          Connect another broker
        </button>
      </div>

      <div
        style={{
          border: `1px solid ${C.line3}`, borderRadius: 20, padding: 24, background: C.surfaceAlt,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <span
            style={{
              display: 'inline-flex', padding: '6px 13px', borderRadius: 9, background: C.ink,
              color: C.inkInv, font: `700 12px/1.3 ${F.display}`, letterSpacing: '.04em',
            }}
          >
            {S.brokerName}
          </span>
          <span
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7, font: `700 10px/1 ${F.body}`,
              letterSpacing: '.12em', textTransform: 'uppercase',
              color: app.brokerOk ? C.greenInk : C.amberInk,
            }}
          >
            <span
              style={{
                width: 6, height: 6, borderRadius: '50%',
                background: app.brokerOk ? C.green : C.amber,
              }}
            />
            {app.brokerOk ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        <div
          style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: 20,
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
                  style={{
                    width: 6, height: 6, borderRadius: '50%', background: C.green, flex: 'none',
                  }}
                />
                <span style={{ font: `600 12.5px/1.4 ${F.mono}`, overflowWrap: 'anywhere' }}>
                  {k.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {app.disconnectIdle && (
        <HoverBtn
          onClick={app.askDisconnect}
          hover={{ borderColor: '#c78d80', color: '#8d3120' }}
          style={{ ...ghostBtn, marginTop: 18, color: C.muted }}
        >
          Disconnect broker
        </HoverBtn>
      )}
      {app.disconnectAsking && (
        <div
          style={{
            marginTop: 18, padding: 20, borderRadius: 18, border: '1px solid #e3c8c0',
            background: '#fdf6f3', animation: 'fadein .2s ease',
          }}
        >
          <div style={{ font: `600 14px/1.5 ${F.body}`, color: '#7d2a19' }}>
            Disconnect {S.brokerName}?
          </div>
          <div
            style={{
              marginTop: 6, font: `500 12.5px/1.6 ${F.body}`, color: '#9c6a5c', maxWidth: 520,
            }}
          >
            All active strategies stop immediately and no orders can be placed until a broker is
            reconnected. Your audit log is unaffected — it can never be deleted.
          </div>
          <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <button
              type="button"
              onClick={app.confirmDisconnect}
              style={{
                padding: '13px 22px', borderRadius: 999, border: 'none', background: '#8d3120',
                color: '#fff', cursor: 'pointer', font: `700 10px/1 ${F.body}`,
                letterSpacing: '.13em', textTransform: 'uppercase',
              }}
            >
              Yes, disconnect
            </button>
            <button type="button" onClick={app.cancelDisconnect} style={ghostBtn}>
              Keep connected
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

function Row({
  children, style,
}: {
  children: ReactNode; style?: CSSProperties
}) {
  return (
    <div
      style={{
        display: 'flex', flexWrap: 'wrap', alignItems: 'center',
        justifyContent: 'space-between', gap: 16, ...style,
      }}
    >
      {children}
    </div>
  )
}

function LockIcon({ stroke = C.muted }: { stroke?: string }) {
  return (
    <svg width="11" height="13" viewBox="0 0 11 13">
      <rect x="1" y="5" width="9" height="7.2" rx="1.6" fill="none" stroke={stroke} strokeWidth="1.3" />
      <path d="M3.2 5V3.4a2.3 2.3 0 0 1 4.6 0V5" fill="none" stroke={stroke} strokeWidth="1.3" />
    </svg>
  )
}

function SecurityPanel() {
  return (
    <section style={panel}>
      <Eyebrow style={{ marginBottom: 20 }}>Security</Eyebrow>
      <Row style={{ paddingBottom: 20, borderBottom: `1px solid ${C.line2}` }}>
        <div>
          <div style={{ font: `600 14px/1.3 ${F.body}` }}>Password</div>
          <div style={{ marginTop: 5, font: `500 12px/1.5 ${F.body}`, color: '#8b877c' }}>
            Last changed 4 months ago.
          </div>
        </div>
        <HoverBtn onClick={() => {}} hover={{ background: C.hover }} style={ghostBtn}>
          Change password
        </HoverBtn>
      </Row>
      <Row style={{ paddingTop: 20 }}>
        <div style={{ maxWidth: 470 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <LockIcon />
            <div style={{ font: `600 14px/1.3 ${F.body}` }}>Two-factor authentication</div>
          </div>
          <div style={{ marginTop: 6, font: `500 12px/1.6 ${F.body}`, color: '#8b877c' }}>
            Mandatory on this platform. Algo execution requires a fresh 2FA session each trading
            day, so this cannot be switched off.
          </div>
        </div>
        <span
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 9, padding: '11px 18px',
            borderRadius: 999, background: '#eafbc9', border: '1px solid #bfe479',
            font: `700 10px/1 ${F.body}`, letterSpacing: '.13em', textTransform: 'uppercase',
            color: C.greenInk, whiteSpace: 'nowrap',
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.green }} />
          Always on · verified
        </span>
      </Row>
    </section>
  )
}

function NotificationPrefs({ app }: { app: App }) {
  return (
    <section style={panel}>
      <Eyebrow style={{ marginBottom: 8 }}>Notification preferences</Eyebrow>
      <div style={{ font: `500 12.5px/1.6 ${F.body}`, color: '#8b877c', marginBottom: 14 }}>
        Delivered in-app and by email to {app.state.profileEmail}.
      </div>
      {app.notifPrefs.map(n => (
        <Row key={n.label} style={{ padding: '16px 0', borderTop: `1px solid ${C.line2}` }}>
          <div>
            <div style={{ font: `600 14px/1.3 ${F.body}` }}>{n.label}</div>
            <div style={{ marginTop: 5, font: `500 12px/1.5 ${F.body}`, color: '#8b877c' }}>
              {n.note}
            </div>
          </div>
          <Toggle on={n.on} onClick={n.toggle} />
        </Row>
      ))}
    </section>
  )
}

function DangerZone({ app }: { app: App }) {
  const S = app.state
  return (
    <section
      style={{
        background: 'transparent', border: '1px solid #dcbdb3', borderRadius: 24, padding: 28,
      }}
    >
      <div
        style={{
          font: `700 10px/1 ${F.body}`, letterSpacing: '.16em', textTransform: 'uppercase',
          color: '#a8341f', marginBottom: 20,
        }}
      >
        Danger zone
      </div>

      <Row style={{ paddingBottom: 20, borderBottom: '1px solid #e6cdc5' }}>
        <div style={{ maxWidth: 460 }}>
          <div style={{ font: `600 14px/1.3 ${F.body}`, color: C.ink }}>
            Deactivate all strategies
          </div>
          <div style={{ marginTop: 5, font: `500 12px/1.6 ${F.body}`, color: '#8b877c' }}>
            Everything stops at once and open positions are left untouched for you to manage
            manually.
          </div>
        </div>
        <HoverBtn
          onClick={app.deactivateAll}
          hover={{ background: '#fdf1ed' }}
          style={{
            ...ghostBtn, border: '1px solid #c78d80', color: '#8d3120', whiteSpace: 'nowrap',
          }}
        >
          {app.deactivateLabel}
        </HoverBtn>
      </Row>

      <div style={{ paddingTop: 20 }}>
        <div style={{ font: `600 14px/1.3 ${F.body}`, color: C.ink }}>Delete account</div>
        <div
          style={{
            marginTop: 5, font: `500 12px/1.6 ${F.body}`, color: '#8b877c', maxWidth: 560,
          }}
        >
          Removes your profile and broker links. Your audit log is retained as required by
          regulation — it cannot be deleted by you or by us. Type{' '}
          <span style={{ font: `600 12px/1 ${F.mono}`, color: C.ink }}>DELETE</span> to confirm.
        </div>
        <div
          style={{
            marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center',
          }}
        >
          <input
            value={S.deleteText}
            onChange={e => app.set({ deleteText: e.target.value })}
            placeholder="DELETE"
            style={{
              width: 180, padding: '13px 16px', border: '1px solid #dcbdb3', borderRadius: 14,
              background: C.surface, font: `600 14px/1 ${F.mono}`, color: C.ink,
            }}
          />
          {app.deleteArmed ? (
            <button
              type="button"
              onClick={app.doDelete}
              style={{
                padding: '14px 24px', borderRadius: 999, border: 'none', background: '#8d3120',
                color: '#fff', cursor: 'pointer', font: `700 10px/1 ${F.body}`,
                letterSpacing: '.13em', textTransform: 'uppercase',
              }}
            >
              Delete my account
            </button>
          ) : (
            <button
              type="button"
              disabled
              style={{
                padding: '14px 24px', borderRadius: 999, border: `1px solid ${C.line3}`,
                background: 'rgba(20,20,15,.04)', color: '#c9c5ba',
                font: `700 10px/1 ${F.body}`, letterSpacing: '.13em',
                textTransform: 'uppercase', cursor: 'not-allowed',
              }}
            >
              Delete my account
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

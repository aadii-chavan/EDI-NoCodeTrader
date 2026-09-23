import { C, F, shadowPop, shadowSm } from '../lib/theme'
import { HoverBtn } from './Hoverable'
import type { App } from '../state/useApp'

export function Chrome({ app }: { app: App }) {
  return (
    <>
      <div
        style={{
          maxWidth: 1180, margin: '0 auto 34px', display: 'flex', alignItems: 'center',
          gap: 18, flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, paddingRight: 6 }}>
          <div
            style={{
              width: 30, height: 30, borderRadius: 9, background: C.ink,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: C.lime }} />
          </div>
          <div style={{ font: `700 15px/1 ${F.display}`, letterSpacing: '-.02em' }}>
            NoCodeTrader
          </div>
        </div>

        <nav
          style={{
            display: 'flex', gap: 4, padding: 5, background: C.surface,
            border: `1px solid ${C.line}`, borderRadius: 999, boxShadow: shadowSm,
          }}
        >
          {app.navItems.map(n => (
            <HoverBtn
              key={n.label}
              onClick={n.go}
              hover={n.active ? undefined : { background: C.hover, color: C.ink }}
              style={{
                display: n.active ? 'flex' : undefined,
                alignItems: n.active ? 'center' : undefined,
                gap: n.active ? 8 : undefined,
                border: 'none', cursor: 'pointer', padding: '11px 20px', borderRadius: 999,
                background: n.active ? C.ink : 'transparent',
                color: n.active ? C.inkInv : C.muted,
                font: `${n.active ? 700 : 600} 11px/1 ${F.body}`,
                letterSpacing: '.11em', textTransform: 'uppercase',
              }}
            >
              {n.active && (
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.lime }} />
              )}
              {n.label}
            </HoverBtn>
          ))}
        </nav>

        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
          {app.brokerOk ? (
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '11px 18px 11px 14px',
                borderRadius: 999, background: C.ink, color: C.inkInv,
              }}
            >
              <span
                style={{
                  width: 8, height: 8, borderRadius: '50%', background: C.lime,
                  animation: 'blip 2.4s ease-in-out infinite',
                }}
              />
              <span
                style={{
                  font: `700 11px/1 ${F.body}`, letterSpacing: '.1em',
                  textTransform: 'uppercase', whiteSpace: 'nowrap',
                }}
              >
                Broker connected
              </span>
              <span style={{ font: `500 11px/1 ${F.mono}`, color: 'rgba(253,252,249,.55)' }}>
                {app.brokerMasked}
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={app.reconnect}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '11px 18px 11px 14px',
                borderRadius: 999, background: 'transparent', border: `1px solid ${C.amberEdge}`,
                cursor: 'pointer', color: C.amberDeep,
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.amber }} />
              <span
                style={{
                  font: `700 11px/1 ${F.body}`, letterSpacing: '.1em',
                  textTransform: 'uppercase', whiteSpace: 'nowrap',
                }}
              >
                Broker disconnected
              </span>
            </button>
          )}

          <HoverBtn
            onClick={app.toggleNotif}
            hover={{ borderColor: C.edgeStrong }}
            style={{
              position: 'relative', width: 46, height: 46, borderRadius: 999,
              border: `1px solid ${C.line3}`, background: C.surface, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: shadowSm,
            }}
          >
            <svg width="15" height="16" viewBox="0 0 15 16">
              <path
                d="M3 11.2V7a4.5 4.5 0 0 1 9 0v4.2l1.2 1.6H1.8L3 11.2Z"
                fill="none" stroke={C.ink} strokeWidth="1.3"
              />
              <path d="M6 14a1.5 1.5 0 0 0 3 0" fill="none" stroke={C.ink} strokeWidth="1.3" />
            </svg>
            {app.hasUnread && (
              <span
                style={{
                  position: 'absolute', top: -3, right: -3, minWidth: 19, height: 19,
                  padding: '0 5px', borderRadius: 999, background: C.lime,
                  border: `2px solid ${C.bg}`, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', font: `700 10px/1 ${F.body}`, color: C.ink,
                }}
              >
                {app.unreadCount}
              </span>
            )}
          </HoverBtn>

          <HoverBtn
            onClick={app.goSettings}
            hover={{ borderColor: C.edgeStrong }}
            style={{
              width: 46, height: 46, borderRadius: 999, border: `1px solid ${C.line3}`,
              background: C.surface, cursor: 'pointer', font: `700 12px/1 ${F.body}`,
              letterSpacing: '.04em', color: C.ink, boxShadow: shadowSm,
            }}
          >
            {app.initials}
          </HoverBtn>

          {app.notifOpen && <NotifPanel app={app} />}
        </div>
      </div>

      {app.connLost && <ConnBanner app={app} />}
    </>
  )
}

function NotifPanel({ app }: { app: App }) {
  return (
    <div
      style={{
        position: 'absolute', top: 58, right: 0, width: 394, maxWidth: '86vw', zIndex: 40,
        background: C.surface, border: `1px solid ${C.line3}`, borderRadius: 22,
        boxShadow: shadowPop, overflow: 'hidden', animation: 'fadein .18s ease',
      }}
    >
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          padding: '18px 22px', background: C.surfaceAlt,
          borderBottom: '1px solid rgba(20,20,15,.07)',
        }}
      >
        <span
          style={{
            font: `700 10px/1 ${F.body}`, letterSpacing: '.16em',
            textTransform: 'uppercase', color: C.faint,
          }}
        >
          Notifications
        </span>
        <HoverBtn
          onClick={app.markRead}
          hover={{ color: C.ink }}
          style={{
            border: 'none', background: 'transparent', cursor: 'pointer',
            font: `600 10px/1 ${F.body}`, letterSpacing: '.11em',
            textTransform: 'uppercase', color: C.muted,
          }}
        >
          Mark all read
        </HoverBtn>
      </div>

      <div style={{ maxHeight: 400, overflow: 'auto' }}>
        {app.notifs.map(x => (
          <div
            key={x.title}
            style={{ padding: '17px 22px', borderBottom: `1px solid ${C.line2}` }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 7 }}>
              {x.unread && (
                <span
                  style={{
                    width: 7, height: 7, borderRadius: '50%', background: C.lime, flex: 'none',
                  }}
                />
              )}
              <span style={{ font: `500 11px/1 ${F.mono}`, color: C.faint }}>{x.time}</span>
              <span
                style={{
                  display: 'inline-flex', padding: '3px 9px', borderRadius: 7,
                  border: `1px solid ${C.line4}`, font: `700 9px/1.4 ${F.body}`,
                  letterSpacing: '.11em', textTransform: 'uppercase', color: C.muted,
                }}
              >
                {x.tag}
              </span>
            </div>
            <div style={{ font: `600 13.5px/1.5 ${F.body}`, color: C.ink }}>{x.title}</div>
            <div style={{ marginTop: 4, font: `500 12px/1.6 ${F.body}`, color: C.muted }}>
              {x.body}
            </div>
            {x.action && (
              <button
                type="button"
                onClick={x.onAction}
                style={{
                  marginTop: 11, padding: '9px 17px', borderRadius: 999, border: 'none',
                  background: C.ink, color: C.inkInv, cursor: 'pointer',
                  font: `700 9.5px/1 ${F.body}`, letterSpacing: '.13em',
                  textTransform: 'uppercase',
                }}
              >
                {x.actionLabel}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function ConnBanner({ app }: { app: App }) {
  return (
    <div
      style={{
        maxWidth: 1180, margin: '0 auto 26px', display: 'flex', flexWrap: 'wrap',
        alignItems: 'center', gap: 16, padding: '18px 22px', borderRadius: 18,
        background: C.amberBg, border: `1px solid ${C.amberLine}`,
      }}
    >
      <span
        style={{ width: 9, height: 9, borderRadius: '50%', background: C.amber, flex: 'none' }}
      />
      <div style={{ flex: 1, minWidth: 220 }}>
        <div style={{ font: `600 14px/1.4 ${F.body}`, color: C.amberDeep }}>
          Broker connection lost — reconnect to resume live monitoring
        </div>
        <div style={{ marginTop: 4, font: `500 12px/1.5 ${F.body}`, color: C.amberInk }}>
          Strategies are held. No orders will be placed while the session is down; every skipped
          signal is still logged.
        </div>
      </div>
      <button
        type="button"
        onClick={app.reconnect}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 9, padding: '13px 22px',
          borderRadius: 999, border: 'none', background: C.ink, color: C.inkInv,
          cursor: 'pointer', font: `700 10px/1 ${F.body}`, letterSpacing: '.13em',
          textTransform: 'uppercase',
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.lime }} />
        Reconnect
      </button>
    </div>
  )
}

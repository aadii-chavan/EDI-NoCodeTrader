import type { CSSProperties } from 'react'
import { C, F } from '../lib/theme'
import { HoverBtn } from '../components/Hoverable'
import { Label } from '../components/ui'
import type { App } from '../state/useApp'

const input: CSSProperties = {
  width: '100%',
  padding: '14px 16px',
  border: '1px solid rgba(20,20,15,.14)',
  borderRadius: 14,
  background: '#fff',
  font: `500 15px/1.2 ${F.body}`,
  color: C.ink,
}

export function Auth({ app }: { app: App }) {
  const S = app.state
  return (
    <div
      style={{
        minHeight: '86vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '40px 0',
      }}
    >
      <Wordmark />
      <div
        style={{
          width: '100%', maxWidth: 470, background: C.surface,
          border: '1px solid rgba(20,20,15,.08)', borderRadius: 28, padding: 36,
          boxShadow: '0 1px 2px rgba(20,20,15,.04),0 30px 60px -44px rgba(20,20,15,.5)',
        }}
      >
        {app.isSignup && (
          <div>
            <h1 style={{ margin: 0, font: `700 40px/1.02 ${F.display}`, letterSpacing: '-.04em' }}>
              Create your
              <br />
              account
            </h1>
            <p style={{ margin: '14px 0 28px', font: `500 13px/1.6 ${F.body}`, color: '#8b877c' }}>
              Two minutes. You'll connect a broker next — nothing can trade until you do.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <Label>Full name</Label>
                <input
                  value={S.suName}
                  onChange={e => app.set({ suName: e.target.value })}
                  placeholder="Ananya Rao"
                  style={input}
                />
              </div>
              <div>
                <Label>Email</Label>
                <input
                  value={S.suEmail}
                  onChange={e => app.set({ suEmail: e.target.value })}
                  placeholder="you@email.com"
                  style={input}
                />
              </div>
              <div>
                <Label>Password</Label>
                <input
                  type="password"
                  value={S.suPw}
                  onChange={e => app.set({ suPw: e.target.value })}
                  placeholder="••••••••"
                  style={input}
                />
                <div
                  style={{ marginTop: 11, display: 'flex', alignItems: 'center', gap: 11 }}
                >
                  <div style={{ display: 'flex', gap: 5, flex: 1 }}>
                    {app.pwBars.map((b, i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1, height: 5, borderRadius: 999,
                          background: b.filled ? C.ink : 'rgba(20,20,15,.1)',
                        }}
                      />
                    ))}
                  </div>
                  <span
                    style={{
                      font: `700 9.5px/1 ${F.body}`, letterSpacing: '.14em',
                      textTransform: 'uppercase', color: '#8b877c', whiteSpace: 'nowrap',
                    }}
                  >
                    {app.pwLabel}
                  </span>
                </div>
                <div style={{ marginTop: 8, font: `500 11.5px/1.5 ${F.body}`, color: C.faint }}>
                  {app.pwHint}
                </div>
              </div>
              <div>
                <Label>Confirm password</Label>
                <input
                  type="password"
                  value={S.suPw2}
                  onChange={e => app.set({ suPw2: e.target.value })}
                  placeholder="••••••••"
                  style={input}
                />
                {app.pwMismatch && (
                  <div
                    style={{ marginTop: 8, font: `500 11.5px/1.5 ${F.body}`, color: '#8d3120' }}
                  >
                    Passwords don't match yet.
                  </div>
                )}
              </div>
            </div>
            <p style={{ margin: '22px 0 0', font: `500 12px/1.7 ${F.body}`, color: C.muted }}>
              By creating an account, you agree to our{' '}
              <span style={{ borderBottom: '1px solid rgba(20,20,15,.3)' }}>Terms</span> and
              acknowledge this platform executes real trades through your connected broker.
            </p>
            <SubmitBtn onClick={app.submitSignup}>Create account</SubmitBtn>
            <Switcher
              text="Already have an account?"
              cta="Log in"
              onClick={app.goLogin}
            />
          </div>
        )}

        {app.isLogin && (
          <div>
            <h1 style={{ margin: 0, font: `700 40px/1.02 ${F.display}`, letterSpacing: '-.04em' }}>
              Log in
            </h1>
            <p style={{ margin: '14px 0 28px', font: `500 13px/1.6 ${F.body}`, color: '#8b877c' }}>
              Your broker session is re-authenticated separately each trading day.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <Label>Email</Label>
                <input
                  value={S.liEmail}
                  onChange={e => app.set({ liEmail: e.target.value })}
                  placeholder="you@email.com"
                  style={input}
                />
              </div>
              <div>
                <div
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    gap: 12, marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      font: `700 9px/1 ${F.body}`, letterSpacing: '.16em',
                      textTransform: 'uppercase', color: C.faint,
                    }}
                  >
                    Password
                  </span>
                  <button
                    type="button"
                    style={{
                      border: 'none', background: 'transparent', cursor: 'pointer',
                      font: `600 11px/1 ${F.body}`, color: C.muted,
                      borderBottom: '1px solid rgba(20,20,15,.22)', padding: '0 0 2px',
                    }}
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  value={S.liPw}
                  onChange={e => app.set({ liPw: e.target.value })}
                  placeholder="••••••••"
                  style={input}
                />
              </div>
            </div>
            <SubmitBtn onClick={app.submitLogin} marginTop={24}>
              Log in
            </SubmitBtn>
            <Switcher text="New here?" cta="Create an account" onClick={app.goSignup} />
          </div>
        )}
      </div>
    </div>
  )
}

export function Wordmark({ size = 'lg' }: { size?: 'lg' | 'sm' }) {
  const box = size === 'lg' ? 34 : 30
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 30 }}>
      <div
        style={{
          width: box, height: box, borderRadius: 10, background: C.ink,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: C.lime }} />
      </div>
      <div style={{ font: `700 19px/1 ${F.display}`, letterSpacing: '-.025em' }}>NoCodeTrader</div>
    </div>
  )
}

function SubmitBtn({
  onClick, children, marginTop = 22,
}: {
  onClick: () => void; children: React.ReactNode; marginTop?: number
}) {
  return (
    <HoverBtn
      onClick={onClick}
      hover={{ background: '#2c2c22' }}
      style={{
        marginTop, width: '100%', display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: 11, padding: '19px 30px', borderRadius: 999,
        border: 'none', background: C.ink, color: C.inkInv, cursor: 'pointer',
        font: `700 12px/1 ${F.body}`, letterSpacing: '.14em', textTransform: 'uppercase',
      }}
    >
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.lime }} />
      {children}
    </HoverBtn>
  )
}

function Switcher({
  text, cta, onClick,
}: {
  text: string; cta: string; onClick: () => void
}) {
  return (
    <div
      style={{
        marginTop: 20, textAlign: 'center', font: `500 12.5px/1 ${F.body}`, color: '#8b877c',
      }}
    >
      {text}{' '}
      <button
        type="button"
        onClick={onClick}
        style={{
          border: 'none', background: 'transparent', cursor: 'pointer',
          font: `700 12.5px/1 ${F.body}`, color: C.ink,
          borderBottom: '1px solid rgba(20,20,15,.3)', padding: '0 0 2px',
        }}
      >
        {cta}
      </button>
    </div>
  )
}

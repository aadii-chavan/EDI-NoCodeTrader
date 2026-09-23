/**
 * Demo session persistence. There is no backend here — signing in records who
 * the visitor claims to be so a refresh doesn't drop them back on the landing
 * page. Never treat this as authentication.
 */
export type Session = { name: string; email: string }

const KEY = 'nct.session'

/** Storage can throw (private mode, blocked cookies), so every access is guarded. */
export function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<Session>
    if (typeof parsed?.email !== 'string') return null
    return { name: String(parsed.name ?? ''), email: parsed.email }
  } catch {
    return null
  }
}

export function saveSession(s: Session): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {
    // Non-fatal: the visitor just gets the landing page again on refresh.
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // Non-fatal.
  }
}

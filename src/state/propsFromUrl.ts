import type { AppProps, Stage } from './types'

const STAGES: Stage[] = ['app', 'signup', 'login', 'broker']

/**
 * The design mockup exposed these as editor props. There is no equivalent panel
 * here, so read them from the query string instead — e.g.
 * `?stage=signup`, `?empty=1`, `?offline=1`, `?ghost=0`, `?pills=0`.
 */
export function propsFromUrl(search = window.location.search): Partial<AppProps> {
  const q = new URLSearchParams(search)
  const out: Partial<AppProps> = {}

  const stage = q.get('stage')
  if (stage && (STAGES as string[]).includes(stage)) out.startStage = stage as Stage

  const flag = (key: string) => {
    const v = q.get(key)
    if (v === null) return undefined
    return v !== '0' && v !== 'false'
  }

  const empty = flag('empty')
  if (empty !== undefined) out.emptyState = empty

  const offline = flag('offline')
  if (offline !== undefined) out.connectionLost = offline

  const ghost = flag('ghost')
  if (ghost !== undefined) out.ghostDecor = ghost

  const pills = flag('pills')
  if (pills !== undefined) out.showPills = pills

  return out
}

import { rng, inr } from '../lib/format'
import type { AppState, Backtest } from './types'

const MONTHS: Record<string, number> = {
  '1 month': 1,
  '3 months': 3,
  '6 months': 6,
  '1 year': 12,
}

/**
 * Deterministic sample backtest. Seeded from range + risk + condition count so
 * the same inputs always produce the same curve.
 */
export function makeBacktest(range: string, s: AppState): Backtest {
  const months = MONTHS[range] ?? 3
  const risk = s.risk || 5000
  const r = rng(months * 977 + risk + s.conds.length * 13)
  const n = Math.max(8, Math.round(months * 7 + r() * 5))
  const winRate = 52 + Math.round(r() * 15)

  let eq = 0
  let peak = 0
  let dd = 0
  let worst = 0
  let worstIdx = 0
  let wins = 0
  const pts: number[] = []

  for (let i = 0; i < n; i++) {
    const win = r() * 100 < winRate
    const d = win ? risk * (0.28 + r() * 0.55) : -risk * (0.22 + r() * 0.5)
    if (win) wins++
    if (d < worst) {
      worst = d
      worstIdx = i
    }
    eq += d
    pts.push(eq)
    if (eq > peak) peak = eq
    if (peak - eq > dd) dd = peak - eq
  }

  const net = pts[n - 1]
  const lo = Math.min(0, Math.min(...pts))
  const hi = Math.max(...pts)
  const xy = pts.map((v, i) => [
    i * (640 / (n - 1)),
    180 - ((v - lo) / (hi - lo || 1)) * 165,
  ])
  const curve = xy.map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')

  const sym = s.actionSymbol || 'RELIANCE'
  const dates = ['12 Sep', '10 Sep', '06 Sep', '03 Sep', '29 Aug']
  const trades = dates.map((d, i) => {
    const win = i !== 1 && i !== 4
    const amt = Math.round(risk * (win ? 0.3 + i * 0.12 : -0.35 - i * 0.05))
    return {
      date: d,
      pre: s.side === 'BUY' ? 'Bought' : 'Sold',
      sym,
      mid: 'on trigger · closed for',
      pnl: (amt >= 0 ? '+' : '') + inr(amt),
      win: amt >= 0,
      loss: amt < 0,
    }
  })

  return {
    curve,
    area: '0,190 ' + curve + ' 640,190',
    lossX: xy[worstIdx][0].toFixed(1),
    lossY: xy[worstIdx][1].toFixed(1),
    trades,
    stats: [
      { label: 'Total trades', value: String(n), sign: 0 },
      { label: 'Win rate', value: Math.round((wins / n) * 100) + '%', sign: 0 },
      { label: 'Net P&L', value: (net >= 0 ? '+' : '') + inr(net), sign: net >= 0 ? 1 : -1 },
      {
        label: 'Avg profit / trade',
        value: (net / n >= 0 ? '+' : '') + inr(net / n),
        sign: net >= 0 ? 1 : -1,
      },
      { label: 'Max drawdown', value: '-' + inr(dd), sign: -1 },
    ],
  }
}

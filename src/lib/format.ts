import { SYMS } from '../data/mock'

/** Deterministic PRNG (Lehmer) so sample charts stay stable across renders. */
export function rng(seed: number): () => number {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }
}

/** Indian-grouped rupee formatting: 1234567 -> ₹12,34,567 */
export function inr(n: number): string {
  const neg = n < 0
  const s = Math.abs(Math.round(n)).toString()
  let out = s
  if (s.length > 3) {
    const last3 = s.slice(-3)
    let rest = s.slice(0, -3)
    const parts: string[] = []
    while (rest.length > 2) {
      parts.unshift(rest.slice(-2))
      rest = rest.slice(0, -2)
    }
    if (rest) parts.unshift(rest)
    out = parts.join(',') + ',' + last3
  }
  return (neg ? '-₹' : '₹') + out
}

export function priceOf(sym: string): number {
  const f = SYMS.find(x => x.s === sym.toUpperCase())
  return f ? f.p : 1000
}

export function clockNow(): string {
  return new Date().toLocaleTimeString('en-IN', { hour12: false })
}

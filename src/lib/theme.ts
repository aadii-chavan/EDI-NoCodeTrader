/** Design tokens lifted from the NoCodeTrader design-system mockup. */
export const C = {
  bg: '#f1efe9',
  surface: '#fffefb',
  surfaceAlt: '#faf8f3',
  rowAlt: '#fbfaf6',
  ink: '#15150f',
  inkInv: '#fdfcf9',
  muted: '#6f6c63',
  faint: '#a7a39a',
  soft: '#4f4b40',
  lime: '#d8f533',
  green: '#6c9c16',
  greenInk: '#3d5416',
  amber: '#c79b1e',
  amberInk: '#8a7440',
  amberDeep: '#5d4a14',
  amberBg: '#f8f2e2',
  amberLine: '#e3d5ae',
  amberEdge: '#d9c495',
  clay: '#d8a596',
  pos: '#3d6b12',
  neg: '#a8341f',
  line: 'rgba(20,20,15,.09)',
  line2: 'rgba(20,20,15,.06)',
  line3: 'rgba(20,20,15,.1)',
  line4: 'rgba(20,20,15,.16)',
  line5: 'rgba(20,20,15,.24)',
  hover: 'rgba(20,20,15,.05)',
  edgeStrong: 'rgba(20,20,15,.32)',
} as const

export const F = {
  display: 'Outfit,sans-serif',
  body: 'Manrope,system-ui,sans-serif',
  mono: 'JetBrains Mono,monospace',
} as const

/** Uppercase micro-label used throughout the mockup. */
export const caps = (size = 10, weight = 700): React.CSSProperties => ({
  font: `${weight} ${size}px/1 ${F.body}`,
  letterSpacing: '.13em',
  textTransform: 'uppercase',
})

export const shadowSm = '0 1px 2px rgba(20,20,15,.04)'
export const shadowPop = '0 34px 70px -34px rgba(20,20,15,.5)'

/** Semantic P&L colors. */
export const POS = C.pos
export const NEG = C.neg

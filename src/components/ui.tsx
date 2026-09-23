import type { CSSProperties, ReactNode } from 'react'
import { C, F, shadowSm } from '../lib/theme'
import { HoverBtn } from './Hoverable'
import type { Pill } from '../state/types'

/** Small uppercase field label. */
export function Label({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        font: `700 9px/1 ${F.body}`,
        letterSpacing: '.16em',
        textTransform: 'uppercase',
        color: C.faint,
        marginBottom: 8,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/** Step eyebrow above a section heading. */
export function Eyebrow({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        font: `700 10px/1 ${F.body}`,
        letterSpacing: '.16em',
        textTransform: 'uppercase',
        color: C.faint,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

const cardStyle: CSSProperties = {
  background: C.surface,
  border: '1px solid rgba(20,20,15,.08)',
  borderRadius: 24,
  padding: 28,
  boxShadow: `${shadowSm},0 18px 40px -30px rgba(20,20,15,.3)`,
}

export function Section({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <section style={{ ...cardStyle, ...style }}>{children}</section>
}

const fieldBase: CSSProperties = {
  width: '100%',
  padding: '13px 15px',
  border: `1px solid rgba(20,20,15,.14)`,
  borderRadius: 14,
  background: '#fff',
  font: `600 15px/1.2 ${F.body}`,
  color: C.ink,
}

export function TextField({
  value, onChange, onFocus, disabled, placeholder, style,
}: {
  value: string
  onChange: (v: string) => void
  onFocus?: () => void
  disabled?: boolean
  placeholder?: string
  style?: CSSProperties
}) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      onFocus={onFocus}
      disabled={disabled}
      placeholder={placeholder}
      style={{ ...fieldBase, ...style }}
    />
  )
}

export function SelectField({
  value, onChange, disabled, options,
}: {
  value: string
  onChange: (v: string) => void
  disabled?: boolean
  options: string[]
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      style={{ ...fieldBase, appearance: 'none', cursor: 'pointer', backgroundImage: 'none' }}
    >
      {options.map(o => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  )
}

/** Segmented pill group — the mockup's recurring on/off button row. */
export function Segmented({
  items, pad = '11px 26px', radius = 11, wrapRadius = 14, gap = 4, letterSpacing = '.13em', upper,
}: {
  items: { label: string; on: boolean; pick: () => void }[]
  pad?: string
  radius?: number
  wrapRadius?: number
  gap?: number
  letterSpacing?: string
  upper?: boolean
}) {
  return (
    <div
      style={{
        display: 'flex', gap, padding: 4, borderRadius: wrapRadius,
        background: C.hover, width: 'max-content',
      }}
    >
      {items.map(s => (
        <button
          key={s.label}
          type="button"
          onClick={s.pick}
          style={{
            border: 'none', cursor: 'pointer', padding: pad, borderRadius: radius,
            background: s.on ? C.ink : 'transparent',
            color: s.on ? C.inkInv : '#8b877c',
            font: `${s.on ? 700 : 600} 11px/1 ${F.body}`,
            letterSpacing,
            textTransform: upper ? 'uppercase' : 'none',
          }}
        >
          {s.label}
        </button>
      ))}
    </div>
  )
}

/** Pill-shaped toggle switch. */
export function Toggle({ on, onClick, size = 'lg' }: { on: boolean; onClick: () => void; size?: 'lg' | 'sm' }) {
  const w = size === 'lg' ? 52 : 44
  const h = size === 'lg' ? 30 : 26
  const k = size === 'lg' ? 24 : 20
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: 'none', width: w, height: h, borderRadius: 999, cursor: 'pointer',
        border: on ? 'none' : '1px solid rgba(20,20,15,.12)',
        background: on ? C.ink : 'rgba(20,20,15,.06)',
        display: 'flex', alignItems: 'center',
        justifyContent: on ? 'flex-end' : 'flex-start',
        padding: 3,
      }}
    >
      <span
        style={{
          width: k, height: k, borderRadius: '50%',
          background: on ? C.lime : '#fff',
          boxShadow: on ? undefined : '0 1px 3px rgba(20,20,15,.2)',
        }}
      />
    </button>
  )
}

/** Renders a plain-language strategy sentence with inline value pills. */
export function Sentence({
  parts, fontSize, pillPad = '1px 10px', pillRadius = 9,
}: {
  parts: Pill[]
  fontSize: string
  pillPad?: string
  pillRadius?: number
}) {
  return (
    <p
      style={{
        margin: 0,
        font: `400 ${fontSize} ${F.display}`,
        letterSpacing: '-.015em',
        color: C.ink,
        textWrap: 'pretty',
      }}
    >
      {parts.map((p, i) =>
        p.pill ? (
          <span
            key={i}
            style={{
              display: 'inline-block', padding: pillPad, margin: '0 1px',
              border: `1px solid ${C.line5}`, borderRadius: pillRadius,
              background: C.surfaceAlt, font: `600 .86em/1.5 ${F.body}`,
            }}
          >
            {p.t}
          </span>
        ) : (
          <span key={i} style={{ whiteSpace: 'pre-wrap' }}>
            {p.t}
          </span>
        ),
      )}
    </p>
  )
}

/** Dark primary CTA. */
export function PrimaryBtn({
  onClick, children, style,
}: {
  onClick: () => void
  children: ReactNode
  style?: CSSProperties
}) {
  return (
    <HoverBtn
      onClick={onClick}
      hover={{ background: '#2c2c22' }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 12,
        padding: '19px 32px', borderRadius: 999, border: 'none',
        background: C.ink, color: C.inkInv, cursor: 'pointer',
        font: `700 12px/1 ${F.body}`, letterSpacing: '.14em', textTransform: 'uppercase',
        ...style,
      }}
    >
      {children}
    </HoverBtn>
  )
}

/** Underlined text link used for secondary navigation. */
export function LinkBtn({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: 'none', background: 'transparent', cursor: 'pointer',
        font: `700 11px/1 ${F.body}`, letterSpacing: '.12em', textTransform: 'uppercase',
        color: C.muted, borderBottom: `1px solid ${C.line5}`, padding: '0 0 4px',
      }}
    >
      {children}
    </button>
  )
}

/** Stat tile with the oversized ghost numeral behind it. */
export function StatTile({
  value, label, color, ghost, ghostChar,
}: {
  value: string
  label: string
  color: string
  ghost: boolean
  ghostChar: string
}) {
  return (
    <div
      style={{
        position: 'relative', overflow: 'hidden',
        border: `1px solid ${C.line}`, borderRadius: 18,
        padding: '20px 18px', background: C.surfaceAlt,
      }}
    >
      {ghost && (
        <div
          style={{
            position: 'absolute', right: -6, bottom: -34,
            font: `800 96px/1 ${F.display}`, color: 'rgba(20,20,15,.045)',
            pointerEvents: 'none', userSelect: 'none',
          }}
        >
          {ghostChar}
        </div>
      )}
      <div
        style={{
          position: 'relative', font: `700 38px/1 ${F.display}`,
          letterSpacing: '-.04em', color,
        }}
      >
        {value}
      </div>
      <div
        style={{
          position: 'relative', marginTop: 10, font: `600 11px/1.3 ${F.body}`,
          letterSpacing: '.1em', textTransform: 'uppercase', color: '#8b877c',
        }}
      >
        {label}
      </div>
    </div>
  )
}

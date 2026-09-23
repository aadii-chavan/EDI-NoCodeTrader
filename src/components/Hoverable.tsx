import { useState } from 'react'
import type { CSSProperties, MouseEvent, ReactNode } from 'react'

type Props = {
  style: CSSProperties
  hover?: CSSProperties
  onClick?: (e: MouseEvent) => void
  title?: string
  disabled?: boolean
  children?: ReactNode
}

const BORDER_LONGHANDS = ['borderColor', 'borderWidth', 'borderStyle'] as const

/**
 * React warns — and can drop styles — when a re-render mixes the `border`
 * shorthand with a longhand like `borderColor`. Base styles use the shorthand
 * (it reads closer to the source design), while hover patches usually only want
 * to shift the color, so expand the shorthand whenever the two would collide.
 */
function mergeHover(base: CSSProperties, patch: CSSProperties): CSSProperties {
  const touchesBorder = BORDER_LONGHANDS.some(k => k in patch)
  if (!touchesBorder || typeof base.border !== 'string') return { ...base, ...patch }

  const { border, ...rest } = base
  const expanded: CSSProperties = { ...rest }

  if (border.trim() === 'none') {
    expanded.borderStyle = 'none'
    expanded.borderWidth = 0
  } else {
    // "<width> <style> <color…>" — color may itself contain spaces, e.g. rgba(…).
    const [width, style, ...color] = border.trim().split(/\s+/)
    expanded.borderWidth = width
    expanded.borderStyle = style
    if (color.length) expanded.borderColor = color.join(' ')
  }

  return { ...expanded, ...patch }
}

export function HoverBtn({ style, hover, onClick, title, disabled, children }: Props) {
  const [on, setOn] = useState(false)
  const active = on && hover && !disabled
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      onBlur={() => setOn(false)}
      style={active ? mergeHover(style, hover) : style}
    >
      {children}
    </button>
  )
}

export function HoverDiv({ style, hover, onClick, children }: Props) {
  const [on, setOn] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      style={on && hover ? mergeHover(style, hover) : style}
    >
      {children}
    </div>
  )
}

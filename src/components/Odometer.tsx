import { cx } from '../lib/cx'

const ROLL = { transitionDuration: '0.65s', transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }

/** One rolling digit column 0–9, translateY(-n em) — the reference's odometer cell. */
function Digit({ d, target, delay = 0 }: { d: number; target: number; delay?: number }) {
  return (
    <span className="relative inline-block overflow-hidden align-baseline" style={{ height: '1em', lineHeight: '1em' }}>
      {/* the cell is always as wide as the digit it will land on, so nothing shifts while rolling */}
      <span className="invisible">{target}</span>
      <span className="absolute inset-x-0 top-0 flex flex-col transition-transform motion-reduce:transition-none" style={{ ...ROLL, transform: `translateY(${-d}em)`, transitionDelay: `${delay}s` }}>
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className="block" style={{ height: '1em', lineHeight: '1em' }} aria-hidden={i !== d ? true : undefined}>{i}</span>
        ))}
      </span>
    </span>
  )
}

/**
 * Renders a string where every digit is an odometer column; other characters are static.
 * `active=false` shows every column at 0 (the pre-reveal state) so the numbers roll in on demand.
 */
export function Odometer({ value, active = true, className, stagger = 0.06 }: { value: string; active?: boolean; className?: string; stagger?: number }) {
  let n = 0
  return (
    <span className={className}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" className="flex items-center">
        {value.split('').map((ch, i) => {
          if (/\d/.test(ch)) { const d = n++; return <Digit key={i} d={active ? +ch : 0} target={+ch} delay={d * stagger} /> }
          return <span key={i}>{ch}</span>
        })}
      </span>
    </span>
  )
}

/** Vertical word stack: shows `items[index]`, sliding by whole rows (the client name / Menu-Close flip). */
export function FlipText({ items, index, className, duration = 0.56 }: { items: string[]; index: number; className?: string; duration?: number }) {
  return (
    <span className={cx('relative block overflow-hidden', className)} style={{ height: '1em', lineHeight: '1em' }}>
      <span className="sr-only">{items[index]}</span>
      <span aria-hidden="true" className="flex flex-col transition-transform motion-reduce:transition-none" style={{ transform: `translateY(${-index}em)`, transitionDuration: `${duration}s`, transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}>
        {items.map((t, i) => (<span key={i} className="block whitespace-nowrap" style={{ height: '1em', lineHeight: '1em' }}>{t}</span>))}
      </span>
    </span>
  )
}

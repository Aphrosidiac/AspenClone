import { useEffect, useState } from 'react'
import { cx } from '../lib/cx'
import { Odometer } from './Odometer'

const ZONES = { NYC: 'America/New_York', LA: 'America/Los_Angeles' } as const
type Zone = keyof typeof ZONES

function partsFor(zone: Zone, d = new Date()) {
  const f = new Intl.DateTimeFormat('en-US', { timeZone: ZONES[zone], hour: 'numeric', minute: '2-digit', hour12: true, second: 'numeric' })
  const p = Object.fromEntries(f.formatToParts(d).map((x) => [x.type, x.value])) as Record<string, string>
  return { hour: +p.hour, minute: +p.minute, second: +p.second, period: p.dayPeriod }
}

function useNow(ms = 1000) {
  const [now, set] = useState(() => new Date())
  useEffect(() => { const t = setInterval(() => set(new Date()), ms); return () => clearInterval(t) }, [ms])
  return now
}

/** Header time: odometer clock that alternates NYC / LA, sliding by a whole row. */
export function HeaderTime({ className }: { className?: string }) {
  const now = useNow(1000)
  const [idx, setIdx] = useState(0)
  useEffect(() => { const t = setInterval(() => setIdx((i) => (i + 1) % 2), 5000); return () => clearInterval(t) }, [])
  const zones: Zone[] = ['NYC', 'LA']
  const cur = partsFor(zones[idx], now)
  const label = `${String(cur.hour).padStart(2, '0')}:${String(cur.minute).padStart(2, '0')} ${cur.period}`
  return (
    <time title={`${zones[idx]}: ${now.toLocaleString('en-US', { timeZone: ZONES[zones[idx]], dateStyle: 'short', timeStyle: 'short' })}`} aria-live="polite" aria-atomic="true" className={cx('tabular-nums text-caption-20', className)} dateTime={now.toISOString().slice(0, 16)}>
      <span className="sr-only">{zones[idx]}: {label}</span>
      <span aria-hidden="true" className="relative block overflow-hidden" style={{ height: '1em', lineHeight: '1em' }}>
        <span className="flex flex-col transition-transform motion-reduce:transition-none" style={{ transform: `translateY(${-idx}em)`, transitionDuration: '0.65s', transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}>
          {zones.map((z) => { const p = partsFor(z, now); const hh = String(p.hour).padStart(2, '0'); const mm = String(p.minute).padStart(2, '0'); return (
            <span key={z} className="flex items-center gap-[0.5ch]" style={{ height: '1em', lineHeight: '1em' }}>
              <span><Odometer value={`${hh}:${mm}`} stagger={0} /></span>
              <span>{p.period}</span>
              <span className="shrink-0">{z}</span>
            </span>
          ) })}
        </span>
      </span>
    </time>
  )
}

/** 48px analog clock with a mono digital time under the zone label (footer / contact / menu). */
export function AnalogClock({ zone, showTime = true, className }: { zone: Zone; showTime?: boolean; className?: string }) {
  const now = useNow(1000)
  const p = partsFor(zone, now)
  const hourDeg = ((p.hour % 12) + p.minute / 60) * 30
  const minDeg = (p.minute + p.second / 60) * 6
  const label = `${p.hour}:${String(p.minute).padStart(2, '0')} ${p.period}`
  return (
    <div className={cx('flex items-center gap-12', className)}>
      <svg className="shrink-0 text-current size-48" viewBox="0 0 24 24" fill="none" shapeRendering="geometricPrecision" aria-hidden="true">
        <title>{zone} time</title>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="0.5" />
        <g transform={`rotate(${hourDeg} 12 12)`}><line x1="12" y1="12" x2="12" y2="6.5" stroke="currentColor" strokeLinecap="butt" strokeWidth="0.5" /></g>
        <g transform={`rotate(${minDeg} 12 12)`}><line x1="12" y1="12" x2="12" y2="4" stroke="currentColor" strokeLinecap="butt" strokeWidth="0.5" /></g>
      </svg>
      <div className="flex min-w-0 flex-col gap-2">
        <p>{zone}</p>
        {showTime && <p className="font-mono text-caption-10 text-theme-fg/65 tabular-nums"><time dateTime={now.toISOString().slice(0, 16)}>{label}</time></p>}
      </div>
    </div>
  )
}

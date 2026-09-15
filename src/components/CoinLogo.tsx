import { useEffect, useRef, type ReactNode } from 'react'
import { useLenis } from '../lib/lenis'
import { cx } from '../lib/cx'

/**
 * Shared spin state for every coin-rotating logo: -18°/s idle (20 s per turn, measured), plus a kick that
 * follows scroll velocity so the coin spins faster while the page moves.
 */
let angle = 0
let lastT = 0
let velocity = 0
const subs = new Set<(deg: number) => void>()
let raf = 0
const tick = (t: number) => {
  const dt = lastT ? Math.min((t - lastT) / 1000, 0.1) : 0
  lastT = t
  angle -= 18 * dt + Math.abs(velocity) * 0.035 * dt * 60
  velocity *= 0.9
  for (const s of subs) s(angle)
  raf = requestAnimationFrame(tick)
}
export const kickCoin = (v: number) => { velocity = v }

export function useCoinSpin(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const fn = (deg: number) => { el.style.transform = `translateZ(1px) rotateY(${deg.toFixed(2)}deg)` }
    subs.add(fn)
    if (subs.size === 1) { lastT = 0; raf = requestAnimationFrame(tick) }
    return () => { subs.delete(fn); if (subs.size === 0) cancelAnimationFrame(raf) }
  }, [ref])
}

export function Coin({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useCoinSpin(ref)
  const lenis = useLenis()
  useEffect(() => {
    if (!lenis) return
    const on = (l: { velocity: number }) => kickCoin(l.velocity)
    lenis.on('scroll', on)
    return () => lenis.off('scroll', on)
  }, [lenis])
  return (
    <div className="perspective-[1000px]">
      <div ref={ref} className={cx('vt-exclude transform-3d origin-center', className)} style={{ transform: 'translateZ(1px)' }}>{children}</div>
    </div>
  )
}

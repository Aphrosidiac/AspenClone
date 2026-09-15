import { useEffect, useRef, type ReactNode } from 'react'
import { usePrefersReducedMotion } from '../lib/motion'

/** A short burst of small squares (mint / fg) fired from the children's box when it enters the viewport. */
export function Confetti({ children, fire = true }: { children: ReactNode; fire?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = usePrefersReducedMotion()
  useEffect(() => {
    const el = ref.current
    if (!el || !fire || reduced) return
    let fired = false
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || fired) return
      fired = true; io.disconnect()
      const r = (el.firstElementChild ?? el).getBoundingClientRect()
      const c = document.createElement('canvas')
      Object.assign(c.style, { position: 'fixed', inset: '0', pointerEvents: 'none', zIndex: '5' })
      c.width = innerWidth; c.height = innerHeight
      document.body.appendChild(c)
      const ctx = c.getContext('2d')!
      const fg = getComputedStyle(el).color
      const N = 42
      const parts = Array.from({ length: N }, () => ({ x: r.left + Math.random() * r.width, y: r.top + r.height * 0.5, vx: (Math.random() - 0.5) * 9, vy: -4 - Math.random() * 8, s: 4 + Math.random() * 5, rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3, col: Math.random() < 0.6 ? '#a1ffcb' : fg, life: 1 }))
      let t0 = performance.now()
      const tick = (t: number) => {
        const dt = Math.min((t - t0) / 1000, 0.05); t0 = t
        ctx.clearRect(0, 0, c.width, c.height)
        let alive = 0
        for (const p of parts) {
          p.vy += 22 * dt; p.x += p.vx * 60 * dt; p.y += p.vy * 60 * dt; p.rot += p.vr; p.life -= dt * 0.6
          if (p.life <= 0) continue
          alive++
          ctx.save(); ctx.globalAlpha = Math.min(1, p.life * 2); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.col; ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s); ctx.restore()
        }
        if (alive) requestAnimationFrame(tick); else c.remove()
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.5 })
    io.observe(el)
    return () => io.disconnect()
  }, [fire, reduced])
  return <span ref={ref} className="contents">{children}</span>
}

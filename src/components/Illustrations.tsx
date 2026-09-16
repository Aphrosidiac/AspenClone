import { useEffect, useId, useRef } from 'react'
import { usePrefersReducedMotion } from '../lib/motion'

/**
 * The four procedural line illustrations of the insights section, re-drawn from the reference's SVG
 * structure (800×800, currentColor strokes) and animated with rAF only while on screen.
 */
function useAnimationFrame(ref: React.RefObject<SVGSVGElement | null>, draw: (t: number) => void) {
  const reduced = usePrefersReducedMotion()
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced) { draw(0); return }
    let raf = 0, running = false
    const t0 = performance.now()
    const loop = (now: number) => { if (!running) return; draw((now - t0) / 1000); raf = requestAnimationFrame(loop) }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !running) { running = true; raf = requestAnimationFrame(loop) } else if (!e.isIntersecting) { running = false; cancelAnimationFrame(raf) } })
    io.observe(el)
    return () => { running = false; cancelAnimationFrame(raf); io.disconnect() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced])
}

const fill = { transformBox: 'fill-box', transformOrigin: '50% 50%' } as const

/** 01 — a rotating dashed ring, two side circles and a torus of 12 sliding ellipses. */
export function Illustration1({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null)
  const N = 12
  useAnimationFrame(ref, (t) => {
    const svg = ref.current!
    ;(svg.querySelector('[data-ring]') as SVGElement).style.transform = `rotate(${(t * 12) % 360}deg)`
    svg.querySelectorAll<SVGEllipseElement>('[data-e]').forEach((e, i) => {
      const a = t * 0.9 + (i * Math.PI * 2) / N
      const c = Math.cos(a)
      const rx = Math.max(0.5, 200 * Math.abs(c))
      e.setAttribute('rx', rx.toFixed(3))
      e.setAttribute('stroke-opacity', (1 - Math.pow(Math.abs(c), 10)).toFixed(4))
      e.style.transform = `translateX(${(200 * c).toFixed(3)}px)`
    })
  })
  return (
    <svg ref={ref} aria-label="Brand websites animation" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle data-ring cx="400" cy="400" r="398.5" strokeDasharray="4 7" strokeWidth="4" style={fill} />
      <circle cx="200" cy="400" r="199.5" strokeWidth="1.5" />
      <circle cx="600" cy="400" r="199.5" strokeWidth="1.5" />
      {Array.from({ length: N }, (_, i) => (<ellipse key={i} data-e cx="400" cy="400" rx="200" ry="200" strokeOpacity="0" style={fill} />))}
    </svg>
  )
}

/** 02 — a globe of meridians inside a breathing box; the box and its rails are dashed outside the circle. */
export function Illustration2({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null)
  const id = useId().replace(/:/g, '')
  const N = 7
  useAnimationFrame(ref, (t) => {
    const svg = ref.current!
    const sy = 1 + 0.125 * (1 + Math.sin(t * 0.8))
    svg.querySelectorAll<SVGElement>('[data-box]').forEach((r) => { r.style.transform = `scaleY(${sy.toFixed(4)})` })
    svg.querySelectorAll<SVGElement>('[data-top]').forEach((r) => { r.style.transform = `translateY(${(-150 * (sy - 1) * 4).toFixed(2)}px)` })
    svg.querySelectorAll<SVGElement>('[data-bottom]').forEach((r) => { r.style.transform = `translateY(${(150 * (sy - 1) * 4).toFixed(2)}px)` })
    svg.querySelectorAll<SVGEllipseElement>('[data-m]').forEach((e, i) => {
      const a = t * 0.6 + (i * Math.PI) / N
      const c = Math.cos(a)
      e.setAttribute('rx', Math.max(0.5, 390 * Math.abs(c)).toFixed(3))
      e.setAttribute('stroke-opacity', (1 - Math.pow(Math.abs(c), 6)).toFixed(4))
    })
  })
  return (
    <svg ref={ref} aria-label="Web apps and dashboards animation" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" fill="none" strokeWidth="2" stroke="currentColor" className={className}>
      <mask id={`${id}-m1`}><circle cx="400" cy="400" r="390" fill="#fff" /></mask>
      <g mask={`url(#${id}-m1)`}>
        <rect data-box y="100" width="800" height="600" style={fill} />
        <path data-top d="M0,300 800,300" style={fill} />
        <path data-bottom d="M0,500 800,500" style={fill} />
      </g>
      <mask id={`${id}-m2`}><rect width="800" height="800" fill="#fff" /><circle cx="400" cy="400" r="390" fill="#000" /></mask>
      <g mask={`url(#${id}-m2)`} strokeDasharray="4 7" strokeWidth="4">
        <rect data-box y="100" width="800" height="600" style={fill} />
        <path data-top d="M0,300 800,300" style={fill} />
        <path data-bottom d="M0,500 800,500" style={fill} />
      </g>
      <circle cx="400" cy="400" r="390" />
      {Array.from({ length: N }, (_, i) => (<ellipse key={i} data-m cx="400" cy="400" rx="195" ry="390" strokeOpacity="1" />))}
    </svg>
  )
}

/** 03 — 48 dashed rays whose lengths breathe around the ring, the whole starburst slowly turning. */
export function Illustration3({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null)
  const N = 48
  useAnimationFrame(ref, (t) => {
    const svg = ref.current!
    svg.style.transform = `rotate(${(-t * 6) % 360}deg)`
    svg.querySelectorAll<SVGPathElement>('[data-ray]').forEach((p, i) => {
      const a = (i / N) * Math.PI * 2
      const R = 358 + 25 * Math.cos(a * 1 - t * 0.9) + 8 * Math.sin(a * 3 + t * 1.3)
      const x1 = 400 + 20 * Math.cos(a), y1 = 400 + 20 * Math.sin(a)
      const x2 = 400 + R * Math.cos(a + 0.12 * Math.sin(t * 0.5)), y2 = 400 + R * Math.sin(a + 0.12 * Math.sin(t * 0.5))
      p.setAttribute('d', `M${x1.toFixed(2)},${y1.toFixed(2)} ${x2.toFixed(2)},${y2.toFixed(2)}`)
    })
  })
  return (
    <svg ref={ref} aria-label="Automation and AI animation" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="4 6" className={className} style={{ transformOrigin: '50% 50%' }}>
      <circle cx="400" cy="400" r="399" strokeDasharray="none" />
      {Array.from({ length: N }, (_, i) => (<path key={i} data-ray d="M420,400 760,400" />))}
    </svg>
  )
}

/** 04 — three rings: two dashed ones drift on opposite orbits carrying a square each; a solid one sits centred. */
export function Illustration4({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null)
  useAnimationFrame(ref, (t) => {
    const svg = ref.current!
    const a = t * 0.5
    ;(svg.querySelector('[data-g1]') as SVGElement).style.transform = `translate(${(60 * Math.cos(a)).toFixed(2)}px, ${(60 * Math.sin(a)).toFixed(2)}px)`
    ;(svg.querySelector('[data-g3]') as SVGElement).style.transform = `translate(${(-60 * Math.cos(a)).toFixed(2)}px, ${(-60 * Math.sin(a)).toFixed(2)}px)`
    svg.querySelector('[data-s1]')!.setAttribute('transform', `rotate(${(t * 20) % 360} 400 400)`)
    svg.querySelector('[data-s3]')!.setAttribute('transform', `rotate(${(-t * 14) % 360} 400 400)`)
  })
  return (
    <svg ref={ref} aria-label="Care and hosting animation" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" overflow="visible" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <g data-g1 style={fill}><circle cx="400" cy="400" r="330" strokeDasharray="4 7" strokeWidth="4" /><path data-s1 d="M60,400v20h20v-20z" fill="currentColor" /></g>
      <g><circle cx="400" cy="400" r="330" /><path d="M380,400v20h20v-20z" fill="currentColor" /></g>
      <g data-g3 style={fill}><circle cx="400" cy="400" r="330" strokeDasharray="4 7" strokeWidth="4" /><path data-s3 d="M720,400v20h20v-20z" fill="currentColor" /></g>
    </svg>
  )
}

export const ILLUSTRATIONS = [Illustration1, Illustration2, Illustration3, Illustration4]

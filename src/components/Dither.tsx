import { useEffect, useRef, useState } from 'react'
import { cx } from '../lib/cx'
import { DitherField, type DitherOptions } from '../gl/dither'

/** Lazy WebGL dither background. Mounts within 1200px of the viewport, renders only while visible. */
export function Dither({ className, options }: { className?: string; options?: DitherOptions }) {
  const ref = useRef<HTMLDivElement>(null)
  const [near, setNear] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); io.disconnect() } }, { rootMargin: '1200px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  useEffect(() => {
    const el = ref.current
    if (!el || !near) return
    let field: DitherField | null = null
    try { field = new DitherField(el, options) } catch { return }
    const f = field
    let inView = true, visible = !document.hidden
    const sync = () => { if (inView && visible) f.start(); else f.stop() }
    const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; sync() }, { threshold: 0 })
    io.observe(el)
    const onVis = () => { visible = !document.hidden; sync() }
    document.addEventListener('visibilitychange', onVis)
    sync()
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', onVis); f.dispose() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [near])
  return (
    <div className={cx('vt-exclude size-full', className)}>
      <div ref={ref} className="relative z-0 size-full select-none overflow-hidden" style={{ backgroundColor: options?.bgColor ?? '#e0e0e0', pointerEvents: 'auto' }} />
    </div>
  )
}

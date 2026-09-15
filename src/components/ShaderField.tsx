import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { ShaderField, type FieldEntry } from '../gl/shaderField'
import { cx } from '../lib/cx'
import { useIsTouchDevice, usePrefersReducedMotion } from '../lib/motion'

const Ctx = createContext<ShaderField | null>(null)

/**
 * Hosts one canvas (fixed or absolute) that draws every `ShaderImage` registered beneath it.
 * `position: fixed` + z-index -1 inside a stacking context sits behind the cards' chrome but above the page.
 */
export function ShaderCanvas({ children, position = 'fixed', zIndex = -1, className }: { children: ReactNode; position?: 'fixed' | 'absolute'; zIndex?: number; className?: string }) {
  const host = useRef<HTMLDivElement>(null)
  const [field, setField] = useState<ShaderField | null>(null)
  const reduced = usePrefersReducedMotion()
  const touch = useIsTouchDevice()
  useEffect(() => {
    const el = host.current
    if (!el) return
    let f: ShaderField
    try { f = new ShaderField(el) } catch { return }
    setField(f)
    let visible = !document.hidden
    const sync = () => { if (visible) f.start(); else f.stop() }
    const onVis = () => { visible = !document.hidden; sync() }
    document.addEventListener('visibilitychange', onVis)
    sync()
    return () => { document.removeEventListener('visibilitychange', onVis); f.dispose(); setField(null) }
  }, [])
  const style: CSSProperties = { position, inset: 0, zIndex, pointerEvents: 'none' }
  return (
    <Ctx.Provider value={reduced || touch ? null : field}>
      {children}
      <div className={cx('!border-0', className)} style={style} aria-hidden="true">
        <div ref={host} style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }} />
      </div>
    </Ctx.Provider>
  )
}

/** An <img> that the nearest ShaderCanvas takes over once its texture is ready (the img then hides). */
export function ShaderImage({ src, alt = '', className, width, height, sizes }: { src: string; alt?: string; className?: string; width?: number; height?: number; sizes?: string }) {
  const field = useContext(Ctx)
  const ref = useRef<HTMLImageElement>(null)
  const [ready, setReady] = useState(false)
  useLayoutEffect(() => {
    if (!field || !ref.current) return
    const entry: FieldEntry = { src, getRect: () => ref.current?.getBoundingClientRect() ?? null, onReady: () => setReady(true) }
    const remove = field.add(entry)
    return () => { remove(); setReady(false) }
  }, [field, src])
  return <img ref={ref} src={src} alt={alt} width={width} height={height} sizes={sizes} className={cx('max-w-full size-full object-cover', className)} style={ready ? { opacity: 0 } : undefined} />
}

import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { ShaderField, type FieldEntry } from '../gl/shaderField'
import { cx } from '../lib/cx'
import { useIsTouchDevice, usePrefersReducedMotion } from '../lib/motion'

const Ctx = createContext<ShaderField | null>(null)
const HostCtx = createContext<{ host: React.RefObject<HTMLDivElement | null> } | null>(null)

/**
 * Provides one WebGL canvas for every `ShaderImage` beneath it. Place `<ShaderCanvasHost/>` where the canvas
 * element must live in the DOM (the reference keeps it inside the slider's own stacking context, z-index -1,
 * so it paints above overlapping sections but below the cards' chrome).
 */
export function ShaderCanvas({ children }: { children: ReactNode }) {
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
  return (
    <HostCtx.Provider value={{ host }}>
      <Ctx.Provider value={reduced || touch ? null : field}>{children}</Ctx.Provider>
    </HostCtx.Provider>
  )
}

export function ShaderCanvasHost({ position = 'fixed', zIndex = -1, className }: { position?: 'fixed' | 'absolute'; zIndex?: number; className?: string }) {
  const ctx = useContext(HostCtx)
  const style: CSSProperties = { position, inset: 0, zIndex, pointerEvents: 'none' }
  return (
    <div className={cx('!border-0', className)} style={style} aria-hidden="true">
      <div ref={ctx?.host} style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }} />
    </div>
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

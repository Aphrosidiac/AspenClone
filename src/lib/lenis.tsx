import Lenis from 'lenis'
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'

const Ctx = createContext<Lenis | null>(null)

/** Smooth scroll, as the reference (html.lenis). Exposes the instance so modals can stop/start it. */
export function LenisProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const raf = useRef(0)
  useEffect(() => {
    const l = new Lenis({ lerp: 0.1, wheelMultiplier: 1, autoRaf: false, anchors: { offset: 0 } })
    const loop = (t: number) => { l.raf(t); raf.current = requestAnimationFrame(loop) }
    raf.current = requestAnimationFrame(loop)
    setLenis(l)
    return () => { cancelAnimationFrame(raf.current); l.destroy() }
  }, [])
  return <Ctx.Provider value={lenis}>{children}</Ctx.Provider>
}
export const useLenis = () => useContext(Ctx)

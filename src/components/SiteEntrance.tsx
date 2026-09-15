import { animate, motion, useMotionValue } from 'motion/react'
import { useEffect, useState } from 'react'
import { useIntro } from '../lib/intro'
import { EASE_IN_OUT, usePrefersReducedMotion } from '../lib/motion'
import { Mark } from './Logo'

/**
 * Entrance, measured frame-by-frame on the reference (docs/reference/2026-09-15/entrance_rec.json):
 *   phase 1 — 0.8 s, ease-in-out(.87,0,.13,1): outer wrapper opacity 0→1 and scale .4→1
 *   phase 2 — 1.2 s, same ease, both at once: inner wrapper scale .3→1 (the mark grows to the background
 *             logo's full size, min(72vw,44rem)) while the black overlay wipes off to the left
 *             (clip-path inset(0) → inset(0 100% 0 0)); the overlay is removed when the wipe ends.
 * The mark inside is the site background logo itself, so the wipe reveals the page with the coin already in place.
 */
export function SiteEntrance() {
  const { done, finish } = useIntro()
  const reduced = usePrefersReducedMotion()
  const outerOpacity = useMotionValue(0)
  const outerScale = useMotionValue(0.4)
  const innerScale = useMotionValue(0.3)
  const clip = useMotionValue('inset(0% 0% 0% 0%)')
  const [gone, setGone] = useState(done)
  useEffect(() => {
    document.getElementById('pre-entrance')?.remove()
    if (done) { setGone(true); return }
    let cancelled = false
    const run = async () => {
      if (reduced) { finish(); setGone(true); return }
      await new Promise<void>((r) => { if (document.readyState === 'complete') r(); else addEventListener('load', () => r(), { once: true }) })
      await new Promise((r) => setTimeout(r, 300))
      if (cancelled) return
      await Promise.all([
        animate(outerOpacity, 1, { duration: 0.8, ease: EASE_IN_OUT }),
        animate(outerScale, 1, { duration: 0.8, ease: EASE_IN_OUT }),
      ])
      if (cancelled) return
      setTimeout(() => finish(), 450)
      await Promise.all([
        animate(innerScale, 1, { duration: 1.2, ease: EASE_IN_OUT }),
        animate(clip, 'inset(0% 100% 0% 0%)', { duration: 1.2, ease: EASE_IN_OUT }),
      ])
      if (!cancelled) setGone(true)
    }
    run()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  if (gone) return null
  return (
    <motion.div className="fixed inset-0 isolate z-3 bg-black" style={{ clipPath: clip }} aria-hidden="true">
      <motion.div data-outer className="fixed inset-0 origin-center" style={{ opacity: outerOpacity, scale: outerScale }}>
        <motion.div data-inner className="fixed inset-0 origin-center" style={{ scale: innerScale }}>
          <div className="pointer-events-none fixed inset-0 z-1 flex h-svh items-center justify-center pr-(--sbw)">
            <div className="perspective-[1000px]">
              <div className="vt-exclude transform-3d origin-center" style={{ transform: 'translateZ(1px)' }}>
                <Mark className="h-auto w-[min(72vw,44rem)] max-w-full text-grey" />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

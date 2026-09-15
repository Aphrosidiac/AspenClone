import { motion, useAnimate } from 'motion/react'
import { useEffect, useState } from 'react'
import { useIntro } from '../lib/intro'
import { EASE_IN_OUT, EASE_OUT, usePrefersReducedMotion } from '../lib/motion'
import { Mark } from './Logo'

/**
 * Entrance: black overlay (z-3). The mark fades/scales in (outer .4→1, inner .3→1) over ~2 s once the
 * document has loaded, holds, then the overlay wipes off to the left (`clip-path: inset(0) → inset(0 100% 0 0)`).
 */
export function SiteEntrance() {
  const { done, finish } = useIntro()
  const reduced = usePrefersReducedMotion()
  const [scope, animate] = useAnimate()
  const [gone, setGone] = useState(done)
  useEffect(() => {
    if (done) { setGone(true); return }
    let cancelled = false
    const run = async () => {
      if (reduced) { finish(); setGone(true); return }
      await new Promise<void>((r) => { if (document.readyState === 'complete') r(); else addEventListener('load', () => r(), { once: true }) })
      await new Promise((r) => setTimeout(r, 250))
      if (cancelled) return
      await Promise.all([
        animate('[data-outer]', { opacity: 1, scale: 1 }, { duration: 1.6, ease: EASE_OUT }),
        animate('[data-inner]', { scale: 1 }, { duration: 2, ease: EASE_OUT }),
      ])
      await new Promise((r) => setTimeout(r, 350))
      if (cancelled) return
      const wipe = animate(scope.current, { clipPath: 'inset(0 100% 0 0)' }, { duration: 1.1, ease: EASE_IN_OUT })
      setTimeout(() => finish(), 500)
      await wipe
      if (!cancelled) setGone(true)
    }
    run()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  if (gone) return null
  return (
    <div ref={scope} className="fixed inset-0 isolate z-3 bg-black" style={{ clipPath: 'inset(0%)' }} aria-hidden="true">
      <motion.div data-outer className="fixed inset-0 origin-center flex items-center justify-center" initial={{ opacity: 0, scale: 0.4 }}>
        <motion.div data-inner className="origin-center" initial={{ scale: 0.3 }}>
          <Mark className="h-auto w-[min(20vw,7rem)] text-[#6a6a6a]" />
        </motion.div>
      </motion.div>
    </div>
  )
}

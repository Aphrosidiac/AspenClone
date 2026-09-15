import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import { useIntro } from '../lib/intro'
import { EASE_OUT, usePrefersReducedMotion } from '../lib/motion'

/** Each letter rolls up out of a clipped box with a stagger — the banner's word reveal. */
export function WordOdometer({ children, delay = 0 }: { children: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const { done } = useIntro()
  const reduced = usePrefersReducedMotion()
  const on = (done && inView) || reduced
  return (
    <span ref={ref} className="relative inline-block overflow-clip">
      <span className="block">
        {children.split('').map((ch, i) => (
          <motion.span key={i} className="inline-block" initial={reduced ? false : { y: '110%' }} animate={on ? { y: 0 } : { y: '110%' }} transition={{ duration: 1, ease: EASE_OUT, delay: delay + i * 0.04 }}>{ch}</motion.span>
        ))}
      </span>
    </span>
  )
}

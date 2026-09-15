import { motion, useInView } from 'motion/react'
import { useLayoutEffect, useRef, useState, type ElementType } from 'react'
import { cx } from '../lib/cx'
import { useIntro } from '../lib/intro'
import { EASE_OUT, usePrefersReducedMotion } from '../lib/motion'
import { fontsReady } from '../lib/fonts'

/**
 * Lines of uppercase display type sized so the widest line exactly fills the container (`@container` + cqw),
 * alternating left/right alignment; each line rises out of an overflow-hidden wrapper on reveal.
 * (The reference's `ContainFitLinesText`: measured 22.09cqw for "placing/winners." and 15.85cqw for the insights h2.)
 */
export function ContainFit({ as: Tag = 'p', lines, className, lineClassName = 'text-headline-50', viewport = true, delay = 0, stagger = 0.1 }: { as?: ElementType; lines: string[]; className?: string; lineClassName?: string; viewport?: boolean; delay?: number; stagger?: number }) {
  const ref = useRef<HTMLElement>(null)
  const [cqw, setCqw] = useState<number | null>(null)
  const { done } = useIntro()
  const reduced = usePrefersReducedMotion()
  const inView = useInView(ref, { once: true, amount: 0.2 })
  const reveal = done && (!viewport || inView)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const probe = document.createElement('span')
      probe.className = cx('block whitespace-nowrap antialiased', lineClassName)
      probe.style.cssText = 'position:absolute;visibility:hidden;font-size:100px;left:0;top:0;text-transform:uppercase;letter-spacing:-0.04em'
      el.appendChild(probe)
      let max = 1
      for (const l of lines) { probe.textContent = l; max = Math.max(max, probe.getBoundingClientRect().width) }
      probe.remove()
      setCqw(10000 / max)
    }
    let ready = false
    fontsReady().then(() => { ready = true; measure() })
    const ro = new ResizeObserver(() => { if (ready) measure() }); ro.observe(el)
    return () => ro.disconnect()
  }, [lines, lineClassName])
  return (
    <Tag ref={ref} className={cx('@container relative flex w-full min-w-0 flex-col gap-8 uppercase', className)}>
      {lines.map((l, i) => (
        <span key={i} className={cx('block w-max max-w-full overflow-hidden', i % 2 === 0 ? 'mr-auto' : 'ml-auto')}>
          <motion.span className={cx('block whitespace-nowrap leading-[0.82] antialiased', lineClassName)} style={{ fontSize: cqw ? `${cqw.toFixed(4)}cqw` : undefined, visibility: cqw ? undefined : 'hidden' }}
            initial={reduced ? false : { opacity: 0, y: '100%' }} animate={reveal || reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: '100%' }} transition={{ duration: 1.2, ease: EASE_OUT, delay: delay + i * stagger }}>
            {l}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

import { motion, useInView } from 'motion/react'
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ElementType } from 'react'
import { cx } from '../lib/cx'
import { useIntro } from '../lib/intro'
import { EASE_OUT, usePrefersReducedMotion } from '../lib/motion'

/**
 * Line-split text reveal (the reference's `AnimatedText` / `data-split="lines"`).
 * Words are measured in place, grouped into lines, and each line rises out of a clipped mask.
 * Resting state is plain text: if the split never runs, the text is still visible.
 */
type Props = {
  as?: ElementType
  text: string
  className?: string
  style?: CSSProperties
  /** false = reveal as soon as the entrance is done; otherwise reveal when scrolled into view (once) */
  viewport?: false | { margin?: string; amount?: number }
  delay?: number
  stagger?: number
  duration?: number
  /** continue a stagger started by a previous block */
  lineOffset?: number
  onLines?: (n: number) => void
  /** render lines without animating (used when content swaps under an already-revealed block) */
  immediate?: boolean
  id?: string
}

function splitIntoLines(el: HTMLElement, text: string): string[] {
  // Measure inside a throwaway absolutely-positioned child so React's own children are never touched.
  const probe = document.createElement('span')
  probe.setAttribute('aria-hidden', 'true')
  probe.style.cssText = `position:absolute;left:0;top:0;visibility:hidden;pointer-events:none;display:block;width:${el.getBoundingClientRect().width}px;white-space:normal`
  const paragraphs = text.split('\n')
  // words are split after soft hyphens too, so a browser break inside "venture-backed" groups correctly
  const wordEls: Array<{ span: HTMLSpanElement; para: number; word: string; glue: boolean }> = []
  paragraphs.forEach((p, pi) => {
    const words = p.split(/\s+/).filter(Boolean)
    words.forEach((w, wi) => {
      const parts = w.split(/(?<=-)(?=.)/)
      parts.forEach((part, k) => {
        const span = document.createElement('span')
        span.textContent = part + (k === parts.length - 1 && wi < words.length - 1 ? ' ' : '')
        probe.appendChild(span)
        wordEls.push({ span, para: pi, word: part, glue: k > 0 })
      })
    })
    if (pi < paragraphs.length - 1) probe.appendChild(document.createElement('br'))
  })
  const prevPos = el.style.position
  if (getComputedStyle(el).position === 'static') el.style.position = 'relative'
  el.appendChild(probe)
  const lines: string[] = []
  let curTop: number | null = null, curPara = -1, cur = ''
  for (const { span, para, word, glue } of wordEls) {
    const top = span.offsetTop
    if (curTop === null || para !== curPara || Math.abs(top - curTop) > 1) {
      if (cur) lines.push(cur)
      cur = word; curTop = top; curPara = para
    } else cur += (glue ? '' : ' ') + word
  }
  if (cur) lines.push(cur)
  probe.remove()
  el.style.position = prevPos
  return lines
}

export function AnimatedText({ as: Tag = 'span', text, className, style, viewport = { margin: '0px 0px -10% 0px', amount: 0 }, delay = 0, stagger = 0.08, duration = 1.2, lineOffset = 0, onLines, immediate = false, id }: Props) {
  const ref = useRef<HTMLElement>(null)
  const [lines, setLines] = useState<string[] | null>(null)
  const [done, setDone] = useState(false)
  const reduced = usePrefersReducedMotion()
  const { done: introDone } = useIntro()
  const inView = useInView(ref, viewport === false ? { once: true } : { once: true, margin: viewport.margin as never, amount: viewport.amount ?? 0 })
  const shouldReveal = introDone && (viewport === false || inView)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    let cancelled = false
    const run = () => {
      if (cancelled || !ref.current) return
      const l = splitIntoLines(ref.current, text)
      setLines(l)
      onLines?.(l.length)
    }
    document.fonts?.ready.then(run)
    const ro = new ResizeObserver(() => {
      // re-split when the block width changes (a modal opening, a viewport resize)
      run()
    })
    ro.observe(el)
    return () => { cancelled = true; ro.disconnect() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  useEffect(() => { if (immediate || reduced) setDone(true) }, [immediate, reduced])

  const total = (lines?.length ?? 0) + lineOffset
  useEffect(() => {
    if (!shouldReveal || !lines) return
    const t = setTimeout(() => setDone(true), (delay + (total - 1) * stagger + duration) * 1000 + 50)
    return () => clearTimeout(t)
  }, [shouldReveal, lines, delay, total, stagger, duration])

  const animateNow = shouldReveal && !reduced && !immediate
  const resting = done || reduced || immediate

  return (
    <Tag ref={ref} id={id} className={cx('inline-block', className)} style={{ ...style, ['--lines' as string]: lines?.length ?? 0 }} data-split={lines ? 'lines' : undefined}>
      {lines === null ? (
        <span style={{ visibility: 'hidden' }} aria-hidden="true">{text.split('\n').map((p, i, a) => (<span key={i}>{p}{i < a.length - 1 && <br />}</span>))}</span>
      ) : (
        lines.map((line, i) => (
          <span key={i} data-mask={i} style={{ display: 'block', position: 'relative', clipPath: resting ? 'none' : 'inset(-0.15em 0 -0.15em 0)' }}>
            <motion.span
              data-line={i}
              translate="no"
              style={{ display: 'block', position: 'relative', whiteSpace: 'nowrap' }}
              initial={resting ? false : { y: '100%', opacity: 0 }}
              animate={animateNow || resting ? { y: 0, opacity: 1 } : { y: '100%', opacity: 0 }}
              transition={{ duration, ease: EASE_OUT, delay: delay + (i + lineOffset) * stagger }}
            >
              {line}
            </motion.span>
          </span>
        ))
      )}
    </Tag>
  )
}

/** A stack of paragraphs (`gap-[1em]`) that share one reveal and one continuous stagger. */
export function AnimatedParagraphs({ paragraphs, className, itemClassName, viewport, delay = 0, as: Tag = 'div', itemAs = 'div', immediate }: { paragraphs: string[]; className?: string; itemClassName?: string; viewport?: Props['viewport']; delay?: number; as?: ElementType; itemAs?: ElementType; immediate?: boolean }) {
  const [counts, setCounts] = useState<number[]>(() => paragraphs.map(() => 0))
  const offsets = counts.reduce<number[]>((acc, _n, i) => { acc.push(i === 0 ? 0 : acc[i - 1] + counts[i - 1]); return acc }, [])
  return (
    <Tag className={cx('flex w-full flex-col gap-[1em]', className)}>
      {paragraphs.map((p, i) => (
        p === '' ? <div key={i} className="empty:hidden" data-text="true" /> : (
          <AnimatedText key={i} as={itemAs} text={p} className={cx('block', itemClassName)} viewport={viewport} delay={delay} lineOffset={offsets[i]} immediate={immediate}
            onLines={(count) => setCounts((c) => (c[i] === count ? c : c.map((v, j) => (j === i ? count : v))))} />
        )
      ))}
    </Tag>
  )
}

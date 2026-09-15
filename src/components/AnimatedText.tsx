import { motion, useInView } from 'motion/react'
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ElementType } from 'react'
import { cx } from '../lib/cx'
import { useIntro } from '../lib/intro'
import { EASE_OUT, usePrefersReducedMotion } from '../lib/motion'
import { fontsReady } from '../lib/fonts'

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
  /** keep the line masks clipped at rest so an AnimatePresence exit (lines rising out) stays masked */
  keepMask?: boolean
}

function splitIntoLines(el: HTMLElement, text: string): string[] {
  // Measure inside a throwaway absolutely-positioned child so React's own children are never touched.
  // The text is laid out as ONE text node per paragraph (so shaping/kerning matches the real render) and
  // word positions are read back through Ranges; a word the browser breaks at a hyphen is split there.
  const probe = document.createElement('span')
  probe.setAttribute('aria-hidden', 'true')
  probe.style.cssText = `position:absolute;left:0;top:0;visibility:hidden;pointer-events:none;display:block;width:${el.getBoundingClientRect().width}px;white-space:normal`
  const paragraphs = text.split('\n')
  const nodes: Text[] = []
  paragraphs.forEach((p, pi) => {
    const t = document.createTextNode(p)
    probe.appendChild(t); nodes.push(t)
    if (pi < paragraphs.length - 1) probe.appendChild(document.createElement('br'))
  })
  const prevPos = el.style.position
  if (getComputedStyle(el).position === 'static') el.style.position = 'relative'
  el.appendChild(probe)
  const lines: string[] = []
  const range = document.createRange()
  const topOf = (node: Text, a: number, b: number) => { range.setStart(node, a); range.setEnd(node, b); const r = range.getClientRects(); return r.length ? Array.from(r).map((x) => x.top) : [0] }
  nodes.forEach((node) => {
    const p = node.data
    let curTop: number | null = null
    let cur = ''
    const re = /\S+/g
    let m: RegExpExecArray | null
    while ((m = re.exec(p))) {
      const word = m[0], a = m.index, b = a + word.length
      // pieces: the whole word, or the fragments the browser actually broke it into (soft hyphens, dashes, …)
      const pieces: Array<{ s: number; e: number; glue: boolean }> = []
      const tops = topOf(node, a, b)
      if (tops.length > 1) {
        let ps = 0
        let lastTop = topOf(node, a, a + 1)[0]
        for (let i = 1; i < word.length; i++) {
          const t = topOf(node, a + i, a + i + 1)[0]
          if (Math.abs(t - lastTop) > 1) { pieces.push({ s: ps, e: i, glue: ps > 0 }); ps = i; lastTop = t }
        }
        pieces.push({ s: ps, e: word.length, glue: ps > 0 })
      } else pieces.push({ s: 0, e: word.length, glue: false })
      for (const pc of pieces) {
        const top = topOf(node, a + pc.s, a + pc.e)[0]
        const frag = word.slice(pc.s, pc.e)
        if (curTop === null || Math.abs(top - curTop) > 1) { if (cur) lines.push(cur); cur = frag; curTop = top }
        else cur += (pc.glue ? '' : ' ') + frag
      }
    }
    if (cur) lines.push(cur)
  })
  probe.remove()
  el.style.position = prevPos
  return lines
}

export function AnimatedText({ as: Tag = 'span', text, className, style, viewport = { margin: '0px', amount: 0 }, delay = 0, stagger = 0.065, duration = 1, lineOffset = 0, onLines, immediate = false, id, keepMask = false }: Props) {
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
    let ready = false
    const run = () => {
      if (cancelled || !ready || !ref.current) return
      const l = splitIntoLines(ref.current, text)
      setLines((prev) => (prev && prev.length === l.length && prev.every((x, i) => x === l[i]) ? prev : l))
      onLines?.(l.length)
    }
    // never split before the webfont is in: a fallback-metric split shrinks the box and can never recover
    fontsReady().then(() => { ready = true; run() })
    const ro = new ResizeObserver(() => run())
    ro.observe(el)
    return () => { cancelled = true; ro.disconnect() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  useEffect(() => { if (immediate || reduced) setDone(true) }, [immediate, reduced])

  const total = (lines?.length ?? 0) + lineOffset
  useEffect(() => {
    if (!shouldReveal || !lines) return
    const t = setTimeout(() => setDone(true), (delay + (total - 1) * stagger + duration) * 1000 + 1400)
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
          <span key={i} data-mask={i} style={{ display: 'block', position: 'relative', clipPath: resting && !keepMask ? 'none' : 'inset(-0.25em 0px)' }}>
            <motion.span
              data-line={i}
              translate="no"
              style={{ display: 'block', position: 'relative', whiteSpace: 'nowrap' }}
              initial={resting ? false : { y: '100%', opacity: 0 }}
              animate={animateNow || resting ? { y: 0, opacity: 1 } : { y: '100%', opacity: 0 }}
              exit={{ y: '-100%', opacity: 0, transition: { duration: 0.6, ease: EASE_OUT, delay: (i + lineOffset) * 0.03 } }}
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
export function AnimatedParagraphs({ paragraphs, className, itemClassName, viewport, delay = 0, as: Tag = 'div', itemAs = 'div', immediate, keepMask }: { paragraphs: string[]; className?: string; itemClassName?: string; viewport?: Props['viewport']; delay?: number; as?: ElementType; itemAs?: ElementType; immediate?: boolean; keepMask?: boolean }) {
  const [counts, setCounts] = useState<number[]>(() => paragraphs.map(() => 0))
  const offsets = counts.reduce<number[]>((acc, _n, i) => { acc.push(i === 0 ? 0 : acc[i - 1] + counts[i - 1]); return acc }, [])
  return (
    <Tag className={cx('flex w-full flex-col gap-[1em]', className)}>
      {paragraphs.map((p, i) => (
        p === '' ? <div key={i} className="empty:hidden" data-text="true" /> : (
          <AnimatedText key={i} as={itemAs} text={p} className={cx('block', itemClassName)} viewport={viewport} delay={delay} lineOffset={offsets[i]} immediate={immediate} keepMask={keepMask}
            onLines={(count) => setCounts((c) => (c[i] === count ? c : c.map((v, j) => (j === i ? count : v))))} />
        )
      ))}
    </Tag>
  )
}

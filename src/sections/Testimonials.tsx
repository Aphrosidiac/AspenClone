import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { testimonials } from '../data/site'
import { AnimatedParagraphs } from '../components/AnimatedText'
import { buttonClass } from '../components/Button'
import { Dither } from '../components/Dither'
import { Eyebrow } from '../components/Eyebrow'
import { ArrowIcon, QuoteIcon } from '../components/Logo'
import { Odometer } from '../components/Odometer'
import { EASE_OUT } from '../lib/motion'
import { cx } from '../lib/cx'

const n = testimonials.length
const INTERVAL = 6.7

function shuffle<T>(a: T[]) { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]] } return r }

function Controls({ tick, onPrev, onNext, className }: { tick: number; onPrev: () => void; onNext: () => void; className?: string }) {
  return (
    <div className={cx('relative grid grid-cols-2', className)}>
      <button type="button" aria-label="Previous testimonial" onClick={onPrev} className={buttonClass({ variant: 'bg', size: 'lg', origin: 'right', className: 'flex w-full justify-center' })}>
        <ArrowIcon left className="pointer-events-none relative z-1" />
      </button>
      <button type="button" aria-label="Next testimonial" onClick={onNext} className={buttonClass({ variant: 'bg', size: 'lg', origin: 'left', className: 'flex w-full justify-center border-l' })}>
        <ArrowIcon className="pointer-events-none relative z-1" />
      </button>
      <div key={tick} aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-1 h-4 origin-left bg-theme-fg motion-reduce:transition-none" style={{ transform: 'scaleX(0)', animation: `testimonial-bar ${INTERVAL}s linear forwards` }} />
    </div>
  )
}

function Counter({ index }: { index: number }) {
  return (
    <div className="flex items-center gap-[1ch] font-mono text-caption-10 tabular-nums opacity-50">
      <Odometer value={String(index + 1).padStart(2, '0')} />
      <span aria-hidden="true">-</span>
      <span>{String(n).padStart(2, '0')}</span>
    </div>
  )
}

function Portrait({ src, k, className }: { src: string; k: number; className?: string }) {
  return (
    <div className={cx('relative overflow-hidden', className)}>
      <AnimatePresence initial={false}>
        <motion.div key={k} className="absolute inset-0" style={{ clipPath: 'inset(0px)' }} initial={{ clipPath: 'inset(0 0 0 100%)' }} animate={{ clipPath: 'inset(0px)' }} exit={{ clipPath: 'inset(0 100% 0 0)' }} transition={{ duration: 1, ease: EASE_OUT }}>
          <motion.div className="relative size-full" style={{ willChange: 'transform', transformOrigin: 'left center' }} initial={{ scale: 1.2 }} animate={{ scale: 1 }} transition={{ duration: 1.2, ease: EASE_OUT }}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: '109%', height: '109%' }}>
              <picture className="contents"><img alt="" src={src} className="max-w-full size-full object-cover" /></picture>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function Meta({ label, value, k }: { label: string; value: string; k: number }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={k} className="flex flex-col gap-8" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.5, ease: EASE_OUT }}>
        <p className="font-medium text-caption-20">{label}</p>
        <p className="font-mono text-caption-10 uppercase opacity-60">{value}</p>
      </motion.div>
    </AnimatePresence>
  )
}

const NOTE = 'These are fictional people and companies. This is a demonstration site by FF Dev Studio; no testimonial here describes a real engagement.'

function Note({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-8 ${className}`}>
      <p className="font-medium text-caption-20">Note</p>
      <p className="font-mono text-caption-10 uppercase opacity-60 leading-[1.5]">{NOTE}</p>
    </div>
  )
}

function Quote({ t, k, className, iconClassName }: { t: (typeof testimonials)[number]; k: number; className?: string; iconClassName?: string }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={k} className={cx('contents', className)}>
        <motion.div className={iconClassName} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}><QuoteIcon /></motion.div>
        <div>
          <AnimatedParagraphs paragraphs={t.text} className="text-headline-10" viewport={{ margin: '0px', amount: 0 }} keepMask />
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export function Testimonials() {
  // the reference shuffles the deck per visit and auto-advances on a timer; any manual move restarts the timer
  const deck = useMemo(() => shuffle(testimonials), [])
  const [index, setIndex] = useState(0)
  const [tick, setTick] = useState(0)
  const prev = useCallback(() => { setIndex((i) => (i - 1 + n) % n); setTick((t) => t + 1) }, [])
  const next = useCallback(() => { setIndex((i) => (i + 1) % n); setTick((t) => t + 1) }, [])
  const t = deck[index]
  useEffect(() => { for (const x of testimonials) { const im = new Image(); im.src = x.image } }, [])
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setTimeout(() => { setIndex((i) => (i + 1) % n); setTick((x) => x + 1) }, INTERVAL * 1000)
    return () => clearTimeout(id)
  }, [tick])
  return (
    <div id="testimonials" data-page-builder-section="testimonialSection" className="scroll-mt-(--site-header-height)">
      <div>
        {/* mobile */}
        <div className="relative z-1 min-h-[calc(100svh-var(--site-header-height))] flex-col border-t bg-theme-bg flex lg:hidden">
          <div className="flex flex-1 flex-col px-12 py-24">
            <div className="mb-48 flex items-center justify-between"><Eyebrow>Testimonials</Eyebrow><Counter index={index} /></div>
            <div className="mb-64"><Quote t={t} k={index} iconClassName="mb-24" /></div>
            <div className="mt-auto flex items-end justify-between gap-20">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={index} className="flex flex-col gap-8" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.5, ease: EASE_OUT }}>
                  <p>{t.name}</p>
                  {t.role && <p className="font-mono text-caption-10 uppercase opacity-50">{t.role}</p>}
                </motion.div>
              </AnimatePresence>
              <Portrait src={t.image} k={index} className="aspect-square w-100" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-20 bg-theme-fg p-20 text-theme-bg">
            <Meta label="Position" value={t.position} k={index} />
            <Meta label="Company" value={t.company} k={index} />
            <Note className="col-span-2" />
          </div>
          <Controls tick={tick} onPrev={prev} onNext={next} />
        </div>
        {/* desktop */}
        <div className="min-h-[calc(100svh-var(--site-header-height))] grid-cols-4 divide-x hidden lg:grid">
          <div className="relative z-1 grid grid-rows-2 divide-y border-t bg-theme-bg">
            <div className="flex flex-col divide-y">
              <div className="flex-1 p-20"><Eyebrow>Testimonials</Eyebrow></div>
              <Controls tick={tick} onPrev={prev} onNext={next} />
            </div>
            <Portrait src={t.image} k={index} />
          </div>
          <div className="relative z-1 col-span-2 overflow-hidden border-t bg-theme-bg">
            <div className="flex h-full flex-col gap-48 p-20">
              <Quote t={t} k={index} />
              <div className="mt-auto flex items-end justify-between">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={index} className="flex flex-col gap-8" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.5, ease: EASE_OUT }}>
                    <p>{t.name}</p>
                    {t.role && <p className="font-mono text-caption-10 uppercase opacity-50">{t.role}</p>}
                  </motion.div>
                </AnimatePresence>
                <Counter index={index} />
              </div>
            </div>
          </div>
          <div className="grid grid-rows-2 items-start border-t">
            <div className="sticky top-(--site-header-height) z-1 h-full overflow-hidden bg-theme-fg text-theme-bg">
              <div className="flex h-full flex-col gap-20 p-20">
                <Meta label="Position" value={t.position} k={index} />
                <Meta label="Company" value={t.company} k={index} />
                <Note />
              </div>
            </div>
            <div className="relative h-full overflow-hidden"><div className="absolute inset-0"><Dither /></div></div>
          </div>
        </div>
      </div>
    </div>
  )
}

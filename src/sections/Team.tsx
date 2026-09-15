import { useCallback, useEffect, useRef, useState } from 'react'
import { team } from '../data/site'
import { useModal } from '../lib/modal'
import { AnimatedParagraphs, AnimatedText } from '../components/AnimatedText'
import { buttonClass } from '../components/Button'
import { Eyebrow } from '../components/Eyebrow'
import { ArrowIcon } from '../components/Logo'
import { ShaderCanvas, ShaderCanvasHost, ShaderImage } from '../components/ShaderField'
import { useLenis } from '../lib/lenis'
import { cx } from '../lib/cx'

/** Per-card resting offsets (measured in the reference DOM); they ease to 0 as the slider scrolls up. */
const OFFSETS = [20, 55, 35, 70, 40, 25, 60, 45]

export function Team() {
  const { show } = useModal()
  const slider = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  const lenis = useLenis()

  const updateEnds = useCallback(() => {
    const el = slider.current
    if (!el) return
    setAtStart(el.scrollLeft <= 1)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1)
  }, [])
  const by = (dir: 1 | -1) => {
    const el = slider.current
    if (!el) return
    const card = el.firstElementChild as HTMLElement | null
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? el.clientWidth / 4) + 1), behavior: 'smooth' })
  }

  // scroll-linked parallax: offset% × f, f linear in the slider's top edge — measured on the reference at three
  // scroll positions: f = 1 while the row is below the fold, 0 when its top edge passes 5vh, negative above
  useEffect(() => {
    const el = slider.current
    if (!el) return
    const cards = Array.from(el.children).filter((c) => !(c as HTMLElement).hasAttribute('aria-hidden')) as HTMLElement[]
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    const tick = () => {
      const vh = innerHeight
      const top = el.getBoundingClientRect().top
      const f = reduce ? 0 : Math.max(-1, Math.min(1, (top - 0.05 * vh) / (0.95 * vh)))
      cards.forEach((c, i) => { c.style.transform = innerWidth >= 1024 ? `translateY(${(OFFSETS[i % OFFSETS.length] * f).toFixed(2)}%)` : '' })
    }
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(tick) }
    tick()
    addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll)
    lenis?.on('scroll', onScroll)
    return () => { removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); lenis?.off('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [lenis])

  // drag to scroll
  useEffect(() => {
    const el = slider.current
    if (!el) return
    let down = false, startX = 0, startLeft = 0, moved = false
    const onDown = (e: PointerEvent) => { if (innerWidth < 1024 || e.button !== 0) return; down = true; moved = false; startX = e.clientX; startLeft = el.scrollLeft; el.style.scrollSnapType = 'none' }
    const onMove = (e: PointerEvent) => { if (!down) return; const dx = e.clientX - startX; if (Math.abs(dx) > 4) moved = true; el.scrollLeft = startLeft - dx }
    const onUp = () => { if (!down) return; down = false; el.style.scrollSnapType = ''; if (moved) { const stop = (ev: Event) => { ev.stopPropagation(); ev.preventDefault() }; el.addEventListener('click', stop, { capture: true, once: true }) } }
    el.addEventListener('pointerdown', onDown); addEventListener('pointermove', onMove); addEventListener('pointerup', onUp); addEventListener('pointercancel', onUp)
    el.addEventListener('scroll', updateEnds, { passive: true }); updateEnds()
    return () => { el.removeEventListener('pointerdown', onDown); removeEventListener('pointermove', onMove); removeEventListener('pointerup', onUp); removeEventListener('pointercancel', onUp); el.removeEventListener('scroll', updateEnds) }
  }, [updateEnds])

  return (
    <div id="team" data-page-builder-section="teamSection" className="scroll-mt-(--site-header-height)">
      {/* desktop header */}
      <div className="relative z-1 hidden min-h-[calc(100svh-var(--site-header-height))] grid-rows-2 divide-y border-t bg-theme-bg lg:grid">
        <div className="grid grid-cols-2 divide-x">
          <div className="px-20"><h2 className="sticky top-(--site-header-height) w-fit py-20 text-headline-50"><AnimatedText text={team.title} /></h2></div>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
            <div className="flex items-end p-20"><p className="whitespace-pre-line text-headline-10"><AnimatedText text={team.tagline} /></p></div>
          </div>
        </div>
        <div className="grid grid-cols-2 divide-x">
          <div className="grid grid-cols-2 items-start">
            <div className="p-20"><Eyebrow>{team.eyebrow}</Eyebrow></div>
            <div className="relative grid grid-cols-2 border-b border-l">
              <button type="button" disabled={atStart} aria-label="Previous team members" onClick={() => by(-1)} className={buttonClass({ variant: 'bg', size: 'lg', origin: 'right', className: 'flex w-full justify-center' })}><ArrowIcon left className="pointer-events-none relative z-1" /></button>
              <button type="button" disabled={atEnd} aria-label="Next team members" onClick={() => by(1)} className={buttonClass({ variant: 'bg', size: 'lg', origin: 'left', className: 'flex w-full justify-center border-l' })}><ArrowIcon className="pointer-events-none relative z-1" /></button>
            </div>
          </div>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
            <div className="p-20"><AnimatedParagraphs paragraphs={[team.text]} /></div>
          </div>
        </div>
      </div>
      {/* mobile header */}
      <div className="relative z-1 flex flex-col gap-48 border-t border-b bg-theme-bg px-12 py-20 lg:hidden">
        <Eyebrow>{team.eyebrow}</Eyebrow>
        <h2 className="text-headline-50"><AnimatedText text={team.title} /></h2>
        <p className="whitespace-pre-line text-headline-10"><AnimatedText text={team.tagline} /></p>
        <AnimatedParagraphs paragraphs={[team.text]} />
      </div>
      <ShaderCanvas>
        <div ref={slider} style={{ ['--card-basis' as string]: 'calc((100% - 3px) / 4)' }}
          className="lg:scrollbar-invisible relative z-1 flex flex-col gap-1 divide-y lg:-mt-[40vh] lg:-mb-[20vh] lg:snap-x lg:snap-mandatory lg:flex-row lg:items-start lg:divide-y-0 lg:overflow-x-auto lg:overflow-y-clip lg:py-[20vh] lg:[&>*]:cursor-grab">
          {team.members.map((m) => (
            <div key={m.slug} className="lg:shrink-0 lg:basis-(--card-basis) lg:snap-start lg:outline">
              <div className="relative isolate overflow-hidden aspect-[0.8]">
                <button type="button" aria-label={`${m.first} ${m.last}`} onClick={() => show(m.slug)}
                  className={cx(buttonClass({ variant: 'mint', size: 'none', bare: true }), 'peer absolute inset-x-0 bottom-0 z-1 block h-auto w-full px-12 pt-52 pb-20 font-sans text-body-20 normal-case lg:px-20')}>
                  <span data-inner="true" className="relative z-10 flex w-full min-w-0 flex-row items-center justify-between gap-8">
                    <AnimatedText text={`${m.first}\n${m.last}`} />
                    <ArrowIcon />
                  </span>
                </button>
                <div className="absolute top-0 right-0 z-1 border-b border-l bg-theme-bg p-10 font-mono text-caption-10 text-theme-fg uppercase transition-colors duration-800 ease-out peer-hover:bg-theme-fg peer-hover:text-theme-bg">{m.role}</div>
                <div className="pointer-events-none absolute inset-0"><ShaderImage src={m.image} /></div>
              </div>
            </div>
          ))}
          <ShaderCanvasHost position="fixed" zIndex={-1} />
        </div>
      </ShaderCanvas>
    </div>
  )
}

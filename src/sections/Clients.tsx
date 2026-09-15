import { useState } from 'react'
import { clients } from '../data/site'
import { useModal } from '../lib/modal'
import { AnimatedParagraphs, AnimatedText } from '../components/AnimatedText'
import { Button } from '../components/Button'
import { Dither } from '../components/Dither'
import { Eyebrow } from '../components/Eyebrow'
import { FlipText, Odometer } from '../components/Odometer'
import { cx } from '../lib/cx'

export function Clients() {
  const { show } = useModal()
  const [active, setActive] = useState(0)
  const items = clients.items
  const n = items.length
  return (
    <div id="clients" data-page-builder-section="clientsSection" className="scroll-mt-(--site-header-height) overflow-clip">
      <div className="grid grid-cols-1 lg:min-h-[65svh] lg:grid-cols-2 lg:divide-x">
        <div className="relative z-1 order-2 flex flex-col gap-48 border-t bg-theme-bg px-12 py-20 text-theme-fg lg:order-1 lg:px-20 lg:py-0">
          <div className="block lg:hidden"><Eyebrow>{clients.eyebrow}</Eyebrow></div>
          <h2 className="w-fit py-20 text-headline-50 lg:sticky lg:top-(--site-header-height)"><AnimatedText text={clients.title} /></h2>
          <div className="block lg:hidden"><AnimatedParagraphs paragraphs={[clients.text]} /></div>
          <div className="mt-140 ml-auto block lg:hidden"><Button className="min-w-200 shrink-0 lg:ml-0" onClick={() => show('contact')}>{clients.cta}</Button></div>
        </div>
        <div className="relative order-1 aspect-square border-t lg:order-2 lg:aspect-auto"><div className="absolute inset-0"><Dither /></div></div>
      </div>
      <div className="relative z-1 grid grid-cols-1 border-t bg-theme-bg lg:grid-cols-2 lg:divide-x">
        <div className="hidden grid-cols-2 divide-x self-start lg:sticky lg:top-(--site-header-height) lg:grid lg:h-[calc(100svh-var(--site-header-height))]">
          <div className="grid grid-rows-2 divide-y">
            <div className="flex flex-col p-20">
              <Eyebrow>{clients.eyebrow}</Eyebrow>
              <div className="mt-auto flex items-end justify-between gap-12">
                <FlipText items={items.map((c) => c.name)} index={active} className="font-mono text-caption-10 uppercase" />
                <div className="flex items-center gap-[1ch] font-mono text-caption-10 tabular-nums opacity-50">
                  <Odometer value={String(active + 1).padStart(2, '0')} />
                  <span aria-hidden="true">-</span>
                  <span>{String(n).padStart(2, '0')}</span>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 flex flex-col transition-transform duration-800 ease-[var(--ease-in-out)] motion-reduce:transition-none" style={{ height: `${n * 100}%`, transform: `translateY(${(-active * 100) / n}%)` }}>
                {items.map((c, i) => (
                  <div key={i} className="flex items-center justify-center" style={{ height: `${100 / n}%`, backgroundColor: c.bg }}>
                    <picture className="contents"><img alt="" src={c.logo} width={200} height={200} className="max-w-full size-200 object-contain" /></picture>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className="sticky top-(--site-header-height) flex flex-col gap-60 p-20">
              <AnimatedParagraphs paragraphs={[clients.text]} className="text-body-10" />
              <Button className="ml-auto min-w-200 shrink-0 lg:ml-0" onClick={() => show('contact')}>{clients.cta}</Button>
            </div>
          </div>
        </div>
        <ul aria-label="Clients" className="divide-y">
          {items.map((c, i) => (
            <li key={i}>
              <button type="button" onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)}
                className={cx('relative isolate grid h-100 w-full grid-cols-2 items-end gap-20 overflow-hidden p-12 lg:h-120 transition-colors duration-800 ease-out motion-reduce:transition-none', active === i ? 'text-theme-bg' : 'text-theme-fg')}>
                <span aria-hidden="true" className={cx('pointer-events-none absolute inset-0 -z-1 origin-top bg-theme-fg transition-transform duration-800 ease-out motion-reduce:transition-none', active === i ? 'scale-y-100' : 'scale-y-0')} />
                <h3 className="text-headline-10">{c.name}</h3>
                <span className="ml-auto font-mono text-caption-10 uppercase opacity-60 lg:ml-0">{c.category}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

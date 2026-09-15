import { insights } from '../data/site'
import { useModal } from '../lib/modal'
import { AnimatedParagraphs, AnimatedText } from '../components/AnimatedText'
import { Button } from '../components/Button'
import { ContainFit } from '../components/ContainFit'
import { ILLUSTRATIONS } from '../components/Illustrations'

export function Insights() {
  const { show } = useModal()
  return (
    <div data-page-builder-section="insightsSection" className="scroll-mt-(--site-header-height)">
      <div className="grid grid-cols-1 items-start lg:grid-cols-2 lg:divide-x">
        <div className="relative z-1 flex flex-col gap-60 border-t bg-theme-bg px-12 py-20 text-black lg:sticky lg:top-(--site-header-height) lg:min-h-[calc(100svh-var(--site-header-height))] lg:bg-grey lg:px-20">
          <ContainFit as="h2" lines={insights.title.split('\n')} />
          <div className="mt-auto ml-auto flex flex-col gap-188 lg:w-1/2 lg:gap-60">
            <AnimatedParagraphs paragraphs={[insights.text]} className="max-w-400" />
            <Button variant="fg" size="sm" className="ml-auto min-w-200 shrink-0 lg:ml-0" onClick={() => show('contact')}>{insights.cta}</Button>
          </div>
        </div>
        <div className="relative z-1 divide-y divide-current/20 overflow-visible border-t bg-theme-fg text-theme-bg">
          {insights.items.map((item, i) => {
            const Illu = ILLUSTRATIONS[i]
            const n = String(i + 1).padStart(2, '0')
            return (
              <div key={item.title} className="grid grid-cols-1 gap-80 overflow-visible px-12 py-20 lg:min-h-[calc(50svh-var(--site-header-height))] lg:grid-cols-2 lg:grid-rows-1 lg:gap-60 lg:p-40">
                <div className="flex flex-col gap-24 lg:gap-60">
                  <div className="grid grid-cols-2 gap-20 overflow-visible lg:hidden">
                    <span className="block pt-[0.2em] font-mono text-caption-20 opacity-50">{n}</span>
                    <div><div className="ml-auto max-w-200"><Illu className="h-auto w-full max-w-full overflow-visible" /></div></div>
                  </div>
                  <div className="hidden gap-20 lg:grid lg:grid-cols-[auto_1fr]">
                    <span className="block pt-[0.2em] font-mono text-caption-20 opacity-50">{n}</span>
                    <div className="flex flex-col gap-80">
                      <h3 className="whitespace-pre-line text-headline-10"><AnimatedText text={item.title} /></h3>
                      <div className="mt-auto hidden w-[70%] overflow-visible lg:block"><Illu className="h-auto w-full max-w-full overflow-visible" /></div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-24 lg:gap-60">
                  <h3 className="block whitespace-pre-line text-headline-10 lg:hidden"><AnimatedText text={item.title} /></h3>
                  <AnimatedParagraphs paragraphs={[item.text]} />
                  <div className="mt-auto flex w-full flex-col gap-[1em]">
                    <ul className="flex list-none flex-col gap-8">
                      {item.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-8 font-mono text-caption-20 uppercase">
                          <span className="mt-[0.15lvh] block size-8 shrink-0 bg-mint" />
                          <AnimatedText as="div" text={b} className="min-w-0 flex-1" />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

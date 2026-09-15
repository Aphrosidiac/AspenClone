import { banner } from '../data/site'
import { useModal } from '../lib/modal'
import { Button } from '../components/Button'
import { Dither } from '../components/Dither'
import { ArrowIcon } from '../components/Logo'
import { WordOdometer } from '../components/WordOdometer'

export function Banner() {
  const { show } = useModal()
  const [w1, w2, w3, w4] = banner.words
  return (
    <section data-page-builder-section="bannerSection" className="@container relative flex min-h-[calc(100svh-var(--site-header-height))] scroll-mt-(--site-header-height) flex-col items-center justify-center overflow-clip py-20"
      style={{ marginTop: '-60svh', paddingTop: 'calc(5rem + 60svh)', minHeight: 'calc(100svh - var(--site-header-height) + 60svh)' }}>
      <div className="absolute inset-0"><Dither /></div>
      <p className="sr-only">Let's Start Conversation</p>
      <div className="relative z-1 flex w-full items-start text-[8.62cqw] text-white uppercase leading-[0.9]">
        <span className="block shrink-0 bg-black p-[0.4cqw]" aria-hidden="true"><WordOdometer>{w1}</WordOdometer></span>
        <div className="flex flex-1 flex-col">
          <span className="ml-[15cqw] block w-fit shrink-0 bg-black p-[0.4cqw]" aria-hidden="true"><WordOdometer delay={0.1}>{w2}</WordOdometer></span>
          <div className="flex items-stretch justify-between">
            <span className="block w-fit shrink-0 bg-white p-[0.4cqw] text-black" aria-hidden="true"><WordOdometer delay={0.3}>{w3}</WordOdometer></span>
            <Button variant="mint" size="none" aria-label={banner.cta} onClick={() => show('contact')} icon={<ArrowIcon className="size-[3.5cqw]!" />}
              className="font-mono uppercase size-[calc(0.9em+0.8cqw)] px-0 text-[length:inherit] **:data-inner:justify-center" />
          </div>
        </div>
        <span className="block shrink-0 bg-black p-[0.4cqw]" aria-hidden="true"><WordOdometer delay={0.4}>{w4}</WordOdometer></span>
      </div>
    </section>
  )
}

import { brand, hero } from '../data/site'
import { useModal } from '../lib/modal'
import { AnimatedParagraphs, AnimatedText } from '../components/AnimatedText'
import { Button } from '../components/Button'
import { ContainFit } from '../components/ContainFit'
import { Dither } from '../components/Dither'
import { Marquee } from '../components/Marquee'

function HireLogos() {
  return (
    <div className="flex gap-8">
      {hero.hires.map((l) => (
        <div key={l.src} className="flex h-80 w-100 items-center justify-center">
          <picture className="contents"><img loading="lazy" decoding="async" alt="" src={l.src} width={l.w} height={l.h} className="max-w-full size-full object-contain" /></picture>
        </div>
      ))}
    </div>
  )
}

export function Hero() {
  const { show } = useModal()
  const openContact = () => show('contact')
  return (
    <div data-page-builder-section="heroSection" className="relative">
      <div className="absolute inset-0"><Dither /></div>

      {/* desktop */}
      <div className="relative z-1 hidden lg:block">
        <div className="grid min-h-[calc(100svh-var(--site-header-height))] grid-rows-2">
          <div className="sticky top-(--site-header-height) grid grid-cols-2 divide-x">
            <div className="flex items-end bg-theme-bg p-20 text-theme-fg shadow-border-b">
              <AnimatedText as="h1" text={brand.heroWords[0]} className="text-headline-50 leading-none" viewport={false} />
            </div>
            <div />
          </div>
          <div className="grid grid-cols-2 divide-x">
            <div />
            <div className="inset-shadow-border-t grid grid-cols-2">
              <div className="flex flex-col gap-20 bg-theme-fg p-20 text-theme-bg">
                <div className="text-body-20">
                  <AnimatedParagraphs paragraphs={[hero.intro]} className="text-body-20" viewport={false} />
                </div>
                <Button variant="fg" size="sm" className="mt-auto w-full" onClick={openContact}>{hero.cta}</Button>
              </div>
              <div className="flex flex-col bg-mint text-black">
                <AnimatedParagraphs paragraphs={hero.welcome} className="p-20 text-body-20" viewport={false} delay={0.2} />
                <Marquee className="mt-auto **:data-marqy-inner:gap-8"><HireLogos /></Marquee>
              </div>
            </div>
          </div>
        </div>
        <div className="grid divide-y">
          <div className="grid min-h-[calc(50svh-var(--site-header-height)/2)] grid-cols-2 divide-x">
            <div />
            <div className="flex min-w-0 items-end bg-grey p-20 text-black">
              <AnimatedText as="p" text={brand.heroWords[1]} className="text-headline-50" />
            </div>
          </div>
          <div className="grid min-h-[65svh] grid-cols-2">
            <div className="flex min-w-0 flex-col bg-theme-fg p-20 text-theme-bg">
              <ContainFit lines={hero.slogan} />
            </div>
            <div />
          </div>
        </div>
      </div>

      {/* mobile */}
      <div className="relative z-1 block lg:hidden">
        <div className="relative">
          <div className="sticky top-(--site-header-height) grid grid-cols-2 divide-x">
            <div className="flex items-end bg-theme-bg px-12 pt-188 pb-20 text-theme-fg shadow-border-b">
              <AnimatedText as="h1" text={brand.heroWords[0]} className="text-headline-50" viewport={false} />
            </div>
            <div />
          </div>
          <div className="relative grid grid-cols-2 divide-x">
            <div />
            <div className="inset-shadow-border-t flex min-w-0 items-end bg-grey px-12 pt-188 pb-20 text-black">
              <AnimatedText as="p" text={brand.heroWords[1]} className="text-headline-50" />
            </div>
          </div>
        </div>
        <div className="flex flex-col bg-theme-fg px-12 py-20 text-theme-bg">
          <ContainFit lines={hero.slogan} />
        </div>
        <div>
          <div className="flex flex-col gap-188 bg-theme-fg px-12 py-20 text-theme-bg">
            <div className="text-body-20"><AnimatedParagraphs paragraphs={[hero.intro]} className="text-body-20" /></div>
            <Button variant="bg" size="sm" className="ml-auto w-fit" onClick={openContact}>{hero.cta}</Button>
          </div>
          <div className="flex flex-col bg-mint text-black">
            <AnimatedParagraphs paragraphs={hero.welcome} className="px-12 pt-20 pb-188 text-body-20" />
            <Marquee className="mt-auto **:data-marqy-inner:gap-8"><HireLogos /></Marquee>
          </div>
        </div>
      </div>
    </div>
  )
}

import { AnimatedParagraphs, AnimatedText } from '../components/AnimatedText'
import { ButtonLink } from '../components/Button'
import { Dither } from '../components/Dither'

export function NotFound() {
  return (
    <div className="relative grid min-h-[calc(100svh-var(--site-header-height))] grid-rows-2">
      <div className="absolute inset-0"><Dither /></div>
      <div className="sticky top-(--site-header-height) z-1 grid grid-cols-2 items-start divide-x">
        <div className="flex h-full items-end bg-theme-bg px-12 py-20 text-theme-fg shadow-border-b lg:px-20 lg:pt-20"><p className="text-headline-50"><AnimatedText text="404" viewport={false} /></p></div>
        <div />
      </div>
      <div className="relative z-1 grid grid-cols-2 divide-x">
        <div />
        <div className="relative inset-shadow-border-t flex flex-col justify-between gap-20 bg-theme-bg px-12 py-20 pb-20 text-theme-fg lg:px-20 lg:pt-20">
          <p className="text-headline-30"><AnimatedText text="Page Not Found" viewport={false} /></p>
          <div className="flex flex-col gap-20 lg:flex-row lg:items-end lg:justify-between">
            <AnimatedParagraphs paragraphs={['The page you are looking for could not be found']} viewport={false} />
            <ButtonLink href="/" className="shrink-0 lg:min-w-200">Back to Home</ButtonLink>
          </div>
        </div>
      </div>
    </div>
  )
}

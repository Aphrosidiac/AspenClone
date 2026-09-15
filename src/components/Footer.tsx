import { brand, footer, nav } from '../data/site'
import { useModal } from '../lib/modal'
import { AnimatedText } from './AnimatedText'
import { ButtonLink } from './Button'
import { AnalogClock } from './Clocks'
import { Confetti } from './Confetti'
import { NavLink } from './Header'
import { ExternalIcon, Lockup } from './Logo'

export function Footer() {
  const { show } = useModal()
  return (
    <footer className="relative z-1 divide-y overflow-clip border-t bg-theme-bg lg:grid lg:h-[calc(100svh-var(--site-header-height))] lg:grid-rows-2">
      <div className="relative z-1 grid grid-cols-1 divide-y lg:grid-cols-2 lg:divide-x lg:divide-y-0 lg:bg-theme-bg">
        <div className="min-h-200 px-12 py-20 lg:px-20">
          <p className="w-fit whitespace-pre-line text-headline-10"><AnimatedText text={footer.tagline} /></p>
        </div>
        <div className="flex min-h-200 flex-col divide-y">
          <div className="grid flex-1 grid-cols-1 divide-y lg:grid-cols-2 lg:divide-x lg:divide-y-0">
            <div className="px-12 py-20 lg:px-20">
              <ul className="flex flex-col gap-8">{nav.map((n) => (<li key={n.href}><NavLink href={'/' + n.href}>{n.text}</NavLink></li>))}</ul>
            </div>
            <div className="flex-1 px-12 py-20 lg:px-20">
              <div className="flex flex-col gap-12"><AnalogClock zone="NYC" /><AnalogClock zone="LA" /></div>
            </div>
          </div>
          <div className="grid grid-cols-1 divide-y lg:grid-cols-2 lg:divide-x lg:divide-y-0">
            <ButtonLink variant="bg" size="row" href={`mailto:${brand.email}`} icon={false}>{brand.email}</ButtonLink>
            <ul className="flex divide-x">
              <li className="w-full"><ButtonLink variant="bg" size="row" href={brand.linkedin} target="_blank" rel="noopener" icon={<ExternalIcon />}>Linkedin</ButtonLink></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:sticky lg:bottom-0 lg:grid-cols-2 lg:divide-x">
        <div className="order-2 flex min-h-200 flex-col gap-y-48 bg-theme-fg px-12 pt-48 pb-24 text-theme-bg lg:order-1 lg:p-20">
          <Confetti><Lockup className="m-auto h-auto w-[60%] lg:w-full lg:max-w-400" /></Confetti>
          <div className="flex flex-col items-center gap-x-20 gap-y-8 font-mono text-caption-10 uppercase lg:flex-row lg:justify-between">
            <div className="flex flex-wrap items-center">
              <p className="whitespace-nowrap text-theme-bg/65">© {new Date().getFullYear()} {brand.longName}</p>
              <ul className="flex gap-[1ch] pl-[1ch]">
                <li className="flex items-center gap-[1ch]"><span>•</span><button type="button" onClick={() => show('privacyPolicy')} className="text-theme-bg/65 transition-colors duration-300 ease-in-out hover:text-theme-bg">Privacy Policy</button></li>
              </ul>
            </div>
            <p className="text-theme-bg/65">Website by <a className="text-theme-bg underline" target="_blank" rel="noreferrer" href={brand.credit.href}>{brand.credit.label}</a></p>
          </div>
        </div>
        <button type="button" onClick={() => show('contact')} className="group relative order-1 aspect-square min-h-200 overflow-hidden lg:order-2 lg:aspect-auto">
          <div className="absolute inset-0 flex flex-col justify-between bg-mint px-12 py-20 text-black transition-[clip-path] duration-800 ease-[var(--ease-in-out)] [clip-path:inset(0_0_0_0)] group-hover:[clip-path:inset(0_0_0_100%)]">
            <p className="whitespace-pre-line text-headline-10"><AnimatedText text={footer.cta.title} /></p>
            <div className="flex items-end justify-between gap-20">
              <p className="leading-none">{footer.cta.label}</p>
              <svg aria-hidden="true" viewBox="0 0 115 115" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-114 shrink-0"><path d="m.354 114.5 114-114M.354.5h114v114" stroke="currentColor" /></svg>
            </div>
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex flex-col justify-between bg-theme-fg px-12 py-20 text-theme-bg transition-[clip-path] duration-800 ease-[var(--ease-in-out)] [clip-path:inset(0_100%_0_0)] group-hover:[clip-path:inset(0_0_0_0)]">
            <p className="whitespace-pre-line text-headline-10">{footer.cta.title}</p>
            <div className="flex items-end justify-between gap-20">
              <p className="leading-none">{footer.cta.label}</p>
              <svg aria-hidden="true" viewBox="0 0 115 115" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-114 shrink-0"><path d="m.354 114.5 114-114M.354.5h114v114" stroke="currentColor" /></svg>
            </div>
          </div>
        </button>
      </div>
    </footer>
  )
}

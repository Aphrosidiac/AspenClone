import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useId, useState } from 'react'
import { createPortal } from 'react-dom'
import { brand, nav } from '../data/site'
import { cx } from '../lib/cx'
import { useIntro } from '../lib/intro'
import { useLenis } from '../lib/lenis'
import { useModal } from '../lib/modal'
import { EASE_OUT } from '../lib/motion'
import { Button } from './Button'
import { AnalogClock, HeaderTime } from './Clocks'
import { Coin } from './CoinLogo'
import { FlipText } from './Odometer'
import { Mark } from './Logo'
import { ThemeToggle } from './ThemeToggle'

/** Nav link: a fg block slides up from below on hover while the label inverts (600ms ease-out). */
export function useAnchorScroll() {
  const lenis = useLenis()
  return (e: React.MouseEvent<HTMLAnchorElement>) => {
    const hash = new URL(e.currentTarget.href).hash
    if (!hash || location.pathname !== '/') return
    const target = document.querySelector(hash)
    if (!target) return
    e.preventDefault()
    history.replaceState(null, '', hash)
    if (lenis) lenis.scrollTo(target as HTMLElement, { offset: -60, duration: 1.4 })
    else target.scrollIntoView()
  }
}

export function NavLink({ href, children, delay = 0 }: { href: string; children: string; delay?: number }) {
  const { done } = useIntro()
  const onClick = useAnchorScroll()
  return (
    <span className="inline-flex overflow-hidden">
      <motion.span className="inline-flex" initial={{ y: '100%' }} animate={done ? { y: 0 } : { y: '100%' }} transition={{ duration: 1, ease: EASE_OUT, delay }}>
        <a draggable={false} href={href} onClick={onClick} className="group relative inline-flex overflow-hidden p-4 text-theme-fg transition-colors duration-600 ease-out hover:text-theme-bg motion-reduce:transition-none">
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-theme-fg transition-transform duration-600 ease-out [transform:translate(0,calc(100%+1px))] group-hover:[transform:translate(0,0)] motion-reduce:transition-none" />
          <span className="relative">{children}</span>
        </a>
      </motion.span>
    </span>
  )
}

function MenuLink({ href, children, onDone }: { href: string; children: string; onDone: () => void }) {
  const lenis = useLenis()
  return (
    <a className="flex flex-1 items-end bg-theme-bg px-12 py-20 text-headline-20" href={href} onClick={(e) => {
      const target = document.querySelector(new URL(e.currentTarget.href).hash)
      if (!target) return
      e.preventDefault(); onDone()
      history.replaceState(null, '', new URL(e.currentTarget.href).hash)
      setTimeout(() => { lenis?.start(); lenis ? lenis.scrollTo(target as HTMLElement, { offset: -60, duration: 1.4 }) : target.scrollIntoView() }, 50)
    }}>{children}</a>
  )
}

function NavList({ className }: { className?: string }) {
  return (
    <ul className={cx('flex flex-wrap gap-8', className)}>
      {nav.map((n, i) => (<li key={n.href}><NavLink href={'/' + n.href} delay={0.05 * i}>{n.text}</NavLink></li>))}
    </ul>
  )
}

export function Header() {
  const { show } = useModal()
  const { done } = useIntro()
  const [open, setOpen] = useState(false)
  const lenis = useLenis()
  const menuId = useId()
  useEffect(() => { if (open) lenis?.stop(); else lenis?.start() }, [open, lenis])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    const onResize = () => { if (innerWidth >= 1024) setOpen(false) }
    addEventListener('keydown', onKey); addEventListener('resize', onResize)
    return () => { removeEventListener('keydown', onKey); removeEventListener('resize', onResize) }
  }, [])
  return (
    <>
      <header className="sticky inset-x-0 top-0 z-2 grid min-h-(--site-header-height) grid-cols-2 border-b bg-theme-bg">
        <div className="flex items-center border-r">
          <a aria-label={`${brand.longName} home`} href="/" className="flex size-(--site-header-height) shrink-0 items-center justify-center bg-theme-fg text-theme-bg">
            <span className="contents"><Coin><Mark className="h-auto w-40" /></Coin></span>
          </a>
          <div className="hidden lg:block xl:hidden"><NavList className="px-20" /></div>
          <motion.div className="mx-auto block px-20 lg:mx-0 lg:hidden lg:pl-80 xl:block" initial={{ opacity: 0 }} animate={{ opacity: done ? 1 : 0 }} transition={{ duration: 0.8, ease: EASE_OUT }}>
            <HeaderTime />
          </motion.div>
        </div>
        <div className="hidden items-center lg:flex">
          <div className="flex flex-1 items-center justify-between gap-20 px-20">
            <div className="lg:hidden xl:block"><NavList /></div>
            <ThemeToggle className="ml-auto" />
          </div>
          <Button variant="fg" size="lg" className="min-w-200 shrink-0" onClick={() => show('contact')}>Contact</Button>
        </div>
        <div className="block size-full lg:hidden">
          <button type="button" aria-expanded={open} aria-controls={menuId} onClick={() => setOpen((o) => !o)} className="flex size-full items-center justify-between bg-mint px-12 text-black">
            <FlipText items={['Menu', 'Close']} index={open ? 1 : 0} />
            <span aria-hidden="true" className="relative inline-block size-20 shrink-0">
              <span className="absolute inset-x-2 top-1/2 h-2 origin-center bg-current transition-transform duration-500 ease-[var(--ease-out)]" style={{ transform: open ? 'translateY(-1px) rotate(45deg)' : 'translateY(-4px)' }} />
              <span className="absolute inset-x-2 top-1/2 h-2 origin-center bg-current transition-transform duration-500 ease-[var(--ease-out)]" style={{ transform: open ? 'translateY(-1px) rotate(-45deg)' : 'translateY(2px)' }} />
            </span>
          </button>
        </div>
      </header>
      {createPortal(<AnimatePresence>
        {open && (
          <div id={menuId} tabIndex={-1} role="dialog" aria-modal="true" aria-label="Site navigation" className="fixed inset-x-0 top-[calc(var(--site-header-height)+1px)] bottom-0 isolate z-1 outline-none lg:hidden">
            <p className="sr-only">Site navigation. Press Escape to close.</p>
            <div className="custom-scrollbar h-full overflow-y-auto overscroll-none [&>div]:h-full lenis" data-lenis-prevent="true">
              <div>
                <ul className="isolate flex min-h-full flex-col">
                  {[...nav.map((n) => ({ text: n.text, href: '/' + n.href })), { text: 'Contact', href: '' }].map((n, i, a) => (
                    <motion.li key={n.text} className="relative flex flex-1 border-b bg-theme-bg" style={{ zIndex: a.length - i }}
                      initial={{ y: '-100%' }} animate={{ y: 0 }} exit={{ y: '-100%' }} transition={{ duration: 0.9, ease: EASE_OUT, delay: i * 0.04 }}>
                      {n.href ? (
                        <MenuLink href={n.href} onDone={() => setOpen(false)}>{n.text}</MenuLink>
                      ) : (
                        <button type="button" className="flex flex-1 items-end bg-theme-bg px-12 py-20 text-headline-20" onClick={() => { setOpen(false); show('contact') }}>{n.text}</button>
                      )}
                    </motion.li>
                  ))}
                  <motion.li className="grid h-60 grid-cols-3 divide-x bg-theme-bg" style={{ zIndex: 0 }} initial={{ y: '-100%' }} animate={{ y: 0 }} exit={{ y: '-100%' }} transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.2 }}>
                    <div className="flex items-center justify-center gap-12 px-12"><AnalogClock zone="NYC" showTime={false} /></div>
                    <div className="flex items-center justify-center gap-12 px-12"><AnalogClock zone="LA" showTime={false} /></div>
                    <ThemeToggle className="size-full px-12" />
                  </motion.li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>, document.body)}
    </>
  )
}

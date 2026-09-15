import { useEffect } from 'react'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { SiteBgLogo } from './components/SiteBgLogo'
import { SiteEntrance } from './components/SiteEntrance'
import { ContactModal } from './components/modals/ContactModal'
import { PrivacyModal } from './components/modals/PrivacyModal'
import { TeamModals } from './components/modals/TeamModal'
import { SiteIntroProvider } from './lib/intro'
import { LenisProvider } from './lib/lenis'
import { ModalProvider } from './lib/modal'
import { Banner } from './sections/Banner'
import { Clients } from './sections/Clients'
import { Hero } from './sections/Hero'
import { Insights } from './sections/Insights'
import { NotFound } from './sections/NotFound'
import { Stats } from './sections/Stats'
import { Team } from './sections/Team'
import { Testimonials } from './sections/Testimonials'

function useScrollbarWidth() {
  useEffect(() => {
    const set = () => document.documentElement.style.setProperty('--sbw', `${innerWidth - document.documentElement.clientWidth}px`)
    set(); addEventListener('resize', set)
    return () => removeEventListener('resize', set)
  }, [])
}

function useKeyboardFocusMode() {
  useEffect(() => {
    const on = (e: KeyboardEvent) => { if (e.key === 'Tab') document.documentElement.setAttribute('data-keyboard-focus', '') }
    const off = () => document.documentElement.removeAttribute('data-keyboard-focus')
    addEventListener('keydown', on); addEventListener('pointerdown', off)
    return () => { removeEventListener('keydown', on); removeEventListener('pointerdown', off) }
  }, [])
}

export default function App() {
  useScrollbarWidth()
  useKeyboardFocusMode()
  const path = typeof location !== 'undefined' ? location.pathname : '/'
  const known = path === '/' || path === '/privacy-policy'
  return (
    <SiteIntroProvider skip={!known}>
      <LenisProvider>
        <ModalProvider>
          <SiteEntrance />
          <SiteBgLogo />
          <Header />
          <main className="min-h-svh">
            {known ? (<><Hero /><Stats /><Insights /><Clients /><Testimonials /><Team /><Banner /></>) : <NotFound />}
          </main>
          <Footer />
          <ContactModal />
          <PrivacyModal />
          <TeamModals />
        </ModalProvider>
      </LenisProvider>
    </SiteIntroProvider>
  )
}

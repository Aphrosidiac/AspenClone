import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useId, useRef, type ReactNode } from 'react'
import { useLenis } from '../lib/lenis'
import { useModal } from '../lib/modal'
import { EASE_IN_OUT } from '../lib/motion'
import { buttonClass } from './Button'
import { CloseIcon } from './Logo'

/**
 * Right-hand drawer (the reference's `Modal`): fixed z-10, black/60 backdrop, panel 50% wide on lg with a
 * mint 60×60 close square hanging outside its left edge. Escape / backdrop closes; page scroll is stopped.
 */
export function Modal({ name, label, children }: { name: string; label: string; children: ReactNode }) {
  const { open, close } = useModal()
  const isOpen = open === name
  const lenis = useLenis()
  const id = useId()
  const panel = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!isOpen) return
    lenis?.stop()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { close(); return }
      if (e.key !== 'Tab' || !panel.current) return
      const f = Array.from(panel.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([type=hidden]), [tabindex]:not([tabindex="-1"])')).filter((el) => el.offsetParent !== null || el.getClientRects().length > 0)
      if (!f.length) return
      const first = f[0], last = f[f.length - 1]
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    addEventListener('keydown', onKey)
    const t = setTimeout(() => panel.current?.focus(), 50)
    return () => { removeEventListener('keydown', onKey); clearTimeout(t); lenis?.start() }
  }, [isOpen, close, lenis])
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 isolate z-10">
          <div className="absolute inset-0 flex justify-end">
            <motion.div role="presentation" aria-hidden="true" onClick={close} className="pointer-events-auto absolute inset-0 z-0 cursor-pointer bg-black/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} />
            <motion.div ref={panel} id={id} tabIndex={-1} data-modal={name} role="dialog" aria-modal="true" aria-label={label} aria-describedby={`${id}-desc`}
              className="pointer-events-auto relative z-1 h-full w-full outline-none lg:max-w-[calc(50%+(var(--sbw)/2))] lg:border-l"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 1, ease: EASE_IN_OUT }}>
              <p id={`${id}-desc`} tabIndex={-1} className="sr-only outline-none">Dialog. Press Escape to close.</p>
              <motion.button type="button" aria-label={`Close ${label} dialog`} onClick={close} className="absolute top-0 left-0 z-1 flex size-60 items-center justify-center bg-mint text-black lg:-translate-x-[calc(100%+(--spacing(1)))]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
                <span className={buttonClass({ variant: 'mint', size: 'sm', className: 'size-full justify-center px-12 **:data-inner:justify-center' })}>
                  <span data-inner="true" className="relative z-10 flex w-full min-w-0 flex-row items-center justify-between gap-8"><CloseIcon /></span>
                </span>
              </motion.button>
              <div className="custom-scrollbar h-full overflow-y-auto overscroll-none bg-theme-bg [&>div]:h-full lenis" data-lenis-prevent="true">
                <div>{children}</div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}

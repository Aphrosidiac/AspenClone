import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

/** The reference keeps the open modal in the URL (`?modal=contact`, team slugs, `privacyPolicy`). */
type ModalCtx = { open: string | null; show: (name: string) => void; close: () => void }
const Ctx = createContext<ModalCtx>({ open: null, show: () => {}, close: () => {} })

const read = () => {
  if (typeof location === 'undefined') return null
  if (location.pathname === '/privacy-policy') return 'privacyPolicy'
  return new URLSearchParams(location.search).get('modal')
}

export function ModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState<string | null>(read)
  useEffect(() => {
    const on = () => setOpen(read())
    window.addEventListener('popstate', on)
    return () => window.removeEventListener('popstate', on)
  }, [])
  const show = useCallback((name: string) => {
    const u = new URL(location.href)
    u.pathname = '/'
    u.searchParams.set('modal', name)
    history.pushState({ modal: name }, '', u)
    setOpen(name)
  }, [])
  const close = useCallback(() => {
    const u = new URL(location.href)
    u.pathname = '/'
    u.searchParams.delete('modal')
    history.pushState({}, '', u.pathname + u.search + u.hash)
    setOpen(null)
  }, [])
  const value = useMemo(() => ({ open, show, close }), [open, show, close])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
export const useModal = () => useContext(Ctx)

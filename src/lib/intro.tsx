import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

/** Site entrance state. Nothing below the fold reveals until the entrance overlay has wiped away. */
type Intro = { done: boolean; finish: () => void }
const Ctx = createContext<Intro>({ done: true, finish: () => {} })

export function SiteIntroProvider({ children, skip = false }: { children: ReactNode; skip?: boolean }) {
  const [done, setDone] = useState(skip)
  const value = useMemo(() => ({ done, finish: () => setDone(true) }), [done])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
export const useIntro = () => useContext(Ctx)

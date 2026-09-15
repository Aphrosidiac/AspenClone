import { useEffect, useState } from 'react'

export const EASE_OUT = [0.16, 1, 0.3, 1] as const
export const EASE_IN_OUT = [0.87, 0, 0.13, 1] as const
export const EASE_IN = [0.55, 0, 1, 0.45] as const

export function usePrefersReducedMotion() {
  const [reduced, set] = useState(() => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const mq = matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => set(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

export function useIsTouchDevice() {
  const [touch, set] = useState(() => typeof matchMedia !== 'undefined' && matchMedia('(hover: none)').matches)
  useEffect(() => {
    const mq = matchMedia('(hover: none)')
    const on = () => set(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return touch
}

export function useMediaQuery(q: string) {
  const [m, set] = useState(() => typeof matchMedia !== 'undefined' && matchMedia(q).matches)
  useEffect(() => {
    const mq = matchMedia(q)
    const on = () => set(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [q])
  return m
}

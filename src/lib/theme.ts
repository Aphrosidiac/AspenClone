export type Theme = 'light' | 'dark'

export const getTheme = (): Theme => (document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light')

/** Toggle with the reference's clip-path sweep: the new snapshot wipes in from the side of the button. */
export function toggleTheme(fromRight = true) {
  const next: Theme = getTheme() === 'dark' ? 'light' : 'dark'
  const apply = () => {
    document.documentElement.setAttribute('data-theme', next)
    try { localStorage.setItem('theme', next) } catch {}
  }
  const html = document.documentElement
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  const doc = document as Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } }
  if (reduce || !doc.startViewTransition) { apply(); return }
  const cls = fromRight ? 'theme-sweep-rtl' : 'theme-sweep-ltr'
  html.classList.add(cls)
  const vt = doc.startViewTransition(apply)
  vt.finished.finally(() => html.classList.remove(cls))
}

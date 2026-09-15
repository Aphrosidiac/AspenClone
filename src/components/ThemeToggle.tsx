import { cx } from '../lib/cx'
import { toggleTheme } from '../lib/theme'

export function ThemeToggle({ className }: { className?: string }) {
  return (
    <button type="button" aria-label="Toggle theme" title="Toggle theme" onClick={(e) => toggleTheme(e.clientX > innerWidth / 2)}
      className={cx('group flex items-center justify-center transition-transform duration-200 ease-out active:scale-[0.94]', className)}>
      <svg className="block text-current motion-safe:transition-transform motion-safe:duration-[450ms] motion-safe:ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-safe:group-hover:rotate-180" viewBox="0 0 24 12" width="24" height="12" aria-hidden="true">
        <title>Theme</title>
        <circle cx="6.5" cy="6" r="5.5" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="17.5" cy="6" r="5.5" fill="currentColor" stroke="currentColor" strokeWidth="1" />
      </svg>
    </button>
  )
}

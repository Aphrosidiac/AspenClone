import { cx } from '../lib/cx'

/** The `//FF` recognition mark, stacked square (slashes over the two identical Fs) — for tiles and the coin. */
export function Mark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="16 6 64 72" fill="none" className={className} aria-hidden={title ? undefined : true} role={title ? 'img' : undefined}>
      {title && <title>{title}</title>}
      <g fill="currentColor">
        <g transform="translate(34.5 8) scale(.5 .3333)">
          <path d="M0 72 16 0h14L14 72Z" />
          <path d="M24 72 40 0h14L38 72Z" />
        </g>
        <g transform="translate(18.72 46) scale(.48 .42)">
          <path d="M0 0h54v15H16v13h32v14H16v30H0Z" />
          <path d="M68 0h54v15H84v13h32v14H84v30H68Z" />
        </g>
      </g>
    </svg>
  )
}

/** Horizontal `//FF` mark for the footer plate. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 194 72" fill="none" className={cx('h-auto', className)} aria-hidden="true">
      <g fill="currentColor">
        <path d="M0 72 16 0h14L14 72Z" />
        <path d="M24 72 40 0h14L38 72Z" />
        <path d="M72 0h54v15H88v13h32v14H88v30H72Z" />
        <path d="M140 0h54v15h-38v13h32v14h-32v30h-16Z" />
      </g>
    </svg>
  )
}

export function ArrowIcon({ className, left = false }: { className?: string; left?: boolean }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.953 15.953" aria-hidden="true" className={cx('size-[1em] shrink-0', className)}>
      <path fill="none" stroke="currentColor" strokeWidth="1.5" d={left ? 'M15.203 7.977H1.06m7.072 7.07L1.06 7.978 8.132.906' : 'M.75 7.976h14.143M7.82.906l7.072 7.07-7.072 7.071'} />
    </svg>
  )
}

export function ExternalIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 12" aria-hidden="true" className={cx('shrink-0 size-10', className)}>
      <path stroke="currentColor" strokeWidth="1.5" d="m.53 10.75 10-10m-10 0h10v10" />
    </svg>
  )
}

export function CloseIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 21" aria-hidden="true" className={cx('shrink-0 size-20', className)}>
      <path stroke="currentColor" d="m.354.354 20 20m0-20-20 20" />
    </svg>
  )
}

export function QuoteIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 13 12" aria-hidden="true" className={cx('h-auto w-14 shrink-0', className)}>
      <path fill="currentColor" d="M0 12V6.6C0 4.6.5 3 1.5 1.8 2.5.6 3.9 0 5.7 0v2.2c-1.7 0-2.6 1-2.6 3.1V6h2.6v6H0Zm7.3 0V6.6c0-2 .5-3.6 1.5-4.8C9.8.6 11.2 0 13 0v2.2c-1.7 0-2.6 1-2.6 3.1V6H13v6H7.3Z" />
    </svg>
  )
}

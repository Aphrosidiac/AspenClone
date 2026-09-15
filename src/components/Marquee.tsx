import { type ReactNode } from 'react'
import { cx } from '../lib/cx'

/** CSS marquee: content duplicated, translateX(-100%) linear. `speed` = seconds per loop. */
export function Marquee({ children, className, duration = 12.8, pauseOnHover = false }: { children: ReactNode; className?: string; duration?: number; pauseOnHover?: boolean }) {
  return (
    <div data-marqy="" data-direction="left" data-pause-on-hover={pauseOnHover ? '' : undefined} className={cx('vt-exclude', className)} style={{ ['--marqy-duration' as string]: `${duration}s` }}>
      <div data-marqy-inner="">
        <div data-marqy-content=""><div data-marqy-item="">{children}</div></div>
        <div data-marqy-content=""><div aria-hidden="true" data-marqy-item="">{children}</div></div>
      </div>
    </div>
  )
}

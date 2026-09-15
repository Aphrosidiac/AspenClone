import { cx } from '../lib/cx'

export function Eyebrow({ children, className, square = 'bg-black' }: { children: string; className?: string; square?: string }) {
  return (
    <div className={cx('flex items-center gap-12', className)}>
      <span className={cx('block size-8 shrink-0', square)} />
      <p className="font-mono text-caption-10 uppercase">{children}</p>
    </div>
  )
}

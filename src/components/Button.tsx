import { forwardRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes, type ReactNode } from 'react'
import { cx } from '../lib/cx'
import { ArrowIcon } from './Logo'

/**
 * The reference's single button primitive: a `before:` block that scales in from the left over 800ms
 * (ease-out) while the label colour swaps. Variants = colour pairs; sizes = h-36 mono caption / h-60 body.
 */
const base =
  "isolate min-w-0 shrink-0 items-center overflow-hidden whitespace-nowrap transition-[transform,color] duration-800 ease-out before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:z-0 before:h-full before:w-full before:scale-x-0 before:transition-transform before:duration-800 before:ease-out before:content-[''] hover:before:scale-x-100 motion-reduce:transition-none motion-reduce:before:transition-none disabled:pointer-events-none disabled:opacity-50 disabled:grayscale"

const variants = {
  fg: 'bg-theme-fg text-theme-bg before:bg-mint hover:text-black motion-reduce:hover:bg-mint motion-reduce:hover:text-black motion-reduce:before:hidden',
  bg: 'bg-theme-bg text-theme-fg before:bg-theme-fg hover:text-theme-bg motion-reduce:hover:bg-theme-fg motion-reduce:hover:text-theme-bg motion-reduce:before:hidden',
  mint: 'bg-mint text-black before:bg-black hover:text-mint motion-reduce:hover:bg-black motion-reduce:hover:text-mint motion-reduce:before:hidden',
} as const

const sizes = {
  sm: 'h-36 px-12 font-mono text-caption-10 uppercase',
  lg: 'h-60 px-20 text-body-10',
  row: 'h-60 w-full px-12 font-sans text-body-10 normal-case lg:px-20',
  none: '',
} as const

type Common = { variant?: keyof typeof variants; size?: keyof typeof sizes; origin?: 'left' | 'right'; icon?: ReactNode | false; children?: ReactNode; className?: string; innerClassName?: string; /** drop `relative inline-flex` so the caller can position/display it (absolute card buttons) */ bare?: boolean }

export function buttonClass({ variant = 'fg', size = 'sm', origin = 'left', className, bare = false }: Omit<Common, 'icon' | 'children' | 'innerClassName'>) {
  return cx(bare ? '' : 'relative inline-flex', base, variants[variant], sizes[size], origin === 'left' ? 'before:origin-left' : 'before:origin-right', className)
}

export function Inner({ children, icon, className }: { children?: ReactNode; icon?: ReactNode | false; className?: string }) {
  return (
    <span data-inner="true" className={cx('relative z-10 flex w-full min-w-0 flex-row items-center justify-between gap-8', className)}>
      {children}
      {icon === undefined ? <ArrowIcon /> : icon}
    </span>
  )
}

export const Button = forwardRef<HTMLButtonElement, Common & ButtonHTMLAttributes<HTMLButtonElement>>(function Button(
  { variant, size, origin, icon, children, className, innerClassName, bare, ...rest }, ref) {
  return (
    <button ref={ref} type="button" className={buttonClass({ variant, size, origin, className, bare })} {...rest}>
      <Inner icon={icon} className={innerClassName}>{children}</Inner>
    </button>
  )
})

export const ButtonLink = forwardRef<HTMLAnchorElement, Common & AnchorHTMLAttributes<HTMLAnchorElement>>(function ButtonLink(
  { variant, size, origin, icon, children, className, innerClassName, bare, ...rest }, ref) {
  return (
    <a ref={ref} className={buttonClass({ variant, size, origin, className, bare })} {...rest}>
      <Inner icon={icon} className={innerClassName}>{children}</Inner>
    </a>
  )
})

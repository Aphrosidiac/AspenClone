import { Coin } from './CoinLogo'
import { Mark } from './Logo'

/** The big grey coin behind everything: fixed, z-1, above the dither canvases and below every z-1 section. */
export function SiteBgLogo() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-1 flex h-svh items-center justify-center pr-(--sbw)">
      <Coin><Mark className="h-auto w-[min(72vw,44rem)] max-w-full text-grey" /></Coin>
    </div>
  )
}

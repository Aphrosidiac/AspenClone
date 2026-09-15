import { useInView } from 'motion/react'
import { useRef } from 'react'
import { about } from '../data/site'
import { AnimatedParagraphs } from '../components/AnimatedText'
import { Confetti } from '../components/Confetti'
import { Eyebrow } from '../components/Eyebrow'
import { Odometer } from '../components/Odometer'
import { cx } from '../lib/cx'

function Stat({ value, label, className, size }: { value: string; label: string; className: string; size: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  return (
    <div ref={ref} className={cx('flex flex-col justify-between px-12 py-20 lg:px-20', className)}>
      <Confetti><p className={cx('w-fit', size)}><Odometer value={value} active={inView} /></p></Confetti>
      <p className="mt-auto">{label}</p>
    </div>
  )
}

export function Stats() {
  const [a, b, c] = about.stats
  return (
    <div id="about" data-page-builder-section="statsSection" className="relative z-1 scroll-mt-(--site-header-height) border-t bg-theme-bg">
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:divide-x">
        <div className="px-12 py-20 lg:px-20"><Eyebrow>{about.eyebrow}</Eyebrow></div>
        <div className="px-12 pt-168 pb-20 lg:px-20 lg:pt-20 lg:pb-348">
          <AnimatedParagraphs paragraphs={about.paragraphs} className="text-body-30" />
        </div>
      </div>
      <div>
        <div className="grid grid-cols-1 *:min-h-200 lg:grid-cols-4 lg:grid-rows-[repeat(5,--spacing(200))]">
          <Stat value={a.value} label={a.label} size="text-digit-10" className="bg-black text-white -mb-1 -ml-1 lg:sticky lg:top-(--site-header-height) lg:col-start-3 lg:row-start-1" />
          <Stat value={b.value} label={b.label} size="text-digit-30" className="bg-mint text-black lg:col-span-2 lg:col-start-1 lg:row-span-4 lg:row-start-2 lg:border-t lg:border-r [&>p:nth-child(2)]:ml-auto" />
          <Stat value={c.value} label={c.label} size="text-digit-20" className="bg-grey text-black lg:sticky lg:top-(--site-header-height) lg:col-start-4 lg:row-span-2 lg:row-start-2 lg:border-t lg:border-l lg:shadow-border-b" />
        </div>
      </div>
    </div>
  )
}

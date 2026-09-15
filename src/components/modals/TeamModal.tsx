import { team, type TeamMember } from '../../data/site'
import { AnimatedParagraphs, AnimatedText } from '../AnimatedText'
import { ButtonLink } from '../Button'
import { Dither } from '../Dither'
import { ArrowIcon, Mark } from '../Logo'
import { Modal } from '../Modal'
import { ShaderCanvas, ShaderImage } from '../ShaderField'

function Member({ m }: { m: TeamMember }) {
  const label = `${m.first}-${m.last}`.replace(/^./, (c) => c.toUpperCase())
  return (
    <Modal name={m.slug} label={label}>
      <div className="grid min-h-full grid-rows-[auto_1fr] lg:grid-rows-[minmax(max-content,1fr)_minmax(max-content,1fr)]">
        <div className="relative isolate flex min-h-400 flex-col overflow-hidden">
          <ShaderCanvas position="absolute" zIndex={0}>
            <div className="absolute top-0 right-0 z-1 border-b border-l bg-theme-bg p-10 font-mono text-caption-10 text-theme-fg uppercase">{m.role}</div>
            <div className="pointer-events-none absolute inset-0"><ShaderImage src={m.image} /></div>
            {m.calendly && <ButtonLink variant="mint" size="row" href={m.calendly} target="_blank" rel="noopener" className="z-1 mt-auto lg:absolute lg:right-0 lg:bottom-0 lg:max-w-1/2">Schedule a quick call</ButtonLink>}
          </ShaderCanvas>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="order-2 flex flex-col lg:order-1">
            <div className="bg-theme-fg px-12 pt-52 pb-20 text-theme-bg lg:px-20"><h2 className="text-body-20"><AnimatedText text={`${m.first}\n${m.last}`} viewport={false} /></h2></div>
            <div className="flex flex-1 flex-col">
              <div className="relative isolate aspect-[1.5] flex-1 lg:aspect-auto">
                <div className="pointer-events-none absolute inset-0 z-0"><Dither /></div>
                <div className="pointer-events-none absolute inset-0 z-1 flex w-full items-center justify-center">
                  <div className="perspective-[1000px]"><div className="vt-exclude transform-3d origin-center animate-hero-logo-coin motion-reduce:animate-none"><Mark className="h-auto w-140 max-w-full text-grey" /></div></div>
                </div>
              </div>
            </div>
            <ul className="flex divide-x border-t">
              {m.email && <li className="w-full"><ButtonLink variant="bg" size="row" href={`mailto:${m.email}`} icon={<ArrowIcon className="shrink-0 size-10" />}>Email</ButtonLink></li>}
              {m.linkedin && <li className="w-full"><ButtonLink variant="bg" size="row" href={m.linkedin} target="_blank" rel="noopener" icon={<ArrowIcon className="shrink-0 size-10" />}>LinkedIn</ButtonLink></li>}
            </ul>
          </div>
          <div className="order-1 flex flex-col gap-40 bg-grey px-12 py-20 text-black lg:order-2 lg:px-20">
            {m.bio.length > 0 && (
              <div>
                <h3 className="mb-24 font-semibold">Bio</h3>
                <AnimatedParagraphs paragraphs={m.bio} viewport={false} delay={0.3} />
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}

export function TeamModals() {
  return <>{team.members.map((m) => <Member key={m.slug} m={m} />)}</>
}

import { privacy } from '../../data/site'
import { AnimatedText } from '../AnimatedText'
import { Modal } from '../Modal'

export function PrivacyModal() {
  return (
    <Modal name="privacyPolicy" label="PrivacyPolicy">
      <div className="flex min-h-full flex-col">
        <p className="border-b px-12 py-20 pt-120 text-headline-40 lg:px-20 lg:pt-188"><AnimatedText text={privacy.title} viewport={false} /></p>
        <div className="flex-1 bg-theme-fg px-12 py-20 text-theme-bg lg:px-20">
          <div className="flex w-full flex-col gap-[1em]">
            <AnimatedText as="div" text={privacy.intro} className="block" viewport={false} delay={0.2} />
            <AnimatedText as="div" text={privacy.updated} className="block font-sans text-body-10 opacity-90" viewport={false} delay={0.3} />
            {privacy.sections.map((s) => (
              <div key={s.h} className="contents">
                <h3 className="mt-[0.5em] text-headline-20 first:mt-0"><AnimatedText text={s.h} viewport={{ margin: '0px', amount: 0 }} /></h3>
                {s.p.map((p) => <AnimatedText key={p.slice(0, 20)} as="div" text={p} className="block" viewport={{ margin: '0px', amount: 0 }} />)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}

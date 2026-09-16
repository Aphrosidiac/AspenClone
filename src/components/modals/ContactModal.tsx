import { useRef, useState, type DragEvent } from 'react'
import { brand } from '../../data/site'
import { AnimatedText } from '../AnimatedText'
import { ButtonLink } from '../Button'
import { AnalogClock } from '../Clocks'
import { ExternalIcon } from '../Logo'
import { Modal } from '../Modal'
import { cx } from '../../lib/cx'

function CopyButton({ text }: { text: string }) {
  const [ok, setOk] = useState(false)
  return (
    <>
      <button type="button" aria-label="Copy to clipboard" title="Copy" onClick={() => { navigator.clipboard?.writeText(text).then(() => { setOk(true); setTimeout(() => setOk(false), 1600) }) }}
        className="flex size-32 shrink-0 items-center justify-center text-current/35 transition-[color,transform] duration-200 hover:text-current focus-visible:outline-1 focus-visible:outline-offset-2 active:scale-[0.94] motion-reduce:transition-colors motion-reduce:active:scale-100">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-18">
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          <path d="m12 15 2 2 4-4" className="transition-[opacity,stroke-dashoffset] duration-200 ease-out motion-reduce:transition-none" style={{ opacity: ok ? 1 : 0, strokeDasharray: 8, strokeDashoffset: ok ? 0 : 8 }} />
        </svg>
      </button>
      <span role="status" className="sr-only">{ok ? 'Copied' : ''}</span>
    </>
  )
}

const ACCEPT = '.pdf,.doc,.txt,application/pdf,application/msword,text/plain'
const MAX = 5 * 1024 * 1024

/** Upload CV dropzone. Local test: the file is validated and acknowledged, nothing is sent anywhere. */
function UploadCv() {
  const input = useRef<HTMLInputElement>(null)
  const [state, setState] = useState<{ kind: 'idle' | 'over' | 'done' | 'error'; msg?: string }>({ kind: 'idle' })
  const take = (f: File | undefined) => {
    if (!f) return
    if (f.size > MAX) { setState({ kind: 'error', msg: 'That file is over 5MB' }); return }
    if (!/\.(pdf|doc|txt)$/i.test(f.name)) { setState({ kind: 'error', msg: 'PDF, DOC or TXT only' }); return }
    setState({ kind: 'done', msg: f.name })
  }
  const onDrop = (e: DragEvent) => { e.preventDefault(); take(e.dataTransfer.files?.[0]) }
  return (
    <form className="relative flex min-h-400 flex-col bg-theme-fg text-theme-bg" onSubmit={(e) => e.preventDefault()} onDragOver={(e) => { e.preventDefault(); setState((s) => (s.kind === 'idle' ? { kind: 'over' } : s)) }} onDragLeave={() => setState((s) => (s.kind === 'over' ? { kind: 'idle' } : s))} onDrop={onDrop}>
      <input autoComplete="off" tabIndex={-1} aria-hidden="true" className="pointer-events-none absolute -left-[9999px] -z-1 h-px w-px overflow-hidden opacity-0" type="text" name="website" />
      <h2 className="px-12 pt-20 text-headline-20 lg:px-20">Upload a brief</h2>
      <input ref={input} accept={ACCEPT} className="sr-only" tabIndex={-1} aria-hidden="true" type="file" name="cv" onChange={(e) => take(e.target.files?.[0])} />
      <button type="button" aria-label="Upload a brief: drag and drop a file or click to browse" onClick={() => input.current?.click()}
        className={cx('group flex flex-1 flex-col items-center justify-center gap-12 px-12 py-40 text-center outline-none transition-opacity duration-200 ease-out focus-visible:bg-theme-bg/5 disabled:cursor-default lg:px-20', state.kind === 'over' && 'bg-theme-bg/5')}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 28" aria-hidden="true" className="shrink-0 size-40 transition-transform duration-300 ease-out group-hover:-translate-y-4">
          <path fill="currentColor" d="M2 1h24v1.5H2V1Zm12 5.2 8.4 8.4-1.06 1.06L14.75 9.07V27h-1.5V9.07l-6.59 6.59L5.6 14.6 14 6.2Z" />
        </svg>
        <span className="text-body-10">{state.kind === 'done' ? `Received ${state.msg}` : state.kind === 'error' ? state.msg : 'Upload here'}</span>
      </button>
      <div className="flex items-center justify-between px-12 pb-20 font-mono text-caption-10 uppercase lg:px-20 text-theme-bg/80">
        <span>.PDF .DOC .TXT</span>
        <span>Max size_5MB</span>
      </div>
      <span aria-live="polite" className="sr-only">{state.kind === 'done' ? `File ${state.msg} received` : ''}</span>
    </form>
  )
}

export function ContactModal() {
  return (
    <Modal name="contact" label="Contact">
      <div className="grid min-h-full grid-rows-[auto_1fr] lg:grid-rows-[minmax(max-content,1fr)_minmax(max-content,1fr)]">
        <div className="grid grid-cols-1 divide-y lg:grid-cols-2 lg:divide-x lg:divide-y-0">
          <div className="flex flex-col justify-between pt-120 lg:pt-0">
            <p className="px-12 py-20 text-headline-20 lg:px-20"><AnimatedText text="Contact" viewport={false} /></p>
            <ButtonLink variant="mint" size="row" href={brand.calendly} target="_blank" rel="noopener" className="fixed inset-x-0 bottom-0 z-1 lg:relative lg:inset-x-auto lg:bottom-auto">Schedule a quick call</ButtonLink>
          </div>
          <div className="flex flex-col">
            <ul className="divide-y border-b">
              <li className="flex items-center px-12 lg:px-20"><span className="inline-flex items-center gap-[1ch] h-60 flex-1"><span className="flex-1"><a className="flex h-full items-center" href={`mailto:${brand.email}`}><span className="block shrink-0 pr-[1ch]">E: </span>{brand.email}</a></span><CopyButton text={brand.email} /></span></li>
              <li className="flex items-center px-12 lg:px-20"><span className="inline-flex items-center gap-[1ch] h-60 flex-1"><span className="flex-1"><a className="flex h-full items-center" href={`tel:${brand.phone}`}><span className="block shrink-0 pr-[1ch]">T: </span>{brand.phone}</a></span><CopyButton text={brand.phone} /></span></li>
            </ul>
            <ul className="flex divide-x border-b"><li className="w-full"><ButtonLink variant="bg" size="row" href={brand.linkedin} target="_blank" rel="noopener" icon={<ExternalIcon />}>Linkedin</ButtonLink></li></ul>
            <div className="mt-auto px-12 py-20 lg:px-20">
              <div className="grid grid-cols-2 gap-12 lg:grid-cols-1"><AnalogClock zone="KL" /><AnalogClock zone="NYC" /></div>
            </div>
          </div>
        </div>
        <UploadCv />
      </div>
    </Modal>
  )
}

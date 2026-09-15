/** Resolves once every face the site sets text in is actually loaded (not merely "no pending loads"). */
let p: Promise<void> | null = null
export function fontsReady(): Promise<void> {
  if (p) return p
  if (typeof document === 'undefined' || !document.fonts) return (p = Promise.resolve())
  p = Promise.all([
    document.fonts.load('450 16px suisseIntl'),
    document.fonts.load('400 16px suisseIntl'),
    document.fonts.load('600 16px suisseIntl'),
    document.fonts.load('400 12px suisseIntlMono'),
  ]).then(() => document.fonts.ready).then(() => undefined).catch(() => undefined)
  return p
}

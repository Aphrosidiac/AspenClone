import content from './content.json'

export const brand = {
  name: 'FF',
  longName: 'FF Dev Studio',
  heroWords: ['FF', 'Studio'] as const,
  email: 'hello@ffdev.studio',
  phone: '+60 13-907 8719',
  linkedin: 'https://www.linkedin.com/company/ff-dev-studio/',
  calendly: 'https://calendly.com/ffdevstudio',
  credit: { label: 'FF Dev Studio', href: 'https://ffdev.studio/' },
}

export const nav = [
  { href: '#about', text: 'About' },
  { href: '#clients', text: 'Clients' },
  { href: '#testimonials', text: 'Testimonials' },
  { href: '#team', text: 'Team' },
]

export const hero = {
  slogan: ['built', 'properly.'],
  intro: 'Websites, web apps and internal tools for founders and small teams — designed, built and shipped by the same person you talk to on day one.',
  cta: 'Start a conversation',
  welcome: ["We don't run a pipeline. We take on a few builds at a time and finish every one of them properly.", '', 'Logos below are placeholders:'],
  hires: [
    { src: '/img/logos/hire-1.svg', w: 100, h: 80 },
    { src: '/img/logos/hire-2.svg', w: 100, h: 80 },
    { src: '/img/logos/hire-3.svg', w: 100, h: 80 },
    { src: '/img/logos/hire-4.svg', w: 100, h: 80 },
    { src: '/img/logos/hire-5.png', w: 320, h: 320 },
    { src: '/img/logos/hire-6.png', w: 1280, h: 348 },
  ],
}

export const about = {
  eyebrow: 'About FF',
  paragraphs: [
    "FF Dev Studio started from a simple frustration: most small businesses get a website through three layers of people, and the one who actually writes the code never hears what the owner wanted. The brief drifts, the timeline slips, and the result looks like every other template on the internet.",
    "So we removed the layers. At FF you brief the person who designs it, builds it and launches it — one conversation, one point of contact, one standard. We build things that hold up: fast, custom, maintained after launch. This site is a demonstration of that standard, and every name, number and logo on it is illustrative.",
  ],
  stats: [
    { value: '60+', label: 'Builds shipped for founders and teams' },
    { value: 'RM1K-5K', label: 'Where most projects land' },
    { value: '30', label: 'Day defect warranty on every launch' },
  ],
}

export const insights = {
  title: 'Built by\nthe person\nyou brief',
  text: "FF Dev Studio is a one-person studio with a small bench of collaborators. We design and build websites, web apps and the internal tools that run a business — and because the same hands do every part, nothing gets lost between the brief and the launch.",
  cta: 'Talk to the builder',
  items: [
    { title: 'Brand\nWebsites', text: 'The site that has to carry your name. Custom design, real motion, fast on a phone, and copy that sounds like you instead of a template. Built to be found, and built to be kept.', bullets: ['Custom design and motion', 'Performance and SEO baked in', 'CMS where you actually need one', 'Launch, domain and hosting handled'] },
    { title: 'Web Apps\n& Dashboards', text: 'The software behind the business: portals your customers log into, dashboards your team lives in, and the workflows that used to live in a spreadsheet. Scoped tightly, shipped in weeks.', bullets: ['Customer and staff portals', 'Order, booking and inventory flows', 'Reporting and analytics', 'Accounting and payment integrations'] },
    { title: 'Automation\n& AI', text: 'Where a person is copying data between systems, we replace the copying. WhatsApp agents, document parsing, syncs between the tools you already pay for — practical AI that removes a job, not a demo that adds one.', bullets: ['WhatsApp and chat agents', 'Document and PDF extraction', 'System-to-system syncs', 'Scheduled reports and alerts'] },
    { title: 'Care\n& Hosting', text: 'A launch is the start, not the finish. Monthly care plans cover hosting, updates, monitoring and the small changes a business keeps needing — from the same person who built it.', bullets: ['Hosting and backups', 'Uptime and error monitoring', 'Content and feature changes', 'Priority response'] },
  ],
}

export const clients = {
  eyebrow: 'Who we work with',
  title: 'Clients',
  text: "We work with founders, family businesses and small teams who want one thing built well rather than ten things built badly. The marks in this wall are placeholders carried over from the reference layout — FF Dev Studio has no relationship with any of them. This is a demonstration site; the real client list is on ffdev.studio.",
  cta: 'Work with us',
  items: [
    { name: 'Headlands', category: 'Quant Finance', logo: '/img/clients/headlands.svg', bg: '#004b87' },
    { name: 'Two Sigma', category: 'Quant Finance', logo: '/img/clients/two-sigma.svg', bg: '#009aa6' },
    { name: 'EQR - Citadel', category: 'Quant Finance', logo: '/img/clients/citadel.svg', bg: '#08225a' },
    { name: 'Vatic Labs', category: 'AI', logo: '/img/clients/vatic-labs.png', bg: '#262160' },
    { name: 'GQS - Citadel', category: 'Quant Finance', logo: '/img/clients/citadel.svg', bg: '#08225a' },
    { name: 'Syntria', category: 'AI', logo: '/img/clients/syntria.png', bg: '#03598c' },
  ],
}

export type Testimonial = (typeof content.testimonials)[number]
export const testimonials = content.testimonials

export type TeamMember = (typeof content.team)[number]
export const displayName = (m: TeamMember) => `${m.first}\n${m.last}`
export const team = {
  eyebrow: "Who you'll actually work with",
  title: 'Team',
  tagline: 'Small team.\nHigh Signal.',
  text: "FF is a studio where the people with the titles still do the work. No account managers, no hand-offs to a bench you never meet. When you talk to someone at FF, you're talking to the person who will design, build and launch your project. The four profiles below are fictional, created for this demonstration.",
  members: content.team,
}

export const banner = { words: ["Let's", 'Start', 'Conversation', 'a'], cta: 'Get in Touch' }

export const footer = {
  tagline: 'Build it\nproperly',
  cta: { title: 'Let’s start a\nconversation', label: 'Start a conversation' },
}

export const privacy = {
  title: 'Privacy Policy',
  intro: 'FF Dev Studio ("we", "us", "our") is an independent web and software studio. This policy explains the limited information we handle when you visit our website or get in touch, how we use it, and the choices you have. We have built this site to be privacy-friendly by default.',
  updated: 'Last updated: 24 June 2026',
  sections: [
    { h: 'Who we are', p: ['FF Dev Studio is the data controller for any personal information handled through this website. If you have a question about this policy or the data we hold, contact us at hello@ffdev.studio.'] },
    { h: 'A cookie-free site', p: ['This website does not use cookies. We set no advertising, tracking, or marketing cookies, we do not build profiles of visitors, and we do not track you across other sites. Because there are no cookies, there is no cookie banner to manage.'] },
    { h: 'Analytics', p: ['We use a privacy-focused analytics tool to understand how the site is used. It collects only anonymous, aggregated data such as page views and broad, country-level location, and it uses no cookies. It does not collect personal information and does not track individuals across websites.'] },
    { h: 'Briefs and document uploads', p: ['If you share a brief through our contact form, you can upload a document (PDF, DOC, or TXT). These files are stored securely and are used solely to understand and scope the project you are asking about.', 'Files in our temporary storage are retained for 30 days and are then automatically and permanently deleted from it. Where a brief turns into a project, we may keep a copy for as long as the engagement requires. We also retain a basic record of each submission, such as the original filename and upload date, as an audit trail.'] },
    { h: 'Information you send us', p: ['When you email us or use the contact options on this site, we receive the details you choose to share, such as your name and email address, so that we can respond and, where relevant, scope a project with you. We do not sell your personal information.'] },
    { h: 'Your rights', p: ['You can ask us to access, correct, or delete the personal information we hold about you, or to stop contacting you, at any time. To make a request, email hello@ffdev.studio and we will respond promptly.'] },
    { h: 'Changes to this policy', p: ['We may update this policy from time to time. Any changes will be reflected on this page, with the "Last updated" date above revised accordingly. We encourage you to review it periodically.'] },
  ],
}

import content from './content.json'

export const brand = {
  name: 'FF',
  longName: 'FF Dev Studio',
  heroWords: ['FF', 'Studio'] as const,
  email: 'hello@ffdev.studio',
  phone: '+1 (424) 343-6762',
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
  slogan: ['placing', 'winners.'],
  intro: 'Placing software engineers, quantitative researchers, and AI/ML scientists into the firms shaping markets and technology since 2006.',
  cta: 'Start a conversation',
  welcome: ["We don't move volume. We move careers that compound — and the firms smart enough to invest in them.", '', 'Recent hires from:'],
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
    "FF Dev Studio was founded on a simple observation: the best quantitative researchers and engineers don't apply to jobs. They get one shot every few years to make a move, and they want that conversation to be with someone who actually understands the work — the systems, the strategies, the tradeoffs, and the difference between a fund that will sharpen them and one that will stall them.",
    "That's the bar we hold ourselves to. We've spent nearly two decades inside the hiring rooms of the top systematic firms and the venture-backed teams competing for the same minds. We don't pitch roles. We have honest conversations about where someone should spend the next five years of their career — and we're often the reason it's the right call.",
  ],
  stats: [
    { value: '500+', label: 'Placements since 2006' },
    { value: '$1M-5M', label: 'Range of recent offers' },
    { value: '19+', label: 'Years inside these hiring rooms' },
  ],
}

export const insights = {
  title: 'Connecting\ntop-tier\ntalent',
  text: "At FF Dev Studio, we don't just fill positions—we build careers and transform companies. We specialize in connecting exceptional engineering and research talent with the world's most innovative quantitative trading firms and venture-backed technology companies.",
  cta: 'Talk to a partner',
  items: [
    { title: 'Quantitative\nResearch', text: 'Researchers who own a signal end to end, from first idea to live capital. We know which pods are actually hiring, how each firm structures its research stack, and what a real offer looks like before you ever see one.', bullets: ['Signal research', 'Portfolio construction', 'Systematic equities and futures', 'PhD and post-doc moves'] },
    { title: 'Engineering\n& Infrastructure', text: 'The engineers who keep a strategy alive in production: execution, market data, and the platforms researchers build on top of. Most arrive from big tech and want an honest read on what the switch really feels like.', bullets: ['Low-latency C++', 'Execution and order routing', 'Market data pipelines', 'Research platform teams'] },
    { title: 'AI &\nMachine Learning', text: 'Researchers and engineers moving between frontier labs, venture-backed teams, and the funds now bidding for exactly the same people. We can tell you how the compute, the data access, and the equity actually compare.', bullets: ['Applied AI engineering', 'ML and deep learning research', 'Training infrastructure', 'Founding technical hires'] },
    { title: 'Leadership\n& Team Builds', text: 'Whole functions, not single seats. Some of these searches start with one researcher and end, years later, with a desk, a platform team, and the person running both.', bullets: ['Heads of research', 'Engineering leadership', 'New desk buildouts', 'Multi-year hiring plans'] },
  ],
}

export const clients = {
  eyebrow: 'Who we work with',
  title: 'Clients',
  text: "Our client relationships have existed for nearly two decades. They're not logos we collected — they're firms we've helped staff through generations of hiring, from a single quant researcher to entire engineering organizations. We work with the firms that pay the top of the market, run the best research environments, and treat hiring as a long game.",
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
export const team = {
  eyebrow: "Who you'll actually work with",
  title: 'Team',
  tagline: 'Small team.\nHigh Signal.',
  text: "FF is run by partners who do the work themselves. No junior researchers cold-DMing candidates, no algorithmic outreach, no spray-and-pray. When you talk to someone at FF, you're talking to the person who will run your search from intake to offer.",
  members: content.team,
}

export const banner = { words: ["Let's", 'Start', 'Conversation', 'a'], cta: 'Get in Touch' }

export const footer = {
  tagline: 'Raise your\ntrajectory',
  cta: { title: 'Let’s start a\nconversation', label: 'Start a conversation' },
}

export const privacy = {
  title: 'Privacy Policy',
  intro: 'FF Dev Studio ("we", "us", "our") is a boutique executive search firm. This policy explains the limited information we handle when you visit our website or get in touch, how we use it, and the choices you have. We have built this site to be privacy-friendly by default.',
  updated: 'Last updated: 24 June 2026',
  sections: [
    { h: 'Who we are', p: ['FF Dev Studio is the data controller for any personal information handled through this website. If you have a question about this policy or the data we hold, contact us at hello@ffdev.studio.'] },
    { h: 'A cookie-free site', p: ['This website does not use cookies. We set no advertising, tracking, or marketing cookies, we do not build profiles of visitors, and we do not track you across other sites. Because there are no cookies, there is no cookie banner to manage.'] },
    { h: 'Analytics', p: ['We use a privacy-focused analytics tool to understand how the site is used. It collects only anonymous, aggregated data such as page views and broad, country-level location, and it uses no cookies. It does not collect personal information and does not track individuals across websites.'] },
    { h: 'CV and document uploads', p: ['If you share your CV through our contact form, you can upload a document (PDF, DOC, or TXT). These files are stored securely and are used solely for recruitment and related HR purposes, such as assessing your suitability for relevant roles and progressing your application.', 'Files in our temporary storage are retained for 30 days and are then automatically and permanently deleted from it. Where your application is relevant to a current or future search, we may download and keep a copy for as long as is necessary for recruitment and related HR purposes. We also retain a basic record of each submission, such as the original filename and upload date, as an audit trail.'] },
    { h: 'Information you send us', p: ['When you email us or use the contact options on this site, we receive the details you choose to share, such as your name and email address, so that we can respond and, where relevant, discuss opportunities with you. We do not sell your personal information.'] },
    { h: 'Your rights', p: ['You can ask us to access, correct, or delete the personal information we hold about you, or to stop contacting you, at any time. To make a request, email hello@ffdev.studio and we will respond promptly.'] },
    { h: 'Changes to this policy', p: ['We may update this policy from time to time. Any changes will be reflected on this page, with the "Last updated" date above revised accordingly. We encourage you to review it periodically.'] },
  ],
}

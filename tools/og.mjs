import sharp from 'sharp'
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#232323"/>
  <g transform="translate(120 190) scale(2.6)" fill="#ffffff">
    <path d="M0 72 16 0h14L14 72Z"/><path d="M24 72 40 0h14L38 72Z"/>
    <path d="M72 0h54v15H88v13h32v14H88v30H72Z"/><path d="M140 0h54v15h-38v13h32v14h-32v30h-16Z"/>
  </g>
  <rect x="120" y="440" width="160" height="26" fill="#a1ffcb"/>
  <text x="128" y="459" font-family="Menlo, monospace" font-size="16" fill="#232323" letter-spacing="1">FF DEV STUDIO</text>
  <text x="120" y="530" font-family="Helvetica, Arial, sans-serif" font-size="34" fill="#ffffff">Executive search for quantitative finance &amp; tech</text>
</svg>`
await sharp(Buffer.from(svg)).png().toFile('public/img/og.png')
console.log('og ok')

import * as THREE from 'three'
import { FluidSim } from './fluid'

/**
 * Animated perlin-fbm wave field quantised through an 8×8 Bayer matrix to two colours (black/white),
 * with a fluid-sim dye trail thresholded into mint — the reference's `Dither` background, re-implemented
 * without R3F. Defaults measured from the bundle: speed .006, frequency 3, amplitude .4, colorNum 2, pixelSize 2.
 */
const NOISE = /* glsl */ `
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }
  float cnoise(vec2 P) {
    vec4 Pi = floor(P.xyxy) + vec4(0.0,0.0,1.0,1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0,0.0,1.0,1.0);
    Pi = mod289(Pi);
    vec4 ix = Pi.xzxz; vec4 iy = Pi.yyww; vec4 fx = Pf.xzxz; vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = fract(i * (1.0/41.0)) * 2.0 - 1.0; vec4 gy = abs(gx) - 0.5; vec4 tx = floor(gx + 0.5); gx = gx - tx;
    vec2 g00 = vec2(gx.x, gy.x); vec2 g10 = vec2(gx.y, gy.y); vec2 g01 = vec2(gx.z, gy.z); vec2 g11 = vec2(gx.w, gy.w);
    vec4 norm = taylorInvSqrt(vec4(dot(g00,g00), dot(g01,g01), dot(g10,g10), dot(g11,g11)));
    g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x)); float n10 = dot(g10, vec2(fx.y, fy.y)); float n01 = dot(g01, vec2(fx.z, fy.z)); float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
  }
  #define OCTAVES 4
  float fbm(vec2 p) {
    float value = 0.0; float amp = 1.0; float freq = waveFrequency;
    for (int i = 0; i < OCTAVES; i++) { value += amp * abs(cnoise(p)); p *= freq; amp *= waveAmplitude; }
    return value;
  }
`
const QUAD_VS = /* glsl */ `precision mediump float; varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`
const DISTORT_FS = /* glsl */ `
  precision mediump float; uniform vec2 invResolution; uniform float aspect; uniform float waveFrequency; uniform float waveAmplitude; varying vec2 vUv;
  ${NOISE}
  void main(){ vec2 uv = gl_FragCoord.xy * invResolution; uv -= 0.5; uv.x *= aspect; float baseNoise = fbm(uv); float distortedNoise = fbm(uv + baseNoise * 0.5); gl_FragColor = vec4(distortedNoise, 0.0, 0.0, 1.0); }`
const WAVE_FS = /* glsl */ `
  precision mediump float; uniform vec2 invResolution; uniform float time; uniform float waveSpeed; uniform float waveFrequency; uniform float waveAmplitude; uniform vec3 waveColorDark; uniform vec3 waveColorLight; uniform float aspect; uniform sampler2D distortedNoiseMap; varying vec2 vUv;
  ${NOISE}
  float pattern(vec2 p, float distortedNoise) { vec2 p2 = p - time * waveSpeed; return fbm(p2 + distortedNoise * 0.1); }
  void main(){ vec2 uv = gl_FragCoord.xy * invResolution; uv -= 0.5; uv.x *= aspect; float distortedNoise = texture2D(distortedNoiseMap, vUv).r; float f = pattern(uv, distortedNoise); f = smoothstep(0.28, 0.72, f); f = pow(clamp(f, 0.0, 1.0), 1.2); vec3 col = mix(waveColorDark, waveColorLight, f); gl_FragColor = vec4(col, 1.0); }`
const DITHER_FS = /* glsl */ `
  precision mediump float; uniform sampler2D inputBuffer; uniform sampler2D dyeTexture; uniform vec2 resolution; uniform float colorNum; uniform float pixelSize; uniform vec3 trailColor; uniform float trailStrength; varying vec2 vUv;
  const float bayerMatrix8x8[64] = float[64](
    0.0/64.0, 48.0/64.0, 12.0/64.0, 60.0/64.0,  3.0/64.0, 51.0/64.0, 15.0/64.0, 63.0/64.0,
    32.0/64.0,16.0/64.0, 44.0/64.0, 28.0/64.0, 35.0/64.0,19.0/64.0, 47.0/64.0, 31.0/64.0,
    8.0/64.0, 56.0/64.0,  4.0/64.0, 52.0/64.0, 11.0/64.0,59.0/64.0,  7.0/64.0, 55.0/64.0,
    40.0/64.0,24.0/64.0, 36.0/64.0, 20.0/64.0, 43.0/64.0,27.0/64.0, 39.0/64.0, 23.0/64.0,
    2.0/64.0, 50.0/64.0, 14.0/64.0, 62.0/64.0,  1.0/64.0,49.0/64.0, 13.0/64.0, 61.0/64.0,
    34.0/64.0,18.0/64.0, 46.0/64.0, 30.0/64.0, 33.0/64.0,17.0/64.0, 45.0/64.0, 29.0/64.0,
    10.0/64.0,58.0/64.0,  6.0/64.0, 54.0/64.0,  9.0/64.0,57.0/64.0,  5.0/64.0, 53.0/64.0,
    42.0/64.0,26.0/64.0, 38.0/64.0, 22.0/64.0, 41.0/64.0,25.0/64.0, 37.0/64.0, 21.0/64.0);
  vec3 dither(vec2 uv, vec3 color) {
    vec2 scaledCoord = floor(uv * resolution / pixelSize);
    int x = int(mod(scaledCoord.x, 8.0)); int y = int(mod(scaledCoord.y, 8.0));
    float threshold = bayerMatrix8x8[y * 8 + x] - 0.25;
    float step_ = 1.0 / (colorNum - 1.0);
    color += threshold * step_;
    float bias = 0.18;
    color = clamp(color - bias, 0.0, 1.0);
    return floor(color * (colorNum - 1.0) + 0.5) / (colorNum - 1.0);
  }
  void main(){
    vec2 uv = vUv;
    vec2 normalizedPixelSize = pixelSize / resolution;
    vec2 uvPixel = normalizedPixelSize * floor(uv / normalizedPixelSize);
    vec4 color = texture2D(inputBuffer, uvPixel);
    color.rgb = dither(uv, color.rgb);
    float dye = texture2D(dyeTexture, uvPixel).r * trailStrength;
    vec2 scaledCoord = floor(uv * resolution / pixelSize);
    int bx = int(mod(scaledCoord.x, 8.0)); int by = int(mod(scaledCoord.y, 8.0));
    float trailThreshold = bayerMatrix8x8[by * 8 + bx];
    float mask = step(trailThreshold, dye);
    gl_FragColor = vec4(mix(color.rgb, trailColor, mask), 1.0);
  }`

export type DitherOptions = { waveSpeed?: number; waveFrequency?: number; waveAmplitude?: number; mainColor?: string; bgColor?: string; colorNum?: number; pixelSize?: number; trailColor?: string; interactive?: boolean }

export class DitherField {
  renderer: THREE.WebGLRenderer
  canvas: HTMLCanvasElement
  private scene = new THREE.Scene()
  private cam = new THREE.Camera()
  private quad: THREE.Mesh
  private distortMat: THREE.ShaderMaterial
  private waveMat: THREE.ShaderMaterial
  private ditherMat: THREE.ShaderMaterial
  private noiseRT: THREE.WebGLRenderTarget
  private sceneRT: THREE.WebGLRenderTarget
  private fluid: FluidSim | null = null
  private needNoise = true
  private last = 0
  private raf = 0
  private running = false
  private pointer = { x: 0, y: 0, hasLast: false }
  private ro: ResizeObserver
  private onMove: (e: PointerEvent) => void
  private onLeave: () => void
  constructor(private el: HTMLElement, opts: DitherOptions = {}) {
    const o = { waveSpeed: 0.006, waveFrequency: 3, waveAmplitude: 0.4, mainColor: '#888888', bgColor: '#e0e0e0', colorNum: 2, pixelSize: 2, trailColor: '#a1ffcb', interactive: true, ...opts }
    this.renderer = new THREE.WebGLRenderer({ antialias: false, stencil: false, depth: false, powerPreference: 'high-performance', alpha: false })
    this.renderer.setPixelRatio(1)
    this.canvas = this.renderer.domElement
    this.canvas.style.display = 'block'
    el.appendChild(this.canvas)
    const rt = () => new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, depthBuffer: false, stencilBuffer: false })
    this.noiseRT = rt(); this.sceneRT = rt()
    const u = {
      invResolution: { value: new THREE.Vector2() }, resolution: { value: new THREE.Vector2() }, aspect: { value: 1 }, time: { value: 0 },
      waveSpeed: { value: o.waveSpeed }, waveFrequency: { value: o.waveFrequency }, waveAmplitude: { value: o.waveAmplitude },
      waveColorDark: { value: new THREE.Color(o.mainColor) }, waveColorLight: { value: new THREE.Color(o.bgColor) },
    }
    this.distortMat = new THREE.ShaderMaterial({ vertexShader: QUAD_VS, fragmentShader: DISTORT_FS, depthTest: false, depthWrite: false, uniforms: { invResolution: u.invResolution, aspect: u.aspect, waveFrequency: u.waveFrequency, waveAmplitude: u.waveAmplitude } })
    this.waveMat = new THREE.ShaderMaterial({ vertexShader: QUAD_VS, fragmentShader: WAVE_FS, depthTest: false, depthWrite: false, uniforms: { ...u, distortedNoiseMap: { value: this.noiseRT.texture } } })
    this.ditherMat = new THREE.ShaderMaterial({ vertexShader: QUAD_VS, fragmentShader: DITHER_FS, depthTest: false, depthWrite: false, uniforms: { inputBuffer: { value: this.sceneRT.texture }, dyeTexture: { value: null }, resolution: u.resolution, colorNum: { value: o.colorNum }, pixelSize: { value: o.pixelSize }, trailColor: { value: new THREE.Color(o.trailColor) }, trailStrength: { value: 0 } } })
    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.waveMat)
    this.scene.add(this.quad)
    this.resize()
    this.ro = new ResizeObserver(() => this.resize())
    this.ro.observe(el)
    const interactive = o.interactive && !matchMedia('(prefers-reduced-motion: reduce)').matches && !matchMedia('(hover: none)').matches
    this.onMove = (e: PointerEvent) => {
      if (!this.fluid) return
      const r = this.canvas.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) return
      const x = (e.clientX - r.left) / r.width, y = 1 - (e.clientY - r.top) / r.height
      if (!(x >= -0.05 && x <= 1.05 && y >= -0.05 && y <= 1.05)) { this.pointer.hasLast = false; return }
      if (this.pointer.hasLast) this.fluid.splat(x, y, x - this.pointer.x, y - this.pointer.y)
      this.pointer.x = x; this.pointer.y = y; this.pointer.hasLast = true
    }
    this.onLeave = () => { this.pointer.hasLast = false }
    if (interactive) {
      window.addEventListener('pointermove', this.onMove, { passive: true })
      window.addEventListener('pointerleave', this.onLeave)
      document.addEventListener('mouseleave', this.onLeave)
      this.ditherMat.uniforms.trailStrength.value = 1
    }
  }
  private resize() {
    const w = Math.max(1, Math.round(this.el.clientWidth)), h = Math.max(1, Math.round(this.el.clientHeight))
    this.renderer.setSize(w, h, true)
    this.noiseRT.setSize(w, h); this.sceneRT.setSize(w, h)
    const u = this.waveMat.uniforms
    u.resolution.value.set(w, h); u.invResolution.value.set(1 / w, 1 / h); u.aspect.value = w / h
    this.needNoise = true
    if (this.ditherMat.uniforms.trailStrength.value > 0) {
      this.fluid?.dispose()
      const t = 48 / h
      this.fluid = new FluidSim(this.renderer, w / h, { splatRadius: t * t })
      this.ditherMat.uniforms.dyeTexture.value = this.fluid.dyeTexture
    }
    this.renderFrame(0)
  }
  private renderFrame(dt: number) {
    const g = this.renderer
    if (this.needNoise) { this.quad.material = this.distortMat; g.setRenderTarget(this.noiseRT); g.render(this.scene, this.cam); this.needNoise = false }
    this.waveMat.uniforms.time.value += Math.min(dt, 0.1)
    this.quad.material = this.waveMat; g.setRenderTarget(this.sceneRT); g.render(this.scene, this.cam)
    if (this.fluid) { this.fluid.step(dt || 0.016); this.ditherMat.uniforms.dyeTexture.value = this.fluid.dyeTexture }
    this.quad.material = this.ditherMat; g.setRenderTarget(null); g.render(this.scene, this.cam)
  }
  start() {
    if (this.running) return
    this.running = true; this.last = performance.now()
    const loop = (t: number) => { if (!this.running) return; const dt = (t - this.last) / 1000; this.last = t; this.renderFrame(dt); this.raf = requestAnimationFrame(loop) }
    this.raf = requestAnimationFrame(loop)
  }
  stop() { this.running = false; cancelAnimationFrame(this.raf) }
  dispose() {
    this.stop(); this.ro.disconnect()
    window.removeEventListener('pointermove', this.onMove); window.removeEventListener('pointerleave', this.onLeave); document.removeEventListener('mouseleave', this.onLeave)
    this.fluid?.dispose(); this.noiseRT.dispose(); this.sceneRT.dispose(); this.distortMat.dispose(); this.waveMat.dispose(); this.ditherMat.dispose(); this.quad.geometry.dispose()
    this.renderer.dispose(); this.canvas.remove()
  }
}

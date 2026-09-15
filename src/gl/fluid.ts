import * as THREE from 'three'

/**
 * A small stable-fluids simulation whose dye field the dither pass thresholds into the mint cursor trail.
 * Velocity/pressure at `simRes`, dye at `dyeRes`; splats come from pointer deltas.
 */
const VS = /* glsl */ `
  varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB; uniform vec2 texelSize;
  void main(){ vUv = uv; vL = vUv - vec2(texelSize.x,0.); vR = vUv + vec2(texelSize.x,0.); vT = vUv + vec2(0.,texelSize.y); vB = vUv - vec2(0.,texelSize.y); gl_Position = vec4(position.xy,0.,1.); }`
const SPLAT = /* glsl */ `
  precision highp float; varying vec2 vUv; uniform sampler2D uTarget; uniform float aspectRatio; uniform vec3 color; uniform vec2 point; uniform float radius;
  void main(){ vec2 p = vUv - point.xy; p.x *= aspectRatio; vec3 splat = exp(-dot(p,p)/radius) * color; vec3 base = texture2D(uTarget, vUv).xyz; gl_FragColor = vec4(base + splat, 1.0); }`
const ADVECT = /* glsl */ `
  precision highp float; varying vec2 vUv; uniform sampler2D uVelocity; uniform sampler2D uSource; uniform vec2 texelSize; uniform float dt; uniform float dissipation;
  void main(){ vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize; vec4 result = texture2D(uSource, coord); float decay = 1.0 + dissipation * dt; gl_FragColor = result / decay; }`
const DIVERGENCE = /* glsl */ `
  precision mediump float; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB; uniform sampler2D uVelocity;
  void main(){ float L = texture2D(uVelocity, vL).x; float R = texture2D(uVelocity, vR).x; float T = texture2D(uVelocity, vT).y; float B = texture2D(uVelocity, vB).y; vec2 C = texture2D(uVelocity, vUv).xy;
    if (vL.x < 0.0) { L = -C.x; } if (vR.x > 1.0) { R = -C.x; } if (vT.y > 1.0) { T = -C.y; } if (vB.y < 0.0) { B = -C.y; }
    float div = 0.5 * (R - L + T - B); gl_FragColor = vec4(div, 0.0, 0.0, 1.0); }`
const PRESSURE = /* glsl */ `
  precision mediump float; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB; uniform sampler2D uPressure; uniform sampler2D uDivergence;
  void main(){ float L = texture2D(uPressure, vL).x; float R = texture2D(uPressure, vR).x; float T = texture2D(uPressure, vT).x; float B = texture2D(uPressure, vB).x; float divergence = texture2D(uDivergence, vUv).x; float pressure = (L + R + B + T - divergence) * 0.25; gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0); }`
const GRADIENT = /* glsl */ `
  precision mediump float; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB; uniform sampler2D uPressure; uniform sampler2D uVelocity;
  void main(){ float L = texture2D(uPressure, vL).x; float R = texture2D(uPressure, vR).x; float T = texture2D(uPressure, vT).x; float B = texture2D(uPressure, vB).x; vec2 velocity = texture2D(uVelocity, vUv).xy; velocity.xy -= vec2(R - L, T - B); gl_FragColor = vec4(velocity, 0.0, 1.0); }`
const CLEAR = /* glsl */ `
  precision mediump float; varying vec2 vUv; uniform sampler2D uTexture; uniform float value; void main(){ gl_FragColor = value * texture2D(uTexture, vUv); }`

type Pair = { read: THREE.WebGLRenderTarget; write: THREE.WebGLRenderTarget; swap: () => void }

export class FluidSim {
  private scene = new THREE.Scene()
  private camera = new THREE.Camera()
  private mesh: THREE.Mesh
  private velocity: Pair
  private dye: Pair
  private pressure: Pair
  private divergence: THREE.WebGLRenderTarget
  private mats: Record<string, THREE.ShaderMaterial>
  private simTexel: THREE.Vector2
  private dyeTexel: THREE.Vector2
  private pending: Array<{ x: number; y: number; dx: number; dy: number }> = []
  constructor(private gl: THREE.WebGLRenderer, aspect: number, private opts: { splatRadius: number; simRes?: number; dyeRes?: number; velocityDissipation?: number; dyeDissipation?: number; splatForce?: number }) {
    const simRes = opts.simRes ?? 96, dyeRes = opts.dyeRes ?? 192
    const size = (res: number) => (aspect >= 1 ? [Math.round(res * aspect), res] : [res, Math.round(res / aspect)])
    const [sw, sh] = size(simRes), [dw, dh] = size(dyeRes)
    this.simTexel = new THREE.Vector2(1 / sw, 1 / sh)
    this.dyeTexel = new THREE.Vector2(1 / dw, 1 / dh)
    const mk = (w: number, h: number) => new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType, format: THREE.RGBAFormat, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: false, stencilBuffer: false, wrapS: THREE.ClampToEdgeWrapping, wrapT: THREE.ClampToEdgeWrapping })
    const pair = (w: number, h: number): Pair => { const p = { read: mk(w, h), write: mk(w, h), swap() { const t = p.read; p.read = p.write; p.write = t } }; return p }
    this.velocity = pair(sw, sh); this.pressure = pair(sw, sh); this.dye = pair(dw, dh); this.divergence = mk(sw, sh)
    const m = (fs: string, uniforms: Record<string, THREE.IUniform>) => new THREE.ShaderMaterial({ vertexShader: VS, fragmentShader: fs, uniforms: { texelSize: { value: this.simTexel.clone() }, ...uniforms }, depthTest: false, depthWrite: false })
    this.mats = {
      splat: m(SPLAT, { uTarget: { value: null }, aspectRatio: { value: aspect }, color: { value: new THREE.Vector3() }, point: { value: new THREE.Vector2() }, radius: { value: opts.splatRadius } }),
      advect: m(ADVECT, { uVelocity: { value: null }, uSource: { value: null }, dt: { value: 0.016 }, dissipation: { value: 0.2 } }),
      divergence: m(DIVERGENCE, { uVelocity: { value: null } }),
      pressure: m(PRESSURE, { uPressure: { value: null }, uDivergence: { value: null } }),
      gradient: m(GRADIENT, { uPressure: { value: null }, uVelocity: { value: null } }),
      clear: m(CLEAR, { uTexture: { value: null }, value: { value: 0.8 } }),
    }
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.mats.splat)
    this.scene.add(this.mesh)
    for (const t of [this.velocity.read, this.velocity.write, this.dye.read, this.dye.write, this.pressure.read, this.pressure.write, this.divergence]) { gl.setRenderTarget(t); gl.clear() }
    gl.setRenderTarget(null)
  }
  get dyeTexture() { return this.dye.read.texture }
  private blit(mat: THREE.ShaderMaterial, target: THREE.WebGLRenderTarget) {
    this.mesh.material = mat
    const prev = this.gl.getRenderTarget()
    this.gl.setRenderTarget(target); this.gl.render(this.scene, this.camera); this.gl.setRenderTarget(prev)
  }
  /** x,y in 0..1 (y up), dx,dy = pointer delta in the same space */
  splat(x: number, y: number, dx: number, dy: number) { this.pending.push({ x, y, dx, dy }) }
  clear() { for (const t of [this.velocity.read, this.dye.read]) { this.gl.setRenderTarget(t); this.gl.clear() } this.gl.setRenderTarget(null) }
  step(dt: number) {
    dt = Math.min(dt, 0.033)
    const g = this.gl, M = this.mats
    for (const s of this.pending) {
      const force = this.opts.splatForce ?? 6000
      M.splat.uniforms.uTarget.value = this.velocity.read.texture
      M.splat.uniforms.point.value.set(s.x, s.y)
      M.splat.uniforms.color.value.set(s.dx * force, s.dy * force, 0)
      this.blit(M.splat, this.velocity.write); this.velocity.swap()
      M.splat.uniforms.uTarget.value = this.dye.read.texture
      const amount = Math.min(1, Math.hypot(s.dx, s.dy) * 40) * 0.5
      M.splat.uniforms.color.value.set(amount, amount, amount)
      this.blit(M.splat, this.dye.write); this.dye.swap()
    }
    this.pending.length = 0
    M.divergence.uniforms.uVelocity.value = this.velocity.read.texture
    this.blit(M.divergence, this.divergence)
    M.clear.uniforms.uTexture.value = this.pressure.read.texture
    this.blit(M.clear, this.pressure.write); this.pressure.swap()
    M.pressure.uniforms.uDivergence.value = this.divergence.texture
    for (let i = 0; i < 12; i++) { M.pressure.uniforms.uPressure.value = this.pressure.read.texture; this.blit(M.pressure, this.pressure.write); this.pressure.swap() }
    M.gradient.uniforms.uPressure.value = this.pressure.read.texture
    M.gradient.uniforms.uVelocity.value = this.velocity.read.texture
    this.blit(M.gradient, this.velocity.write); this.velocity.swap()
    M.advect.uniforms.texelSize.value = this.simTexel
    M.advect.uniforms.dt.value = dt
    M.advect.uniforms.uVelocity.value = this.velocity.read.texture
    M.advect.uniforms.uSource.value = this.velocity.read.texture
    M.advect.uniforms.dissipation.value = this.opts.velocityDissipation ?? 0.6
    this.blit(M.advect, this.velocity.write); this.velocity.swap()
    M.advect.uniforms.texelSize.value = this.dyeTexel
    M.advect.uniforms.uSource.value = this.dye.read.texture
    M.advect.uniforms.dissipation.value = this.opts.dyeDissipation ?? 1.6
    this.blit(M.advect, this.dye.write); this.dye.swap()
    g.setRenderTarget(null)
  }
  dispose() {
    for (const t of [this.velocity.read, this.velocity.write, this.dye.read, this.dye.write, this.pressure.read, this.pressure.write, this.divergence]) t.dispose()
    for (const m of Object.values(this.mats)) m.dispose()
    this.mesh.geometry.dispose()
  }
}

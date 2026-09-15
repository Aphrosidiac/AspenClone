import * as THREE from 'three'

/**
 * Cursor-reactive image planes: a pointer trail texture drives an RGB split, and a low-res fluid-ish
 * displacement field pushes 30×30 cells of the image. One canvas per host, one plane per registered image.
 * Re-implementation of the reference's `ShaderField` / `ShaderImage` behaviour.
 */
const RADIUS = 1.15 * 0.1
const SCREEN_VS = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`
const PLANE_VS = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`
const TRAIL_FS = /* glsl */ `
  precision highp float; varying vec2 vUv; uniform sampler2D uPrev; uniform vec2 uOldCursor; uniform vec2 uDelta; uniform float uNumSteps; uniform float uAmountPerStep; uniform float uRadiusSq; uniform float uInfluenceRadiusSq; uniform float uAspect; uniform float uFadeRate; uniform float uAgeRate; uniform float uShrink; uniform float uActive;
  void main(){
    vec4 prev = texture2D(uPrev, vUv);
    float intensity = prev.x * uFadeRate;
    float age = min(prev.z + uAgeRate, 1.0);
    float added = 0.0;
    if (uActive > 0.5) {
      for (int s = 0; s < 20; s++) {
        if (float(s) >= uNumSteps) break;
        float t = (float(s) + 0.5) / uNumSteps;
        vec2 d = vUv - (uOldCursor + uDelta * t);
        if (uAspect >= 1.0) d.x *= uAspect; else d.y /= uAspect;
        float distSq = dot(d, d);
        if (distSq < uInfluenceRadiusSq) { added += exp(-distSq / uRadiusSq) * uAmountPerStep; }
      }
    }
    float newIntensity = min(intensity + added, 1.0);
    float stamped = step(1e-5, added);
    float size = mix(1.0 - (1.0 - newIntensity) * uShrink, 1.0, stamped);
    float newAge = mix(age, 0.0, stamped);
    gl_FragColor = vec4(newIntensity, size, newAge, 1.0);
  }`
const DIST_FS = /* glsl */ `
  precision highp float; varying vec2 vUv; uniform sampler2D uPrev; uniform vec2 uCursor; uniform vec2 uVel; uniform float uMoving; uniform float uRadiusSq; uniform float uRadius2Sq; uniform float uAspect; uniform float uDecay; uniform float uIntensity; uniform float uDt;
  void main(){
    vec2 d = texture2D(uPrev, vUv).xy * (1.0 - uDecay * uDt);
    vec2 dd = vUv - uCursor;
    if (uAspect >= 1.0) dd.x *= uAspect; else dd.y /= uAspect;
    float distSq = dot(dd, dd);
    if (distSq < uRadius2Sq && uMoving > 0.5) { d += uVel * (exp(-distSq / uRadiusSq) * uIntensity * uDt * 0.5); }
    gl_FragColor = vec4(clamp(d, -1.0, 1.0), 0.0, 1.0);
  }`
const IMAGE_FS = /* glsl */ `
  precision highp float; varying vec2 vUv; uniform sampler2D uTexture; uniform float uHasTexture; uniform float uImageAspect; uniform float uPlaneAspect; uniform sampler2D uTrail; uniform sampler2D uDist; uniform float uStrength; uniform float uGridSize; uniform float uTrailPx;
  vec2 coverUv(vec2 uv) {
    if (uImageAspect > uPlaneAspect) { return vec2((uv.x - 0.5) * (uPlaneAspect / uImageAspect) + 0.5, uv.y); }
    return vec2(uv.x, (uv.y - 0.5) * (uImageAspect / uPlaneAspect) + 0.5);
  }
  float trailMask(vec2 uv) {
    float c = texture2D(uTrail, uv).x;
    float s1 = texture2D(uTrail, uv + vec2(uTrailPx, 0.0)).x; float s2 = texture2D(uTrail, uv + vec2(0.0, uTrailPx)).x;
    float s3 = texture2D(uTrail, uv + vec2(-uTrailPx, 0.0)).x; float s4 = texture2D(uTrail, uv + vec2(0.0, -uTrailPx)).x;
    return step(0.01, c * 0.5 + (s1 + s2 + s3 + s4) * 0.125);
  }
  void main(){
    if (uHasTexture < 0.5) { gl_FragColor = vec4(0.0); return; }
    float aspect = uPlaneAspect; bool wide = aspect > 1.0;
    float cellsX = max(wide ? uGridSize : uGridSize * aspect, 1.0);
    float cellsY = max(wide ? uGridSize / aspect : uGridSize, 1.0);
    vec2 cell = vec2((floor(vUv.x * cellsX) + 0.5) / cellsX, (floor(vUv.y * cellsY) + 0.5) / cellsY);
    vec2 disp = clamp(texture2D(uDist, cell).xy, -0.1, 0.1);
    vec2 uv = vUv - disp;
    vec2 offset = vec2((1.0 / aspect) * (uStrength * 0.1), 0.0);
    vec3 base = texture2D(uTexture, coverUv(uv)).rgb;
    float r = texture2D(uTexture, coverUv(uv - offset)).r;
    float b = texture2D(uTexture, coverUv(uv + offset)).b;
    vec3 col = mix(base, vec3(r, base.g, b), trailMask(uv));
    gl_FragColor = vec4(col, 1.0);
  }`

type Pair = { read: THREE.WebGLRenderTarget; write: THREE.WebGLRenderTarget; swap: () => void }
const pair = (n: number): Pair => {
  const mk = () => new THREE.WebGLRenderTarget(n, n, { type: THREE.HalfFloatType, format: THREE.RGBAFormat, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: false, stencilBuffer: false })
  const p = { read: mk(), write: mk(), swap() { const t = p.read; p.read = p.write; p.write = t } }
  return p
}

export type FieldEntry = { src: string; getRect: () => DOMRect | null; onReady?: () => void }

class Plane {
  mesh: THREE.Mesh
  private trail = pair(128)
  private dist = pair(30)
  private mat: THREE.ShaderMaterial
  private trailMat: THREE.ShaderMaterial
  private distMat: THREE.ShaderMaterial
  private state = { x: 0.5, y: 0.5, smvx: 0, smvy: 0, primed: false }
  private ready = false
  private readyFired = false
  private cancelled = false
  constructor(public entry: FieldEntry, gl: THREE.WebGLRenderer, private blit: (m: THREE.ShaderMaterial, t: THREE.WebGLRenderTarget) => void) {
    const u = { uTexture: { value: null as THREE.Texture | null }, uHasTexture: { value: 0 }, uImageAspect: { value: 1 }, uPlaneAspect: { value: 1 }, uTrail: { value: this.trail.read.texture }, uDist: { value: this.dist.read.texture }, uStrength: { value: 0.08 }, uGridSize: { value: 30 }, uTrailPx: { value: 1 / 128 } }
    this.mat = new THREE.ShaderMaterial({ vertexShader: PLANE_VS, fragmentShader: IMAGE_FS, uniforms: u, transparent: true })
    this.trailMat = new THREE.ShaderMaterial({ vertexShader: SCREEN_VS, fragmentShader: TRAIL_FS, uniforms: { uPrev: { value: null }, uOldCursor: { value: new THREE.Vector2(0.5, 0.5) }, uDelta: { value: new THREE.Vector2() }, uNumSteps: { value: 1 }, uAmountPerStep: { value: 0 }, uRadiusSq: { value: RADIUS * RADIUS }, uInfluenceRadiusSq: { value: 9 * RADIUS * RADIUS }, uAspect: { value: 1 }, uFadeRate: { value: 1 }, uAgeRate: { value: 0 }, uShrink: { value: 0.5 }, uActive: { value: 0 } } })
    this.distMat = new THREE.ShaderMaterial({ vertexShader: SCREEN_VS, fragmentShader: DIST_FS, uniforms: { uPrev: { value: null }, uCursor: { value: new THREE.Vector2(0.5, 0.5) }, uVel: { value: new THREE.Vector2() }, uMoving: { value: 0 }, uRadiusSq: { value: 0.01 }, uRadius2Sq: { value: 0.04 }, uAspect: { value: 1 }, uDecay: { value: 3 }, uIntensity: { value: 3 }, uDt: { value: 0.016 } } })
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), this.mat)
    this.mesh.visible = false
    const prevClear = new THREE.Color(); gl.getClearColor(prevClear); const prevAlpha = gl.getClearAlpha()
    gl.setClearColor(0, 0)
    for (const t of [this.trail.read, this.trail.write, this.dist.read, this.dist.write]) { gl.setRenderTarget(t); gl.clear() }
    gl.setRenderTarget(null); gl.setClearColor(prevClear, prevAlpha)
    fetch(entry.src, { mode: 'cors' }).then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.blob() }).then((b) => createImageBitmap(b, { imageOrientation: 'flipY' })).then((bmp) => {
      if (this.cancelled) { bmp.close(); return }
      const tex = new THREE.Texture(bmp); tex.flipY = false; tex.colorSpace = THREE.NoColorSpace; tex.minFilter = THREE.LinearFilter; tex.magFilter = THREE.LinearFilter; tex.needsUpdate = true
      u.uTexture.value = tex; u.uHasTexture.value = 1; u.uImageAspect.value = bmp.width / Math.max(1, bmp.height); this.ready = true
    }).catch((e) => console.error('[ShaderField] texture load failed', entry.src, e))
  }
  update(dt: number, pointer: { x: number; y: number; valid: boolean }, canvasRect: DOMRect, size: { w: number; h: number }) {
    const rect = this.entry.getRect()
    if (!this.ready || !rect || rect.width === 0 || rect.height === 0) { this.mesh.visible = false; return }
    if (rect.bottom < canvasRect.top - 400 || rect.top > canvasRect.bottom + 400 || rect.right < canvasRect.left - 400 || rect.left > canvasRect.right + 400) { this.mesh.visible = false; return }
    this.mesh.visible = true
    const cx = rect.left + rect.width / 2 - canvasRect.left, cy = rect.top + rect.height / 2 - canvasRect.top
    this.mesh.position.x = cx - size.w / 2; this.mesh.position.y = size.h / 2 - cy
    this.mesh.scale.set(rect.width, rect.height, 1)
    if (!this.readyFired) { this.readyFired = true; this.entry.onReady?.() }
    const aspect = rect.width / Math.max(1, rect.height)
    this.mat.uniforms.uPlaneAspect.value = aspect
    const f = Math.min(dt, 0.016)
    const s = this.state
    const px = pointer.valid ? (pointer.x - rect.left) / rect.width : -10
    const py = pointer.valid ? 1 - (pointer.y - rect.top) / rect.height : -10
    if (!s.primed) { s.x = px; s.y = py; s.smvx = 0; s.smvy = 0; s.primed = pointer.valid }
    const dx = px - s.x, dy = py - s.y
    const vx = f > 0 ? dx / f : 0, vy = f > 0 ? dy / f : 0
    s.smvx = 0.85 * s.smvx + 0.15 * vx; s.smvy = 0.85 * s.smvy + 0.15 * vy
    const len = Math.hypot(dx, dy)
    const steps = Math.min(20, Math.max(1, Math.ceil(len / Math.max(0.005, 0.5 * RADIUS))))
    const T = this.trailMat.uniforms
    T.uPrev.value = this.trail.read.texture; T.uOldCursor.value.set(s.x, s.y); T.uDelta.value.set(dx, dy); T.uNumSteps.value = steps; T.uAmountPerStep.value = (len / steps) * 50 * f; T.uAspect.value = aspect; T.uFadeRate.value = 1 - f / 0.5; T.uAgeRate.value = f / 0.5; T.uActive.value = +(len > 0.001)
    this.blit(this.trailMat, this.trail.write); this.trail.swap()
    const D = this.distMat.uniforms
    D.uPrev.value = this.dist.read.texture; D.uCursor.value.set(px, py); D.uVel.value.set(s.smvx, s.smvy); D.uMoving.value = +(Math.abs(vx) + Math.abs(vy) > 0.01); D.uAspect.value = aspect; D.uDt.value = f
    this.blit(this.distMat, this.dist.write); this.dist.swap()
    this.mat.uniforms.uTrail.value = this.trail.read.texture; this.mat.uniforms.uDist.value = this.dist.read.texture
    s.x = px; s.y = py
  }
  dispose() {
    this.cancelled = true
    ;(this.mat.uniforms.uTexture.value as THREE.Texture | null)?.dispose()
    this.mat.dispose(); this.trailMat.dispose(); this.distMat.dispose(); this.mesh.geometry.dispose()
    this.trail.read.dispose(); this.trail.write.dispose(); this.dist.read.dispose(); this.dist.write.dispose()
  }
}

export class ShaderField {
  renderer: THREE.WebGLRenderer
  canvas: HTMLCanvasElement
  private scene = new THREE.Scene()
  private camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1000, 1000)
  private blitScene = new THREE.Scene()
  private blitCam = new THREE.Camera()
  private blitMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2))
  private planes: Plane[] = []
  private pointer = { x: 0, y: 0, valid: false }
  private size = { w: 1, h: 1 }
  private raf = 0
  private last = 0
  private running = false
  private ro: ResizeObserver
  private onMove: (e: PointerEvent) => void
  constructor(private el: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' })
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    this.renderer.setClearColor(0, 0)
    this.canvas = this.renderer.domElement
    Object.assign(this.canvas.style, { position: 'absolute', inset: '0', pointerEvents: 'none', display: 'block' })
    el.appendChild(this.canvas)
    this.camera.position.set(0, 0, 1)
    this.blitScene.add(this.blitMesh)
    this.resize()
    this.ro = new ResizeObserver(() => this.resize()); this.ro.observe(el)
    this.onMove = (e) => { this.pointer.x = e.clientX; this.pointer.y = e.clientY; this.pointer.valid = true }
    window.addEventListener('pointermove', this.onMove, { passive: true })
    ;(window as unknown as { __shaderFields?: ShaderField[] }).__shaderFields ??= []
    ;(window as unknown as { __shaderFields: ShaderField[] }).__shaderFields.push(this)
  }
  debug() { return this.planes.map((p) => ({ visible: p.mesh.visible, pos: p.mesh.position.toArray(), scale: p.mesh.scale.toArray(), src: p.entry.src })) }
  private blit = (m: THREE.ShaderMaterial, t: THREE.WebGLRenderTarget) => {
    this.blitMesh.material = m
    const prev = this.renderer.getRenderTarget()
    this.renderer.setRenderTarget(t); this.renderer.render(this.blitScene, this.blitCam); this.renderer.setRenderTarget(prev)
  }
  private resize() {
    const w = Math.max(1, this.el.clientWidth), h = Math.max(1, this.el.clientHeight)
    this.size = { w, h }
    this.renderer.setSize(w, h, true)
    const c = this.camera; c.left = -w / 2; c.right = w / 2; c.top = h / 2; c.bottom = -h / 2; c.updateProjectionMatrix()
  }
  add(entry: FieldEntry) { const p = new Plane(entry, this.renderer, this.blit); this.planes.push(p); this.scene.add(p.mesh); return () => { this.scene.remove(p.mesh); p.dispose(); this.planes = this.planes.filter((x) => x !== p) } }
  frame = (t: number) => {
    if (!this.running) return
    const dt = (t - this.last) / 1000; this.last = t
    const rect = this.canvas.getBoundingClientRect()
    for (const p of this.planes) p.update(dt, this.pointer, rect, this.size)
    this.renderer.setRenderTarget(null); this.renderer.render(this.scene, this.camera)
    this.raf = requestAnimationFrame(this.frame)
  }
  start() { if (this.running) return; this.running = true; this.last = performance.now(); this.raf = requestAnimationFrame(this.frame) }
  stop() { this.running = false; cancelAnimationFrame(this.raf) }
  dispose() { this.stop(); this.ro.disconnect(); window.removeEventListener('pointermove', this.onMove); for (const p of this.planes) p.dispose(); this.blitMesh.geometry.dispose(); this.renderer.dispose(); this.canvas.remove() }
}

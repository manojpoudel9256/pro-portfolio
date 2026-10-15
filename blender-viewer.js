import * as THREE from './assets/vendor/three/build/three.module.min.js';
import { GLTFLoader } from './assets/vendor/three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from './assets/vendor/three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from './assets/vendor/three/addons/environments/RoomEnvironment.js';

/** Dispose shared glTF resources once, including decoded ImageBitmaps. */
function disposeObjects(roots) {
  const geometries = new Set();
  const materials = new Set();
  const textures = new Set();
  const images = new Set();
  for (const root of roots) {
    root?.traverse(object => {
      if (object.geometry) geometries.add(object.geometry);
      for (const material of [].concat(object.material || [])) materials.add(material);
      object.skeleton?.dispose();
    });
  }
  for (const material of materials) {
    for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
    material.dispose();
  }
  for (const texture of textures) {
    const image = texture.source?.data;
    if (image && typeof image.close === 'function') images.add(image);
    texture.dispose();
  }
  for (const image of images) image.close();
  for (const geometry of geometries) geometry.dispose();
}

async function fetchModel(url, signal, onProgress, expectedBytes) {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Model request failed (${response.status}).`);
  const total = Number(response.headers.get('content-length')) || expectedBytes || 0;
  if (!response.body?.getReader) return response.arrayBuffer();
  const reader = response.body.getReader();
  const chunks = [];
  let loaded = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    loaded += value.length;
    if (total) onProgress?.(Math.min(loaded / total, 1));
  }
  const bytes = new Uint8Array(loaded);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return bytes.buffer;
}

/**
 * Lazily create a self-contained, on-demand model inspector.
 * Pass an AbortSignal so closing a modal can cancel creation before this resolves.
 * model.camera may supply a normalized-or-not viewing direction [x, y, z].
 */
export async function createModelViewer(container, model, options = {}) {
  const { onProgress, onError, signal } = options;
  if (signal?.aborted) throw new DOMException('Viewer cancelled.', 'AbortError');
  const abort = new AbortController();
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let disposed = false;
  let frame = 0;
  let lastTime = 0;
  let gltf = null;
  let environmentTarget = null;
  let floor = null;
  let observer = null;
  let radius = 1;
  let defaultDistance = 4;
  let autoRotateRequested = false;
  let sceneReady = false;
  let width = 0;
  let height = 0;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'default' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const canvas = renderer.domElement;
  canvas.className = 'blender-viewer-canvas';
  canvas.tabIndex = 0;
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', options.label || 'Interactive 3D model. Drag to rotate, scroll to zoom. Arrow keys rotate, plus and minus zoom, Home resets.');
  canvas.style.cssText = 'display:block;width:100%;height:100%;touch-action:none;outline-offset:-4px;';
  container.append(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.01, 100);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = !reducedMotion.matches;
  controls.dampingFactor = 0.085;
  controls.autoRotate = false;
  controls.autoRotateSpeed = 0.65;
  controls.maxPolarAngle = Math.PI - 0.01;
  controls.minPolarAngle = 0.01;
  controls.screenSpacePanning = true;
  const center = new THREE.Vector3();
  const direction = new THREE.Vector3(...(Array.isArray(model.camera) ? model.camera : [1.25, 0.85, 1.6])).normalize();
  const key = new THREE.DirectionalLight(0xfff4e7, 2.5);
  const fill = new THREE.DirectionalLight(0xe8f0ff, 1.1);
  const ambient = new THREE.HemisphereLight(0xffffff, 0xc7bba8, 0.5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.bias = -0.00025;
  key.shadow.normalBias = 0.012;
  key.shadow.radius = 4;
  scene.add(key, key.target, fill, ambient);

  function invalidate() {
    if (!disposed && !frame && !document.hidden) frame = requestAnimationFrame(render);
  }
  function render(time) {
    frame = 0;
    if (disposed || document.hidden) return;
    const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
    lastTime = time;
    controls.update(delta);
    if (floor) floor.visible = camera.position.y >= floor.position.y;
    renderer.render(scene, camera);
    if (controls.autoRotate) invalidate();
  }
  function fitDistance() {
    const halfVertical = THREE.MathUtils.degToRad(camera.fov / 2);
    const halfHorizontal = Math.atan(Math.tan(halfVertical) * camera.aspect);
    return radius / Math.sin(Math.min(halfVertical, halfHorizontal)) * 1.08;
  }
  function reset() {
    if (disposed || !sceneReady) return;
    controls.target.copy(center);
    controls.cursor.copy(center);
    defaultDistance = fitDistance();
    camera.position.copy(center).addScaledVector(direction, defaultDistance);
    camera.lookAt(center);
    controls.minDistance = radius * 0.16;
    controls.maxDistance = defaultDistance * 4;
    controls.maxTargetRadius = radius * 1.8;
    controls.update();
    controls.saveState();
    invalidate();
  }
  function resize() {
    if (disposed) return;
    const nextWidth = Math.max(1, container.clientWidth);
    const nextHeight = Math.max(1, container.clientHeight);
    if (width === nextWidth && height === nextHeight) return;
    const previousFit = sceneReady ? fitDistance() : 1;
    width = nextWidth;
    height = nextHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    if (sceneReady) {
      const nextFit = fitDistance();
      camera.position.sub(controls.target).multiplyScalar(nextFit / previousFit).add(controls.target);
      defaultDistance = nextFit;
      controls.maxDistance = nextFit * 4;
      controls.update();
    }
    invalidate();
  }
  function setEnvironment(name = 'studio') {
    if (disposed) return;
    const dark = name === 'dark';
    scene.background = new THREE.Color(dark ? '#24282d' : '#eeeae3');
    scene.environmentIntensity = dark ? 0.95 : 0.65;
    renderer.toneMappingExposure = dark ? 1.05 : 0.9;
    key.intensity = dark ? 2.4 : 1.8;
    fill.intensity = dark ? 0.9 : 0.55;
    ambient.intensity = dark ? 0.3 : 0.25;
    if (floor) floor.material.color.set(dark ? '#30343a' : '#eeeae3');
    invalidate();
  }
  function setWireframe(value) {
    if (disposed || !gltf) return;
    gltf.scene.traverse(object => {
      if (object.isMesh) for (const material of [].concat(object.material)) material.wireframe = Boolean(value);
    });
    invalidate();
  }
  function setAutoRotate(value) {
    autoRotateRequested = Boolean(value);
    controls.autoRotate = autoRotateRequested && !reducedMotion.matches && !document.hidden;
    invalidate();
    return controls.autoRotate;
  }
  function motionChange() {
    controls.enableDamping = !reducedMotion.matches;
    setAutoRotate(autoRotateRequested);
  }
  function visibilityChange() {
    lastTime = 0;
    setAutoRotate(autoRotateRequested);
  }
  function onKeyDown(event) {
    if (disposed || !sceneReady || event.altKey || event.ctrlKey || event.metaKey) return;
    const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '+', '=', '-', '_', 'Home'];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home') { reset(); return; }
    const offset = camera.position.clone().sub(controls.target);
    if (['+', '=', '-', '_'].includes(event.key)) {
      const distance = THREE.MathUtils.clamp(offset.length() * (['+', '='].includes(event.key) ? 0.88 : 1.12), controls.minDistance, controls.maxDistance);
      offset.setLength(distance);
    } else {
      const spherical = new THREE.Spherical().setFromVector3(offset);
      const step = event.shiftKey ? 0.22 : 0.1;
      if (event.key === 'ArrowLeft') spherical.theta -= step;
      if (event.key === 'ArrowRight') spherical.theta += step;
      if (event.key === 'ArrowUp') spherical.phi -= step;
      if (event.key === 'ArrowDown') spherical.phi += step;
      spherical.phi = THREE.MathUtils.clamp(spherical.phi, controls.minPolarAngle, controls.maxPolarAngle);
      offset.setFromSpherical(spherical);
    }
    camera.position.copy(controls.target).add(offset);
    controls.update();
    invalidate();
  }
  function onContextLost(event) {
    if (disposed) return;
    event.preventDefault();
    const error = new Error('The 3D graphics context was lost. Reopen this model to try again.');
    dispose();
    onError?.(error);
  }
  function dispose() {
    if (disposed) return;
    disposed = true;
    abort.abort();
    cancelAnimationFrame(frame);
    observer?.disconnect();
    signal?.removeEventListener('abort', dispose);
    reducedMotion.removeEventListener('change', motionChange);
    document.removeEventListener('visibilitychange', visibilityChange);
    canvas.removeEventListener('keydown', onKeyDown);
    canvas.removeEventListener('webglcontextlost', onContextLost);
    controls.removeEventListener('change', invalidate);
    controls.dispose();
    disposeObjects(gltf ? gltf.scenes : []);
    if (floor) disposeObjects([floor]);
    environmentTarget?.dispose();
    key.shadow.map?.dispose();
    scene.clear();
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
  }

  signal?.addEventListener('abort', dispose, { once: true });
  controls.addEventListener('change', invalidate);
  canvas.addEventListener('keydown', onKeyDown);
  canvas.addEventListener('webglcontextlost', onContextLost);
  reducedMotion.addEventListener('change', motionChange);
  document.addEventListener('visibilitychange', visibilityChange);
  observer = new ResizeObserver(resize);
  observer.observe(container);
  setEnvironment(options.environment || 'studio');
  resize();

  try {
    const url = new URL(model.src, document.baseURI);
    const buffer = await fetchModel(url, abort.signal, onProgress, model.fileSizeBytes);
    if (disposed) throw new DOMException('Viewer cancelled.', 'AbortError');
    const loaded = await new GLTFLoader().parseAsync(buffer, new URL('.', url).href);
    if (disposed) {
      disposeObjects(loaded.scenes);
      throw new DOMException('Viewer cancelled.', 'AbortError');
    }
    gltf = loaded;
    const bounds = new THREE.Box3().setFromObject(gltf.scene, true);
    if (bounds.isEmpty()) throw new Error('This model does not contain visible geometry.');
    const size = bounds.getSize(new THREE.Vector3());
    const originalCenter = bounds.getCenter(new THREE.Vector3());
    // Move the whole asset to the studio floor; preserve hierarchy and material values.
    gltf.scene.position.x -= originalCenter.x;
    gltf.scene.position.y -= bounds.min.y;
    gltf.scene.position.z -= originalCenter.z;
    gltf.scene.updateMatrixWorld(true);
    center.set(0, size.y / 2, 0);
    radius = Math.max(size.length() / 2, 0.001);
    camera.near = Math.max(radius / 1000, 0.0001);
    camera.far = radius * 100;
    camera.updateProjectionMatrix();
    gltf.scene.traverse(object => {
      if (object.isMesh) { object.castShadow = true; object.receiveShadow = true; }
    });
    scene.add(gltf.scene);

    const room = new RoomEnvironment();
    const pmrem = new THREE.PMREMGenerator(renderer);
    environmentTarget = pmrem.fromScene(room, 0.04);
    scene.environment = environmentTarget.texture;
    room.dispose();
    pmrem.dispose();
    floor = new THREE.Mesh(new THREE.PlaneGeometry(radius * 80, radius * 80), new THREE.MeshStandardMaterial({ color: '#eeeae3', roughness: 1, metalness: 0 }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -radius * 0.002;
    floor.receiveShadow = true;
    scene.add(floor);
    key.position.set(radius * 3.5, radius * 5, radius * 3);
    key.target.position.copy(center);
    fill.position.set(-radius * 3, radius * 2, -radius * 3);
    key.shadow.camera.left = -radius * 2;
    key.shadow.camera.right = radius * 2;
    key.shadow.camera.top = radius * 2;
    key.shadow.camera.bottom = -radius * 2;
    key.shadow.camera.near = radius * 0.01;
    key.shadow.camera.far = radius * 15;
    key.shadow.normalBias = radius * 0.004;
    key.shadow.camera.updateProjectionMatrix();
    sceneReady = true;
    setEnvironment(options.environment || 'studio');
    reset();
    onProgress?.(1);
    return {
      reset, setWireframe, setAutoRotate, setEnvironment, resize, dispose,
      getStats: () => ({ ...model.stats, renderer: { ...renderer.info.render }, radius }),
      // Useful for pixel-based QA without enabling continuous rendering.
      render: () => { if (!disposed) renderer.render(scene, camera); },
    };
  } catch (error) {
    dispose();
    if (error.name !== 'AbortError') onError?.(error);
    throw error;
  }
}

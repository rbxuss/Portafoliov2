/* =========================================================
   Escena 3D voxel (Three.js r128) para el hero del portafolio
   Se dibuja dentro de <div id="escena-3d" class="hero-gato-caja">
   ========================================================= */
(function () {
  const caja = document.getElementById('escena-3d');
  if (!caja || !window.THREE) return;

  // ===== BASE =====
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // alpha: se ve el fondo de la página
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  caja.appendChild(renderer.domElement);
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 300);

  // ===== HELPER =====
  function addBlock(x, y, z, w, h, d, color, group, basic) {
    const mat = basic ? new THREE.MeshBasicMaterial({ color })
                      : new THREE.MeshStandardMaterial({ color, roughness: .8, metalness: .05 });
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z); m.castShadow = !basic; m.receiveShadow = true;
    (group || scene).add(m); return m;
  }
  const mkGroup = () => { const g = new THREE.Group(); scene.add(g); return g; };

  // ===== LUCES =====
  scene.add(new THREE.AmbientLight(0x8a5ac0, 0.7));
  const sun = new THREE.DirectionalLight(0xff9ad0, 0.9);
  sun.position.set(10, 28, 14); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -25, right: 25, top: 25, bottom: -25, near: 1, far: 80 });
  scene.add(sun);
  const screenLight = new THREE.PointLight(0xff9ad0, 1.2, 30);
  screenLight.position.set(0, 7.5, -3); scene.add(screenLight);

  // ===== ESCRITORIO =====
  const desk = mkGroup();
  addBlock(0, 4.2, -3, 16, 0.6, 8, 0xe87ac0, desk);
  addBlock(0, 3.8, -3, 15.4, 0.4, 7.4, 0x7a3a9a, desk);
  addBlock(-7.2, 1.95, -3, 1.4, 3.9, 7, 0x7a3a9a, desk);
  addBlock(7.2, 1.95, -3, 1.4, 3.9, 7, 0x7a3a9a, desk);
  addBlock(-7.2, 4.1, -3, 1.6, 0.2, 8.2, 0x7a3a9a, desk);
  addBlock(7.2, 4.1, -3, 1.6, 0.2, 8.2, 0x7a3a9a, desk);
  addBlock(0, 4.54, -2.2, 9.5, 0.08, 3.4, 0x5a4a7a, desk);

  // ===== MONITOR =====
  const monitor = mkGroup();
  addBlock(0, 4.6, -5.6, 2.6, 0.2, 1.6, 0x6a5a8a, monitor);
  addBlock(0, 5.2, -5.6, 0.9, 1.2, 0.8, 0x6a5a8a, monitor);
  addBlock(0, 7.7, -5.6, 7, 4.4, 0.5, 0x5a4a7a, monitor);
  const screen = addBlock(0, 7.7, -5.3, 6.4, 3.8, 0.1, 0xffb0e0, monitor, true);
  addBlock(0, 7.6, -5.22, 4.2, 1.0, 0.05, 0x3a2a5a, monitor, true);
  for (let i = 0; i < 7; i++) addBlock(-1.5 + i * 0.5, 7.65, -5.18, 0.3, 0.45, 0.04, 0xffb0e0, monitor, true);
  addBlock(0, 6.55, -5.2, 1.6, 0.12, 0.04, 0x7a3a9a, monitor, true);

  // ===== TECLADO, MOUSE, ESTAMBRE =====
  const kb = mkGroup();
  addBlock(0, 4.7, -1.6, 5.4, 0.3, 1.9, 0xff8ac8, kb);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 12; c++)
    addBlock(-2.3 + c * 0.42, 4.95, -2.2 + r * 0.42, 0.34, 0.2, 0.34, 0xb48ae0, kb);
  const mouse = mkGroup();
  addBlock(4.6, 4.7, -1.6, 0.7, 0.3, 1.1, 0xff8ac8, mouse);
  addBlock(4.6, 4.9, -1.9, 0.12, 0.15, 0.35, 0x6a5a8a, mouse);
  const yarn = mkGroup();
  [[0, 0, 0xe87ac0], [Math.PI / 4, 0, 0x7a3a9a], [0, Math.PI / 4, 0xff8ac8]].forEach(([ry, rx, c]) => {
    const m = addBlock(6.2, 5.4, -1.8, 1.2, 1.2, 1.2, c, yarn); m.rotation.y = ry; m.rotation.x = rx;
  });
  for (let i = 0; i < 4; i++) addBlock(5.3 - i * 0.5, 4.65, -1.2 + i * 0.25, 0.35, 0.12, 0.35, 0xe87ac0, yarn);

  // ===== SILLA =====
  const chair = mkGroup(); const CZ = 2.5;
  addBlock(0, 1.4, CZ, 0.6, 1.8, 0.6, 0x6a5a8a, chair);
  for (let i = 0; i < 5; i++) {
    const a = i * Math.PI * 2 / 5 + 0.3;
    const arm = addBlock(Math.sin(a) * 1.2, 0.65, CZ + Math.cos(a) * 1.2, 0.5, 0.3, 2.4, 0x3a2a5a, chair);
    arm.rotation.y = a;
    addBlock(Math.sin(a) * 2.3, 0.3, CZ + Math.cos(a) * 2.3, 0.55, 0.55, 0.55, 0xff8ac8, chair);
  }
  addBlock(0, 2.5, CZ, 3.8, 0.7, 3.8, 0x3a2a5a, chair);
  addBlock(0, 2.9, CZ, 3.2, 0.12, 3.2, 0xff8ac8, chair);
  addBlock(0, 4.6, CZ + 1.8, 3.6, 4, 0.6, 0x3a2a5a, chair);
  addBlock(0, 6.9, CZ + 1.8, 2.6, 0.8, 0.6, 0x3a2a5a, chair);
  addBlock(-1.9, 4.3, CZ + 1.8, 0.3, 3, 0.7, 0xff8ac8, chair);
  addBlock(1.9, 4.3, CZ + 1.8, 0.3, 3, 0.7, 0xff8ac8, chair);
  addBlock(0, 4.8, CZ + 2.15, 1.2, 1.0, 0.1, 0xff8ac8, chair);
  addBlock(-0.4, 5.45, CZ + 2.15, 0.3, 0.3, 0.1, 0xff8ac8, chair);
  addBlock(0.4, 5.45, CZ + 2.15, 0.3, 0.3, 0.1, 0xff8ac8, chair);
  addBlock(-2.4, 4.2, CZ + 0.3, 0.6, 0.5, 2.4, 0x3a2a5a, chair);
  addBlock(2.4, 4.2, CZ + 0.3, 0.6, 0.5, 2.4, 0x3a2a5a, chair);

  // ===== GATA =====
  const cat = mkGroup(); const PINK = 0xf5a0d0, EAR = 0xff8ac8, PURP = 0x7a3a9a;
  addBlock(0, 4.7, CZ - 0.2, 3.2, 3.2, 2.2, PINK, cat);
  addBlock(0, 3.2, CZ - 0.2, 3.6, 0.8, 2.6, PINK, cat);
  addBlock(0, 8.0, CZ - 0.5, 3.2, 2.4, 2.4, PINK, cat);
  addBlock(-1.75, 7.8, CZ - 0.5, 0.5, 1.4, 2.0, EAR, cat);
  addBlock(1.75, 7.8, CZ - 0.5, 0.5, 1.4, 2.0, EAR, cat);
  [-1, 1].forEach(s => {
    addBlock(s * 1.0, 9.45, CZ - 0.5, 1.0, 0.7, 0.9, EAR, cat);
    addBlock(s * 1.0, 10.0, CZ - 0.5, 0.7, 0.5, 0.8, EAR, cat);
    addBlock(s * 1.0, 10.4, CZ - 0.5, 0.4, 0.4, 0.7, EAR, cat);
    addBlock(s * 1.0, 9.5, CZ - 0.95, 0.5, 0.5, 0.1, PURP, cat);
    addBlock(s * 1.0, 10.0, CZ - 0.9, 0.3, 0.3, 0.1, PURP, cat);
    addBlock(s * 1.5, 5.55, CZ - 1.6, 0.8, 0.8, 2.9, PINK, cat);
    addBlock(s * 0.9, 5.15, CZ - 3.4, 0.9, 0.5, 0.9, EAR, cat);
  });
  const tail = new THREE.Group(); tail.position.set(1.0, 3.4, CZ + 2.3); scene.add(tail);
  const tailSegs = [];
  for (let i = 0; i < 11; i++) {
    const s = addBlock(0.2 + i * 0.38, 0.1 + Math.pow(i - 4, 2) * 0.06 - 0.5 + i * 0.05, 0, 0.55, 0.55, 0.55, i > 8 ? EAR : PINK, tail);
    s.userData.i = i; tailSegs.push(s);
  }

  // ===== PANELES FLOTANTES (más juntos para caber en la columna) =====
  const ICONS = {
    paw:  ["#.#.#", ".###.", "#####", "#####", ".###."],
    fish: ["..###..#", "#######.", "##.####.", "#######.", "..###..#"],
    pad:  [".#####.", "#.#.#.#", "#######", "##...##"],
    chat: ["#####", "#...#", "#####", "..#.."],
    face: ["#...#", "##.##", "#####", "#.#.#", "#####"],
    head: [".###.", "#...#", "#...#", "##.##"]
  };
  const panels = [];
  function makePanel(icon, x, y, z, w, h, rot, modulo) {
    const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = rot; g.userData.modulo = modulo; scene.add(g);
    addBlock(0, 0, 0, w, h, 0.5, 0x5a4a7a, g);
    const faceMat = new THREE.MeshStandardMaterial({ color: 0xffb0e0, emissive: 0xff8ac8, emissiveIntensity: .3, roughness: .6 });
    const face = new THREE.Mesh(new THREE.BoxGeometry(w - 0.5, h - 0.5, 0.2), faceMat);
    face.position.z = 0.2; face.receiveShadow = true; g.add(face);
    const pat = ICONS[icon], px = (w - 1.2) / pat[0].length, ph = Math.min(px, (h - 1.2) / pat.length);
    pat.forEach((row, r) => [...row].forEach((ch, c) => {
      if (ch === '#') addBlock(-((pat[0].length - 1) * px) / 2 + c * px, ((pat.length - 1) * ph) / 2 - r * ph, 0.4, px * .95, ph * .95, 0.2, 0x3a2a5a, g);
    }));
    addBlock(w / 2 - 0.45, h / 2 - 0.28, 0.32, 0.3, 0.18, 0.1, 0x7a3a9a, g);
    panels.push({ g, faceMat, modulo, y0: y, ph: Math.random() * 6.28, rot0: rot });
  }
  // Las 4 de la derecha/centro abren secciones; las 2 de la izquierda son decorativas
  makePanel('fish',  -1,   15.2, -7,   3.8, 4.4,  0.10, 'experiencia');
  makePanel('pad',    6.5, 14.2, -7,   5,   3.4, -0.10, 'proyectos');
  makePanel('chat',  10,   10.5, -3,   3.6, 3.6, -0.35, 'contacto');
  makePanel('face',  10.5,  6.0,  0.5, 3.4, 4,   -0.50, 'sobre-mi');
  makePanel('paw',   -9,   10.5, -3,   3.6, 3.6,  0.35);
  makePanel('head', -10,    6.4,  0.5, 3.8, 3.4,  0.50);

  // ===== PARTÍCULAS =====
  const sparks = [];
  for (let i = 0; i < 30; i++) {
    const s = addBlock((Math.random() - .5) * 30, Math.random() * 18 + 1, (Math.random() - .5) * 22 - 2, .18, .18, .18, Math.random() > .5 ? 0xffb0e0 : 0xb48ae0, scene, true);
    s.userData = { sp: Math.random() * .5 + .2, ph: Math.random() * 6.28 }; sparks.push(s);
  }

  // ===== ÓRBITA + CLIC/HOVER EN LAS VENTANAS =====
  const target = new THREE.Vector3(0, 7.5, -1);
  let theta = 0.45, phi = 1.0, radius = 40, rMin = 20, rMax = 60, prevFit = 0;
  const pts = new Map(); let pinch = 0, lx = 0, ly = 0, down = null, hover = null;
  const cv = renderer.domElement;
  cv.style.touchAction = 'none'; cv.style.cursor = 'grab'; cv.tabIndex = 0;
  const clampR = r => Math.min(rMax, Math.max(rMin, r));

  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  const NOMBRES = { 'sobre-mi': 'Sobre mí', experiencia: 'Experiencia', proyectos: 'Proyectos', contacto: 'Contacto' };
  const etiqueta = document.createElement('div');
  etiqueta.className = 'etiqueta-3d'; etiqueta.hidden = true; caja.appendChild(etiqueta);

  // Devuelve la ventana clicable bajo el puntero (o null)
  function panelBajo(e) {
    const r = cv.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(panels.map(p => p.g), true)[0];
    if (!hit) return null;
    let o = hit.object; while (o && !o.userData.modulo) o = o.parent;
    return o ? panels.find(p => p.g === o) : null;
  }

  cv.addEventListener('pointerdown', e => {
    pts.set(e.pointerId, e); lx = e.clientX; ly = e.clientY;
    down = { x: e.clientX, y: e.clientY }; cv.setPointerCapture(e.pointerId); cv.style.cursor = 'grabbing';
  });
  const soltar = e => {
    // clic = soltar casi donde se presionó (si arrastró, no cuenta)
    const clic = e.type === 'pointerup' && down && pts.size === 1 && Math.hypot(e.clientX - down.x, e.clientY - down.y) < 6;
    pts.delete(e.pointerId); pinch = 0; down = null; cv.style.cursor = hover ? 'pointer' : 'grab';
    if (clic) { const p = panelBajo(e); if (p && window.abrir) window.abrir(p.modulo, cv); }
  };
  cv.addEventListener('pointerup', soltar); cv.addEventListener('pointercancel', soltar);
  cv.addEventListener('pointerleave', () => { if (!pts.size) { hover = null; etiqueta.hidden = true; } });
  cv.addEventListener('pointermove', e => {
    if (!pts.size && e.pointerType === 'mouse') {            // solo pasar el mouse
      hover = panelBajo(e); cv.style.cursor = hover ? 'pointer' : 'grab';
      etiqueta.hidden = !hover;
      if (hover) {
        const r = cv.getBoundingClientRect();
        etiqueta.textContent = NOMBRES[hover.modulo];
        etiqueta.style.left = (e.clientX - r.left) + 'px'; etiqueta.style.top = (e.clientY - r.top) + 'px';
      }
      return;
    }
    if (!pts.has(e.pointerId)) return; pts.set(e.pointerId, e);
    if (pts.size === 2) { const [a, b] = [...pts.values()]; const d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY); if (pinch) radius = clampR(radius * pinch / d); pinch = d; return; }
    if (hover) { hover = null; etiqueta.hidden = true; }
    theta -= (e.clientX - lx) * 0.006; phi = Math.min(1.45, Math.max(0.35, phi - (e.clientY - ly) * 0.006));
    lx = e.clientX; ly = e.clientY;
  });
  cv.addEventListener('wheel', e => { e.preventDefault(); radius = clampR(radius * (1 + e.deltaY * 0.001)); }, { passive: false });

  // ===== AJUSTE AL TAMAÑO DE LA COLUMNA =====
  function ajustar() {
    const w = caja.clientWidth, h = caja.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h;
    // distancia para que quepan ancho (~26) y alto (~21) de la escena
    const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const fit = Math.max(10.5 / t, 13 / (t * camera.aspect));
    const ratio = prevFit ? radius / prevFit : 1; // conserva el zoom del usuario al redimensionar
    prevFit = fit; rMin = fit * 0.55; rMax = fit * 1.4; radius = clampR(fit * ratio);
    const ancha = camera.aspect > 1.2;
    camera.setViewOffset(w, h, ancha ? -w * 0.12 : 0, ancha ? 0 : -h * 0.10, w, h);
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(ajustar).observe(caja);
  ajustar();

  // ===== ANIMACIÓN =====
  const clock = new THREE.Clock(), tmp = new THREE.Color();
  const reducir = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function animar() {
    requestAnimationFrame(animar);
    if (document.querySelector('.panel:not([hidden])')) return; // pausa mientras hay un panel abierto
    const t = reducir ? 0 : clock.getElapsedTime();
    panels.forEach(p => {
      p.g.position.y = p.y0 + Math.sin(t * 1.2 + p.ph) * 0.5;
      p.g.rotation.y = p.rot0 + Math.sin(t * .8 + p.ph) * 0.12;
      const esc = p === hover ? 1.12 : 1;
      p.g.scale.setScalar(p.g.scale.x + (esc - p.g.scale.x) * 0.2);
      p.faceMat.emissiveIntensity = 0.3 + Math.sin(t * 3 + p.ph * 2) * 0.15 + (Math.sin(t * 11 + p.ph) > 0.95 ? 0.25 : 0) + (p === hover ? 0.4 : 0);
    });
    tailSegs.forEach(s => { s.position.z = Math.sin(t * 3 - s.userData.i * 0.5) * s.userData.i * 0.1; });
    tail.rotation.y = Math.sin(t * 2) * 0.25;
    tmp.setHSL(0.88 + Math.sin(t * 0.7) * 0.05, 1, 0.8 + Math.sin(t * 1.3) * 0.05);
    screen.material.color.copy(tmp); screenLight.color.copy(tmp);
    sparks.forEach(s => { s.position.y += Math.sin(t * s.userData.sp * 3 + s.userData.ph) * 0.008; s.rotation.y = t * s.userData.sp; });
    camera.position.set(
      target.x + radius * Math.sin(phi) * Math.sin(theta),
      target.y + radius * Math.cos(phi),
      target.z + radius * Math.sin(phi) * Math.cos(theta));
    camera.lookAt(target);
    renderer.render(scene, camera);
  }
  animar();
})();



const paneles = document.querySelectorAll('.panel');
const botones = document.querySelectorAll('.menu-btn');
let abiertoPor = null;

function abrir(id, boton) {
  cerrar(false);
  const panel = document.getElementById(id);
  if (!panel) return;
  abiertoPor = boton;
  panel.hidden = false;
  panel.querySelector('.panel-cerrar').focus();
}

function cerrar(devolverFoco = true) {
  paneles.forEach(p => { p.hidden = true; });
  if (devolverFoco && abiertoPor) abiertoPor.focus();
  abiertoPor = null;
}

botones.forEach(b => b.addEventListener('click', () => abrir(b.dataset.panel, b)));

paneles.forEach(p => {
  // Cerrar con la X o al hacer clic fuera de la tarjeta
  p.addEventListener('click', e => {
    if (e.target === p || e.target.closest('.panel-cerrar')) cerrar();
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') cerrar();
});
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
  // luz de contorno cian: separa a la gata del fondo
  const rim = new THREE.PointLight(0x3ff0ff, 0.9, 20);
  rim.position.set(-6, 10, 9); scene.add(rim);

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
  const cat = mkGroup();
  const C = {
    fur: 0xf5a0d0, furLight: 0xffd6ee, furDark: 0xd070b0, ear: 0xff8ac8, tip: 0x7a3a9a,
    hood: 0x8a52d6, hoodDark: 0x6a3aa8, dark: 0x2a1a4a, ink: 0x1a0b2e, cyan: 0x3ff0ff
  };
  const S = [-1, 1];

  // --- Piernas (sentada, colgando del asiento) ---
  S.forEach(s => {
    addBlock(s * 1.0, 3.55, CZ - 0.5, 1.2, 1.0, 2.3, C.fur, cat);       // muslo
    addBlock(s * 1.0, 2.2, CZ - 1.7, 1.0, 2.0, 1.0, C.fur, cat);        // pantorrilla
    addBlock(s * 1.0, 1.25, CZ - 1.9, 1.0, 0.4, 1.5, C.furLight, cat);  // pie
  });

  // --- Torso con sudadera ---
  addBlock(0, 4.3, CZ - 0.2, 3.2, 2.5, 2.4, C.hood, cat);               // torso
  addBlock(0, 3.25, CZ - 0.2, 3.3, 0.35, 2.5, C.hoodDark, cat);         // dobladillo
  addBlock(0, 6.2, CZ - 0.4, 4.4, 1.4, 2.2, C.hood, cat);               // hombros
  addBlock(0, 4.1, CZ - 1.45, 2.2, 1.0, 0.1, C.hoodDark, cat);          // bolsillo
  S.forEach(s => addBlock(s * 0.5, 5.0, CZ - 1.45, 0.15, 1.1, 0.1, C.ear, cat)); // cordones
  addBlock(0, 7.1, CZ - 0.5, 2.2, 0.6, 2.0, C.fur, cat);                // cuello

  // --- Capucha caída hacia atrás ---
  addBlock(0, 7.1, CZ + 0.65, 3.4, 1.3, 1.1, C.hoodDark, cat);
  S.forEach(s => addBlock(s * 1.8, 6.95, CZ + 0.15, 0.7, 1.0, 1.7, C.hoodDark, cat));

  // --- Brazos tecleando ---
  const paws = [];
  S.forEach(s => {
    addBlock(s * 2.2, 5.7, CZ - 1.2, 1.0, 1.0, 2.4, C.hood, cat);       // brazo
    addBlock(s * 1.7, 5.5, CZ - 2.6, 0.9, 0.8, 2.2, C.hood, cat);       // antebrazo
    addBlock(s * 1.55, 5.5, CZ - 3.7, 0.95, 0.9, 0.25, C.ear, cat);     // puño de la manga
    const paw = new THREE.Group(); paw.position.set(s * 1.55, 5.3, CZ - 4.0); cat.add(paw);
    paw.userData = { y0: 5.3, ph: s > 0 ? 0 : 1.7 };
    addBlock(0, 0, 0, 1.0, 0.55, 1.1, C.fur, paw);
    [-0.22, 0.22].forEach(x => addBlock(x, 0, -0.57, 0.06, 0.35, 0.05, C.furDark, paw, true)); // deditos
    paws.push(paw);
  });

  // --- Cabeza (grupo con pivote en el cuello) ---
  const head = new THREE.Group(); head.position.set(0, 7.2, CZ - 0.5); cat.add(head);
  const H = (x, y, z, w, h, d, c, basic) => addBlock(x, y, z, w, h, d, c, head, basic);

  H(0, 1.3, 0, 3.6, 2.6, 2.6, C.fur);                    // cráneo
  H(0, 0.75, -1.4, 1.5, 0.8, 0.3, C.furLight);           // hocico
  H(0, 0.95, -1.6, 0.4, 0.25, 0.15, 0xff5fa8);           // nariz
  H(0, 0.62, -1.58, 0.12, 0.2, 0.05, C.dark, true);      // boca en "w"
  H(-0.22, 0.45, -1.58, 0.3, 0.1, 0.05, C.dark, true);
  H(0.22, 0.45, -1.58, 0.3, 0.1, 0.05, C.dark, true);

  S.forEach(s => {
    H(s * 0.85, 1.45, -1.33, 0.55, 0.7, 0.1, C.ink, true);          // ojo
    H(s * 0.85 + 0.1, 1.65, -1.39, 0.2, 0.2, 0.05, 0xffffff, true); // brillo
    H(s * 0.75, 1.2, -1.39, 0.2, 0.1, 0.05, C.cyan, true);          // reflejo de la pantalla
    H(s * 1.3, 0.9, -1.33, 0.5, 0.22, 0.05, 0xff7ac0, true);        // mejilla sonrojada
    H(s * 1.85, 0.7, -0.9, 0.35, 0.7, 0.8, C.furLight);             // pelusa de la mejilla
    [-1, 0, 1].forEach(k => {                                       // bigotes
      const w = H(s * 2.05, 0.75 + k * 0.2, -1.4, 1.1, 0.05, 0.05, 0xffe8f8, true);
      w.rotation.z = s * k * 0.15;
    });
  });

  // rayas de tabby (nuca y coronilla)
  H(0, 2.0, 1.31, 0.28, 0.9, 0.06, C.furDark);
  H(-0.7, 1.9, 1.31, 0.28, 0.7, 0.06, C.furDark);
  H(0.7, 1.9, 1.31, 0.28, 0.7, 0.06, C.furDark);
  H(0, 2.62, 0.3, 0.28, 0.06, 1.3, C.furDark);
  H(-0.7, 2.62, 0.3, 0.28, 0.06, 1.0, C.furDark);
  H(0.7, 2.62, 0.3, 0.28, 0.06, 1.0, C.furDark);

  // orejas escalonadas
  const ears = S.map(s => {
    const e = new THREE.Group(); e.position.set(s * 1.25, 2.45, 0.3);
    e.rotation.z = e.userData.rz = -s * 0.18; head.add(e);
    addBlock(0, 0.3, 0, 1.3, 0.6, 0.7, C.fur, e);
    addBlock(0, 0.85, 0, 1.0, 0.5, 0.6, C.fur, e);
    addBlock(0, 1.3, 0, 0.7, 0.45, 0.5, C.fur, e);
    addBlock(0, 1.7, 0, 0.4, 0.4, 0.4, C.tip, e);
    addBlock(0, 0.4, -0.34, 0.8, 0.5, 0.1, C.ear, e);   // interior
    addBlock(0, 0.9, -0.32, 0.5, 0.4, 0.1, C.ear, e);
    addBlock(0, 1.3, -0.28, 0.25, 0.3, 0.1, C.ear, e);
    return e;
  });

  // auriculares gamer
  H(0, 2.78, -0.35, 3.9, 0.3, 0.6, C.dark);               // diadema
  S.forEach(s => {
    H(s * 2.0, 1.7, -0.35, 0.3, 2.0, 0.6, C.dark);        // varilla lateral
    H(s * 2.4, 1.0, -0.3, 0.6, 1.6, 1.5, C.dark);         // almohadilla
    H(s * 2.75, 1.0, -0.3, 0.1, 1.0, 1.0, C.cyan, true);  // placa luminosa
  });
  H(-2.4, 0.45, -1.6, 0.18, 0.18, 1.1, C.dark);           // micrófono
  H(-1.55, 0.45, -2.06, 1.7, 0.18, 0.18, C.dark);
  H(-0.7, 0.45, -2.06, 0.4, 0.4, 0.4, C.ear);

  // --- Cola larga en S (curva de Bézier) ---
  const tailSegs = [];
  const bez = (t, a, b, c, d) => (1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * b + 3 * (1 - t) * t * t * c + t ** 3 * d;
  const NT = 20;
  for (let i = 0; i < NT; i++) {
    const t = i / (NT - 1);
    const x = bez(t, 1.2, 5.4, 3.0, 5.2), y = bez(t, 3.4, 3.0, 6.2, 9.0);
    const size = 0.72 - t * 0.2;
    const col = i >= NT - 3 ? C.furLight : (i % 4 === 3 ? C.furDark : C.fur);
    const seg = addBlock(x, y, CZ + 1.1, size, size, size, col, cat);
    seg.userData = { bx: x, bz: CZ + 1.1 };
    tailSegs.push(seg);
  }

  // --- Animación de la gata (se llama desde animar) ---
  function animarGata(t) {
    head.rotation.y = Math.sin(t * 0.6) * 0.18;
    head.rotation.z = Math.sin(t * 0.9 + 1) * 0.03;
    head.position.y = 7.2 + Math.sin(t * 1.6) * 0.05;
    ears.forEach((e, i) => {
      const tw = Math.max(0, Math.sin(t * 1.1 + i * 2.4) - 0.92) * 5;   // sacudida ocasional
      e.rotation.z = e.userData.rz - Math.sign(e.userData.rz) * tw;
    });
    const typing = t > 0 && Math.sin(t * 0.5) > -0.4 ? 1 : 0;           // teclea a ratos
    paws.forEach(p => { p.position.y = p.userData.y0 + typing * Math.max(0, Math.sin(t * 16 + p.userData.ph)) * 0.14; });
    tailSegs.forEach((s, i) => {
      const w = t * 2.2 - i * 0.45;
      s.position.x = s.userData.bx + Math.sin(w) * i * 0.035;
      s.position.z = s.userData.bz + Math.cos(w) * i * 0.02;
    });
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
    panels.push({ g, faceMat, modulo, alto: h, y0: y, ph: Math.random() * 6.28, rot0: rot });
  }
  // Las 4 de la derecha/centro abren secciones; las 2 de la izquierda son decorativas
  makePanel('fish',  -1,   14.2, -7,   3.8, 4.4,  0.10, 'experiencia');
  makePanel('pad',    6.5, 13.8, -7,   5,   3.4, -0.10, 'proyectos');
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

  // ===== ESTADO, ÓRBITA Y CLIC EN LAS VENTANAS =====
  const target = new THREE.Vector3(0, 7.5, -1);
  let theta = 0.45, phi = 1.0, radius = 40, rMin = 20, rMax = 60, prevFit = 0;
  const pts = new Map(); let pinch = 0, lx = 0, ly = 0, down = null, hover = null;
  // estado: idle (libre) -> ida (cámara vuela a la ventana) -> abierto (panel) -> vuelta -> idle
  let estado = 'idle', vuelo = null, guardado = null, panelAbierto = false, primeraVez = true;
  const cv = renderer.domElement;
  cv.style.touchAction = 'none'; cv.style.cursor = 'grab'; cv.tabIndex = 0;
  const clampR = r => Math.min(rMax, Math.max(rMin, r));
  const NOMBRES = { 'sobre-mi': 'Sobre mí', experiencia: 'Experiencia', proyectos: 'Proyectos', contacto: 'Contacto' };

  // Etiquetas siempre visibles bajo cada ventana clicable
  const chips = panels.filter(p => p.modulo).map(p => {
    const d = document.createElement('div'); d.className = 'chip-3d'; d.textContent = '▸ ' + NOMBRES[p.modulo];
    caja.appendChild(d); return { p, d };
  });

  // Vuelo suave de cámara
  const ease = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  const camPose = () => ({ theta, phi, radius, tx: target.x, ty: target.y, tz: target.z });
  function volarA(pose, dur, fin) {
    let dth = pose.theta - theta; dth = ((dth + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
    vuelo = { t0: clock.getElapsedTime(), dur, de: camPose(), a: pose, dth, fin };
  }
  function irA(p) {
    guardado = camPose(); estado = 'ida'; hover = null; primeraVez = false;
    volarA({ theta: p.rot0, phi: 1.3, radius: prevFit * 0.42, tx: p.g.position.x, ty: p.y0, tz: p.g.position.z }, 0.8,
      () => { estado = 'abierto'; if (window.abrir) window.abrir(p.modulo, cv); });
  }
  // Detecta cuándo se abre/cierra un panel (index.js sólo usa el atributo hidden)
  function comprobar() {
    panelAbierto = !!document.querySelector('.panel:not([hidden])');
    if (panelAbierto) { primeraVez = false; if (estado === 'idle') { estado = 'abierto'; guardado = null; } }
    else if (estado === 'abierto') {
      if (guardado) { estado = 'vuelta'; volarA(guardado, 0.65, () => { estado = 'idle'; }); } else estado = 'idle';
    }
  }
  new MutationObserver(comprobar).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['hidden'] });

  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
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
    if (estado !== 'idle') return;
    pts.set(e.pointerId, e); lx = e.clientX; ly = e.clientY;
    down = { x: e.clientX, y: e.clientY }; cv.setPointerCapture(e.pointerId); cv.style.cursor = 'grabbing';
  });
  const soltar = e => {
    const clic = e.type === 'pointerup' && down && pts.size === 1 && Math.hypot(e.clientX - down.x, e.clientY - down.y) < 6;
    pts.delete(e.pointerId); pinch = 0; down = null; cv.style.cursor = hover ? 'pointer' : 'grab';
    if (clic && estado === 'idle') { const p = panelBajo(e); if (p) irA(p); }
  };
  cv.addEventListener('pointerup', soltar); cv.addEventListener('pointercancel', soltar);
  cv.addEventListener('pointerleave', () => { if (!pts.size) hover = null; });
  cv.addEventListener('pointermove', e => {
    if (estado !== 'idle') return;
    if (!pts.size && e.pointerType === 'mouse') { hover = panelBajo(e); cv.style.cursor = hover ? 'pointer' : 'grab'; return; }
    if (!pts.has(e.pointerId)) return; pts.set(e.pointerId, e);
    if (pts.size === 2) { const [a, b] = [...pts.values()]; const d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY); if (pinch) radius = clampR(radius * pinch / d); pinch = d; return; }
    hover = null;
    theta -= (e.clientX - lx) * 0.006; phi = Math.min(1.45, Math.max(0.35, phi - (e.clientY - ly) * 0.006));
    lx = e.clientX; ly = e.clientY;
  });
  cv.addEventListener('wheel', e => { e.preventDefault(); if (estado === 'idle') radius = clampR(radius * (1 + e.deltaY * 0.001)); }, { passive: false });

  // ===== AJUSTE AL TAMAÑO DE LA COLUMNA =====
  function ajustar() {
    const w = caja.clientWidth, h = caja.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h;
    // distancia para que quepan ancho (~26) y alto (~21) de la escena
    const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const fit = Math.max(11.5 / t, 14 / (t * camera.aspect));
    const ratio = prevFit ? radius / prevFit : 1; // conserva el zoom del usuario al redimensionar
    prevFit = fit; rMin = fit * 0.55; rMax = fit * 1.4; radius = clampR(fit * ratio);
    const ancha = camera.aspect > 1.2;
    camera.setViewOffset(w, h, ancha ? -w * 0.12 : 0, ancha ? 0 : -h * 0.10, w, h);
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(ajustar).observe(caja);
  ajustar();

  // ===== ANIMACIÓN =====
  const clock = new THREE.Clock(), tmp = new THREE.Color(), v3 = new THREE.Vector3();
  const reducir = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Entrada: los bloques "se construyen" de abajo hacia arriba
  // FASES: 'intro' (se presenta el texto, la escena espera oculta) -> 'escena' (el 3D es el protagonista)
  let fase = 'intro', introT0 = 0;
  document.body.classList.add('fase-intro');
  const intro = []; let introListo = reducir;
  if (!reducir) scene.traverse(o => {
    if (o.isMesh) { o.getWorldPosition(v3); intro.push({ o, d: Math.max(0, v3.y) * 0.07 + Math.random() * 0.25 }); o.scale.setScalar(0.0001); }
  });
  const backOut = x => 1 + 2.70158 * Math.pow(x - 1, 3) + 1.70158 * Math.pow(x - 1, 2);

  function animar() {
    requestAnimationFrame(animar);
    if (fase === 'intro') return;                    // la escena espera mientras se presenta el texto
    if (panelAbierto && !vuelo) return;              // ahorro: pausa con el panel abierto
    const te = clock.getElapsedTime(), t = reducir ? 0 : te;

    if (vuelo) {                                      // vuelo de cámara
      const k = Math.min(1, (te - vuelo.t0) / vuelo.dur), e = ease(k), d = vuelo.de, a = vuelo.a;
      theta = d.theta + vuelo.dth * e; phi = d.phi + (a.phi - d.phi) * e; radius = d.radius + (a.radius - d.radius) * e;
      target.set(d.tx + (a.tx - d.tx) * e, d.ty + (a.ty - d.ty) * e, d.tz + (a.tz - d.tz) * e);
      if (k >= 1) { const f = vuelo.fin; vuelo = null; if (f) f(); }
    }
    if (!introListo) {
      let fin = true;
      intro.forEach(i => { const k = Math.min(1, Math.max(0, (te - introT0 - i.d) / 0.45)); if (k < 1) fin = false; i.o.scale.setScalar(Math.max(k === 0 ? 0 : backOut(k), 0.0001)); });
      introListo = fin;
    }

    panels.forEach(p => {
      p.g.position.y = p.y0 + Math.sin(t * 1.2 + p.ph) * 0.5;
      p.g.rotation.y = p.rot0 + Math.sin(t * .8 + p.ph) * 0.12;
      const esc = p === hover ? 1.12 : 1;
      p.g.scale.setScalar(p.g.scale.x + (esc - p.g.scale.x) * 0.2);
      p.faceMat.emissiveIntensity = 0.3 + Math.sin(t * 3 + p.ph * 2) * 0.15 + (Math.sin(t * 11 + p.ph) > 0.95 ? 0.25 : 0) + (p === hover ? 0.4 : 0);
    });

    // etiquetas pegadas a cada ventana
    const W = caja.clientWidth, H = caja.clientHeight, visible = estado === 'idle' && !panelAbierto && introListo;
    chips.forEach(({ p, d }) => {
      v3.copy(p.g.position); v3.y -= p.alto / 2 + 0.9; v3.project(camera);
      d.style.transform = `translate(${(v3.x * .5 + .5) * W}px, ${(-v3.y * .5 + .5) * H}px) translate(-50%, 0)`;
      d.style.opacity = visible ? '1' : '0';
      d.classList.toggle('activa', p === hover); d.classList.toggle('pulsa', primeraVez && !reducir);
    });

    animarGata(t);                                    // la gata: exactamente tu animación

    tmp.setHSL(0.88 + Math.sin(t * 0.7) * 0.05, 1, 0.8 + Math.sin(t * 1.3) * 0.05);
    screen.material.color.copy(tmp); screenLight.color.copy(tmp);
    sparks.forEach(s => { s.position.y += Math.sin(t * s.userData.sp * 3 + s.userData.ph) * 0.008; s.rotation.y = t * s.userData.sp; });

    const balanceo = (estado === 'idle' && !pts.size && !reducir) ? Math.sin(te * 0.35) * 0.06 : 0; // vaivén suave
    const th = theta + balanceo;
    camera.position.set(
      target.x + radius * Math.sin(phi) * Math.sin(th),
      target.y + radius * Math.cos(phi),
      target.z + radius * Math.sin(phi) * Math.cos(th));
    camera.lookAt(target);
    renderer.render(scene, camera);
  }
  // Paso de la presentación a la escena: los bloques se construyen y la cámara hace una entrada en arco
  function entrarEscena() {
    if (fase === 'escena') return;
    fase = 'escena'; sincronizarToggle();
    document.querySelector('.btn-entrar')?.remove();
    document.body.classList.remove('fase-intro'); document.body.classList.add('fase-escena');
    introT0 = clock.getElapsedTime();
    if (reducir) { estado = 'idle'; return; }
    const destino = camPose();
    theta += 0.9; radius = destino.radius * 1.3; estado = 'entrada';
    volarA(destino, 2.2, () => { estado = 'idle'; });
  }
  // Volver a la presentación (clic en el logo)
  function volverAIntro() {
    if (fase === 'intro') return;
    if (typeof cerrar === 'function') cerrar(false);
    vuelo = null;
    if (guardado) { theta = guardado.theta; phi = guardado.phi; radius = guardado.radius; target.set(guardado.tx, guardado.ty, guardado.tz); }
    guardado = null; estado = 'idle'; panelAbierto = false; hover = null;
    fase = 'intro'; sincronizarToggle();
    document.body.classList.remove('fase-escena'); document.body.classList.add('fase-intro');
    presentacionLista(false);
  }
  window.entrarEscena = entrarEscena; window.volverAIntro = volverAIntro;

  // Interruptor de vista en el header: Presentación <-> Escena 3D
  const header = document.querySelector('body > header');
  let toggle = null;
  if (header) {
    toggle = document.createElement('div');
    toggle.className = 'vista-toggle'; toggle.setAttribute('role', 'group'); toggle.setAttribute('aria-label', 'Cambiar de vista');
    toggle.innerHTML = '<button type="button" data-vista="intro">Presentación</button><button type="button" data-vista="escena">Escena 3D</button>';
    header.appendChild(toggle);
    toggle.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.vista === 'escena') entrarEscena(); else volverAIntro();
    });
  }
  function sincronizarToggle() {
    if (toggle) toggle.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.vista === fase)));
  }
  sincronizarToggle();


  animar();
})();


/* =========================================================
   Paneles (Sobre mí, Experiencia, Proyectos, Contacto)
   ========================================================= */
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


(function () {
  const h1s = document.querySelectorAll('.hero-text h1');
  const cursor = document.querySelector('.hero-text .cursor');
  if (!h1s.length || !cursor) { setTimeout(() => presentacionLista(false), 300); return; }
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setTimeout(() => presentacionLista(false), 300); return; }
 
  // guarda cada nombre completo y vacía el texto (el lector de pantalla lo lee por aria-label)
  const lineas = [...h1s].map(h => {
    const nodo = h.firstChild;
    const completo = nodo.textContent;
    h.setAttribute('aria-label', completo);
    nodo.textContent = '';
    return { h, nodo, completo };
  });
 
  let i = 0;
  function escribir() {
    if (i >= lineas.length) { setTimeout(() => presentacionLista(false), 400); return; }
    const { h, nodo, completo } = lineas[i];
    h.appendChild(cursor);                 // el cursor "salta" a la línea que se escribe
    let k = 0;
    const id = setInterval(() => {
      nodo.textContent = completo.slice(0, ++k);
      if (k >= completo.length) {
        clearInterval(id);
        i++;
        setTimeout(escribir, 250);
      }
    }, 90);
  }
 
  setTimeout(escribir, 600);
})();


/* =========================================================
   Presentación -> escena 3D
   Al terminar de escribirse el nombre aparece "Explorar mi mundo"
   (si nadie lo pulsa, entra solo a los 5,5 s). El logo vuelve a la presentación.
   ========================================================= */
function presentacionLista(auto) {
  if (document.body.classList.contains('fase-escena')) return;   // ya estás en la escena
  const cont = document.querySelector('.hero-text');
  if (!cont || !window.entrarEscena) { if (window.entrarEscena) entrarEscena(); return; }
  if (cont.querySelector('.btn-entrar')) return;
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'btn-entrar';
  b.innerHTML = 'Explorar mi mundo <span aria-hidden="true">▸</span>';
  cont.appendChild(b);
  requestAnimationFrame(() => requestAnimationFrame(() => b.classList.add('visible')));
  let id = null;
  const ir = () => { clearTimeout(id); b.remove(); entrarEscena(); };
  b.addEventListener('click', ir);
  if (auto) id = setTimeout(ir, 5500);
}

document.querySelector('.logo')?.addEventListener('click', e => {
  e.preventDefault(); if (window.volverAIntro) volverAIntro();
});
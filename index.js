/* =========================================================
   ESTADO COMPARTIDO ENTRE LA ESCENA Y LOS PANELES
   ========================================================= */
let panelAbierto = false;   // la escena se pausa mientras haya un panel abierto
let descubierto = false;    // true cuando la persona ya interactuó (hover, arrastre o clic)

function descubrir() {
  if (descubierto) return;
  descubierto = true;
  document.body.classList.add('explorado');   // retira la pista inferior
}

/* =========================================================
   ESCENA 3D VOXEL (Three.js r128)
   Se dibuja dentro de <div id="escena-3d">
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

  // ===== HELPER (geometrías y materiales compartidos: menos memoria y menos trabajo para la GPU) =====
  const geos = new Map(), mats = new Map();
  const geo = (w, h, d) => {
    const k = w + '_' + h + '_' + d;
    if (!geos.has(k)) geos.set(k, new THREE.BoxGeometry(w, h, d));
    return geos.get(k);
  };
  const mat = (color, basic) => {
    const k = color + (basic ? 'b' : 's');
    if (!mats.has(k)) mats.set(k, basic
      ? new THREE.MeshBasicMaterial({ color })
      : new THREE.MeshStandardMaterial({ color, roughness: .8, metalness: .05 }));
    return mats.get(k);
  };
  function addBlock(x, y, z, w, h, d, color, group, basic) {
    const m = new THREE.Mesh(geo(w, h, d), mat(color, basic));
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

  // ===== MONITOR (con barras de ecualizador y líneas de código animadas) =====
  const monitor = mkGroup();
  addBlock(0, 4.6, -5.6, 2.6, 0.2, 1.6, 0x6a5a8a, monitor);
  addBlock(0, 5.2, -5.6, 0.9, 1.2, 0.8, 0x6a5a8a, monitor);
  addBlock(0, 7.7, -5.6, 7, 4.4, 0.5, 0x5a4a7a, monitor);
  const screen = addBlock(0, 7.7, -5.3, 6.4, 3.8, 0.1, 0xffb0e0, monitor, true);
  screen.material = new THREE.MeshBasicMaterial({ color: 0xffb0e0 });   // propio: su color cambia en cada frame
  addBlock(0, 7.6, -5.22, 4.2, 1.0, 0.05, 0x3a2a5a, monitor, true);

  const barras = [];
  for (let i = 0; i < 7; i++) barras.push(addBlock(-1.5 + i * 0.5, 7.65, -5.18, 0.3, 0.45, 0.04, 0xffb0e0, monitor, true));

  const lineas = [];
  for (let i = 0; i < 5; i++) {
    const w = 1.5 + Math.random() * 2.5;
    const l = addBlock(-2.8 + w / 2, 9.3 - i * 0.28, -5.22, w, 0.14, 0.04, i % 2 ? 0x7a3a9a : 0x3a2a5a, monitor, true);
    l.userData = { w, x0: -2.8, ph: i * 1.3 };
    lineas.push(l);
  }
  addBlock(0, 6.55, -5.2, 1.6, 0.12, 0.04, 0x7a3a9a, monitor, true);

  function animarMonitor(t) {
    barras.forEach((b, i) => { b.scale.y = 0.4 + Math.abs(Math.sin(t * 3 + i * 0.9)) * 1.3; });
    lineas.forEach(l => {
      const k = 0.2 + 0.8 * (Math.sin(t * 0.9 + l.userData.ph) * 0.5 + 0.5);
      l.scale.x = k;
      l.position.x = l.userData.x0 + l.userData.w * k / 2;   // el borde izquierdo queda fijo
    });
  }

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
  const ojos = [];
  const sm = x => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };   // suavizado 0→1

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
    ojos.push(H(s * 0.85, 1.45, -1.33, 0.55, 0.7, 0.1, C.ink, true));  // ojo
    H(s * 0.85 + 0.1, 1.65, -1.39, 0.2, 0.2, 0.05, 0xffffff, true);    // brillo
    H(s * 0.75, 1.2, -1.39, 0.2, 0.1, 0.05, C.cyan, true);             // reflejo de la pantalla
    H(s * 1.3, 0.9, -1.33, 0.5, 0.22, 0.05, 0xff7ac0, true);           // mejilla sonrojada
    H(s * 1.85, 0.7, -0.9, 0.35, 0.7, 0.8, C.furLight);                // pelusa de la mejilla
    [-1, 0, 1].forEach(k => {                                          // bigotes
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
    // cada 10 s se voltea hacia la cámara unos 3 s y parpadea
    const c = t % 10;
    const giro = sm((c - 6) / 0.8) * (1 - sm((c - 8.6) / 0.8));
    const haciaCamara = Math.atan2(Math.sin(Math.PI + theta), Math.cos(Math.PI + theta));
    head.rotation.y = giro * haciaCamara + Math.sin(t * 0.6) * 0.18 * (1 - giro);
    const guino = giro > 0.9 && (c % 1) > 0.85 ? 0.1 : 1;
    ojos.forEach(o => { o.scale.y = guino; });

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

  // ===== VENTANAS FLOTANTES =====
  // Con "modulo" abren una sección. Sin "modulo" son decorativas: se ven más apagadas y no responden.
  const ICONS = {
    paw:  ["#.#.#", ".###.", "#####", "#####", ".###."],
    fish: ["..###..#", "#######.", "##.####.", "#######.", "..###..#"],
    pad:  [".#####.", "#.#.#.#", "#######", "##...##"],
    chat: ["#####", "#...#", "#####", "..#.."],
    face: ["#...#", "##.##", "#####", "#.#.#", "#####"],
    head: [".###.", "#...#", "#...#", "##.##"]
  };
  const NOMBRES = { 'sobre-mi': 'Sobre mí', experiencia: 'Experiencia', proyectos: 'Proyectos', contacto: 'Contacto' };
  const panels = [];
  function makePanel(icon, x, y, z, w, h, rot, modulo) {
    const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = rot; g.userData.modulo = modulo; scene.add(g);
    addBlock(0, 0, 0, w, h, 0.5, 0x5a4a7a, g);
    const faceMat = modulo
      ? new THREE.MeshStandardMaterial({ color: 0xffb0e0, emissive: 0xff8ac8, emissiveIntensity: .3, roughness: .6 })
      : new THREE.MeshStandardMaterial({ color: 0x9a7cc4, emissive: 0x6a3aa8, emissiveIntensity: .12, roughness: .8 });
    const face = new THREE.Mesh(geo(w - 0.5, h - 0.5, 0.2), faceMat);
    face.position.z = 0.2; face.receiveShadow = true; g.add(face);
    const pat = ICONS[icon], cell = (w - 1.2) / pat[0].length, cellH = Math.min(cell, (h - 1.2) / pat.length);
    pat.forEach((row, r) => [...row].forEach((ch, c) => {
      if (ch === '#') addBlock(-((pat[0].length - 1) * cell) / 2 + c * cell, ((pat.length - 1) * cellH) / 2 - r * cellH, 0.4, cell * .95, cellH * .95, 0.2, 0x3a2a5a, g);
    }));
    addBlock(w / 2 - 0.45, h / 2 - 0.28, 0.32, 0.3, 0.18, 0.1, 0x7a3a9a, g);
    panels.push({ g, faceMat, modulo, h, y0: y, ph: Math.random() * 6.28, rot0: rot });
  }
  makePanel('fish',  -1,   15.2, -7,   3.8, 4.4,  0.10, 'experiencia');
  makePanel('pad',    6.5, 14.2, -7,   5,   3.4, -0.10, 'proyectos');
  makePanel('chat',  10,   10.5, -3,   3.6, 3.6, -0.35, 'contacto');
  makePanel('face',  10.5,  6.0,  0.5, 3.4, 4,   -0.50, 'sobre-mi');
  makePanel('paw',   -9,   10.5, -3,   3.6, 3.6,  0.35);   // decorativa
  makePanel('head', -10,    6.4,  0.5, 3.8, 3.4,  0.50);   // decorativa

  // ===== ETIQUETAS SIEMPRE VISIBLES (también son botones: sirven con teclado y en pantallas táctiles) =====
  const etiquetas = [];
  panels.forEach(p => {
    if (!p.modulo) return;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'etiqueta-ventana';
    b.textContent = NOMBRES[p.modulo];
    b.setAttribute('aria-label', 'Abrir ' + NOMBRES[p.modulo]);
    b.addEventListener('click', () => abrir(p.modulo, b));
    caja.appendChild(b);
    etiquetas.push({ b, p });
  });

  let cw = 1, ch = 1;                    // tamaño del lienzo en px
  const vTmp = new THREE.Vector3();
  function ubicarEtiquetas() {
    etiquetas.forEach(({ b, p }) => {
      p.g.getWorldPosition(vTmp);
      vTmp.y -= (p.h / 2) * p.g.scale.y + 0.9;      // justo debajo de la ventana
      vTmp.project(camera);
      b.style.visibility = vTmp.z < 1 ? '' : 'hidden';
      b.style.transform = 'translate(' + ((vTmp.x * 0.5 + 0.5) * cw) + 'px,' + ((-vTmp.y * 0.5 + 0.5) * ch) + 'px) translate(-50%, 0)';
    });
  }

  // ===== PARTÍCULAS =====
  const sparks = [];
  for (let i = 0; i < 30; i++) {
    const s = addBlock((Math.random() - .5) * 30, Math.random() * 18 + 1, (Math.random() - .5) * 22 - 2, .18, .18, .18, Math.random() > .5 ? 0xffb0e0 : 0xb48ae0, scene, true);
    s.userData = { sp: Math.random() * .5 + .2, ph: Math.random() * 6.28 }; sparks.push(s);
  }

  // ===== ÓRBITA + PARALLAX + CLIC/HOVER EN LAS VENTANAS =====
  const target = new THREE.Vector3(0, 7.5, -1);
  let theta = 0.45, phi = 1.0, radius = 40, rMin = 20, rMax = 60, prevFit = 0;
  let mx = 0, my = 0, px = 0, py = 0;   // mouse normalizado y su versión suavizada
  const pts = new Map(); let pinch = 0, lx = 0, ly = 0, down = null, hover = null;
  const cv = renderer.domElement;
  cv.style.touchAction = 'none'; cv.style.cursor = 'grab'; cv.tabIndex = 0;
  const clampR = r => Math.min(rMax, Math.max(rMin, r));

  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    mx = e.clientX / innerWidth * 2 - 1;
    my = e.clientY / innerHeight * 2 - 1;
  });

  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();

  // Devuelve la ventana clicable bajo el puntero (o null; las decorativas no cuentan)
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
    descubrir();
    pts.set(e.pointerId, e); lx = e.clientX; ly = e.clientY;
    down = { x: e.clientX, y: e.clientY }; cv.setPointerCapture(e.pointerId); cv.style.cursor = 'grabbing';
  });
  const soltar = e => {
    // clic = soltar casi donde se presionó (si arrastró, no cuenta)
    const clic = e.type === 'pointerup' && down && pts.size === 1 && Math.hypot(e.clientX - down.x, e.clientY - down.y) < 6;
    pts.delete(e.pointerId); pinch = 0; down = null; cv.style.cursor = hover ? 'pointer' : 'grab';
    if (clic) { const p = panelBajo(e); if (p) abrir(p.modulo, cv); }
  };
  cv.addEventListener('pointerup', soltar); cv.addEventListener('pointercancel', soltar);
  cv.addEventListener('pointerleave', () => { if (!pts.size) hover = null; });
  cv.addEventListener('pointermove', e => {
    if (!pts.size && e.pointerType === 'mouse') {            // solo pasar el mouse
      hover = panelBajo(e); cv.style.cursor = hover ? 'pointer' : 'grab';
      if (hover) descubrir();
      return;
    }
    if (!pts.has(e.pointerId)) return; pts.set(e.pointerId, e);
    if (pts.size === 2) { const [a, b] = [...pts.values()]; const d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY); if (pinch) radius = clampR(radius * pinch / d); pinch = d; return; }
    hover = null;
    theta -= (e.clientX - lx) * 0.006; phi = Math.min(1.45, Math.max(0.35, phi - (e.clientY - ly) * 0.006));
    lx = e.clientX; ly = e.clientY;
  });
  cv.addEventListener('wheel', e => { e.preventDefault(); radius = clampR(radius * (1 + e.deltaY * 0.001)); }, { passive: false });

  // ===== AJUSTE AL TAMAÑO DE LA COLUMNA =====
  function ajustar() {
    const w = caja.clientWidth, h = caja.clientHeight; if (!w || !h) return;
    cw = w; ch = h;
    renderer.setSize(w, h, false); camera.aspect = w / h;
    // distancia para que quepan ancho (~26) y alto (~25) de la escena
    const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const fit = Math.max(12.5 / t, 13 / (t * camera.aspect));
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
    if (panelAbierto) return;                                   // pausa mientras hay un panel abierto
    const t = reducir ? 0 : clock.getElapsedTime();

    // las ventanas clicables "laten" unos segundos si nadie las ha tocado todavía
    const ayuda = !descubierto && t > 2.6 && t < 14;

    panels.forEach(p => {
      p.g.position.y = p.y0 + Math.sin(t * 1.2 + p.ph) * 0.5;
      p.g.rotation.y = p.rot0 + Math.sin(t * .8 + p.ph) * 0.12;
      const latido = ayuda && p.modulo ? (Math.sin(t * 4 + p.ph) * 0.5 + 0.5) : 0;
      const esc = p === hover ? 1.12 : 1 + latido * 0.07;
      p.g.scale.setScalar(p.g.scale.x + (esc - p.g.scale.x) * 0.2);
      if (p.modulo) {
        p.faceMat.emissiveIntensity = 0.3 + Math.sin(t * 3 + p.ph * 2) * 0.15 + (Math.sin(t * 11 + p.ph) > 0.95 ? 0.25 : 0) + (p === hover ? 0.4 : 0) + latido * 0.35;
      }
    });

    animarGata(t);
    animarMonitor(t);

    tmp.setHSL(0.88 + Math.sin(t * 0.7) * 0.05, 1, 0.8 + Math.sin(t * 1.3) * 0.05);
    screen.material.color.copy(tmp); screenLight.color.copy(tmp);

    // partículas que suben y titilan
    sparks.forEach(s => {
      if (!reducir) { s.position.y += s.userData.sp * 0.02; if (s.position.y > 19) s.position.y = 0.5; }
      s.rotation.y = t * s.userData.sp;
      s.rotation.x = t * s.userData.sp * 0.7;
      s.scale.setScalar(0.75 + 0.25 * Math.sin(t * 3 + s.userData.ph));
    });

    // cámara viva: entrada, vaivén y parallax con el mouse
    px += ((reducir ? 0 : mx) - px) * 0.05;
    py += ((reducir ? 0 : my) - py) * 0.05;
    const ease = reducir ? 1 : 1 - Math.pow(1 - Math.min(1, t / 2.6), 3);   // entrada de 2.6 s
    const rr  = radius * (1 + (1 - ease) * 0.7);                              // arranca lejos y se acerca
    const thA = theta + (1 - ease) * 1.2 + Math.sin(t * 0.35) * 0.10 + px * 0.18;
    const phA = Math.min(1.45, Math.max(0.35, phi - py * 0.07 + Math.sin(t * 0.27) * 0.03));
    camera.position.set(
      target.x + rr * Math.sin(phA) * Math.sin(thA),
      target.y + rr * Math.cos(phA),
      target.z + rr * Math.sin(phA) * Math.cos(thA));
    camera.lookAt(target);

    renderer.render(scene, camera);
    ubicarEtiquetas();                                          // después de renderizar: la cámara ya está actualizada
  }
  animar();
})();


/* =========================================================
   PANELES (Sobre mí, Experiencia, Proyectos, Contacto)
   Se abren desde: ventanas 3D, etiquetas, menú del header y botones del hero
   ========================================================= */
const paneles = document.querySelectorAll('.panel');
let abiertoPor = null;

function abrir(id, boton) {
  cerrar(false);
  const panel = document.getElementById(id);
  if (!panel) return;
  descubrir();
  abiertoPor = boton;
  panel.hidden = false;
  panelAbierto = true;
  panel.querySelector('.panel-cerrar').focus();
}

function cerrar(devolverFoco = true) {
  paneles.forEach(p => { p.hidden = true; });
  panelAbierto = false;
  if (devolverFoco && abiertoPor) abiertoPor.focus();
  abiertoPor = null;
}

document.querySelectorAll('[data-abrir]').forEach(b => {
  b.addEventListener('click', () => abrir(b.dataset.abrir, b));
});

paneles.forEach(p => {
  // Cerrar con la X o al hacer clic fuera de la tarjeta
  p.addEventListener('click', e => {
    if (e.target === p || e.target.closest('.panel-cerrar')) cerrar();
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') cerrar();
});


/* =========================================================
   NOMBRE: efecto "máquina de escribir"
   ========================================================= */
(function () {
  const lns = document.querySelectorAll('.hero-text .ln');
  const cursor = document.querySelector('.hero-text .cursor');
  if (!lns.length || !cursor) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // guarda cada línea completa y vacía el texto (el lector de pantalla usa el aria-label del h1)
  const lineas = [...lns].map(el => {
    const nodo = el.firstChild;
    const completo = nodo.textContent;
    nodo.textContent = '';
    return { el, nodo, completo };
  });

  let i = 0;
  function escribir() {
    if (i >= lineas.length) return;
    const { el, nodo, completo } = lineas[i];
    el.appendChild(cursor);              // el cursor "salta" a la línea que se escribe
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
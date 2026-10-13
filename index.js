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
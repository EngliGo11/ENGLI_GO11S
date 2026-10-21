/* =====================================================
   CONFIGURACIÓN (ajusta los nombres de página si cambian)
===================================================== */
const CLAVE_DESBLOQUEO = 'engligo-astral-travel-nivel-desbloqueado';

// Temas de vocabulario: se marcan cuando el estudiante voltea todas las tarjetas
const VOCABULARIO = [
  { clave: 'engligo-vocab-saludos',  nombre: 'Greetings and farewells', pagina: 'saludos.html',       color: '#3ac780' },
  { clave: 'engligo-vocab-objetos',  nombre: 'Classroom objects',       pagina: 'objetos.html',       color: '#5cf883' },
  { clave: 'engligo-vocab-animales', nombre: 'Animals',                 pagina: 'animales.html',      color: '#70f7ad' },
  { clave: 'engligo-vocab-colores',  nombre: 'Colors',                  pagina: 'colores.html',       color: '#62f47f' },
  { clave: 'engligo-vocab-cuerpo',   nombre: 'Body parts',              pagina: 'partes-cuerpo.html', color: '#6bff4d' }
];

// Niveles de Astral Travel
const NIVELES_INFO = [
  { numero: 1, tema: 'Body parts',              pagina: 'nivel1.html', color: '#a2fb9a' },
  { numero: 2, tema: 'Classroom objects',       pagina: 'nivel2.html', color: '#53c94d' },
  { numero: 3, tema: 'Animals',                 pagina: 'nivel3.html', color: '#7dff81' },
  { numero: 4, tema: 'Colors',                  pagina: 'nivel4.html', color: '#99ff7d' },
  { numero: 5, tema: 'Greetings and farewells', pagina: 'nivel5.html', color: '#46c070' }
];

// Los tres juegos: se marcan cuando el estudiante llega a la pantalla de victoria
const JUEGOS = [
  { clave: 'engligo-juego-meteor',     nombre: 'Meteor Challenge',  pagina: 'Meteorchallege.html', color: '#2d9e3c' },
  { clave: 'engligo-juego-words',      nombre: 'Complete the word', pagina: 'words.html',          color: '#5bff61' },
  { clave: 'engligo-juego-wordsearch', nombre: 'Word Search',       pagina: 'Wordsearch.html',     color: '#63ff5b' }
];

// Todas las claves que pertenecen al progreso (para el botón de reiniciar)
const TODAS_LAS_CLAVES = [
  CLAVE_DESBLOQUEO,
  'engligo-astral-travel-progreso',
  ...VOCABULARIO.map(v => v.clave),
  ...JUEGOS.map(j => j.clave)
];

const contenedorProgreso = document.getElementById('contenedorProgreso');

/* =====================================================
   FUNCIONES AUXILIARES
===================================================== */
function estaHecho(clave) {
  return localStorage.getItem(clave) === '1';
}

function crearFila(fila) {
  const li = document.createElement('li');
  const enlace = document.createElement('a');
  enlace.className = 'fila-nivel' + (fila.bloqueado ? ' bloqueado' : '');
  enlace.href = fila.pagina;
  enlace.style.setProperty('--color', fila.color);

  const info = document.createElement('div');
  const titulo = document.createElement('strong');
  titulo.textContent = fila.titulo;
  info.appendChild(titulo);
  if (fila.subtitulo) {
    const sub = document.createElement('small');
    sub.textContent = fila.subtitulo;
    info.appendChild(sub);
  }

  const est = document.createElement('span');
  est.className = 'estado';
  est.textContent = fila.estado;

  enlace.append(info, est);
  li.appendChild(enlace);
  return li;
}

function crearSeccion(titulo, hechos, total, filas) {
  const seccion = document.createElement('section');
  seccion.className = 'seccion-progreso';

  const h3 = document.createElement('h3');
  h3.textContent = titulo + ' (' + hechos + '/' + total + ')';

  const lista = document.createElement('ul');
  lista.className = 'lista-niveles';
  filas.forEach(f => lista.appendChild(crearFila(f)));

  seccion.append(h3, lista);
  return seccion;
}

/* =====================================================
   DIBUJAR LA TARJETA DEL ESTUDIANTE
===================================================== */
function dibujarProgreso() {
  const desbloqueado = Number(localStorage.getItem(CLAVE_DESBLOQUEO)) || 1;

  // Vocabulario
  const filasVocab = VOCABULARIO.map(v => {
    const hecho = estaHecho(v.clave);
    return {
      titulo: v.nombre,
      pagina: v.pagina,
      color: v.color,
      estado: hecho ? '✔ Studied' : '▶ Study'
    };
  });
  const hechosVocab = VOCABULARIO.filter(v => estaHecho(v.clave)).length;

  // Astral Travel
  const filasNiveles = NIVELES_INFO.map(n => {
    const hecho = n.numero < desbloqueado;
    const bloqueado = n.numero > desbloqueado;
    let estado = '▶ Play';
    if (hecho) estado = '✔ Completed';
    if (bloqueado) estado = '🔒 Locked';
    return {
      titulo: 'Level ' + n.numero,
      subtitulo: n.tema,
      pagina: n.pagina,
      color: n.color,
      bloqueado: bloqueado,
      estado: estado
    };
  });
  const hechosNiveles = Math.min(NIVELES_INFO.length, desbloqueado - 1);

  // Juegos
  const filasJuegos = JUEGOS.map(j => {
    const hecho = estaHecho(j.clave);
    return {
      titulo: j.nombre,
      pagina: j.pagina,
      color: j.color,
      estado: hecho ? '✔ Won' : '▶ Play'
    };
  });
  const hechosJuegos = JUEGOS.filter(j => estaHecho(j.clave)).length;

  // Total general
  const total = VOCABULARIO.length + NIVELES_INFO.length + JUEGOS.length;
  const hechos = hechosVocab + hechosNiveles + hechosJuegos;
  const porcentaje = Math.round((hechos / total) * 100);

  // Tarjeta
  const tarjeta = document.createElement('div');
  tarjeta.className = 'tarjeta-progreso';

  const cabecera = document.createElement('div');
  cabecera.className = 'cabecera-estudiante';

  const anillo = document.createElement('div');
  anillo.className = 'anillo';
  anillo.style.setProperty('--pct', porcentaje);
  const porcentajeTexto = document.createElement('span');
  porcentajeTexto.textContent = porcentaje + '%';
  anillo.appendChild(porcentajeTexto);

  const datosEstudiante = document.createElement('div');
  datosEstudiante.className = 'datos-estudiante';
  const nombre = document.createElement('h2');
  nombre.textContent = 'Hello, ' + (localStorage.getItem('registeredUser') || 'Student');
  const resumen = document.createElement('p');
  resumen.textContent = hechos + ' of ' + total + ' activities completed';
  datosEstudiante.append(nombre, resumen);
  cabecera.append(anillo, datosEstudiante);
  tarjeta.appendChild(cabecera);

  tarjeta.append(
    crearSeccion('Vocabulary', hechosVocab, VOCABULARIO.length, filasVocab),
    crearSeccion('Astral Travel', hechosNiveles, NIVELES_INFO.length, filasNiveles),
    crearSeccion('Games', hechosJuegos, JUEGOS.length, filasJuegos)
  );

  const botonReiniciar = document.createElement('button');
  botonReiniciar.type = 'button';
  botonReiniciar.className = 'boton-reiniciar';
  botonReiniciar.textContent = 'Reset progress';
  botonReiniciar.addEventListener('click', () => {
    if (!window.confirm('Are you sure you want to reset all progress?')) return;
    TODAS_LAS_CLAVES.forEach(clave => localStorage.removeItem(clave));
    dibujarProgreso();
  });
  tarjeta.appendChild(botonReiniciar);

  contenedorProgreso.replaceChildren(tarjeta);
}

dibujarProgreso();
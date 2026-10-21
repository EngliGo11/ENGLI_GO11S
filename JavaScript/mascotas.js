// ===== CONFIGURACIÓN (cambia aquí rutas y textos) =====
const MASCOTAS = {
  astronauta: "IMG/astronauta.png",   // imagen de la astronauta
  mascota: "IMG/bloop.jpg",    // imagen de la mascota
  textoInicio: "I hope you pass it successfully! 🚀",
  textoVictoria: "Congratulations! You did it! 🎉",
  duracionInicio: 4000           // milisegundos que se queda visible
};

// ===== Estilos inyectados (no necesitas tocar tu CSS) =====
(function () {
  const css = `
  .mascota-wrap {
        position: fixed;
        left: 20px;
        bottom: 20px;
        z-index: 9999;
        display: flex;
        align-items: flex-end;
        gap: 10px;
        pointer-events: none;
        animation: mascotaEntra .5s ease-out both;
    }

    .mascota-wrap img {
        width: 120px;
        height: auto;
        filter: drop-shadow(0 4px 8px rgb(118, 113, 211));
    }

    .mascota-globo {
      background: #fff;
      color: #9090e8;
      font-family: 'Fredoka', sans-serif;
      font-size: 1.2rem;

      padding: 16px 18px;
      line-height: 1.5;

      border-radius: 18px;
      max-width: 160px;
      border: 3px solid #8888d7;
      box-shadow: 4px 4px 0 #8a8ad9;
      position: relative;
      top: -120px;
    }

    .mascota-globo::before {
        content: "";
        position: absolute;
        left: -14px;
        bottom: 18px;
        border: 8px solid transparent;
        border-right-color: #8888d7;
    }

    .mascota-wrap.salir {
        animation: mascotaSale .4s ease-in both;
    }

    .mascota-victoria {
        left: 50%;
        bottom: 50%;
        transform: translate(-50%, 50%);
        flex-direction: column;
        align-items: center;
        z-index: 10000;
    }

    .mascota-victoria img {
        width: 200px;
    }

    @keyframes mascotaEntra {
        from {
            opacity: 0;
            transform: translateY(40px);
        }

        to {
            opacity: 1;
            transform: none;
        }
    }

    @keyframes mascotaSale {
        to {
            opacity: 0;
            transform: translateY(40px);
        }
    }
  
  `;
  const s = document.createElement("style");
  s.textContent = css;
  document.head.appendChild(s);
})();

function crearMascota(imagen, texto, extraClase) {
  const wrap = document.createElement("div");
  wrap.className = "mascota-wrap " + (extraClase || "");
  // Si la imagen no se encuentra, avisa en la consola con la ruta completa que intentó cargar
  wrap.innerHTML =
    `<img src="${imagen}" alt="" onerror="console.error('No se encontró la imagen:', this.src)">` +
    `<div class="mascota-globo">${texto}</div>`;
  document.body.appendChild(wrap);
  return wrap;
}

// Astronauta: se muestra al entrar y desaparece sola
function mostrarAstronautaInicio() {
  const el = crearMascota(MASCOTAS.astronauta, MASCOTAS.textoInicio);
  setTimeout(() => {
    el.classList.add("salir");
    setTimeout(() => el.remove(), 400);
  }, MASCOTAS.duracionInicio);
}

// Mascota: se llama cuando sale la pantalla de felicitaciones
function mostrarMascotaVictoria() {
  if (document.querySelector(".mascota-victoria")) return; // evita duplicados
  crearMascota(MASCOTAS.mascota, MASCOTAS.textoVictoria, "mascota-victoria");
}

function ocultarMascotaVictoria() {
  document.querySelectorAll(".mascota-victoria").forEach(e => e.remove());
}

// La astronauta sale automáticamente al cargar la página
window.addEventListener("load", mostrarAstronautaInicio);
const vocabulario = [
  { ingles: "Backpack", espanol: "Mochila", icono: "🎒" },
  { ingles: "Book", espanol: "Libro", icono: "📖" },
  { ingles: "Pencil", espanol: "Lápiz", icono: "✏️" },
  { ingles: "Notebook", espanol: "Cuaderno", icono: "📓" },
  { ingles: "Ruler", espanol: "Regla", icono: "📏" },
  { ingles: "Scissors", espanol: "Tijeras", icono: "✂️" }
];

const colores = ["#7c5cff", "#b66eff", "#4cafdd", "#de7ffb", "#bde4f8", "#a3d1e1"];

const contenedor = document.getElementById("gridTarjetas");

vocabulario.forEach((palabra, indice) => {
  const color = colores[indice % colores.length];

  const tarjeta = document.createElement("div");
  tarjeta.className = "tarjeta";
  tarjeta.style.setProperty("--color-tarjeta", color);
  tarjeta.style.setProperty("--color-tarjeta-suave", color + "33");

  tarjeta.innerHTML = `
    <button class="btn-audio" aria-label="Listen to ${palabra.ingles}">🔊</button>
    <div class="icono">${palabra.icono}</div>
    <div class="palabra-ingles">${palabra.ingles}</div>
    <div class="palabra-espanol">${palabra.espanol}</div>
  `;

  // Tocar la tarjeta: muestra la traducción y dice la palabra
  tarjeta.addEventListener("click", () => {
    tarjeta.classList.toggle("mostrar-traduccion");
    hablar(palabra.ingles);
  });

   function hablar(texto, velocidad = 0.8, idioma = 'en-US', cancelar = true) {
  if (!('speechSynthesis' in window)) return;
  if (cancelar) window.speechSynthesis.cancel();
  const voz = new SpeechSynthesisUtterance(texto);
  voz.lang = idioma;
  voz.rate = velocidad;
  window.speechSynthesis.speak(voz);
}

  contenedor.appendChild(tarjeta);
});

const btnVolver = document.getElementById("btnVolver");
btnVolver.addEventListener("click", () => {
  window.location.href = "vocabulary.html";
});
// =====================================================
// CaceresGo Mini: juego para descubrir monumentos
// Practico SVG, eventos, distancias y localStorage
// =====================================================

const NS = "http://www.w3.org/2000/svg";   // necesario para crear elementos SVG
const RADIO_DESCUBRIR = 28;                // distancia para descubrir un punto
const PASO = 12;                           // píxeles que avanzo con cada tecla

// Monumentos con su posición, puntos y un dato curioso
const MONUMENTOS = [
  { id: "plaza",  nombre: "Plaza Mayor",          x: 300, y: 250, puntos: 10, dato: "Es el punto de encuentro de la ciudad, a las puertas de la parte antigua." },
  { id: "arco",   nombre: "Arco de la Estrella",  x: 240, y: 150, puntos: 15, dato: "Es una de las principales puertas de entrada a la ciudad monumental." },
  { id: "bujaco", nombre: "Torre de Bujaco",      x: 380, y: 120, puntos: 20, dato: "Torre de origen medieval junto a la Plaza Mayor." },
  { id: "santa",  nombre: "Concatedral de Santa María", x: 200, y: 260, puntos: 15, dato: "Templo gótico en el corazón del casco histórico." },
  { id: "vele",   nombre: "Palacio de las Veletas", x: 450, y: 230, puntos: 20, dato: "Alberga el Museo de Cáceres." },
];

// Datos que necesito para controlar la partida
let estado = { x: 300, y: 200, puntos: 0, visitados: new Set(), racha: 0 };

// Elementos del HTML que voy a usar varias veces
const $ = id => document.getElementById(id);
const jugador = $("jugador");

/** Escribo una línea en la terminal simulada del juego. */
function log(comando, clase = "ok") {
  const p = document.createElement("p");
  p.innerHTML = `<span class="prompt">carolina@daw:~/caceresgo$</span> <span class="${clase}"></span>`;
  p.lastChild.textContent = comando;      // así el texto no se interpreta como HTML
  $("log").appendChild(p);
  $("log").scrollTop = $("log").scrollHeight;  // bajo la terminal hasta el final
}

/** Creo en el SVG los círculos y nombres de los monumentos. */
function crearMonumentos() {
  MONUMENTOS.forEach(m => {
    const c = document.createElementNS(NS, "circle");
    c.setAttribute("cx", m.x); c.setAttribute("cy", m.y); c.setAttribute("r", 10);
    c.setAttribute("class", "poi"); c.id = "poi-" + m.id;

    const t = document.createElementNS(NS, "text");
    t.setAttribute("x", m.x); t.setAttribute("y", m.y + 26);
    t.setAttribute("class", "etiqueta");
    t.textContent = m.nombre.split(" ").slice(0, 2).join(" "); // nombre más corto

    $("pois").append(c, t);
  });
}

/** Calculo la distancia entre dos puntos usando Pitágoras. */
const distancia = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);

/** Muevo al jugador sin dejar que salga del mapa. */
function mover(x, y) {
  estado.x = Math.min(590, Math.max(10, x));
  estado.y = Math.min(390, Math.max(10, y));
  jugador.setAttribute("cx", estado.x);
  jugador.setAttribute("cy", estado.y);
  comprobarCercania();
}

/** Compruebo si estoy cerca de algún monumento nuevo. */
function comprobarCercania() {
  for (const m of MONUMENTOS) {
    if (estado.visitados.has(m.id)) continue;      // si ya está descubierto, paso al siguiente
    if (distancia(estado.x, estado.y, m.x, m.y) < RADIO_DESCUBRIR) {
      descubrir(m);
      break;                                       // solo descubro uno cada vez
    }
  }
}

/** Sumo los puntos y enseño la información del monumento. */
function descubrir(m) {
  estado.visitados.add(m.id);
  estado.racha++;
  const bonus = estado.racha > 1 ? (estado.racha - 1) * 5 : 0;   // premio por descubrir varios seguidos
  estado.puntos += m.puntos + bonus;

  $("poi-" + m.id).classList.add("visitado");
  $("tNombre").textContent = `// ${m.nombre}`;
  $("tDato").textContent = `${m.dato}  (+${m.puntos}${bonus ? " +" + bonus + " racha 🔥" : ""})`;
  $("tarjeta").showModal();

  log(`git commit -m "descubierto: ${m.nombre} (+${m.puntos + bonus})"`);
  actualizarHud();
  if (estado.visitados.size === MONUMENTOS.length) fin();
}

/** Actualizo el marcador y guardo el récord del jugador. */
function actualizarHud() {
  $("puntos").textContent = estado.puntos;
  $("progreso").textContent = `${estado.visitados.size}/${MONUMENTOS.length}`;
  const record = Math.max(estado.puntos, Number(localStorage.getItem("cgRecord") || 0));
  localStorage.setItem("cgRecord", record);
  $("record").textContent = record;
}

function fin() {
  log(`git tag v1.0 # ¡ruta completada con ${estado.puntos} puntos! 🎉`, "aviso");
}

function reiniciar() {
  estado = { x: 300, y: 200, puntos: 0, visitados: new Set(), racha: 0 };
  document.querySelectorAll(".poi").forEach(p => p.classList.remove("visitado"));
  log("git reset --hard  # partida reiniciada", "aviso");
  mover(300, 200);
  actualizarHud();
}

// ---------- Eventos del juego ----------

// Movimiento con las flechas o con las teclas WASD
addEventListener("keydown", e => {
  const dir = { ArrowUp:[0,-1], ArrowDown:[0,1], ArrowLeft:[-1,0], ArrowRight:[1,0],
                w:[0,-1], s:[0,1], a:[-1,0], d:[1,0] }[e.key];
  if (!dir || $("tarjeta").open) return;
  e.preventDefault();                                // evito que la página haga scroll
  mover(estado.x + dir[0] * PASO, estado.y + dir[1] * PASO);
});

// Con el ratón o el móvil convierto el toque a coordenadas del mapa
$("mapa").addEventListener("pointerdown", e => {
  if ($("tarjeta").open) return;
  const p = new DOMPoint(e.clientX, e.clientY)
              .matrixTransform($("mapa").getScreenCTM().inverse());
  mover(p.x, p.y);
});

$("cerrar").addEventListener("click", () => $("tarjeta").close());
$("reiniciar").addEventListener("click", reiniciar);

// Inicio de la partida
crearMonumentos();
actualizarHud();
log("# usa las flechas / WASD o toca el mapa para moverte", "aviso");

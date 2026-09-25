const palos = [
  { nombre: 'corazones', prefijo: 'c' },
  { nombre: 'diamantes', prefijo: 'd' },
  { nombre: 'tréboles', prefijo: 't' },
  { nombre: 'picas', prefijo: 'p' }
];
const nombres = [
  { nombre: 'A', numero: 1 },
  { nombre: '2', numero: 2 },
  { nombre: '3', numero: 3 },
  { nombre: '4', numero: 4 },
  { nombre: '5', numero: 5 },
  { nombre: '6', numero: 6 },
  { nombre: '7', numero: 7 },
  { nombre: '8', numero: 8 },
  { nombre: '9', numero: 9 },
  { nombre: '10', numero: 10 },
  { nombre: 'J', numero: 11 },
  { nombre: 'Q', numero: 12 },
  { nombre: 'K', numero: 13 }
];

function crearMazo() {
  return palos.flatMap(palo =>
    nombres.map(n => ({
      nombre: n.nombre,
      palo: palo.nombre,
      img: `img/${palo.prefijo}${n.numero}.png`
    }))
  );
}

let mazo = crearMazo();
let mesa = [];
let juegoTerminado = false;

function barajar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function mostrarMesa() {
  const mesaDiv = document.getElementById('mesa');
  mesaDiv.innerHTML = '';
  mesa.forEach((carta, idx) => {
    const cartaDiv = document.createElement('div');
    cartaDiv.className = 'carta';
    cartaDiv.title = `Posición: ${idx + 1}`;
    const img = document.createElement('img');
    img.src = carta.img;
    img.alt = `${carta.nombre} de ${carta.palo}`;
    cartaDiv.appendChild(img);
    mesaDiv.appendChild(cartaDiv);
  });
}

function mostrarResultado(tipo) {
  juegoTerminado = true;
  document.getElementById('pedirCarta').disabled = true;
  document.getElementById('repartir').disabled = true;

  // Modal
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modal-img');
  const modalText = document.getElementById('modal-text');
  modalImg.src = tipo === 'winner' ? 'img/winner.png' : 'img/loser.png';
  modalImg.alt = tipo === 'winner' ? '¡Ganaste!' : 'Perdiste';
  modalText.textContent = tipo === 'winner' ? '¡Has ganado!' : 'Has perdido';
  modal.style.display = 'flex';
}

function resetBotones() {
  document.getElementById('pedirCarta').disabled = false;
  document.getElementById('repartir').disabled = false;
}

// SOLO UN EVENTO PARA "Barajar"
document.getElementById('barajar').onclick = () => {
  if (juegoTerminado) {
    juegoTerminado = false;
    resetBotones();
  }
  barajar(mazo);
  mesa = mazo.slice(0, 7); // Reparte 7 cartas nuevas tras barajar
  mostrarMesa();
};

document.getElementById('repartir').onclick = () => {
  if (juegoTerminado) {
    juegoTerminado = false;
    resetBotones();
  }
  if (mazo.length < 7) {
    mazo = crearMazo();
    barajar(mazo);
  }
  mesa = mazo.slice(0, 7); // Reparte 7 cartas
  mostrarMesa();
};

document.getElementById('pedirCarta').onclick = () => {
  if (juegoTerminado) return;
  if (mesa.length < mazo.length) {
    mesa.push(mazo[mesa.length]);
    mostrarMesa();
    if (mesa.length === mazo.length) {
      setTimeout(() => mostrarResultado('winner'), 500);
    }
  } else {
    mostrarResultado('loser');
  }
};

// Evento para cerrar el modal y reiniciar botones
document.getElementById('modal-close').onclick = function() {
  document.getElementById('modal').style.display = 'none';
  juegoTerminado = false;
  resetBotones();
  mesa = [];
  mostrarMesa();
};

mostrarMesa();
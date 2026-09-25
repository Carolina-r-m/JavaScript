let valor = 0;
const valorElem = document.getElementById('valor');
const sumarBtn = document.getElementById('sumar');
const restarBtn = document.getElementById('restar');
const resetBtn = document.getElementById('reset');
const cronometroBtn = document.getElementById('cronometro');

let cronometroActivo = false;
let cronometroInterval = null;
let segundos = 0;

function actualizarValor() {
  valorElem.textContent = valor;
  valorElem.classList.add('changed');
  setTimeout(() => valorElem.classList.remove('changed'), 300);
}

sumarBtn.onclick = () => {
  valor++;
  actualizarValor();
};

restarBtn.onclick = () => {
  valor--;
  actualizarValor();
};

resetBtn.onclick = () => {
  valor = 0;
  actualizarValor();
  detenerCronometro();
};

function formatearTiempo(segundos) {
  const h = String(Math.floor(segundos / 3600)).padStart(2, '0');
  const m = String(Math.floor((segundos % 3600) / 60)).padStart(2, '0');
  const s = String(segundos % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function iniciarCronometro() {
  cronometroActivo = true;
  cronometroBtn.textContent = '⏹ Detener';
  cronometroInterval = setInterval(() => {
    segundos++;
    valorElem.textContent = formatearTiempo(segundos);
    valorElem.classList.add('changed');
    setTimeout(() => valorElem.classList.remove('changed'), 300);
  }, 1000);
}

function detenerCronometro() {
  cronometroActivo = false;
  cronometroBtn.textContent = '⏱ Cronómetro';
  clearInterval(cronometroInterval);
  segundos = 0;
  valorElem.textContent = valor;
}

cronometroBtn.onclick = () => {
  if (!cronometroActivo) {
    iniciarCronometro();
  } else {
    detenerCronometro();
  }
};
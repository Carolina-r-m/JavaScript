/* =========================================================
   JAVASCRIPT DE MI PORTFOLIO
   Aquí está toda la "magia" (que en realidad es DOM y eventos)
   ========================================================= */

// Esperamos a que el HTML esté cargado del todo antes de tocar nada
document.addEventListener("DOMContentLoaded", () => {
  iniciarTema();
  iniciarEscritura();
  iniciarSkills();
  iniciarFiltros();
  iniciarCafe();

  // Pongo el año actual en el footer con el objeto Date
  document.getElementById("anio").textContent = new Date().getFullYear();
});

/* ---------------------------------------------------------
   1) MODO OSCURO
   Guardo la elección en localStorage para que se acuerde
   --------------------------------------------------------- */
function iniciarTema() {
  const boton = document.getElementById("btn-tema");
  const html = document.documentElement; // la etiqueta <html>

  // Miro si ya había un tema guardado de otra visita
  const guardado = localStorage.getItem("tema");
  if (guardado === "oscuro") {
    html.setAttribute("data-tema", "oscuro");
    boton.textContent = "☀️";
  }

  // Cada vez que se hace clic, cambio de tema
  boton.addEventListener("click", () => {
    const esOscuro = html.getAttribute("data-tema") === "oscuro";

    if (esOscuro) {
      html.removeAttribute("data-tema"); // vuelvo al claro
      localStorage.setItem("tema", "claro");
      boton.textContent = "🌙";
    } else {
      html.setAttribute("data-tema", "oscuro");
      localStorage.setItem("tema", "oscuro");
      boton.textContent = "☀️";
    }
  });
}

/* ---------------------------------------------------------
   2) EFECTO MÁQUINA DE ESCRIBIR
   Va escribiendo y borrando una lista de cosas
   --------------------------------------------------------- */
function iniciarEscritura() {
  const elemento = document.getElementById("escritura");

  // Array con las frases (cámbialas por lo que tú estés aprendiendo)
  const frases = [
    "JavaScript",
    "Java y POO",
    "SQL y bases de datos",
    "a usar Git sin miedo",
    "Spring Boot",
  ];

  let indiceFrase = 0;     // qué frase toca
  let indiceLetra = 0;     // por qué letra voy
  let borrando = false;    // ¿estoy escribiendo o borrando?

  function escribir() {
    const fraseActual = frases[indiceFrase];

    if (!borrando) {
      // Añado una letra más con substring
      indiceLetra++;
    } else {
      // Quito una letra
      indiceLetra--;
    }

    elemento.textContent = fraseActual.substring(0, indiceLetra);

    let espera = borrando ? 40 : 90; // borrar va más rápido que escribir

    // Si terminé de escribir la frase, hago una pausa y empiezo a borrar
    if (!borrando && indiceLetra === fraseActual.length) {
      borrando = true;
      espera = 1400;
    }
    // Si terminé de borrar, paso a la siguiente frase (con % vuelvo al principio)
    else if (borrando && indiceLetra === 0) {
      borrando = false;
      indiceFrase = (indiceFrase + 1) % frases.length;
      espera = 400;
    }

    // setTimeout se llama a sí misma: es como un bucle pero con pausas
    setTimeout(escribir, espera);
  }

  escribir();
}

/* ---------------------------------------------------------
   3) BARRAS DE SKILLS
   Se llenan solo cuando la sección aparece en pantalla
   (IntersectionObserver, esto lo vi en un vídeo y me salió a la primera)
   --------------------------------------------------------- */
function iniciarSkills() {
  const skills = document.querySelectorAll(".skill");

  // Función que llena una barra y hace contar el número
  function rellenar(skill) {
    const nivel = Number(skill.dataset.nivel); // leo el data-nivel del HTML
    const relleno = skill.querySelector(".relleno");
    const texto = skill.querySelector(".porcentaje");

    relleno.style.width = nivel + "%";

    // Contador que sube de 0 hasta el nivel con setInterval
    let numero = 0;
    const intervalo = setInterval(() => {
      numero++;
      texto.textContent = numero + "%";
      if (numero >= nivel) clearInterval(intervalo); // cuando llega, lo paro
    }, 15);
  }

  // El observer avisa cuando un elemento entra en la pantalla
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        rellenar(entrada.target);
        observador.unobserve(entrada.target); // ya no hace falta vigilarla más
      }
    });
  }, { threshold: 0.4 });

  skills.forEach((skill) => {
    observador.observe(skill);

    // Extra: al hacer clic en un post-it se vuelve a animar
    skill.addEventListener("click", () => {
      skill.querySelector(".relleno").style.width = "0";
      setTimeout(() => rellenar(skill), 100);
    });
  });
}

/* ---------------------------------------------------------
   4) FILTRO DE PROYECTOS
   Escondo o muestro tarjetas según la categoría
   --------------------------------------------------------- */
function iniciarFiltros() {
  const botones = document.querySelectorAll(".filtro");
  const proyectos = document.querySelectorAll(".proyecto");

  botones.forEach((boton) => {
    boton.addEventListener("click", () => {
      const filtro = boton.dataset.filtro; // "todos", "web", "java"...

      // Le quito la clase "activo" a todos y se la pongo solo al pulsado
      botones.forEach((b) => b.classList.remove("activo"));
      boton.classList.add("activo");

      // Recorro los proyectos y decido si se ven o no
      proyectos.forEach((proyecto) => {
        const coincide = filtro === "todos" || proyecto.dataset.categoria === filtro;
        // toggle con segundo parámetro: true = añade la clase, false = la quita
        proyecto.classList.toggle("oculto", !coincide);
      });
    });
  });
}

/* ---------------------------------------------------------
   5) CONTADOR DE CAFÉS (el más importante de todos)
   --------------------------------------------------------- */
function iniciarCafe() {
  const boton = document.getElementById("btn-cafe");
  const contador = document.getElementById("num-cafes");
  let cafes = 0;

  boton.addEventListener("click", () => {
    cafes++;
    contador.textContent = cafes;

    // Reinicio la animación quitando y poniendo la clase
    boton.classList.remove("salto");
    void boton.offsetWidth; // truco para que el navegador "se entere" del cambio
    boton.classList.add("salto");

    // Mensajito de aviso si me paso con la cafeína
    if (cafes === 5) {
      alert("5 cafés y contando... hasta las mejores devs necesitan descansar un poco 😴");
    }
  });
}

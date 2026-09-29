/* =========================================================
  JavaScript de mi portfolio
  Aquí tengo las partes interactivas de la página
  ========================================================= */

// Espero a que cargue el HTML para que no dé errores
document.addEventListener("DOMContentLoaded", () => {
  iniciarTema();
  iniciarEscritura();
  iniciarSkills();
  iniciarFiltros();
  iniciarCafe();

  // Pongo el año actual en el pie de página
  document.getElementById("anio").textContent = new Date().getFullYear();
});

/* ---------------------------------------------------------
  1) MODO OSCURO
  Guardo la opción elegida para que no se pierda al volver
  --------------------------------------------------------- */
function iniciarTema() {
  const boton = document.getElementById("btn-tema");
  const html = document.documentElement; // elemento <html>

  // Miro si ya tenía guardado algún tema
  const guardado = localStorage.getItem("tema");
  if (guardado === "oscuro") {
    html.setAttribute("data-tema", "oscuro");
    boton.textContent = "☀️";
  }

  // Cambio el tema cuando pulso el botón
  boton.addEventListener("click", () => {
    const esOscuro = html.getAttribute("data-tema") === "oscuro";

    if (esOscuro) {
      html.removeAttribute("data-tema"); // vuelvo al modo claro
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
  2) EFECTO DE MÁQUINA DE ESCRIBIR
  Escribe y borra varias frases automáticamente
  --------------------------------------------------------- */
function iniciarEscritura() {
  const elemento = document.getElementById("escritura");

  // Estas son las frases que van apareciendo
  const frases = [
    "JavaScript",
    "Java y POO",
    "SQL y bases de datos",
    "a usar Git sin miedo",
    "Spring Boot",
  ];

  let indiceFrase = 0;     // frase actual
  let indiceLetra = 0;     // letra actual
  let borrando = false;    // indica si estoy borrando

  function escribir() {
    const fraseActual = frases[indiceFrase];

    if (!borrando) {
      // Muestro una letra más
      indiceLetra++;
    } else {
      // Quito una letra
      indiceLetra--;
    }

    elemento.textContent = fraseActual.substring(0, indiceLetra);

    let espera = borrando ? 40 : 90; // al borrar espero menos tiempo

    // Cuando termino la frase, hago una pausa y empiezo a borrarla
    if (!borrando && indiceLetra === fraseActual.length) {
      borrando = true;
      espera = 1400;
    }
    // Cuando termino de borrar, paso a la siguiente frase
    else if (borrando && indiceLetra === 0) {
      borrando = false;
      indiceFrase = (indiceFrase + 1) % frases.length;
      espera = 400;
    }

    // Repito la función después de una pequeña pausa
    setTimeout(escribir, espera);
  }

  escribir();
}

/* ---------------------------------------------------------
  3) BARRAS DE HABILIDADES
  Se animan cuando aparecen en pantalla
  --------------------------------------------------------- */
function iniciarSkills() {
  const skills = document.querySelectorAll(".skill");

  // Esta función llena la barra y cambia el porcentaje
  function rellenar(skill) {
    const nivel = Number(skill.dataset.nivel); // porcentaje indicado en el HTML
    const relleno = skill.querySelector(".relleno");
    const texto = skill.querySelector(".porcentaje");

    relleno.style.width = nivel + "%";

    // Animación del número desde 0 hasta el nivel indicado
    let numero = 0;
    const intervalo = setInterval(() => {
      numero++;
      texto.textContent = numero + "%";
      if (numero >= nivel) clearInterval(intervalo); // paro el contador al llegar
    }, 15);
  }

  // Compruebo cuándo aparece una tarjeta en pantalla
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        rellenar(entrada.target);
        observador.unobserve(entrada.target); // ya no necesito observarla
      }
    });
  }, { threshold: 0.4 });

  skills.forEach((skill) => {
    observador.observe(skill);

    // Si pulso una tarjeta, la animación empieza otra vez
    skill.addEventListener("click", () => {
      skill.querySelector(".relleno").style.width = "0";
      setTimeout(() => rellenar(skill), 100);
    });
  });
}

/* ---------------------------------------------------------
  4) FILTRO DE PROYECTOS
  Muestro los proyectos de la categoría seleccionada
  --------------------------------------------------------- */
function iniciarFiltros() {
  const botones = document.querySelectorAll(".filtro");
  const proyectos = document.querySelectorAll(".proyecto");

  botones.forEach((boton) => {
    boton.addEventListener("click", () => {
      const filtro = boton.dataset.filtro; // categoría seleccionada

      // Dejo marcado solo el botón que he pulsado
      botones.forEach((b) => b.classList.remove("activo"));
      boton.classList.add("activo");

      // Reviso qué proyectos tengo que enseñar
      proyectos.forEach((proyecto) => {
        const coincide = filtro === "todos" || proyecto.dataset.categoria === filtro;
        // Añado u oculto la clase según coincida la categoría
        proyecto.classList.toggle("oculto", !coincide);
      });
    });
  });
}

/* ---------------------------------------------------------
  5) CONTADOR DE CAFÉS
  --------------------------------------------------------- */
function iniciarCafe() {
  const boton = document.getElementById("btn-cafe");
  const contador = document.getElementById("num-cafes");
  let cafes = 0;

  boton.addEventListener("click", () => {
    cafes++;
    contador.textContent = cafes;

    // Reinicio la animación del botón
    boton.classList.remove("salto");
    void boton.offsetWidth; // fuerzo el reinicio de la animación
    boton.classList.add("salto");

    // Aviso si ya llevo demasiados cafés
    if (cafes === 5) {
      alert("5 cafés y contando... hasta las mejores devs necesitan descansar un poco 😴");
    }
  });
}

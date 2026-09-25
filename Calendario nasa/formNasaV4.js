function llamadaAjax(dia, mes, anyo) {
    mes++; // Porque en la API de la NASA, enero es el 1
    const url = `https://api.nasa.gov/planetary/apod?api_key=cLXoxjxRw2sqi7tJ3pEVI4dv0RU36nXgOIngaDVX&date=${anyo}-${mes.toString().padStart(2, "0")}-${dia.toString().padStart(2, "0")}`;
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en la solicitud: " + response.status);
            }
            return response.json();
        })
        .then(objeto => {
            document.getElementById("foto").innerHTML = `
                <h2>${objeto.title}</h2>
                ${objeto.explanation}<br><br>
                <a href='${objeto.url}'><img width="640px" src='${objeto.url}'></a>
            `;
        })
        .catch(error => console.error("Error al obtener los datos:", error));
}

// Evento que se activa al enviar el formulario
document.getElementById("formulario").addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar que la página se recargue
    const fecha = document.getElementById("calendario").value;
    if (!fecha) {
        alert("Por favor, selecciona una fecha.");
        return;
    }
    const [anyo, mes, dia] = fecha.split("-");
    llamadaAjax(dia, mes - 1, anyo); // Restar 1 al mes porque Date usa índices basados en 0
});

// Evento que se activa al cargar la página
window.addEventListener("load", function () {
    const fecha = new Date();
    llamadaAjax(fecha.getDate(), fecha.getMonth(), fecha.getFullYear());
});
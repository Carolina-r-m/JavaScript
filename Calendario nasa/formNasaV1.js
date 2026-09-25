function llamadaAjax(dia, mes, anyo) {
    mes++; // Porque en la API de la NASA, enero es el 1
    //Const url sirve para almacenar la dirección de la API de la NASA
    const url = `https://api.nasa.gov/planetary/apod?api_key=cLXoxjxRw2sqi7tJ3pEVI4dv0RU36nXgOIngaDVX&date=${anyo}-${mes.toString().padStart(2, "0")}-${dia.toString().padStart(2, "0")}`;
    //fetch sirve para hacer una petición a la API de la NASA
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

// Manejar el envío del formulario
document.getElementById("formularioFecha").addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar que la página se recargue

    const dia = parseInt(document.getElementById("dia").value, 10);
    const mes = parseInt(document.getElementById("mes").value, 10) - 1;
    const anyo = parseInt(document.getElementById("anyo").value, 10);

    llamadaAjax(dia, mes, anyo);
    console.log(dia, mes, anyo); // Comprobar que los datos se han recogido correctamente
});
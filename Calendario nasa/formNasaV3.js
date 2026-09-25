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
//Formulario donde salga después un calendario
document.getElemnetntById.addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar que la página se recargue
    //Crear un calendario
    const calendario = document.createElement("input");
    calendario.type = "date";
    calendario.id = "calendario";
    calendario.name = "calendario";
    calendario.required = true;
    document.getElementById("formulario").appendChild(calendario);
    //Crear un botón para el envío del formulario
    const botón = document.createElement("input");
    botón.type = "submit";  
    botón.value = "Enviar";
    document.getElementById("formulario").appendChild(botón);

});
//Evento que se activa al enviar el formulario
document.getElementById("formulario").addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar que la página se recargue
    const fecha = document.getElementById("calendario").value;
    const [anyo, mes, dia] = fecha.split("-");
    llamadaAjax(dia, mes, anyo);
});
//Evento que se activa al cargar la página
window.addEventListener("load", function () {
    const fecha = new Date();
    llamadaAjax(fecha.getDate(), fecha.getMonth(), fecha.getFullYear());
});
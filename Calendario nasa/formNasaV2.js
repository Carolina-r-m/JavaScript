
function llamadaAjax(dia, mes, anyo) {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        const objeto = JSON.parse(this.responseText); // Convertir el JSON en un objeto
        // Mostrar la foto en la página
        document.getElementById("foto").innerHTML = `    
            <h2>${objeto.title}</h2> 
            ${objeto.explanation}<br><br>
            <a href='${objeto.url}'><img width="650px" src='${objeto.url}'></a>
        `;
    };
    mes++; // Porque en la API de la NASA, enero es el 1
    xhttp.open(
        "GET",
        "https://api.nasa.gov/planetary/apod?api_key=cLXoxjxRw2sqi7tJ3pEVI4dv0RU36nXgOIngaDVX&date=" +
            anyo +
            "-" +
            mes.toString().padStart(2, "0") +
            "-" +
            dia.toString().padStart(2, "0")
    );
    xhttp.send();
}


// Manejar el envío del formulario
document.getElementById("formularioFecha").addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar que la página se recargue

    // Obtener los valores del formulario
    const dia = parseInt(document.getElementById("dia").value, 10); // Convertir a número entero con base 10
    const mes = parseInt(document.getElementById("mes").value, 10) - 1; // Restar 1 porque los meses en JavaScript van de 0 a 11
    const anyo = parseInt(document.getElementById("anyo").value, 10); // Convertir a número entero con base 10 
    // Llamar a la función para obtener la foto
    llamadaAjax(dia, mes, anyo);
    console.log(dia, mes, anyo); //Compueba que los datos se han recogido correctamente
});
function llamadaAjax(dia, mes, anyo) {
    const url = `https://api.nasa.gov/planetary/apod?api_key=cLXoxjxRw2sqi7tJ3pEVI4dv0RU36nXgOIngaDVX&date=${anyo}-${(mes + 1).toString().padStart(2, "0")}-${dia.toString().padStart(2, "0")}`;
    
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
                <a href='${objeto.url}'><img width="650px" src='${objeto.url}'></a>
            `;
        })
        .catch(error => console.error("Error al obtener los datos:", error));
}

// Función para dibujar un calendario
function dibujarCalendario(mes, anyo, setX, setY) {
    const primero = new Date(anyo, mes).getDay(); // Día de la semana del primer día del mes
    const total = new Date(anyo, mes + 1, 0).getDate(); // Total de días del mes
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    let contador = 1;
    let calendario = `<span class='cabecera'>${meses[mes]} ${anyo}</span><table border="1">`; // Estilo al calendario

    // Bucle para las filas
    for (let fila = 0; fila < 6; fila++) { // Para que se vea de 6 en 6 el calendario
        calendario += "<tr>";
        // Bucle para las columnas
        for (let columna = 0; columna < 7; columna++) { // Para que se vea de 7 en 7
            if (fila === 0 && columna < primero) {
                // Celdas vacías antes del primer día del mes
                calendario += "<td></td>";
            } else if (contador > total) {
                // Celdas vacías después del último día del mes
                calendario += "<td></td>";
            } else {
                // Días del mes con evento onclick
                calendario += `<td onclick="llamadaAjax(${contador}, ${mes}, ${anyo})">${contador}</td>`;
                contador++;
            }
        }
        calendario += "</tr>";
    }
    calendario += "</table>";

    // Crear el contenedor del calendario
    const cuadro = document.createElement("div");
    cuadro.innerHTML = calendario;
    cuadro.style.position = "absolute";
    cuadro.style.left = setX + "px";
    cuadro.style.top = setY + "px";
    document.getElementById("calendario").appendChild(cuadro);
}

// Dibujar el calendario completo
const anyo = 2024; // Cambiado al año 2024

for (let mes = 0; mes < 12; mes++) {
    dibujarCalendario(mes, anyo, (mes % 3) * 400, parseInt(mes / 3) * 225);
}

//FORMULARIO DE COTIZACIÓN
document.addEventListener("DOMContentLoaded", function() {
    fetch("coordenadas.json")
        .then(response => response.json()) // Cargamos el archivo como JSON
        .then(data => {
            // El contenido de "coordenadas.json" se carga como un objeto JavaScript
            const coordenadas = data;
            
            // Ahora puedes utilizar las coordenadas en tu código
            console.log(coordenadas);
        })
        .catch(error => {
            alert("Error al cargar las coordenadas:", error);
        });
});
// Función para calcular la distancia entre dos coordenadas geográficas
function haversineDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en kilómetros
    const dLat = (lat2 - lat1) * (Math.PI / 180); // Diferencia de latitud en radianes
    const dLon = (lon2 - lon1) * (Math.PI / 180); // Diferencia de longitud en radianes

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distancia = R * c; // Distancia en kilómetros

    return distancia;
}

function CalcularCostoEnvio(peso, ancho, alto, coordenadaOrigen, coordenadaDestino) {
    const costo = peso * 15 + ancho * 10 + alto * 10 + haversineDistancia(coordenadaOrigen.latitud, coordenadaOrigen.longitud, coordenadaDestino.latitud, coordenadaDestino.longitud) * 5;
    return costo.toFixed(2);
}
// formulario e historial de cotizaciones
const form = document.getElementById("shipping-form");
const costParagraph = document.getElementById("costo-envio");
const historialLista = document.getElementById("historial-lista");

//listener para envio del form
form.addEventListener("submit", function (event) {
    event.preventDefault();

    let peso = parseFloat(document.getElementById("peso").value);
    let ancho = parseFloat(document.getElementById("ancho").value);
    let alto = parseFloat(document.getElementById("alto").value);
    let provinciaOrigen = document.getElementById("provincia-origen").value;
    let provinciaDestino = document.getElementById("provincia-destino").value;

    // obtener coordenadas de las prov seleccionadas
    const coordenadaOrigen = coordenadas[provinciaOrigen];
    const coordenadaDestino = coordenadas[provinciaDestino];

    // validación para que no se pueda seleccionar la misma provincia como origen y destino
    if (provinciaOrigen === provinciaDestino) {
        Swal.fire({
            icon: 'error',
            title: 'Error en el ingreso de datos',
            text: 'El origen y destino no pueden ser el mismo',
        });
    } else {
        const costoEnvio = CalcularCostoEnvio(peso, ancho, alto, coordenadaOrigen, coordenadaDestino);

        // animacion del texto que muestra el valor de la cotización
        costParagraph.style.fontSize = "25px";

        setTimeout(function () {
            costParagraph.style.fontSize = "20px";
        }, 500);

        // Muestra el resultado del costo del envío y agrego la coti al historial
        costParagraph.textContent = "El costo estimado del envío es de $" + costoEnvio;
        agregarCotizacionAlHistorial(costoEnvio, provinciaOrigen, provinciaDestino);
    }
});

// fn para agregar una cotización al historial y almacenarla en LocalStorage
    function agregarCotizacionAlHistorial(costoEnvio, provinciaOrigen, provinciaDestino) {
    const historialLista = document.getElementById("historial-lista");
    const listItem = document.createElement("li");

    //  la fecha y hora actual
    const now = new Date();
    const formattedDate = now.toLocaleString();

    listItem.textContent = `Desde ${provinciaOrigen} a ${provinciaDestino}: $${costoEnvio} - ${formattedDate}`;

    historialLista.appendChild(listItem);

    let historial = JSON.parse(localStorage.getItem("historial")) || [];

    historial.push({ costoEnvio, provinciaOrigen, provinciaDestino, fecha: formattedDate });

    localStorage.setItem("historial", JSON.stringify(historial));
}

// fn para cargar el historial desde LocalStorage y mostrarlo en la pag.
function cargarHistorialDesdeLocalStorage() {
    const historialLista = document.getElementById("historial-lista");

    const historial = JSON.parse(localStorage.getItem("historial")) || [];

    // muestro el historial en la página
    historial.forEach((cotizacion) => {
        const listItem = document.createElement("li");
        listItem.textContent = `Desde ${cotizacion.provinciaOrigen} a ${cotizacion.provinciaDestino}: $${cotizacion.costoEnvio} -  ${cotizacion.fecha} `;
        historialLista.appendChild(listItem);
    });
}

// llamo a la fn para cargar el historial al cargar la pág
cargarHistorialDesdeLocalStorage();

//BORRAR HISTORIAL
const borrarHistorialButton = document.getElementById("borrar-historial");

borrarHistorialButton.addEventListener("click", function () {
    Swal.fire({
        title: '¿Deseas eliminar el historial?',
        text: 'Este cambio no puede deshacerse.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'rgb(119, 181, 246)',
        cancelButtonColor: 'rgb(240, 77, 72)',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        // Clases para estilos personalizados
        customClass: {
            popup: 'popup-class',
            title: 'title-class',
            icon: 'icon-custom-class',
        },
    }).then((result) => {
        if (result.isConfirmed) {
            // Borrar el historial en el DOM
            historialLista.innerHTML = '';

            // Borrar el historial en LS
            localStorage.removeItem('historial');

            Swal.fire(
                'Eliminado',
                'El historial ha sido eliminado.',
                'success'
            );
        }
    });
});

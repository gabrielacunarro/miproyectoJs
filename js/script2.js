
//////////////////////FORMULARIO DE COTIZACIÓN////////////////////////////////////

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

// Función para calcular la distancia entre dos provincias seleccionadas
function calcularDistanciaEntreProvincias() {
    // Obtener las provincias seleccionadas
    const provinciaOrigen = document.getElementById('provincia-origen').value;
    const provinciaDestino = document.getElementById('provincia-destino').value;

    // Realizar la solicitud fetch para obtener el archivo JSON de coordenadas
    fetch('../data/coordenadas.json') // Ajusta la ruta según sea necesario
        .then(res => res.json())
        .then(data => {
            console.log(data)
            // Obtener las coordenadas de las provincias seleccionadas
            const coordenadasOrigen = data[provinciaOrigen];
            const coordenadasDestino = data[provinciaDestino];

            if (!coordenadasOrigen || !coordenadasDestino) {
                // Manejar errores si las coordenadas no están definidas
                console.error('Coordenadas no definidas para una o ambas provincias seleccionadas');
                return;
            }

            // Calcular la distancia entre las provincias utilizando la función haversineDistancia
            const distancia = haversineDistancia(
                coordenadasOrigen.latitud,
                coordenadasOrigen.longitud,
                coordenadasDestino.latitud,
                coordenadasDestino.longitud
            );

            // Mostrar la distancia en algún lugar de tu página (por ejemplo, en un div con id "costo-envio")
            const costoEnvioElement = document.getElementById('costo-envio');
            costoEnvioElement.innerHTML = `La distancia entre ${provinciaOrigen} y ${provinciaDestino} es de ${distancia.toFixed(2)} km.`;
        })
        .catch(error => {
            console.error('Ha ocurrido un error al obtener los datos:', error);
        });
}

// Obtener los elementos select
const selectProvinciaOrigen = document.getElementById('provincia-origen');
const selectProvinciaDestino = document.getElementById('provincia-destino');

// Función para llenar los select con las opciones del JSON
function llenarSelectConProvincias() {
    fetch('coordenadas.json') // Ajusta la ruta según sea necesario
        .then(response => response.json())
        .then(data => {
            // Iterar a través de las provincias en el JSON y llenar los select
            for (const provincia in data.coordenadas) {
                if (data.coordenadas.hasOwnProperty(provincia)) {
                    // Crear una opción para el select de origen
                    const optionOrigen = document.createElement('option');
                    optionOrigen.value = provincia;
                    optionOrigen.textContent = provincia;
                    
                    // Crear una opción para el select de destino
                    const optionDestino = document.createElement('option');
                    optionDestino.value = provincia;
                    optionDestino.textContent = provincia;

                    // Agregar las opciones a los select
                    selectProvinciaOrigen.appendChild(optionOrigen);
                    selectProvinciaDestino.appendChild(optionDestino);
                }
            }
        })
        .catch(error => {
            console.error('Ha ocurrido un error al obtener los datos:', error);
        });
}

// Llenar los select cuando se carga la página
llenarSelectConProvincias();


// Función para calcular el costo de envío
function CalcularCostoEnvio(peso, ancho, alto, provinciaOrigen, provinciaDestino) {
    // Obtener las coordenadas del JSON de coordenadas
    fetch('../data/coordenadas.json')
        .then(res => res.json())
        .then(data => {
            const coordenadas = data.coordenadas;
            const coordenadaOrigen = coordenadas[provinciaOrigen];
            const coordenadaDestino = coordenadas[provinciaDestino];

            // Validación para que no se pueda seleccionar la misma provincia como origen y destino
            if (provinciaOrigen === provinciaDestino) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error en el ingreso de datos',
                    text: 'El origen y destino no pueden ser el mismo',
                });
                return 0; // Devolvemos 0 como costo si hay un error
            }

            // Calcular la distancia entre las provincias utilizando la función haversineDistancia
            const distancia = haversineDistancia(
                coordenadaOrigen.latitud,
                coordenadaOrigen.longitud,
                coordenadaDestino.latitud,
                coordenadaDestino.longitud
            );

            // Calcular el costo
            const costo = peso * 15 + ancho * 10 + alto * 10 + distancia * 5;

            // Mostrar el resultado en algún lugar de tu página (por ejemplo, en un div con id "costo-envio")
            const costParagraph = document.getElementById('costo-envio');
            costParagraph.style.fontSize = "25px";

            setTimeout(function () {
                costParagraph.style.fontSize = "20px";
            }, 500);

            costParagraph.textContent = "El costo estimado del envío es de $" + costo.toFixed(2);
            
            // Agregar la cotización al historial
            agregarCotizacionAlHistorial(costo.toFixed(2), provinciaOrigen, provinciaDestino);
        })
        .catch(error => {
            console.error('Ha ocurrido un error al obtener los datos:', error);
        });
}

//formulario e historial de cotizaciones
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

    const costoEnvio = CalcularCostoEnvio(peso, ancho, alto, provinciaOrigen, provinciaDestino);

    // animacion del texto que muestra el valor de la cotización
    costParagraph.style.fontSize = "30px";

    setTimeout(function () {
        costParagraph.style.fontSize = "20px";
    }, 500);

    // Muestra el resultado del costo del envío y agrega la cotización al historial
    costParagraph.textContent = "El costo estimado del envío es de $" + costoEnvio;
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
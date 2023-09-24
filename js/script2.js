//FORMULARIO DE COTIZACIÓN

// coordenadas de las provincias
const coordenadas = {
    "Buenos Aires": { latitud: -34.611778, longitud: -58.417301 },
    "Santa Fé": { latitud: -31.6107, longitud: -61.1990 },
    "Entre Ríos": { latitud: -32.0583, longitud: -59.2015 },
    "La Pampa": { latitud: -36.6167, longitud: -64.2833 },
    "Córdoba": { latitud: -31.420083, longitud: -64.188776 },
    "Mendoza": {latitud: -32.8894,longitud: -68.8458},
    "San Juan": {latitud: -31.5375, longitud: -68.5214},
    "San Luis": {latitud: -33.3022, longitud: -66.3360},
    "Jujuy": { latitud: -24.1858, longitud: -65.2995},
    "Salta": { latitud: -24.7829,longitud: -65.4122},
    "Tucumán": {latitud: -26.8083,longitud: -65.2176},
    "Catamarca": {latitud: -28.4696,longitud: -65.7843},
    "Santiago Del Estero": { latitud: -27.7951, longitud: -64.2615},
    "Misiones": {latitud: -27.4269,longitud: -55.9465},
    "Corrientes": {latitud: -27.4691,longitud: -58.8309},
    "Formosa": {latitud: -26.1852,longitud: -58.1754},
    "Chaco": {latitud: -27.4512,longitud: -59.0097},
    "Neuquén": {latitud: -38.9516,longitud: -68.0591},
    "Río Negro": {latitud: -40.4058,longitud: -64.4600},
    "Chubut": {latitud: -43.7886,longitud: -68.7321},
    "Santa Cruz": {latitud: -48.8155,longitud: -69.9408},
    "Tierra del Fuego": {latitud: -54.8069,longitud: -68.3060},
    "La Rioja": {latitud: -29.4135,longitud: -66.8561}
};

function CalcularCostoEnvio(peso, ancho, alto, provinciaOrigen, provinciaDestino) {
    // obtengo la distancia de la tabla de distancias
    const coordenada = coordenadas[provinciaOrigen]?.[provinciaDestino];
    const costo = peso * 15 + ancho * 10 + alto * 10 + coordenada * 5;
    return costo;
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

    // validación para que no se pueda seleccionar la misma provincia como origen y destino
    if (provinciaOrigen === provinciaDestino) {
        Swal.fire({
            icon: 'error',
            title: 'Error en el ingreso de datos',
            text: 'El origen y destino no pueden ser el mismo',
        });
    } else {
        const costoEnvio = CalcularCostoEnvio(peso, ancho, alto, provinciaOrigen, provinciaDestino);

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

            // Borrar el historial en LocalStorage
            localStorage.removeItem('historial');

            Swal.fire(
                'Eliminado',
                'El historial ha sido eliminado.',
                'success'
            );
        }
    });
});







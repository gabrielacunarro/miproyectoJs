const distancias = {
    "Buenos Aires": {
        "Chubut": 1730,
        "Córdoba": 700,
        "Jujuy": 1526,
        "Mendoza": 1000,
        "Misiones": 1150,
        "Santa Fé": 638
    },
    "Córdoba": {
        "Buenos Aires": 700,
        "Chubut": 1817,
        "Jujuy": 901,
        "Mendoza": 624,
        "Misiones": 1294,
        "Santa Fé": 480
    },
    "Mendoza": {
        "Buenos Aires": 1000,
        "Chubut": 1522,
        "Córdoba": 624,
        "Jujuy": 1458,
        "Misiones": 1978,
        "Santa Fé": 638
    },
    "Santa Fé": {
        "Buenos Aires": 638,
        "Chubut": 1996,
        "Córdoba": 480,
        "Jujuy": 1055,
        "Mendoza": 638,
        "Misiones": 922 
    }
};

function CalcularCostoEnvio(peso, ancho, alto, provinciaOrigen, provinciaDestino) {
    // Obtiene la distancia de la tabla de distancias
    const distancia = distancias[provinciaOrigen]?.[provinciaDestino];

    const costo = peso * 15 + ancho * 10 + alto * 10 + distancia * 5;
    return costo;
}

const form = document.getElementById("shipping-form");
const costParagraph = document.getElementById("costo-envio");
const historialLista = document.getElementById("historial-lista");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    let peso = parseFloat(document.getElementById("peso").value);
    let ancho = parseFloat(document.getElementById("ancho").value);
    let alto = parseFloat(document.getElementById("alto").value);
    let provinciaOrigen = document.getElementById("provincia-origen").value;
    let provinciaDestino = document.getElementById("provincia-destino").value;

    // Validación para que no se pueda seleccionar la misma provincia como origen y destino
    if (provinciaOrigen === provinciaDestino) {
        alert("La provincia de origen y destino no pueden ser iguales.");
    } else {
        const costoEnvio = CalcularCostoEnvio(peso, ancho, alto, provinciaOrigen, provinciaDestino);

        // Update font size to trigger the scaling animation
        costParagraph.style.fontSize = "24px"; // Adjust the font size as needed

        // Use setTimeout to reset the font size after the animation
        setTimeout(function () {
            costParagraph.style.fontSize = "20px"; // Reset to the original font size
        }, 500); // Adjust the duration (0.5 seconds) to match the transition duration in CSS

        // Muestra el resultado del costo del envío
        costParagraph.textContent = "El costo estimado del envío es de $" + costoEnvio;

        // Agrego la cotización al historial
        agregarCotizacionAlHistorial(costoEnvio, provinciaOrigen, provinciaDestino);
    }
});



// Función para agregar una cotización al historial y almacenarla en LocalStorage
function agregarCotizacionAlHistorial(costoEnvio, provinciaOrigen, provinciaDestino) {
    const historialLista = document.getElementById("historial-lista");
    
    const listItem = document.createElement("li");
    listItem.textContent = `Desde ${provinciaOrigen} a ${provinciaDestino}: $${costoEnvio}`;
    
    historialLista.appendChild(listItem);

    let historial = JSON.parse(localStorage.getItem("historial")) || [];

    historial.push({ costoEnvio, provinciaOrigen, provinciaDestino });

    localStorage.setItem("historial", JSON.stringify(historial));
}

// Función para cargar el historial desde LocalStorage y mostrarlo en la pag.
function cargarHistorialDesdeLocalStorage() {
    const historialLista = document.getElementById("historial-lista");

    const historial = JSON.parse(localStorage.getItem("historial")) || [];

    // muestro el historial en la página
    historial.forEach((cotizacion) => {
        const listItem = document.createElement("li");
        listItem.textContent = `Desde ${cotizacion.provinciaOrigen} a ${cotizacion.provinciaDestino}: $${cotizacion.costoEnvio}`;
        historialLista.appendChild(listItem);
    });
}

// Llamar a la función para cargar el historial al cargar la página
cargarHistorialDesdeLocalStorage();

const borrarHistorialButton = document.getElementById("borrar-historial");

borrarHistorialButton.addEventListener("click", function () {
    // Borro el historial en el DOM
    historialLista.innerHTML = "";

    // Borro el historial en LStorage
    localStorage.removeItem("historial");
});








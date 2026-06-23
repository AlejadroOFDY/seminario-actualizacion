let modelo;

// -------------------------
// CARGAR MODELO
// -------------------------
async function cargarModelo() {
    try {
        modelo = await mobilenet.load();
        console.log("✅ Modelo cargado correctamente");
    } catch (error) {
        console.log("Error al cargar modelo:", error);
    }
}

// Ejecutar al iniciar
cargarModelo();


// -------------------------
// ELEMENTOS HTML
// -------------------------
const inputImagen = document.getElementById("inputImagen");
const preview = document.getElementById("preview");
const btnDetectar = document.getElementById("btnDetectar");
const resultado = document.getElementById("resultado");


// -------------------------
// MOSTRAR IMAGEN SUBIDA
// -------------------------
inputImagen.addEventListener("change", function(event) {

    const archivo = event.target.files[0];

    if (!archivo) {
        return;
    }

    // Crear URL temporal para mostrar imagen
    const urlImagen = URL.createObjectURL(archivo);

    preview.src = urlImagen;
    preview.style.display = "block";

    resultado.textContent = "";
});


// -------------------------
// DETECTAR CAMIÓN
// -------------------------
btnDetectar.addEventListener("click", async function() {

    // validar imagen
    if (!preview.src) {
        resultado.textContent = "⚠️ Primero subí una imagen";
        return;
    }

    // validar modelo cargado
    if (!modelo) {
        resultado.textContent = "⏳ El modelo todavía está cargando...";
        return;
    }

    resultado.textContent = "🔍 Analizando imagen...";

    try {
        // analizar imagen
        const predicciones = await modelo.classify(preview);

        console.log("Predicciones:", predicciones);

        // palabras relacionadas con camiones
        const palabrasClave = [
            "truck",
            "pickup",
            "trailer",
            "lorry",
            "van",
            "tow truck",
            "moving van"
        ];

        // verificar si encontró camión
        let hayCamion = predicciones.some(prediccion =>
            prediccion.probability > 0.3 &&
            palabrasClave.some(palabra =>
                prediccion.className
                    .toLowerCase()
                    .includes(palabra)
            )
        );

        if (hayCamion) {
            resultado.textContent = "🚛 Se detectó un camión";
        } else {
            resultado.textContent = "❌ No se detectó un camión";
        }

    } catch (error) {
        console.log(error);
        resultado.textContent = "❌ Error al analizar la imagen";
    }

});
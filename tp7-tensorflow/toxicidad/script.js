// Esperar a que cargue el DOM
document
.getElementById("btnAnalizar")
.addEventListener("click", analizarTexto);

async function analizarTexto() {

  // Obtener texto
  const texto = document.getElementById("texto").value;
    const resultado = document.getElementById("resultado");

    // Validación
  if (!texto.trim()) {
    resultado.textContent = "⚠️ Escribí un texto primero";
    return;
  }

  // Mostrar mensaje mientras analiza
  resultado.textContent = "⏳ Analizando texto...";


  // Cargar modelo
  const model = await toxicity.load(0.8);

  // Clasificar texto
  const predictions = await model.classify([texto]);

  console.log(predictions);

  // Verificar toxicidad
  let esToxico = predictions.some(p => p.results[0].match);

  // Mostrar resultado
  if (esToxico) {
    alert("⚠️ Texto tóxico detectado");
  } else {
    alert("✅ Texto limpio");
  }
}
const imageInput = document.getElementById("imageInput");
const trainBtn = document.getElementById("trainBtn");
const identifyBtn = document.getElementById("identifyBtn");
const clearBtn = document.getElementById("clearBtn");
const statusBox = document.getElementById("status");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const resultCard = document.getElementById("resultCard");
const imagePreview = document.getElementById("imagePreview");
const placeholder = document.getElementById("placeholder");
const fileLabel = document.getElementById("fileLabel");
const characterImage = document.getElementById("characterImage");
const characterTitle = document.getElementById("characterTitle");
const characterDescription = document.getElementById("characterDescription");
const characterRace = document.getElementById("characterRace");
const characterGender = document.getElementById("characterGender");
const characterKi = document.getElementById("characterKi");
const characterAffiliation = document.getElementById("characterAffiliation");

let currentFile = null;
let trainingSet = [];
let trainedModel = [];
let selectedCharacter = null;

function setStatus(message) {
  statusBox.textContent = message;
}

function capitalizeWord(text) {
  if (!text) {
    return text;
  }
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function formatListWithY(items) {
  if (!items.length) {
    return "";
  }
  if (items.length === 1) {
    return items[0];
  }
  if (items.length === 2) {
    return `${items[0]} y ${items[1]}`;
  }
  return `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`;
}

function setProgress(percent, message) {
  progressBar.style.width = `${Math.max(0, Math.min(100, percent))}%`;
  progressText.textContent = message;
}

function setPreviewFromFile(file) {
  currentFile = file;
  fileLabel.textContent = file.name;
  imagePreview.src = URL.createObjectURL(file);
  imagePreview.style.display = "block";
  placeholder.style.display = "none";
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () =>
      reject(new Error("No se pudo leer la imagen cargada."));
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(new Error("No se pudo cargar una imagen del dataset."));
    image.src = src;
  });
}

async function imageToHistogram(src) {
  const image = await loadImage(src);
  const canvas = document.createElement("canvas");
  const size = 64;
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(image, 0, 0, size, size);
  const { data } = context.getImageData(0, 0, size, size);
  const bins = new Array(12).fill(0);
  const pixels = size * size;

  for (let index = 0; index < data.length; index += 4) {
    const red = data[index];
    const green = data[index + 1];
    const blue = data[index + 2];
    const brightness = (red + green + blue) / 3;
    const bucket = Math.min(11, Math.floor((brightness / 256) * 12));
    bins[bucket] += 1;
  }

  return bins.map((value) => value / pixels);
}

function cosineSimilarity(a, b) {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function fetchCatalog() {
  const response = await fetch("/api/catalog");
  if (!response.ok) {
    throw new Error(`No se pudo cargar el catálogo (${response.status}).`);
  }
  return response.json();
}

async function trainModel() {
  setStatus("Descargando catálogo de razas...");
  setProgress(10, "Cargando catálogo");
  const catalog = await fetchCatalog();
  trainingSet = Array.isArray(catalog) ? catalog : [];

  if (trainingSet.length !== 20) {
    throw new Error(
      `Se esperaban 20 razas para entrenamiento, pero llegaron ${trainingSet.length}.`,
    );
  }

  trainedModel = [];
  for (let index = 0; index < trainingSet.length; index++) {
    const breedData = trainingSet[index];
    setStatus(`Entrenando con ${capitalizeWord(breedData.breed)}...`);
    const proxyImageUrl = `/api/image?url=${encodeURIComponent(breedData.image)}`;
    const histogram = await imageToHistogram(proxyImageUrl);
    trainedModel.push({ breedData, histogram });
    const percent = 20 + Math.round(((index + 1) / trainingSet.length) * 80);
    setProgress(percent, `Entrenado con ${index + 1} de ${trainingSet.length}`);
  }

  const trainedBreeds = trainingSet.map((item) => capitalizeWord(item.breed));
  setStatus(
    `El modelo entrenó con las razas: ${formatListWithY(trainedBreeds)}.`,
  );
  setProgress(100, "Entrenamiento completado");

  for (const item of trainingSet) {
    console.log(
      `imagen de la raza utilizada para el entrenamiento: ${item.image}`,
    );
  }
}

async function identifyImage() {
  if (!currentFile) {
    setStatus("Primero sube una imagen.");
    return;
  }

  if (!trainedModel.length) {
    setStatus("Primero debes entrenar el modelo.");
    return;
  }

  setStatus("Identificando imagen...");
  const uploadedSrc = await readFileAsDataURL(currentFile);
  const uploadedHistogram = await imageToHistogram(uploadedSrc);

  let bestMatch = null;
  for (const item of trainedModel) {
    const score = cosineSimilarity(uploadedHistogram, item.histogram);
    if (!bestMatch || score > bestMatch.score) {
      bestMatch = { ...item, score };
    }
  }

  if (!bestMatch) {
    setStatus("No se pudo identificar la imagen.");
    return;
  }

  selectedCharacter = bestMatch.breedData;
  characterTitle.textContent = `${capitalizeWord(selectedCharacter.breed)} (${Math.round(bestMatch.score * 100)}% de similitud)`;
  characterDescription.textContent =
    selectedCharacter.description || "Sin descripción disponible.";
  characterRace.textContent = capitalizeWord(selectedCharacter.breed) || "-";
  characterGender.textContent = "Clasificación por similitud visual";
  characterKi.textContent = "dog.ceo/api";
  characterAffiliation.textContent = "20 razas de entrenamiento";
  characterImage.src = `/api/image?url=${encodeURIComponent(selectedCharacter.image)}`;
  characterImage.style.display = "block";
  resultCard.style.display = "flex";
  setStatus(
    `La imagen se parece más a la raza ${capitalizeWord(selectedCharacter.breed)}.`,
  );
}

imageInput.addEventListener("change", () => {
  const file = imageInput.files && imageInput.files[0];
  if (!file) {
    return;
  }

  setPreviewFromFile(file);
  setStatus(
    "Imagen cargada. Entrena el modelo o identifica directamente si ya está entrenado.",
  );
});

trainBtn.addEventListener("click", async () => {
  trainBtn.disabled = true;
  identifyBtn.disabled = true;
  try {
    await trainModel();
  } catch (error) {
    setStatus(`Error al entrenar: ${error.message}`);
    setProgress(0, "Entrenamiento detenido");
  } finally {
    trainBtn.disabled = false;
    identifyBtn.disabled = false;
  }
});

identifyBtn.addEventListener("click", async () => {
  try {
    await identifyImage();
  } catch (error) {
    setStatus(`Error al identificar: ${error.message}`);
  }
});

clearBtn.addEventListener("click", () => {
  imageInput.value = "";
  currentFile = null;
  selectedCharacter = null;
  fileLabel.textContent = "Ningún archivo cargado";
  imagePreview.removeAttribute("src");
  imagePreview.style.display = "none";
  placeholder.style.display = "block";
  characterImage.removeAttribute("src");
  characterImage.style.display = "none";
  resultCard.style.display = "none";
  setProgress(0, "Sin entrenamiento todavía");
  setStatus("Formulario limpiado.");
});

setStatus("Carga una imagen de perro y presiona “Entrenar modelo”.");

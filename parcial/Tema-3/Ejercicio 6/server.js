const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const DOG_API_BASE = "https://dog.ceo/api";

const TRAINING_BREEDS = [
  "affenpinscher",
  "african",
  "airedale",
  "akita",
  "appenzeller",
  "basenji",
  "beagle",
  "bluetick",
  "borzoi",
  "bouvier",
  "boxer",
  "brabancon",
  "briard",
  "bulldog",
  "bullterrier",
  "rottweiler",
  "chihuahua",
  "chow",
  "collie",
  "dalmatian",
];

const BREED_DESCRIPTIONS = {
  affenpinscher:
    "Raza pequeña y activa, conocida por su carácter curioso y valiente.",
  african:
    "Perro de rasgos atléticos y energía alta, ideal para actividad diaria.",
  airedale:
    "Terrier inteligente, protector y con buena capacidad de aprendizaje.",
  akita: "Raza fuerte, leal y reservada, con gran instinto de protección.",
  appenzeller:
    "Perro de trabajo suizo, muy dinámico y excelente para tareas de campo.",
  basenji:
    "Perro elegante y atento, famoso por su forma particular de vocalizar.",
  beagle: "Raza amigable y olfativa, muy usada en trabajo de rastreo.",
  bluetick:
    "Sabueso resistente con gran olfato y buena disposición al trabajo.",
  borzoi: "Lebrel veloz y estilizado, de temperamento tranquilo en casa.",
  bouvier: "Perro robusto y protector, tradicionalmente utilizado como pastor.",
  boxer: "Raza juguetona, fuerte y muy cercana a la familia.",
  brabancon: "Perro de compañía compacto, expresivo y atento al entorno.",
  briard: "Pastor francés inteligente y leal, destacado en obediencia.",
  bulldog: "Raza tranquila y afectuosa, de aspecto compacto y fuerte.",
  bullterrier: "Perro enérgico, activo y de personalidad marcada.",
  chihuahua: "Raza miniatura, alerta y muy vinculada a su tutor.",
  chow: "Perro de porte imponente, tranquilo y de carácter independiente.",
  collie: "Raza inteligente y colaborativa, famosa por su instinto pastor.",
  dalmatian: "Perro atlético y sociable, reconocido por su pelaje moteado.",
  rottweiler: "Perro robusto, seguro de sí mismo y excelente guardián.",
};

let cachedCatalog = null;

function sendFile(res, filePath, contentType) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Archivo no encontrado");
      return;
    }
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(JSON.stringify(payload));
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".html") return "text/html; charset=utf-8";
  if (ext === ".css") return "text/css; charset=utf-8";
  if (ext === ".js") return "application/javascript; charset=utf-8";
  if (ext === ".json") return "application/json; charset=utf-8";
  if (ext === ".webp") return "image/webp";
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  return "text/plain; charset=utf-8";
}

async function buildDogCatalog() {
  console.log("Iniciando la construcción del catálogo de perros...");
  const catalog = [];
  for (const breed of TRAINING_BREEDS) {
    console.log(`Obteniendo imágenes para la raza: ${breed}`);
    const url = `${DOG_API_BASE}/breed/${breed}/images`;
    console.log(`Consultando URL: ${url}`);
    const response = await fetch(url);
    console.log(
      `Respuesta recibida para ${breed} con estado: ${response.status}`,
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        `Error al obtener datos para ${breed}. Estado: ${response.status}, Cuerpo: ${errorBody}`,
      );
      throw new Error(
        `No se pudo obtener el catálogo de imágenes para la raza: ${breed}`,
      );
    }

    const data = await response.json();
    console.log(`Datos JSON procesados para ${breed}.`);
    const imageList = Array.isArray(data.message)
      ? data.message.slice().sort()
      : [];

    if (!imageList.length) {
      console.warn(`No se encontraron imágenes para la raza: ${breed}`);
      throw new Error(`No se encontraron imágenes para la raza: ${breed}`);
    }

    console.log(`Imagen seleccionada para ${breed}: ${imageList[0]}`);
    catalog.push({
      breed,
      image: imageList[0],
      description:
        BREED_DESCRIPTIONS[breed] ||
        "Raza canina incluida en el conjunto de entrenamiento.",
    });
  }
  console.log("Catálogo de perros construido exitosamente.");
  return catalog;
}

async function proxyDogCatalog(req, res) {
  try {
    if (!cachedCatalog) {
      cachedCatalog = await buildDogCatalog();
    }
    sendJson(res, 200, cachedCatalog);
  } catch (error) {
    console.error("Error en proxyDogCatalog:", error);
    sendJson(res, 500, { error: error.message });
  }
}

async function proxyImage(req, res, url) {
  const imageUrl = url.searchParams.get("url");
  if (!imageUrl) {
    sendJson(res, 400, { error: "Falta el parámetro url" });
    return;
  }

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      sendJson(res, response.status, { error: "No se pudo obtener la imagen" });
      return;
    }

    const contentType =
      response.headers.get("content-type") || "application/octet-stream";
    const arrayBuffer = await response.arrayBuffer();
    res.writeHead(200, {
      "Content-Type": contentType,
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store",
    });
    res.end(Buffer.from(arrayBuffer));
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/catalog") {
    proxyDogCatalog(req, res);
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/image") {
    proxyImage(req, res, url);
    return;
  }

  if (
    req.method === "GET" &&
    (url.pathname === "/" || url.pathname === "/index.html")
  ) {
    sendFile(res, path.join(ROOT, "index.html"), "text/html; charset=utf-8");
    return;
  }

  if (req.method === "GET" && url.pathname === "/styles.css") {
    sendFile(res, path.join(ROOT, "styles.css"), "text/css; charset=utf-8");
    return;
  }

  if (req.method === "GET" && url.pathname === "/app.js") {
    sendFile(
      res,
      path.join(ROOT, "app.js"),
      "application/javascript; charset=utf-8",
    );
    return;
  }

  const assetPath = path.join(ROOT, url.pathname);
  if (fs.existsSync(assetPath) && fs.statSync(assetPath).isFile()) {
    sendFile(res, assetPath, getContentType(assetPath));
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Ruta no encontrada");
});

server.listen(PORT, () => {
  console.log(`Servidor Ejercicio 6 ejecutándose en http://localhost:${PORT}`);
  console.log(
    "Rutas: GET /  GET /styles.css  GET /app.js  GET /api/catalog  GET /api/image?url=...",
  );
});

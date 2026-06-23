// ============================================================
//  EJERCICIO B2  -  Formula objetivo:  y = 2x -3
//  Backend Node.js  |  Puerto 8008

const http = require("http");

const PORT = 8008;

let trainedModel = null;

const XS_DATA = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4];
const YS_DATA = XS_DATA.map((x) => 2 * x - 3);

async function trainModel() {
  const losses = [];
  let weight = Math.random() * 2 - 1;
  let bias = Math.random() * 2 - 1;
  const learningRate = 0.01;
  const epochs = 250;

  for (let epoch = 0; epoch < epochs; epoch++) {
    let weightGradient = 0;
    let biasGradient = 0;
    let loss = 0;

    for (let i = 0; i < XS_DATA.length; i++) {
      const x = XS_DATA[i];
      const y = YS_DATA[i];
      const prediction = weight * x + bias;
      const error = prediction - y;
      loss += error * error;
      weightGradient += error * x;
      biasGradient += error;
    }

    loss /= XS_DATA.length;
    losses.push(loss);
    weight -= (learningRate * 2 * weightGradient) / XS_DATA.length;
    bias -= (learningRate * 2 * biasGradient) / XS_DATA.length;
  }

  return { model: { weight, bias }, losses };
}

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = req.url.split("?")[0];

  if (req.method === "POST" && url === "/train") {
    try {
      console.log("Entrenando modelo...");
      const trained = await trainModel();
      trainedModel = trained.model;
      console.log("Modelo entrenado.");
      res.writeHead(200);
      res.end(
        JSON.stringify({
          status: "ok",
          message: "Modelo entrenado",
          losses: trained.losses,
        }),
      );
    } catch (err) {
      res.writeHead(500);
      res.end(JSON.stringify({ status: "error", message: err.message }));
    }
    return;
  }

  if (req.method === "POST" && url === "/predict") {
    if (!trainedModel) {
      res.writeHead(400);
      res.end(
        JSON.stringify({
          status: "error",
          message: "El modelo no fue entrenado aun",
        }),
      );
      return;
    }
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const { x } = JSON.parse(body);
        const result = trainedModel.weight * x + trainedModel.bias;
        res.writeHead(200);
        res.end(JSON.stringify({ status: "ok", x, y: result }));
      } catch (err) {
        res.writeHead(400);
        res.end(JSON.stringify({ status: "error", message: err.message }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ status: "error", message: "Ruta no encontrada" }));
});

server.listen(PORT, () => {
  console.log("Servidor B2  (y = 2x - 3)  en http://localhost:" + PORT);
  console.log("Rutas: POST /train   POST /predict");
});

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import matricesRoute from "./src/routes/matrices.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, "frontend")));

// Rutas API
app.use("/api/matrices", matricesRoute);

// Ruta raíz
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(
    `📁 Frontend servido desde: ${path.join(__dirname, "frontend")}`,
  );
});

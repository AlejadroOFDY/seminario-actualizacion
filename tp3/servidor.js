const express = require("express");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PUERTO = 5000;
const SESSION_COOKIE_NAME = "tp3_session_id";
const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 30 * 1000;
const DATA_DIR = path.join(__dirname, "session_data");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

app.use(express.json());
app.use(cookieParser());
app.use(express.static(__dirname));

function getCryptoSessionId() {
  const buffer = crypto.randomBytes(16);
  const hex = buffer.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function getOrCreateSessionId(req, res) {
  let sessionId = req.cookies[SESSION_COOKIE_NAME];

  if (!sessionId || typeof sessionId !== "string" || sessionId.length !== 36) {
    sessionId = getCryptoSessionId();
    res.cookie(SESSION_COOKIE_NAME, sessionId, {
      maxAge: SESSION_COOKIE_MAX_AGE,
      httpOnly: true,
      sameSite: "Lax",
    });
  }

  return sessionId;
}

function sessionFilePath(sessionId) {
  return path.join(DATA_DIR, `${sessionId}.json`);
}

function readStudents(sessionId) {
  const filePath = sessionFilePath(sessionId);

  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(content);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (error) {
    return [];
  }

  return [];
}

function writeStudents(sessionId, students) {
  const filePath = sessionFilePath(sessionId);
  const tempPath = `${filePath}.tmp`;

  try {
    fs.writeFileSync(tempPath, JSON.stringify(students, null, 2), "utf-8");
    fs.renameSync(tempPath, filePath);
  } catch (error) {
    console.error("Error escribiendo estudiantes:", error);
  }
}

app.get("/api/students", (req, res) => {
  const sessionId = getOrCreateSessionId(req, res);
  const students = readStudents(sessionId);

  res.json({ students });
});

app.put("/api/students", (req, res) => {
  const sessionId = getOrCreateSessionId(req, res);
  const { students } = req.body;

  if (!Array.isArray(students)) {
    return res.status(400).json({ error: "El campo students debe ser una lista" });
  }

  writeStudents(sessionId, students);
  res.json({ ok: true });
});

app.listen(PUERTO, () => {
  console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
});

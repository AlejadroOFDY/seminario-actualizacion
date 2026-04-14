import express from "express";
import { sumar, multiplicar } from "../controllers/matrices.controller.js";

const router = express.Router();

router.post("/sumar", sumar);
router.post("/multiplicar", multiplicar);

export default router;

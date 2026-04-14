import {
  sumarMatrices,
  multiplicarMatrices,
} from "../models/matriz.model.js";

export const sumar = (req, res) => {
  try {
    const { matriz1, matriz2 } = req.body;

    if (!matriz1 || !matriz2) {
      return res.status(400).json({
        exito: false,
        error: "Ambas matrices son requeridas",
      });
    }

    const resultado = sumarMatrices(matriz1, matriz2);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({
      exito: false,
      error: "Error en el servidor: " + error.message,
    });
  }
};

export const multiplicar = (req, res) => {
  try {
    const { matriz1, matriz2 } = req.body;

    if (!matriz1 || !matriz2) {
      return res.status(400).json({
        exito: false,
        error: "Ambas matrices son requeridas",
      });
    }

    const resultado = multiplicarMatrices(matriz1, matriz2);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({
      exito: false,
      error: "Error en el servidor: " + error.message,
    });
  }
};

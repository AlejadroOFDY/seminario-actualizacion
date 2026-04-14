// Validar que una matriz sea válida
export function validarMatriz(matriz) {
  if (!matriz || !Array.isArray(matriz)) {
    return false;
  }

  if (matriz.length === 0) {
    return false;
  }

  const primerFila = matriz[0];
  if (!Array.isArray(primerFila) || primerFila.length === 0) {
    return false;
  }

  // Verificar que todas las filas tengan la misma cantidad de columnas
  const numColumnas = primerFila.length;
  for (let i = 0; i < matriz.length; i++) {
    if (!Array.isArray(matriz[i]) || matriz[i].length !== numColumnas) {
      return false;
    }
  }

  return true;
}

// Sumar dos matrices
export function sumarMatrices(matriz1, matriz2) {
  // Validar que ambas matrices sean válidas
  if (!validarMatriz(matriz1) || !validarMatriz(matriz2)) {
    return {
      exito: false,
      error: "Una o ambas matrices son inválidas",
    };
  }

  // Validar que tengan la misma dimensión
  if (
    matriz1.length !== matriz2.length ||
    matriz1[0].length !== matriz2[0].length
  ) {
    return {
      exito: false,
      error: `Las matrices deben tener la misma dimensión. Matriz 1: ${matriz1.length}x${matriz1[0].length}, Matriz 2: ${matriz2.length}x${matriz2[0].length}`,
    };
  }

  const resultado = [];
  for (let i = 0; i < matriz1.length; i++) {
    resultado[i] = [];
    for (let j = 0; j < matriz1[i].length; j++) {
      resultado[i][j] = matriz1[i][j] + matriz2[i][j];
    }
  }

  return {
    exito: true,
    resultado: resultado,
  };
}

// Multiplicar dos matrices
export function multiplicarMatrices(matriz1, matriz2) {
  // Validar que ambas matrices sean válidas
  if (!validarMatriz(matriz1) || !validarMatriz(matriz2)) {
    return {
      exito: false,
      error: "Una o ambas matrices son inválidas",
    };
  }

  // Validar que se cumplan las condiciones de multiplicación
  if (matriz1[0].length !== matriz2.length) {
    return {
      exito: false,
      error: `No se puede multiplicar. Las columnas de la primera matriz (${matriz1[0].length}) deben ser iguales a las filas de la segunda (${matriz2.length})`,
    };
  }

  const resultado = [];
  for (let i = 0; i < matriz1.length; i++) {
    resultado[i] = [];
    for (let j = 0; j < matriz2[0].length; j++) {
      let suma = 0;
      for (let k = 0; k < matriz2.length; k++) {
        suma += matriz1[i][k] * matriz2[k][j];
      }
      resultado[i][j] = suma;
    }
  }

  return {
    exito: true,
    resultado: resultado,
  };
}

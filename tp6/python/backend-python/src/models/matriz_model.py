from typing import List, Union


Number = Union[int, float]
Matrix = List[List[Number]]


def validar_matriz(matriz: Matrix) -> bool:
    if not isinstance(matriz, list) or len(matriz) == 0:
        return False

    primera_fila = matriz[0]
    if not isinstance(primera_fila, list) or len(primera_fila) == 0:
        return False

    columnas = len(primera_fila)

    for fila in matriz:
        if not isinstance(fila, list) or len(fila) != columnas:
            return False

        for valor in fila:
            if not isinstance(valor, (int, float)):
                return False

    return True


def sumar_matrices(matriz1: Matrix, matriz2: Matrix):
    if not validar_matriz(matriz1) or not validar_matriz(matriz2):
        return {
            "exito": False,
            "error": "Una o ambas matrices son inválidas",
        }

    if len(matriz1) != len(matriz2) or len(matriz1[0]) != len(matriz2[0]):
        return {
            "exito": False,
            "error": (
                "Las matrices deben tener la misma dimensión. "
                f"Matriz 1: {len(matriz1)}x{len(matriz1[0])}, "
                f"Matriz 2: {len(matriz2)}x{len(matriz2[0])}"
            ),
        }

    resultado: Matrix = []
    for i in range(len(matriz1)):
        fila_resultado: List[Number] = []
        for j in range(len(matriz1[0])):
            fila_resultado.append(matriz1[i][j] + matriz2[i][j])
        resultado.append(fila_resultado)

    return {
        "exito": True,
        "resultado": resultado,
    }


def multiplicar_matrices(matriz1: Matrix, matriz2: Matrix):
    if not validar_matriz(matriz1) or not validar_matriz(matriz2):
        return {
            "exito": False,
            "error": "Una o ambas matrices son inválidas",
        }

    if len(matriz1[0]) != len(matriz2):
        return {
            "exito": False,
            "error": (
                "No se puede multiplicar. "
                f"Las columnas de la primera matriz ({len(matriz1[0])}) "
                f"deben ser iguales a las filas de la segunda ({len(matriz2)})"
            ),
        }

    filas_resultado = len(matriz1)
    columnas_resultado = len(matriz2[0])
    resultado: Matrix = []

    for i in range(filas_resultado):
        fila_resultado: List[Number] = []
        for j in range(columnas_resultado):
            suma = 0
            for k in range(len(matriz2)):
                suma += matriz1[i][k] * matriz2[k][j]
            fila_resultado.append(suma)
        resultado.append(fila_resultado)

    return {
        "exito": True,
        "resultado": resultado,
    }

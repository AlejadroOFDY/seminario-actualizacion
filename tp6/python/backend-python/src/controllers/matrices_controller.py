from flask import Request

from src.models.matriz_model import multiplicar_matrices, sumar_matrices


def sumar_controller(request: Request):
    body = request.get_json(silent=True) or {}

    matriz1 = body.get("matriz1")
    matriz2 = body.get("matriz2")

    if matriz1 is None or matriz2 is None:
        return {
            "exito": False,
            "error": "Ambas matrices son requeridas",
        }, 400

    resultado = sumar_matrices(matriz1, matriz2)
    status = 200 if resultado.get("exito") else 400
    return resultado, status


def multiplicar_controller(request: Request):
    body = request.get_json(silent=True) or {}

    matriz1 = body.get("matriz1")
    matriz2 = body.get("matriz2")

    if matriz1 is None or matriz2 is None:
        return {
            "exito": False,
            "error": "Ambas matrices son requeridas",
        }, 400

    resultado = multiplicar_matrices(matriz1, matriz2)
    status = 200 if resultado.get("exito") else 400
    return resultado, status

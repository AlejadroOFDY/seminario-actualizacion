from flask import Blueprint, jsonify, request

from src.controllers.matrices_controller import (
    multiplicar_controller,
    sumar_controller,
)


matrices_bp = Blueprint("matrices", __name__)


@matrices_bp.post("/sumar")
def sumar_route():
    response, status = sumar_controller(request)
    return jsonify(response), status


@matrices_bp.post("/multiplicar")
def multiplicar_route():
    response, status = multiplicar_controller(request)
    return jsonify(response), status

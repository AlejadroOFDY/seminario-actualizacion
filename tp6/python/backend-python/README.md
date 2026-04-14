# Backend Python - Matrices

Backend cliente-servidor para suma y multiplicacion de matrices usando Flask.

Este backend sirve automaticamente el frontend en JS ubicado en tp6/js/matrices-backend/frontend.

## Estructura

- app.py: punto de entrada del backend
- requirements.txt: dependencias
- src/config/settings.py: host y puerto
- src/models/matriz_model.py: validaciones y operaciones
- src/controllers/matrices_controller.py: logica HTTP
- src/routes/matrices_routes.py: rutas de la API

## Requisitos

- Python 3.10 o superior

## Instalacion

Desde la carpeta backend-python:

1. Instalar dependencias:

   pip install -r requirements.txt

## Ejecucion

### Opcion 1 (directo en backend-python)

1. Ir a backend-python
2. Ejecutar:

   python app.py

Servidor por defecto:

- http://127.0.0.1:5000

Al abrir esa URL se carga el frontend completo (HTML, CSS y JS) y consume la API Python.

### Opcion 2 (desde tp6/python)

Tambien podes ejecutar desde tp6/python con:

python app.py

Ese archivo redirige al backend ubicado en backend-python.

## Endpoints

- GET /
- GET /assets/css/index.css
- POST /api/matrices/sumar
- POST /api/matrices/multiplicar

### Ejemplo body JSON

{
  "matriz1": [[1, 2], [3, 4]],
  "matriz2": [[5, 6], [7, 8]]
}

## Respuestas

Exito:

{
  "exito": true,
  "resultado": [[6, 8], [10, 12]]
}

Error:

{
  "exito": false,
  "error": "Mensaje descriptivo"
}

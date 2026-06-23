# Ejercicio 5 - Modelo Lineal `y = 2x - 3`

## Descripción

Este ejercicio muestra un sistema simple con dos partes:

- **Backend** en Node.js, en el puerto **8008**.
- **Frontend** en HTML, CSS y JavaScript.

El sistema aprende la fórmula lineal `y = 2x - 3`, permite hacer predicciones para cualquier valor de `x` y muestra una **gráfica de pérdida** durante el entrenamiento.

## ¿Qué hace?

1. El backend entrena un modelo lineal con datos generados a partir de la fórmula `y = 2x - 3`.
2. El frontend envía una petición a `/train` para iniciar el entrenamiento.
3. Cuando termina, el backend devuelve el historial de pérdida.
4. El frontend dibuja esa pérdida en una gráfica usando Chart.js.
5. Luego se puede ingresar un valor de `x` y consultar `/predict` para obtener el valor estimado de `y`.

## Archivos

- `sistema.js`: servidor Node.js con las rutas `/train` y `/predict`.
- `index.html`: interfaz web para entrenar, predecir y ver la gráfica de pérdida.

## Requisitos

- Tener instalado **Node.js**.
- No se necesitan paquetes adicionales de npm.
- Se requiere conexión a internet para cargar **Chart.js** desde CDN.

## Cómo ejecutar

1. Abrir una terminal en la carpeta del ejercicio:

   ```bash
   cd "c:\Users\IPF-2026\Desktop\parcial\Tema-3\Ejercicio 5"
   ```

2. Iniciar el servidor:

   ```bash
   node sistema.js
   ```

3. Verificar que el servidor quedó activo en:

   ```
   http://localhost:8008
   ```

4. Abrir `index.html` en el navegador.

5. Presionar **Entrenar modelo**.
6. Escribir un valor de `x` y presionar **Predecir Y**.

## Endpoints del backend

- `POST /train`
  - Entrena el modelo.
  - Devuelve el mensaje de éxito y el arreglo de pérdidas.

- `POST /predict`
  - Recibe un JSON con `{ "x": թիվ }`.
  - Devuelve la predicción de `y`.

## Ejemplo de uso

- Si ingresas `x = 10`, el valor esperado es cercano a `y = 17`.
- La gráfica de pérdida debe ir bajando conforme avanza el entrenamiento.

## Nota

Si aparece un error de conexión, revisa primero que el backend esté ejecutándose en el puerto `8008` antes de abrir el frontend.

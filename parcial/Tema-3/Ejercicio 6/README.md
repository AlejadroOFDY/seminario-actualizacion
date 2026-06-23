# Ejercicio 6 - Modelo visual de perros

## ¿Qué hace este proyecto?

Este ejercicio crea una página web simple con HTML, CSS y JavaScript que:

- Permite subir una imagen.
- Muestra una vista previa local de la imagen cargada.
- Descarga 20 razas de perros desde Dog API.
- Entrena un modelo visual simple con 1 imagen fija por cada raza.
- Identifica cuál raza se parece más a la imagen subida.
- Muestra la imagen, la descripción y datos del resultado.

## API utilizada

Se usa Dog API:

- Ejemplo solicitado: `https://dog.ceo/api/breed/hound/images`
- Endpoint base usado: `https://dog.ceo/api`
- Consulta por raza: `https://dog.ceo/api/breed/{raza}/images`

El catálogo interno devuelve para cada raza:

- `breed`
- `image`
- `description`

## Estructura de archivos

- `server.js`: servidor en JavaScript que sirve la página y hace de proxy hacia la API.
- `index.html`: estructura principal de la interfaz.
- `styles.css`: estilos separados del HTML.
- `app.js`: lógica del frontend y del modelo visual.

## ¿Cómo funciona?

1. El usuario abre la página desde el servidor local.
2. Sube una imagen propia.
3. Presiona **Entrenar modelo**.
4. El navegador descarga 20 razas y genera una representación visual simple de cada imagen.
5. Presiona **Identificar imagen**.
6. La app compara la imagen cargada contra el conjunto aprendido y devuelve la raza más parecida.
7. Se muestra la imagen de la raza detectada y una breve descripción.
8. Al terminar el entrenamiento, aparece el mensaje con todas las razas usadas.
9. También se imprime en consola un enlace por línea con este formato:
   `imagen de la raza utilizada para el entrenamiento: <enlace>`
   Para visualizar las imágenes, es necesario copiar el enlace de la consola y pegarlo en una nueva pestaña del navegador.

## ¿Cómo ejecutarlo?

1. Abrir una terminal dentro de la carpeta `Ejercicio 6`.
2. Ejecutar el servidor:

```bash
node server.js
```

3. Abrir en el navegador:

```text
http://localhost:3000
```

## Importante

No abras `index.html` con doble clic ni usando `file://`.
Si se abre así, el navegador bloquea las peticiones y aparece el error de CORS.

## Notas

- No se necesitan paquetes extra de npm.
- El proyecto usa solo Node.js y APIs nativas del navegador.
- El modelo visual es simple y está pensado para cumplir la consigna con una solución clara y legible.

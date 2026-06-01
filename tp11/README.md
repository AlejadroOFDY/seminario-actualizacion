# Trabajo práctico: Tres en Raya con TensorFlow.js

Este proyecto contiene una aplicación de Tres en Raya (tic-tac-toe) contra un competidor humano usando un modelo de TensorFlow.js.

## Imágenes

### Imagen 1: Apache iniciado en XAMPP

![Apache iniciado en XAMPP](/simple-ttt-model/apache-iniciado.png)

### Imagen 2: Tres en raya en el navegador

![Tres en raya](/simple-ttt-model/tres-en-raya.png)

Estas dos capturas forman parte de la explicación del trabajo: primero se inicia Apache en XAMPP y luego se abre la aplicación en `http://localhost/simple-ttt-model` para jugar.

## Paso a paso para realizar y ejecutar el trabajo

### 1. Descargar el archivo `.zip` del modelo

Descargá el `.zip` que contiene el proyecto completo, incluyendo la carpeta `simple-ttt-model` y el modelo entrenado.

### 2. Inicializar Apache en XAMPP

Abrí el panel de control de XAMPP y encendé **Apache**.

> Verificá que el estado quede en color verde o con la palabra `running`.

### 3. Copiar la carpeta en `htdocs`

Buscá el directorio donde se instaló XAMPP. Dentro de esa instalación abrí la carpeta `htdocs`.

Luego copiá ahí la carpeta `simple-ttt-model` que viene dentro del `.zip`.

La estructura debe quedar así:

```text
c:\xampp\htdocs\simple-ttt-model
```

### 4. Abrir la aplicación en el navegador

Abrí tu navegador y escribí la siguiente dirección:

```text
http://localhost/simple-ttt-model
```

### 5. Jugar

Una vez que cargue la página, vas a ver el tablero de Tres en Raya.

Ahora podés jugar contra el modelo:

- Vos sos `X`.
- El modelo es `O`.
- Hacé clic en una casilla vacía para hacer tu jugada.
- El modelo responderá con su movimiento.

## Archivos importantes

- `index.html`: interfaz y lógica del juego.
- `model/ttt_model.json`: definición del modelo.
- `model/ttt_model.weights.bin`: pesos del modelo.

## Nota

Si la página no carga el modelo, revisá que Apache esté encendido y que la carpeta `simple-ttt-model` esté dentro de `htdocs`.

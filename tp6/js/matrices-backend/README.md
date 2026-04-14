# Suma y Multiplicación de Matrices - Backend Node.js

## Descripción
Versión cliente-servidor de la aplicación de suma y multiplicación de matrices usando Node.js y Express como backend. Estructura profesional con separación de concerns (models, controllers, routes).

## Estructura del proyecto

```
matrices-backend/
├── app.js                      # Punto de entrada (Express)
├── package.json                # Dependencias del proyecto
├── src/
│   ├── config/                 # Configuración del servidor
│   ├── controllers/            # Lógica de las operaciones
│   │   └── matrices.controller.js
│   ├── models/                 # Funciones de validación y cálculo
│   │   └── matriz.model.js
│   └── routes/                 # Definición de rutas API
│       └── matrices.route.js
└── frontend/                   # Carpeta con archivos del cliente
    ├── index.html
    ├── index.js
    └── assets/css/
        └── index.css
```

## Características

✅ **ES Modules** - Código moderno con import/export  
✅ **Estructura profesional** - Separación de concerns (models, controllers, routes)  
✅ **Servidor Express** en Puerto 3000  
✅ **API REST** con endpoints POST para sumar y multiplicar  
✅ **CORS habilitado** para comunicación cliente-servidor  
✅ **Validación en el servidor** de matrices  
✅ **Mensajes de error detallados**  
✅ **Frontend ligero** que delega cálculos al servidor  

## Instalación

1. **Las dependencias ya están instaladas**. Si necesitas reinstalar:
   ```bash
   npm install
   ```

2. Las dependencias instaladas son:
   - `express`: Framework web
   - `cors`: Para permitir comunicación cross-origin

## Ejecución

### Iniciar el servidor

```bash
npm start
```

O directamente con Node.js:

```bash
node app.js
```

El servidor se ejecutará en:
```
http://localhost:3000
```

Cuando veas este mensaje, el servidor está listo:
```
✅ Servidor ejecutándose en http://localhost:3000
📁 Frontend servido desde: ...
```

## Cómo funciona

### Cliente (Frontend)

1. El usuario ingresa dimensiones de las matrices
2. Genera las matrices con inputs
3. Completa los valores numéricos
4. Hace clic en "Sumar" o "Multiplicar"
5. El cliente envía las matrices al servidor via HTTP POST

### Servidor (Backend)

1. Recibe POST en `/api/sumar` o `/api/multiplicar`
2. Valida que las matrices sean válidas
3. Verifica las reglas matemáticas (dimensiones, etc.)
4. Realiza la operación
5. Retorna el resultado en JSON

### Endpoints de la API

#### POST /api/matrices/sumar
Suma dos matrices del mismo tamaño.

**Request:**
```json
{
  "matriz1": [[1, 2], [3, 4]],
  "matriz2": [[5, 6], [7, 8]]
}
```

**Response (éxito):**
```json
{
  "exito": true,
  "resultado": [[6, 8], [10, 12]]
}
```

**Response (error):**
```json
{
  "exito": false,
  "error": "Las matrices deben tener la misma dimensión..."
}
```

#### POST /api/matrices/multiplicar
Multiplica dos matrices respetando las reglas matemáticas.

**Request:**
```json
{
  "matriz1": [[1, 2], [3, 4]],
  "matriz2": [[5, 6], [7, 8]]
}
```

**Response (éxito):**
```json
{
  "exito": true,
  "resultado": [[19, 22], [43, 50]]
}
```

**Response (error):**
```json
{
  "exito": false,
  "error": "Las columnas de la primera matriz deben ser iguales a las filas de la segunda"
}
```

## Validaciones

### En el Servidor

✅ Verifica que las matrices sean válidas (arrays anidados)  
✅ **Para Suma**: Ambas matrices deben tener las mismas dimensiones  
✅ **Para Multiplicación**: Las columnas de M1 deben ser iguales a las filas de M2  
✅ Validación de tipo de datos  

### En el Cliente

✅ Valida que dimensiones sean números enteros positivos  
✅ Marca campos vacíos o no numéricos  
✅ Muestra errores específicos del servidor  

## Solución de problemas

### "No se puede conectar a localhost:3000"
- Asegúrate de que el servidor está ejecutándose
- Verifica que el puerto 3000 esté disponible

### "Error 404" al abrir la página
- El servidor debe estar ejecutándose
- Abre http://localhost:3000 en el navegador

### "Error de CORS"
- El servidor tiene CORS habilitado para todas las rutas
- Si ves errores de CORS, verifica la consola del navegador

## Próximas mejoras

- [ ] Agregar validación de entrada más stricta
- [ ] Agregar historial de operaciones
- [ ] Implementar autenticación
- [ ] Base de datos para guardar matrices

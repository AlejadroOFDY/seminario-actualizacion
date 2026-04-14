# Suma y Multiplicación de Matrices

## Descripción
Aplicación web para realizar operaciones de suma y multiplicación con matrices. Permite al usuario crear matrices de cualquier dimensión, ingresar valores y realiza operaciones matemáticas con validación.

## Características

✅ **Generación de matrices**: Especifica filas y columnas para crear matrices  
✅ **Validación**: Los campos solo aceptan números enteros positivos  
✅ **Entrada de datos**: Tabla interactiva para ingresar valores numéricos  
✅ **Suma de matrices**: Suma matrices de la misma dimensión  
✅ **Multiplicación de matrices**: Multiplica matrices respetando la regla: columnas de matriz 1 = filas de matriz 2  
✅ **Mensajes de error**: Indicadores claros en rojo para errores  
✅ **Visualización**: Muestra las matrices ingresadas y el resultado  

## Cómo usar

1. **Generar Primera Matriz**:
   - Ingresa el número de filas (ej: 3)
   - Ingresa el número de columnas (ej: 3)
   - Haz clic en "Generar"

2. **Generar Segunda Matriz**:
   - Repite el mismo proceso en la sección "Segunda Matriz"

3. **Ingresar valores**:
   - Completa los campos de entrada con números
   - Los campos pueden ser enteros o decimales

4. **Realizar operación**:
   - **Sumar**: Ambas matrices deben tener la misma dimensión (ej: 3x3)
   - **Multiplicar**: Las columnas de la primera = filas de la segunda
   - Haz clic en el botón correspondiente

5. **Ver resultado**:
   - La matriz resultante aparecerá en la sección "Resultado"

## Mensajes de error

- ❌ Si ingresas un número inválido al generar la matriz
- ❌ Si dejas campos vacíos en la matriz
- ❌ Si intentas sumar matrices de diferente dimensión
- ❌ Si intentas multiplicar matrices que no cumplen la regla

## Estructura de archivos

```
matrices/
├── index.html          # Estructura HTML
├── index.js            # Lógica JavaScript
└── assets/
    └── css/
        └── index.css   # Estilos CSS
```



# 📚 Gestión de Calificaciones con Matrices Multidimensionales

Trabajo práctico de la materia **Seminario de Actualización II 2026**.  
Implementación en **Python** y **JavaScript** de un sistema de gestión de calificaciones usando matrices multidimensionales (listas dentro de listas).

---

## 📁 Estructura del proyecto

```
gestion-calificaciones/
├── README.md
├── python/
│   └── calificaciones.py
└── javascript/
    └── calificaciones.js
```

---

## 🧱 Estructura de datos

Se usa una matriz multidimensional con el siguiente formato:

```python
alumnos = [
    ['Juan',  [['Matematicas', 8], ['Lengua', 9], ['Sociales', 7], ['Naturales', 7]]],
    ['Ana',   [['Lengua', 9], ['Matematicas', 10], ['Sociales', 8], ['Naturales', 6]]],
    ['Luis',  [['Lengua', 6], ['Sociales', 8], ['Matematicas', 7], ['Naturales', 6]]],
    ['María', [['Lengua', 9], ['Sociales', 10], ['Naturales', 10], ['Matematicas', 9]]]
]
```

- `alumnos[i][0]` → nombre del alumno
- `alumnos[i][1]` → lista de materias del alumno
- `alumnos[i][1][j][0]` → nombre de la materia
- `alumnos[i][1][j][1]` → nota de la materia

---

## 🐍 Python — Paso a paso

### Paso 1: Crear el archivo

Crear el archivo `python/calificaciones.py`.

### Paso 2: Declarar la matriz inicial

```python
alumnos = [
    ['Juan',  [['Matematicas', 8], ['Lengua', 9], ['Sociales', 7], ['Naturales', 7]]],
    ['Ana',   [['Lengua', 9], ['Matematicas', 10], ['Sociales', 8], ['Naturales', 6]]],
    ['Luis',  [['Lengua', 6], ['Sociales', 8], ['Matematicas', 7], ['Naturales', 6]]],
    ['María', [['Lengua', 9], ['Sociales', 10], ['Naturales', 10], ['Matematicas', 9]]]
]
```

### Paso 3: Función para buscar alumno

```python
def buscar_alumno(nombre):
    for alumno in alumnos:
        if alumno[0].lower() == nombre.lower():
            return alumno
    return None
```

Recorre la lista y compara nombres ignorando mayúsculas. Retorna el alumno encontrado o `None`.

### Paso 4: Función para buscar materia

```python
def buscar_materia(materias, nombre_materia):
    for materia in materias:
        if materia[0].lower() == nombre_materia.lower():
            return materia
    return None
```

### Paso 5: Función para mostrar todos los alumnos

```python
def ver_alumnos():
    print("\n===== LISTADO DE ALUMNOS =====")
    for alumno in alumnos:
        print(f"\nAlumno: {alumno[0]}")
        for materia in alumno[1]:
            print(f"  - {materia[0]}: {materia[1]}")
        # BONUS: calcular promedio
        promedio = sum(m[1] for m in alumno[1]) / len(alumno[1])
        print(f"  Promedio: {promedio:.2f}")
```

### Paso 6: Función para agregar alumno

```python
def agregar_alumno():
    nombre = input("Ingrese el nombre del alumno: ").strip()
    existente = buscar_alumno(nombre)

    if existente:
        print(f"El alumno '{nombre}' ya está registrado.")
        agregar_o_modificar_notas(nombre)
        return

    materias = []
    while True:
        materia = input("Nombre de la materia (o 'fin' para terminar): ").strip()
        if materia.lower() == 'fin':
            break
        nota = int(input(f"Nota para {materia}: "))
        materias.append([materia, nota])

    alumnos.append([nombre, materias])
    print(f"Alumno '{nombre}' agregado correctamente.")
```

### Paso 7: Función para agregar o modificar notas

```python
def agregar_o_modificar_notas(nombre=None):
    if not nombre:
        nombre = input("Nombre del alumno: ").strip()

    alumno = buscar_alumno(nombre)
    if not alumno:
        print("Alumno no encontrado.")
        return

    nombre_materia = input("Nombre de la materia: ").strip()
    materia = buscar_materia(alumno[1], nombre_materia)

    if materia:
        nueva_nota = int(input(f"La materia ya existe. Nueva nota (actual: {materia[1]}): "))
        materia[1] = nueva_nota
        print("Nota modificada correctamente.")
    else:
        nota = int(input("Materia nueva. Ingrese la nota: "))
        alumno[1].append([nombre_materia, nota])
        print("Materia agregada correctamente.")
```

### Paso 8: BONUS — Alumno con mejor promedio y ordenamiento

```python
def mejor_promedio():
    mejor = None
    mayor = -1
    for alumno in alumnos:
        prom = sum(m[1] for m in alumno[1]) / len(alumno[1])
        if prom > mayor:
            mayor = prom
            mejor = alumno[0]
    print(f"\nMejor promedio: {mejor} con {mayor:.2f}")

def ordenar_por_promedio():
    def promedio(alumno):
        return sum(m[1] for m in alumno[1]) / len(alumno[1])
    ordenados = sorted(alumnos, key=promedio, reverse=True)
    print("\n===== ALUMNOS ORDENADOS POR PROMEDIO =====")
    for a in ordenados:
        print(f"  {a[0]}: {promedio(a):.2f}")
```

### Paso 9: Menú principal

```python
def menu():
    while True:
        print("\n===== MENÚ =====")
        print("1. Ver alumnos")
        print("2. Agregar alumno")
        print("3. Agregar o modificar notas")
        print("4. Mejor promedio")
        print("5. Ordenar por promedio")
        print("6. Salir")

        opcion = input("Seleccione una opción: ").strip()

        if opcion == '1':
            ver_alumnos()
        elif opcion == '2':
            agregar_alumno()
        elif opcion == '3':
            agregar_o_modificar_notas()
        elif opcion == '4':
            mejor_promedio()
        elif opcion == '5':
            ordenar_por_promedio()
        elif opcion == '6':
            print("¡Hasta luego!")
            break
        else:
            print("Opción inválida.")

menu()
```

### ▶️ Ejecutar en Python

```bash
python python/calificaciones.py
```

---

## ✅ Restricciones cumplidas

| Restricción | ¿Cumplida? |
|---|---|
| Matrices multidimensionales (listas dentro de listas) | ✅ |
| Sin bases de datos | ✅ |
| Sin interfaz gráfica | ✅ |
| Ejecución completa por consola | ✅ |
| Implementado en Python y JavaScript | ✅ |

---

## ⭐ Bonus implementado

- Cálculo del promedio por alumno al mostrar el listado.
- Función para mostrar el alumno con mejor promedio.
- Función para ordenar alumnos por promedio de mayor a menor.

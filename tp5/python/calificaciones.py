alumnos = [
    ["Juan", [["Matematicas", 8], ["Lengua", 9], ["Sociales", 7], ["Naturales", 7]]],
    ["Ana", [["Lengua", 9], ["Matematicas", 10], ["Sociales", 8], ["Naturales", 6]]],
    ["Luis", [["Lengua", 6], ["Sociales", 8], ["Matematicas", 7], ["Naturales", 6]]],
    ["María", [["Lengua", 9], ["Sociales", 10], ["Naturales", 10], ["Matematicas", 9]]],
]


def buscar_alumno(nombre):
    for alumno in alumnos:
        if alumno[0].lower() == nombre.lower():
            return alumno
    return None


def buscar_materia(materias, nombre_materia):
    for materia in materias:
        if materia[0].lower() == nombre_materia.lower():
            return materia
    return None


def calcular_promedio(materias):
    if not materias:
        return None
    return sum(m[1] for m in materias) / len(materias)


def ver_alumnos():
    print("\n===== LISTADO DE ALUMNOS =====")
    for alumno in alumnos:
        print(f"\nAlumno: {alumno[0]}")
        for materia in alumno[1]:
            print(f"  - {materia[0]}: {materia[1]}")

        promedio = calcular_promedio(alumno[1])
        if promedio is None:
            print("  Promedio: sin materias cargadas")
        else:
            print(f"  Promedio: {promedio:.2f}")


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
        if materia.lower() == "fin":
            break
        nota = int(input(f"Nota para {materia}: "))
        materias.append([materia, nota])

    alumnos.append([nombre, materias])
    print(f"Alumno '{nombre}' agregado correctamente.")


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
        nueva_nota = int(
            input(f"La materia ya existe. Nueva nota (actual: {materia[1]}): ")
        )
        materia[1] = nueva_nota
        print("Nota modificada correctamente.")
    else:
        nota = int(input("Materia nueva. Ingrese la nota: "))
        alumno[1].append([nombre_materia, nota])
        print("Materia agregada correctamente.")


def mejor_promedio():
    mejor = None
    mayor = -1
    for alumno in alumnos:
        prom = calcular_promedio(alumno[1])
        if prom is None:
            continue
        if prom > mayor:
            mayor = prom
            mejor = alumno[0]

    if mejor is None:
        print("\nNo hay promedios disponibles. Agregá materias con nota.")
        return

    print(f"\nMejor promedio: {mejor} con {mayor:.2f}")


def ordenar_por_promedio():
    def promedio(alumno):
        valor = calcular_promedio(alumno[1])
        return valor if valor is not None else -1

    ordenados = sorted(alumnos, key=promedio, reverse=True)
    print("\n===== ALUMNOS ORDENADOS POR PROMEDIO =====")
    for a in ordenados:
        prom = calcular_promedio(a[1])
        if prom is None:
            print(f"  {a[0]}: sin materias cargadas")
        else:
            print(f"  {a[0]}: {prom:.2f}")


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

        if opcion == "1":
            ver_alumnos()
        elif opcion == "2":
            agregar_alumno()
        elif opcion == "3":
            agregar_o_modificar_notas()
        elif opcion == "4":
            mejor_promedio()
        elif opcion == "5":
            ordenar_por_promedio()
        elif opcion == "6":
            print("¡Hasta luego!")
            break
        else:
            print("Opción inválida.")


menu()
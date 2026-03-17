print(
    "El siguiente programa trabaja con matrices, la cantidad de columnas es 1 por defecto y las personas se irán agregando uno tras otro de forma automática"
)

question = int(input("¿Cuantas personas quiere ingresar? "))

row = question

x = 0
people_list = []
notas = []
prom = 0


while x < row:
    fila = []
    fila.append(input("Ingrese el nombre: "))
    fila.append(int(input("Ingrese la edad: ")))
    fila.append(float(input("Ingrese la nota: ")))

    people_list.append(fila)
    print(people_list)
    x += 1

for i in people_list:
    notas.append(i[2])

notas.sort(reverse=True)
print(f"Las notas ordenadas de mayor a menor son: {notas}")

for value in notas:
    prom += value
print(f"El promedio es {prom / question}")

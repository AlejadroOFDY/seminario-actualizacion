// Estado de las matrices
let matriz1 = null;
let matriz2 = null;
let filas1 = 0;
let columnas1 = 0;
let filas2 = 0;
let columnas2 = 0;

// Elementos del DOM
const filas1Input = document.getElementById('filas1');
const columnas1Input = document.getElementById('columnas1');
const filas2Input = document.getElementById('filas2');
const columnas2Input = document.getElementById('columnas2');

const errorFilas1 = document.getElementById('error-filas1');
const errorColumnas1 = document.getElementById('error-columnas1');
const errorFilas2 = document.getElementById('error-filas2');
const errorColumnas2 = document.getElementById('error-columnas2');
const errorOperacion = document.getElementById('error-operacion');

const btnGenerar1 = document.getElementById('btn-generar1');
const btnGenerar2 = document.getElementById('btn-generar2');
const btnSumar = document.getElementById('btn-sumar');
const btnMultiplicar = document.getElementById('btn-multiplicar');

const matriz1Container = document.getElementById('matriz1-container');
const matriz2Container = document.getElementById('matriz2-container');
const displayMatriz1 = document.getElementById('display-matriz1');
const displayMatriz2 = document.getElementById('display-matriz2');
const resultadoContainer = document.getElementById('resultado-container');
const displayResultado = document.getElementById('display-resultado');
const loader = document.getElementById('loader');

// Validar que sea un número entero positivo
function validarNumeroPositivo(valor) {
    return Number.isInteger(Number(valor)) && Number(valor) > 0;
}

// Mostrar error
function mostrarError(elemento, mensaje) {
    elemento.textContent = mensaje;
    elemento.style.display = mensaje ? 'block' : 'none';
}

// Limpiar errores
function limpiarErrores(numeroMatriz) {
    if (numeroMatriz === 1) {
        mostrarError(errorFilas1, '');
        mostrarError(errorColumnas1, '');
    } else {
        mostrarError(errorFilas2, '');
        mostrarError(errorColumnas2, '');
    }
}

// Generar matriz vacía
function generarMatriz(filas, columnas) {
    const matriz = [];
    for (let i = 0; i < filas; i++) {
        matriz[i] = [];
        for (let j = 0; j < columnas; j++) {
            matriz[i][j] = 0;
        }
    }
    return matriz;
}

// Crear inputs para llenar la matriz
function crearInputsMatriz(filas, columnas, numeroMatriz) {
    const container = numeroMatriz === 1 ? matriz1Container : matriz2Container;
    container.innerHTML = '';
    
    const tabla = document.createElement('table');
    tabla.className = 'matriz-tabla';
    
    for (let i = 0; i < filas; i++) {
        const fila = document.createElement('tr');
        for (let j = 0; j < columnas; j++) {
            const celda = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'number';
            input.step = 'any';
            input.placeholder = '0';
            input.dataset.fila = i;
            input.dataset.columna = j;
            input.dataset.matriz = numeroMatriz;
            celda.appendChild(input);
            fila.appendChild(celda);
        }
        tabla.appendChild(fila);
    }
    
    container.appendChild(tabla);
}

// Obtener valores de la matriz
function obtenerValoresMatriz(numeroMatriz) {
    const inputs = document.querySelectorAll(
        `input[data-matriz="${numeroMatriz}"]`
    );
    const filas = numeroMatriz === 1 ? filas1 : filas2;
    const columnas = numeroMatriz === 1 ? columnas1 : columnas2;
    const matriz = [];
    
    let tieneErrores = false;
    
    // Limpiar errores previos
    inputs.forEach(input => {
        input.classList.remove('error-input');
    });
    
    for (let i = 0; i < filas; i++) {
        matriz[i] = [];
        for (let j = 0; j < columnas; j++) {
            const input = document.querySelector(
                `input[data-matriz="${numeroMatriz}"][data-fila="${i}"][data-columna="${j}"]`
            );
            
            if (input) {
                const valor = input.value.trim();
                
                if (valor === '') {
                    input.classList.add('error-input');
                    tieneErrores = true;
                    matriz[i][j] = 0;
                } else if (isNaN(valor)) {
                    input.classList.add('error-input');
                    tieneErrores = true;
                    matriz[i][j] = 0;
                } else {
                    matriz[i][j] = parseFloat(valor);
                }
            }
        }
    }
    
    return { matriz, tieneErrores };
}

// Mostrar matriz formateada
function mostrarMatrizFormateada(matriz, elemento) {
    elemento.innerHTML = '';
    
    if (!matriz || matriz.length === 0) {
        elemento.innerHTML = '<p class="matriz-vacia">Matriz vacía</p>';
        return;
    }
    
    const tabla = document.createElement('table');
    tabla.className = 'matriz-tabla-display';
    
    for (let i = 0; i < matriz.length; i++) {
        const fila = document.createElement('tr');
        for (let j = 0; j < matriz[i].length; j++) {
            const celda = document.createElement('td');
            celda.textContent = matriz[i][j];
            fila.appendChild(celda);
        }
        tabla.appendChild(fila);
    }
    
    elemento.appendChild(tabla);
}

// Mostrar/ocultar loader
function mostrarLoader(mostrar) {
    loader.style.display = mostrar ? 'block' : 'none';
}

// Generar matriz 1
btnGenerar1.addEventListener('click', () => {
    limpiarErrores(1);
    const filas = filas1Input.value.trim();
    const columnas = columnas1Input.value.trim();
    
    let hayError = false;
    
    if (!validarNumeroPositivo(filas)) {
        mostrarError(errorFilas1, '❌ Debe ser un número entero positivo');
        hayError = true;
    }
    
    if (!validarNumeroPositivo(columnas)) {
        mostrarError(errorColumnas1, '❌ Debe ser un número entero positivo');
        hayError = true;
    }
    
    if (!hayError) {
        filas1 = parseInt(filas);
        columnas1 = parseInt(columnas);
        matriz1 = generarMatriz(filas1, columnas1);
        crearInputsMatriz(filas1, columnas1, 1);
        limpiarResultado();
    }
});

// Generar matriz 2
btnGenerar2.addEventListener('click', () => {
    limpiarErrores(2);
    const filas = filas2Input.value.trim();
    const columnas = columnas2Input.value.trim();
    
    let hayError = false;
    
    if (!validarNumeroPositivo(filas)) {
        mostrarError(errorFilas2, '❌ Debe ser un número entero positivo');
        hayError = true;
    }
    
    if (!validarNumeroPositivo(columnas)) {
        mostrarError(errorColumnas2, '❌ Debe ser un número entero positivo');
        hayError = true;
    }
    
    if (!hayError) {
        filas2 = parseInt(filas);
        columnas2 = parseInt(columnas);
        matriz2 = generarMatriz(filas2, columnas2);
        crearInputsMatriz(filas2, columnas2, 2);
        limpiarResultado();
    }
});

// Limpiar resultado
function limpiarResultado() {
    resultadoContainer.style.display = 'none';
    displayResultado.innerHTML = '';
    mostrarError(errorOperacion, '');
}

// Llamar al servidor para sumar
async function sumarEnServidor(m1, m2) {
    mostrarLoader(true);
    try {
        const response = await fetch('/api/matrices/sumar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                matriz1: m1,
                matriz2: m2
            })
        });
        
        const data = await response.json();
        mostrarLoader(false);
        return data;
        
    } catch (error) {
        mostrarLoader(false);
        return {
            exito: false,
            error: 'Error de conexión: ' + error.message
        };
    }
}

// Llamar al servidor para multiplicar
async function multiplicarEnServidor(m1, m2) {
    mostrarLoader(true);
    try {
        const response = await fetch('/api/matrices/multiplicar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                matriz1: m1,
                matriz2: m2
            })
        });
        
        const data = await response.json();
        mostrarLoader(false);
        return data;
        
    } catch (error) {
        mostrarLoader(false);
        return {
            exito: false,
            error: 'Error de conexión: ' + error.message
        };
    }
}

// Botón Sumar
btnSumar.addEventListener('click', async () => {
    mostrarError(errorOperacion, '');
    
    // Validar que ambas matrices estén generadas
    if (!matriz1 || !matriz2) {
        mostrarError(errorOperacion, '❌ Debes generar ambas matrices primero');
        return;
    }
    
    // Obtener valores
    const { matriz: m1, tieneErrores: errores1 } = obtenerValoresMatriz(1);
    const { matriz: m2, tieneErrores: errores2 } = obtenerValoresMatriz(2);
    
    if (errores1 || errores2) {
        mostrarError(errorOperacion, '❌ Hay campos vacíos o inválidos en las matrices');
        return;
    }
    
    // Mostrar matrices ingresadas
    mostrarMatrizFormateada(m1, displayMatriz1);
    mostrarMatrizFormateada(m2, displayMatriz2);
    
    // Llamar al servidor
    const resultado = await sumarEnServidor(m1, m2);
    
    if (resultado.exito) {
        mostrarMatrizFormateada(resultado.resultado, displayResultado);
        resultadoContainer.style.display = 'block';
    } else {
        mostrarError(errorOperacion, '❌ ' + resultado.error);
        resultadoContainer.style.display = 'none';
    }
});

// Botón Multiplicar
btnMultiplicar.addEventListener('click', async () => {
    mostrarError(errorOperacion, '');
    
    // Validar que ambas matrices estén generadas
    if (!matriz1 || !matriz2) {
        mostrarError(errorOperacion, '❌ Debes generar ambas matrices primero');
        return;
    }
    
    // Obtener valores
    const { matriz: m1, tieneErrores: errores1 } = obtenerValoresMatriz(1);
    const { matriz: m2, tieneErrores: errores2 } = obtenerValoresMatriz(2);
    
    if (errores1 || errores2) {
        mostrarError(errorOperacion, '❌ Hay campos vacíos o inválidos en las matrices');
        return;
    }
    
    // Mostrar matrices ingresadas
    mostrarMatrizFormateada(m1, displayMatriz1);
    mostrarMatrizFormateada(m2, displayMatriz2);
    
    // Llamar al servidor
    const resultado = await multiplicarEnServidor(m1, m2);
    
    if (resultado.exito) {
        mostrarMatrizFormateada(resultado.resultado, displayResultado);
        resultadoContainer.style.display = 'block';
    } else {
        mostrarError(errorOperacion, '❌ ' + resultado.error);
        resultadoContainer.style.display = 'none';
    }
});

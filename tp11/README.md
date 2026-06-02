# Arquitectura de 3 Capas con Patrón Cache-Aside (Redis)

Este proyecto implementa un sistema distribuido en 3 máquinas virtuales (VMs) sobre VirtualBox bajo el modo de red **NAT estricto**. El sistema expone una interfaz web que consulta un modelo matemático ($Y = 2x^2 + 5x + 3$) al Backend. Para optimizar el rendimiento, se integra un motor de Caché (Redis) que almacena las últimas N consultas mediante una política de desalojo LRU (Least Recently Used).

## 🗺️ Flujo de la Arquitectura (Request / Response)

```text
[ Cliente / Navegador ]
          │
          ▼
   [ FRONTEND (VM3) ]
          │
          ▼
   [ BACKEND (VM2) ]  <════ (¿Existe 'X' en caché?) ════> [ CACHÉ REDIS (VM4) ]
   (Calcula la ecuación si hay "Cache Miss")```

🚀 Guía de Configuración Paso a Paso
🧠 Fase 1: Capa de Caché (VM4 - Redis)
Esta máquina se encargará de almacenar en memoria RAM los resultados recientes para evitar recálculos en el Backend.

1 - Instalación:

```sudo apt update
sudo apt install redis-server -y```

2 - Configuración de Red y Política de Caché (Investigación):
Para permitir conexiones externas y limitar la memoria a las "últimas N consultas" (usando el algoritmo LRU), edita el archivo de configuración:

```sudo nano /etc/redis/redis.conf```

Modifica o comenta el bind local para abrirlo a la red: bind 0.0.0.0

Desactiva el modo protegido (solo para entornos de desarrollo): protected-mode no

Al final del archivo, agrega la política de desalojo de memoria:

```maxmemory 2mb
maxmemory-policy allkeys-lru```

3 - Aplicar cambios:

```sudo systemctl restart redis-server```

4 - ⚙️ Regla de VirtualBox (Puerto Redis):

Configuración -> Red -> Avanzado -> Reenvío de puertos.

Agrega: Nombre: Redis | Protocolo: TCP | Puerto Anfitrión: 6379 | IP Invitado: [IP_VM4] | Puerto Invitado: 6379.

⚙️ Fase 2: Capa de Negocio / Backend (VM2 - Node.js)
El Backend orquesta la lógica: consulta a Redis primero, y si no existe el dato, resuelve la ecuación matemática.

1 - Preparación del Entorno:

```mkdir backend-calc && cd backend-calc
npm init -y
npm install express cors redis```

2 - Código de la API (index.js):

```const express = require('express');
const cors = require('cors');
const { createClient } = require('redis');

const app = express();
app.use(cors());

// Conexión al túnel del Host (VirtualBox) para evadir el aislamiento NAT
const redisClient = createClient({
    url: 'redis://10.0.2.2:6379' 
});

redisClient.on('error', (err) => console.log('Error en Redis', err));
redisClient.connect().then(() => console.log('✅ Conectado a Redis Cache (VM4)'));

// Endpoint del modelo: y = 2x^2 + 5x + 3
app.get('/calcular/:x', async (req, res) => {
    const x = parseFloat(req.params.x);
    const cacheKey = `calculo_x_${x}`; 

    try {
        // 1. Preguntamos al Caché
        const valorEnCache = await redisClient.get(cacheKey);

        if (valorEnCache) {
            console.log(`⚡ CACHE HIT: Devolviendo desde memoria para x=${x}`);
            return res.json({ x: x, y: parseFloat(valorEnCache), origen: 'Caché Ultrarrápido' });
        }

        // 2. Cache Miss: Calculamos el modelo matemático
        console.log(`🐢 CACHE MISS: Calculando ecuación para x=${x}`);
        const y = 2 * Math.pow(x, 2) + 5 * x + 3;

        // 3. Guardamos el resultado en Caché
        await redisClient.set(cacheKey, y, { EX: 3600 });

        res.json({ x: x, y: y, origen: 'Backend (Calculado)' });

    } catch (error) {
        res.status(500).json({ error: 'Error del servidor' });
    }
});

app.listen(3000, () => {
    console.log('🚀 Backend Node.js escuchando en el puerto 3000');
});```

3 - ⚙️ Regla de VirtualBox (Puerto Backend):

Configuración -> Red -> Avanzado -> Reenvío de puertos.

Agrega: Nombre: API_Node | Protocolo: TCP | Puerto Anfitrión: 3000 | IP Invitado: [IP_VM2] | Puerto Invitado: 3000.

🖥️ Fase 3: Capa de Presentación / Frontend (VM1)
Interfaz estática (HTML/JS) que permite al cliente ingresar X y visualizar tanto la respuesta Y como el origen de los datos.
También es posible crear un archivo html en el escritorio, pegar el código de abajo y abrirlo directamente en el navegador.

1 - Código del Frontend (index.html):

```<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Calculadora con Caché (Redis)</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
        .resultado { margin-top: 20px; padding: 20px; font-size: 24px; font-weight: bold; }
        .origen { font-size: 16px; color: gray; margin-top: 10px;}
        .hit { color: #28a745; font-weight: bold; }
        .miss { color: #dc3545; font-weight: bold; }
    </style>
</head>
<body>
    <h1>Modelo Matemático: Y = 2x² + 5x + 3</h1>
    <input type="number" id="valorX" placeholder="Ingresa X" style="padding: 10px; font-size: 18px;">
    <button onclick="consultar()" style="padding: 10px 20px; font-size: 18px;">Calcular</button>

    <div id="pantallaResultado" class="resultado"></div>
    <div id="pantallaOrigen" class="origen"></div>

    <script>
        // Apunta al túnel del Host en Windows
        const BACKEND_URL = 'http://localhost:3000';

        async function consultar() {
            const x = document.getElementById('valorX').value;
            if(x === '') return alert('Ingresa un número');

            document.getElementById('pantallaResultado').innerText = "Calculando...";

            try {
                const response = await fetch(`${BACKEND_URL}/calcular/${x}`);
                const data = await response.json();

                document.getElementById('pantallaResultado').innerText = `Y = ${data.y}`;

                const claseOrigen = data.origen.includes('Caché') ? 'hit' : 'miss';
                document.getElementById('pantallaOrigen').innerHTML = `Origen: <span class="${claseOrigen}">${data.origen}</span>`;
            } catch (error) {
                document.getElementById('pantallaResultado').innerText = "Error de conexión al Backend";
            }
        }
    </script>
</body>
</html>```

🛠️ Bitácora de Errores Comunes y Soluciones
Durante la implementación en VirtualBox se documentaron los siguientes fallos críticos:

1. Conflicto de IP Estática tras clonar máquina virtual
El Problema: Al crear la VM4 a partir de un clon, la nueva instancia no tenía conexión SSH porque heredó el archivo Netplan con la IP de la máquina original (10.0.2.15), generando un conflicto de red.

Solución: Se ingresó a la consola nativa de VirtualBox, se editó el archivo sudo nano /etc/netplan/50-cloud-init.yaml para asignar una IP libre (10.0.2.18) y se ejecutó sudo netplan apply.

2. Módulo de Redis no encontrado en Node.js (MODULE_NOT_FOUND)
El Problema: Al ejecutar node index.js, el motor devolvía Error: Cannot find module 'redis'.

Solución: Aunque el servidor Redis físico estaba en la VM4, el código Node.js en la VM2 requería su respectivo cliente intérprete. Se solucionó ejecutando npm install redis en la carpeta del backend.

3. Aislamiento en modo NAT (connect EHOSTUNREACH 10.0.2.18:6379)
El Problema: El backend Node.js (VM2) intentó conectarse directamente a la IP de la caché (VM4). Como las interfaces de red de VirtualBox estaban en modo "NAT" normal, las máquinas se encontraban en subredes aisladas y físicamente inalcanzables entre sí.

Solución: Se implementó un túnel de reenvío de puertos cruzando la pasarela del Host anfitrión. En el backend se cambió la URL de Redis a redis://10.0.2.2:6379.

4. Bloqueo de seguridad de Redis (SocketClosedUnexpectedlyError)
El Problema: Una vez superado el aislamiento de red, la conexión llegaba a Redis en la VM4 pero este cerraba el socket de forma forzada, abortando el proceso en el backend.

Solución: El error se debía al mecanismo de defensa de Redis por defecto. Al exponer la escucha a 0.0.0.0 sin contraseña, el servidor cerraba la puerta. Se solucionó editando redis.conf y configurando protected-mode no, para luego reiniciar el servicio.
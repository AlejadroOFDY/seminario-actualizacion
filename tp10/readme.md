# Sistema de Gestión de Alumnos - Arquitectura de 3 Capas Distribuida

Este repositorio contiene la implementación práctica de un sistema distribuido en **3 capas (Fases 1, 2 y 3)** montado sobre el entorno de virtualización **VirtualBox** utilizando tres máquinas virtuales independientes con **Ubuntu Server 24.04 LTS**. 

El proyecto demuestra la separación de responsabilidades en la infraestructura de TI moderna:
1. **Capa de Datos (VM1):** Servidor de Base de Datos relacional (MariaDB).
2. **Capa de Negocio / API Rest (VM2):** Backend desarrollado en Node.js (Express).
3. **Capa de Presentación / Frontend (VM3):** Servidor Web (Apache2) que sirve una interfaz HTML5/JavaScript.

---

## 🗺️ Diagrama de Arquitectura y Red Virtual

Debido a que el entorno utiliza el modo **NAT** independiente por cada máquina virtual (lo que genera un aislamiento estricto entre ellas), se implementó un enrutamiento estratégico cruzando el puente de la máquina física (**Host Anfitrión**) para permitir la comunicación bidireccional segura.

    [ Máquina Física / Windows Host ] (Navegador Web -> localhost:8080)
                   │
      ┌────────────┼────────────┐
      │ (Port:2221)│ (Port:3454)│ (Port:8080)
      ▼            ▼            ▼
┌───────────┐┌───────────┐┌───────────┐
│    VM1    ││    VM2    ││    VM3    │
│  Base de  ││  Backend  ││ Frontend  │
│   Datos   ││  Node.js  ││  Apache2  │
│(10.0.2.15)││(10.0.2.16)││(10.0.2.17)│
└─────▲─────┘└─────┬─────┘└───────────┘
      │            │
      └─[10.0.2.2]─┘  <- Túnel de Red sobre Gateway de VirtualBox

---

## 🚀 Guía de Instalación y Configuración Paso a Paso

### 📦 Fase 1: Configuración de la Capa de Datos (VM1)

1. **Instalación de MariaDB Server:**
   `sudo apt update`
   `sudo apt install mariadb-server -y`

2. **Configuración de Red Estática:**
   Edite el archivo de Netplan `sudo nano /etc/netplan/50-cloud-init.yaml`:
   ```yaml
   network:
     version: 2
     ethernets:
       enp0s3:
         dhcp4: false
         addresses:
           - 10.0.2.15/24
         routes:
           - to: default
             via: 10.0.2.2
         nameservers:
           addresses: [8.8.8.8, 1.1.1.1]

Aplique los cambios con sudo netplan apply.

Creación del Esquema de Base de Datos:
Acceda a la consola de MariaDB (sudo mysql -u root -p) y ejecute:

SQL
CREATE DATABASE systema_alumnos;
USE systema_alumnos;

CREATE TABLE alumnos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    apellidos VARCHAR(100) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    dni VARCHAR(100) UNIQUE NOT NULL
);

CREATE USER 'alejandro'@'%' IDENTIFIED BY '123456';
GRANT ALL PRIVILEGES ON systema_alumnos.* TO 'alejandro'@'%';
FLUSH PRIVILEGES;
EXIT;

Reglas de Reenvío de Puertos en VirtualBox (VM1):

SSH: Puerto Anfitrión 2221 -> Puerto Invitado 22

MySQL: Puerto Anfitrión 3306 -> Puerto Invitado 3306 (IP Invitado: 10.0.2.15)

⚙️ Fase 2: Configuración del Backend / API Rest (VM2)
Preparación del Entorno:
Instale Node.js, elimine servicios redundantes heredados de la clonación para liberar recursos de RAM y cree la carpeta del proyecto:
sudo apt remove --purge mariadb-server mariadb-client -y && sudo apt autoremove -y
mkdir ~/api-backend && cd ~/api-backend
npm init -y
npm install express mysql2 cors

Configuración de Red Estática (Netplan):
Fije la IP 10.0.2.16/24 de la misma manera que en la VM1 dentro de /etc/netplan/50-cloud-init.yaml y aplique con sudo netplan apply.

Código de la Aplicación (index.js):

JavaScript
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
    host: '10.0.2.2', // Apunta al Host de VirtualBox que reenvía a la VM1
    user: 'alejandro',
    password: '123456',
    database: 'systema_alumnos',
    port: 3306
};

// Endpoint para insertar alumnos
app.post('/grabaAlumnos', async (req, res) => {
    const { apellidos, nombres, dni } = req.body; 
    try {
        const conn = await mysql.createConnection(dbConfig);
        const [rows] = await conn.execute('SELECT count(*) as count FROM alumnos WHERE dni = ?', [dni]);

        if (rows[0].count > 0) {
            res.json(0); // DNI Duplicado
        } else {
            await conn.execute('INSERT INTO alumnos (apellidos, nombre, dni) VALUES (?, ?, ?)', [apellidos, nombres, dni]);
            res.json(1); // Inserción exitosa
        }
        await conn.end();
    } catch (error) {
        console.error("Error en inserción:", error.message);
        res.status(500).json(0);
    }
});

// Endpoint para listar alumnos
app.get('/consultarAlumnos', async (req, res) => {
    try {
        const conn = await mysql.createConnection(dbConfig);
        const [rows] = await conn.execute('SELECT id, apellidos, nombre AS nombres, dni FROM alumnos ORDER BY apellidos ASC, nombre ASC');
        res.json(rows); 
        await conn.end();
    } catch (error) {
        console.error("Error en consulta:", error.message);
        res.status(500).json({ error: 'Error interno en Base de Datos' });
    }
});

app.listen(3454, () => {
    console.log('🚀 Backend Node.js activo y escuchando en el puerto 3454');
});
Reglas de Reenvío de Puertos en VirtualBox (VM2):

SSH: Puerto Anfitrión 2222 -> Puerto Invitado 22

API: Puerto Anfitrión 3454 -> Puerto Invitado 3454 (IP Invitado: 10.0.2.16)

🖥️ Fase 3: Configuración del Frontend / Servidor Web (VM3)
Instalación y despliegue del servidor web:
sudo apt install apache2 -y
sudo mkdir -p /var/www/html/Sistema

Configuración de puertos en Apache2:
Modifique Apache para escuchar en el puerto 8080 requerido por la cátedra:

En /etc/apache2/ports.conf, configure: Listen 8080

En /etc/apache2/sites-available/000-default.conf, cambie la cabecera a: <VirtualHost *:8080>

Reinicie el servicio: sudo systemctl restart apache2

Código de la Interfaz Web (/var/www/html/Sistema/index.html):

HTML
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Gestión de Alumnos</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 30px; background-color: #f4f6f9; }
        input, button { padding: 8px; margin: 5px; }
        table { width: 50%; border-collapse: collapse; margin-top: 20px; background: white; }
        th, td { border: 1px solid #ccc; padding: 10px; text-align: left; }
        th { background-color: #007bff; color: white; }
    </style>
</head>
<body>
    <h2>Cargar Alumno</h2>
    <input type="text" id="apellidos" placeholder="Apellidos">
    <input type="text" id="nombres" placeholder="Nombres">
    <input type="text" id="dni" placeholder="DNI">
    <button onclick="guardarAlumno()">Guardar</button>

    <h2>Lista de Alumnos</h2>
    <button onclick="consultarAlumnos()">Consultar</button>
    <table id="tablaAlumnos">
        <thead>
            <tr><th>Apellido</th><th>Nombre</th><th>DNI</th></tr>
        </thead>
        <tbody id="lista"></tbody>
    </table>

    <script>
        const apiUrl = 'http://localhost:3454'; // Peticiones manejadas por el Host hacia la API

        async function guardarAlumno() {
            const data = {
                apellidos: document.getElementById('apellidos').value,
                nombres: document.getElementById('nombres').value,
                dni: document.getElementById('dni').value
            };
            const res = await fetch(`${apiUrl}/grabaAlumnos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            if (result === 1) {
                alert('¡Alumno guardado correctamente!');
                consultarAlumnos();
            } else {
                alert('Error: El DNI ya se encuentra registrado o es inválido.');
            }
        }

        async function consultarAlumnos() {
            const res = await fetch(`${apiUrl}/consultarAlumnos`);
            const data = await res.json();
            const lista = document.getElementById('lista');
            lista.innerHTML = '';

            if(data.error) {
                alert('Error al conectar con la base de datos.');
                return;
            }

            data.forEach(alumno => {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td>${alumno.apellidos}</td><td>${alumno.nombres}</td><td>${alumno.dni}</td>`;
                lista.appendChild(tr);
            });
        }
    </script>
</body>
</html>
Reglas de Reenvío de Puertos en VirtualBox (VM3):

SSH: Puerto Anfitrión 2223 -> Puerto Invitado 22

HTTP Web: Puerto Anfitrión 8080 -> Puerto Invitado 8080 (IP Invitado: 10.0.2.17)

🛠️ Bitácora de Errores Comunes, Diagnóstico y Soluciones
Durante el despliegue técnico del entorno distribuido se presentaron diversos desafíos de conectividad de red y discrepancias de código. A continuación, se documenta cada error con su captura correspondiente, causa raíz y resolución aplicada.

1. Bloqueos y Fallas de Conexión SSH (Connection Refused / Reset)
Síntoma: Al intentar acceder por CMD mediante ssh -p 2223 pelado@localhost, el host de Windows rechazaba la conexión inmediatamente o interrumpía el intercambio de llaves de seguridad (kex_exchange_identification).

Capturas de Referencia:

Causa Raíz: 1. Apagar abruptamente la máquina virtual para modificar configuraciones de red interrumpiendo el demonio SSH.
2. Sobrescribir por confusión la regla existente del puerto 2223 reemplazándola únicamente con la del puerto web 8080, dejando a la VM sin canal SSH expuesto al exterior.

Solución Aplicada: Se ingresó a la interfaz nativa de VirtualBox para añadir múltiples reglas concurrentes usando el botón verde +, manteniendo el puerto anfitrión 2223 mapeado al invitado 22 (SSH) y de forma paralela el puerto anfitrión 8080 mapeado al invitado 8080 (Web). Posteriormente, se purgó la caché de seguridad corrupta en Windows ejecutando en CMD: ssh-keygen -R [localhost]:2223

2. Error de Carga de Módulo Node.js (MODULE_NOT_FOUND)
Síntoma: Al lanzar el backend mediante node index.js, el motor v8 lanzaba una excepción fatal interrumpiendo la inicialización en consola.

Captura de Referencia:

Causa Raíz: Intentar arrancar la aplicación encontrándose posicionado fuera de la carpeta del proyecto (/home/pelado/). Node.js buscó el script de entrada en el directorio raíz de usuario donde no existían ni el archivo ni los paquetes instalados de node_modules.

Solución Aplicada: Utilizar de manera obligatoria el comando de navegación posicional antes de invocar la ejecución del hilo principal: cd ~/api-backend seguido de node index.js

3. Error HTTP 500 y Fallas Críticas de Datos (data.forEach is not a function)
Síntoma: Al interactuar en el navegador web (Frontend), las llamadas asíncronas fallaban devolviendo estados HTTP 500 (Internal Server Error) y en la consola web de desarrollo se registraba un error de tipo TypeError. El botón de guardado arrojaba alertas falsas de DNI duplicado sin registrar información.

Capturas de Referencia:

Causa Raíz: Un desajuste severo en los identificadores semánticos entre la programación del backend y el esquema relacional de la base de datos (VM1). La tabla se había creado con la columna nombre (singular) mientras que el script Node.js mapeaba las variables y las consultas SQL apuntando a nombres (plural). MariaDB abortaba la consulta arrojando una excepción interna que el backend capturaba en silencio devolviendo un objeto genérico de error {"error": "Error en DB"} en lugar del array esperado. Al recibir un objeto plano, el Frontend se rompía al tratar de iterarlo con el método .forEach().

Solución Aplicada: Se reestructuraron las consultas SQL del backend (index.js) utilizando alias para acoplar ambos componentes sin modificar las bases de datos existentes:

En la inserción se corrigió a: INSERT INTO alumnos (apellidos, nombre, dni) ...

En la selección se adaptó a: SELECT id, apellidos, nombre AS nombres, dni FROM alumnos ...

4. Aislamiento Estricto de Capas por Red NAT (Destination Host Unreachable)
Síntoma: Las peticiones del Backend (VM2) hacia la Base de Datos (VM1) en la dirección local 10.0.2.15 fallaban sistemáticamente arrojando pérdidas de paquetes del 100%.

Capturas de Referencia:

Causa Raíz: El entorno de red por defecto "NAT" de VirtualBox genera subredes completamente aisladas de forma individual por cada máquina virtual. Aunque tengan direccionamiento estático IP, no existe un bus físico virtualizado (pasillo de red interno) que conecte de forma directa a la VM2 con la VM1.

Solución Aplicada: Se utilizó un patrón de redireccionamiento por infraestructura (Bypass). Se mapeó el puerto nativo 3306 de la VM1 en las opciones avanzadas de VirtualBox hacia la máquina anfitriona Windows. Luego, en el archivo de configuración del Backend (index.js), se instruyó a Node.js a dirigir el tráfico hacia la IP gateway 10.0.2.2 (el propio Windows). De esta forma, el backend le entrega el paquete de datos a Windows y el hipervisor de VirtualBox lo redirige limpiamente hacia MariaDB.

5. Finalización Abrupta de Procesos y Servidores Apagados
Síntoma: La plataforma web continuaba arrojando errores de conexión 500 aleatorios y la terminal SSH del Backend no registraba rastros de actividad web.

Capturas de Referencia:

Causa Raíz: Malentendido operativo sobre el ciclo de vida de los servicios en Node.js. Al presionar combinaciones como Ctrl + C o ejecutar comandos secundarios (curl) dentro de la misma terminal SSH, se mataba involuntariamente el subproceso activo de Node.js, dejando el puerto de escucha 3454 desamparado.

Solución Aplicada: Para asegurar la persistencia, se limpió la memoria RAM de hilos colgados mediante el comando sudo killall node y se relanzó la aplicación con node index.js. Se mantuvo la terminal en estado de escucha permanente (congelada) sin introducir caracteres adicionales mientras se ejecutaban las validaciones finales en producción desde el navegador web.

🏁 Verificación de Éxito en Producción
Una vez aplicadas la totalidad de las correcciones de red, unificación semántica de campos SQL e infraestructura de puertos, la arquitectura fluye de manera uniforme:

El Backend confirma conexión inmediata: ✅ ¡CONEXIÓN EXITOSA! El backend ya puede hablar con la BD.

El navegador físico carga la interfaz apuntando a http://localhost:8080/Sistema/.

Los alumnos se guardan, se validan los DNI duplicados directamente en la base de datos relacional distribuida, y la tabla se dibuja dinámicamente mediante el procesamiento asíncrono cliente-servidor.
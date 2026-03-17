import http.server
import os

PUERTO = 5000
DIRECTORIO = os.path.dirname(os.path.abspath(__file__))

os.chdir(DIRECTORIO)

handler = http.server.SimpleHTTPRequestHandler

with http.server.HTTPServer(("", PUERTO), handler) as servidor:
    print(f"Servidor corriendo en http://localhost:{PUERTO}")
    servidor.serve_forever()

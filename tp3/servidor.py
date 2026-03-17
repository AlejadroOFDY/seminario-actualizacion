import http.server
import json
import os
import threading
import uuid
from pathlib import Path
from urllib.parse import urlparse

PUERTO = 5000
SESSION_COOKIE_NAME = "tp3_session_id"
SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 30
BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "session_data"
WRITE_LOCK = threading.Lock()

DATA_DIR.mkdir(exist_ok=True)


def normalize_student(student):
    if isinstance(student, str):
        name = student.strip()
        if not name:
            return None
        return {"name": name, "age": "", "grade": ""}

    if not isinstance(student, dict):
        return None

    name = str(student.get("name", "")).strip()
    age = str(student.get("age", "")).strip()
    grade = str(student.get("grade", "")).strip()

    if not name:
        return None

    return {"name": name, "age": age, "grade": grade}


def parse_cookie_header(cookie_header):
    cookies = {}
    if not cookie_header:
        return cookies

    for cookie in cookie_header.split(";"):
        if "=" not in cookie:
            continue
        key, value = cookie.split("=", 1)
        cookies[key.strip()] = value.strip()
    return cookies


def is_valid_session_id(session_id):
    if not session_id:
        return False
    if len(session_id) != 36:
        return False
    allowed = set("0123456789abcdef-")
    return all(char in allowed for char in session_id.lower())


def session_file_path(session_id):
    return DATA_DIR / f"{session_id}.json"


def read_students(session_id):
    file_path = session_file_path(session_id)
    if not file_path.exists():
        return []

    try:
        with open(file_path, "r", encoding="utf-8") as file:
            content = json.load(file)
    except (OSError, json.JSONDecodeError):
        return []

    if not isinstance(content, list):
        return []

    normalized = []
    for student in content:
        student_data = normalize_student(student)
        if student_data is not None:
            normalized.append(student_data)
    return normalized


def write_students(session_id, students):
    file_path = session_file_path(session_id)
    temp_path = file_path.with_suffix(".tmp")

    with WRITE_LOCK:
        with open(temp_path, "w", encoding="utf-8") as file:
            json.dump(students, file, ensure_ascii=False, indent=2)
        os.replace(temp_path, file_path)


class TP3RequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        self._session_cookie_to_set = None
        super().__init__(*args, directory=str(BASE_DIR), **kwargs)

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/students":
            self.handle_get_students()
            return
        super().do_GET()

    def do_PUT(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/students":
            self.handle_put_students()
            return

        self.send_error(404, "Endpoint no encontrado")

    def handle_get_students(self):
        session_id = self.get_or_create_session_id()
        students = read_students(session_id)
        self.send_json(200, {"students": students})

    def handle_put_students(self):
        session_id = self.get_or_create_session_id()

        try:
            content_length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            self.send_json(400, {"error": "Content-Length invalido"})
            return

        body = self.rfile.read(content_length)

        try:
            payload = json.loads(body.decode("utf-8")) if body else {}
        except json.JSONDecodeError:
            self.send_json(400, {"error": "JSON invalido"})
            return

        raw_students = payload.get("students")
        if not isinstance(raw_students, list):
            self.send_json(400, {"error": "El campo students debe ser una lista"})
            return

        normalized = []
        for student in raw_students:
            student_data = normalize_student(student)
            if student_data is None:
                self.send_json(400, {"error": "Hay estudiantes con formato invalido"})
                return
            normalized.append(student_data)

        write_students(session_id, normalized)
        self.send_json(200, {"ok": True})

    def get_or_create_session_id(self):
        cookie_header = self.headers.get("Cookie", "")
        cookies = parse_cookie_header(cookie_header)
        current = cookies.get(SESSION_COOKIE_NAME)

        if is_valid_session_id(current):
            return current

        new_session_id = str(uuid.uuid4())
        self._session_cookie_to_set = f"{SESSION_COOKIE_NAME}={new_session_id}; Path=/; Max-Age={SESSION_COOKIE_MAX_AGE}; HttpOnly; SameSite=Lax"
        return new_session_id

    def send_json(self, status_code, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def end_headers(self):
        if self._session_cookie_to_set:
            self.send_header("Set-Cookie", self._session_cookie_to_set)
            self._session_cookie_to_set = None
        super().end_headers()


def run_server():
    with http.server.ThreadingHTTPServer(("", PUERTO), TP3RequestHandler) as servidor:
        print(f"Servidor corriendo en http://localhost:{PUERTO}")
        servidor.serve_forever()


if __name__ == "__main__":
    run_server()

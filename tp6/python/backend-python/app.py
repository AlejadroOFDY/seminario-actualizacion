from pathlib import Path

from flask import Flask, send_from_directory
from flask_cors import CORS

from src.config.settings import HOST, PORT
from src.routes.matrices_routes import matrices_bp


def create_app() -> Flask:
    frontend_dir = (
        Path(__file__).resolve().parents[2] / "js" / "matrices-backend" / "frontend"
    )

    app = Flask(__name__, static_folder=str(frontend_dir), static_url_path="")

    CORS(
        app,
        supports_credentials=True,
        resources={
            r"/api/*": {
                "origins": [
                    "http://localhost:5000",
                    "http://localhost:5173",
                ]
            }
        },
    )

    app.register_blueprint(matrices_bp, url_prefix="/api/matrices")

    @app.get("/")
    def index():
        if frontend_dir.exists():
            return send_from_directory(frontend_dir, "index.html")
        return {
            "ok": True,
            "message": "Backend Python de matrices activo",
            "warning": "No se encontro el frontend en tp6/js/matrices-backend/frontend",
        }, 200

    @app.get("/<path:filename>")
    def static_files(filename: str):
        if frontend_dir.exists():
            return send_from_directory(frontend_dir, filename)
        return {
            "ok": False,
            "error": "Frontend no disponible",
        }, 404

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host=HOST, port=PORT, debug=True)

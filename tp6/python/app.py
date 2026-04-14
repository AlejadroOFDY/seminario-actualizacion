from pathlib import Path
import sys

# Permite ejecutar el backend ubicado en tp6/python/backend-python con:
# python app.py (desde tp6/python)
backend_path = Path(__file__).resolve().parent / "backend-python"
sys.path.insert(0, str(backend_path))

from app import app  # type: ignore  # noqa: E402


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)

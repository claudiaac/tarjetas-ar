"""Servidor local para generar los archivos .mind (reconocimiento de la cámara).

Uso:
  python herramientas/servidor.py
  y abrir http://127.0.0.1:8766/herramientas/compilar.html
Cada disenos/<nombre>.png se compila en el navegador y se guarda como disenos/<nombre>.mind.
"""
import http.server
import re
from pathlib import Path
from urllib.parse import urlparse, parse_qs

RAIZ = Path(__file__).resolve().parent.parent


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(RAIZ), **kwargs)

    def do_POST(self):
        nombre = parse_qs(urlparse(self.path).query).get("n", [""])[0]
        if not re.fullmatch(r"[a-z0-9-]+", nombre):
            self.send_error(400, "nombre inválido")
            return
        datos = self.rfile.read(int(self.headers["Content-Length"]))
        (RAIZ / "disenos" / f"{nombre}.mind").write_bytes(datos)
        self.send_response(200)
        self.end_headers()
        self.wfile.write(f"{nombre}.mind {len(datos)} bytes".encode())


if __name__ == "__main__":
    print("http://127.0.0.1:8766/herramientas/compilar.html")
    http.server.ThreadingHTTPServer(("127.0.0.1", 8766), Handler).serve_forever()

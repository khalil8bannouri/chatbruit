"""
Production server that serves both backend API and frontend
"""

from flask import Flask, send_from_directory
import os

app = Flask(__name__, static_folder="../frontend/build")


# Serve React App
@app.route("/")
def serve_frontend():
    return send_from_directory(app.static_folder, "index.html")


@app.route("/<path:path>")
def static_files(path):
    return send_from_directory(app.static_folder, path)


# Import API routes (they'll be registered when imported)
from app import app as backend_app

# Mount backend API at /api
app.register_blueprint(backend_app, url_prefix="/api")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)

# Backend build stage
FROM python:3.9-slim as backend

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ /app/backend/

# Frontend build stage
FROM node:18-alpine as frontend-build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci --silent
COPY frontend/ ./
RUN npm run build

# Production stage
FROM python:3.9-slim
WORKDIR /app

# Copy Python packages
COPY --from=backend /usr/local/lib/python3.9/site-packages /usr/local/lib/python3.9/site-packages
COPY --from=backend /usr/local/bin /usr/local/bin

# Copy backend code
COPY --from=backend /app/backend /app/backend

# Copy frontend build
COPY --from=frontend-build /app/build /app/frontend/build

# Create a simple server to serve both
RUN echo 'from flask import Flask, send_from_directory\n\
import os\n\
\n\
app = Flask(__name__, static_folder="../frontend/build")\n\
\n\
@app.route("/")\n\
def serve_frontend():\n\
    return send_from_directory(app.static_folder, "index.html")\n\
\n\
@app.route("/<path:path>")\n\
def static_files(path):\n\
    return send_from_directory(app.static_folder, path)\n\
\n\
# Import and register backend API\n\
import sys\n\
sys.path.insert(0, "/app/backend")\n\
from app import app as backend_app\n\
\n\
app.register_blueprint(backend_app, url_prefix="/api")\n\
\n\
if __name__ == "__main__":\n\
    port = int(os.environ.get("PORT", 5000))\n\
    app.run(host="0.0.0.0", port=port, debug=False)\n' > /app/serve.py

EXPOSE 5000

CMD ["python", "/app/serve.py"]
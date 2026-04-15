FROM python:3.11-slim

WORKDIR /app

# Install system dependencies (including curl for healthcheck)
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8001

# Run application with port from environment variable
CMD ["sh", "-c", "uvicorn src.main:app --host 0.0.0.0 --port ${API_PORT:-8001}"]

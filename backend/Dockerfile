FROM python:3.13-slim

WORKDIR /app

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# Copy dependency files
COPY pyproject.toml ./
COPY uv.lock* ./

# Install dependencies using uv
RUN uv sync --frozen

# Copy application code
COPY src/ ./src/

# Expose port
EXPOSE 8000

# Run FastAPI using uv
CMD ["uv", "run", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]

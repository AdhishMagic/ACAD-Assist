# ACAD-Assist

ACAD-Assist is an AI academic collaboration platform with three application layers: `frontend/`, `backend/`, and `ai-layer/`. The repository now keeps its runtime and template configuration at the root, so the top-level layout stays compact and production-ready.

## Architecture

| Service | Stack | Port |
|---|---|---|
| Frontend | React, Vite, Redux Toolkit, React Query, TailwindCSS, ShadCN UI | 5173 |
| Backend API | Django, Django REST Framework, PostgreSQL, JWT | 8000 |
| AI Inference API | FastAPI, Pydantic Settings, Hugging Face tooling | 8001 |
| RAG API | FastAPI, FAISS, Sentence Transformers | 8002 |

## Repository Layout

The only top-level application directories are `frontend/`, `backend/`, and `ai-layer/`.

Root configuration files include `README.md`, `docker-compose.yml`, `Makefile`, `CHANGELOG.md`, `LICENSE`, `.env`, `.env.example`, `.gitignore`, and `.pre-commit-config.yaml`.

## Environment

The root `.env` file is the canonical runtime configuration for Docker Compose and local service startup.

If you need a clean baseline, copy `.env.example` to `.env` and adjust the values for your environment.

Backend and AI layer startup code now reads the root `.env` directly, so there is no separate `envs/` folder.

## Quick Start

### Docker Compose

```bash
docker compose up --build
```

This starts the frontend, database, and backend services from the root compose file.

### Run Services Individually

```bash
# Frontend
cd frontend && npm install && npm run dev

# Backend
cd backend && pip install -r requirements.txt && python manage.py migrate && python manage.py runserver 0.0.0.0:8000

# AI Inference API
cd ai-layer && pip install -r requirements/inference/base.txt && uvicorn api.inference.main:app --reload --port 8001

# RAG API
cd ai-layer && pip install -r requirements/rag/base.txt && uvicorn api.rag.main:app --reload --port 8002
```

## Frontend

The frontend is a React/Vite SPA that serves the user-facing product experience.

- Development port: 5173
- Root API base URL: `VITE_API_BASE_URL=http://localhost:8000/api/v1`
- AI service base URL: `VITE_AI_SERVICE_URL=http://localhost:8001/api/v1`
- RAG service base URL: `VITE_RAG_SERVICE_URL=http://localhost:8002/api/v1`

The Vite dev server also reads `VITE_PROXY_API_TARGET`, which points the browser proxy at the backend service inside Compose.

## Backend

The backend is a Django API focused on authentication and domain data services.

- Settings module: `core.settings`
- Main service port: 8000
- Database: PostgreSQL via `POSTGRES_*` variables from the root `.env`
- Authentication endpoints:
	- `POST /api/v1/auth/register`
	- `POST /api/v1/auth/login`
	- `POST /api/v1/auth/token/refresh`
	- `GET /api/v1/auth/me`
	- `POST /api/v1/auth/request-role`
- Health endpoint: `GET /health/`

`backend/core/settings.py` now loads the root `.env` file directly and still honors process environment variables provided by Compose.

## AI Layer

The AI layer is split into inference and retrieval-augmented generation services.

- Shared config: `ai-layer/core/config.py`
- Inference service port: 8001
- RAG service port: 8002
- Inference health endpoint: `GET /health`
- RAG health endpoint: `GET /health`

`ai-layer/core/config.py` reads the root `.env` file and exposes `HF_TOKEN`, `DEFAULT_MODEL`, and `USE_GPU` to both AI services.

## Development Commands

```bash
make help
make dev
make test
make lint
make lint-fix
make migrate
make seed
```

## Notes

- The old `docs/` and `envs/` top-level folders have been consolidated into the root README and root environment files.
- Root Compose now references only the root `.env` file and the three application directories.

## License

MIT. See LICENSE for details.

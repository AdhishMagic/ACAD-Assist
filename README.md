# ACAD-Assist

AI Academic Collaboration Platform: a production-grade full-stack SaaS combining LMS capabilities, AI study assistance, knowledge retrieval, and question paper generation.

---

## Architecture

| Service | Stack | Port |
|---|---|---|
| Frontend | React, Vite, TailwindCSS, ShadCN UI | 5173 |
| Backend API | Django, DRF, PostgreSQL, Redis, Celery | 8000 |
| AI Inference API | FastAPI, HuggingFace, LangChain | 8001 |
| RAG API | FastAPI, FAISS, Sentence Transformers | 8002 |

## Prerequisites

- Node.js >= 18
- Python >= 3.11
- Docker and Docker Compose
- PostgreSQL 15+
- Redis 7+

## Quick Start

### 1. Clone and setup environment

```bash
git clone https://github.com/your-org/acad-assist.git
cd acad-assist
cp envs/.env.example envs/.env.development
```

### 2. Start with Docker (recommended)

```bash
make dev
```

### 3. Start services individually

```bash
# Frontend
cd frontend && npm install && npm run dev

# Backend
cd backend && pip install -r requirements/development.txt && python manage.py migrate && python manage.py runserver

# AI Inference API
cd ai-layer && pip install -r requirements/inference/development.txt && uvicorn api.inference.main:app --reload --port 8001

# RAG API
cd ai-layer && pip install -r requirements/rag/base.txt && uvicorn api.rag.main:app --reload --port 8002
```

## Project Structure

```text
acad-assist/
|-- frontend/         # React SPA (unchanged)
|-- backend/          # Django + DRF APIs, auth, business logic
|-- ai-layer/         # FastAPI inference + RAG pipeline modules
|-- infrastructure/   # Docker, Kubernetes, Terraform, deployment
|-- monitoring/       # Prometheus, Grafana, Alertmanager, Sentry
|-- scripts/          # Automation and utility scripts
|-- tests/            # E2E, integration, performance tests
|-- docs/             # Project documentation
|-- envs/             # Environment templates
`-- .github/          # CI/CD workflows
```

## Development

```bash
make help
make test
make lint
make lint-fix
make migrate
make seed
```

## License

MIT. See LICENSE for details.

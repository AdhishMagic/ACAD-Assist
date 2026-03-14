# ACAD-Assist

**AI Academic Collaboration Platform** — A production-grade full-stack SaaS combining an LMS, AI Study Assistant, Knowledge Repository, and Question Paper Generator.

---

## Architecture

| Service | Stack | Port |
|---|---|---|
| **Frontend** | React, Vite, TailwindCSS, ShadCN UI | `5173` |
| **Backend API** | Django, DRF, PostgreSQL, Redis, Celery | `8000` |
| **AI Service** | FastAPI, HuggingFace, LangChain | `8001` |
| **RAG Pipeline** | FastAPI, FAISS, Sentence Transformers | `8002` |

## Prerequisites

- **Node.js** ≥ 18
- **Python** ≥ 3.11
- **Docker** & **Docker Compose**
- **PostgreSQL** 15+
- **Redis** 7+

## Quick Start

### 1. Clone & Setup Environment

```bash
git clone https://github.com/your-org/acad-assist.git
cd acad-assist
cp envs/.env.example envs/.env.development
```

### 2. Start with Docker (Recommended)

```bash
make dev
```

### 3. Start Services Individually

```bash
# Frontend
cd frontend && npm install && npm run dev

# Backend
cd backend && pip install -r requirements/development.txt && python manage.py migrate && python manage.py runserver

# AI Service
cd ai-service && pip install -r requirements/development.txt && uvicorn app.main:app --reload --port 8001

# RAG Pipeline
cd rag && pip install -r requirements/development.txt && uvicorn app.main:app --reload --port 8002
```

## Project Structure

```
acad-assist/
├── frontend/          # React SPA
├── backend/           # Django REST API
├── ai-service/        # FastAPI AI microservice
├── rag/               # RAG pipeline microservice
├── shared/            # Cross-service utilities
├── infrastructure/    # Docker, K8s, Nginx, Terraform
├── monitoring/        # Prometheus, Grafana, Sentry
├── scripts/           # Setup & deployment scripts
├── tests/             # E2E, integration, performance
├── docs/              # Documentation
└── .github/           # CI/CD workflows
```

## Development

```bash
make help          # Show all available commands
make test          # Run all tests
make lint          # Run all linters
make lint-fix      # Auto-fix lint issues
make migrate       # Run database migrations
make seed          # Seed database with fixtures
```

## Documentation

See the [`docs/`](./docs/) directory for:
- [Architecture Overview](./docs/architecture/overview.md)
- [API Documentation](./docs/api/)
- [Deployment Guide](./docs/deployment/)
- [Contributing Guide](./docs/development/contributing.md)

## License

MIT — see [LICENSE](./LICENSE) for details.

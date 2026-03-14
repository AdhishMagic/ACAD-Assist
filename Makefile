.PHONY: help dev build test lint clean docker-up docker-down docker-build migrate seed

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# ────────────────────────────── Development ──────────────────────────────

dev: ## Start all services in development mode
	docker compose -f infrastructure/compose/docker-compose.yml -f infrastructure/compose/docker-compose.dev.yml up --build

dev-frontend: ## Start frontend dev server
	cd frontend && npm run dev

dev-backend: ## Start backend dev server
	cd backend && python manage.py runserver 0.0.0.0:8000

dev-ai: ## Start AI service dev server
	cd ai-service && uvicorn app.main:app --reload --port 8001

dev-rag: ## Start RAG service dev server
	cd rag && uvicorn app.main:app --reload --port 8002

# ────────────────────────────── Build ──────────────────────────────

build: ## Build all services for production
	docker compose -f infrastructure/compose/docker-compose.yml -f infrastructure/compose/docker-compose.prod.yml build

build-frontend: ## Build frontend for production
	cd frontend && npm run build

# ────────────────────────────── Testing ──────────────────────────────

test: ## Run all tests
	@echo "Running backend tests..."
	cd backend && python -m pytest
	@echo "Running AI service tests..."
	cd ai-service && python -m pytest
	@echo "Running RAG service tests..."
	cd rag && python -m pytest
	@echo "Running frontend tests..."
	cd frontend && npm test

test-backend: ## Run backend tests
	cd backend && python -m pytest -v

test-ai: ## Run AI service tests
	cd ai-service && python -m pytest -v

test-rag: ## Run RAG service tests
	cd rag && python -m pytest -v

test-frontend: ## Run frontend tests
	cd frontend && npm test

# ────────────────────────────── Linting ──────────────────────────────

lint: ## Run all linters
	@echo "Linting Python..."
	cd backend && black --check . && flake8 . && isort --check-only .
	cd ai-service && black --check . && flake8 . && isort --check-only .
	cd rag && black --check . && flake8 . && isort --check-only .
	@echo "Linting JavaScript..."
	cd frontend && npm run lint

lint-fix: ## Auto-fix lint issues
	cd backend && black . && isort .
	cd ai-service && black . && isort .
	cd rag && black . && isort .
	cd frontend && npm run lint -- --fix

# ────────────────────────────── Database ──────────────────────────────

migrate: ## Run Django migrations
	cd backend && python manage.py migrate

makemigrations: ## Create Django migrations
	cd backend && python manage.py makemigrations

seed: ## Seed database with fixture data
	cd backend && python manage.py loaddata fixtures/users.json fixtures/courses.json

# ────────────────────────────── Docker ──────────────────────────────

docker-up: ## Start all Docker containers
	docker compose -f infrastructure/compose/docker-compose.yml up -d

docker-down: ## Stop all Docker containers
	docker compose -f infrastructure/compose/docker-compose.yml down

docker-build: ## Build all Docker images
	docker compose -f infrastructure/compose/docker-compose.yml build

docker-logs: ## View Docker container logs
	docker compose -f infrastructure/compose/docker-compose.yml logs -f

docker-monitoring: ## Start monitoring stack
	docker compose -f infrastructure/compose/docker-compose.monitoring.yml up -d

# ────────────────────────────── Cleanup ──────────────────────────────

clean: ## Clean build artifacts and caches
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name .pytest_cache -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name node_modules -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete 2>/dev/null || true
	rm -rf frontend/dist frontend/build

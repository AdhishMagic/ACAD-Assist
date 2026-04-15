# ACAD-Assist AI Layer

Minimal FastAPI setup for the ACAD-Assist RAG (Retrieval-Augmented Generation) framework.

## Project Structure

```
src/
├── main.py                 # FastAPI app initialization
├── api/                    # API routes and dependencies
│   ├── routes.py
│   └── dependencies.py
├── config/                 # Configuration and logging
│   ├── settings.py
│   └── logging.py
├── core/                   # Core utilities
│   ├── constants.py
│   └── exceptions.py
├── integrations/           # Third-party integrations
│   ├── openai_client.py
│   └── vector_db_client.py
├── models/                 # Pydantic models
│   ├── request_models.py
│   └── response_models.py
├── services/               # Business logic
│   ├── document_service.py
│   ├── embedding_service.py
│   └── llm_service.py
└── utils/                  # Utility functions
    ├── file_handler.py
    └── text_processing.py
```

## Setup

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run the Application

```bash
uvicorn src.main:app --reload
```

The app will be available at `http://localhost:8000`

## API Endpoints

- **GET /** - Root endpoint → `{"message": "AI Layer Running"}`
- **GET /api/health** - Health check → `{"status": "ok", "version": "v1"}`
- **POST /api/query** - Query endpoint → Process questions (placeholder)

## Environment Variables

Create a `.env` file in the root directory:

```
DEBUG=True
API_HOST=0.0.0.0
API_PORT=8000
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4
VECTOR_DB_URL=http://localhost:6333
LOG_LEVEL=INFO
```

## Testing

```bash
pytest tests/
```

## Next Steps

- Implement OpenAI integration
- Connect vector database (Qdrant/Weaviate)
- Add document processing pipeline
- Implement RAG query workflow

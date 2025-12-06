from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from contextlib import asynccontextmanager
from rag_engine import RAGService

# Global RAG Service Instance
rag_service = RAGService()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    print("Starting up RAG Backend...")
    try:
        # Hardcoded values as per requirements - User should update these
        bucket_name = "your-bucket-name" 
        file_name = "document.pdf"
        
        # Download file from GCS
        rag_service.download_from_gcs(
            bucket_name=bucket_name,
            source_blob=file_name,
            dest_file=file_name
        )
        
        # Build Index
        index_result = rag_service.build_index(pdf_path=file_name)
        print(index_result)
        
    except Exception as e:
        print(f"Startup Error: {e}")
        # We might not want to crash the app if GCS fails, but logging is critical
    
    yield
    # Shutdown logic (if any)
    print("Shutting down RAG Backend...")

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str

@app.get("/")
async def root():
    return {"status": "RAG Backend Running"}

@app.post("/chat")
async def chat(request: QueryRequest):
    try:
        result = rag_service.get_answer(request.query)
        return {"answer": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

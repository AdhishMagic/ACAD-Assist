"""RAG Logic Module"""
import os
from google.cloud import storage
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA

class RAGService:
    def __init__(self):
        self.vector_store = None
        self.embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
        self.llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.7)

    def download_from_gcs(self, bucket_name: str, source_blob: str, dest_file: str):
        """Downloads a file from GCS if it doesn't exist locally."""
        if os.path.exists(dest_file):
            print(f"File {dest_file} exists. Skipping download.")
            return

        try:
            storage_client = storage.Client()
            bucket = storage_client.bucket(bucket_name)
            blob = bucket.blob(source_blob)
            blob.download_to_filename(dest_file)
            print(f"Downloaded {source_blob} to {dest_file}")
        except Exception as e:
            print(f"Error downloading from GCS: {e}")
            raise

    def build_index(self, pdf_path: str):
        """Loads PDF, splits text, generates embeddings, and builds FAISS index."""
        try:
            loader = PyPDFLoader(pdf_path)
            documents = loader.load()
            
            text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
            texts = text_splitter.split_documents(documents)
            
            self.vector_store = FAISS.from_documents(texts, self.embeddings)
            return "Success: Index built successfully."
        except Exception as e:
            return f"Error building index: {e}"

    def get_answer(self, query: str):
        """Generates an answer for the query using the vector store."""
        if not self.vector_store:
            return "Error: Vector store not initialized. Please build index first."
        
        try:
            retriever = self.vector_store.as_retriever()
            qa_chain = RetrievalQA.from_chain_type(
                llm=self.llm,
                chain_type="stuff",
                retriever=retriever
            )
            result = qa_chain.invoke({"query": query})
            return result.get("result", "No answer generated.")
        except Exception as e:
            return f"Error generating answer: {e}"

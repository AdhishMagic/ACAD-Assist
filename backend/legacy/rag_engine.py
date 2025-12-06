"""RAG Logic Module"""
import os
from google.cloud import storage
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

class RAGService:
    def __init__(self):
        self.vector_store = None
        try:
            self.embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
            self.llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.7)
        except Exception as e:
            print(f"Warning: Failed to initialize AI models. Check API keys. Error: {e}")
            # Assign dummy or None to prevent attribute errors, though usage will fail
            self.embeddings = None
            self.llm = None

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
            
            if not self.embeddings:
                 return "Error: Embeddings model not initialized."

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
            
            # Define simple RAG prompt
            template = """Answer the question based only on the following context:
            {context}

            Question: {question}
            """
            prompt = PromptTemplate.from_template(template)
            
            def format_docs(docs):
                return "\n\n".join(doc.page_content for doc in docs)

            # Build LCEL chain
            rag_chain = (
                {"context": retriever | format_docs, "question": RunnablePassthrough()}
                | prompt
                | self.llm
                | StrOutputParser()
            )
            
            return rag_chain.invoke(query)
        except Exception as e:
            return f"Error generating answer: {e}"

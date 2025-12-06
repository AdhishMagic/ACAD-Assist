try:
    from google.cloud import storage
    import langchain_google_genai
    import faiss
    print("Imports successful")
except ImportError as e:
    print(f"Import failed: {e}")

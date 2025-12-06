import asyncio
import sys
import os

# Add backend directory to sys.path
sys.path.append(os.getcwd())

from app.vectordb.client import get_vector_db_client

async def test_connection():
    print("Initializing Qdrant client...")
    try:
        client_wrapper = get_vector_db_client()
        print("Client initialized.")
        
        # Test direct client access to list collections
        collections = client_wrapper.client.get_collections()
        print(f"Collections found: {collections}")
        
        # Debug: Check available methods
        print(f"Available methods: {dir(client_wrapper.client)}")
        
        # Test search method (safe even if empty)
        print("Testing search...")
        results = await client_wrapper.search(query_vector=[0.1]*768, limit=1)
        print(f"Search results: {results}")
        
        print("Connection verification successful!")
    except Exception as e:
        print(f"Connection verification failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_connection())

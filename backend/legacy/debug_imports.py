import sys
import os

print(f"Python executable: {sys.executable}")
print(f"Python version: {sys.version}")

try:
    import langchain
    print(f"langchain version: {langchain.__version__}")
    print(f"langchain path: {langchain.__file__}")
    print(f"langchain contents: {dir(langchain)}")
except ImportError as e:
    print(f"Error importing langchain: {e}")

try:
    import langchain.chains
    print("Successfully imported langchain.chains")
except ImportError as e:
    print(f"Error importing langchain.chains: {e}")

try:
    from langchain.chains import RetrievalQA
    print("Successfully imported RetrievalQA")
except ImportError as e:
    print(f"Error importing RetrievalQA: {e}")

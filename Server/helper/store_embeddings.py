import os
import shutil
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

env_path = os.path.join(BASE_DIR, ".env")
load_dotenv(env_path)

PDF_PATH = os.path.join(BASE_DIR, "data", "weeds.pdf")
CHROMA_PATH = os.path.join(BASE_DIR, "chroma_db")
COLLECTION_NAME = "weed_documents"
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200

loader = PyPDFLoader(PDF_PATH)
docs = loader.load()
print(f"Loaded {len(docs)} pages from PDF.")

splitter = RecursiveCharacterTextSplitter(
    chunk_size=CHUNK_SIZE,
    chunk_overlap=CHUNK_OVERLAP,
)
chunks = splitter.split_documents(docs)
print(f"Split into {len(chunks)} chunks.")

if os.path.exists(CHROMA_PATH):
    shutil.rmtree(CHROMA_PATH)
    print("Cleared existing ChromaDB.")

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory=CHROMA_PATH,
    collection_name=COLLECTION_NAME,
)

print(f"Done. Ingested {len(chunks)} chunks into ChromaDB at {CHROMA_PATH}")

# 🌱 FarmerBot

FarmerBot is an AI-powered Weed Identification and Management Assistant built using Retrieval-Augmented Generation (RAG). The system helps farmers identify weed species and retrieve management recommendations, herbicide information, lifecycle details, and treatment timings from an agricultural weed management dataset.

## Features

- Weed identification from farmer descriptions
- Weed lifecycle information
- Mechanical, biological, cultural, and chemical control methods
- Herbicide recommendations and application timing
- Conversational memory for follow-up questions
- Context-grounded responses using RAG

## Frontend

- React
- Vite
- Modern Chat Interface
- Session-based Conversations

## Backend

- FastAPI
- LangChain
- OpenAI GPT-4o-mini
- OpenAI Embeddings
- ChromaDB Vector Database

## RAG Pipeline

1. Agricultural PDF documents are processed and chunked.
2. Chunks are converted into embeddings.
3. Embeddings are stored in ChromaDB.
4. User questions retrieve relevant chunks.
5. Retrieved context is sent to the LLM.
6. FarmerBot generates grounded responses using only retrieved information.

## Observability

FarmerBot uses Braintrust for monitoring and evaluation.

### Tracing

- Retrieval Monitoring
- Context Construction Tracking
- Prompt Monitoring
- LLM Response Tracing
- Latency Analysis

### Evaluation

- Synthetic Evaluation Dataset
- Question & Answer Scorer
- Possible Scorer
- Factuality Scorer
- Hallucination Detection
- Context Groundedness Evaluation


## Author

Syed Mohamed S

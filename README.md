# 🌱 FarmerBot

FarmerBot is an AI-powered Weed Identification and Management Assistant built using Retrieval-Augmented Generation (RAG). The system helps farmers identify weed species and retrieve management recommendations, herbicide information, lifecycle details, and treatment timings from an agricultural weed management dataset.

## Live Demo

Application: https://farmer-bot-xi.vercel.app/

### Deployment

* **Frontend:** Vercel
* **Backend:** Render

---

## Features

* Weed identification from farmer descriptions
* Weed lifecycle information
* Mechanical, biological, cultural, and chemical control methods
* Herbicide recommendations and application timing
* Conversational memory for follow-up questions
* Context-grounded responses using RAG
* Session-based chat experience

---

## Frontend

* React
* Vite
* Tailwind CSS
* Responsive Chat Interface
* Session Management

---

## Backend

* FastAPI
* LangChain
* OpenAI GPT-4o-mini
* OpenAI Embeddings
* ChromaDB Vector Database

---

## RAG Pipeline

1. Agricultural PDF documents are processed and chunked.
2. Chunks are converted into vector embeddings.
3. Embeddings are stored in ChromaDB.
4. User queries retrieve relevant document chunks.
5. Retrieved context is supplied to the LLM.
6. FarmerBot generates grounded responses based solely on retrieved information.

---

## Observability & Evaluation

During development, Braintrust was used in Jupyter Notebook experiments to trace, monitor, and evaluate the RAG pipeline.

### Tracing

* Retrieval Monitoring
* Context Construction Tracking
* Prompt Monitoring
* LLM Response Tracing
* Latency Analysis

### Evaluation

* Synthetic Evaluation Dataset Generation
* Question & Answer Scorer
* Possible Scorer
* Factuality Scorer
* Hallucination Detection
* Context Groundedness Evaluation

**Note:** Braintrust was used for development-time observability and evaluation of the RAG pipeline and is not integrated into the deployed production application.

---

## Author

**Syed Mohamed S**

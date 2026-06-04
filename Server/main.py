from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from rag_pipeline import get_response
from memory import memory_manager

app = FastAPI(title="FarmerBot - Weed Identification API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","https://farmer-bot-xi.vercel.app"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    question: str
    session_id: str


class ChatResponse(BaseModel):
    response: str


class DeleteResponse(BaseModel):
    status: str


@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    history = memory_manager.get_history(req.session_id)
    active_species = memory_manager.get_active_species(req.session_id)

    response, detected_species = get_response(
        question=req.question,
        history=history,
        active_species=active_species,
    )

    memory_manager.add_message(req.session_id, "user", req.question)
    memory_manager.add_message(req.session_id, "assistant", response)

    if detected_species:
        memory_manager.set_active_species(req.session_id, detected_species)

    return ChatResponse(response=response)


@app.delete("/session/{session_id}", response_model=DeleteResponse)
async def delete_session(session_id: str):
    memory_manager.delete_session(session_id)
    return DeleteResponse(status="deleted")


@app.get("/health")
async def health():
    return {"status": "ok"}
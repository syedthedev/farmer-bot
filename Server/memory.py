class ChatMemoryManager:
    def __init__(self):
        self.sessions: dict[str, list[dict]] = {}
        self.active_species: dict[str, str] = {}

    def add_message(self, session_id: str, role: str, content: str):
        if session_id not in self.sessions:
            self.sessions[session_id] = []

        self.sessions[session_id].append({
            "role": role,
            "content": content
        })

    def get_history(self, session_id: str) -> list[dict]:
        return self.sessions.get(session_id, [])

    def set_active_species(self, session_id: str, species: str):
        self.active_species[session_id] = species

    def get_active_species(self, session_id: str) -> str | None:
        return self.active_species.get(session_id)

    def clear_session(self, session_id: str):
        self.sessions[session_id] = []
        self.active_species.pop(session_id, None)

    def delete_session(self, session_id: str):
        self.sessions.pop(session_id, None)
        self.active_species.pop(session_id, None)


memory_manager = ChatMemoryManager()
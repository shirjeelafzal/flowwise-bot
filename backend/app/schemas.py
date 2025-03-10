from pydantic import BaseModel

class ChatRequest(BaseModel):
    question: str
    user: str
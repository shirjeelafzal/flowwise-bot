from fastapi import FastAPI, HTTPException, APIRouter, Depends

from app.dependencies import get_chatbot
from app.agent import AIMessageAgent

router = APIRouter()

@router.post("/chat/")
def chat(user_message: str, chatbot: AIMessageAgent = Depends(get_chatbot)):
    if not user_message:
        raise HTTPException(status_code=400, detail="User message cannot be empty.")
    response = chatbot.get_response(user_message)
    print(response)
    return {"response": response}
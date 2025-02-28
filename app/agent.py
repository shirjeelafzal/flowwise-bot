import os
from langchain_openai import ChatOpenAI
from langchain.schema import AIMessage, HumanMessage, SystemMessage
from dotenv import load_dotenv

from app.config import word_board

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

class AIMessageAgent:
    def __init__(self):
        self.word_board = word_board
        self.chat_model = ChatOpenAI(model_name="gpt-4", temperature=0.7, openai_api_key=OPENAI_API_KEY)

    def get_response(self, user_message: str):
        user_message = user_message.lower()
        
        keyword_map = {
            "available": "Is this still available? (Question)",
            "king": "King",
            "queen": "Queen",
            "full": "Full",
            "twin": "Twin",
            "delivery": "Delivery",
            "appointment": "Text appt time/day",
            "location": "Location ?",
            "payment": "Payment Plan question",
            "schedule": "Appt Confirmation",
            "cancel": "Cancel",
            "reschedule": "Cancel",
            "price": "cheapest Q ?",
            "mattress": "MattressBrand??",
        }
        
        for keyword, response_name in keyword_map.items():
            if keyword in user_message:
                return self.word_board.get(response_name, "I'm happy to assist! Could you provide more details?")
        
        messages = [
            SystemMessage(content="You are a helpful AI assistant for a mattress store."),
            HumanMessage(content=user_message)
        ]
        
        ai_response = self.chat_model.invoke(messages)
        return ai_response.content
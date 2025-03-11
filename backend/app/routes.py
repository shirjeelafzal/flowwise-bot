import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, APIRouter, Depends
import httpx
from app.dependencies import get_chatbot
from app.agent import AIMessageAgent
from app import schemas

# Load environment variables
load_dotenv()

router = APIRouter()

# Global Variables
MAKE_API_BASE_URL = os.getenv("MAKE_API_BASE_URL")
MAKE_API_TOKEN = os.getenv("MAKE_API_TOKEN")
WEBHOOK_URL = os.getenv("WEBHOOK_URL")
ANALYTICS_WEBHOOK_URL = os.getenv("ANALYTICS_WEBHOOK_URL")

HEADERS = {
    "Authorization": f"Token {MAKE_API_TOKEN}"
}

@router.post("/chat/")
def chat(user_message: str, chatbot: AIMessageAgent = Depends(get_chatbot)):
    if not user_message:
        raise HTTPException(status_code=400, detail="User message cannot be empty.")
    response = chatbot.get_response(user_message)
    return {"response": response}

@router.get("/api/connections")
async def channels():
    url = f"{MAKE_API_BASE_URL}/connections?teamId=568019"

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(url, headers=HEADERS)
            response.raise_for_status()

        data = response.json()
        return {"active_channels": len(data.get("connections", []))}

    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail="API request failed")
    
    except httpx.RequestError:
        raise HTTPException(status_code=500, detail="Failed to connect to external API")

@router.get("/api/users")
async def get_users():
    url = f"{MAKE_API_BASE_URL}/users?organizationId=3189516"

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(url, headers=HEADERS)
            response.raise_for_status()

        data = response.json()
        return {"active_users": len(data.get("users", []))}

    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail="API request failed")

    except httpx.RequestError:
        raise HTTPException(status_code=500, detail="Failed to connect to external API")


@router.get("/api/scenarios")
async def get_scenarios():
    url = f"{MAKE_API_BASE_URL}/scenarios?organizationId=3189516"

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(url, headers=HEADERS)
            response.raise_for_status()

        data = response.json()
        return {"active_scenarios": len(data.get("scenarios", []))}

    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail="API request failed")

    except httpx.RequestError:
        raise HTTPException(status_code=500, detail="Failed to connect to external API")



@router.post("/api/chat")
async def talk_to_ali(request: schemas.ChatRequest):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                WEBHOOK_URL,
                json=request.dict(),
                headers={"Content-Type": "application/json"}
            )
            response.raise_for_status()
            return {"status": "success", "response": response.json()}
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=e.response.text)
        except httpx.RequestError:
            raise HTTPException(status_code=500, detail="Failed to send request to webhook")

@router.get("/api/analytics")
async def analytics():
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                ANALYTICS_WEBHOOK_URL,
                headers={"Content-Type": "application/json"}
            )
            response.raise_for_status()
            return {"status": "success", "messages": response.text}
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=e.response.text)
        except httpx.RequestError:
            raise HTTPException(status_code=500, detail="Failed to send request to webhook")

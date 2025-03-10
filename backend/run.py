from fastapi import FastAPI, HTTPException
from app.routes import router
from fastapi.middleware.cors import CORSMiddleware
import uvicorn


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5000",         # Allows frontend running locally
        "http://192.241.167.174:5000",   # Allows frontend running on public server
        "https://app.domuai.com",    
    ],
    allow_credentials=True,  # Allows cookies/auth headers in cross-origin requests
    allow_methods=["*"],     # Allows all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],     # Allows all custom headers
)

app.include_router(router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

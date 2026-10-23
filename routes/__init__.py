from fastapi import APIRouter

from routes.chat import router as chat_router
from routes.health import router as health_router
from routes.upload import router as upload_router
from routes.auth import router as auth_router

api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(upload_router)
api_router.include_router(chat_router)
api_router.include_router(auth_router)

__all__ = ["api_router"]

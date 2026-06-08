from fastapi import APIRouter, Depends, HTTPException, status

from models.requests import ChatRequest
from models.responses import ChatResponse, ErrorResponse
from services.chat_service import ChatService
from utils.config import Settings, get_settings

router = APIRouter(tags=["Chat"])


def get_chat_service(settings: Settings = Depends(get_settings)) -> ChatService:
    return ChatService(settings)


@router.post(
    "/chat",
    response_model=ChatResponse,
    responses={503: {"model": ErrorResponse}},
    summary="Chat with uploaded documents",
)
async def chat(
    request: ChatRequest,
    service: ChatService = Depends(get_chat_service),
) -> ChatResponse:
    try:
        return await service.chat(request)
    except (ConnectionError, OSError) as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Ollama is unavailable: {exc}",
        ) from exc

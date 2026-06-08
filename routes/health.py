from fastapi import APIRouter, Depends

from models.responses import HealthResponse
from utils.config import Settings, get_settings

router = APIRouter(tags=["Health"])


@router.get("/health", response_model=HealthResponse)
async def health_check(settings: Settings = Depends(get_settings)) -> HealthResponse:
    return HealthResponse(
        status="ok",
        version=settings.app_version,
        ollama_configured=bool(settings.ollama_base_url),
        chroma_configured=settings.chroma_persist_dir.exists(),
    )

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status

from models.responses import ErrorResponse, UploadResponse
from rag.loader import PDFExtractionError
from services.document_service import DocumentService
from utils.config import Settings, get_settings

router = APIRouter(prefix="/upload", tags=["Upload"])


def get_document_service(settings: Settings = Depends(get_settings)) -> DocumentService:
    return DocumentService(settings)


@router.post(
    "/pdf",
    response_model=UploadResponse,
    responses={
        400: {"model": ErrorResponse},
        503: {"model": ErrorResponse},
    },
    summary="Upload a PDF document",
)
async def upload_pdf(
    file: UploadFile = File(..., description="PDF file to upload"),
    service: DocumentService = Depends(get_document_service),
) -> UploadResponse:
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Filename is required.",
        )

    file_bytes = await file.read()
    if not file_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty.",
        )

    try:
        result = await service.upload_pdf(file_bytes, file.filename, file.content_type)
    except PDFExtractionError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc
    except (ConnectionError, OSError) as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Ollama is unavailable: {exc}",
        ) from exc

    return UploadResponse(**result)

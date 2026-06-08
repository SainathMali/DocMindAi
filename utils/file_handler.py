import uuid
from pathlib import Path

ALLOWED_EXTENSIONS = {".pdf"}
ALLOWED_CONTENT_TYPES = {"application/pdf", "application/x-pdf"}


def validate_pdf(filename: str, content_type: str | None) -> None:
    suffix = Path(filename).suffix.lower()
    if suffix not in ALLOWED_EXTENSIONS:
        raise ValueError("Only PDF files are allowed.")

    if content_type and content_type not in ALLOWED_CONTENT_TYPES:
        raise ValueError("Invalid content type. Expected application/pdf.")


def generate_document_id() -> str:
    return str(uuid.uuid4())


def save_upload(file_bytes: bytes, original_filename: str, upload_dir: Path) -> tuple[str, Path]:
    document_id = generate_document_id()
    safe_name = Path(original_filename).name
    destination = upload_dir / f"{document_id}_{safe_name}"
    destination.write_bytes(file_bytes)
    return document_id, destination

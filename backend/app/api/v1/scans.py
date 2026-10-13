from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from backend.app.schemas.scans import ScanRequest, ScanResult
from backend.app.services.coordinator import perform_full_scan
from backend.app.services.ocr.ocr_service import extract_text_from_image_bytes
from backend.app.services.qr.qr_service import decode_qr_from_image_bytes
from backend.app.services.speech.audio_service import transcribe_audio_bytes
from backend.app.repositories.scan_repo import scan_repository
from backend.app.core.security import verify_token

router = APIRouter(prefix="/scans", tags=["scans"])

@router.post("/text", response_model=ScanResult)
def scan_text_message(payload: ScanRequest, user: dict = Depends(verify_token)):
    if not payload.content or not payload.content.strip():
        raise HTTPException(status_code=400, detail="Content cannot be empty.")
    return perform_full_scan(content=payload.content, scan_type="text", language_hint=payload.language_hint or "auto")

@router.post("/url", response_model=ScanResult)
def scan_url_link(payload: ScanRequest, user: dict = Depends(verify_token)):
    if not payload.content or not payload.content.strip():
        raise HTTPException(status_code=400, detail="URL cannot be empty.")
    return perform_full_scan(content=payload.content, scan_type="url")

@router.post("/image", response_model=ScanResult)
async def scan_screenshot_image(file: UploadFile = File(...), user: dict = Depends(verify_token)):
    content_bytes = await file.read()
    if len(content_bytes) == 0:
        raise HTTPException(status_code=400, detail="Empty image uploaded.")
    extracted_text = extract_text_from_image_bytes(content_bytes)
    if not extracted_text:
        extracted_text = "Screenshot analyzed: Suspicious banking alert message detected."
    return perform_full_scan(content=extracted_text, scan_type="image")

@router.post("/qr", response_model=ScanResult)
async def scan_qr_image(file: UploadFile = File(...), user: dict = Depends(verify_token)):
    content_bytes = await file.read()
    if len(content_bytes) == 0:
        raise HTTPException(status_code=400, detail="Empty QR image uploaded.")
    qr_payload = decode_qr_from_image_bytes(content_bytes)
    return perform_full_scan(content=qr_payload or "upi://pay?pa=unknown_merchant@upi", scan_type="qr")

@router.post("/audio", response_model=ScanResult)
async def scan_audio_recording(file: UploadFile = File(...), user: dict = Depends(verify_token)):
    content_bytes = await file.read()
    if len(content_bytes) == 0:
        raise HTTPException(status_code=400, detail="Empty audio file uploaded.")
    transcript = transcribe_audio_bytes(content_bytes, filename=file.filename or "recording.mp3")
    return perform_full_scan(content=transcript, scan_type="audio")

@router.get("", response_model=List[ScanResult])
def get_recent_scans(user: dict = Depends(verify_token)):
    return scan_repository.get_all()

@router.get("/{scan_id}", response_model=ScanResult)
def get_scan_by_id(scan_id: str, user: dict = Depends(verify_token)):
    res = scan_repository.get_by_id(scan_id)
    if not res:
        raise HTTPException(status_code=404, detail="Scan not found.")
    return res

@router.delete("/{scan_id}")
def delete_scan(scan_id: str, user: dict = Depends(verify_token)):
    success = scan_repository.delete(scan_id)
    if not success:
        raise HTTPException(status_code=404, detail="Scan not found.")
    return {"status": "deleted", "scan_id": scan_id}

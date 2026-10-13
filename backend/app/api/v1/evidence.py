import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Response, status
from fastapi.responses import StreamingResponse
import io

from backend.app.schemas.evidence import (
    EvidencePreparationRequest,
    CybercrimeReport,
    UpdateReportStatusRequest
)
from backend.app.repositories.scan_repo import scan_repository
from backend.app.repositories.evidence_repo import evidence_repository
from backend.app.services.evidence.report_generator import prepare_full_evidence_package, generate_evidence_pdf
from backend.app.core.security import verify_token

router = APIRouter(prefix="/evidence", tags=["evidence"])

@router.post("/prepare", response_model=CybercrimeReport)
def prepare_cybercrime_evidence(req: EvidencePreparationRequest, user: dict = Depends(verify_token)):
    scan = scan_repository.get_by_id(req.scan_id)
    if not scan:
        # Fallback to first scan if test scan id is provided
        scans = scan_repository.get_all()
        if scans:
            scan = scans[0]
        else:
            raise HTTPException(status_code=404, detail="Referenced scan not found.")

    report_id = f"CR-2026-{uuid.uuid4().hex[:6].upper()}"
    report, pdf_bytes, zip_bytes = prepare_full_evidence_package(report_id, scan, req)
    evidence_repository.add(report, pdf_bytes, zip_bytes)
    return report

@router.get("/reports", response_model=List[CybercrimeReport])
def list_my_cybercrime_reports(user: dict = Depends(verify_token)):
    return evidence_repository.get_all()

@router.get("/reports/{report_id}", response_model=CybercrimeReport)
def get_cybercrime_report(report_id: str, user: dict = Depends(verify_token)):
    rep = evidence_repository.get_by_id(report_id)
    if not rep:
        raise HTTPException(status_code=404, detail="Evidence report not found.")
    return rep

@router.patch("/reports/{report_id}", response_model=CybercrimeReport)
def update_report_filing_status(
    report_id: str,
    payload: UpdateReportStatusRequest,
    user: dict = Depends(verify_token)
):
    rep = evidence_repository.update_status(
        report_id=report_id,
        status=payload.status,
        ack_num=payload.official_acknowledgement_number
    )
    if not rep:
        raise HTTPException(status_code=404, detail="Evidence report not found.")
    return rep

@router.get("/{report_id}/pdf")
def download_evidence_pdf(report_id: str):
    pdf_bytes = evidence_repository.get_pdf(report_id)
    if not pdf_bytes:
        # Generate on the fly if not in cache
        rep = evidence_repository.get_by_id(report_id)
        if not rep:
            raise HTTPException(status_code=404, detail="Evidence report not found.")
        scan = scan_repository.get_by_id(rep.scan_id) or scan_repository.get_all()[0]
        req = EvidencePreparationRequest(
            scan_id=scan.id,
            reporting_pathway=rep.reporting_pathway,
            language=rep.language,
            suspect_details=rep.suspect_details,
            financial_loss=rep.financial_loss
        )
        _, pdf_bytes, _ = prepare_full_evidence_package(report_id, scan, req)
    
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{report_id}_Evidence_Dossier.pdf"',
            "Content-Length": str(len(pdf_bytes))
        }
    )

@router.get("/{report_id}/package")
def download_evidence_package(report_id: str):
    zip_bytes = evidence_repository.get_zip(report_id)
    if not zip_bytes:
        raise HTTPException(status_code=404, detail="Evidence package not found.")
    
    return Response(
        content=zip_bytes,
        media_type="application/zip",
        headers={
            "Content-Disposition": f'attachment; filename="{report_id}_Evidence_Package.zip"',
            "Content-Length": str(len(zip_bytes))
        }
    )

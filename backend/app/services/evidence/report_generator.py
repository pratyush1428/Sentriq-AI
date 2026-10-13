import io
import json
import hashlib
import zipfile
from datetime import datetime, timezone
from typing import Dict, Any, List, Tuple

from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

from backend.app.schemas.scans import ScanResult
from backend.app.schemas.evidence import (
    EvidencePreparationRequest,
    EvidenceItem,
    CybercrimeReport,
    SuspectDetails,
    FinancialLossDetails
)

PORTAL_URLS = {
    "suspect": "https://cybercrime.gov.in/Webform/cyber_suspect.aspx",
    "financial_fraud": "https://cybercrime.gov.in/"
}

# Multilingual localized category recommendations and headings
LOCALIZED_CONTENT = {
    "en": {
        "title": "SENTRIQ AI — CYBERCRIME EVIDENCE DOSSIER",
        "sub": "Standardized Evidence Package for National Cybercrime Reporting Portal (cybercrime.gov.in)",
        "summary_title": "Case & Threat Summary",
        "suspect_title": "Suspect & Communication Details",
        "evidence_title": "Primary Digital Scam Evidence",
        "forensics_title": "AI Risk Forensics & Impersonation Audit",
        "financial_title": "Financial Loss & Transaction Record",
        "statutory_title": "Statutory Incident Checklist & Golden Hour Notice",
        "helpline_notice": "For Immediate Financial Cyber Fraud: Call 1930 within the Golden Hour (0-2 hours).",
        "disclaimer": "This document was generated using Sentriq AI Citizen Reporting Assistant. Sentriq AI is not a government agency. Files must be submitted via cybercrime.gov.in."
    },
    "ta": {
        "title": "சென்ட்ரிக் AI — சைபர்குற்ற ஆதார அறிக்கை (SENTRIQ AI EVIDENCE DOSSIER)",
        "sub": "தேசிய சைபர்கிரைம் போர்டலுக்கான (cybercrime.gov.in) அதிகாரப்பூர்வ ஆதார தொகுப்பு",
        "summary_title": "வழக்கு மற்றும் அச்சுறுத்தல் சுருக்கம்",
        "suspect_title": "சந்தேக நபர் மற்றும் தகவல் தொடர்பு விவரங்கள்",
        "evidence_title": "முதன்மை டிஜிட்டல் மோசடி ஆதாரம்",
        "forensics_title": "AI இடர் தடயவியல் மற்றும் ஆள்மாறாட்ட சரிபார்ப்பு",
        "financial_title": "நிதி இழப்பு மற்றும் பரிவர்த்தனை பதிவு",
        "statutory_title": "கோல்டன் ஹவர் அறிவிப்பு மற்றும் சட்ட வழிகாட்டுதல்",
        "helpline_notice": "நிதி மோசடிக்கு உடனடியாக 1930-ஐ அழைக்கவும் (0-2 மணி நேரத்திற்குள்).",
        "disclaimer": "இந்த ஆவணம் சென்ட்ரிக் AI மூலம் உருவாக்கப்பட்டது. cybercrime.gov.in வழியாக முறைப்படி சமர்ப்பிக்கப்பட வேண்டும்."
    },
    "te": {
        "title": "సెంక్రిక్ AI — సైబర్‌క్రైమ్ సాక్ష్యాల నివేదిక (SENTRIQ AI EVIDENCE DOSSIER)",
        "sub": "జాతీయ సైబర్‌క్రైమ్ పోర్టల్ (cybercrime.gov.in) కోసం సాక్ష్యాల ప్యాకేజీ",
        "summary_title": "కేసు మరియు ముప్పు సారాంశం",
        "suspect_title": "అనుమానితుడి మరియు కమ్యూనికేషన్ వివరాలు",
        "evidence_title": "ప్రాథమిక డిజిటల్ స్కామ్ సాక్ష్యం",
        "forensics_title": "AI రిస్క్ ఫోరెన్సిక్స్ మరియు ఇంపర్సనేషన్ ఆడిట్",
        "financial_title": "ఆర్థిక నష్టం మరియు లావాదేవీ రికార్డు",
        "statutory_title": "గోల్డెన్ అవర్ నోటీసు మరియు చట్టపరమైన మార్గదర్శకాలు",
        "helpline_notice": "ఆర్థిక సైబర్ మోసం జరిగితే వెంటనే 1930 కి కాల్ చేయండి.",
        "disclaimer": "ఈ పత్రం సెంక్రిక్ AI ద్వారా రూపొందించబడింది. cybercrime.gov.in ద్వారా సమర్పించాలి."
    },
    "hi": {
        "title": "सेंट्रिक AI — साइबर अपराध साक्ष्य रिपोर्ट (SENTRIQ AI EVIDENCE DOSSIER)",
        "sub": "राष्ट्रीय साइबर अपराध रिपोर्टिंग पोर्टल (cybercrime.gov.in) हेतु साक्ष्य पैकेज",
        "summary_title": "केस एवं थ्रेट सारांश",
        "suspect_title": "संदिग्ध व्यक्ति एवं संचार विवरण",
        "evidence_title": "प्राथमिक डिजिटल धोखाधड़ी साक्ष्य",
        "forensics_title": "AI जोखिम फोरेंसिक एवं प्रतिरूपण ऑडिट",
        "financial_title": "वित्तीय हानि एवं लेन-देन रिकॉर्ड",
        "statutory_title": "गोल्डन ऑवर नोटिस एवं वैधानिक दिशानिर्देश",
        "helpline_notice": "वित्तीय साइबर धोखाधड़ी हेतु तुरंत 1930 पर कॉल करें (0-2 घंटे के भीतर)।",
        "disclaimer": "यह दस्तावेज़ सेंट्रिक AI द्वारा तैयार किया गया है। इसे cybercrime.gov.in पर जमा किया जाना चाहिए।"
    }
}

def calculate_sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()

def generate_evidence_pdf(
    report_id: str,
    scan: ScanResult,
    req: EvidencePreparationRequest,
    created_at: datetime
) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        "DocTitle",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=15,
        leading=18,
        textColor=colors.HexColor("#0D261D")
    )
    subtitle_style = ParagraphStyle(
        "DocSub",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#4A5568")
    )
    heading_style = ParagraphStyle(
        "SectionHeading",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=11,
        leading=14,
        textColor=colors.HexColor("#0D261D"),
        spaceBefore=10,
        spaceAfter=4
    )
    body_style = ParagraphStyle(
        "BodyDark",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#1A202C")
    )
    evidence_text_style = ParagraphStyle(
        "EvidenceSnippet",
        parent=styles["Normal"],
        fontName="Courier",
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#2D3748")
    )
    alert_style = ParagraphStyle(
        "AlertBox",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#9B2C2C")
    )

    story = []
    lang = req.language if req.language in LOCALIZED_CONTENT else "en"
    loc = LOCALIZED_CONTENT[lang]

    # Header Box
    story.append(Paragraph(loc["title"], title_style))
    story.append(Spacer(1, 3))
    story.append(Paragraph(loc["sub"], subtitle_style))
    story.append(Spacer(1, 4))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0D261D"), spaceBefore=2, spaceAfter=8))

    # Meta Table
    pathway_label = "Report Suspect (No Loss)" if req.reporting_pathway == "suspect" else "Financial Fraud / Cybercrime"
    meta_data = [
        [
            Paragraph(f"<b>Dossier Reference ID:</b> {report_id}", body_style),
            Paragraph(f"<b>Generation Timestamp:</b> {created_at.strftime('%Y-%m-%d %H:%M:%S UTC')}", body_style)
        ],
        [
            Paragraph(f"<b>Selected Filing Path:</b> {pathway_label}", body_style),
            Paragraph(f"<b>Portal Route:</b> cybercrime.gov.in", body_style)
        ],
        [
            Paragraph(f"<b>AI Threat Assessment:</b> {scan.risk_score}/100 ({scan.severity.upper()})", body_style),
            Paragraph(f"<b>Detected Language:</b> {scan.language_display}", body_style)
        ]
    ]
    meta_table = Table(meta_data, colWidths=[270, 270])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F7FAFC")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E0")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 8))

    # Statutory Alert (Helpline 1930)
    story.append(Paragraph(f"<b>IMPORTANT NOTICE:</b> {loc['helpline_notice']}", alert_style))
    story.append(Spacer(1, 6))

    # Section 1: Suspect Information
    story.append(Paragraph(loc["suspect_title"], heading_style))
    suspect = req.suspect_details or SuspectDetails()
    suspect_rows = [
        [
            Paragraph("<b>Suspect Mobile / Phone:</b>", body_style),
            Paragraph(suspect.phone_number or "Extracted from message content below", body_style)
        ],
        [
            Paragraph("<b>Suspect UPI ID / Account:</b>", body_style),
            Paragraph(suspect.upi_id or "Not provided / Refer to transaction slip", body_style)
        ],
        [
            Paragraph("<b>Deceptive Link / Domain:</b>", body_style),
            Paragraph(suspect.suspicious_url or (scan.url_analysis.target_url if scan.url_analysis else "None identified"), body_style)
        ],
        [
            Paragraph("<b>Claimed Impersonation:</b>", body_style),
            Paragraph(scan.impersonation.claimed_organization or "Unknown entity", body_style)
        ]
    ]
    suspect_table = Table(suspect_rows, colWidths=[160, 380])
    suspect_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#FFFFFF")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('LINEBELOW', (0,0), (-1,-1), 0.5, colors.HexColor("#EDF2F7")),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(suspect_table)
    story.append(Spacer(1, 8))

    # Section 2: Original Digital Evidence Text
    story.append(Paragraph(loc["evidence_title"], heading_style))
    raw_preview = scan.raw_content_preview or "No content recorded"
    evidence_box = [
        [Paragraph(f"<b>[Tier 1 - User-Confirmed Evidence Content]:</b><br/>{raw_preview}", evidence_text_style)]
    ]
    evidence_table = Table(evidence_box, colWidths=[540])
    evidence_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#FFFDF7")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#ECC94B")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(evidence_table)
    story.append(Spacer(1, 8))

    # Section 3: AI Threat Forensics & Impersonation
    story.append(Paragraph(loc["forensics_title"], heading_style))
    indicators_str = "<br/>".join([f"• <b>[{ind.category}]</b> {ind.title}: {ind.description}" for ind in scan.indicators[:4]]) or "No specific indicators."
    behavior_str = ", ".join([f"{b.name} ({b.score}%)" for b in scan.behavioral_factors if b.detected]) or "None observed"
    
    forensics_data = [
        [
            Paragraph("<b>Phishing Patterns:</b>", body_style),
            Paragraph(indicators_str, body_style)
        ],
        [
            Paragraph("<b>Psychological Vectors:</b>", body_style),
            Paragraph(behavior_str, body_style)
        ],
        [
            Paragraph("<b>Impersonation Audit:</b>", body_style),
            Paragraph(scan.impersonation.details, body_style)
        ]
    ]
    forensics_table = Table(forensics_data, colWidths=[140, 400])
    forensics_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F7FAFC")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E0")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(forensics_table)
    story.append(Spacer(1, 8))

    # Section 4: Financial Loss (If Applicable)
    if req.financial_loss and (req.financial_loss.amount_lost or req.financial_loss.transaction_id):
        story.append(Paragraph(loc["financial_title"], heading_style))
        fin = req.financial_loss
        fin_rows = [
            [
                Paragraph("<b>Total Amount Lost (INR):</b>", body_style),
                Paragraph(f"₹ {fin.amount_lost or '0'}", body_style)
            ],
            [
                Paragraph("<b>Transaction / UTR Reference:</b>", body_style),
                Paragraph(fin.transaction_id or "Pending statement", body_style)
            ],
            [
                Paragraph("<b>Bank / Payment App:</b>", body_style),
                Paragraph(fin.bank_or_upi_app or "Not specified", body_style)
            ]
        ]
        fin_table = Table(fin_rows, colWidths=[160, 380])
        fin_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#FFF5F5")),
            ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#FEB2B2")),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#FED7D7")),
            ('TOPPADDING', (0,0), (-1,-1), 3),
            ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ]))
        story.append(fin_table)
        story.append(Spacer(1, 8))

    # Section 5: Statutory Guidance & Disclaimer
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#CBD5E0"), spaceBefore=4, spaceAfter=6))
    story.append(Paragraph(loc["disclaimer"], subtitle_style))

    doc.build(story)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes

def prepare_full_evidence_package(
    report_id: str,
    scan: ScanResult,
    req: EvidencePreparationRequest
) -> Tuple[CybercrimeReport, bytes, bytes]:
    now = datetime.now(timezone.utc)

    # 1. Generate PDF
    pdf_bytes = generate_evidence_pdf(report_id, scan, req, now)
    pdf_hash = calculate_sha256(pdf_bytes)

    # 2. Raw evidence text
    raw_text = (scan.raw_content_preview or scan.summary).encode("utf-8")
    raw_hash = calculate_sha256(raw_text)

    # 3. Evidence Manifest data
    manifest_dict = {
        "report_id": report_id,
        "scan_id": scan.id,
        "generated_at_utc": now.isoformat(),
        "reporting_pathway": req.reporting_pathway,
        "official_portal": PORTAL_URLS.get(req.reporting_pathway, "https://cybercrime.gov.in/"),
        "files": [
            {
                "filename": f"{report_id}_Evidence_Dossier.pdf",
                "sha256": pdf_hash,
                "size_bytes": len(pdf_bytes),
                "tier": "User-confirmed"
            },
            {
                "filename": f"{report_id}_Original_Scam_Content.txt",
                "sha256": raw_hash,
                "size_bytes": len(raw_text),
                "tier": "User-confirmed"
            }
        ],
        "threat_summary": {
            "risk_score": scan.risk_score,
            "severity": scan.severity,
            "claimed_entity": scan.impersonation.claimed_organization,
            "detected_language": scan.detected_language
        }
    }
    manifest_bytes = json.dumps(manifest_dict, indent=2).encode("utf-8")
    manifest_hash = calculate_sha256(manifest_bytes)

    # 4. Construct ZIP archive in-memory
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr(f"{report_id}_Evidence_Dossier.pdf", pdf_bytes)
        zf.writestr(f"{report_id}_Original_Scam_Content.txt", raw_text)
        zf.writestr(f"{report_id}_Evidence_Manifest.json", manifest_bytes)
    zip_bytes = zip_buffer.getvalue()
    zip_buffer.close()

    # Evidence items metadata
    evidence_items = [
        EvidenceItem(
            id=f"{report_id}_pdf",
            filename=f"{report_id}_Evidence_Dossier.pdf",
            file_type="application/pdf",
            category="Official Evidence Dossier (PDF)",
            sha256_hash=pdf_hash,
            file_size_bytes=len(pdf_bytes),
            verification_tier="User-confirmed",
            download_url=f"/api/v1/evidence/{report_id}/pdf",
            is_portal_recommended=True
        ),
        EvidenceItem(
            id=f"{report_id}_txt",
            filename=f"{report_id}_Original_Scam_Content.txt",
            file_type="text/plain",
            category="Original Scam Text",
            sha256_hash=raw_hash,
            file_size_bytes=len(raw_text),
            verification_tier="User-confirmed",
            download_url=f"/api/v1/evidence/{report_id}/raw",
            is_portal_recommended=False
        ),
        EvidenceItem(
            id=f"{report_id}_manifest",
            filename=f"{report_id}_Evidence_Manifest.json",
            file_type="application/json",
            category="Integrity Manifest (SHA-256)",
            sha256_hash=manifest_hash,
            file_size_bytes=len(manifest_bytes),
            verification_tier="AI-extracted",
            download_url=f"/api/v1/evidence/{report_id}/manifest",
            is_portal_recommended=False
        )
    ]

    report = CybercrimeReport(
        id=report_id,
        scan_id=scan.id,
        title=f"Cybercrime Evidence: {scan.impersonation.claimed_organization or 'Digital Scam'}",
        reporting_pathway=req.reporting_pathway,
        portal_url=PORTAL_URLS.get(req.reporting_pathway, "https://cybercrime.gov.in/"),
        recommended_category=req.incident_category or "Banking & KYC Phishing",
        status="Report Prepared",
        official_acknowledgement_number=None,
        suspect_details=req.suspect_details,
        financial_loss=req.financial_loss,
        evidence_items=evidence_items,
        manifest_sha256=manifest_hash,
        language=req.language,
        created_at=now,
        updated_at=now
    )

    return report, pdf_bytes, zip_bytes

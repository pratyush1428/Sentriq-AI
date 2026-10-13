import pytest

def test_prepare_cybercrime_evidence(client):
    # Test financial fraud pathway
    payload = {
        "scan_id": "scn_sbi_demo",
        "reporting_pathway": "financial_fraud",
        "incident_category": "Banking & KYC Phishing",
        "language": "en",
        "suspect_details": {
            "phone_number": "+91 98401 92831",
            "upi_id": "sbi_kyc_verify@ybl",
            "suspicious_url": "http://sbi-kyc-verify.online"
        },
        "financial_loss": {
            "amount_lost": "12,500",
            "transaction_id": "UPI/2026/894101",
            "bank_or_upi_app": "SBI Yono"
        },
        "user_confirmed": True
    }
    res = client.post("/api/v1/evidence/prepare", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "CR-2026-" in data["id"]
    assert data["reporting_pathway"] == "financial_fraud"
    assert data["portal_url"] == "https://cybercrime.gov.in/"
    assert len(data["evidence_items"]) >= 2
    
    # Check SHA-256 hash existence
    for item in data["evidence_items"]:
        assert len(item["sha256_hash"]) == 64
        assert item["file_size_bytes"] > 0

    # Test PDF download
    report_id = data["id"]
    pdf_res = client.get(f"/api/v1/evidence/{report_id}/pdf")
    assert pdf_res.status_code == 200
    assert pdf_res.headers["content-type"] == "application/pdf"
    assert len(pdf_res.content) > 1000

    # Test ZIP package download
    zip_res = client.get(f"/api/v1/evidence/{report_id}/package")
    assert zip_res.status_code == 200
    assert zip_res.headers["content-type"] == "application/zip"

def test_prepare_suspect_report_pathway_multilingual(client):
    # Test suspect reporting path in Tamil and Telugu
    for lang in ["ta", "te", "hi"]:
        payload = {
            "scan_id": "scn_tneb_tanglish",
            "reporting_pathway": "suspect",
            "incident_category": "Utility Bill Impersonation",
            "language": lang,
            "suspect_details": {
                "phone_number": "+91 94440 12345",
                "suspicious_url": "http://tneb-bill.site"
            }
        }
        res = client.post("/api/v1/evidence/prepare", json=payload)
        assert res.status_code == 200
        data = res.json()
        assert data["reporting_pathway"] == "suspect"
        assert "cyber_suspect.aspx" in data["portal_url"]
        assert data["language"] == lang

def test_update_acknowledgement_and_tracking(client):
    res = client.get("/api/v1/evidence/reports")
    assert res.status_code == 200
    reports = res.json()
    assert len(reports) >= 1

    first_rep_id = reports[0]["id"]
    patch_payload = {
        "status": "User Marked as Submitted",
        "official_acknowledgement_number": "ACK/2026/GOV/49821"
    }
    patch_res = client.patch(f"/api/v1/evidence/reports/{first_rep_id}", json=patch_payload)
    assert patch_res.status_code == 200
    updated = patch_res.json()
    assert updated["official_acknowledgement_number"] == "ACK/2026/GOV/49821"
    assert updated["status"] == "Acknowledgement Recorded"

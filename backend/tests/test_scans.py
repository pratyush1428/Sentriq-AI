import pytest

def test_health_check(client):
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert "modules" in data

def test_scan_benign_message(client):
    payload = {
        "content": "Hi Mom, I reached the office safely. Will be home by 7 PM for dinner.",
        "scan_type": "text"
    }
    res = client.post("/api/v1/scans/text", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["risk_score"] < 30
    assert data["severity"] == "low"

def test_scan_english_sbi_phishing(client):
    payload = {
        "content": "Dear Customer, Your SBI account will be blocked today. Please verify KYC immediately at http://sbi-kyc-update.xyz to prevent suspension.",
        "scan_type": "text"
    }
    res = client.post("/api/v1/scans/text", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["risk_score"] >= 75
    assert data["severity"] in ("high", "critical")
    assert data["impersonation"]["claimed_organization"] == "State Bank of India (SBI)"
    assert data["impersonation"]["status"] == "suspicious_mismatch"
    assert len(data["indicators"]) >= 1

def test_scan_tanglish_banking_fraud(client):
    payload = {
        "content": "Unga account block aagidum innaikku. Ippo udane KYC update pannunga panam anupunga http://bank-secure-pan.online",
        "scan_type": "text"
    }
    res = client.post("/api/v1/scans/text", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["detected_language"] in ("Tanglish", "Multilingual (Code-Mixed)")
    assert data["risk_score"] >= 70
    assert data["severity"] in ("high", "critical")

def test_scan_hinglish_fraud(client):
    payload = {
        "content": "Aapka SBI account block ho jayega. Turant OTP share karein aur KYC update karein.",
        "scan_type": "text"
    }
    res = client.post("/api/v1/scans/text", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["detected_language"] in ("Hinglish", "Multilingual (Code-Mixed)")
    assert data["risk_score"] >= 70

def test_scan_url_ssrf_protection(client):
    payload = {
        "content": "http://127.0.0.1:8080/admin",
        "scan_type": "url"
    }
    res = client.post("/api/v1/scans/url", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["url_analysis"]["reputation_status"] == "malicious"
    assert "SSRF" in data["url_analysis"]["risk_factors"][0] or "Restricted" in data["url_analysis"]["risk_factors"][0]

def test_reports_and_intelligence(client):
    res = client.get("/api/v1/reports/summary")
    assert res.status_code == 200
    data = res.json()
    assert data["total_scans"] >= 1
    assert "weekly_activity" in data

    res2 = client.get("/api/v1/intelligence/trends")
    assert res2.status_code == 200
    trends = res2.json()
    assert len(trends) >= 1
    assert any(t["region"] == "Chennai" for t in trends)

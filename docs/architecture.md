# Sentriq AI — System Architecture

## Architectural Principles
1. **Separation of Concerns:** Shared FastAPI backend serves both web and Android Capacitor clients.
2. **Untrusted Input Handling:** User-submitted text, URLs, and files are strictly treated as untrusted data with SSRF prevention and sanitization.
3. **Multilingual NLP Pipeline:** Deterministic pattern recognition with weighted risk scoring, language script detection (Tamil, Devanagari, Romanized), and explainable risk factor breakdown.
4. **Data Isolation & Privacy:** Zero-retention capability, Row-Level Security (RLS) on PostgreSQL, and token-based authentication.

## Data Flow
```
User Content (Text / URL / Image / QR / Voice)
               │
               ▼
   [ FastAPI API Gateway ]
               │
   ┌───────────┴───────────────────────────────┐
   ▼                                           ▼
[ Multilingual & Script Detector ]   [ Phishing URL & SSRF Filter ]
(English, Tamil, Hindi, Tanglish, Hinglish) (Host verification, homoglyphs)
   │                                           │
   └───────────┬───────────────────────────────┘
               ▼
   [ Impersonation Registry ]
   (SBI, HDFC, TNEB, BESCOM, Income Tax, etc.)
               │
               ▼
   [ Behavioral Manipulation Engine ]
   (Urgency, Fear, Authority, Financial Lure)
               │
               ▼
   [ Weighted Risk Scoring Engine ]
   (0-100 Score, Severity, Evidence & Golden Hour 1930 Actions)
               │
               ▼
   [ Frontend Presentation / Android Share Target ]
```

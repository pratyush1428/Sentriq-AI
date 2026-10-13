# Sentriq AI — Intelligent Multilingual Phishing and Digital Fraud Detection Platform

> **Intelligence Behind Every Defense.**

Sentriq AI is a full-stack, AI-driven cybersecurity platform designed to protect citizens from sophisticated social engineering, impersonation scams, phishing URLs, malicious QR codes, and suspicious voice notes.

It natively understands **English, Tamil, Hindi, Tanglish (Romanized Tamil), and Hinglish (Romanized Hindi)**, accurately detecting localized fraud vectors such as fake electricity bill cutoffs, deceptive bank KYC blocks, and fake lottery rewards.

---

## 🎨 UI Aesthetic & Reference Match

Sentriq AI implements the signature **Warm Editorial Design System** requested from the reference interface:
- **Parchment cream background (`#F6F4EE`)** with crisp white cards and soft warm borders (`#E5E1D5`).
- **Refined Editorial Typography (`Newsreader` / serif headlines)** paired with clean modern body sans.
- **Left Navigation Rail:** Overview, Scan something, Scam trends, Safety guide, "Protection is active" badge card, and user profile (`Arun S.`).
- **Unified AI Scanner:** Tabs for Message, Link, QR code, Voice, and Screenshot; preset chips for instant 1-click test scenarios; auto-detect badge and multi-language capability footer note.
- **Right Rail Deep Forest Green Alert Card:** Radar graphic watermark, `CHENNAI · THIS WEEK` surging alert for electricity bill scams, and `60-SECOND SAFETY` micro-module.
- **Your Activity / Recent Checks:** Real-time risk score pills (`92 High risk`), timestamp, and interactive explainable risk reports.

---

## 🏛️ Monorepo Architecture

```text
sentriq-ai/
│
├── frontend/             # Next.js 16 (App Router), React 19, Tailwind CSS, Lucide icons
│   ├── src/app/          # Page and Root Layout with Editorial fonts
│   ├── src/components/   # Scanner, Sidebar, RightRailAlert, RecentActivity, ReportsModal
│   ├── src/services/     # API client with seamless backend connection & fallback
│   └── src/types/        # Full TypeScript contracts matching FastAPI schemas
│
├── backend/              # Python 3.14 + FastAPI high-performance backend
│   ├── app/core/         # Config, logging, security, custom domain exceptions
│   ├── app/api/v1/       # REST endpoints (/scans, /reports, /intelligence, /users)
│   ├── app/services/     # Multilingual NLP, URL analysis, Impersonation, Risk scoring
│   ├── app/repositories/ # Data repositories & persistent session cache
│   └── tests/            # Automated Pytest suite (100% passing)
│
├── database/             # Supabase PostgreSQL schema, migrations & RLS policies
│   ├── migrations/       # 001_initial_schema.sql
│   ├── policies/         # rls_policies.sql (Row-Level Security)
│   └── seed/             # seed_data.sql (Official Indian registry & regional trends)
│
├── mobile/               # Capacitor Android configuration & Share Intent integration
│   ├── capacitor.config.ts
│   ├── AndroidManifest.xml
│   └── README.md
│
├── docs/                 # Complete architecture and build documentation
├── BUILD_STATUS.md       # Documented verification status and test outputs
└── README.md             # Project documentation
```

---

## 🚀 Quick Start Guide

### 1. Start the Backend API (FastAPI)
```bash
# Navigate to backend
cd backend

# Activate virtual environment
venv\Scripts\activate   # Windows PowerShell: .\backend\venv\Scripts\Activate.ps1

# Run server
uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation will be live at: `http://127.0.0.1:8000/docs`

### 2. Start the Frontend Application (Next.js)
```bash
# Navigate to frontend
cd frontend

# Run development server
npm run dev
```
Open your browser at: `http://localhost:3000`

### 3. Run Backend Test Suite
```bash
$env:PYTHONPATH="."; backend\venv\Scripts\python -m pytest backend/tests -v
```

---

## 🛡️ Core Fraud Detection Modules

1. **Multilingual Scam Detection:** Recognizes manipulative patterns in pure script and Romanized regional expressions (Tanglish & Hinglish).
2. **Entity Impersonation Engine:** Compares sender claims against curated official domains (SBI, HDFC, ICICI, TNEB, BESCOM, Income Tax, TRAI, India Post).
3. **Phishing URL & SSRF Shield:** Analyzes domain depth, homoglyphs, punycode, URL shorteners, and blocks private/internal IP access.
4. **Behavioral Manipulation Matrix:** Quantifies psychological pressure across Urgency, Fear, Authority Pressure, Financial Greed, and Secrecy.
5. **Emergency Action Guide:** Provides immediate next steps, including the Golden Hour **1930 National Cyber Helpline** and **cybercrime.gov.in** reporting.

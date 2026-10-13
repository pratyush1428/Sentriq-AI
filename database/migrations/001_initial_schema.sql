-- 001_initial_schema.sql: Supabase PostgreSQL Schema for Sentriq AI

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL DEFAULT 'Citizen User',
    preferred_language VARCHAR(10) NOT NULL DEFAULT 'en',
    role VARCHAR(30) NOT NULL DEFAULT 'citizen',
    protection_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Scans Table
CREATE TABLE IF NOT EXISTS scans (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    scan_type VARCHAR(20) NOT NULL, -- text, url, image, audio, qr
    status VARCHAR(20) NOT NULL DEFAULT 'completed',
    detected_language VARCHAR(50) NOT NULL,
    risk_score INT NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
    severity VARCHAR(20) NOT NULL, -- low, medium, high, critical
    raw_content_preview TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Scan Results (Detailed analysis)
CREATE TABLE IF NOT EXISTS scan_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scan_id TEXT NOT NULL REFERENCES scans(id) ON DELETE CASCADE,
    indicators JSONB NOT NULL DEFAULT '[]'::jsonb,
    behavioral_factors JSONB NOT NULL DEFAULT '[]'::jsonb,
    impersonation_details JSONB NOT NULL DEFAULT '{}'::jsonb,
    url_analysis JSONB,
    explanation TEXT NOT NULL,
    recommended_actions JSONB NOT NULL DEFAULT '[]'::jsonb,
    model_version VARCHAR(50) NOT NULL DEFAULT 'sentriq-nlp-v1',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Official Sources Registry
CREATE TABLE IF NOT EXISTS official_sources (
    id TEXT PRIMARY KEY,
    organization_name TEXT NOT NULL,
    organization_type VARCHAR(50) NOT NULL,
    official_domain TEXT NOT NULL,
    source_url TEXT,
    verification_status VARCHAR(20) NOT NULL DEFAULT 'verified',
    emergency_helpline TEXT,
    scam_tactics JSONB NOT NULL DEFAULT '[]'::jsonb,
    legitimate_rules JSONB NOT NULL DEFAULT '[]'::jsonb,
    checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. User Reports
CREATE TABLE IF NOT EXISTS user_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    scan_id TEXT REFERENCES scans(id) ON DELETE SET NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    target_medium VARCHAR(30) DEFAULT 'SMS',
    suspicious_sender TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending_review',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Regional Scam Trends
CREATE TABLE IF NOT EXISTS regional_trends (
    id TEXT PRIMARY KEY,
    region VARCHAR(100) NOT NULL,
    title TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    report_count INT NOT NULL DEFAULT 0,
    change_percentage VARCHAR(20) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    description TEXT NOT NULL,
    period VARCHAR(50) NOT NULL,
    source TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. User Preferences
CREATE TABLE IF NOT EXISTS user_preferences (
    user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    theme VARCHAR(30) NOT NULL DEFAULT 'editorial',
    language VARCHAR(10) NOT NULL DEFAULT 'en',
    retention_days INT NOT NULL DEFAULT 30,
    allow_anonymous_telemetry BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id TEXT NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    ip_hash TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performant lookups
CREATE INDEX IF NOT EXISTS idx_scans_user_id ON scans(user_id);
CREATE INDEX IF NOT EXISTS idx_scans_created_at ON scans(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scan_results_scan_id ON scan_results(scan_id);
CREATE INDEX IF NOT EXISTS idx_regional_trends_region ON regional_trends(region);
CREATE INDEX IF NOT EXISTS idx_official_sources_domain ON official_sources(official_domain);

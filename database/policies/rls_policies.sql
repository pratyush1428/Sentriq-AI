-- rls_policies.sql: Row-Level Security Policies for Sentriq AI

-- Enable RLS on all user-facing tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Profiles: Users can view and update only their own profile
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- 2. Scans: Users can view their own scans or anonymous scans created in session
CREATE POLICY "Users can view own scans"
    ON scans FOR SELECT
    USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert scans"
    ON scans FOR INSERT
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete own scans"
    ON scans FOR DELETE
    USING (auth.uid() = user_id);

-- 3. Scan Results: Accessible if the scan is accessible
CREATE POLICY "Users can view own scan results"
    ON scan_results FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM scans
            WHERE scans.id = scan_results.scan_id
            AND (scans.user_id = auth.uid() OR scans.user_id IS NULL)
        )
    );

-- 4. User Preferences: Strictly private
CREATE POLICY "Users manage own preferences"
    ON user_preferences FOR ALL
    USING (auth.uid() = user_id);

-- 5. Public read-only for official sources & trends
ALTER TABLE official_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read official sources"
    ON official_sources FOR SELECT
    USING (true);

ALTER TABLE regional_trends ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read regional trends"
    ON regional_trends FOR SELECT
    USING (true);

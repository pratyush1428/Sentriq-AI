export interface Indicator {
  category: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  evidence_snippet?: string;
  confidence: number;
}

export interface BehavioralFactor {
  name: string;
  score: number;
  detected: boolean;
  evidence?: string;
}

export interface ImpersonationDetails {
  claimed_organization?: string;
  organization_type?: string;
  official_domain?: string;
  is_verified_source: boolean;
  status: "authentic" | "suspicious_mismatch" | "unknown_claim" | "no_impersonation";
  details: string;
}

export interface UrlAnalysisDetails {
  target_url: string;
  domain: string;
  is_shortener: boolean;
  has_homoglyph_or_punycode: boolean;
  brand_domain_mismatch: boolean;
  reputation_status: "safe" | "suspicious" | "malicious" | "unverified";
  risk_factors: string[];
}

export interface ScanResult {
  id: string;
  scan_type: string;
  status: string;
  risk_score: number;
  severity: "low" | "medium" | "high" | "critical";
  detected_language: string;
  language_display: string;
  summary: string;
  explanation: string;
  indicators: Indicator[];
  behavioral_factors: BehavioralFactor[];
  impersonation: ImpersonationDetails;
  url_analysis?: UrlAnalysisDetails | null;
  official_verification: {
    registry_checked?: boolean;
    claimed_entity?: string;
    helpline?: string;
  };
  recommended_actions: string[];
  raw_content_preview?: string;
  created_at: string;
}

export interface RegionalTrendItem {
  id: string;
  region: string;
  title: string;
  category: string;
  report_count: number;
  change_percentage: string;
  severity: string;
  description: string;
  period: string;
  source: string;
  updated_at: string;
}

export interface OfficialRegistryItem {
  id: string;
  organization_name: string;
  organization_type: string;
  official_domain: string;
  known_scam_tactics: string[];
  legitimate_communication_rules: string[];
  emergency_helpline: string;
}

export interface UserProfile {
  id: string;
  display_name: string;
  email: string;
  role: string;
  preferred_language: string;
  theme_preference: string;
  protection_active: boolean;
  created_at: string;
}

export interface EvidenceItem {
  id: string;
  filename: string;
  file_type: string;
  category: string;
  sha256_hash: string;
  file_size_bytes: number;
  verification_tier: string;
  download_url: string;
  is_portal_recommended: boolean;
}

export interface SuspectDetails {
  phone_number?: string;
  upi_id?: string;
  email?: string;
  suspicious_url?: string;
  social_handle_or_platform?: string;
}

export interface FinancialLossDetails {
  amount_lost?: string;
  transaction_id?: string;
  bank_or_upi_app?: string;
  incident_date?: string;
}

export interface CybercrimeReport {
  id: string;
  scan_id: string;
  title: string;
  reporting_pathway: "suspect" | "financial_fraud";
  portal_url: string;
  recommended_category: string;
  status: "Draft" | "Report Prepared" | "Downloaded" | "User Marked as Submitted" | "Acknowledgement Recorded";
  official_acknowledgement_number?: string | null;
  suspect_details?: SuspectDetails | null;
  financial_loss?: FinancialLossDetails | null;
  evidence_items: EvidenceItem[];
  manifest_sha256: string;
  language: string;
  created_at: string;
  updated_at: string;
}

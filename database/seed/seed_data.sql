-- seed_data.sql: Official sources and verified registry data

INSERT INTO official_sources (id, organization_name, organization_type, official_domain, emergency_helpline, scam_tactics, legitimate_rules)
VALUES 
(
    'sbi',
    'State Bank of India (SBI)',
    'Bank',
    'onlinesbi.sbi',
    '1800 1234 / 1930',
    '["Your SBI account will be blocked today - update KYC via apk/link", "SBI Rewards / Points expiration cash redemption links"]'::jsonb,
    '["SBI never sends SMS from personal 10-digit mobile numbers.", "SBI never asks customers to click links to update KYC or Aadhaar."]'::jsonb
),
(
    'tneb',
    'TNEB / TANGEDCO (Tamil Nadu Electricity)',
    'Utility',
    'tangedco.org',
    '94987 94987 / 1930',
    '["Dear consumer, your electricity power will be disconnected tonight at 9:30 PM due to unpaid bill. Call officer immediately."]'::jsonb,
    '["TANGEDCO never assigns personal WhatsApp numbers to collect bills.", "Power disconnection notices are served formally, not through sudden threatening SMS."]'::jsonb
),
(
    'incometax',
    'Income Tax Department of India',
    'Government',
    'incometax.gov.in',
    '1800 103 0025 / 1930',
    '["Income Tax refund of Rs 15,490 approved. Submit bank account details here to receive."]'::jsonb,
    '["Tax refunds are credited directly to pre-validated bank accounts.", "Income Tax Dept never sends links asking for bank card details to approve refund."]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO regional_trends (id, region, title, category, report_count, change_percentage, severity, description, period, source)
VALUES
(
    'trend_chennai_eb',
    'Chennai',
    'Fake electricity bill messages are surging',
    'Utility Impersonation',
    1840,
    '+38%',
    'high',
    'Reports are up 38%. Scammers are threatening same-day power cuts to create panic. Victims receive SMS asking them to call personal numbers.',
    'This Week',
    'TNEB Vigilance & Citizen Incident Network'
)
ON CONFLICT (id) DO NOTHING;

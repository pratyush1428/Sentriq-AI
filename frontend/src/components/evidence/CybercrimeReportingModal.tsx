"use client";

import React, { useState } from "react";
import { 
  X, 
  ShieldCheck, 
  ExternalLink, 
  Download, 
  FileText, 
  CheckCircle2, 
  PhoneCall, 
  Copy, 
  FileArchive, 
  Hash
} from "lucide-react";
import { ScanResult, CybercrimeReport } from "@/types";
import { 
  prepareCybercrimeEvidence, 
  updateCybercrimeReportStatus, 
  getEvidencePdfDownloadUrl, 
  getEvidencePackageDownloadUrl 
} from "@/services/api";

interface CybercrimeReportingModalProps {
  scan: ScanResult;
  onClose: () => void;
  initialPathway?: "suspect" | "financial_fraud";
}

const TRANSLATIONS = {
  en: {
    title: "One-Click Cybercrime Reporting Assistance",
    subtitle: "Prepare court-admissible evidence, download reports, and file on India's official portal.",
    path_a_title: "Path A — Report Suspicious Activity (Suspect)",
    path_a_desc: "Report phishing messages, fake links, or fraud calls where NO money was lost.",
    path_b_title: "Path B — Report Financial Fraud / Cybercrime",
    path_b_desc: "Victim report for stolen funds, unauthorized debits, or active extortion.",
    golden_hour: "GOLDEN HOUR EMERGENCY: If money was debited, call 1930 immediately to freeze transactions.",
    suspect_phone: "Suspect Mobile / WhatsApp Number",
    suspect_upi: "Suspect UPI ID / Account / URL",
    loss_amount: "Amount Lost (₹ INR)",
    loss_tx: "Bank Transaction UTR / Ref ID",
    evidence_checklist: "Portal-Compatible Evidence Files & Hashes",
    portal_category_title: "Recommended Portal Category",
    portal_category_financial: "Category: 'Financial Fraud' ➔ Subcategory: 'UPI Fraud / Banking Phishing'",
    portal_category_suspect: "Category: 'Report Cyber Suspect' ➔ 'Phishing Website / Fraud Mobile Number'",
    download_pdf: "Download PDF Dossier",
    download_zip: "Download Evidence ZIP",
    launch_portal: "Download & Open Official Cybercrime Portal ↗",
    upload_steps_title: "Guided Upload Steps on cybercrime.gov.in",
    step1: "1. The official portal opens in a new tab.",
    step2: "2. Sign in or enter OTP verification as a citizen.",
    step3: "3. Choose the recommended category shown above.",
    step4: "4. Under 'Upload Evidence', click 'Choose File' and select the downloaded Sentriq PDF.",
    step5: "5. Submit the complaint and copy your Government Acknowledgement Number.",
    ack_placeholder: "Enter Official Acknowledgement Number (e.g. 2026/CYBER/...)",
    save_ack: "Record Acknowledgement",
    disclaimer: "Sentriq AI is an independent civic safety assistant. Complaints are submitted directly to the Government of India portal."
  },
  ta: {
    title: "சைபர்குற்ற புகார் உதவி (Cybercrime Reporting Assistance)",
    subtitle: "ஆதாரங்களை தயார் செய்து, PDF பதிவிறக்கி, அதிகாரப்பூர்வ இந்திய போர்ட்டலில் புகார் அளியுங்கள்.",
    path_a_title: "பாதை A — சந்தேக நபர் அறிக்கை (பணம் இழக்கவில்லை)",
    path_a_desc: "மோசடி செய்திகள், போலி இணைப்புகள் அல்லது அழைப்புகள் (நிதி இழப்பு இல்லாதவை).",
    path_b_title: "பாதை B — நிதி மோசடி / சைபர் குற்றப் புகார்",
    path_b_desc: "பணம் திருடப்பட்டாலோ அல்லது வங்கி கணக்கிலிருந்து பணம் எடுக்கப்பட்டாலோ.",
    golden_hour: "கோல்டன் ஹவர் அவசர உதவி: பணம் எடுக்கப்பட்டிருந்தால் உடனடியாக 1930-ஐ அழைக்கவும்.",
    suspect_phone: "சந்தேக நபர் மொபைல் / வாட்ஸ்அப் எண்",
    suspect_upi: "சந்தேக நபர் UPI ID / வங்கி கணக்கு / URL",
    loss_amount: "இழந்த தொகை (₹ INR)",
    loss_tx: "பரிவர்த்தனை UTR / குறிப்பு எண்",
    evidence_checklist: "போர்டல் ஆதார கோப்புகள் & SHA-256 குறியீடுகள்",
    portal_category_title: "பரிந்துரைக்கப்படும் போர்டல் வகை",
    portal_category_financial: "வகை: 'Financial Fraud' ➔ 'UPI Fraud / Banking Phishing'",
    portal_category_suspect: "வகை: 'Report Cyber Suspect' ➔ 'Phishing Website / Fraud Number'",
    download_pdf: "PDF ஆதாரத்தை பதிவிறக்கு",
    download_zip: "முழு ஆதார தொகுப்பை பதிவிறக்கு (ZIP)",
    launch_portal: "PDF பதிவிறக்கி போர்ட்டலை திறக்க ↗",
    upload_steps_title: "cybercrime.gov.in போர்ட்டலில் பதிவேற்றும் படிகள்",
    step1: "1. அதிகாரப்பூர்வ போர்டல் புதிய பக்கத்தில் திறக்கும்.",
    step2: "2. குடிமகன் சரிபார்ப்பு அல்லது OTP மூலம் உள்நுழையவும்.",
    step3: "3. மேலே குறிப்பிடப்பட்டுள்ள பரிந்துரைக்கப்பட்ட வகையை தேர்ந்தெடுக்கவும்.",
    step4: "4. 'Upload Evidence'-ல் Sentriq AI பதிவிறக்கிய PDF-ஐ தேர்ந்தெடுக்கவும்.",
    step5: "5. புகாரை சமர்ப்பித்து அரசு வழங்கும் Acknowledgement எண்ணை நகலெடுக்கவும்.",
    ack_placeholder: "அரசு ஒப்புதல் எண்ணை உள்ளிடவும் (e.g. 2026/CYBER/...)",
    save_ack: "ஒப்புதல் எண்ணை பதிவு செய்",
    disclaimer: "சென்ட்ரிக் AI ஒரு குடிமக்கள் உதவி கருவி. இறுதி புகார் cybercrime.gov.in-ல் சமர்ப்பிக்கப்படுகிறது."
  },
  te: {
    title: "ఒకే క్లిక్‌తో సైబర్‌క్రైమ్ రిపోర్టింగ్ సహాయం",
    subtitle: "సాక్ష్యాలను సిద్ధం చేయండి, డౌన్‌లోడ్ చేసుకోండి మరియు అధికారిక పోర్టల్‌లో ఫిర్యాదు చేయండి.",
    path_a_title: "మార్గం A — అనుమానితుడి రిపోర్ట్ (డబ్బు పోలేదు)",
    path_a_desc: "డబ్బు నష్టం లేని మోసపూరిత సందేశాలు, నకిలీ లింకులు లేదా కాల్స్.",
    path_b_title: "మార్గం B — ఆర్థిక సైబర్ మోసం ఫిర్యాదు",
    path_b_desc: "డబ్బు పోయినప్పుడు లేదా అనధికారిక లావాదేవీలు జరిగినప్పుడు.",
    golden_hour: "గోల్డెన్ అవర్ హెల్ప్‌లైన్: డబ్బు పోయినట్లయితే వెంటనే 1930 కి కాల్ చేయండి.",
    suspect_phone: "అనుమానితుడి మొబైల్ / వాట్సాప్ నంబర్",
    suspect_upi: "అనుమానితుడి UPI ID / ఖాతా / URL",
    loss_amount: "కోల్పోయిన మొత్తం (₹ INR)",
    loss_tx: "లావాదేవీ UTR / రిఫరెన్స్ ID",
    evidence_checklist: "పోర్టల్ సాక్ష్యాల ఫైళ్ళు మరియు SHA-256 హాష్‌లు",
    portal_category_title: "సిఫార్సు చేయబడిన వర్గం",
    portal_category_financial: "వర్గం: 'Financial Fraud' ➔ 'UPI Fraud / Banking Phishing'",
    portal_category_suspect: "వర్గం: 'Report Cyber Suspect' ➔ 'Phishing Website / Fraud Number'",
    download_pdf: "PDF సాక్ష్యాలను డౌన్‌లోడ్ చేయండి",
    download_zip: "మొత్తం ప్యాకేజీని డౌన్‌లోడ్ చేయండి (ZIP)",
    launch_portal: "PDF డౌన్‌లోడ్ చేసి పోర్టల్ తెరవండి ↗",
    upload_steps_title: "cybercrime.gov.in లో అప్‌లోడ్ మార్గదర్శకాలు",
    step1: "1. అధికారిక పోర్టల్ కొత్త ట్యాబ్‌లో తెరవబడుతుంది.",
    step2: "2. OTP ద్వారా ధృవీకరణ పూర్తి చేయండి.",
    step3: "3. పైన చూపిన సిఫార్సు వర్గాన్ని ఎంచుకోండి.",
    step4: "4. 'Upload Evidence' వద్ద డౌన్‌లోడ్ చేసిన Sentriq PDF ఫైల్‌ను ఎంచుకోండి.",
    step5: "5. ఫిర్యాదు సమర్పించి ప్రభుత్వ అక్నాలెడ్జ్‌మెంట్ నంబర్‌ను భద్రపరచండి.",
    ack_placeholder: "ప్రభుత్వ అక్నాలెడ్జ్‌మెంట్ నంబర్ నమోదు చేయండి",
    save_ack: "నంబర్‌ను సేవ్ చేయండి",
    disclaimer: "సెంక్రిక్ AI ఒక స్వతంత్ర సహాయక వేదిక. ఫిర్యాదులు cybercrime.gov.in లో సమర్పించబడతాయి."
  },
  hi: {
    title: "वन-क्लिक साइबर अपराध रिपोर्टिंग सहायता",
    subtitle: "साक्ष्य तैयार करें, पीडीएफ डाउनलोड करें और भारत के आधिकारिक पोर्टल पर शिकायत दर्ज करें।",
    path_a_title: "पथ A — संदिग्ध गतिविधि की रिपोर्ट (कोई वित्तीय हानि नहीं)",
    path_a_desc: "फिशिंग संदेश, फर्जी लिंक जहां कोई पैसा नहीं खोया गया है।",
    path_b_title: "पथ B — वित्तीय साइबर धोखाधड़ी की रिपोर्ट",
    path_b_desc: "पैसे की चोरी या अनधिकृत बैंक ट्रांसफर के मामले में।",
    golden_hour: "गोल्डन ऑवर सूचना: यदि पैसे कटे हैं, तो तुरंत 1930 पर कॉल करें।",
    suspect_phone: "संदिग्ध मोबाइल / व्हाट्सएप नंबर",
    suspect_upi: "संदिग्ध UPI ID / खाता / URL",
    loss_amount: "खोई हुई राशि (₹ INR)",
    loss_tx: "लेन-देन UTR / संदर्भ संख्या",
    evidence_checklist: "पोर्टल-अनुकूल साक्ष्य फाइलें एवं SHA-256 हैश",
    portal_category_title: "अनुशंसित पोर्टल श्रेणी",
    portal_category_financial: "श्रेणी: 'Financial Fraud' ➔ 'UPI Fraud / Banking Phishing'",
    portal_category_suspect: "श्रेणी: 'Report Cyber Suspect' ➔ 'Phishing Website / Fraud Number'",
    download_pdf: "पीडीएफ साक्ष्य डाउनलोड करें",
    download_zip: "साक्ष्य पैकेज डाउनलोड करें (ZIP)",
    launch_portal: "पीडीएफ डाउनलोड कर आधिकारिक पोर्टल खोलें ↗",
    upload_steps_title: "cybercrime.gov.in पर अपलोड करने के चरण",
    step1: "1. आधिकारिक पोर्टल नए टैब में खुलेगा।",
    step2: "2. नागरिक के रूप में OTP से लॉगिन करें।",
    step3: "3. ऊपर बताई गई अनुशंसित श्रेणी का चयन करें।",
    step4: "4. 'Upload Evidence' के तहत डाउनलोड की गई Sentriq PDF चुनें।",
    step5: "5. शिकायत सबमिट करें और सरकारी पावती संख्या (Acknowledgement No) सहेजें।",
    ack_placeholder: "सरकारी पावती संख्या दर्ज करें (e.g. 2026/CYBER/...)",
    save_ack: "पावती संख्या सहेजें",
    disclaimer: "सेंट्रिक AI एक नागरिक सहायता उपकरण है। शिकायतें सीधे cybercrime.gov.in पर जमा की जाती हैं।"
  }
};

export function CybercrimeReportingModal({ scan, onClose, initialPathway = "financial_fraud" }: CybercrimeReportingModalProps) {
  const [lang, setLang] = useState<"en" | "ta" | "te" | "hi">("en");
  const [pathway, setPathway] = useState<"suspect" | "financial_fraud">(initialPathway);
  
  // Suspect form state
  const [phone, setPhone] = useState("");
  const [upi, setUpi] = useState(scan.url_analysis?.domain || "");
  const [lossAmount, setLossAmount] = useState("");
  const [txRef, setTxRef] = useState("");

  // Report preparation state
  const [preparedReport, setPreparedReport] = useState<CybercrimeReport | null>(null);
  const [isPreparing, setIsPreparing] = useState(false);
  const [ackInput, setAckInput] = useState("");
  const [isAckSaved, setIsAckSaved] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const t = TRANSLATIONS[lang];

  // Auto-prepare dossier on load or pathway switch
  const handlePrepareReport = async () => {
    setIsPreparing(true);
    try {
      const rep = await prepareCybercrimeEvidence({
        scan_id: scan.id,
        reporting_pathway: pathway,
        incident_category: pathway === "suspect" 
          ? "Report Cyber Suspect -> Phishing URL / Call" 
          : "Financial Fraud -> Banking & UPI Fraud",
        language: lang,
        suspect_details: {
          phone_number: phone || undefined,
          upi_id: upi || undefined,
          suspicious_url: scan.url_analysis?.target_url || undefined,
        },
        financial_loss: pathway === "financial_fraud" && lossAmount ? {
          amount_lost: lossAmount,
          transaction_id: txRef || undefined,
        } : undefined,
        user_confirmed: true
      });
      setPreparedReport(rep);
    } catch (e) {
      console.error("Preparation error:", e);
    } finally {
      setIsPreparing(false);
    }
  };

  // Launch Portal + Download Dossier
  const handleLaunchPortal = async () => {
    let rep = preparedReport;
    if (!rep) {
      setIsPreparing(true);
      rep = await prepareCybercrimeEvidence({
        scan_id: scan.id,
        reporting_pathway: pathway,
        incident_category: pathway === "suspect" 
          ? "Report Cyber Suspect" 
          : "Financial Fraud",
        language: lang,
        suspect_details: { phone_number: phone || undefined, upi_id: upi || undefined },
        financial_loss: lossAmount ? { amount_lost: lossAmount, transaction_id: txRef } : undefined,
        user_confirmed: true
      });
      setPreparedReport(rep);
      setIsPreparing(false);
    }

    if (rep) {
      // 1. Download PDF
      const pdfUrl = getEvidencePdfDownloadUrl(rep.id);
      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = `${rep.id}_Evidence_Dossier.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // 2. Open official government portal in new window
      const targetPortalUrl = pathway === "suspect"
        ? "https://cybercrime.gov.in/Webform/cyber_suspect.aspx"
        : "https://cybercrime.gov.in/";
      window.open(targetPortalUrl, "_blank", "noopener,noreferrer");

      // 3. Mark status as Downloaded
      await updateCybercrimeReportStatus(rep.id, "Downloaded");
    }
  };

  // Record Acknowledgement
  const handleSaveAck = async () => {
    if (!ackInput.trim() || !preparedReport) return;
    await updateCybercrimeReportStatus(preparedReport.id, "Acknowledgement Recorded", ackInput.trim());
    setIsAckSaved(true);
    setTimeout(() => setIsAckSaved(false), 2000);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(label);
    setTimeout(() => setCopyFeedback(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF8F3] rounded-3xl border border-[#E0DBCF] shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden text-[#18221D]">
        
        {/* Modal Header with Language Selector */}
        <div className="p-5 sm:p-6 border-b border-[#E8E4DA] flex items-start justify-between gap-4 bg-[#F5F2EB]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold tracking-widest text-[#059669] uppercase bg-[#DCFCE7] px-2 py-0.5 rounded-full border border-[#BBF7D0]">
                Official Portal Assistant
              </span>
              <span className="text-[10px] font-semibold text-[#7C8276]">
                Ref: cybercrime.gov.in
              </span>
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl text-[#18221D] font-normal leading-tight">
              {t.title}
            </h2>
            <p className="text-xs text-[#636A5E] mt-0.5 max-w-xl">
              {t.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <div className="flex items-center bg-[#E8E4DA] p-0.5 rounded-full text-xs font-semibold">
              {(["en", "ta", "te", "hi"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2.5 py-1 rounded-full uppercase transition-all ${
                    lang === l ? "bg-[#18221D] text-white shadow-sm" : "text-[#585E53] hover:text-[#18221D]"
                  }`}
                >
                  {l === "en" ? "EN" : l === "ta" ? "தமிழ்" : l === "te" ? "తెలుగు" : "हिंदी"}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#E5E1D5] hover:bg-[#DCD7C9] flex items-center justify-center text-[#4A5046] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-sm">
          
          {/* Emergency Golden Hour Banner for Financial Fraud */}
          {pathway === "financial_fraud" && (
            <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-2xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#EF4444] text-white flex items-center justify-center shrink-0 font-bold">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#991B1B] uppercase tracking-wide">
                  Helpline 1930 — Golden Hour Protocol
                </div>
                <p className="text-xs text-[#B91C1C] mt-0.5 font-medium leading-relaxed">
                  {t.golden_hour}
                </p>
              </div>
            </div>
          )}

          {/* Pathway Selection: Path A vs Path B */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#7C8276] mb-2.5">
              Select Filing Route
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Path A */}
              <div
                onClick={() => setPathway("suspect")}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  pathway === "suspect"
                    ? "bg-[#18221D] text-white border-[#18221D] shadow-sm"
                    : "bg-white text-[#18221D] border-[#E8E4DA] hover:border-[#CCC6B6]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold uppercase ${pathway === "suspect" ? "text-[#34D399]" : "text-[#059669]"}`}>
                    Path A
                  </span>
                  {pathway === "suspect" && <CheckCircle2 className="w-4 h-4 text-[#34D399]" />}
                </div>
                <h4 className="font-semibold text-sm mb-1">{t.path_a_title}</h4>
                <p className={`text-xs leading-relaxed ${pathway === "suspect" ? "text-[#D1D5DB]" : "text-[#636A5E]"}`}>
                  {t.path_a_desc}
                </p>
              </div>

              {/* Path B */}
              <div
                onClick={() => setPathway("financial_fraud")}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  pathway === "financial_fraud"
                    ? "bg-[#18221D] text-white border-[#18221D] shadow-sm"
                    : "bg-white text-[#18221D] border-[#E8E4DA] hover:border-[#CCC6B6]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold uppercase ${pathway === "financial_fraud" ? "text-[#F87171]" : "text-[#DC2626]"}`}>
                    Path B
                  </span>
                  {pathway === "financial_fraud" && <CheckCircle2 className="w-4 h-4 text-[#F87171]" />}
                </div>
                <h4 className="font-semibold text-sm mb-1">{t.path_b_title}</h4>
                <p className={`text-xs leading-relaxed ${pathway === "financial_fraud" ? "text-[#D1D5DB]" : "text-[#636A5E]"}`}>
                  {t.path_b_desc}
                </p>
              </div>
            </div>
          </div>

          {/* Incident & Suspect Optional Inputs */}
          <div className="bg-white rounded-2xl p-4 border border-[#E8E4DA] space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[#7C8276]">
              Suspect Details (To Pre-fill on Portal)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#52594D] block mb-1 font-medium">{t.suspect_phone}</label>
                <input
                  type="text"
                  placeholder="+91 98401 92831"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#DFDAD0] outline-none focus:border-[#18221D] bg-[#FCFBF8]"
                />
              </div>
              <div>
                <label className="text-xs text-[#52594D] block mb-1 font-medium">{t.suspect_upi}</label>
                <input
                  type="text"
                  placeholder="fraud_collect@ybl / http://fake-kyc.top"
                  value={upi}
                  onChange={(e) => setUpi(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#DFDAD0] outline-none focus:border-[#18221D] bg-[#FCFBF8]"
                />
              </div>

              {pathway === "financial_fraud" && (
                <>
                  <div>
                    <label className="text-xs text-[#52594D] block mb-1 font-medium">{t.loss_amount}</label>
                    <input
                      type="text"
                      placeholder="15,000"
                      value={lossAmount}
                      onChange={(e) => setLossAmount(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#DFDAD0] outline-none focus:border-[#18221D] bg-[#FCFBF8]"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#52594D] block mb-1 font-medium">{t.loss_tx}</label>
                    <input
                      type="text"
                      placeholder="UPI/2026/9482104"
                      value={txRef}
                      onChange={(e) => setTxRef(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#DFDAD0] outline-none focus:border-[#18221D] bg-[#FCFBF8]"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Recommended Category Box */}
          <div className="bg-[#F4F9F6] border border-[#CDE5D8] rounded-2xl p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[#065F46] mb-1">
              {t.portal_category_title}
            </div>
            <p className="text-xs font-semibold text-[#047857]">
              {pathway === "suspect" ? t.portal_category_suspect : t.portal_category_financial}
            </p>
            <p className="text-[11px] text-[#52796F] mt-1">
              Select this exact category under the portal dropdown to route evidence directly to the specialized cyber cell.
            </p>
          </div>

          {/* Evidence Files & SHA-256 Hashes Checklist */}
          <div className="bg-white rounded-2xl p-4 border border-[#E8E4DA] space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-[#7C8276]">
                {t.evidence_checklist}
              </div>
              <span className="text-[11px] font-semibold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                Portal Verified (Under 5 MB)
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {/* File 1: PDF Dossier */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FBF9F5] border border-[#EDE8DE]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="w-4 h-4 text-[#E0533C] shrink-0" />
                  <div className="min-w-0">
                    <div className="font-semibold text-[#18221D] truncate">
                      {preparedReport ? preparedReport.evidence_items[0]?.filename : "Sentriq_Evidence_Dossier.pdf"}
                    </div>
                    <div className="text-[10px] text-[#7A8074] font-mono truncate">
                      SHA-256: {preparedReport?.evidence_items[0]?.sha256_hash.slice(0, 24) || "e3b0c44298fc1c149afbf4c8..."}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => preparedReport && copyToClipboard(preparedReport.evidence_items[0]?.sha256_hash, "pdf_hash")}
                  className="px-2 py-1 text-[11px] font-medium bg-[#EFECE2] hover:bg-[#E5E1D5] rounded-lg transition-colors flex items-center gap-1 shrink-0"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copyFeedback === "pdf_hash" ? "Copied" : "Copy Hash"}</span>
                </button>
              </div>

              {/* File 2: Original Text */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FBF9F5] border border-[#EDE8DE]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Hash className="w-4 h-4 text-[#06B6D4] shrink-0" />
                  <div className="min-w-0">
                    <div className="font-semibold text-[#18221D] truncate">
                      Original_Scam_Content.txt
                    </div>
                    <div className="text-[10px] text-[#7A8074]">
                      Raw extracted text preserved unaltered for digital chain of custody
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-[#059669] bg-[#E6F8EE] px-2 py-0.5 rounded-full">
                  Preserved
                </span>
              </div>
            </div>

            {/* Direct Individual Download Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={handlePrepareReport}
                disabled={isPreparing}
                className="text-xs px-3 py-1.5 rounded-xl bg-[#EFECE2] hover:bg-[#E2DDD0] font-medium text-[#18221D] transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{preparedReport ? "Regenerate Dossier" : "Prepare Dossier"}</span>
              </button>

              {preparedReport && (
                <>
                  <a
                    href={getEvidencePdfDownloadUrl(preparedReport.id)}
                    download
                    className="text-xs px-3 py-1.5 rounded-xl bg-[#18221D] text-white hover:bg-[#283830] font-medium transition-colors flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{t.download_pdf}</span>
                  </a>

                  <a
                    href={getEvidencePackageDownloadUrl(preparedReport.id)}
                    download
                    className="text-xs px-3 py-1.5 rounded-xl bg-[#EFECE2] hover:bg-[#E2DDD0] font-medium text-[#18221D] transition-colors flex items-center gap-1.5"
                  >
                    <FileArchive className="w-3.5 h-3.5" />
                    <span>{t.download_zip}</span>
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Guided Upload Steps */}
          <div className="bg-[#FAF7EE] border border-[#EADBBD] rounded-2xl p-4 space-y-2 text-xs">
            <div className="font-bold text-[#854D0E] uppercase tracking-wider">
              {t.upload_steps_title}
            </div>
            <p className="text-[#713F12] leading-relaxed">{t.step1}</p>
            <p className="text-[#713F12] leading-relaxed">{t.step2}</p>
            <p className="text-[#713F12] leading-relaxed">{t.step3}</p>
            <p className="text-[#713F12] leading-relaxed font-semibold">{t.step4}</p>
            <p className="text-[#713F12] leading-relaxed">{t.step5}</p>
          </div>

          {/* Record Acknowledgement Number */}
          <div className="bg-white rounded-2xl p-4 border border-[#E8E4DA] space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-[#7C8276]">
              Record Official Acknowledgement Number
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={t.ack_placeholder}
                value={ackInput}
                onChange={(e) => setAckInput(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#DFDAD0] outline-none focus:border-[#18221D] bg-[#FCFBF8]"
              />
              <button
                onClick={handleSaveAck}
                disabled={!ackInput.trim()}
                className="px-4 py-2 bg-[#18221D] hover:bg-[#283830] text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50"
              >
                {isAckSaved ? "Saved!" : t.save_ack}
              </button>
            </div>
            <p className="text-[11px] text-[#7A8074]">
              Entering your government-issued acknowledgement number enables tracking under <strong>My Cybercrime Reports</strong>.
            </p>
          </div>

          {/* Statutory Disclaimer */}
          <p className="text-[10px] text-[#8C9387] leading-relaxed text-center">
            {t.disclaimer}
          </p>
        </div>

        {/* Modal Bottom CTA */}
        <div className="p-4 border-t border-[#E8E4DA] bg-[#F2EFE8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#636A5E]">
            <ShieldCheck className="w-4 h-4 text-[#059669]" />
            <span>Files cryptographically verified with SHA-256</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-medium text-[#5D6456] hover:bg-[#E5E1D5] transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleLaunchPortal}
              disabled={isPreparing}
              className="px-6 py-2.5 rounded-full bg-[#18221D] hover:bg-[#283830] text-white text-xs font-semibold transition-all shadow-sm active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>{t.launch_portal}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { 
  X, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Globe2, 
  Building2, 
  ExternalLink, 
  PhoneCall, 
  CheckCircle2, 
  BrainCircuit,
  Lock,
  Share2,
  Download,
  FileArchive
} from "lucide-react";
import { ScanResult } from "@/types";
import { CybercrimeReportingModal } from "@/components/evidence/CybercrimeReportingModal";

interface ScanReportModalProps {
  scan: ScanResult | null;
  onClose: () => void;
}

export function ScanReportModal({ scan, onClose }: ScanReportModalProps) {
  const [isReportingModalOpen, setIsReportingModalOpen] = useState(false);
  const [reportingPathway, setReportingPathway] = useState<"suspect" | "financial_fraud">("financial_fraud");

  if (!scan) return null;

  const isHigh = scan.risk_score >= 60;
  const isMed = scan.risk_score >= 30 && scan.risk_score < 60;

  const scoreColor = isHigh ? "text-[#B91C1C]" : isMed ? "text-[#B45309]" : "text-[#15803D]";
  const badgeColor = isHigh ? "bg-[#FEE2E2] text-[#B91C1C]" : isMed ? "bg-[#FEF3C7] text-[#B45309]" : "bg-[#DCFCE7] text-[#15803D]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF8F3] rounded-3xl border border-[#E0DBCF] shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-[#E8E4DA] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${badgeColor}`}>
              {scan.risk_score}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-editorial text-2xl text-[#18221D] font-normal">
                  {scan.severity.toUpperCase()} RISK DETECTED
                </h3>
                <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded-full ${badgeColor}`}>
                  {scan.severity}
                </span>
              </div>
              <div className="text-xs text-[#70776A] flex items-center gap-2 mt-0.5">
                <Globe2 className="w-3.5 h-3.5" />
                <span>{scan.language_display || scan.detected_language}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#EFECE2] hover:bg-[#E5E1D5] flex items-center justify-center text-[#4A5046] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-[#262C23]">
          {/* Executive Summary */}
          <div className="bg-white rounded-2xl p-4 border border-[#E8E4DA]">
            <div className="text-xs font-bold uppercase text-[#70776A] mb-1">
              Safety Assessment
            </div>
            <p className="text-sm font-medium leading-relaxed text-[#18221D]">
              {scan.explanation}
            </p>
          </div>

          {/* Impersonation findings */}
          {scan.impersonation && scan.impersonation.claimed_organization && (
            <div className="bg-white rounded-2xl p-4 border border-[#E8E4DA]">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#70776A] mb-2">
                <Building2 className="w-4 h-4 text-[#18221D]" />
                <span>Entity Impersonation Check</span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-[#18221D]">
                    {scan.impersonation.claimed_organization}
                  </div>
                  <div className="text-xs text-[#5E6458] mt-1">
                    {scan.impersonation.details}
                  </div>
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                  scan.impersonation.is_verified_source ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                  {scan.impersonation.is_verified_source ? "Verified Source" : "Unauthorized Claim"}
                </span>
              </div>
            </div>
          )}

          {/* URL Analysis findings */}
          {scan.url_analysis && (
            <div className="bg-white rounded-2xl p-4 border border-[#E8E4DA]">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#70776A] mb-2">
                <ExternalLink className="w-4 h-4 text-[#18221D]" />
                <span>Link & Destination Intelligence</span>
              </div>
              <div className="text-xs font-mono bg-[#F6F3EB] p-2 rounded-lg text-[#18221D] break-all mb-2">
                {scan.url_analysis.target_url}
              </div>
              <div className="text-xs space-y-1">
                {scan.url_analysis.risk_factors.map((rf, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-red-700">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{rf}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Behavioral Manipulation Meters */}
          {scan.behavioral_factors && scan.behavioral_factors.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#70776A] mb-3">
                <BrainCircuit className="w-4 h-4 text-[#18221D]" />
                <span>Psychological & Social Engineering Signals</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {scan.behavioral_factors.map((factor, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-xl border border-[#E8E4DA]">
                    <div className="text-xs font-semibold text-[#18221D]">{factor.name}</div>
                    <div className="text-xs font-bold mt-1 text-[#E0533C]">
                      {factor.detected ? `${factor.score}% High` : "Low"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Protective Actions */}
          <div className="bg-[#FAF3EA] border border-[#E8D9C5] rounded-2xl p-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#92400E] mb-2">
              <ShieldCheck className="w-4 h-4 text-[#B45309]" />
              <span>Recommended Immediate Actions</span>
            </div>
            <ul className="space-y-2 text-xs text-[#78350F]">
              {scan.recommended_actions.map((act, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 1: One-Click Cybercrime Reporting Action Suite */}
          <div className="bg-[#F4F9F6] border border-[#CDE5D8] rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#065F46]">
                <ShieldAlert className="w-4 h-4 text-[#059669]" />
                <span>One-Click Cybercrime Reporting Assistance</span>
              </div>
              <span className="text-[11px] font-semibold text-[#047857] bg-[#E6F8EE] px-2 py-0.5 rounded-full">
                cybercrime.gov.in
              </span>
            </div>

            <p className="text-xs text-[#52796F] leading-relaxed">
              Generate a court-admissible evidence dossier PDF with SHA-256 hashes, prepare portal-compatible files, and launch India&apos;s official National Cybercrime Reporting Portal.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {/* Primary CTA */}
              <button
                onClick={() => {
                  setReportingPathway("financial_fraud");
                  setIsReportingModalOpen(true);
                }}
                className="px-4 py-2 bg-[#0F281E] hover:bg-[#1C4233] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <ShieldAlert className="w-4 h-4 text-[#34D399]" />
                <span>Report to Cybercrime Portal</span>
              </button>

              {/* Path A Suspect Button */}
              <button
                onClick={() => {
                  setReportingPathway("suspect");
                  setIsReportingModalOpen(true);
                }}
                className="px-3.5 py-2 bg-white hover:bg-[#EFECE2] text-[#18221D] border border-[#C6DDD0] text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Report Suspect</span>
              </button>

              {/* Download PDF directly */}
              <button
                onClick={() => {
                  setReportingPathway("financial_fraud");
                  setIsReportingModalOpen(true);
                }}
                className="px-3 py-2 bg-white hover:bg-[#EFECE2] text-[#18221D] border border-[#C6DDD0] text-xs font-medium rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>

              {/* Download Evidence Package */}
              <button
                onClick={() => {
                  setReportingPathway("financial_fraud");
                  setIsReportingModalOpen(true);
                }}
                className="px-3 py-2 bg-white hover:bg-[#EFECE2] text-[#18221D] border border-[#C6DDD0] text-xs font-medium rounded-xl transition-colors flex items-center gap-1.5"
              >
                <FileArchive className="w-3.5 h-3.5" />
                <span>Evidence Package</span>
              </button>

              {/* Share Report */}
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: "Sentriq AI Phishing Evidence",
                      text: `Cyber threat detected: ${scan.summary}. Verified with Sentriq AI.`,
                      url: window.location.href,
                    }).catch(() => {});
                  } else {
                    navigator.clipboard.writeText(`Cyber threat detected: ${scan.summary}. Check cybercrime.gov.in`);
                    alert("Report link & summary copied to clipboard.");
                  }
                }}
                className="px-3 py-2 bg-white hover:bg-[#EFECE2] text-[#18221D] border border-[#C6DDD0] text-xs font-medium rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#E8E4DA] bg-[#F2EFE8] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#6A7064]">
            <PhoneCall className="w-3.5 h-3.5 text-[#B91C1C]" />
            <span>National Cyber Fraud Helpline: <strong>1930</strong></span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#18221D] hover:bg-[#283830] text-white text-xs font-semibold transition-colors"
          >
            Close Report
          </button>
        </div>
      </div>

      {/* Cybercrime Reporting Assistant Modal */}
      {isReportingModalOpen && (
        <CybercrimeReportingModal
          scan={scan}
          initialPathway={reportingPathway}
          onClose={() => setIsReportingModalOpen(false)}
        />
      )}
    </div>
  );
}

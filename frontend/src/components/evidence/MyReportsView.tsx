"use client";

import React, { useState, useEffect } from "react";
import { 
  FileCheck2, 
  Download, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  Edit3, 
  Save, 
  FileArchive,
  PhoneCall,
  Search
} from "lucide-react";
import { CybercrimeReport } from "@/types";
import { 
  fetchCybercrimeReports, 
  updateCybercrimeReportStatus, 
  getEvidencePdfDownloadUrl, 
  getEvidencePackageDownloadUrl 
} from "@/services/api";

export function MyReportsView() {
  const [reports, setReports] = useState<CybercrimeReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingAckId, setEditingAckId] = useState<string | null>(null);
  const [ackValue, setAckValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let isMounted = true;
    fetchCybercrimeReports()
      .then((data) => {
        if (isMounted) {
          setReports(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error loading reports:", err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSaveAck = async (reportId: string) => {
    if (!ackValue.trim()) return;
    await updateCybercrimeReportStatus(reportId, "Acknowledgement Recorded", ackValue.trim());
    setEditingAckId(null);
    setAckValue("");
    await loadReports();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Acknowledgement Recorded":
        return "bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]";
      case "User Marked as Submitted":
        return "bg-[#DBEAFE] text-[#1E40AF] border-[#BFDBFE]";
      case "Downloaded":
        return "bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]";
      case "Report Prepared":
      default:
        return "bg-[#F3F4F6] text-[#374151] border-[#E5E7EB]";
    }
  };

  const filteredReports = reports.filter((r) =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.official_acknowledgement_number && r.official_acknowledgement_number.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold tracking-widest text-[#7C8276] uppercase mb-1">
            CITIZEN CASE DOCKET
          </div>
          <h1 className="font-editorial text-3xl md:text-4xl text-[#18221D] font-normal">
            My Cybercrime Reports
          </h1>
          <p className="text-sm text-[#676E61] mt-1">
            Track prepared evidence packages, official portal submissions, and government acknowledgement numbers.
          </p>
        </div>

        {/* 1930 Emergency Badge */}
        <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-2xl px-4 py-2.5 flex items-center gap-3 shrink-0">
          <PhoneCall className="w-4 h-4 text-[#EF4444]" />
          <div>
            <div className="text-[11px] font-bold text-[#991B1B] uppercase">National Cyber Helpline</div>
            <div className="text-xs font-semibold text-[#B91C1C]">Dial 1930 (Toll-Free 24x7)</div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#8C9387] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by Report ID, suspect entity, or Acknowledgement Number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white rounded-2xl border border-[#DFDAD0] outline-none focus:border-[#18221D] shadow-sm"
        />
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12 text-sm text-[#787F73]">Loading your evidence docket...</div>
        ) : filteredReports.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-[#DFDAD0] space-y-3">
            <FileCheck2 className="w-10 h-10 text-[#A0A69A] mx-auto" />
            <h3 className="font-editorial text-xl text-[#18221D]">No Prepared Reports Yet</h3>
            <p className="text-xs text-[#6E756B] max-w-md mx-auto">
              Scan a suspicious message, link, or screenshot in Sentriq AI, then click &ldquo;Report to Cybercrime Portal&rdquo; to prepare a formal evidence dossier.
            </p>
          </div>
        ) : (
          filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8E4DA] shadow-sm hover:border-[#CCC6B6] transition-all space-y-4"
            >
              {/* Card Top Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F2EEE4] pb-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-[#18221D] bg-[#F4F1E8] px-2.5 py-1 rounded-lg border border-[#E5E1D5]">
                    {report.id}
                  </span>
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getStatusBadge(report.status)}`}>
                    {report.status}
                  </span>
                  <span className="text-xs text-[#7A8074] capitalize">
                    {report.reporting_pathway === "suspect" ? "Path A (Suspect Report)" : "Path B (Financial Cybercrime)"}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#7A8074]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(report.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Title & Case Description */}
              <div>
                <h3 className="font-editorial text-xl sm:text-2xl text-[#18221D] font-normal mb-1">
                  {report.title}
                </h3>
                <p className="text-xs text-[#5D6357]">
                  Category: <strong className="text-[#18221D]">{report.recommended_category}</strong>
                </p>
              </div>

              {/* Acknowledgement Number Tracking Section */}
              <div className="bg-[#FAF8F3] rounded-2xl p-3.5 border border-[#EADBBD]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs">
                  <span className="text-[#7C8276] font-medium block mb-0.5">Official Government Acknowledgement:</span>
                  {editingAckId === report.id ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        placeholder="e.g. 2026/CYBER/IN/94821"
                        value={ackValue}
                        onChange={(e) => setAckValue(e.target.value)}
                        className="px-2.5 py-1 text-xs rounded-lg border border-[#CCC2B0] bg-white outline-none"
                      />
                      <button
                        onClick={() => handleSaveAck(report.id)}
                        className="px-3 py-1 bg-[#18221D] text-white text-xs font-semibold rounded-lg hover:bg-[#283830]"
                      >
                        <Save className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : report.official_acknowledgement_number ? (
                    <div className="flex items-center gap-2 font-mono font-bold text-[#059669]">
                      <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                      <span>{report.official_acknowledgement_number}</span>
                      <button
                        onClick={() => {
                          setEditingAckId(report.id);
                          setAckValue(report.official_acknowledgement_number || "");
                        }}
                        className="text-[#7C8276] hover:text-[#18221D] ml-1"
                        title="Edit acknowledgement number"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-[#9A7B38]">
                      <span>Not recorded yet.</span>
                      <button
                        onClick={() => {
                          setEditingAckId(report.id);
                          setAckValue("");
                        }}
                        className="text-xs font-semibold text-[#18221D] underline hover:no-underline"
                      >
                        Enter Government Ack No.
                      </button>
                    </div>
                  )}
                </div>

                {/* Evidence Hashes preview */}
                <div className="text-[10px] text-[#7A8074] font-mono sm:text-right">
                  Manifest SHA-256: {report.manifest_sha256?.slice(0, 16)}...
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={getEvidencePdfDownloadUrl(report.id)}
                    download
                    className="text-xs px-3.5 py-1.5 rounded-xl bg-[#18221D] text-white hover:bg-[#283830] font-medium transition-colors flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </a>

                  <a
                    href={getEvidencePackageDownloadUrl(report.id)}
                    download
                    className="text-xs px-3.5 py-1.5 rounded-xl bg-[#EFECE2] hover:bg-[#E5E1D5] text-[#18221D] font-medium transition-colors flex items-center gap-1.5 border border-[#DDD7C8]"
                  >
                    <FileArchive className="w-3.5 h-3.5" />
                    <span>Evidence ZIP</span>
                  </a>
                </div>

                <a
                  href={report.portal_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-[#18221D] hover:text-[#059669] flex items-center gap-1.5 transition-colors"
                >
                  <span>Open cybercrime.gov.in</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

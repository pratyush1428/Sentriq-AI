"use client";

import React, { useSyncExternalStore } from "react";
import { ChevronRight, Clock, ArrowRight } from "lucide-react";
import { ScanResult } from "@/types";

interface RecentActivityProps {
  scans: ScanResult[];
  onSelectScan: (scan: ScanResult) => void;
  onViewAll: () => void;
}

const subscribeTime = (callback: () => void) => {
  const timer = setInterval(callback, 30000);
  return () => clearInterval(timer);
};
const getTimeSnapshot = () => Date.now();
const getServerSnapshot = () => 0;

export function RecentActivity({ scans, onSelectScan, onViewAll }: RecentActivityProps) {
  const now = useSyncExternalStore(subscribeTime, getTimeSnapshot, getServerSnapshot);

  const formatTimeAgo = (dateStr: string) => {
    if (!now) return "recently";
    try {
      const diffMs = now - new Date(dateStr).getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      if (diffMins < 60) return `${Math.max(1, diffMins)} min ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${Math.floor(diffHours / 24)}d ago`;
    } catch {
      return "recently";
    }
  };

  return (
    <div className="pt-2">
      {/* Activity Header matching photo */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <div className="text-[11px] font-bold tracking-widest text-[#7C8276] uppercase mb-1">
            YOUR ACTIVITY
          </div>
          <h2 className="font-editorial text-2xl md:text-3xl text-[#18221D] font-normal">
            Recent checks
          </h2>
        </div>
        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-xs md:text-sm font-semibold text-[#18221D] hover:text-[#0F281E] transition-colors"
        >
          <span>View all</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* List of check rows matching photo */}
      <div className="space-y-2.5">
        {scans.slice(0, 5).map((scan) => {
          const isHigh = scan.risk_score >= 60;
          const isMed = scan.risk_score >= 30 && scan.risk_score < 60;

          const badgeBg = isHigh
            ? "bg-[#FEE2E2] text-[#B91C1C]"
            : isMed
            ? "bg-[#FEF3C7] text-[#B45309]"
            : "bg-[#DCFCE7] text-[#15803D]";

          const riskLabel = isHigh ? "High risk" : isMed ? "Medium risk" : "Low risk";

          return (
            <div
              key={scan.id}
              onClick={() => onSelectScan(scan)}
              className="bg-white rounded-2xl p-4 border border-[#E8E4DA] flex items-center justify-between gap-4 hover:border-[#CCC6B6] hover:shadow-sm transition-all cursor-pointer group"
            >
              {/* Score circle & details */}
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Round score badge matching photo */}
                <div
                  className={`w-11 h-11 rounded-full shrink-0 flex items-center justify-center font-bold text-sm ${badgeBg}`}
                >
                  {scan.risk_score}
                </div>

                {/* Subtitle & text preview */}
                <div className="min-w-0">
                  <div className="text-[11px] text-[#787F73] font-medium capitalize">
                    {scan.scan_type === "text" ? "SMS message" : `${scan.scan_type} check`}
                  </div>
                  <div className="text-sm font-medium text-[#18221D] truncate max-w-xs md:max-w-md group-hover:text-[#0F281E]">
                    {scan.raw_content_preview || scan.summary}
                  </div>
                </div>
              </div>

              {/* Timestamp, risk pill & chevron */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="hidden sm:flex items-center gap-1 text-xs text-[#787F73]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatTimeAgo(scan.created_at)}</span>
                </div>

                <div className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badgeBg}`}>
                  {riskLabel}
                </div>

                <ChevronRight className="w-4 h-4 text-[#A1A79A] group-hover:text-[#18221D] transition-colors" />
              </div>
            </div>
          );
        })}

        {scans.length === 0 && (
          <div className="text-center py-8 text-sm text-[#787F73] bg-white rounded-2xl border border-dashed border-[#DFDAD0]">
            No recent scans. Submit a message above to run your first check.
          </div>
        )}
      </div>
    </div>
  );
}

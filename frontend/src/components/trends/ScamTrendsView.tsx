"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { RegionalTrendItem } from "@/types";

interface ScamTrendsViewProps {
  trends: RegionalTrendItem[];
}

export function ScamTrendsView({ trends }: ScamTrendsViewProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>("All");

  const regions = ["All", "Chennai", "Delhi NCR", "Bengaluru", "Mumbai"];

  const filteredTrends = selectedRegion === "All"
    ? trends
    : trends.filter(t => t.region.toLowerCase().includes(selectedRegion.toLowerCase()));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold tracking-widest text-[#7C8276] uppercase mb-1">
            REGIONAL THREAT RADAR
          </div>
          <h1 className="font-editorial text-3xl md:text-4xl text-[#18221D] font-normal">
            Scam Trends in India
          </h1>
          <p className="text-sm text-[#676E61] mt-1">
            Aggregated patterns from verified citizen reports, CERT-In advisories, and state cyber command feeds.
          </p>
        </div>

        {/* Region filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {regions.map((reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-colors shrink-0 ${
                selectedRegion === reg
                  ? "bg-[#18221D] text-white font-semibold"
                  : "bg-[#EFECE2] text-[#4F554B] hover:bg-[#E5E1D5]"
              }`}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of regional scam cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTrends.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-6 border border-[#E8E4DA] shadow-sm hover:border-[#CCC6B6] transition-all space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#059669] bg-[#E6F8EE] px-2.5 py-1 rounded-full">
                <MapPin className="w-3.5 h-3.5" />
                <span>{item.region} · {item.period}</span>
              </div>
              <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                {item.change_percentage} surging
              </span>
            </div>

            <div>
              <h3 className="font-editorial text-2xl text-[#18221D] font-normal leading-snug mb-2">
                {item.title}
              </h3>
              <p className="text-xs md:text-sm text-[#5D6357] leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="pt-2 border-t border-[#F2EEE4] flex items-center justify-between text-xs text-[#7A8074]">
              <span>Category: <strong className="text-[#18221D]">{item.category}</strong></span>
              <span>Source: <strong className="text-[#18221D]">{item.source}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

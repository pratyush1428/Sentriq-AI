"use client";

import React from "react";
import { AlertTriangle, ArrowRight, BookOpen, ShieldAlert } from "lucide-react";
import { RegionalTrendItem } from "@/types";

interface RightRailAlertProps {
  trend?: RegionalTrendItem;
  onExploreTrend: () => void;
  onOpenSafetyGuide: () => void;
}

export function RightRailAlert({ trend, onExploreTrend, onOpenSafetyGuide }: RightRailAlertProps) {
  const currentRegion = trend?.region?.toUpperCase() || "CHENNAI";
  const currentPeriod = trend?.period?.toUpperCase() || "THIS WEEK";
  const title = trend?.title || "Fake electricity bill messages are surging";
  const description = trend?.description || "Reports are up 38%. Scammers are threatening same-day power cuts to create panic.";

  return (
    <div className="space-y-6">
      {/* Deep Forest Green Radar Alert Card matching the reference image */}
      <div 
        onClick={onExploreTrend}
        className="bg-[#0F281E] rounded-3xl p-6 md:p-7 text-white relative overflow-hidden border border-[#1C4233] shadow-md cursor-pointer group transition-transform hover:-translate-y-0.5"
      >
        {/* Radar concentric circle watermark graphic */}
        <div className="absolute right-4 top-4 w-40 h-40 pointer-events-none opacity-20">
          <div className="absolute inset-0 rounded-full border border-[#4ADE80]" />
          <div className="absolute inset-4 rounded-full border border-[#4ADE80]" />
          <div className="absolute inset-8 rounded-full border border-[#4ADE80]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1 h-full bg-[#4ADE80]/30 transform rotate-45" />
            <div className="w-full h-1 bg-[#4ADE80]/30 transform rotate-45 absolute" />
          </div>
        </div>

        {/* Warning Badge */}
        <div className="relative z-10 mb-6">
          <div className="w-9 h-9 rounded-full bg-[#1A382C] border border-[#2B5443] flex items-center justify-center text-[#F59E0B]">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>

        {/* Region & Period Subtitle */}
        <div className="relative z-10 text-[11px] font-bold tracking-widest text-[#6EE7B7] uppercase mb-2">
          {currentRegion} · {currentPeriod}
        </div>

        {/* Main Title */}
        <h2 className="relative z-10 font-editorial text-2xl md:text-3xl text-white font-normal leading-snug mb-3">
          {title}
        </h2>

        {/* Description */}
        <p className="relative z-10 text-xs md:text-sm text-[#A7D9C4] leading-relaxed mb-6 font-normal">
          {description}
        </p>

        {/* Link matching photo */}
        <div className="relative z-10 flex items-center gap-1.5 text-xs md:text-sm font-semibold text-white group-hover:text-[#6EE7B7] transition-colors">
          <span>See what to watch for</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>

      {/* 60-Second Safety Card matching photo */}
      <div 
        onClick={onOpenSafetyGuide}
        className="bg-[#EFECE2] rounded-3xl p-6 border border-[#E0DBCF] cursor-pointer hover:bg-[#EAE5D9] transition-colors group"
      >
        <div className="flex items-center gap-2 mb-2 text-[#686F63]">
          <BookOpen className="w-4 h-4 text-[#474D43]" />
          <span className="text-[11px] font-bold tracking-wider uppercase">
            60-SECOND SAFETY
          </span>
        </div>
        <h3 className="font-editorial text-xl text-[#18221D] font-normal mb-1.5 group-hover:text-[#0F281E] transition-colors">
          Why scammers create urgency
        </h3>
        <p className="text-xs text-[#636A5E] leading-relaxed">
          Learn the small pause that can protect your money.
        </p>
      </div>
    </div>
  );
}

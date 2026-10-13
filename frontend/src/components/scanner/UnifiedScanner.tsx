"use client";

import React, { useState } from "react";
import { 
  MessageSquare, 
  Link as LinkIcon, 
  QrCode, 
  Mic, 
  Image as ImageIcon,
  ShieldCheck, 
  Globe2, 
  Sparkles, 
  ArrowRight,
  Loader2,
  UploadCloud
} from "lucide-react";
import { scanText, scanUrl, scanImageFile, scanQrFile } from "@/services/api";
import { ScanResult } from "@/types";

interface UnifiedScannerProps {
  onScanComplete: (result: ScanResult) => void;
}

export function UnifiedScanner({ onScanComplete }: UnifiedScannerProps) {
  const [activeTab, setActiveTab] = useState<"message" | "link" | "qr" | "voice" | "screenshot">("message");
  const [inputText, setInputText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Quick preset samples for instant testing
  const presets = [
    {
      label: "Tanglish KYC Alert",
      text: "Unga account block aagidum innaikku. Ippo udane KYC update pannunga http://sbi-kyc-verify.online",
    },
    {
      label: "Chennai Electricity Threat",
      text: "Dear consumer, your electricity power will be disconnected tonight at 9:30 PM due to unpaid EB bill. Call officer at 9840192831 immediately.",
    },
    {
      label: "Hinglish Lottery Fraud",
      text: "Badhaai ho! Aapne jeeta hai 25 Lakh ka KBC lottery inaam. Turant registration fee bhejo aur apna inaam claim karein.",
    },
    {
      label: "Safe Delivery SMS",
      text: "Your Amazon delivery package #4928 is out for delivery today with courier partner. No OTP required upon arrival.",
    },
  ];

  const handleAnalyze = async () => {
    setErrorMsg(null);

    if (activeTab === "message" || activeTab === "link") {
      if (!inputText.trim()) {
        setErrorMsg("Please enter text or a link to analyze.");
        return;
      }
    }

    setIsLoading(true);

    try {
      let result: ScanResult;
      if (activeTab === "message") {
        result = await scanText(inputText);
      } else if (activeTab === "link") {
        result = await scanUrl(inputText);
      } else if (activeTab === "qr" && selectedFile) {
        result = await scanQrFile(selectedFile);
      } else if (activeTab === "screenshot" && selectedFile) {
        result = await scanImageFile(selectedFile);
      } else {
        // Fallback or demo simulation
        result = await scanText(inputText || "Sample voice recording text analyzed: Urgent KYC update required.");
      }
      onScanComplete(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to analyze. Please try again.";
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF8F3] rounded-3xl p-6 md:p-8 border border-[#E8E4DA] shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      {/* Top Header Row matching photo */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] font-bold tracking-widest text-[#7C8276] uppercase">
          CHECK BEFORE YOU TRUST
        </span>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5F7ED] border border-[#C6ECD4] text-[#166534] text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
          <span>Private by design</span>
        </div>
      </div>

      {/* Main Serif Headline */}
      <h1 className="font-editorial text-3xl md:text-4xl text-[#18221D] font-normal tracking-tight mb-6">
        What would you like us to look at?
      </h1>

      {/* Tabs Row matching photo */}
      <div className="flex items-center gap-6 border-b border-[#E8E4DA] pb-2 mb-5 overflow-x-auto text-sm">
        <button
          onClick={() => setActiveTab("message")}
          className={`flex items-center gap-2 pb-2 font-medium transition-all relative ${
            activeTab === "message"
              ? "text-[#18221D] font-semibold after:content-[''] after:absolute after:bottom-[-9px] after:left-0 after:right-0 after:h-[2px] after:bg-[#E0533C]"
              : "text-[#6B7266] hover:text-[#18221D]"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Message</span>
        </button>

        <button
          onClick={() => setActiveTab("link")}
          className={`flex items-center gap-2 pb-2 font-medium transition-all relative ${
            activeTab === "link"
              ? "text-[#18221D] font-semibold after:content-[''] after:absolute after:bottom-[-9px] after:left-0 after:right-0 after:h-[2px] after:bg-[#E0533C]"
              : "text-[#6B7266] hover:text-[#18221D]"
          }`}
        >
          <LinkIcon className="w-4 h-4" />
          <span>Link</span>
        </button>

        <button
          onClick={() => setActiveTab("qr")}
          className={`flex items-center gap-2 pb-2 font-medium transition-all relative ${
            activeTab === "qr"
              ? "text-[#18221D] font-semibold after:content-[''] after:absolute after:bottom-[-9px] after:left-0 after:right-0 after:h-[2px] after:bg-[#E0533C]"
              : "text-[#6B7266] hover:text-[#18221D]"
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>QR code</span>
        </button>

        <button
          onClick={() => setActiveTab("voice")}
          className={`flex items-center gap-2 pb-2 font-medium transition-all relative ${
            activeTab === "voice"
              ? "text-[#18221D] font-semibold after:content-[''] after:absolute after:bottom-[-9px] after:left-0 after:right-0 after:h-[2px] after:bg-[#E0533C]"
              : "text-[#6B7266] hover:text-[#18221D]"
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>Voice</span>
        </button>

        <button
          onClick={() => setActiveTab("screenshot")}
          className={`flex items-center gap-2 pb-2 font-medium transition-all relative ${
            activeTab === "screenshot"
              ? "text-[#18221D] font-semibold after:content-[''] after:absolute after:bottom-[-9px] after:left-0 after:right-0 after:h-[2px] after:bg-[#E0533C]"
              : "text-[#6B7266] hover:text-[#18221D]"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Screenshot</span>
        </button>
      </div>

      {/* Input Box Card matching photo */}
      <div className="bg-white rounded-2xl border border-[#DFDAD0] p-4 shadow-sm focus-within:border-[#B5AEA0] transition-colors mb-4">
        {activeTab === "message" || activeTab === "link" ? (
          <div>
            <textarea
              rows={5}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                activeTab === "link"
                  ? "Enter or paste a suspicious link here (e.g. http://sbi-kyc-verify.online)..."
                  : "Paste a suspicious message here — any language is welcome.\n\nExample: Your bank account will be blocked today. Verify your KYC now..."
              }
              className="w-full resize-none outline-none text-[#18221D] placeholder:text-[#A0A69A] text-sm md:text-base leading-relaxed bg-transparent"
              maxLength={2000}
            />
            {/* Box Footer inside Card */}
            <div className="flex items-center justify-between pt-3 border-t border-[#F0EBE0] text-xs text-[#7B8276]">
              <div className="flex items-center gap-1.5 bg-[#F6F3EB] px-2.5 py-1 rounded-full text-[#4E544A] font-medium border border-[#E7E2D6]">
                <Globe2 className="w-3.5 h-3.5" />
                <span>Auto-detect</span>
              </div>
              <span>{inputText.length} / 2,000</span>
            </div>
          </div>
        ) : (
          /* File Upload area for Screenshot / QR / Voice */
          <div className="py-6 px-4 flex flex-col items-center justify-center text-center border-2 border-dashed border-[#DFDAD0] rounded-xl hover:bg-[#FAF8F5] transition-colors cursor-pointer">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setSelectedFile(e.target.files[0]);
                }
              }}
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
              <UploadCloud className="w-8 h-8 text-[#6B7266] mb-2" />
              <span className="text-sm font-semibold text-[#18221D]">
                {selectedFile ? selectedFile.name : `Select ${activeTab} file to analyze`}
              </span>
              <span className="text-xs text-[#7B8276] mt-1">
                Supports PNG, JPG, WebP, MP3, WAV (Max 10 MB)
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Preset sample pills */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-xs text-[#7B8276] font-medium mr-1">Try example:</span>
        {presets.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => {
              setActiveTab("message");
              setInputText(preset.text);
            }}
            className="text-xs bg-[#EFECE3] hover:bg-[#E3DFD4] text-[#3D4238] font-medium px-3 py-1.5 rounded-full transition-colors border border-[#DDD7C8]"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
          {errorMsg}
        </div>
      )}

      {/* Footer bar matching photo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2 text-xs md:text-sm text-[#5D6357]">
          <Sparkles className="w-4 h-4 text-[#E0533C] shrink-0" />
          <span>Understands English, தமிழ், हिंदी, Tanglish & more</span>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={isLoading}
          className="flex items-center justify-center gap-2.5 bg-[#18221D] hover:bg-[#283830] text-white text-sm font-medium px-6 py-3 rounded-full transition-all shadow-sm active:scale-95 disabled:opacity-60 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing threat...</span>
            </>
          ) : (
            <>
              <span>Check for scam</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

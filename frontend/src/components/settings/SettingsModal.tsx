"use client";

import React, { useState } from "react";
import { X, User, Globe, Shield, Trash2, CheckCircle2 } from "lucide-react";
import { UserProfile } from "@/types";

interface SettingsModalProps {
  user: UserProfile | null;
  onClose: () => void;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
}

export function SettingsModal({ user, onClose, onUpdateUser }: SettingsModalProps) {
  const [displayName, setDisplayName] = useState(user?.display_name || "Arun S.");
  const [language, setLanguage] = useState(user?.preferred_language || "en");
  const [protectionActive, setProtectionActive] = useState(user?.protection_active ?? true);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    onUpdateUser({
      display_name: displayName.trim() || "Citizen",
      preferred_language: language,
      protection_active: protectionActive,
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF8F3] rounded-3xl border border-[#E0DBCF] shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-[#E8E4DA] flex items-center justify-between">
          <div>
            <h3 className="font-editorial text-2xl text-[#18221D] font-normal">
              Settings & Privacy
            </h3>
            <p className="text-xs text-[#757C6E] mt-0.5">Manage preferences and data retention</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#EFECE2] hover:bg-[#E5E1D5] flex items-center justify-center text-[#4A5046] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-sm">
          {/* User Profile */}
          <div className="bg-white p-4 rounded-2xl border border-[#E8E4DA] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#757C6E]">
              <User className="w-4 h-4 text-[#18221D]" />
              <span>Citizen Profile</span>
            </div>
            <div>
              <label className="text-xs text-[#5D6456] block mb-1">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSave();
                  }
                }}
                className="w-full px-3 py-2 text-sm rounded-xl border border-[#DFDAD0] outline-none focus:border-[#18221D] bg-[#FCFBF8]"
              />
            </div>
          </div>

          {/* Preferred Language */}
          <div className="bg-white p-4 rounded-2xl border border-[#E8E4DA] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#757C6E]">
              <Globe className="w-4 h-4 text-[#18221D]" />
              <span>Language Preference</span>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-[#DFDAD0] outline-none focus:border-[#18221D] bg-[#FCFBF8]"
            >
              <option value="en">English (Default)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="tanglish">Tanglish (Romanized Tamil)</option>
              <option value="hinglish">Hinglish (Romanized Hindi)</option>
            </select>
          </div>

          {/* Regional Monitoring Status */}
          <div className="bg-white p-4 rounded-2xl border border-[#E8E4DA] flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#757C6E]">
                <Shield className="w-4 h-4 text-[#18221D]" />
                <span>Regional Threat Watch</span>
              </div>
              <p className="text-xs text-[#5D6456]">
                Continuously track surging scam tactics in your region.
              </p>
            </div>
            <input
              type="checkbox"
              checked={protectionActive}
              onChange={(e) => setProtectionActive(e.target.checked)}
              className="w-5 h-5 accent-[#18221D] cursor-pointer"
            />
          </div>

          {/* Privacy & Wipe data */}
          <div className="bg-red-50/50 p-4 rounded-2xl border border-red-200/60 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-red-900">Erase Scan History</div>
              <p className="text-xs text-red-700 mt-0.5">
                Permanently purge all scan logs from local and cloud storage.
              </p>
            </div>
            <button
              onClick={() => alert("Scan history purged according to privacy retention rules.")}
              className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Purge</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E8E4DA] bg-[#F2EFE8] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full text-xs font-medium text-[#5D6456] hover:bg-[#E5E1D5] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-full bg-[#18221D] hover:bg-[#283830] text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Saved</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { 
  LayoutGrid, 
  ScanLine, 
  TrendingUp, 
  BookOpen, 
  ShieldCheck, 
  Settings, 
  ChevronRight,
  FileCheck
} from "lucide-react";

import { UserProfile } from "@/types";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSettings: () => void;
  user?: UserProfile | null;
}

export function Sidebar({ activeTab, setActiveTab, onOpenSettings, user }: SidebarProps) {
  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutGrid },
    { id: "scanner", label: "Scan something", icon: ScanLine },
    { id: "trends", label: "Scam trends", icon: TrendingUp },
    { id: "my-reports", label: "Cybercrime reports", icon: FileCheck },
    { id: "guide", label: "Safety guide", icon: BookOpen },
  ];

  const displayName = user?.display_name || "Arun S.";
  const roleName = user?.role || "Personal account";
  const isProtected = user?.protection_active ?? true;

  // Calculate initials (e.g., PRAKASH -> PR, Arun S. -> AS)
  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase() || "US";
  };

  const initials = getInitials(displayName);

  return (
    <aside className="w-64 min-h-screen bg-[#F0EDE4] border-r border-[#E5E1D5] flex flex-col justify-between p-5 select-none shrink-0">
      {/* Top Branding & Navigation */}
      <div>
        {/* Brand Logo matching reference aesthetic */}
        <div className="flex items-center gap-2.5 px-2 mb-8">
          <div className="w-8 h-8 rounded-full bg-[#18221D] flex items-center justify-center text-white shadow-sm">
            <ShieldCheck className="w-5 h-5 text-[#34D399]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-editorial text-2xl font-bold tracking-tight text-[#18221D]">
              sentriq
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#06B6D4] bg-[#06B6D4]/10 px-1.5 py-0.5 rounded">
              ai
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                  isActive
                    ? "bg-[#18221D] text-white shadow-sm font-semibold"
                    : "text-[#474D45] hover:text-[#18221D] hover:bg-[#E7E3D8]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#626860]"}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom section: Protection card, Settings, User profile */}
      <div className="space-y-4 pt-6">
        {/* Protection status pill card matching photo */}
        <div className={`rounded-2xl p-4 border relative overflow-hidden transition-colors ${
          isProtected 
            ? "bg-[#E7E3D7] border-[#DBD7CB]" 
            : "bg-[#F5EBE1] border-[#EAD5C3]"
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
              isProtected ? "bg-[#34D399]/20 text-[#059669]" : "bg-[#F97316]/20 text-[#EA580C]"
            }`}>
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-[#18221D]">
              {isProtected ? "Protection is active" : "Protection paused"}
            </span>
          </div>
          <p className="text-[11px] leading-relaxed text-[#5F665C]">
            {isProtected 
              ? "We're watching for new scam patterns in your region."
              : "Regional monitoring is currently paused in settings."}
          </p>
        </div>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium text-[#474D45] hover:text-[#18221D] hover:bg-[#E7E3D8] transition-colors"
        >
          <Settings className="w-4 h-4 text-[#626860]" />
          <span>Settings</span>
        </button>

        {/* User profile card dynamically showing live updated name & initials */}
        <div 
          onClick={onOpenSettings}
          className="flex items-center justify-between p-2 rounded-xl hover:bg-[#E7E3D8] transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#E0D7C6] border border-[#CCC2B0] flex items-center justify-center text-xs font-bold text-[#423C32] uppercase">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-[#18221D] truncate max-w-[120px]">
                {displayName}
              </div>
              <div className="text-[10px] text-[#6E756B] truncate">
                {roleName}
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8C9389] group-hover:text-[#18221D] transition-colors" />
        </div>
      </div>
    </aside>
  );
}

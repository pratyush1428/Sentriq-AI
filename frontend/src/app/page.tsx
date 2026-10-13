"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { UnifiedScanner } from "@/components/scanner/UnifiedScanner";
import { RightRailAlert } from "@/components/dashboard/RightRailAlert";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { ScanReportModal } from "@/components/reports/ScanReportModal";
import { ScamTrendsView } from "@/components/trends/ScamTrendsView";
import { SafetyGuideView } from "@/components/guide/SafetyGuideView";
import { MyReportsView } from "@/components/evidence/MyReportsView";
import { SettingsModal } from "@/components/settings/SettingsModal";
import { fetchRecentScans, fetchRegionalTrends, fetchCurrentUser, updateUserProfile } from "@/services/api";
import { ScanResult, RegionalTrendItem, UserProfile } from "@/types";

export default function SentriqDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [trends, setTrends] = useState<RegionalTrendItem[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [selectedScan, setSelectedScan] = useState<ScanResult | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    async function loadInitialData() {
      const [scansData, trendsData, userData] = await Promise.all([
        fetchRecentScans(),
        fetchRegionalTrends(),
        fetchCurrentUser(),
      ]);
      setScans(scansData);
      setTrends(trendsData);
      setUser(userData);
    }
    loadInitialData();
  }, []);

  const handleScanComplete = (newScan: ScanResult) => {
    setScans((prev) => [newScan, ...prev]);
    setSelectedScan(newScan); // Instantly open detailed explainable report
  };

  const handleUpdateUser = async (updated: Partial<UserProfile>) => {
    // Immediately update local state for responsive UI
    if (user) {
      setUser({ ...user, ...updated });
    }
    // Persist to backend and localStorage
    const saved = await updateUserProfile(updated);
    setUser(saved);
  };

  return (
    <div className="min-h-screen bg-[#F6F4EE] flex text-[#18221D]">
      {/* Sidebar dynamically displaying user profile */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        user={user}
      />

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen p-6 md:p-10 max-w-7xl mx-auto overflow-y-auto">
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Top Grid: Scanner on Left, Alert Cards on Right (Matches Photo) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: What would you like us to look at? */}
              <div className="lg:col-span-7 xl:col-span-8">
                <UnifiedScanner onScanComplete={handleScanComplete} />
              </div>

              {/* Right Column: Deep Forest Green Alert Card + 60s Safety */}
              <div className="lg:col-span-5 xl:col-span-4">
                <RightRailAlert
                  trend={trends[0]}
                  onExploreTrend={() => setActiveTab("trends")}
                  onOpenSafetyGuide={() => setActiveTab("guide")}
                />
              </div>
            </div>

            {/* Bottom Section: Recent checks activity matching photo */}
            <div className="max-w-4xl">
              <RecentActivity
                scans={scans}
                onSelectScan={(scan) => setSelectedScan(scan)}
                onViewAll={() => setActiveTab("scanner")}
              />
            </div>
          </div>
        )}

        {activeTab === "scanner" && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
            <UnifiedScanner onScanComplete={handleScanComplete} />
            <RecentActivity
              scans={scans}
              onSelectScan={(scan) => setSelectedScan(scan)}
              onViewAll={() => {}}
            />
          </div>
        )}

        {activeTab === "trends" && (
          <ScamTrendsView trends={trends} />
        )}

        {activeTab === "my-reports" && (
          <MyReportsView />
        )}

        {activeTab === "guide" && (
          <SafetyGuideView />
        )}
      </main>

      {/* Detailed Analysis Report Modal */}
      <ScanReportModal
        scan={selectedScan}
        onClose={() => setSelectedScan(null)}
      />

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          user={user}
          onClose={() => setIsSettingsOpen(false)}
          onUpdateUser={handleUpdateUser}
        />
      )}
    </div>
  );
}

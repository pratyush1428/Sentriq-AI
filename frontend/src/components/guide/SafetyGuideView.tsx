"use client";

import React from "react";
import { BookOpen, ShieldCheck, PhoneCall, AlertOctagon, CheckCircle2, Lock } from "lucide-react";

export function SafetyGuideView() {
  const guides = [
    {
      title: "The 60-Second Rule: Why Scammers Create Urgency",
      subtitle: "The small pause that protects your life savings",
      badge: "Fundamental Rule",
      points: [
        "Every major fraud script relies on artificial urgency ('Account blocked today', 'Power cut tonight at 9:30 PM', 'Arrest warrant issued').",
        "Urgency disables your rational brain and triggers fight-or-flight panic.",
        "Take a mandatory 60-second breath. Genuine banks never give 15-minute deadlines to prevent suspension.",
        "Call the institution directly from a phone number on the back of your debit card or official bill."
      ]
    },
    {
      title: "The Golden Hour Cyber Defense Protocol",
      subtitle: "Immediate emergency steps if money was deducted",
      badge: "Emergency Protocol",
      points: [
        "Dial 1930 immediately: The National Cyber Crime Helpline can freeze scammer bank accounts if contacted within 2 hours.",
        "File an incident report at cybercrime.gov.in and note down your acknowledgement number.",
        "Lock your debit card, credit card, and Net Banking credentials via your bank's official emergency toll-free number.",
        "Never contact unknown recovery agents on Telegram or Instagram who promise to recover lost money."
      ]
    },
    {
      title: "Regional Tanglish & Hinglish Red Flags",
      subtitle: "Recognizing romanized fraud phrases",
      badge: "Language Awareness",
      points: [
        "Tanglish: 'EB bill kattala current cut aagum', 'Unga account block aagidum', 'Ippo udane KYC update pannunga panam anupunga'.",
        "Hinglish: 'Aapka account freeze ho gaya hai', 'Turant OTP share karein', 'Line kaat di jayegi'.",
        "Official Indian banks and public utilities never send administrative warnings in romanized slang."
      ]
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <div className="text-[11px] font-bold tracking-widest text-[#7C8276] uppercase mb-1">
          CITIZEN DEFENSE ACADEMY
        </div>
        <h1 className="font-editorial text-3xl md:text-4xl text-[#18221D] font-normal">
          Safety Guide & Scam Defense
        </h1>
        <p className="text-sm text-[#676E61] mt-1">
          Evidence-based strategies to recognize social engineering, fake KYC, and digital fraud attempts.
        </p>
      </div>

      <div className="space-y-5">
        {guides.map((g, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl p-6 md:p-7 border border-[#E8E4DA] shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#18221D] bg-[#F2EFE8] px-3 py-1 rounded-full border border-[#DFDAD0]">
                {g.badge}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-[#059669] font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Defense</span>
              </div>
            </div>

            <div>
              <h2 className="font-editorial text-2xl text-[#18221D] font-normal mb-1">
                {g.title}
              </h2>
              <p className="text-xs text-[#757C6F] font-medium">{g.subtitle}</p>
            </div>

            <ul className="space-y-2.5 pt-2">
              {g.points.map((pt, pIdx) => (
                <li key={pIdx} className="flex items-start gap-2.5 text-xs md:text-sm text-[#3E443A] leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

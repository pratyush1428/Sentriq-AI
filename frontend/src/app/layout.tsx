import type { Metadata } from "next";
import { Geist, Newsreader } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-editorial",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Sentriq AI — Multilingual Fraud & Phishing Detection",
  description: "Intelligence Behind Every Defense. Detect suspicious messages, fake bank alerts, KYC warnings, power cut threats, and scam URLs across English, Tamil, Hindi, Tanglish, and Hinglish.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${newsreader.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased selection:bg-[#E2DDD0]">
        {children}
      </body>
    </html>
  );
}

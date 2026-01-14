import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SnapDemo – Record, Trim & Share",
  description: "Record your screen, trim videos, and share instantly.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        suppressHydrationWarning
        className={`
          ${geistSans.variable} 
          ${geistMono.variable}
          min-h-screen
          bg-slate-100
          text-slate-900
          antialiased
        `}
      >
        {children}
      </body>
    </html>
  );
}

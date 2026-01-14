"use client";

import { ReactNode } from "react";

export default function Container({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}

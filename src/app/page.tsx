// Copyright © 2026 Kenior Oswaldo Ruiz Ramirez
// Licencia de software propietario.

import ImageUpload from "@/components/ImageUpload";
import { Leaf } from "lucide-react";

export const metadata = {
  title: "AGM Inspector - Diagnóstico Multimodal Agrícola",
  description: "Plataforma de inspección técnica para el sector agropecuario mediante IA multimodal.",
};

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />

      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-600 p-2 rounded-xl shadow-lg shadow-emerald-600/20">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <span className="font-black text-xl tracking-tight text-slate-800 dark:text-white uppercase">
            AGM <span className="text-emerald-500">Inspector</span>
          </span>
        </div>
        <div className="hidden sm:block">
          <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full uppercase tracking-widest">
            Huaral Edition 2026
          </span>
        </div>
      </nav>

      <section className="relative z-10 pt-12 pb-24 px-4">
        <ImageUpload />
      </section>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <p className="text-[10px] font-mono text-slate-400/50 bg-white/50 dark:bg-black/50 backdrop-blur px-4 py-1 rounded-full border border-slate-200/50 dark:border-slate-800/50">
          SECURE_INSPECTION_SYSTEM_V1.0.0_STABLE
        </p>
      </div>
    </main>
  );
}

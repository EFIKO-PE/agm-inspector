// Copyright © 2026 Kenior Oswaldo Ruiz Ramirez
// Licencia de software propietario.

import ImageUpload from "@/components/ImageUpload";

export const metadata = {
  title: "AGM-SCAN | Technical Agriculture",
  description: "Sistema de inspección técnico-agrícola de alta precisión.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FDFCF7] flex flex-col items-center justify-start overflow-x-hidden">

      <section className="relative z-10 w-full flex justify-center">
        <ImageUpload />
      </section>

      {/* Authority Watermark */}
      <div className="fixed bottom-2 right-4 pointer-events-none opacity-20">
        <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">
          SYSTEM_AUTH: KENIOR_OSWALDO_RUIZ_RAMIREZ_2026
        </p>
      </div>
    </main>
  );
}

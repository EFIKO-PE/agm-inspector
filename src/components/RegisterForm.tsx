// Copyright © 2026 Kenior Oswaldo Ruiz Ramirez
// Licencia de software propietario.

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, User, Mail, Lock, CheckCircle2 } from "lucide-react";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        router.push("/login?registered=true");
      } else {
        const data = await res.json();
        setError(data.error || "Error al registrarse");
      }
    } catch (err) {
      setError("Ocurrió un error en el registro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[400px] mx-auto min-h-screen bg-[#FDFCF7] flex flex-col font-outfit relative">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4A6D32 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      <main className="flex-1 flex flex-col items-center px-8 pt-16 pb-10 z-10">
        {/* Logo Container */}
        <div className="mb-8 flex flex-col items-center">
          <div className="w-24 h-24 bg-white rounded-full shadow-xl flex items-center justify-center p-4 border border-slate-50 mb-3 overflow-hidden">
            <img src="/logo.png" alt="AGM Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-xl font-black text-primary tracking-[0.3em] uppercase">REGISTRO</h1>
          <div className="h-1 w-8 bg-[#F37021] rounded-full mt-1" />
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre Completo</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre del Inspector"
                className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-700 outline-none focus:border-primary shadow-sm transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-700 outline-none focus:border-primary shadow-sm transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-700 outline-none focus:border-primary shadow-sm transition-all"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-widest py-3 px-4 rounded-xl text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <span>Crear Cuenta</span>}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/login" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors">
            ¿Ya tienes cuenta? Inicia Sesión
          </Link>
        </div>
      </main>

      <footer className="py-6 text-center opacity-20 mt-auto">
        <div className="flex items-center justify-center gap-2 text-[8px] font-black uppercase tracking-[0.3em] text-slate-500">
          <CheckCircle2 size={10} />
          <span>Servicio Oficial AGM</span>
        </div>
      </footer>
    </div>
  );
}

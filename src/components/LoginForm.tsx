// Copyright © 2026 Kenior Oswaldo Ruiz Ramirez
// Licencia de software propietario.

"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, User, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Usuario o contraseña incorrectos");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("Ocurrió un error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[400px] mx-auto min-h-screen bg-[#FDFCF7] flex flex-col font-outfit relative">
      {/* Fondo de red sutil */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4A6D32 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      <main className="flex-1 flex flex-col items-center px-8 pt-16 pb-10 z-10">
        {/* Logo Container - Compacto y Limpio */}
        <div className="mb-8 flex flex-col items-center">
          <div className="w-24 h-24 bg-white rounded-full shadow-xl flex items-center justify-center p-4 border border-slate-50 mb-3 overflow-hidden">
            <img src="/logo.png" alt="AGM Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-xl font-black text-primary tracking-[0.3em] uppercase">AGM</h1>
          <div className="h-1 w-8 bg-[#F37021] rounded-full mt-1" />
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Usuario</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
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
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-12 text-sm font-bold text-slate-700 outline-none focus:border-primary shadow-sm transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
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
            {loading ? <Loader2 className="animate-spin" size={18} /> : <span>Ingresar</span>}
          </button>
        </form>

        <div className="mt-8 text-center space-y-4">
          <Link href="/register" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors">
            Crear Cuenta Nueva
          </Link>
          <div className="flex items-center justify-center gap-2 opacity-20">
            <ShieldCheck size={12} />
            <span className="text-[8px] font-black uppercase tracking-[0.3em]">Conexión Encriptada</span>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center opacity-20 mt-auto">
        <div className="flex justify-between px-10 text-[8px] font-black uppercase tracking-widest text-slate-500">
          <span>Demo</span>
          <span>v3.1.0</span>
        </div>
      </footer>
    </div>
  );
}

// Copyright © 2026 Kenior Oswaldo Ruiz Ramirez
// Licencia de software propietario.

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(form),
        headers: { "Content-Type": "application/json" }
      });

      const data = await res.json();

      if (data.success) {
        router.push("/login?registered=true");
      } else {
        setError(data.error || "Error al registrar");
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[400px] mx-auto h-screen bg-[#FDFCF7] flex flex-col px-10 py-8 font-outfit">
      <div className="flex-1 flex flex-col items-center justify-center w-full -mt-10">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full mb-12"
        >
          <Link href="/login" className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors mb-8">
            <ArrowLeft size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Volver</span>
          </Link>
          <h1 className="text-3xl font-black text-primary tracking-tight">Crear Cuenta</h1>
          <p className="text-slate-400 text-xs mt-2 font-medium">Únete a la red de inspectores AGM</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="w-full space-y-10">
          <div className="space-y-1">
            <label className="label-agro">Nombre Completo</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-agro"
            />
          </div>

          <div className="space-y-1">
            <label className="label-agro">Correo Electrónico</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input-agro"
            />
          </div>

          <div className="space-y-1">
            <label className="label-agro">Contraseña</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="input-agro"
            />
          </div>

          {error && (
            <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest text-center">{error}</p>
          )}

          <div className="flex justify-center w-full pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-ingresar"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Registrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

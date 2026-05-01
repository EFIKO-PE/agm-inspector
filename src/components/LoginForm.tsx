// Copyright © 2026 Kenior Oswaldo Ruiz Ramirez
// Licencia de software propietario.

"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Credenciales no válidas");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[400px] mx-auto h-screen bg-[#FDFCF7] flex flex-col px-10 py-8">
      <div className="flex-1 flex flex-col items-center justify-center w-full -mt-16">
        {/* Logo con animación sutil */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center mb-12"
        >
          <div className="w-32 h-32 mb-4">
            <img 
              src="/logo.png" 
              alt="AGM Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-2xl font-black tracking-[0.3em] text-[#4A6D32] ml-2">AGM</h2>
        </motion.div>

        <form onSubmit={handleSubmit} className="w-full space-y-12">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-1"
          >
            <label className="label-agro">Usuario</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-agro"
              placeholder=""
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-1 relative"
          >
            <label className="label-agro">Contraseña</label>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-agro"
              placeholder=""
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 bottom-3 text-slate-300 hover:text-primary transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </motion.div>

          {error && (
            <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest text-center">{error}</p>
          )}

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center w-full pt-4"
          >
            <button
              type="submit"
              disabled={isLoading}
              className="btn-ingresar"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Ingresar"}
            </button>
          </motion.div>

          <div className="text-center mt-6">
            <a href="/register" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-colors">
              Crear cuenta
            </a>
          </div>
        </form>
      </div>

      <footer className="flex justify-between items-center text-[9px] text-slate-300 font-black uppercase tracking-[0.2em] opacity-80">
        <span>demo</span>
        <span>3.0.1</span>
      </footer>
    </div>
  );
}

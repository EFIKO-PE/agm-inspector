// Copyright © 2026 Kenior Oswaldo Ruiz Ramirez
// Licencia de software propietario.

import LoginForm from "@/components/LoginForm";

export const metadata = {
  title: "Login - AGM Inspector",
  description: "Acceso seguro para inspectores agrícolas.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Background Decor */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[150px]" />
      
      <div className="relative z-10 w-full">
        <LoginForm />
      </div>
    </main>
  );
}

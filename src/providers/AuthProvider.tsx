// Copyright © 2026 Kenior Oswaldo Ruiz Ramirez
"use client";

import { SessionProvider } from "next-auth/react";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

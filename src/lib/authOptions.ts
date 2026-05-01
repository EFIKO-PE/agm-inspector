// Copyright © 2026 Kenior Oswaldo Ruiz Ramirez
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import sql from "@/lib/db";
import { randomUUID } from "crypto";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const users = await sql`SELECT * FROM "User" WHERE email = ${credentials.email}`;
        const user = users[0];

        if (!user || !user.password) return null;
        if (user.isActive === false) throw new Error("Cuenta desactivada.");

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        // VERIFICAR SESIÓN CONCURRENTE
        if (user.currentSessionId && user.lastActivityAt) {
          const lastActivity = new Date(user.lastActivityAt).getTime();
          const now = new Date().getTime();
          const diffMinutes = (now - lastActivity) / (1000 * 60);
          if (diffMinutes < 30) throw new Error("Ya existe una sesión activa.");
        }

        const newSessionId = randomUUID();
        await sql`UPDATE "User" SET "currentSessionId" = ${newSessionId}, "lastActivityAt" = NOW() WHERE id = ${user.id}`;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          sessionId: newSessionId
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.sessionId = user.sessionId;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).sessionId = token.sessionId;
      }
      return session;
    }
  },
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
};

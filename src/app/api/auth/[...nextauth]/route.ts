// Copyright © 2026 Kenior Oswaldo Ruiz Ramirez
import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

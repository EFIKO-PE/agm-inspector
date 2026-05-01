// Copyright © 2026 Kenior Oswaldo Ruiz Ramirez
// Licencia de software propietario.

import { NextResponse } from "next/server";
import sql from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    // Buscamos si el usuario ya existe con SQL puro
    const users = await sql`SELECT * FROM "User" WHERE email = ${email}`;

    if (users.length > 0) {
      return NextResponse.json({ error: "El usuario ya existe" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = crypto.randomUUID();

    // Insertamos en Neon con SQL puro
    await sql`
      INSERT INTO "User" (id, name, email, password, "authorToken") 
      VALUES (${id}, ${name}, ${email}, ${hashedPassword}, 'AGM_AUTH_2026_KENIOR')
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error en registro SQL:", error);
    return NextResponse.json({ error: "Error de base de datos: " + error.message }, { status: 500 });
  }
}

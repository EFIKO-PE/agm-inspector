// Copyright © 2026 Kenior Oswaldo Ruiz Ramirez
// Licencia de software propietario.

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import sql from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // VERIFICACIÓN DE SESIÓN ÚNICA
    const users = await sql`SELECT "currentSessionId" FROM "User" WHERE email = ${session.user.email}`;
    const user = users[0];
    
    // Extraer sessionId de forma segura
    const browserSessionId = (session.user as any).sessionId;

    if (!user || !user.currentSessionId || !browserSessionId || user.currentSessionId !== browserSessionId) {
      return NextResponse.json({ 
        error: "Sesión cerrada por actividad en otro dispositivo o sesión expirada.",
        diagnosis: "Por favor, cierra sesión y vuelve a entrar para sincronizar tu acceso."
      }, { status: 403 });
    }

    // ACTUALIZAR ACTIVIDAD PARA MANTENER EL BLOQUEO
    await sql`UPDATE "User" SET "lastActivityAt" = NOW() WHERE email = ${session.user.email}`;

    const { images, location, userApiKey, description, tavilyKey, crop, isDeepAnalysis } = await req.json();
    const apiKey = userApiKey || process.env.OPENROUTER_API_KEY;
    const finalTavilyKey = tavilyKey || process.env.TAVILY_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ 
        error: "Falta configurar tu API Key de OpenRouter",
        diagnosis: "Por favor, contacte al administrador para configurar las claves."
      }, { status: 400 });
    }

    // Preparar el contenido del mensaje con TODAS las imágenes
    const imageContents = (images || []).map((imgBase64: string) => ({
      type: "image_url",
      image_url: { url: imgBase64 }
    }));

    // --- MODO ANÁLISIS RÁPIDO (DIRECTO) ---
    if (!isDeepAnalysis) {
      const quickRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "nvidia/nemotron-nano-12b-v2-vl:free",
          messages: [
            {
              role: "system",
              content: `Eres AGM-QUICK-ENGINE. Experto en ${crop}. Diagnóstico visual instantáneo.`
            },
            {
              role: "user",
              content: [
                { type: "text", text: `Analiza rápido este cultivo de ${crop}. Notas: ${description}` },
                ...imageContents
              ]
            }
          ],
        })
      });

      if (!quickRes.ok) throw new Error("Error en análisis rápido");
      const quickData = await quickRes.json();
      const quickDiagnosis = quickData.choices?.[0]?.message?.content || "No se pudo generar diagnóstico.";

      return NextResponse.json({ success: true, diagnosis: quickDiagnosis, is_verified: false });
    }

    // --- MODO ANÁLISIS PROFUNDO (VERIFICADO - 3 PASOS) ---
    // 1. ANÁLISIS VISUAL INICIAL
    const initialRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "nvidia/nemotron-nano-12b-v2-vl:free",
        messages: [
          {
            role: "system",
            content: `Eres un agrónomo rápido. ID la plaga en ${crop} en 2 palabras.`
          },
          {
            role: "user",
            content: [
              { type: "text", text: "ID plaga:" },
              ...imageContents
            ]
          }
        ],
      })
    });
    
    if (!initialRes.ok) throw new Error("Error en identificación visual");
    const initialData = await initialRes.json();
    const detectedProblem = initialData.choices?.[0]?.message?.content || "Problema desconocido";

    let searchContext = "";
    let isVerified = false;

    // 2. BÚSQUEDA RÁPIDA
    if (finalTavilyKey) {
      try {
        const tavilyRes = await fetch("https://api.tavily.com/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_key: finalTavilyKey,
            query: `compuesto activo real para ${detectedProblem} en ${crop}`,
            search_depth: "basic",
            max_results: 2
          })
        });
        if (tavilyRes.ok) {
          const searchData = await tavilyRes.json();
          searchContext = searchData.results?.map((r: any) => r.content).join("\n") || "";
          isVerified = true;
        }
      } catch (e) { console.error("Error Tavily:", e); }
    }

    // 3. DIAGNÓSTICO FINAL
    const finalRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "nvidia/nemotron-nano-12b-v2-vl:free",
        messages: [
          {
            role: "system",
            content: `Eres AGM-ENGINE. Diagnóstico verificado para ${crop}. 
            Contexto real: ${searchContext}
            Usa este formato:
            DIAGNÓSTICO:
            RAZÓN:
            DIFERENCIAL:
            COMPUESTO ACTIVO:
            ACCIÓN:`
          },
          {
            role: "user",
            content: `Reporte final: ${detectedProblem}. Notas: ${description}`
          }
        ],
      })
    });

    if (!finalRes.ok) throw new Error("Error generando el diagnóstico final");
    const finalData = await finalRes.json();
    const diagnosis = finalData.choices?.[0]?.message?.content || "No se pudo generar un diagnóstico verificado.";

    return NextResponse.json({ 
      success: true, 
      diagnosis,
      is_verified: isVerified
    });
  } catch (error: any) {
    console.error("Error en análisis:", error);
    return NextResponse.json({ error: "Error de servidor: " + error.message }, { status: 500 });
  }
}

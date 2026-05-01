// Copyright © 2026 Kenior Oswaldo Ruiz Ramirez
// Licencia de software propietario.

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://agm-inspector.com", // Optional, for OpenRouter rankings
    "X-Title": "AGM Inspector", // Optional
  }
});

export async function POST(req: Request) {
  try {
    const { images, coords } = await req.json();

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: "No se proporcionaron imágenes" }, { status: 400 });
    }

    // Build multimodal messages
    const imageContent = images.map((base64) => ({
      type: "image_url",
      image_url: { url: base64 }
    }));

    const systemPrompt = `Actúa como un experto agrónomo senior especializado en patología vegetal y entomología agrícola. 
Analiza estas imágenes de cultivos en busca de 'afecciones físicas'.
Identifica específicamente:
1. Plagas (ej. Minador de hoja, mosca blanca, pulgones).
2. Deficiencias nutricionales (Nitrógeno, Magnesio, etc.).
3. Enfermedades fúngicas o bacterianas (Oidio, Mildiu, Botrytis).

DEBES responder ÚNICAMENTE en formato JSON estructurado con los siguientes campos:
{
  "diagnostico_principal": "Descripción técnica clara del problema",
  "severidad": número del 1 al 10,
  "acciones_inmediatas": ["acción 1", "acción 2"],
  "recomendaciones": {
    "quimica_o_organica": "Detalle de tratamiento sugerido"
  }
}
Si hay múltiples afecciones, prioriza la más severa.`;

    const response = await openai.chat.completions.create({
      model: "anthropic/claude-3.5-sonnet", // Or "google/gemini-pro-1.5" or "openai/gpt-4o"
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: [
          { type: "text", text: "Analiza estas imágenes de la inspección de campo y genera el diagnóstico técnico." },
          ...imageContent as any
        ]}
      ],
      response_format: { type: "json_object" }
    });

    const aiResponse = response.choices[0].message.content;
    const result = JSON.parse(aiResponse || "{}");

    // Save to database (Prisma)
    const inspection = await prisma.inspection.create({
      data: {
        imageUrls: [], // En un entorno real, subiríamos a Cloudinary/S3 y guardaríamos aquí las URLs
        diagnosticoPrincipal: result.diagnostico_principal,
        severidad: result.severidad,
        accionesInmediatas: result.acciones_inmediatas,
        recomendaciones: result.recomendaciones,
        latitude: coords?.lat,
        longitude: coords?.lng,
        rawResponse: result as any,
      },
    });

    return NextResponse.json({ ...result, id: inspection.id });
  } catch (error: any) {
    console.error("Error en API Analyze:", error);
    return NextResponse.json(
      { error: "Error procesando el análisis: " + error.message },
      { status: 500 }
    );
  }
}

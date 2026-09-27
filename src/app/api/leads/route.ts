import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { nicheByKey } from "@/lib/niches";
import { usingFixtures } from "@/lib/fixtures";

// Único endpoint de escrita do site (ver Site-achadinhos-futuro.md) — grava
// em site_leads, nunca em coupons/whatsapp_groups.
//
// Sem DATABASE_URL (modo fixtures, ver lib/fixtures.ts) não há banco pra
// escrever — aceita o lead e só loga no console, pra não quebrar o preview.
export async function POST(req: NextRequest) {
  let body: {
    name?: string;
    email?: string;
    whatsapp?: string;
    nicheKey?: string;
    sourcePath?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const email = body.email?.trim() || null;
  const whatsapp = body.whatsapp?.trim() || null;

  if (!email && !whatsapp) {
    return NextResponse.json({ error: "missing_contact" }, { status: 400 });
  }

  const niche = body.nicheKey ? nicheByKey(body.nicheKey) : undefined;

  if (usingFixtures) {
    console.log("[preview] lead capturado (não persistido, sem DATABASE_URL):", {
      name: body.name,
      email,
      whatsapp,
      nicheKey: niche?.key,
      sourcePath: body.sourcePath,
    });
    return NextResponse.json({ ok: true, preview: true });
  }

  try {
    const [nicheRow] = niche
      ? await sql<{ id: number }[]>`SELECT id FROM niches WHERE name = ${niche.key}`
      : [undefined];

    await sql`
      INSERT INTO site_leads (name, email, whatsapp, niche_id, source_path)
      VALUES (
        ${body.name?.trim() || null},
        ${email},
        ${whatsapp},
        ${nicheRow?.id ?? null},
        ${body.sourcePath ?? null}
      )
    `;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erro ao salvar lead:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

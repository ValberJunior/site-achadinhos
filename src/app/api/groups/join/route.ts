import { NextRequest, NextResponse } from "next/server";
import { nicheByKey } from "@/lib/niches";
import { reserveGroupSlot } from "@/lib/data";

// Chamado pelo popup de "entrar no grupo" (JoinGroupPopup) quando a pessoa
// escolhe o nicho. Acha (ou cria) um grupo com vaga e devolve o link de
// convite — o client redireciona pra lá. Ver reserveGroupSlot em
// src/lib/data.ts pra lógica de escolha/criação e create_group_join_intents.sql
// pro porquê da correlação por janela de tempo em vez de identidade real.
export async function POST(req: NextRequest) {
  let body: { nicheKey?: string; sourcePath?: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const niche = body.nicheKey ? nicheByKey(body.nicheKey) : undefined;
  if (!niche) {
    return NextResponse.json({ error: "invalid_niche" }, { status: 400 });
  }

  try {
    const { inviteLink } = await reserveGroupSlot(niche.key, body.sourcePath ?? "/");
    return NextResponse.json({ inviteLink });
  } catch (err) {
    // Erro mais provável aqui é o Evolution API fora do ar/mal configurado
    // (só acontece quando TODOS os grupos do nicho estão cheios e precisa
    // criar um novo) — loga com detalhe pra facilitar debug, mas não vaza
    // isso pro client.
    console.error(`Erro ao reservar vaga em grupo (nicho=${niche.key}):`, err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

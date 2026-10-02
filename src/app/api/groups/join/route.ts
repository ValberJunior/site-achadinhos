import { NextRequest, NextResponse } from "next/server";
import { reserveGroupSlot } from "@/lib/data";

// Chamado pelo botão/popup de "entrar no grupo" (JoinGroupPopup e o CTA do
// hero). Não pede nicho (dashboard não separa mais grupo por nicho, ver
// src/lib/data.ts) — acha (ou cria) um grupo com vaga e devolve o link de
// convite; o client redireciona pra lá. Ver reserveGroupSlot em
// src/lib/data.ts pra lógica de escolha/criação e create_group_join_intents.sql
// pro porquê da correlação por janela de tempo em vez de identidade real.
export async function POST(req: NextRequest) {
  let body: { sourcePath?: string } = {};

  try {
    body = await req.json();
  } catch {
    // corpo vazio é válido (não há mais campo obrigatório) — ignora erro de parse
  }

  try {
    const { inviteLink } = await reserveGroupSlot(body.sourcePath ?? "/");
    return NextResponse.json({ inviteLink });
  } catch (err) {
    // Erro mais provável aqui é o Evolution API fora do ar/mal configurado
    // (só acontece quando TODOS os grupos ativos estão cheios e precisa
    // criar um novo) — loga com detalhe pra facilitar debug, mas não vaza
    // isso pro client.
    console.error("Erro ao reservar vaga em grupo:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

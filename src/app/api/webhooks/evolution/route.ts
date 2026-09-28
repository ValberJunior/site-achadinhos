import { NextRequest, NextResponse } from "next/server";
import { matchGroupJoin } from "@/lib/data";

// Recebe o evento de "novo participante" do Evolution API (normalmente
// chamado de "group-participants.update" ou "GROUP_PARTICIPANTS_UPDATE",
// varia por versão) e casa com a intenção de clique mais recente sem match
// do grupo em questão. Ver create_group_join_intents.sql pro porquê disso
// ser best-effort, não garantia.
//
// ATENÇÃO — formato do payload: o parsing abaixo cobre o formato mais
// comum do Evolution API v2, mas cada instância/versão varia um pouco.
// Se o match não funcionar na prática, pegue um payload real (dá pra ver
// no log do Evolution API ou testando com um serviço tipo webhook.site
// antes de apontar pra cá de verdade) e me manda pra eu ajustar o
// extractParticipants abaixo.
//
// Autenticação: só um segredo compartilhado na query string (?token=...),
// configurado igual no .env (EVOLUTION_WEBHOOK_SECRET) e na URL de webhook
// cadastrada no Evolution API. Não é o método mais forte que existe, mas é
// simples e suficiente pra esse endpoint não aceitar POST de qualquer um.

interface EvolutionParticipant {
  jid: string;
  phone: string;
}

function extractParticipants(body: unknown): { groupJid: string | null; action: string | null; participants: EvolutionParticipant[] } {
  const b = body as Record<string, unknown>;
  const data = (b?.data ?? b) as Record<string, unknown>;

  const groupJid = (data?.id ?? data?.groupJid ?? data?.remoteJid ?? null) as string | null;
  const actionRaw = (data?.action ?? b?.action ?? null) as string | null;
  const rawParticipants = (data?.participants ?? data?.participant ?? []) as unknown;

  const list: string[] = Array.isArray(rawParticipants)
    ? (rawParticipants as unknown[]).map(String)
    : typeof rawParticipants === "string"
      ? [rawParticipants]
      : [];

  const participants = list.map((jid) => ({
    jid,
    phone: jid.replace(/@.*$/, "").replace(/\D/g, ""),
  }));

  return { groupJid, action: actionRaw?.toLowerCase() ?? null, participants };
}

export async function POST(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token || token !== process.env.EVOLUTION_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { groupJid, action, participants } = extractParticipants(body);

  // Só nos interessa entrada de gente nova — "remove"/"promote"/"demote"
  // não fazem sentido pra contagem de vaga.
  if (!groupJid || action !== "add" || participants.length === 0) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const adminPhone = (process.env.EVOLUTION_ADMIN_PHONE ?? "").replace(/\D/g, "");

  for (const { phone } of participants) {
    // O próprio número admin é adicionado a todo grupo novo criado via
    // reserveGroupSlot (ver createWhatsappGroup em lib/evolution.ts) — esse
    // "join" é bootstrap do sistema, não uma entrada real de visitante.
    if (adminPhone && phone === adminPhone) continue;
    await matchGroupJoin(groupJid, phone);
  }

  return NextResponse.json({ ok: true });
}

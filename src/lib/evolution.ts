// Cliente HTTP fino pro Evolution API — só o que esse site precisa: criar
// grupo novo e pegar o link de convite dele. Tudo específico da API fica
// isolado aqui de propósito, pra ser o único lugar a ajustar se a versão
// da sua instância usar paths/nomes de campo diferentes dos do v2 (que é
// o que este arquivo assume).
//
// Credenciais só existem em runtime (mesma lógica do DATABASE_URL em
// src/lib/db.ts) — nunca são necessárias em build time, então não travam
// o `next build` sem elas configuradas.

interface EvolutionConfig {
  baseUrl: string;
  apiKey: string;
  instance: string;
}

function getConfig(): EvolutionConfig {
  const baseUrl = process.env.EVOLUTION_API_URL;
  const apiKey = process.env.EVOLUTION_API_KEY;
  const instance = process.env.EVOLUTION_INSTANCE;
  if (!baseUrl || !apiKey || !instance) {
    throw new Error(
      "EVOLUTION_API_URL/EVOLUTION_API_KEY/EVOLUTION_INSTANCE não configuradas — ver .env.example."
    );
  }
  return { baseUrl: baseUrl.replace(/\/$/, ""), apiKey, instance };
}

export interface CreatedGroup {
  /** JID do grupo, ex: "1203630...@g.us" — é o identificador estável do grupo. */
  groupJid: string;
  inviteLink: string;
}

// Criação de grupo pelo WhatsApp SEMPRE exige pelo menos 1 participante além
// de quem cria — não dá pra criar um grupo vazio. Por isso EVOLUTION_ADMIN_PHONE:
// o próprio número admin/dono do grupo (mesmo número conectado no Evolution
// API), adicionado a todo grupo novo criado por automação.
export async function createWhatsappGroup(subject: string): Promise<CreatedGroup> {
  const { baseUrl, apiKey, instance } = getConfig();
  const adminPhone = process.env.EVOLUTION_ADMIN_PHONE;
  if (!adminPhone) {
    throw new Error("EVOLUTION_ADMIN_PHONE não configurada — ver .env.example.");
  }

  const createRes = await fetch(`${baseUrl}/group/create/${instance}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: apiKey },
    body: JSON.stringify({ subject, participants: [adminPhone] }),
  });
  if (!createRes.ok) {
    throw new Error(`Evolution API: falha ao criar grupo (${createRes.status}): ${await createRes.text()}`);
  }
  const created = (await createRes.json()) as { id?: string; groupJid?: string };
  const groupJid = created.groupJid ?? created.id;
  if (!groupJid) {
    throw new Error("Evolution API: resposta de criação de grupo sem JID — confira o formato da sua versão.");
  }

  const inviteRes = await fetch(
    `${baseUrl}/group/inviteCode/${instance}?groupJid=${encodeURIComponent(groupJid)}`,
    { headers: { apikey: apiKey } }
  );
  if (!inviteRes.ok) {
    throw new Error(`Evolution API: falha ao pegar link de convite (${inviteRes.status}): ${await inviteRes.text()}`);
  }
  const invite = (await inviteRes.json()) as { inviteUrl?: string; inviteCode?: string };
  const inviteLink =
    invite.inviteUrl ?? (invite.inviteCode ? `https://chat.whatsapp.com/${invite.inviteCode}` : undefined);
  if (!inviteLink) {
    throw new Error("Evolution API: resposta de invite code sem link — confira o formato da sua versão.");
  }

  return { groupJid, inviteLink };
}

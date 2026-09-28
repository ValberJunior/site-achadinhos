import { sql } from "./db";
import type { Coupon, WhatsappGroup } from "./types";
import { NicheKey } from "./niches";
import { FIXTURE_COUPONS, FIXTURE_GROUPS, usingFixtures } from "./fixtures";
import { createWhatsappGroup } from "./evolution";

// Camada de leitura do site. Regra de ouro (ver Site-achadinhos-futuro.md):
// o site só LÊ coupons (published=true) e whatsapp_groups (status=active) —
// nunca escreve nelas. As únicas escritas do site são em site_leads.
//
// Quando DATABASE_URL não está configurada, cai pros dados fixos em
// fixtures.ts (mesmo conteúdo do seed_test_achadinhos.sql) — só serve pra
// rodar um preview local (ex.: no celular, na mesma rede) sem precisar de
// Postgres instalado na máquina. Com DATABASE_URL definida, isso é
// ignorado e o site lê do banco real normalmente.

export async function getPublishedCouponsByNicheKey(
  nicheKey: NicheKey,
  limit = 60
): Promise<Coupon[]> {
  if (usingFixtures) {
    return FIXTURE_COUPONS.filter((c) => c.niche_key === nicheKey).slice(0, limit);
  }
  const rows = await sql<Coupon[]>`
    SELECT c.*
    FROM coupons c
    JOIN niches n ON n.id = c.niche_id
    WHERE c.published = true AND n.name = ${nicheKey}
    ORDER BY c.published_at DESC NULLS LAST, c.found_at DESC
    LIMIT ${limit}
  `;
  return rows;
}

export async function getFeaturedCoupons(perNiche = 4): Promise<Record<NicheKey, Coupon[]>> {
  const grouped: Record<string, Coupon[]> = {
    casa_mesa_banho: [],
    infantil: [],
    eletronicos: [],
  };

  if (usingFixtures) {
    for (const row of FIXTURE_COUPONS) {
      const bucket = grouped[row.niche_key];
      if (bucket && bucket.length < perNiche) bucket.push(row);
    }
    return grouped as Record<NicheKey, Coupon[]>;
  }

  // Uma query só, depois separa em memória — evita 3 round-trips na home.
  const rows = await sql<(Coupon & { niche_name: NicheKey })[]>`
    SELECT c.*, n.name AS niche_name
    FROM coupons c
    JOIN niches n ON n.id = c.niche_id
    WHERE c.published = true
    ORDER BY c.published_at DESC NULLS LAST, c.found_at DESC
  `;

  for (const row of rows) {
    const bucket = grouped[row.niche_name];
    if (bucket && bucket.length < perNiche) {
      bucket.push(row);
    }
  }

  return grouped as Record<NicheKey, Coupon[]>;
}

export async function getActiveGroupByNicheKey(
  nicheKey: NicheKey
): Promise<WhatsappGroup | null> {
  if (usingFixtures) {
    return FIXTURE_GROUPS.find((g) => g.niche_key === nicheKey) ?? null;
  }
  const rows = await sql<WhatsappGroup[]>`
    SELECT g.*
    FROM whatsapp_groups g
    JOIN niches n ON n.id = g.niche_id
    WHERE g.status = 'active' AND n.name = ${nicheKey}
    ORDER BY g.member_count ASC NULLS FIRST
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function getActiveCouponsCount(): Promise<number> {
  if (usingFixtures) {
    return FIXTURE_COUPONS.length;
  }
  const rows = await sql<{ count: string }[]>`
    SELECT COUNT(*)::text AS count FROM coupons WHERE published = true
  `;
  return Number(rows[0]?.count ?? 0);
}

// --- Fluxo de auto-entrada em grupo (popup de nicho → WhatsApp) ---------
// Ver create_group_join_intents.sql pro porquê da correlação por janela de
// tempo (o WhatsApp não avisa o site de quem clicou, só de quem entrou).

export interface ReservedGroup {
  inviteLink: string;
  intentId: number;
}

// Acha um grupo ativo do nicho com vaga (member_count < max_members, ver
// alter_whatsapp_groups_capacity.sql pro porquê de 950 e não 1024) e grava
// uma "intenção de entrada" — se não tiver vaga em nenhum, cria um grupo
// novo pelo Evolution API antes.
//
// SELECT ... FOR UPDATE trava a linha do grupo escolhido até o fim da
// transação: evita duas requisições concorrentes decidirem "esse grupo
// ainda tem vaga" ao mesmo tempo e as duas mandarem gente pro mesmo grupo
// já cheio.
export async function reserveGroupSlot(
  nicheKey: NicheKey,
  sourcePath: string
): Promise<ReservedGroup> {
  if (usingFixtures) {
    const group = FIXTURE_GROUPS.find((g) => g.niche_key === nicheKey);
    if (!group) throw new Error(`Sem grupo fixture pro nicho ${nicheKey}`);
    return { inviteLink: group.invite_link, intentId: 0 };
  }

  return sql.begin(async (tx) => {
    const [niche] = await tx<{ id: number; label: string }[]>`
      SELECT id, name AS label FROM niches WHERE name = ${nicheKey}
    `;
    if (!niche) throw new Error(`Nicho desconhecido: ${nicheKey}`);

    const [existing] = await tx<WhatsappGroup[]>`
      SELECT * FROM whatsapp_groups
      WHERE niche_id = ${niche.id} AND status = 'active'
        AND COALESCE(member_count, 0) < max_members
      ORDER BY member_count ASC NULLS FIRST
      LIMIT 1
      FOR UPDATE
    `;

    let group = existing;
    if (!group) {
      // Sem grupo com vaga — cria um novo pelo Evolution API. Nome é só
      // rótulo interno (não crítico), sequencial por nicho.
      const [{ count }] = await tx<{ count: string }[]>`
        SELECT COUNT(*)::text AS count FROM whatsapp_groups WHERE niche_id = ${niche.id}
      `;
      const subject = `Achadinhos ${niche.label} #${Number(count) + 1}`;
      const created = await createWhatsappGroup(subject);

      const [inserted] = await tx<WhatsappGroup[]>`
        INSERT INTO whatsapp_groups (niche_id, name, invite_link, member_count, status, group_jid)
        VALUES (${niche.id}, ${subject}, ${created.inviteLink}, 0, 'active', ${created.groupJid})
        RETURNING *
      `;
      group = inserted;
    }

    const [intent] = await tx<{ id: number }[]>`
      INSERT INTO group_join_intents (niche_id, whatsapp_group_id, source_path)
      VALUES (${niche.id}, ${group.id}, ${sourcePath})
      RETURNING id
    `;

    return { inviteLink: group.invite_link, intentId: intent.id };
  });
}

// Chamado pelo webhook do Evolution API quando alguém entra de fato num
// grupo. Sempre incrementa member_count (a entrada é real, aconteça o
// match ou não) e, em paralelo, tenta casar com a intenção de clique mais
// recente ainda sem match desse grupo — essa parte é best-effort, não
// garantia (ver comentário no topo do arquivo de migration).
export async function matchGroupJoin(groupJid: string, phone: string): Promise<boolean> {
  if (usingFixtures) return false;

  return sql.begin(async (tx) => {
    const [group] = await tx<WhatsappGroup[]>`
      SELECT * FROM whatsapp_groups WHERE group_jid = ${groupJid}
      FOR UPDATE
    `;
    if (!group) return false;

    const [intent] = await tx<{ id: number }[]>`
      SELECT id FROM group_join_intents
      WHERE whatsapp_group_id = ${group.id} AND matched_at IS NULL
      ORDER BY created_at DESC
      LIMIT 1
      FOR UPDATE
    `;

    if (intent) {
      await tx`
        UPDATE group_join_intents
        SET matched_phone = ${phone}, matched_at = NOW()
        WHERE id = ${intent.id}
      `;
    }

    await tx`
      UPDATE whatsapp_groups
      SET member_count = COALESCE(member_count, 0) + 1
      WHERE id = ${group.id}
    `;

    return true;
  });
}

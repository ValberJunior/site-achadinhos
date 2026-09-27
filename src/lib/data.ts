import { sql } from "./db";
import type { Coupon, WhatsappGroup } from "./types";
import { NicheKey } from "./niches";
import { FIXTURE_COUPONS, FIXTURE_GROUPS, usingFixtures } from "./fixtures";

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

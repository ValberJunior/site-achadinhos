// Mapeamento entre o `name` salvo em `niches` (banco) e o slug/rótulo usados
// no site. Mantido separado do banco de propósito: o valor em `niches.name`
// é um identificador técnico ('casa_mesa_banho'), o slug é o que aparece na
// URL, e o label é o que aparece pro usuário.
//
// De propósito SEM cor própria por nicho: uma cor por categoria (laranja,
// rosa, roxo...) lia como colcha de retalhos. Marketplace de verdade
// (Shopee, Mercado Livre, Magalu) usa UMA identidade visual só — a
// diferenciação por categoria é só o ícone/label, não a cor.

export type NicheKey = "casa_mesa_banho" | "infantil" | "eletronicos";

export interface NicheMeta {
  key: NicheKey;
  slug: string;
  label: string;
  shortLabel: string;
  emoji: string;
  description: string;
}

export const NICHES: Record<NicheKey, NicheMeta> = {
  casa_mesa_banho: {
    key: "casa_mesa_banho",
    slug: "casa-mesa-banho",
    label: "Casa, Mesa e Banho",
    shortLabel: "Casa",
    emoji: "🏠",
    description: "Achadinhos pra casa: cozinha, cama, mesa e banho com desconto de verdade.",
  },
  infantil: {
    key: "infantil",
    slug: "infantil",
    label: "Infantil",
    shortLabel: "Infantil",
    emoji: "🧸",
    description: "Brinquedos, itens escolares e produtos infantis selecionados com cupom ativo.",
  },
  eletronicos: {
    key: "eletronicos",
    slug: "eletronicos",
    label: "Eletrônicos",
    shortLabel: "Eletrônicos",
    emoji: "🎧",
    description: "Fones, acessórios e eletrônicos do dia a dia com desconto validado.",
  },
};

export const NICHE_LIST: NicheMeta[] = Object.values(NICHES);

export function nicheBySlug(slug: string): NicheMeta | undefined {
  return NICHE_LIST.find((n) => n.slug === slug);
}

export function nicheByKey(key: string): NicheMeta | undefined {
  return NICHES[key as NicheKey];
}

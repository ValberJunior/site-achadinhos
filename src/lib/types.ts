export interface Coupon {
  id: number;
  niche_id: number;
  marketplace: string;
  product_name: string;
  discount_pct: string | null; // numeric vem como string do postgres.js
  original_price: string | null;
  price: string | null;
  photo_url: string | null;
  product_url: string | null;
  affiliate_url: string | null;
  copy: string | null;
  published: boolean;
  found_at: string;
  published_at: string | null;
}

export interface WhatsappGroup {
  id: number;
  niche_id: number;
  name: string;
  invite_link: string;
  member_count: number | null;
  max_members: number;
  group_jid: string | null;
  status: string;
}

export function formatBRL(value: string | number | null): string | null {
  if (value === null || value === undefined) return null;
  const n = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(n)) return null;
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatDiscount(value: string | number | null): string | null {
  if (value === null || value === undefined) return null;
  const n = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(n)) return null;
  return `${Math.round(n)}% OFF`;
}

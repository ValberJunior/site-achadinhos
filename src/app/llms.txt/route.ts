import { NICHE_LIST } from "@/lib/niches";

// llms.txt (ver Site-achadinhos-futuro.md) — resumo estruturado do site pra
// agentes de IA/crawlers que leem esse arquivo antes de decidir o que
// indexar/citar. Gerado dinamicamente (não é um arquivo estático em public/)
// pra listar sempre os nichos atuais sem precisar de rebuild manual.
export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const lines = [
    "# Listinha da Bru",
    "",
    "> Catálogo de achadinhos e cupons de desconto ativos em marketplaces brasileiros (Shopee), organizados por nicho. Os preços, descontos e links de afiliado são atualizados continuamente — sempre confirme o valor final na página de destino antes de comprar.",
    "",
    "## Nichos",
    ...NICHE_LIST.map((n) => `- [${n.label}](${siteUrl}/nicho/${n.slug}): ${n.description}`),
    "",
    "## Dados estruturados",
    "Cada página de nicho expõe um bloco JSON-LD do tipo ItemList/Product/Offer com nome, preço e link de cada oferta ativa.",
    "",
    "## Sitemap",
    `${siteUrl}/sitemap.xml`,
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NicheNav } from "@/components/NicheNav";
import { CouponCard } from "@/components/CouponCard";
import { NewsletterForm } from "@/components/NewsletterForm";
import { getPublishedCouponsByNicheKey, getActiveGroupByNicheKey } from "@/lib/data";
import { NICHE_LIST, nicheBySlug } from "@/lib/niches";

// Precisa ser um literal estático (Next analisa via AST em build time) —
// não dá pra ler de process.env aqui. 1800s = 30min, mesmo valor do
// Site-achadinhos-futuro.md.
export const revalidate = 1800;

export function generateStaticParams() {
  return NICHE_LIST.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const niche = nicheBySlug(slug);
  if (!niche) return {};
  return {
    title: niche.label,
    description: niche.description,
    alternates: { canonical: `/nicho/${niche.slug}` },
    openGraph: {
      title: `${niche.label} — Listinha da Bru`,
      description: niche.description,
    },
  };
}

export default async function NichePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const niche = nicheBySlug(slug);
  if (!niche) notFound();

  const [coupons, group] = await Promise.all([
    getPublishedCouponsByNicheKey(niche.key),
    getActiveGroupByNicheKey(niche.key),
  ]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: niche.label,
    itemListElement: coupons.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: c.product_name,
        image: c.photo_url ?? undefined,
        url: `${siteUrl}/nicho/${niche.slug}#coupon-${c.id}`,
        offers: {
          "@type": "Offer",
          priceCurrency: "BRL",
          price: c.price ?? undefined,
          url: c.affiliate_url ?? undefined,
          availability: "https://schema.org/InStock",
        },
      },
    })),
  };

  return (
    <div className="mx-auto max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <section className="px-4 pb-2 pt-6 sm:px-6">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-2 text-xl" aria-hidden>
          {niche.emoji}
        </span>
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight">{niche.label}</h1>
        <p className="mt-1 text-sm text-foreground/70">{niche.description}</p>
      </section>

      <NicheNav activeSlug={niche.slug} />

      {group ? (
        <div className="mx-4 my-4 flex items-center justify-between gap-3 rounded-[1.25rem] border border-border bg-surface-2 p-4 card-shadow sm:mx-6">
          <div>
            <p className="text-sm font-semibold">Entre no grupo de {niche.shortLabel}</p>
            <p className="text-xs text-foreground/60">
              Cupom sai primeiro lá —{" "}
              {group.member_count ? `${group.member_count} pessoas já estão dentro` : "vagas abertas"}
            </p>
          </div>
          <a
            href={group.invite_link}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full bg-whatsapp px-4 py-2 text-sm font-bold text-white shadow-sm active:opacity-80"
          >
            Entrar
          </a>
        </div>
      ) : null}

      <section className="px-4 py-4 sm:px-6">
        {coupons.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-foreground/60">
            Nenhum achadinho publicado nesse nicho ainda — volta em breve.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {coupons.map((c) => (
              <div key={c.id} id={`coupon-${c.id}`}>
                <CouponCard coupon={c} niche={niche} />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mx-4 my-6 rounded-[1.25rem] border border-border bg-surface-2 p-5 sm:mx-6">
        <h2 className="text-base font-bold">
          Quer só os achadinhos de {niche.shortLabel.toLowerCase()}?
        </h2>
        <p className="mt-1 mb-4 text-sm text-foreground/70">
          Deixe seu contato pra receber avisos só desse nicho.
        </p>
        <NewsletterForm nicheKey={niche.key} sourcePath={`/nicho/${niche.slug}`} />
      </section>
    </div>
  );
}

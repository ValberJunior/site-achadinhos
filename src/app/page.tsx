import Link from "next/link";
import { Hero } from "@/components/Hero";
import { NicheNav } from "@/components/NicheNav";
import { CouponCard } from "@/components/CouponCard";
import { NewsletterForm } from "@/components/NewsletterForm";
import { getFeaturedCoupons, getActiveCouponsCount } from "@/lib/data";
import { NICHE_LIST, nicheByKey } from "@/lib/niches";
import type { Coupon } from "@/lib/types";

// Precisa ser um literal estático (Next analisa via AST em build time) —
// não dá pra ler de process.env aqui. 1800s = 30min, mesmo valor do
// Site-achadinhos-futuro.md.
export const revalidate = 1800;

export default async function HomePage() {
  const [featured, activeCount] = await Promise.all([
    getFeaturedCoupons(4),
    getActiveCouponsCount(),
  ]);

  // "Mais procurados agora": um recorte com 1-2 itens de cada nicho pra
  // abrir a home com variedade, igual à faixa "Top Trending" dos apps de
  // referência — não é uma lista nova, é um resumo do que já vem de
  // getFeaturedCoupons.
  const trending: { coupon: Coupon; nicheKey: string }[] = [];
  for (const niche of NICHE_LIST) {
    const coupons = featured[niche.key] ?? [];
    for (const c of coupons.slice(0, 2)) {
      trending.push({ coupon: c, nicheKey: niche.key });
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Hero activeCount={activeCount} />

      <NicheNav />

      {trending.length > 0 ? (
        <section className="py-1" aria-labelledby="h-trending">
          <div className="mb-3 flex items-center justify-between px-4 sm:px-6">
            <h2 id="h-trending" className="text-lg font-bold">
              🔥 Mais procurados agora
            </h2>
          </div>
          <div className="no-scrollbar snap-row flex gap-3 overflow-x-auto px-4 pb-1 sm:px-6">
            {trending.map(({ coupon, nicheKey }) => {
              const niche = nicheByKey(nicheKey);
              if (!niche) return null;
              return <CouponCard key={coupon.id} coupon={coupon} niche={niche} compact />;
            })}
          </div>
        </section>
      ) : null}

      {NICHE_LIST.map((niche) => {
        const coupons = featured[niche.key] ?? [];
        if (coupons.length === 0) return null;
        return (
          <section key={niche.key} className="px-4 py-4 sm:px-6" aria-labelledby={`h-${niche.slug}`}>
            <div className="mb-3 flex items-center justify-between">
              <h2 id={`h-${niche.slug}`} className="text-lg font-bold">
                {niche.emoji} {niche.label}
              </h2>
              <Link
                href={`/nicho/${niche.slug}`}
                className="text-sm font-semibold text-link hover:underline"
              >
                Ver tudo
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {coupons.map((c) => (
                <CouponCard key={c.id} coupon={c} niche={niche} />
              ))}
            </div>
          </section>
        );
      })}

      <section className="mx-4 my-6 rounded-[1.25rem] border border-border bg-surface-2 p-5 sm:mx-6">
        <h2 className="text-base font-bold">Não quer perder nenhum achadinho?</h2>
        <p className="mt-1 mb-4 text-sm text-foreground/70">
          Deixe seu contato e a gente avisa quando sair cupom novo no seu nicho.
        </p>
        <NewsletterForm sourcePath="/" />
      </section>
    </div>
  );
}

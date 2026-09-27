"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Coupon } from "@/lib/types";
import { formatBRL, formatDiscount } from "@/lib/types";
import type { NicheMeta } from "@/lib/niches";
import { trackAffiliateClick, trackViewContent } from "./FacebookPixel";

export function CouponCard({
  coupon,
  niche,
  compact = false,
}: {
  coupon: Coupon;
  niche: NicheMeta;
  /** Variante estreita usada no strip horizontal de destaques da home. */
  compact?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);
  const [saved, setSaved] = useState(false);

  // Dispara ViewContent uma única vez quando o card entra na viewport de
  // verdade (não no load da página inteira) — só roda no client, é leve
  // (um IntersectionObserver por card, desconectado assim que dispara).
  useEffect(() => {
    if (seen || !ref.current) return;
    const el = ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          trackViewContent(coupon.product_name, coupon.price ? Number(coupon.price) : undefined);
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [coupon.product_name, coupon.price, seen]);

  const discount = formatDiscount(coupon.discount_pct);
  const price = formatBRL(coupon.price);
  const originalPrice = formatBRL(coupon.original_price);

  return (
    <article
      ref={ref}
      className={`flex flex-col overflow-hidden rounded-[1.25rem] border border-border bg-surface card-shadow card-shadow-hover transition-shadow ${
        compact ? "w-[9.5rem] shrink-0 sm:w-[10.5rem]" : ""
      }`}
    >
      <div className="relative aspect-square w-full bg-surface-2">
        {coupon.photo_url ? (
          <Image
            src={coupon.photo_url}
            alt={coupon.product_name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
          />
        ) : (
          // Sem foto ainda (antes do W7 trazer a foto real da Shopee) —
          // placeholder de categoria, nunca uma foto de banco de imagens
          // sem relação com o produto.
          <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-25" aria-hidden>
            {niche.emoji}
          </div>
        )}

        <button
          type="button"
          aria-label={saved ? "Remover dos salvos" : "Salvar"}
          onClick={() => setSaved((s) => !s)}
          className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-sm shadow-sm active:scale-95"
        >
          {saved ? "❤️" : "🤍"}
        </button>

        {discount ? (
          <span className="absolute left-1.5 top-1.5 rounded-md bg-tag px-1.5 py-0.5 text-[11px] font-extrabold text-tag-foreground shadow-sm">
            -{discount.replace(" OFF", "")}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-2.5">
        <h3 className="line-clamp-2 text-[13px] font-medium leading-snug text-foreground/90">
          {coupon.product_name}
        </h3>

        <div className="mt-auto flex items-baseline gap-1.5 pt-1">
          {price ? <span className="text-base font-extrabold text-foreground">{price}</span> : null}
          {originalPrice ? (
            <span className="text-[11px] text-foreground/40 line-through">{originalPrice}</span>
          ) : null}
        </div>

        <a
          href={coupon.affiliate_url ?? "#"}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          onClick={() => trackAffiliateClick(coupon.product_name)}
          className="mt-1.5 flex items-center justify-center rounded-xl bg-brand px-3 py-2 text-xs font-bold text-brand-foreground transition-opacity hover:opacity-90 active:opacity-80"
        >
          Ver oferta
        </a>
      </div>
    </article>
  );
}

import Link from "next/link";
import { NICHE_LIST } from "@/lib/niches";

// Grade de categorias estilo "Explore by Category" — tiles com ícone em
// cima e label embaixo, em vez dos chips horizontais antigos. Um único
// estilo de tile pra tudo (ativo = preenchido com a cor da marca,
// inativo = neutro) — sem cor própria por nicho, só o ícone/label muda.
export function NicheNav({ activeSlug }: { activeSlug?: string }) {
  return (
    <nav id="categorias" aria-label="Categorias" className="scroll-mt-16 px-4 py-4 sm:px-6">
      <div className="grid grid-cols-4 gap-2 sm:mx-auto sm:max-w-sm">
        <Link
          href="/"
          className={`flex flex-col items-center gap-1.5 rounded-2xl border px-1 py-3 text-center transition-colors ${
            !activeSlug
              ? "border-brand bg-brand text-brand-foreground"
              : "border-transparent bg-surface-2 text-foreground/75 hover:bg-surface-3"
          }`}
        >
          <span className="text-xl" aria-hidden>
            🗂️
          </span>
          <span className="text-[11px] font-bold leading-tight">Todos</span>
        </Link>
        {NICHE_LIST.map((n) => {
          const isActive = n.slug === activeSlug;
          return (
            <Link
              key={n.slug}
              href={`/nicho/${n.slug}`}
              className={`flex flex-col items-center gap-1.5 rounded-2xl border px-1 py-3 text-center transition-colors ${
                isActive
                  ? "border-brand bg-brand text-brand-foreground"
                  : "border-transparent bg-surface-2 text-foreground/75 hover:bg-surface-3"
              }`}
            >
              <span className="text-xl" aria-hidden>
                {n.emoji}
              </span>
              <span className="text-[11px] font-bold leading-tight">{n.shortLabel}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

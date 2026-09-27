// Hero da home, inspirado em estúdio de e-commerce (headline forte +
// collage de produto ao lado). Como ainda não temos fotografia de
// catálogo própria (CouponCard cai pro emoji quando falta photo_url — ver
// comentário lá), o collage aqui usa os mesmos ícones de nicho em blocos
// pastel decorativos, não fotos de banco de imagem sem relação com o
// produto. As cores do collage são só variedade visual pontual — a regra
// de "uma identidade só" continua valendo pra navegação (NicheNav).
const COLLAGE_TILES = [
  { emoji: "🧴", bg: "bg-[#fdece3]" }, // brand-soft
  { emoji: "🧸", bg: "bg-[#fff6d6]" },
  { emoji: "🎧", bg: "bg-[#e3f0ff]" },
  { emoji: "🍳", bg: "bg-surface-2" },
] as const;

export function Hero({ activeCount }: { activeCount: number }) {
  return (
    <section className="px-4 pt-5 sm:px-6">
      <div className="overflow-hidden rounded-[1.5rem] border border-border bg-surface card-shadow">
        <div className="grid grid-cols-5">
          <div className="col-span-3 flex flex-col justify-center gap-3 p-5 sm:p-6">
            {activeCount > 0 ? (
              <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-bold text-accent">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                {activeCount} {activeCount === 1 ? "achadinho ativo" : "achadinhos ativos"}
              </p>
            ) : null}
            <h1 className="text-[1.6rem] font-extrabold leading-[1.1] tracking-tight sm:text-3xl">
              Sua listinha de achadinhos,{" "}
              <span className="text-brand">sempre atualizada</span>
            </h1>
            <p className="text-sm leading-snug text-foreground/65 sm:text-base">
              Cupom conferido de verdade, direto pro carrinho — sem enrolação.
            </p>
            <a
              href="#categorias"
              className="mt-1 flex w-fit items-center gap-1 rounded-full bg-brand px-4 py-2 text-xs font-bold text-brand-foreground shadow-sm active:opacity-80 sm:text-sm"
            >
              Ver ofertas ↓
            </a>
          </div>

          <div className="col-span-2 grid grid-cols-2 gap-1.5 p-1.5 sm:gap-2 sm:p-2">
            {COLLAGE_TILES.map((tile, i) => (
              <div
                key={i}
                className={`flex aspect-square items-center justify-center rounded-2xl text-2xl sm:text-3xl ${tile.bg}`}
                aria-hidden
              >
                {tile.emoji}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Home = página de captura única, estilo "página de vendas" (headline
// grande, CTA em destaque, lista de bullets com check). O fundo é um
// mesh de luzes só em CSS (sem foto) — blobs desfocados coloridos que
// derivam bem devagar (ver .blob-a/b/c e os @keyframes em globals.css),
// mais uma grade sutil pra dar textura de "produto moderno". O logo fica
// só no topo, pequeno.

const WHATSAPP_GROUP_URL =
  process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL || "https://chat.whatsapp.com/SEU_LINK_AQUI";

function CtaButton({ label }: { label: string }) {
  return (
    <a
      href={WHATSAPP_GROUP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full rounded-full bg-[#25D366] py-4 text-center text-lg font-extrabold uppercase tracking-wide text-white shadow-[0_0_30px_rgba(37,211,102,0.55)] transition-transform active:scale-[0.98]"
    >
      {label}
    </a>
  );
}

const BULLETS = [
  "Achadinhos selecionados a dedo: casa, decoração e maternidade",
  "Cupom ativo e link direto — sem enrolação",
  "Coisa nova todo santo dia, direto no grupo",
  "Itens de festa, presentes e aquele achadinho que você nem sabia que precisava",
];

export default function HomePage() {
  return (
    <div className="bg-black">
      {/* Hero: mesh de luzes em CSS + headline + CTA */}
      <div className="relative flex min-h-[100svh] flex-col items-center overflow-hidden bg-black px-6 pt-6 pb-8">
        {/* blobs de luz desfocados, cores da marca (laranja/rosa/verde) */}
        <div className="pointer-events-none absolute inset-0">
          <div className="blob-a absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#f0521c] opacity-40 blur-[90px]" />
          <div className="blob-b absolute -right-20 top-10 h-72 w-72 rounded-full bg-[#ec4899] opacity-30 blur-[90px]" />
          <div className="blob-c absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-[#25D366] opacity-25 blur-[100px]" />
        </div>

        {/* grade sutil, some nas bordas */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "34px 34px",
            maskImage: "radial-gradient(ellipse at 50% 35%, black 10%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(ellipse at 50% 35%, black 10%, transparent 70%)",
          }}
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black" />

        <div className="relative z-10 flex w-full items-center gap-2">
          <span className="h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 ring-white/80 shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element -- logo estática simples, sem next/image */}
            <img
              src="/assets/logo-brunna.png"
              alt=""
              className="h-full w-full object-cover"
            />
          </span>
          <span className="font-display text-lg italic text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
            Listinha da Bru
          </span>
        </div>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center">
          <h1 className="font-display text-5xl italic text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            Listinha da Bru
          </h1>
          <p className="mt-1 text-sm font-semibold tracking-wide text-white/70">
            @listinhadabru
          </p>
          <p className="mt-5 max-w-xs text-base italic leading-relaxed text-white/90 drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
            Separo pra você os melhores achadinhos e cupons de verdade — direto
            no seu WhatsApp, todos os dias.
          </p>
        </div>

        <div className="relative z-10 w-full">
          <CtaButton label="Entrar no grupo" />
        </div>
      </div>

      {/* Bloco de baixo: bullets + segundo CTA, fundo sólido */}
      <div className="px-6 py-10">
        <ul className="space-y-3 text-left text-sm leading-relaxed text-white/85">
          {BULLETS.map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <span className="mt-0.5 text-[#25D366]" aria-hidden>
                ✅
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-center text-sm text-white/60">
          Entra no grupo, ativa as notificações e não perde nenhuma promoção. 🛍️
        </p>

        <div className="mt-7">
          <CtaButton label="Entrar no grupo" />
        </div>
      </div>
    </div>
  );
}

// Home = página de captura única em cima de uma imagem de fundo (estilo
// "página de vendas" — headline grande sobre foto, CTA em destaque, lista
// de bullets com check). O logo fica só no topo, pequeno; quem carrega a
// identidade visual agora é o background.
//
// O arquivo public/assets/background-brunna.png é editado e salvo por
// fora (Bru cuida da arte) — aqui só referenciamos o caminho. Enquanto o
// arquivo não existe, o gradiente escuro de fundo (bg-black) já deixa a
// página apresentável sozinho, sem depender da imagem carregar.

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
      {/* Hero: foto de fundo + headline + CTA */}
      <div
        className="relative flex min-h-[100svh] flex-col items-center overflow-hidden bg-black bg-cover bg-center px-6 pt-6 pb-8"
        style={{ backgroundImage: "url(/assets/background-brunna.png)" }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/75 via-black/35 to-black" />

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

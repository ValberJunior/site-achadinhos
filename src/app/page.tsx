// Home = hero de captura em duas colunas: texto + CTA na esquerda, foto
// da Bru na direita (empilha no mobile: texto em cima, foto embaixo). O
// nome da marca já aparece grande no Header global — aqui não repete
// título, só o gancho + botão. Fundo claro e quente (tons da marca:
// laranja/pêssego), nada de tema escuro.
//
// public/assets/foto-brunna.png já é um recorte com fundo transparente
// (PNG com alpha) — por isso a foto entra como <img> solta, sem caixa,
// sem aspect-ratio fixo e sem cortar nada: ela "flutua" livre por cima
// do degradê da página, do jeito que apareceria numa arte editada à
// mão. Nada de rounded/overflow-hidden aqui, isso é que prendia ela
// numa caixa antes.

const WHATSAPP_GROUP_URL =
  process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL || "https://chat.whatsapp.com/SEU_LINK_AQUI";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#fff3e8] via-[#ffe6d2] to-[#ffd9bd]">
      {/* manchas de cor bem suaves, só pra dar um toque "moderno" sem pesar */}
      <div className="pointer-events-none absolute inset-0">
        <div className="blob-a absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#f0521c] opacity-[0.12] blur-[90px]" />
        <div className="blob-b absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-[#ec4899] opacity-[0.10] blur-[90px]" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:px-6 md:grid-cols-2 md:items-center md:gap-14 md:py-20">
        {/* Coluna esquerda: gancho + CTA */}
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <p className="font-display text-3xl italic leading-tight text-foreground sm:text-4xl">
            Os melhores achadinhos e cupons de verdade, direto no seu WhatsApp
          </p>
          <p className="mt-4 max-w-md text-base leading-relaxed text-foreground/70">
            Casa, decoração, maternidade, festa e presentes — cupom ativo e
            link direto todo santo dia, sem enrolação.
          </p>

          <a
            href={WHATSAPP_GROUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 block w-full max-w-xs rounded-full bg-[#25D366] py-4 text-center text-lg font-extrabold uppercase tracking-wide text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.6)] transition-transform active:scale-[0.98]"
          >
            Entrar no grupo
          </a>
        </div>

        {/* Coluna direita: foto da Bru, solta (recorte com fundo transparente) */}
        <div className="flex justify-center md:justify-end">
          {/* eslint-disable-next-line @next/next/no-img-element -- recorte PNG estático, sem next/image */}
          <img
            src="/assets/foto-brunna.png"
            alt="Bru"
            className="h-auto max-h-[60vh] w-auto max-w-full object-contain drop-shadow-2xl md:max-h-[70vh]"
          />
        </div>
      </div>
    </div>
  );
}

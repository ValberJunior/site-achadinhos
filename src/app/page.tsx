// Home = página de captura única (modelo "Promos da Isa"): logo, foto,
// nome, tagline e um CTA gigante pro grupo do WhatsApp. As páginas de
// nicho (/nicho/[slug]) continuam existindo pra quem cai direto nelas,
// mas a home não navega mais pelo catálogo — o objetivo agora é 1 clique
// pro grupo.

const WHATSAPP_GROUP_URL =
  process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL || "https://chat.whatsapp.com/SEU_LINK_AQUI";

function CtaButton({ label }: { label: string }) {
  return (
    <a
      href={WHATSAPP_GROUP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full rounded-full bg-[#25D366] py-4 text-center text-lg font-extrabold text-white shadow-lg shadow-[#25D366]/30 transition-transform active:scale-[0.98]"
    >
      {label}
    </a>
  );
}

export default function HomePage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 pt-6 pb-10 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element -- logo estático simples, não precisa de otimização do next/image */}
      <img
        src="/assets/logo-brunna-header.png"
        alt="Listinha da Bru"
        className="h-14 w-auto object-contain"
      />

      <div className="mt-6 h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-lg ring-1 ring-black/5">
        {/* eslint-disable-next-line @next/next/no-img-element -- idem, foto de perfil fixa */}
        <img
          src="/assets/logo-brunna-profile.png"
          alt="Bru"
          className="h-full w-full object-cover"
        />
      </div>

      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground">
        Listinha da Bru
      </h1>
      <p className="mt-1 text-sm font-semibold text-foreground/50">@listinhadabru</p>

      <p className="mt-4 text-base italic text-foreground/70">
        Separo pra você os melhores achadinhos e cupons de verdade — direto no
        seu WhatsApp, todos os dias.
      </p>

      <div className="mt-6 w-full">
        <CtaButton label="ENTRAR NO GRUPO" />
      </div>

      <div className="mt-8 space-y-4 text-left text-sm leading-relaxed text-foreground/70">
        <p>
          Aqui você encontra achadinhos selecionados a dedo: casa e decoração,
          maternidade, itens de festa e lembrancinhas — tudo com cupom ativo e
          link direto, sem enrolação.
        </p>
        <p>
          Todo santo dia rola coisa nova: utilidades do dia a dia, produtos
          pra bebê e mamãe, presentes e aquele achadinho que você nem sabia
          que precisava.
        </p>
        <p>Entra no grupo, ativa as notificações e não perde nenhuma promoção. 🛍️💚</p>
      </div>

      <div className="mt-8 w-full">
        <CtaButton label="ENTRAR NO GRUPO" />
      </div>
    </div>
  );
}

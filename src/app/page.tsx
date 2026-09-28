// Home = página de captura única (modelo "Promos da Isa"): logo, foto,
// nome, tagline e um CTA gigante pro grupo do WhatsApp. As páginas de
// nicho (/nicho/[slug]) continuam existindo com a navegação própria
// delas (ver src/app/nicho/layout.tsx) — a home não navega mais pelo
// catálogo, o objetivo agora é 1 clique pro grupo.
//
// Só existe um arquivo de logo (public/assets/logo-brunna.png), usado
// tanto no badge do topo quanto na foto de perfil circular — sem
// variantes pré-recortadas: o crop é feito em CSS (object-cover) pra
// sempre refletir o arquivo mais recente sem precisar regenerar nada.

const WHATSAPP_GROUP_URL =
  process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL || "https://chat.whatsapp.com/SEU_LINK_AQUI";

function CtaButton({ label }: { label: string }) {
  return (
    <a
      href={WHATSAPP_GROUP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full rounded-full bg-[#25D366] py-4 text-center text-lg font-bold tracking-wide text-white shadow-lg shadow-[#25D366]/25 transition-transform active:scale-[0.98]"
    >
      {label}
    </a>
  );
}

export default function HomePage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 pt-8 pb-12 text-center">
      <div className="flex items-center gap-2">
        <span className="h-9 w-9 overflow-hidden rounded-full shadow-sm ring-1 ring-black/5">
          {/* eslint-disable-next-line @next/next/no-img-element -- logo estática simples, sem next/image */}
          <img
            src="/assets/logo-brunna.png"
            alt=""
            className="h-full w-full object-cover"
          />
        </span>
        <span className="font-display text-lg italic text-foreground/80">
          Listinha da Bru
        </span>
      </div>

      <div className="mt-8 h-36 w-36 overflow-hidden rounded-full border-4 border-white shadow-lg ring-1 ring-black/5">
        {/* eslint-disable-next-line @next/next/no-img-element -- idem, foto de perfil fixa */}
        <img
          src="/assets/logo-brunna.png"
          alt="Bru"
          className="h-full w-full object-cover"
        />
      </div>

      <h1 className="font-display mt-5 text-4xl italic text-foreground">
        Listinha da Bru
      </h1>
      <p className="mt-1 text-sm font-semibold tracking-wide text-foreground/45">
        @listinhadabru
      </p>

      <p className="mt-5 text-base italic leading-relaxed text-foreground/70">
        Separo pra você os melhores achadinhos e cupons de verdade — direto
        no seu WhatsApp, todos os dias.
      </p>

      <div className="mt-7 w-full">
        <CtaButton label="ENTRAR NO GRUPO" />
      </div>

      <div className="mt-10 space-y-4 text-left text-sm leading-relaxed text-foreground/70">
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

      <div className="mt-9 w-full">
        <CtaButton label="ENTRAR NO GRUPO" />
      </div>
    </div>
  );
}

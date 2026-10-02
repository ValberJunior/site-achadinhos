// Home = hero de captura em duas colunas: texto + CTA na esquerda, foto
// da Bru na direita (empilha no mobile: texto em cima, foto embaixo). O
// nome da marca já aparece grande no Header global — aqui não repete
// título, só o gancho + botão.
//
// Fundo: public/assets/background.jpg (ícones de compra/cupom em tom
// pêssego) — sem repetição, cobrindo a seção inteira (cover/center).
//
// public/assets/foto-brunna.png já é um recorte com fundo transparente
// (PNG com alpha) — por isso a foto entra como <img> solta, sem caixa,
// sem aspect-ratio fixo e sem cortar nada: ela "flutua" livre por cima
// do fundo, do jeito que apareceria numa arte editada à mão. Nada de
// rounded/overflow-hidden aqui, isso é que prendia ela numa caixa antes.

import { JoinGroupButton } from "@/components/JoinGroupButton";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden bg-[#fdf1e6]">
      {/* fundo com opacidade reduzida, numa camada própria — se a
          opacidade fosse aplicada na section inteira, o texto e a foto
          por cima também ficariam apagados */}
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage: "url(/assets/background.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl gap-0 px-6 pt-12 pb-0 sm:px-6 md:grid-cols-2 md:items-center md:gap-14 md:pt-20 md:pb-10">
        {/* Coluna esquerda: gancho + CTA — no mobile vem DEPOIS da foto E da
            onda (order-3), já em cima de fundo branco (a onda "entrega" pro
            branco antes do texto começar). No desktop volta pra ordem normal
            (texto esquerda, foto direita, sem fundo branco próprio — o fundo
            pêssego com o padrão continua por trás). Dentro desse bloco, no
            mobile o botão do WhatsApp vem ANTES do parágrafo de apoio
            (order-2/order-3) — no desktop a ordem volta ao normal (parágrafo
            antes do botão) via md:order-none nos dois. */}
        <div className="order-3 relative z-20 -mx-6 -mt-[5px] bg-white px-6 pt-5 pb-[40px] flex flex-col items-center text-center md:order-none md:z-auto md:mx-0 md:mt-0 md:bg-transparent md:px-0 md:pt-0 md:pb-0 md:items-start md:text-left">
          <p className="text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl">
            Os melhores achadinhos e cupons de verdade, direto no seu WhatsApp
          </p>
          <p className="order-3 mt-4 max-w-md text-base leading-relaxed text-foreground/70 md:order-none">
            Casa, decoração, maternidade, festa e presentes — cupom ativo e
            link direto todo santo dia, sem enrolação.
          </p>

          <JoinGroupButton className="cta-pulse order-2 mt-7 flex w-full max-w-xs items-center justify-center gap-2.5 rounded-full bg-[#25D366] py-4 text-lg font-extrabold uppercase tracking-wide text-white transition-transform active:scale-[0.98] disabled:opacity-80 md:order-none">
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className="h-6 w-6 shrink-0 fill-white"
            >
              <path d="M12.04 2.5c-5.26 0-9.53 4.27-9.53 9.53 0 1.68.44 3.3 1.28 4.73L2.5 21.5l4.86-1.27a9.5 9.5 0 0 0 4.68 1.23h.01c5.26 0 9.53-4.27 9.53-9.53s-4.27-9.43-9.54-9.43Zm0 17.4a7.9 7.9 0 0 1-4.03-1.1l-.29-.17-3 .78.8-2.92-.19-.3a7.87 7.87 0 0 1-1.21-4.16c0-4.35 3.54-7.89 7.9-7.89 2.1 0 4.08.82 5.56 2.31a7.83 7.83 0 0 1 2.31 5.58c0 4.36-3.54 7.87-7.85 7.87Zm4.32-5.9c-.24-.12-1.4-.69-1.62-.77-.22-.08-.37-.12-.53.12-.16.24-.6.77-.74.93-.14.16-.27.18-.5.06-.24-.12-1-.37-1.9-1.17-.7-.62-1.18-1.4-1.31-1.63-.14-.24-.01-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.53-1.28-.73-1.75-.19-.46-.38-.4-.53-.4h-.45c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.13 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.4-.57 1.6-1.12.2-.55.2-1.02.14-1.12-.06-.1-.22-.16-.46-.28Z" />
            </svg>
            Entrar no grupo
          </JoinGroupButton>
        </div>

        {/* Coluna direita: foto da Bru, solta (recorte com fundo transparente).
            order-1 no mobile pra vir ANTES do texto (foto em cima). */}
        <div className="order-1 relative z-0 flex justify-center md:order-none md:z-auto md:justify-end">
          {/* eslint-disable-next-line @next/next/no-img-element -- recorte PNG estático, sem next/image */}
          <img
            src="/assets/foto-brunna.png"
            alt="Bru"
            className="h-auto max-h-[60vh] w-auto max-w-full object-contain drop-shadow-2xl md:max-h-[70vh]"
          />
        </div>

        {/* Onda só do mobile — vem logo depois da foto (order-2) e entrega
            pro fundo branco onde o texto/CTA já se apoia. -mx-6 cancela o
            padding do grid pra ela sangrar de ponta a ponta na tela. Some
            no desktop (a onda de lá é a de baixo, depois das duas colunas). */}
        <svg
          viewBox="0 0 1440 400"
          preserveAspectRatio="none"
          aria-hidden
          className="relative z-10 order-2 -mx-6 -mb-1 -mt-[45px] block h-24 w-[calc(100%+3rem)] md:hidden"
        >
          <path
            fill="#ffffff"
            d="M0,190 C 160,300 320,140 480,190 C 640,240 800,80 960,130 C 1120,180 1280,220 1440,150 L1440,400 L0,400 Z"
          />
        </svg>
      </div>

      {/* onda branca do desktop — subida com margin-top negativo pra
          "morder" a parte de baixo da foto/coluna de texto, em vez de só
          encostar embaixo de tudo. margin-bottom negativa continua morden-
          do o rodapé por baixo, sem seam visível na emenda. Só no desktop —
          no mobile quem faz essa transição é a onda de cima, entre a foto
          e o texto. */}
      <svg
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
        aria-hidden
        className="relative -mt-[140px] hidden h-[160px] w-full md:block"
      >
        <path
          fill="#ffffff"
          d="M0,190 C 160,300 320,140 480,190 C 640,240 800,80 960,130 C 1120,180 1280,220 1440,150 L1440,400 L0,400 Z"
        />
      </svg>

      {/* Selos de garantia — seção colada direto entre a wave e o Footer
          (mesmo branco dos dois, sem respiro entre eles), só com padding
          vertical interno pra dar folga ao redor do selo, que fica
          centralizado. PNG já vem com fundo transparente. */}
      <div className="relative bg-white py-8 md:-mt-20">
        {/* eslint-disable-next-line @next/next/no-img-element -- selo estático, sem next/image */}
        <img
          src="/assets/selos-garantia.png"
          alt="Compra segura Shopee"
          className="mx-auto h-auto w-full max-w-[320px] sm:max-w-md md:max-w-xl"
        />
      </div>
    </div>
  );
}

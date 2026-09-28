import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import FacebookPixel from "@/components/FacebookPixel";

// Header, BottomNav e JoinGroupPopup (navegação por nicho + popup de
// entrada por nicho) saíram do layout global: a home agora é uma página
// de captura única, sem menu fixo nem popup de escolha de nicho — só o
// CTA "ENTRAR NO GRUPO". Os componentes continuam existindo (usados por
// /nicho/[slug], que não mudou) e o Header pode voltar se algum dia a
// navegação por nicho for reintroduzida na home.

// Propositalmente SEM next/font/google: usar a stack de fontes do sistema
// evita qualquer requisição externa de fonte (zero-CLS, zero round-trip),
// o que pesa mais pra "extremamente performático" do que a fonte em si —
// e evita depender de egress até fonts.googleapis.com no build da VPS.

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Listinha da Bru — achadinhos e cupons com desconto real",
    template: "%s — Listinha da Bru",
  },
  description:
    "Achadinhos selecionados por dia com cupom ativo e link direto — casa, maternidade, festa e presentes, direto no grupo do WhatsApp.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Listinha da Bru",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: "#f0521c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Listinha da Bru",
              url: siteUrl,
              description:
                "Catálogo de achadinhos e cupons de desconto ativos, com entrada direta pelo grupo do WhatsApp.",
            }),
          }}
        />
        <main className="min-h-[60vh]">{children}</main>
        <Footer />
        <FacebookPixel />
      </body>
    </html>
  );
}

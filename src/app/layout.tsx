import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import FacebookPixel from "@/components/FacebookPixel";

// Propositalmente SEM next/font/google: usar a stack de fontes do sistema
// evita qualquer requisição externa de fonte (zero-CLS, zero round-trip),
// o que pesa mais pra "extremamente performático" do que a fonte em si —
// e evita depender de egress até fonts.googleapis.com no build da VPS.

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Minha Listinha — achadinhos e cupons com desconto real",
    template: "%s — Minha Listinha",
  },
  description:
    "Achadinhos selecionados por nicho com cupom ativo e link de afiliado direto — casa, infantil e eletrônicos, sempre atualizado.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Minha Listinha",
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
              name: "Minha Listinha",
              url: siteUrl,
              description:
                "Catálogo de achadinhos e cupons de desconto ativos, organizados por nicho.",
            }),
          }}
        />
        <Header />
        <main className="min-h-[60vh] pb-16">{children}</main>
        <Footer />
        <BottomNav />
        <FacebookPixel />
      </body>
    </html>
  );
}

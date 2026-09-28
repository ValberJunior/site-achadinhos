import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { JoinGroupPopup } from "@/components/JoinGroupPopup";

// Layout só do segmento /nicho: mantém o Header (com voltar pra home) e o
// BottomNav/JoinGroupPopup de navegação por nicho que a home não usa mais
// (ela virou página de captura única, ver src/app/layout.tsx e page.tsx).
export default function NichoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // O <main> em si já vem do layout raiz (src/app/layout.tsx) — aqui só
  // entra o que é específico da navegação por nicho, mais o padding
  // inferior pra não ficar por baixo do BottomNav fixo.
  return (
    <>
      <Header />
      <div className="pb-16">{children}</div>
      <BottomNav />
      <JoinGroupPopup />
    </>
  );
}

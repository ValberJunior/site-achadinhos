import { BottomNav } from "@/components/BottomNav";
import { JoinGroupPopup } from "@/components/JoinGroupPopup";

// Layout só do segmento /nicho: Header já vem do layout raiz (agora é
// global). Aqui só entra o que é específico da navegação por nicho —
// BottomNav e o popup de escolha de nicho — mais o padding inferior pra
// não ficar por baixo do BottomNav fixo.
export default function NichoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="pb-16">{children}</div>
      <BottomNav />
      <JoinGroupPopup />
    </>
  );
}

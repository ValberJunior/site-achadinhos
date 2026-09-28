"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", emoji: "🏡", label: "Início" },
  { href: "/nicho/casa-mesa-banho", emoji: "🔍", label: "Categorias" },
  { href: "/#favoritos", emoji: "🤍", label: "Salvos" },
] as const;

// Bottom tab bar fixo — é o que dá a sensação de "app" (Shopee/Mercado
// Livre/Magalu todos têm um) em vez de "site aberto no navegador".
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 shadow-[0_-4px_16px_-8px_rgba(16,18,21,0.12)] backdrop-blur supports-[backdrop-filter]:bg-surface/80"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-3xl items-stretch justify-around">
        {TABS.map((tab) => {
          const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href.split("#")[0]);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px]"
            >
              <span
                className={`flex h-7 w-9 items-center justify-center rounded-full text-lg transition-colors ${
                  active ? "bg-brand-soft" : "opacity-60"
                }`}
                aria-hidden
              >
                {tab.emoji}
              </span>
              <span className={active ? "font-bold text-brand" : "font-medium text-foreground/60"}>
                {tab.label}
              </span>
            </Link>
          );
        })}

        {/* Não é navegação de página — abre o JoinGroupPopup (ver
            layout.tsx) via evento global, então é um <button>, não <Link>. */}
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event("open-join-popup"))}
          className="flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px]"
        >
          <span
            className="flex h-7 w-9 items-center justify-center rounded-full text-lg opacity-60"
            aria-hidden
          >
            💬
          </span>
          <span className="font-medium text-foreground/60">Grupos</span>
        </button>
      </div>
    </nav>
  );
}

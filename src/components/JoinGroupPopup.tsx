"use client";

import { useEffect, useState } from "react";
import { NICHE_LIST } from "@/lib/niches";

// Popup de "entrar no grupo de achadinhos" — a pessoa só escolhe o nicho,
// nunca digita telefone. O clique já reserva a vaga (ou abre grupo novo se
// precisar, ver /api/groups/join) e redireciona pro link de convite do
// WhatsApp na hora.
//
// Aparece sozinho uma vez por sessão de navegador (sessionStorage, não
// localStorage — reaparece em nova aba/sessão, não fica marcado pra
// sempre) e também pode ser reaberto a qualquer momento disparando o
// evento "open-join-popup" (usado pelo BottomNav, aba "Grupos").
const SESSION_KEY = "join-popup-seen";
const AUTO_OPEN_DELAY_MS = 4000;

export function JoinGroupPopup() {
  const [open, setOpen] = useState(false);
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      if (!sessionStorage.getItem(SESSION_KEY)) {
        timer = setTimeout(() => {
          setOpen(true);
          sessionStorage.setItem(SESSION_KEY, "1");
        }, AUTO_OPEN_DELAY_MS);
      }
    } catch {
      // sessionStorage indisponível (modo privado etc.) — sem problema,
      // só não mostra automático; ainda dá pra abrir pelo BottomNav.
    }

    function handleForceOpen() {
      setOpen(true);
    }
    window.addEventListener("open-join-popup", handleForceOpen);

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener("open-join-popup", handleForceOpen);
    };
  }, []);

  async function handlePick(nicheKey: string, slug: string) {
    setLoadingSlug(slug);
    setError(false);
    try {
      const res = await fetch("/api/groups/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nicheKey, sourcePath: window.location.pathname }),
      });
      if (!res.ok) throw new Error("failed");
      const data: { inviteLink: string } = await res.json();
      window.location.href = data.inviteLink;
    } catch {
      setError(true);
      setLoadingSlug(null);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="join-popup-title"
    >
      <div className="w-full max-w-sm rounded-t-[1.5rem] bg-surface p-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-xl sm:rounded-[1.5rem] sm:pb-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="join-popup-title" className="text-lg font-extrabold leading-tight">
              📲 Entra no grupo de achadinhos
            </h2>
            <p className="mt-1 text-sm text-foreground/65">
              Cupom sai primeiro lá — escolhe seu nicho e entra na hora, sem cadastro.
            </p>
          </div>
          <button
            type="button"
            aria-label="Fechar"
            onClick={() => setOpen(false)}
            className="shrink-0 rounded-full p-1 text-foreground/50 hover:bg-surface-2"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {NICHE_LIST.map((niche) => {
            const isLoading = loadingSlug === niche.slug;
            return (
              <button
                key={niche.slug}
                type="button"
                disabled={loadingSlug !== null}
                onClick={() => handlePick(niche.key, niche.slug)}
                className="flex items-center gap-3 rounded-2xl border border-border bg-surface-2 px-4 py-3 text-left text-sm font-semibold transition-colors hover:border-brand disabled:opacity-60"
              >
                <span className="text-xl" aria-hidden>
                  {niche.emoji}
                </span>
                <span className="flex-1">{niche.label}</span>
                {isLoading ? (
                  <span className="text-xs font-medium text-foreground/50">Entrando…</span>
                ) : (
                  <span className="text-whatsapp">→</span>
                )}
              </button>
            );
          })}
        </div>

        {error ? (
          <p className="mt-3 text-xs font-medium text-red-500">
            Deu ruim pra achar seu grupo — tenta de novo em instantes.
          </p>
        ) : null}
      </div>
    </div>
  );
}

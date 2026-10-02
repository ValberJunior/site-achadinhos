"use client";

import { useEffect, useState } from "react";
import { JoinGroupButton } from "@/components/JoinGroupButton";

// Popup de "entrar no grupo de achadinhos" — um botão só, sem escolha de
// nicho (dashboard parou de separar grupo por nicho, ver src/lib/data.ts) e
// sem pedir telefone (decisão de 02/10/2026: zero fricção no clique). O
// clique já reserva a vaga (ou abre grupo novo se precisar, ver
// /api/groups/join) e redireciona pro link de convite do WhatsApp na hora.
//
// Aparece sozinho uma vez por sessão de navegador (sessionStorage, não
// localStorage — reaparece em nova aba/sessão, não fica marcado pra
// sempre) e também pode ser reaberto a qualquer momento disparando o
// evento "open-join-popup" (usado pelo BottomNav, aba "Grupos").
const SESSION_KEY = "join-popup-seen";
const AUTO_OPEN_DELAY_MS = 4000;

export function JoinGroupPopup() {
  const [open, setOpen] = useState(false);

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
              Cupom sai primeiro lá — um toque e você já está dentro, sem cadastro.
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

        <JoinGroupButton className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-whatsapp py-3.5 text-base font-extrabold text-white transition-transform active:scale-[0.98] disabled:opacity-70">
          Entrar no grupo agora →
        </JoinGroupButton>
      </div>
    </div>
  );
}

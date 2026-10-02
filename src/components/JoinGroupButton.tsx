"use client";

import { useState, type ReactNode } from "react";

// Botão que reserva vaga num grupo (via /api/groups/join — sem nicho, ver
// src/lib/data.ts) e redireciona pro link de convite assim que a resposta
// chega. Único clique, sem campo nenhum pra preencher (decisão de
// 02/10/2026: nada de fricção no clique). Usado no hero da home e no
// JoinGroupPopup.
//
// Renderiza só o <button> (sem wrapper) de propósito: o `className`
// recebido carrega classes de layout do flex pai (order-N, w-full,
// mt-N) que só funcionam no item flex direto — um <div> por fora
// quebraria isso. Por isso o erro vira o próprio texto do botão, não
// um elemento irmão.
export function JoinGroupButton({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function handleClick() {
    if (status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/groups/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourcePath: window.location.pathname }),
      });
      if (!res.ok) throw new Error("failed");
      const data: { inviteLink: string } = await res.json();
      window.location.href = data.inviteLink;
    } catch {
      setStatus("error");
    }
  }

  return (
    <button type="button" onClick={handleClick} disabled={status === "loading"} className={className}>
      {status === "loading"
        ? "Entrando…"
        : status === "error"
          ? "Deu ruim, toca de novo ↺"
          : children}
    </button>
  );
}

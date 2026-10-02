"use client";

import { useRef, useState, type ReactNode } from "react";

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
//
// Trava com useRef (não só o state) pra bloquear cliques duplos de
// verdade — o `disabled` do DOM e o `status` do React só valem a partir
// do próximo render, e um clique duplo rápido (duplo toque no mobile,
// clique + Enter, etc.) pode disparar handleClick de novo antes disso.
// O ref é síncrono: o segundo clique já cai no primeiro `if` e não gera
// uma segunda reserva/criação de grupo (decisão de 02/10/2026, depois de
// ver grupos duplicados virarem de teste).
export function JoinGroupButton({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const lockRef = useRef(false);

  async function handleClick() {
    if (lockRef.current) return;
    lockRef.current = true;
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
      // Não libera o lock no sucesso de propósito — a navegação já está a
      // caminho, não tem porquê permitir clicar de novo antes de sair da
      // página.
    } catch {
      setStatus("error");
      lockRef.current = false; // libera pra permitir tentar de novo
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={status === "loading"}
      aria-busy={status === "loading"}
      className={className}
    >
      {status === "loading"
        ? "Entrando…"
        : status === "error"
          ? "Deu ruim, toca de novo ↺"
          : children}
    </button>
  );
}

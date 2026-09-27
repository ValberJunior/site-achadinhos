"use client";

import { useState } from "react";
import { trackLead } from "./FacebookPixel";

export function NewsletterForm({
  nicheKey,
  sourcePath,
}: {
  nicheKey?: string;
  sourcePath: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!contact.trim()) return;
    setStatus("loading");

    const isEmail = contact.includes("@");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: isEmail ? contact : undefined,
          whatsapp: isEmail ? undefined : contact,
          nicheKey,
          sourcePath,
        }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("done");
      trackLead();
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className="rounded-xl bg-accent/10 px-4 py-3 text-sm font-medium text-accent">
        Recebido! Em breve você recebe os melhores achadinhos direto no seu contato.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
      <input
        type="text"
        placeholder="Seu nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-brand sm:w-40"
      />
      <input
        type="text"
        required
        placeholder="E-mail ou WhatsApp"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        className="w-full flex-1 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-brand"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full shrink-0 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-auto"
      >
        {status === "loading" ? "Enviando..." : "Quero receber"}
      </button>
      {status === "error" ? (
        <p className="text-xs text-red-500">Deu ruim, tenta de novo em instantes.</p>
      ) : null}
    </form>
  );
}

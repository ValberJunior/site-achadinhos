import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-2 text-base shadow-sm"
            aria-hidden
          >
            🛍️
          </span>
          <span className="text-lg font-extrabold tracking-tight">
            Listinha da Bru
          </span>
        </Link>
        <span className="hidden text-sm font-medium text-foreground/60 sm:block">
          achadinhos com cupom de verdade
        </span>
      </div>
    </header>
  );
}

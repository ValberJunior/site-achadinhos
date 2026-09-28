import Link from "next/link";

// Header grande de verdade — logo e nome da marca, sem espremer num
// badge pequeno. É o único lugar onde "Listinha da Bru" aparece como
// título agora; a home não repete o nome no meio do hero.
export function Header() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4 sm:px-6 sm:py-5">
        <Link href="/" className="flex items-center gap-3">
          <span className="h-14 w-14 shrink-0 overflow-hidden rounded-full shadow-md ring-2 ring-white sm:h-16 sm:w-16">
            {/* eslint-disable-next-line @next/next/no-img-element -- logo estática simples */}
            <img
              src="/assets/logo-brunna.png"
              alt="Listinha da Bru"
              className="h-full w-full object-cover"
            />
          </span>
          <span className="font-handwritten text-3xl leading-none text-gold-dark sm:text-4xl">
            Listinha da Bru <span className="text-lg sm:text-xl">❤️</span>
          </span>
        </Link>
      </div>
    </header>
  );
}

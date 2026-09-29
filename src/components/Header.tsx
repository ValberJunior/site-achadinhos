import Link from "next/link";

// Header grande de verdade — logo e nome da marca, sem espremer num
// badge pequeno. É o único lugar onde "Listinha da Bru" aparece como
// título agora; a home não repete o nome no meio do hero.
export function Header() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5">
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

        <a
          href="https://www.instagram.com/listinhadabru"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram da Listinha da Bru"
          className="shrink-0 transition-opacity hover:opacity-70" style={{ color: "#c9992e" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-7 w-7 sm:h-8 sm:w-8"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37a4 4 0 1 1-7.914 1.174A4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        </a>
      </div>
    </header>
  );
}

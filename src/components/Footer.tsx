export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-0 bg-white px-4 py-6 pb-10 text-sm text-foreground/60 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <p>
          ✨ <span className="text-xs">Listinha da Bru</span> reúne achadinhos e cupons ativos que a gente mesmo
          separa e testa — os preços e descontos mudam o tempo todo, então o
          link de compra sempre confirma o valor final antes de fechar.
        </p>
        <p className="mt-4 text-xs">
          © {currentYear} Desenvolvido por Valber Junior | Todos os direitos reservados
        </p>
      </div>
    </footer>
  );
}

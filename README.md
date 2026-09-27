# Minha Listinha — Site de Achadinhos

Catálogo de achadinhos/cupons ativos por nicho (casa-mesa-banho, infantil,
eletrônicos), servindo de destino de marketing direto pros grupos de
WhatsApp do projeto **Marketing de Vendas**. Implementa exatamente o desenho
de `Site-achadinhos-futuro.md`: lê direto do Postgres compartilhado do
projeto (`coupons` published=true + `whatsapp_groups` status=active), sem
workflow n8n próprio, com Next.js SSG+ISR (revalida a cada 30min).

## Stack

- Next.js 16 (App Router, Turbopack, React 19) + TypeScript + Tailwind v4
- `postgres` (postgres.js) pra ler o mesmo Postgres dos workflows W1-W10
- Sem `next/font/google` de propósito — fonte de sistema, zero requisição
  externa, zero CLS
- Deploy como container standalone (`output: "standalone"`)

## Rodando local

1. `npm install`
2. Copie `.env.example` para `.env.local` e aponte `DATABASE_URL` pro
   Postgres do projeto (mesmo banco `nutra_usa` usado pelos workflows —
   local, VPN/túnel até a VPS2, ou uma cópia local com o mesmo schema).
3. Garanta que o schema está aplicado nesse banco, nesta ordem:
   `init_marketing_vendas.sql` → `alter_coupons_site_fields.sql` →
   `create_site_leads.sql` (novo, deste projeto — ver abaixo) →
   `seed_test_achadinhos.sql` (opcional, só pra ter dado de teste)
4. `npm run dev` — abre em `http://localhost:3000`

## Variáveis de ambiente

Ver `.env.example`. Resumo:

| Variável | Obrigatória | O que é |
|---|---|---|
| `DATABASE_URL` | sim | Postgres do projeto (leitura de `coupons`/`niches`/`whatsapp_groups`, escrita só em `site_leads`) |
| `NEXT_PUBLIC_SITE_URL` | sim | URL pública, usada em metadata/sitemap/JSON-LD/OG |
| `NEXT_PUBLIC_FB_PIXEL_ID` | não | Se vazio, o Pixel simplesmente não carrega (nenhum script/beacon é injetado) |

O intervalo de revalidação ISR (30min) é fixo no código
(`export const revalidate = 1800` em `src/app/page.tsx` e
`src/app/nicho/[slug]/page.tsx`) — o Next 16 exige que esse valor seja um
literal estático, não dá pra vir de env var.

## O que o site lê e o que escreve

- **Lê** (nunca escreve): `coupons` (`published = true`), `niches`,
  `whatsapp_groups` (`status = 'active'`) — populadas pelos workflows
  W3/W7/W8/W10, o site só consome.
- **Escreve**: só em `site_leads` (formulário de newsletter/captura),
  tabela nova criada por `create_site_leads.sql` (na raiz deste repo —
  copie pra pasta `Marketing-vendas` e rode junto com as outras
  migrations, mesmo padrão `docker exec -i ... psql ... < arquivo.sql`).

## Estrutura

```
src/
  app/
    page.tsx                 → home (destaques por nicho)
    nicho/[slug]/page.tsx     → catálogo completo de um nicho (SSG+ISR)
    api/leads/route.ts       → único endpoint de escrita (site_leads)
    sitemap.ts / robots.ts   → SEO técnico
    llms.txt/route.ts        → resumo estruturado pra agentes de IA
    opengraph-image.tsx      → OG image gerada por código (sem asset externo)
  components/                → CouponCard, NicheNav, NewsletterForm, FacebookPixel, Header, Footer
  lib/
    db.ts                    → client Postgres (singleton)
    data.ts                  → todas as queries de leitura do site
    niches.ts                → mapeamento niches.name <-> slug/label da URL
    types.ts                 → tipos + formatBRL/formatDiscount
```

## Deploy na VPS2

Mesma VPS2/Docker Compose do resto do projeto (ver `Infra.md`), como um
novo serviço:

1. Copie esta pasta pra VPS (ou clone o repo, se for versionado)
2. Veja `docker-compose.snippet.yml` — cole como um novo `service` no
   compose já existente, ajustando rede/porta/domínio
3. `Dockerfile` já está pronto (multi-stage, imagem final não carrega
   `node_modules` completo — só o output `standalone` do Next)
4. Configure `DATABASE_URL` apontando pro `nutra_postgres` pela rede
   interna do Docker (não expor o Postgres publicamente pra isso)
5. Reverse proxy (nginx/traefik/caddy, o que já tiver na VPS) → porta 3000
   do container, com HTTPS

## Pendências conhecidas (ver `Site-achadinhos-futuro.md` "Em aberto")

- Pixel ID/conta de anúncios real ainda não configurados
- Domínio próprio a definir
- `next.config.ts` tem um placeholder de `remotePatterns` pro CDN de
  imagem da Shopee (`*.susercontent.com`) — ajustar pro domínio real assim
  que o W7 estiver salvando `photo_url` de verdade
- Artigos SEO "top N" por nicho (gerados por IA) são uma ideia separada,
  não fazem parte deste catálogo — ver seção correspondente no
  `Site-achadinhos-futuro.md`

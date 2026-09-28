# Build multi-stage — usa `output: "standalone"` (next.config.ts) pra
# copiar só o necessário pra rodar, sem precisar do node_modules inteiro
# na imagem final. Pensado pro mesmo Docker Compose da VPS2 (ver Infra.md).

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# NEXT_PUBLIC_* é inlinado pelo Next no bundle do client durante o build,
# não em runtime — por isso precisa chegar como build-arg (via GitHub
# Actions --build-arg, lendo de um Secret), não só como env do container
# rodando depois. Sem valor, cai no fallback já hardcoded em page.tsx.
ARG NEXT_PUBLIC_WHATSAPP_GROUP_URL
ENV NEXT_PUBLIC_WHATSAPP_GROUP_URL=${NEXT_PUBLIC_WHATSAPP_GROUP_URL}
# DATABASE_URL real só é necessário em runtime (leitura de dados), não em
# build time — build não faz nenhuma query, generateStaticParams só lista
# os 3 slugs fixos de niches.ts.
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]

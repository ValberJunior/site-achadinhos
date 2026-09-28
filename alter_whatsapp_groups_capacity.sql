-- alter_whatsapp_groups_capacity.sql
-- Complemento aditivo ao init_marketing_vendas.sql — adiciona capacidade
-- máxima em whatsapp_groups, pra decidir quando abrir um grupo novo em vez
-- de continuar adicionando gente no atual.
--
-- Decisão (27/09/2026): 950 como régua de corte, não 1024 (teto real do
-- WhatsApp) — margem de segurança pra não bater exatamente no limite
-- técnico (contagem local pode ficar um pouco atrasada em relação ao
-- WhatsApp de verdade) e pra reduzir o padrão de "grupo enchendo rápido
-- perto do teto", que é o tipo de comportamento que mais chama atenção de
-- bloqueio automático pra números usando automação (Baileys/Evolution API).
--
-- Idempotente: pode rodar mais de uma vez.
--
-- Como rodar:
--   docker exec -i nutra_postgres psql -U nutra_admin -d nutra_usa < alter_whatsapp_groups_capacity.sql

ALTER TABLE whatsapp_groups
  ADD COLUMN IF NOT EXISTS max_members INT NOT NULL DEFAULT 950;

-- JID do grupo no WhatsApp (ex: "1203630...@g.us") — é o identificador que
-- o Evolution API manda de volta na criação e também é o que vem no
-- webhook de "novo participante". Sem isso não dá pra saber, ao receber o
-- webhook, a qual linha de whatsapp_groups ele se refere.
ALTER TABLE whatsapp_groups
  ADD COLUMN IF NOT EXISTS group_jid VARCHAR(50);

CREATE UNIQUE INDEX IF NOT EXISTS idx_whatsapp_groups_jid ON whatsapp_groups(group_jid);

-- Grupos que já existem e não têm member_count preenchido não devem ser
-- tratados como "cheios" nem "vazios" por engano — NULL já é tratado como
-- "sem vaga preenchida ainda" na query de escolha de grupo (COALESCE pro
-- pior caso, ver src/lib/data.ts).
--
-- Grupos criados manualmente (antes desse fluxo existir) vão ficar com
-- group_jid NULL — eles continuam funcionando pra exibir na página de
-- nicho, só não recebem o webhook de match automático até alguém
-- preencher o JID deles manualmente.

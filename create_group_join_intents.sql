-- create_group_join_intents.sql
-- Complemento aditivo ao init_marketing_vendas.sql — correlação entre "a
-- pessoa clicou pra entrar no grupo X" (site) e "alguém entrou no grupo X"
-- (webhook do Evolution API), já que o WhatsApp não dá nenhum jeito de ligar
-- os dois eventos diretamente (clique num link de convite não avisa o site
-- de nada — só se sabe depois, pelo grupo em si).
--
-- Correlação é por JANELA DE TEMPO + GRUPO, não é garantia matemática: se
-- duas pessoas clicarem pro mesmo grupo quase ao mesmo tempo, o match pode
-- errar quem é quem. Pra tráfego baixo/médio isso é aceitável; se virar
-- problema, a única saída de verdade é pedir o telefone antes de
-- redirecionar (troca a fricção zero por certeza).
--
-- Idempotente: pode rodar mais de uma vez.
--
-- Como rodar:
--   docker exec -i nutra_postgres psql -U nutra_admin -d nutra_usa < create_group_join_intents.sql

CREATE TABLE IF NOT EXISTS group_join_intents (
  id                SERIAL PRIMARY KEY,
  niche_id          INT NOT NULL REFERENCES niches(id),
  whatsapp_group_id INT NOT NULL REFERENCES whatsapp_groups(id),
  source_path       TEXT,                    -- de onde veio o clique (home, /nicho/x, etc.)
  created_at        TIMESTAMP DEFAULT NOW(), -- momento do clique / redirect
  matched_phone     VARCHAR(30),             -- preenchido pelo webhook quando casa com uma entrada real
  matched_at        TIMESTAMP                -- momento em que o webhook casou esse intent
);

-- Acelera a busca por "intent mais recente sem match desse grupo", que é
-- exatamente a query que o webhook roda toda vez que alguém entra.
CREATE INDEX IF NOT EXISTS idx_group_join_intents_pending
  ON group_join_intents(whatsapp_group_id, created_at DESC)
  WHERE matched_at IS NULL;

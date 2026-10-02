-- make_group_join_intents_niche_optional.sql
-- Complemento aditivo. O dashboard (dash-mkt) parou de exigir nicho na
-- criação de grupos — todo grupo novo nasce com niche_id NULL ("genérico").
-- O fluxo de entrada (reserveGroupSlot, ver src/lib/data.ts) acompanhou essa
-- mudança e não filtra mais por nicho, então group_join_intents.niche_id
-- não pode mais ser obrigatório.
--
-- Idempotente: pode rodar mais de uma vez.
--
-- Como rodar:
--   docker exec -i nutra_postgres psql -U nutra_admin -d nutra_usa < make_group_join_intents_niche_optional.sql

ALTER TABLE group_join_intents ALTER COLUMN niche_id DROP NOT NULL;

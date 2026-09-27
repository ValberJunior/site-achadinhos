-- create_site_leads.sql
-- Complemento aditivo ao init_marketing_vendas.sql — tabela de captura de
-- leads da newsletter/inscrição do Site de Achadinhos (Site-achadinhos-futuro.md,
-- item "em aberto": "Schema exato da tabela site_leads").
-- Decisão (16/09/2026): captura nome + (email OU whatsapp), niche de origem
-- (pra segmentar por interesse) e a origem da página (qual /nicho/[slug] ou
-- home gerou o lead), pra permitir tanto e-mail marketing quanto convite
-- direcionado pro grupo de WhatsApp certo depois.
-- Idempotente: pode rodar mais de uma vez.
--
-- Como rodar:
--   docker exec -i nutra_postgres psql -U nutra_admin -d nutra_usa < create_site_leads.sql

CREATE TABLE IF NOT EXISTS site_leads (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(150),
  email         VARCHAR(255),
  whatsapp      VARCHAR(30),
  niche_id      INT REFERENCES niches(id),   -- nicho de interesse, se veio de uma página de nicho
  source_path   TEXT,                        -- ex: '/nicho/casa-mesa-banho' ou '/'
  invited_at    TIMESTAMP,                    -- quando (se) foi convidado pro grupo de WhatsApp
  created_at    TIMESTAMP DEFAULT NOW(),
  CONSTRAINT site_leads_contact_check CHECK (email IS NOT NULL OR whatsapp IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_site_leads_niche ON site_leads(niche_id, created_at);

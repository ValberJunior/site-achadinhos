import type { Coupon, WhatsappGroup } from "./types";
import type { NicheKey } from "./niches";

// Dados de demonstração — espelho exato do seed_test_achadinhos.sql.
// Usado SOMENTE quando DATABASE_URL não está configurada (ex.: preview
// local no celular, sem precisar instalar Postgres na máquina). Em
// qualquer ambiente com DATABASE_URL definida, esse arquivo é ignorado
// e o site lê do banco real normalmente — ver src/lib/data.ts.

interface FixtureCoupon extends Coupon {
  niche_key: NicheKey;
}

const NOW = new Date().toISOString();

export const FIXTURE_COUPONS: FixtureCoupon[] = [
  { id: 1, niche_id: 1, niche_key: "casa_mesa_banho", marketplace: "shopee", product_name: "Jogo de Panelas Antiaderente 5 Peças", discount_pct: "38.00", original_price: "189.90", price: "117.70", photo_url: null, product_url: "https://shopee.com.br/product/000001", affiliate_url: "https://s.shopee.com.br/TESTE-panelas5pc", copy: "Panela boa é a que não gruda — 5 peças por menos de R$120 com o cupom de hoje.", published: true, found_at: NOW, published_at: NOW },
  { id: 2, niche_id: 1, niche_key: "casa_mesa_banho", marketplace: "shopee", product_name: "Jogo de Cama Queen 4 Peças 200 Fios", discount_pct: "45.00", original_price: "149.90", price: "82.45", photo_url: null, product_url: "https://shopee.com.br/product/000002", affiliate_url: "https://s.shopee.com.br/TESTE-jogodecama200", copy: "Cama nova por menos de R$85. 200 fios, queen, 4 peças completas.", published: true, found_at: NOW, published_at: NOW },
  { id: 3, niche_id: 1, niche_key: "casa_mesa_banho", marketplace: "shopee", product_name: "Organizador de Cozinha Empilhável 3 Andares", discount_pct: "30.00", original_price: "79.90", price: "55.90", photo_url: null, product_url: "https://shopee.com.br/product/000003", affiliate_url: "https://s.shopee.com.br/TESTE-organizadorcozinha", copy: "Acabou o caos no armário — organizador empilhável com 30% off.", published: true, found_at: NOW, published_at: NOW },
  { id: 4, niche_id: 1, niche_key: "casa_mesa_banho", marketplace: "shopee", product_name: "Toalha de Banho Gigante 100% Algodão", discount_pct: "25.00", original_price: "59.90", price: "44.90", photo_url: null, product_url: "https://shopee.com.br/product/000004", affiliate_url: "https://s.shopee.com.br/TESTE-toalhabanho", copy: "Toalha grande, felpuda e 25% mais barata hoje.", published: true, found_at: NOW, published_at: NOW },
  { id: 5, niche_id: 1, niche_key: "casa_mesa_banho", marketplace: "shopee", product_name: "Suporte de Panela e Utensílios de Parede", discount_pct: "20.00", original_price: "39.90", price: "31.90", photo_url: null, product_url: "https://shopee.com.br/product/000005", affiliate_url: "https://s.shopee.com.br/TESTE-suporteutensilios", copy: "Libera espaço na bancada com esse suporte de parede.", published: true, found_at: NOW, published_at: NOW },

  { id: 6, niche_id: 2, niche_key: "infantil", marketplace: "shopee", product_name: "Brinquedo Educativo Blocos de Montar 100 Peças", discount_pct: "35.00", original_price: "69.90", price: "45.40", photo_url: null, product_url: "https://shopee.com.br/product/000006", affiliate_url: "https://s.shopee.com.br/TESTE-blocosmontar100", copy: "100 peças de montar por menos de R$46 — criançada entretida.", published: true, found_at: NOW, published_at: NOW },
  { id: 7, niche_id: 2, niche_key: "infantil", marketplace: "shopee", product_name: "Mochila Escolar Infantil Personagem", discount_pct: "28.00", original_price: "99.90", price: "71.90", photo_url: null, product_url: "https://shopee.com.br/product/000007", affiliate_url: "https://s.shopee.com.br/TESTE-mochilaescolar", copy: "Mochila de personagem com 28% off — hora de voltar pra escola.", published: true, found_at: NOW, published_at: NOW },
  { id: 8, niche_id: 2, niche_key: "infantil", marketplace: "shopee", product_name: "Kit Quebra-Cabeça Educativo 3 Níveis", discount_pct: "40.00", original_price: "49.90", price: "29.90", photo_url: null, product_url: "https://shopee.com.br/product/000008", affiliate_url: "https://s.shopee.com.br/TESTE-quebracabeca3n", copy: "3 níveis de dificuldade, por menos de R$30.", published: true, found_at: NOW, published_at: NOW },
  { id: 9, niche_id: 2, niche_key: "infantil", marketplace: "shopee", product_name: "Cadeirinha de Alimentação Portátil", discount_pct: "22.00", original_price: "159.90", price: "124.70", photo_url: null, product_url: "https://shopee.com.br/product/000009", affiliate_url: "https://s.shopee.com.br/TESTE-cadeirinhaalim", copy: "Portátil e dobrável, ótima pra viagem.", published: true, found_at: NOW, published_at: NOW },
  { id: 10, niche_id: 2, niche_key: "infantil", marketplace: "shopee", product_name: "Tapete Sensorial de Atividades", discount_pct: "33.00", original_price: "89.90", price: "60.20", photo_url: null, product_url: "https://shopee.com.br/product/000010", affiliate_url: "https://s.shopee.com.br/TESTE-tapetesensorial", copy: "Estímulo sensorial com 33% de desconto.", published: true, found_at: NOW, published_at: NOW },

  { id: 11, niche_id: 3, niche_key: "eletronicos", marketplace: "shopee", product_name: "Fone de Ouvido Bluetooth TWS", discount_pct: "42.00", original_price: "89.90", price: "52.10", photo_url: null, product_url: "https://shopee.com.br/product/000011", affiliate_url: "https://s.shopee.com.br/TESTE-fonebttws", copy: "TWS com 42% off — menos de R$53.", published: true, found_at: NOW, published_at: NOW },
  { id: 12, niche_id: 3, niche_key: "eletronicos", marketplace: "shopee", product_name: "Carregador Portátil Power Bank 20000mAh", discount_pct: "30.00", original_price: "79.90", price: "55.90", photo_url: null, product_url: "https://shopee.com.br/product/000012", affiliate_url: "https://s.shopee.com.br/TESTE-powerbank20k", copy: "20000mAh pra nunca mais ficar sem bateria.", published: true, found_at: NOW, published_at: NOW },
  { id: 13, niche_id: 3, niche_key: "eletronicos", marketplace: "shopee", product_name: "Smartwatch com Monitor Cardíaco", discount_pct: "25.00", original_price: "199.90", price: "149.90", photo_url: null, product_url: "https://shopee.com.br/product/000013", affiliate_url: "https://s.shopee.com.br/TESTE-smartwatchcard", copy: "Monitor cardíaco por menos de R$150.", published: true, found_at: NOW, published_at: NOW },
  { id: 14, niche_id: 3, niche_key: "eletronicos", marketplace: "shopee", product_name: "Suporte de Celular Articulado pra Mesa", discount_pct: "20.00", original_price: "34.90", price: "27.90", photo_url: null, product_url: "https://shopee.com.br/product/000014", affiliate_url: "https://s.shopee.com.br/TESTE-suportecelular", copy: "Suporte articulado por menos de R$28.", published: true, found_at: NOW, published_at: NOW },
  { id: 15, niche_id: 3, niche_key: "eletronicos", marketplace: "shopee", product_name: "Mini Projetor Portátil Full HD", discount_pct: "35.00", original_price: "249.90", price: "162.40", photo_url: null, product_url: "https://shopee.com.br/product/000015", affiliate_url: "https://s.shopee.com.br/TESTE-miniprojetor", copy: "Full HD portátil com 35% off.", published: true, found_at: NOW, published_at: NOW },
];

export const FIXTURE_GROUPS: (WhatsappGroup & { niche_key: NicheKey })[] = [
  { id: 1, niche_id: 1, niche_key: "casa_mesa_banho", name: "Achadinhos casa_mesa_banho #1", invite_link: "https://chat.whatsapp.com/TESTE_casa_mesa_banho", member_count: 350, max_members: 950, group_jid: null, status: "active" },
  { id: 2, niche_id: 2, niche_key: "infantil", name: "Achadinhos infantil #1", invite_link: "https://chat.whatsapp.com/TESTE_infantil", member_count: 350, max_members: 950, group_jid: null, status: "active" },
  { id: 3, niche_id: 3, niche_key: "eletronicos", name: "Achadinhos eletronicos #1", invite_link: "https://chat.whatsapp.com/TESTE_eletronicos", member_count: 350, max_members: 950, group_jid: null, status: "active" },
];

export const usingFixtures = !process.env.DATABASE_URL;

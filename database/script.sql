create database lumme;

use lumme;

-- 1. PERFIS (Sua marca e quem manda no sistema)
CREATE TABLE perfis (
  id_perfil SERIAL PRIMARY KEY,
  nome_empresa VARCHAR(100),
  whatsapp VARCHAR(20),
  logo_url TEXT,
  cor_hex VARCHAR(7) DEFAULT '#3FFF00' -- Seu verde neon
);

-- 2. CLIENTES (Pra você não ter que digitar o zap toda hora)
CREATE TABLE clientes (
  id_cliente SERIAL PRIMARY KEY,
  id_perfil INTEGER REFERENCES perfis(id_perfil),
  nome VARCHAR(100) NOT NULL,
  zap VARCHAR(20) -- WhatsApp do cliente
);

-- 3. ORCAMENTOS (Onde a mágica acontece)
CREATE TABLE orcamentos (
  id_orcamento SERIAL PRIMARY KEY,
  id_perfil INTEGER REFERENCES perfis(id_perfil),
  id_cliente INTEGER REFERENCES clientes(id_cliente),
  
  -- Detalhes da venda
  servico_resumo TEXT, -- Ex: "Reforma Elétrica Quarto"
  valor_total DECIMAL(10,2) DEFAULT 0.00,
  status VARCHAR(20) DEFAULT 'pendente', -- pendente, aprovado, pago
  
  -- O diferencial do Lumme: A cobrança
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_proxima_cobranca DATE -- O Node vai olhar pra essa coluna e te avisar
);

-- 4. ITENS (Opcional, mas bom ter pra sair bonitinho no PDF)
CREATE TABLE itens (
  id_item SERIAL PRIMARY KEY,
  id_orcamento INTEGER REFERENCES orcamentos(id_orcamento) ON DELETE CASCADE,
  descricao TEXT,
  preco DECIMAL(10,2)
);
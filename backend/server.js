require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const PDFDocument = require('pdfkit');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// Servindo os arquivos estáticos do Frontend
app.use(express.static(path.join(__dirname, '../frontend')));

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const MOCK_USER_ID = 1;

// Rota base de Teste
app.get('/api/dashboard', async (req, res) => {
    const { data: dbStatus, error } = await supabase.from('perfis').select('count', { count: 'exact', head: true });
    res.json({
        message: "API conectada!",
        userId: MOCK_USER_ID,
        supabase_connected: !error,
        db_profiles_count: dbStatus || 0
    });
});

// Criar Orçamento (Salva no DB e vincula itens)
app.post('/api/orcamentos', async (req, res) => {
    try {
        const { id_cliente, itens, valor_total } = req.body;

        if (!id_cliente || !itens || !itens.length) {
            return res.status(400).json({ error: "Faltam dados essenciais." });
        }

        // 1. Inserir o cabeçalho do orçamento
        const { data: orcamento, error: errOrc } = await supabase
            .from('orcamentos')
            .insert([{
                id_perfil: MOCK_USER_ID,
                id_cliente,
                valor_total,
                status: 'pendente'
            }])
            .select()
            .single();

        if (errOrc) throw errOrc;

        // 2. Inserir os itens vinculados a este orçamento
        const itensPayload = itens.map(i => ({
            id_orcamento: orcamento.id_orcamento,
            descricao: i.descricao,
            preco: i.valor
        }));

        const { error: errItens } = await supabase.from('itens').insert(itensPayload);
        if (errItens) throw errItens;

        res.status(201).json({
            message: "Gravado com sucesso no Lumme!",
            orcamento: orcamento
        });
    } catch (error) {
        console.error("Erro Supabase:", error);
        res.status(500).json({ error: "Erro ao gravar orçamento no banco de dados." });
    }
});

// Gerador de PDF Dinâmico (Buscando dados reais)
app.get('/api/orcamentos/:id/pdf', async (req, res) => {
    try {
        const { id } = req.params;

        // Busca o orçamento e os itens simultaneamente
        const { data: orcamento, error: errOrc } = await supabase
            .from('orcamentos')
            .select('*, clientes(nome), itens(*)')
            .eq('id_orcamento', id)
            .single();

        if (errOrc || !orcamento) {
            return res.status(404).send("Orçamento não encontrado.");
        }

        const doc = new PDFDocument({ margin: 50, size: 'A4' });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=Lumme-Orcamento-${id}.pdf`);
        doc.pipe(res);

        // Header / Logo Cursiva simulada
        doc.font('Helvetica-BoldOblique')
            .fontSize(40)
            .fillColor('#006400')
            .text('Lumme', { align: 'center' });

        doc.font('Helvetica')
            .fontSize(10)
            .fillColor('#333333')
            .text('Gestão de Orçamentos Profissionais', { align: 'center' });

        doc.moveDown(3);

        // Seção: Dados
        doc.font('Helvetica-Bold').fontSize(14).fillColor('#006400').text('INFORMAÇÕES DO CLIENTE');
        doc.font('Helvetica').fontSize(11).fillColor('#333333');
        doc.text(`Orçamento de Protocolo: #${orcamento.id_orcamento}`);
        doc.text(`Destinatário: ${orcamento.clientes?.nome || 'Cliente não identificado'}`);
        doc.text(`Data de Emissão: ${new Date(orcamento.data_criacao).toLocaleDateString('pt-BR')}`);

        doc.moveDown(2);

        // Seção: Itens
        doc.font('Helvetica-Bold').fontSize(14).fillColor('#006400').text('ESCOPO DA PROPOSTA');
        doc.moveDown(0.5);

        orcamento.itens.forEach(item => {
            doc.font('Helvetica').fontSize(12).fillColor('#333333');
            doc.text(`- ${item.descricao}`, { continued: true });
            doc.text(`R$ ${parseFloat(item.preco).toFixed(2)}`, { align: 'right' });
            doc.moveDown(0.5);
        });

        doc.moveDown(2);

        // Footer / Total com linha Verde Lima Neon
        const startX = 50;
        const endX = 545;
        const yLine = doc.y;

        doc.moveTo(startX, yLine)
            .lineTo(endX, yLine)
            .lineWidth(1.5)
            .strokeColor('#3FFF00')
            .stroke();

        doc.moveDown(1);
        doc.font('Helvetica-Bold').fontSize(16).fillColor('#006400');
        doc.text('TOTAL DO INVESTIMENTO:', { continued: true });
        doc.fillColor('#333333').text(` R$ ${parseFloat(orcamento.valor_total).toFixed(2)}`, { align: 'right' });

        doc.end();

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro crítico ao gerar PDF" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`\n\x1b[32m🚀 Servidor Lumme rodando em http://localhost:${PORT}\x1b[0m`);

    // Teste de conexão Imediato
    try {
        const { data, error } = await supabase.from('perfis').select('id_perfil').limit(1);
        if (error) {
            console.log(`\n\x1b[31m❌ Erro ao conectar ao Banco Supabase:\x1b[0m`, error.message);
            console.log(`\x1b[33m⚠️ Verifique se as credenciais no arquivo .env estão corretas.\x1b[0m\n`);
        } else {
            console.log(`\n\x1b[32m✅ Conexão com Supabase feita com sucesso!\x1b[0m`);
            console.log(`\x1b[36m📊 Tabela 'perfis' acessível no esquema public.\x1b[0m\n`);
        }
    } catch (err) {
        console.log(`\n\x1b[31m❌ Falha crítica de conexão:\x1b[0m`, err.message);
    }
});

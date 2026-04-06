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

// Configuração do Supabase (Aguardando .env)
// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseKey = process.env.SUPABASE_ANON_KEY;
// const supabase = createClient(supabaseUrl, supabaseKey);

const MOCK_USER_ID = 1;

// Rota base de Teste
app.get('/api/dashboard', (req, res) => {
    res.json({ message: "API conectada e rodando!", userId: MOCK_USER_ID });
});

// Criar Orçamento (Salva no DB e vincula itens)
app.post('/api/orcamentos', async (req, res) => {
    try {
        const { id_cliente, itens, valor_total } = req.body;
        
        if (!id_cliente || !itens || !itens.length) {
            return res.status(400).json({ error: "Faltam dados essenciais." });
        }

        // Simulação do INSERT no banco Supabase
        /* 
        const { data: orcamento, error: errOrc } = await supabase
            .from('orcamentos')
            .insert([{ id_perfil: MOCK_USER_ID, id_cliente, valor_total }])
            .select()
            .single();
            
        if (errOrc) throw errOrc;

        const itensPayload = itens.map(i => ({
            id_orcamento: orcamento.id,
            descricao: i.descricao,
            valor: i.valor
        }));
        
        const { error: errItens } = await supabase.from('itens').insert(itensPayload);
        if (errItens) throw errItens;
        */

        const pseudoId = Math.floor(Math.random() * 9000) + 1000;

        res.status(201).json({
            message: "Gravado com sucesso no Lumme!",
            orcamento: { id: pseudoId, id_cliente, valor_total, status: "Aguardando Assinatura" }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro de servidor ao gravar orçamento." });
    }
});

// Gerador de PDF Dinâmico
app.get('/api/orcamentos/:id/pdf', async (req, res) => {
    try {
        const { id } = req.params;

        // Simulando SELECT do BD com o ID informado
        const mockData = {
            id,
            cliente_nome: "Cliente Prospectado - Venda Direta",
            data: new Date().toLocaleDateString('pt-BR'),
            // Mocks estáticos só por demonstração se o id não constar em mem, mas poderíamos pegar.
            itens: [
                { descricao: "Consultoria Inicial de Sistemas", valor: 1540.00 },
                { descricao: "Módulo Gestão Vácuo Zero", valor: 850.50 }
            ],
            valor_total: 2390.50
        };

        const doc = new PDFDocument({ margin: 50, size: 'A4' });
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=Lumme-Orcamento-${id}.pdf`);
        doc.pipe(res);

        // Header / Logo Cursiva simulada
        doc.font('Helvetica-BoldOblique') // Helvetica simulando itálico p/ assinatura
           .fontSize(40)
           .fillColor('#006400') // Verde Escuro
           .text('Lumme', { align: 'center' });
        
        doc.font('Helvetica')
           .fontSize(10)
           .fillColor('#333333') // Chumbo
           .text('Gestão de Orçamentos Profissionais', { align: 'center' });
        
        doc.moveDown(3);

        // Seção: Dados
        doc.font('Helvetica-Bold').fontSize(14).fillColor('#006400').text('INFORMAÇÕES DO CLIENTE');
        doc.font('Helvetica').fontSize(11).fillColor('#333333');
        doc.text(`Orçamento de Protocolo: #${mockData.id}`);
        doc.text(`Destinatário: ${mockData.cliente_nome}`);
        doc.text(`Data de Emissão: ${mockData.data}`);
        
        doc.moveDown(2);

        // Seção: Itens
        doc.font('Helvetica-Bold').fontSize(14).fillColor('#006400').text('ESCOPO DA PROPOSTA');
        doc.moveDown(0.5);

        let iterY = doc.y;
        mockData.itens.forEach(item => {
            doc.font('Helvetica').fontSize(12).fillColor('#333333');
            doc.text(`- ${item.descricao}`, { continued: true });
            doc.text(`R$ ${item.valor.toFixed(2)}`, { align: 'right' });
            doc.moveDown(0.5);
        });

        doc.moveDown(2);

        // Foote / Total com linha Verde Lima Neon
        const startX = 50;
        const endX = 545; // 595.28 is A4 width
        const yLine = doc.y;

        doc.moveTo(startX, yLine)
           .lineTo(endX, yLine)
           .lineWidth(1.5)
           .strokeColor('#3FFF00') // Verde Lima Neon
           .stroke();

        doc.moveDown(1);
        doc.font('Helvetica-Bold').fontSize(16).fillColor('#006400');
        doc.text('TOTAL DO INVESTIMENTO:', { continued: true });
        doc.fillColor('#333333').text(` R$ ${mockData.valor_total.toFixed(2)}`, { align: 'right' });

        doc.end();

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro crítico ao gerar PDF PDFKit" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor Lumme rodando em http://localhost:${PORT}`);
});

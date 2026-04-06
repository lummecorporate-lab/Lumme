export function renderFormOrcamento(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div style="max-width: 800px; margin: 0 auto; padding-top: 16px;">
            <div style="margin-bottom: 32px;">
                <h2 style="font-size: 2rem; color: var(--text-heading); margin-bottom: 8px; font-weight: 700; letter-spacing: -0.03em;">Gerar Orçamento</h2>
                <p style="color: var(--text-body); font-size: 1.05rem;">Crie cobranças detalhadas para seus clientes de forma profissional.</p>
            </div>

            <div class="surface-card" style="padding: 40px; position: relative;">
                <div class="marker marker-tl"></div>
                <div class="marker marker-tr"></div>
                <div class="marker marker-bl"></div>
                <div class="marker marker-br"></div>
                <form id="form-orcamento" style="display: flex; flex-direction: column; gap: 32px; position: relative; z-index: 1;">
                    
                    <!-- Seção Cliente -->
                    <div>
                        <label class="form-label">Cliente (ID)</label>
                        <input type="number" id="id_cliente" required placeholder="Ex: 001" class="input-premium">
                    </div>
                    
                    <div style="height: 1px; background: var(--border-soft); width: 100%;"></div>

                    <!-- Seção Itens -->
                    <div style="display: flex; flex-direction: column; gap: 16px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <label class="form-label" style="margin-bottom: 0;">Itens da Proposta</label>
                            <button type="button" id="btn-add-item" style="background: var(--brand-light); color: #2B7A13; border: none; padding: 8px 14px; border-radius: 8px; font-weight: 600; font-size: 0.85rem; cursor: pointer; transition: background 0.2s;">
                                + Novo Item
                            </button>
                        </div>
                        
                        <div id="itens-container" style="display: flex; flex-direction: column; gap: 12px; margin-top: 8px;"></div>
                    </div>

                    <!-- Rodapé de Fechamento -->
                    <div style="margin-top: 24px; display: flex; justify-content: space-between; align-items: flex-end; padding-top: 32px; border-top: 1px solid var(--border-soft);">
                        <div>
                            <span style="color: var(--text-muted); font-size: 0.85rem; font-weight: 500; display: block; margin-bottom: 4px;">Valor Total</span>
                            <div style="font-size: 2.4rem; font-family: var(--font-heading); font-weight: 700; color: var(--text-heading); letter-spacing: -0.04em; line-height: 1;">
                                R$ <span id="valor-total-display">0,00</span>
                            </div>
                        </div>
                        <button type="submit" class="btn-primary">
                            Gerar Link e PDF
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    const itensContainer = document.getElementById('itens-container');
    const btnAddItem = document.getElementById('btn-add-item');
    const form = document.getElementById('form-orcamento');
    const valTotalDisplay = document.getElementById('valor-total-display');

    let itens = [];
    let itemIdCounter = 0;

    function renderItens() {
        itensContainer.innerHTML = '';
        let total = 0;

        if (itens.length === 0) {
            itensContainer.innerHTML = `
                <div style="text-align: center; padding: 32px 20px; border: 1px dashed var(--border-medium); border-radius: 12px; background: #F9FAFB;">
                    <p style="color: var(--text-body); font-size: 0.95rem; font-weight: 500;">O orçamento está vazio.</p>
                </div>
            `;
        }

        itens.forEach((item, index) => {
            total += item.valor;
            const itemDiv = document.createElement('div');
            itemDiv.style.display = 'grid';
            itemDiv.style.gridTemplateColumns = '1fr 180px auto';
            itemDiv.style.gap = '12px';
            itemDiv.style.alignItems = 'center';
            itemDiv.innerHTML = `
                <input type="text" placeholder="Descrição do serviço..." value="${item.descricao}" required class="input-premium input-desc" data-index="${index}">
                
                <div style="position: relative;">
                    <span style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-weight: 500;">R$</span>
                    <input type="number" step="0.01" placeholder="0.00" value="${item.valor || ''}" required class="input-premium input-valor" data-index="${index}" style="padding-left: 44px; font-weight: 500;">
                </div>
                
                <button type="button" class="btn-danger btn-remove-item" data-index="${index}" title="Remover item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="pointer-events: none;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            `;
            itensContainer.appendChild(itemDiv);
        });

        valTotalDisplay.textContent = total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        // Bind Events
        document.querySelectorAll('.input-desc').forEach(input => {
            input.addEventListener('input', (e) => {
                const idx = e.target.getAttribute('data-index');
                itens[idx].descricao = e.target.value;
            });
        });
        document.querySelectorAll('.input-valor').forEach(input => {
            input.addEventListener('input', (e) => {
                const idx = e.target.getAttribute('data-index');
                itens[idx].valor = parseFloat(e.target.value) || 0;
                atualizarTotal();
            });
        });
        document.querySelectorAll('.btn-remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.getAttribute('data-index'));
                itens.splice(idx, 1);
                renderItens();
            });
        });
    }

    function atualizarTotal() {
        const total = itens.reduce((acc, item) => acc + (parseFloat(item.valor) || 0), 0);
        valTotalDisplay.textContent = total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    btnAddItem.addEventListener('click', () => {
        itens.push({ id: itemIdCounter++, descricao: '', valor: 0 });
        renderItens();
    });

    renderItens();

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (itens.length === 0) {
            alert('Você não pode enviar um orçamento em branco. Adicione itens.');
            return;
        }

        const id_cliente = parseInt(document.getElementById('id_cliente').value);
        const valor_total = itens.reduce((acc, item) => acc + (parseFloat(item.valor) || 0), 0);

        const payload = {
            id_cliente,
            itens: itens.map(i => ({ descricao: i.descricao, valor: parseFloat(i.valor) })),
            valor_total
        };

        const btn = form.querySelector('button[type="submit"]');
        const prevContent = btn.innerHTML;
        btn.innerHTML = `Criando...`;
        btn.style.opacity = '0.7';
        btn.disabled = true;

        try {
            const res = await fetch('http://localhost:3000/api/orcamentos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            
            if (res.ok) {
                itens = [];
                form.reset();
                renderItens();
                
                if(confirm('✅ Sucesso! Orçamento criado.\\n\\nDeseja baixar o PDF?')) {
                    window.open('http://localhost:3000/api/orcamentos/' + data.orcamento.id + '/pdf', '_blank');
                }
            } else {
                alert('Erro: ' + (data.error || 'Desconhecido'));
            }
        } catch (err) {
            console.error(err);
            alert('Erro de comunicação com o servidor');
        } finally {
            btn.innerHTML = prevContent;
            btn.style.opacity = '1';
            btn.disabled = false;
        }
    });
}

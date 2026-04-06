// orcamento.js - Lógica Pura (Sem HTML em String)

document.addEventListener('DOMContentLoaded', () => {
    const itensContainer = document.getElementById('itens-container');
    const btnAddItem = document.getElementById('btn-add-item');
    const form = document.getElementById('form-orcamento');
    const valTotalDisplay = document.getElementById('valor-total-display');

    let itens = [];

    // Função de Renderização baseada em DOM (NÃO string)
    function renderItens() {
        itensContainer.innerHTML = '';
        let total = 0;

        if (itens.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.style.cssText = 'text-align: center; padding: 32px 20px; border: 1px dashed var(--border-medium); border-radius: 12px; background: #F9FAFB;';
            emptyMsg.innerHTML = '<p style="color: var(--text-body); font-size: 0.95rem; font-weight: 500;">O orçamento está vazio.</p>';
            itensContainer.appendChild(emptyMsg);
        }

        itens.forEach((item, index) => {
            total += item.valor;
            
            const itemDiv = document.createElement('div');
            itemDiv.style.cssText = 'display: grid; grid-template-columns: 1fr 180px auto; gap: 12px; align-items: center;';
            
            // Input Descrição
            const inputDesc = document.createElement('input');
            inputDesc.type = 'text';
            inputDesc.placeholder = 'Descrição do serviço...';
            inputDesc.value = item.descricao;
            inputDesc.className = 'input-premium';
            inputDesc.required = true;
            inputDesc.oninput = (e) => { itens[index].descricao = e.target.value; };
            
            // Container Preço
            const priceContainer = document.createElement('div');
            priceContainer.style.position = 'relative';
            priceContainer.innerHTML = '<span style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-weight: 500;">R$</span>';
            
            const inputValor = document.createElement('input');
            inputValor.type = 'number';
            inputValor.step = '0.01';
            inputValor.placeholder = '0.00';
            inputValor.value = item.valor || '';
            inputValor.className = 'input-premium';
            inputValor.style.paddingLeft = '44px';
            inputValor.style.fontWeight = '500';
            inputValor.required = true;
            inputValor.oninput = (e) => { 
                itens[index].valor = parseFloat(e.target.value) || 0; 
                atualizarTotal();
            };
            
            priceContainer.appendChild(inputValor);

            // Botão Remover
            const btnRemove = document.createElement('button');
            btnRemove.type = 'button';
            btnRemove.className = 'btn-danger';
            btnRemove.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
            btnRemove.onclick = () => {
                itens.splice(index, 1);
                renderItens();
            };

            itemDiv.appendChild(inputDesc);
            itemDiv.appendChild(priceContainer);
            itemDiv.appendChild(btnRemove);
            
            itensContainer.appendChild(itemDiv);
        });

        valTotalDisplay.textContent = total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function atualizarTotal() {
        const total = itens.reduce((acc, item) => acc + (parseFloat(item.valor) || 0), 0);
        valTotalDisplay.textContent = total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    btnAddItem.addEventListener('click', () => {
        itens.push({ descricao: '', valor: 0 });
        renderItens();
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (itens.length === 0) {
            alert('Você não pode enviar um orçamento em branco.');
            return;
        }

        const id_cliente = parseInt(document.getElementById('id_cliente').value);
        const valor_total = itens.reduce((acc, item) => acc + (parseFloat(item.valor) || 0), 0);

        const payload = {
            id_cliente,
            itens: itens.map(i => ({ descricao: i.descricao, valor: parseFloat(i.valor) })),
            valor_total
        };

        const btn = document.getElementById('btn-submit');
        const prevContent = btn.innerHTML;
        btn.innerHTML = `Limpando o Vácuo...`;
        btn.disabled = true;

        try {
            const res = await fetch('/api/orcamentos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            
            if (res.ok) {
                if(confirm('✅ Orçamento Criado! Abrir PDF agora?')) {
                    window.open('/api/orcamentos/' + data.orcamento.id_orcamento + '/pdf', '_blank');
                }
                itens = [];
                form.reset();
                renderItens();
            } else {
                alert('Erro: ' + (data.error || 'Desconhecido'));
            }
        } catch (err) {
            console.error(err);
            alert('Falha na conexão com o servidor.');
        } finally {
            btn.innerHTML = prevContent;
            btn.disabled = false;
        }
    });

    // Inicialização
    renderItens();
});

import { renderFormOrcamento } from './form-orcamento.js';

export function renderSidebar(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <aside style="width: 260px; background: var(--bg-surface); border-right: 1px solid var(--border-medium); padding: 32px 20px; min-height: 100vh; display: flex; flex-direction: column; position: relative; z-index: 10;">
            <!-- Decorative Markers - Originality touch -->
            <div class="marker marker-tl"></div>
            <div class="marker marker-tr" style="right: -1px;"></div>
            
            <!-- Logo Section -->
            <div style="margin-bottom: 48px; padding: 0 8px; position: relative;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 28px; height: 28px; background: var(--brand-primary); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#06240D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <h2 class="titulo-cursivo" style="font-size: 2.8rem; margin: 0; line-height: 1; letter-spacing: -1px;">Lumme</h2>
                </div>
            </div>
            
            <!-- Navigation -->
            <nav style="display: flex; flex-direction: column; gap: 6px; flex-grow: 1;">
                <p style="font-size: 0.75rem; color: var(--text-muted); font-weight: 500; margin-bottom: 12px; padding: 0 12px; text-transform: uppercase; letter-spacing: 0.5px;">Workspace</p>
                
                <a href="#" id="link-inicio" class="nav-link-decorative" style="display: flex; align-items: center; gap: 12px; color: var(--text-body); text-decoration: none; padding: 12px 14px; border-radius: 0 12px 12px 0; font-weight: 500; font-family: var(--font-heading); transition: all 0.2s;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
                    Dashboard
                </a>
                
                <a href="#" id="link-novo-orcamento" class="nav-link-decorative active" style="display: flex; align-items: center; gap: 12px; color: #06240D; text-decoration: none; padding: 12px 14px; background: var(--brand-primary); border-radius: 0 12px 12px 0; font-weight: 600; font-family: var(--font-heading); transition: all 0.2s;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
                    Novo Orçamento
                </a>
            </nav>
            
            <!-- Bottom User Profile -->
            <div style="padding: 12px; display: flex; align-items: center; gap: 12px; margin-top: auto; border-top: 1px solid var(--border-soft); padding-top: 24px;">
                <div style="width: 36px; height: 36px; border-radius: 50%; background: var(--brand-light); color: #06240D; font-weight: 600; font-family: var(--font-heading); display: flex; align-items: center; justify-content: center; font-size: 0.9rem; border: 1px solid var(--brand-primary);">
                    AD
                </div>
                <div>
                    <span style="display: block; font-size: 0.9rem; font-weight: 600; color: var(--text-heading); font-family: var(--font-heading);">André</span>
                    <span style="display: block; font-size: 0.75rem; color: var(--text-muted);">Beta Plan</span>
                </div>
            </div>
            <div class="marker marker-bl"></div>
            <div class="marker marker-br" style="right: -1px;"></div>
        </aside>
    `;

    const navInicio = document.getElementById('link-inicio');
    const navOrcamento = document.getElementById('link-novo-orcamento');

    navOrcamento.addEventListener('click', (e) => {
        e.preventDefault();
        
        navOrcamento.classList.add('active');
        navOrcamento.style.background = 'var(--brand-primary)';
        navOrcamento.style.color = '#06240D';
        navOrcamento.style.fontWeight = '600';
        
        navInicio.classList.remove('active');
        navInicio.style.background = 'transparent';
        navInicio.style.color = 'var(--text-body)';
        navInicio.style.fontWeight = '500';
        
        renderFormOrcamento('content-container');
    });

    navInicio.addEventListener('click', (e) => {
        e.preventDefault();
        
        navInicio.classList.add('active');
        navInicio.style.background = 'var(--border-soft)';
        navInicio.style.color = 'var(--text-heading)';
        navInicio.style.fontWeight = '600';
        
        navOrcamento.classList.remove('active');
        navOrcamento.style.background = 'transparent';
        navOrcamento.style.color = 'var(--text-body)';
        navOrcamento.style.fontWeight = '500';

        const content = document.getElementById('content-container');
        content.innerHTML = `
            <div style="max-width: 900px; margin: 0 auto; margin-top: 40px; position: relative;">
                <div class="marker marker-tl"></div>
                <div class="marker marker-tr"></div>
                <h2 style="font-size: 1.8rem; margin-bottom: 8px;">Visão Geral</h2>
                <p style="color: var(--text-muted);">Em breve as estatísticas dos seus pagamentos.</p>
                <div class="marker marker-bl"></div>
                <div class="marker marker-br"></div>
            </div>
        `;
    });
}

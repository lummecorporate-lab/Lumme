import { renderSidebar } from './components/sidebar.js';
import { renderNavbar } from './components/navbar.js';
import { renderFormOrcamento } from './components/form-orcamento.js';

document.addEventListener('DOMContentLoaded', () => {
    // Renderiza a base (Layout)
    renderSidebar('sidebar-container');
    renderNavbar('navbar-container');

    // Ao inicializar o sistema pela primeira vez, chama a tela de "Novo Orçamento" no foco central
    renderFormOrcamento('content-container');
});

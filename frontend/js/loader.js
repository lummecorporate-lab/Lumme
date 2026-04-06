// loader.js - Carrega componentes HTML dinamicamente de forma limpa

document.addEventListener('DOMContentLoaded', async () => {
    // Carrega o Sidebar
    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer) {
        try {
            const resp = await fetch('/components/sidebar.html');
            const html = await resp.text();
            sidebarContainer.innerHTML = html;
            
            // Lógica de "Marcação de página ativa" baseada em pastas
            const currentPath = window.location.pathname;
            const navDashboard = document.getElementById('nav-dashboard');
            const navNovo = document.getElementById('nav-novo');

            if (currentPath.includes('/dashboard/')) {
                if(navDashboard) {
                    navDashboard.classList.add('active');
                    navDashboard.style.background = 'var(--brand-primary)';
                    navDashboard.style.color = '#06240D';
                }
            } else if (currentPath.includes('/novo-orcamento/')) {
                if(navNovo) {
                    navNovo.classList.add('active');
                    navNovo.style.background = 'var(--brand-primary)';
                    navNovo.style.color = '#06240D';
                }
            }
        } catch (err) {
            console.error("Erro ao carregar o sidebar:", err);
        }
    }
});

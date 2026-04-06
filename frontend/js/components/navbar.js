export function renderNavbar(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <header style="background: rgba(249, 250, 251, 0.8); backdrop-filter: blur(12px); padding: 20px 40px; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 5;">
            
            <div style="display: flex; align-items: center; gap: 8px;">
                <h1 style="font-size: 1.25rem; font-weight: 600; color: var(--text-heading);">Dashboard</h1>
            </div>
            
            <div style="display: flex; align-items: center; gap: 16px;">
                <a href="#" style="color: var(--text-muted); font-size: 0.95rem; font-weight: 500; text-decoration: none; padding: 8px 16px; border-radius: 8px; transition: background 0.2s;">
                    Preços
                </a>
                <a href="#" style="color: var(--text-muted); font-size: 0.95rem; font-weight: 500; text-decoration: none; padding: 8px 16px; border-radius: 8px; transition: background 0.2s;">
                    Documentação
                </a>
                
                <div style="height: 24px; width: 1px; background: var(--border-medium); margin: 0 8px;"></div>
                
                <button style="background: var(--bg-surface); border: 1px solid var(--border-medium); border-radius: 12px; padding: 10px; display: flex; align-items: center; justify-content: center; color: var(--text-muted); cursor: pointer; transition: all 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                </button>
            </div>
        </header>
    `;
}

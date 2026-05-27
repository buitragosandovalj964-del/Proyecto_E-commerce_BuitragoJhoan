class AdminNav extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div style="display:flex; gap:15px; background:var(--bg-secondary); padding:10px; border:1px solid rgba(255,255,255,0.05)">
                <button type="button" class="btn-premium admin-nav-btn" data-module="categories">📁 Categorías</button>
                <button type="button" class="btn-premium admin-nav-btn" data-module="products">👔 Productos</button>
                <button type="button" class="btn-premium admin-nav-btn" data-module="orders">📜 Historial Pedidos</button>
            </div>
        `;

        this.querySelectorAll('.admin-nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const moduleName = btn.dataset.module;
                if (typeof window.switchModule === 'function') {
                    window.switchModule(moduleName);
                } else {
                    window.dispatchEvent(new CustomEvent('adminModuleChange', { detail: { moduleName } }));
                }
            });
        });
    }
}
customElements.define('admin-nav', AdminNav);
class AdminNav extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div style="display:flex; gap:15px; background:var(--bg-secondary); padding:10px; border:1px solid rgba(255,255,255,0.05)">
                <button class="btn-premium" onclick="switchModule('categories')">📁 Categorías</button>
                <button class="btn-premium" onclick="switchModule('products')">👔 Productos</button>
                <button class="btn-premium" onclick="switchModule('orders')">📜 Historial Pedidos</button>
            </div>
        `;
    }
}
customElements.define('admin-nav', AdminNav);
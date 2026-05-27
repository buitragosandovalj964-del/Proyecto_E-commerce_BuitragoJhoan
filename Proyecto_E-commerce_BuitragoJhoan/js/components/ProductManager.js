class ProductManager extends HTMLElement {
    get STORE_KEY() { return 'products'; } 
    get CAT_KEY() { return 'categories'; }

    connectedCallback() { this.render(); }

    render() {
        const products = JSON.parse(localStorage.getItem(this.STORE_KEY)) || [];
        
        this.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <h2 style="font-size:1.2rem;">Catálogo de Piezas Maestro</h2>
                <button class="btn-premium" id="openProdModal">+ Adjuntar Nueva Prenda</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Prenda</th>
                        <th>Precio</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${products.map(p => `
                        <tr>
                            <td>${p.code || 'N/A'}</td>
                            <td>${p.name || 'Producto sin nombre'}</td>
                            <td>$${Number(p.price || 0).toLocaleString()}</td>
                            <td><button>Editar</button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        // CORRECCIÓN: El listener debe ir AQUÍ DENTRO, después del innerHTML
        this.querySelector('#openProdModal')?.addEventListener('click', () => {
            // ¡IMPORTANTE! Si el modal está fuera de este componente, 
            // usa document.querySelector en lugar de this.querySelector
            const modal = document.querySelector('#prodModal'); 
            if(modal) modal.style.display = 'flex';
        });
    }

    saveProd(newData) {
        const products = JSON.parse(localStorage.getItem(this.STORE_KEY)) || [];
        products.push({ id: 'prod-' + Date.now(), ...newData });
        localStorage.setItem(this.STORE_KEY, JSON.stringify(products));
        this.render(); // Esto vuelve a pintar la tabla y re-asigna el listener
    }

    deleteProd(id) {
        let products = JSON.parse(localStorage.getItem(this.STORE_KEY)) || [];
        products = products.filter(p => p.id !== id);
        localStorage.setItem(this.STORE_KEY, JSON.stringify(products));
        this.render();
    }
}
customElements.define('product-manager', ProductManager);
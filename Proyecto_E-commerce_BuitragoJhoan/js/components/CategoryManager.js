class CategoryManager extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    render() {
        const categories = JSON.parse(localStorage.getItem('categories')) || [];
        this.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <h2 style="font-size:1.2rem;">Gestión de Líneas y Categorías</h2>
                <button class="btn-premium" id="openCatModalBtn">+ Crear Categoría</button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Nombre de Línea</th>
                        <th>Descripción Exclusiva</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${categories.map(c => `
                        <tr>
                            <td style="font-weight:600; color:var(--accent);">${c.name}</td>
                            <td>${c.description}</td>
                            <td>
                                <button class="btn-premium" style="padding:4px 10px; font-size:0.75rem;" onclick="this.getRootNode().host.deleteCat('${c.id}')">Eliminar</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div class="admin-modal" id="catModal">
                <div class="admin-modal-content">
                    <h3 style="margin-bottom:15px; font-family:var(--font-luxury);">Nueva Línea Editorial</h3>
                    <input type="text" id="catName" class="input-premium" placeholder="Nombre (ej: Alta Costura)">
                    <input type="text" id="catDesc" class="input-premium" placeholder="Breve Concepto">
                    <div style="display:flex; gap:10px; justify-content:flex-end; margin-top:15px;">
                        <button class="btn-danger" id="closeCatModal">Cancelar</button>
                        <button class="btn-premium" id="saveCatBtn">Guardar Registro</button>
                    </div>
                </div>
            </div>
        `;

        // Atar Eventos de manera limpia
        const modal = this.querySelector('#catModal');
        this.querySelector('#openCatModalBtn').addEventListener('click', () => modal.style.display = 'flex');
        this.querySelector('#closeCatModal').addEventListener('click', () => modal.style.display = 'none');
        this.querySelector('#saveCatBtn').addEventListener('click', () => this.saveCat());
    }

    saveCat() {
        const name = this.querySelector('#catName').value;
        const description = this.querySelector('#catDesc').value;
        if(!name || !description) return showToast("Por favor complete las celdas.", true);

        const categories = JSON.parse(localStorage.getItem('categories')) || [];
        categories.push({ id: 'cat-' + Date.now(), name, description });
        localStorage.setItem('categories', JSON.stringify(categories));
        
        showToast("Nueva línea de diseño guardada.");
        this.render();
    }

    deleteCat(id) {
        let categories = JSON.parse(localStorage.getItem('categories')) || [];
        categories = categories.filter(c => c.id !== id);
        localStorage.setItem('categories', JSON.stringify(categories));
        showToast("Categoría removida.");
        this.render();
    }
}
customElements.define('category-manager', CategoryManager);
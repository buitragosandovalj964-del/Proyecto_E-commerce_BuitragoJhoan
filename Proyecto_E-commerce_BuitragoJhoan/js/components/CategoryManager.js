class CategoryManager extends HTMLElement {
    constructor() {
        super();
        this.editingId = null;
    }

    connectedCallback() {
        this.render();
    }

    getCategories() {
        if (typeof getCategories === 'function') {
            return getCategories();
        }
        return JSON.parse(localStorage.getItem('categories')) || [];
    }

    render() {
        const categories = this.getCategories();
        this.innerHTML = `
            <style>
                .category-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 16px;
                    margin-bottom: 24px;
                }
                .category-header h2 {
                    font-family: var(--font-urban);
                    font-size: 1.2rem;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: #111111;
                }
                .category-table {
                    width: 100%;
                    border-collapse: collapse;
                    background: #FFFFFF;
                    border: 1px solid rgba(17, 17, 17, 0.08);
                }
                .category-table th,
                .category-table td {
                    padding: 18px 16px;
                    border-bottom: 1px solid rgba(17, 17, 17, 0.08);
                    color: #111111;
                    font-size: 0.95rem;
                }
                .category-table th {
                    text-transform: uppercase;
                    letter-spacing: 0.12em;
                    font-family: var(--font-urban);
                    font-size: 0.78rem;
                    color: #706B63;
                }
                .category-table tr:last-child td { border-bottom: none; }
                .category-actions button {
                    margin-right: 10px;
                    margin-bottom: 6px;
                }
                .admin-modal {
                    position: fixed;
                    inset: 0;
                    background: rgba(17, 17, 17, 0.5);
                    display: none;
                    justify-content: center;
                    align-items: center;
                    z-index: 4000;
                    padding: 20px;
                }
                .admin-modal-content {
                    width: min(520px, 100%);
                    background: #F7EFE5;
                    border: 1px solid rgba(17, 17, 17, 0.08);
                    padding: 30px;
                    border-radius: 24px;
                    box-shadow: 0 30px 70px rgba(0, 0, 0, 0.12);
                }
                .admin-modal-content h3 {
                    margin-bottom: 20px;
                    font-family: var(--font-urban);
                    font-size: 1.2rem;
                    letter-spacing: 0.14em;
                    color: #111111;
                    text-transform: uppercase;
                }
            </style>

            <div class="category-header">
                <h2>Gestión de Líneas y Categorías</h2>
                <button class="btn-premium" id="openCatModalBtn">+ Crear Categoría</button>
            </div>

            <table class="category-table">
                <thead>
                    <tr>
                        <th>Nombre de Línea</th>
                        <th>Descripción Exclusiva</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${categories.length ? categories.map(c => `
                        <tr>
                            <td style="font-weight:700; color:#111111;">${c.name}</td>
                            <td style="color:#4F493F;">${c.description || '-'} </td>
                            <td class="category-actions">
                                <button class="btn-premium btn-edit" data-id="${c.id}" style="padding:8px 12px; font-size:0.75rem;">Editar</button>
                                <button class="btn-danger btn-delete" data-id="${c.id}" style="padding:8px 12px; font-size:0.75rem;">Eliminar</button>
                            </td>
                        </tr>
                    `).join('') : `
                        <tr><td colspan="3" style="text-align:center; color:#706B63; padding:28px 0;">No hay líneas creadas. Usa el botón para iniciar el catálogo.</td></tr>
                    `}
                </tbody>
            </table>

            <div class="admin-modal" id="catModal">
                <div class="admin-modal-content">
                    <h3 id="catModalTitle">Nueva Línea Editorial</h3>
                    <input type="text" id="catName" class="input-premium" placeholder="Nombre (ej: Alta Costura)">
                    <input type="text" id="catDesc" class="input-premium" placeholder="Breve Concepto">
                    <div style="display:flex; justify-content:flex-end; gap:12px; margin-top:24px; flex-wrap:wrap;">
                        <button class="btn-danger" id="closeCatModal" type="button">Cancelar</button>
                        <button class="btn-premium" id="saveCatBtn" type="button">Guardar Registro</button>
                    </div>
                </div>
            </div>
        `;

        this.bindEvents();
    }

    bindEvents() {
        const modal = this.querySelector('#catModal');
        const openBtn = this.querySelector('#openCatModalBtn');
        const closeBtn = this.querySelector('#closeCatModal');
        const saveBtn = this.querySelector('#saveCatBtn');

        openBtn.addEventListener('click', () => this.openModal());
        closeBtn.addEventListener('click', () => this.closeModal());
        saveBtn.addEventListener('click', () => this.saveCat());

        this.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (event) => this.loadCategory(event.target.dataset.id));
        });

        this.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (event) => this.deleteCat(event.target.dataset.id));
        });
    }

    openModal() {
        const modal = this.querySelector('#catModal');
        const title = this.querySelector('#catModalTitle');
        const name = this.querySelector('#catName');
        const desc = this.querySelector('#catDesc');
        this.editingId = null;
        title.innerText = 'Nueva Línea Editorial';
        name.value = '';
        desc.value = '';
        modal.style.display = 'flex';
    }

    closeModal() {
        const modal = this.querySelector('#catModal');
        modal.style.display = 'none';
    }

    loadCategory(id) {
        const categories = this.getCategories();
        const category = categories.find(cat => cat.id === id);
        if (!category) return;

        this.editingId = id;
        this.querySelector('#catModalTitle').innerText = 'Editar Línea';
        this.querySelector('#catName').value = category.name;
        this.querySelector('#catDesc').value = category.description;
        this.querySelector('#catModal').style.display = 'flex';
    }

    saveCat() {
        const nameInput = this.querySelector('#catName');
        const descInput = this.querySelector('#catDesc');
        const name = nameInput.value.trim();
        const description = descInput.value.trim();

        if (!name || !description) {
            showToast('Por favor complete todas las casillas.', true);
            return;
        }

        let categories = this.getCategories();

        if (this.editingId) {
            categories = categories.map(cat => cat.id === this.editingId ? { ...cat, name, description } : cat);
            showToast('Línea actualizada con éxito.');
        } else {
            categories.unshift({ id: normalizeCategoryId(name), name, description });
            showToast('Nueva línea de diseño guardada.');
        }

        localStorage.setItem('categories', JSON.stringify(categories));
        this.closeModal();
        window.dispatchEvent(new CustomEvent('categoriesUpdated'));
        this.render();
    }

    deleteCat(id) {
        if (!confirm('¿Seguro que deseas eliminar esta categoría?')) return;

        let categories = this.getCategories();
        categories = categories.filter(cat => cat.id !== id);
        localStorage.setItem('categories', JSON.stringify(categories));
        showToast('Categoría removida.');
        window.dispatchEvent(new CustomEvent('categoriesUpdated'));
        this.render();
    }
}
customElements.define('category-manager', CategoryManager);

class ProductManager extends HTMLElement {
    get STORE_KEY() { return 'products'; }

    connectedCallback() {
        this.render();
        window.addEventListener('productsUpdated', () => this.render());
        window.addEventListener('categoriesUpdated', () => this.render());
        window.addEventListener('storage', (event) => {
            if (event.key === 'products' || event.key === 'categories' || event.key === null) {
                this.render();
            }
        });
    }

    getCategories() {
        if (typeof getCategories === 'function') {
            return getCategories();
        }
        const raw = JSON.parse(localStorage.getItem('categories')) || [];
        return Array.isArray(raw) ? raw : [];
    }

    render() {
        const products = JSON.parse(localStorage.getItem(this.STORE_KEY)) || [];
        const categories = this.getCategories();
        const selectOptions = categories.length ? categories : [
            { id: 'cat-gorras', name: 'Gorras' },
            { id: 'cat-polos', name: 'Polos' },
            { id: 'cat-camisas-oversize', name: 'Camisas Oversize' },
            { id: 'cat-buzos', name: 'Buzos' },
            { id: 'cat-reloj', name: 'Reloj' },
            { id: 'cat-zapatos', name: 'Zapatos' },
            { id: 'cat-accesorios', name: 'Accesorios' }
        ];

        this.innerHTML = `
            <style>
                .dashboard-workspace {
                    display: grid;
                    grid-template-columns: 1.7fr 1fr;
                    gap: 28px;
                    margin-top: 20px;
                }
                .dashboard-panel {
                    background: #F7EFE5;
                    border: 1px solid rgba(17, 17, 17, 0.08);
                    border-radius: 24px;
                    padding: 28px;
                    box-shadow: 0 28px 70px rgba(0, 0, 0, 0.08);
                }
                .inventory-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 22px;
                }
                .inventory-header h2 {
                    font-family: var(--font-urban);
                    font-size: 1.15rem;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: #111111;
                }
                .inventory-header span {
                    color: var(--accent);
                    font-weight: 700;
                    letter-spacing: 0.08em;
                }
                .inventory-card table {
                    width: 100%;
                    border-collapse: collapse;
                    background: #FFFFFF;
                    border: 1px solid rgba(17, 17, 17, 0.08);
                }
                .inventory-card th,
                .inventory-card td {
                    padding: 16px 14px;
                    border-bottom: 1px solid rgba(17, 17, 17, 0.08);
                    font-size: 0.95rem;
                }
                .inventory-card th {
                    text-transform: uppercase;
                    letter-spacing: 0.12em;
                    color: #706B63;
                    font-family: var(--font-urban);
                    font-size: 0.78rem;
                }
                .inventory-card tbody tr:last-child td { border-bottom: none; }
                .prod-thumb {
                    width: 44px;
                    height: 44px;
                    object-fit: cover;
                    border-radius: 12px;
                    border: 1px solid rgba(17, 17, 17, 0.08);
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 9px;
                    margin-bottom: 18px;
                }
                .form-group label {
                    color: #706B63;
                    font-size: 0.77rem;
                    text-transform: uppercase;
                    letter-spacing: 0.11em;
                }
                .control-console {
                    position: sticky;
                    top: 110px;
                }
                .console-title {
                    margin-bottom: 24px;
                    font-family: var(--font-urban);
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: #111111;
                    font-size: 1rem;
                }
                .input-premium {
                    background: #FFFFFF;
                    border: 1px solid rgba(17, 17, 17, 0.12);
                    border-radius: 12px;
                    padding: 14px 16px;
                    color: #111111;
                }
                .input-premium:focus {
                    border-color: rgba(17, 17, 17, 0.3);
                    outline: none;
                    box-shadow: 0 0 0 4px rgba(194, 180, 162, 0.12);
                }
                .form-actions {
                    display: flex;
                    gap: 12px;
                    margin-top: 18px;
                    flex-wrap: wrap;
                }
                .btn-small {
                    padding: 12px 18px;
                    font-size: 0.82rem;
                }
                @media(max-width: 1000px) {
                    .dashboard-workspace { grid-template-columns: 1fr; }
                    .control-console { position: static; top: auto; }
                }
            </style>

            <div class="dashboard-workspace">
                <div class="dashboard-panel inventory-card">
                    <div class="inventory-header">
                        <h2>Catálogo Maestro de Piezas</h2>
                        <span>${products.length} Artículos</span>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Prenda</th>
                                <th>Código</th>
                                <th>Precio</th>
                                <th>Categoría</th>
                                <th style="text-align:right;">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${products.length ? products.map(p => `
                                <tr>
                                    <td>
                                        <div style="display:flex; align-items:center; gap:12px;">
                                            <img src="${p.img || 'https://via.placeholder.com/40'}" class="prod-thumb" alt="${p.name}">
                                            <span style="font-weight:600; color:#111111;">${p.name || 'Sin nombre'}</span>
                                        </div>
                                    </td>
                                    <td style="font-family:monospace; color:#706B63;">${p.code || 'N/A'}</td>
                                    <td style="font-weight:700;">$${Number(p.price || 0).toLocaleString()}</td>
                                    <td style="color:#4F493F;">${p.category || '-'}</td>
                                    <td style="text-align:right;">
                                        <button class="btn-premium btn-edit btn-small" data-id="${p.id}">Editar</button>
                                        <button class="btn-danger btn-delete btn-small" data-id="${p.id}">Eliminar</button>
                                    </td>
                                </tr>
                            `).join('') : `<tr><td colspan="5" style="text-align:center; padding:40px 0; color:#706B63;">El catálogo operativo está vacío.</td></tr>`}
                        </tbody>
                    </table>
                </div>

                <div class="dashboard-panel control-console">
                    <h3 id="consoleTitle" class="console-title">Registrar Nueva Pieza</h3>
                    <form id="prodForm">
                        <input type="hidden" id="prodId">
                        <div class="form-group">
                            <label for="prodCode">Código Identificador</label>
                            <input type="text" id="prodCode" class="input-premium" placeholder="Ej: GLZ-WC-01" required>
                        </div>
                        <div class="form-group">
                            <label for="prodName">Nombre del Artículo</label>
                            <input type="text" id="prodName" class="input-premium" placeholder="Nombre oficial" required>
                        </div>
                        <div class="form-group">
                            <label for="prodPrice">Precio Neto (COP)</label>
                            <input type="number" id="prodPrice" class="input-premium" placeholder="Valor numérico" required>
                        </div>
                        <div class="form-group">
                            <label for="prodImg">Enlace de Imagen (URL)</label>
                            <input type="url" id="prodImg" class="input-premium" placeholder="https://..." required>
                        </div>
                        <div class="form-group">
                            <label for="prodDesc">Descripción de Diseño</label>
                            <textarea id="prodDesc" class="input-premium" placeholder="Detalles de la prenda..." style="height:90px; resize:none;" required></textarea>
                        </div>
                        <div class="form-group">
                            <label for="prodCategory">Categoría del Producto</label>
                            <select id="prodCategory" class="input-premium" required>
                                <option value="">Selecciona categoría...</option>
                                ${selectOptions.map(cat => `<option value="${cat.name}">${cat.name}</option>`).join('')}
                            </select>
                        </div>
                        <label style="display:flex; align-items:center; gap:10px; color:#706B63; font-size:0.9rem; margin-bottom:18px;">
                            <input type="checkbox" id="prodHasSizes" checked style="accent-color: var(--accent);">
                            Habilitar selector de tallaje textil
                        </label>
                        <div class="form-actions">
                            <button type="button" class="btn-danger btn-small" id="clearFormBtn" style="display:none; flex:1;">Limpiar</button>
                            <button type="submit" class="btn-premium btn-small" style="flex:2;">Guardar Cambios</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        this.bindEvents();
    }

    bindEvents() {
        const form = this.querySelector('#prodForm');
        const clearBtn = this.querySelector('#clearFormBtn');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProd();
        });

        clearBtn.addEventListener('click', () => this.resetConsole());

        this.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => this.loadProdToConsole(e.target.dataset.id));
        });

        this.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => this.deleteProd(e.target.dataset.id));
        });
    }

    saveProd() {
        const id = this.querySelector('#prodId').value;
        const newData = {
            id: id || 'p-' + Date.now(),
            code: this.querySelector('#prodCode').value.trim(),
            name: this.querySelector('#prodName').value.trim(),
            price: Number(this.querySelector('#prodPrice').value),
            img: this.querySelector('#prodImg').value.trim(),
            desc: this.querySelector('#prodDesc').value.trim(),
            category: this.querySelector('#prodCategory').value.trim(),
            hasSizes: this.querySelector('#prodHasSizes').checked
        };

        if (!newData.code || !newData.name || !newData.price || !newData.img || !newData.desc || !newData.category) {
            showToast('Completa todos los campos obligatorios.', true);
            return;
        }

        let products = JSON.parse(localStorage.getItem(this.STORE_KEY)) || [];

        if (id) {
            products = products.map(p => p.id === id ? newData : p);
        } else {
            products.unshift(newData);
        }

        localStorage.setItem(this.STORE_KEY, JSON.stringify(products));
        window.dispatchEvent(new CustomEvent('productsUpdated'));
        showToast('Catálogo operativo sincronizado.');
        this.resetConsole();
        this.render();
    }

    loadProdToConsole(id) {
        const products = JSON.parse(localStorage.getItem(this.STORE_KEY)) || [];
        const product = products.find(p => p.id === id);
        if (!product) return;

        this.querySelector('#prodId').value = product.id;
        this.querySelector('#prodCode').value = product.code;
        this.querySelector('#prodName').value = product.name;
        this.querySelector('#prodPrice').value = product.price;
        this.querySelector('#prodImg').value = product.img;
        this.querySelector('#prodDesc').value = product.desc;
        this.querySelector('#prodCategory').value = product.category || '';
        this.querySelector('#prodHasSizes').checked = product.hasSizes;
        this.querySelector('#consoleTitle').innerText = 'Modificar Especificación';
        this.querySelector('#clearFormBtn').style.display = 'block';
        this.querySelector('.control-console').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    resetConsole() {
        const form = this.querySelector('#prodForm');
        form.reset();
        this.querySelector('#prodId').value = '';
        this.querySelector('#consoleTitle').innerText = 'Registrar Nueva Pieza';
        this.querySelector('#clearFormBtn').style.display = 'none';
    }

    deleteProd(id) {
        if (!confirm('¿Retirar esta pieza del inventario activo?')) return;

        let products = JSON.parse(localStorage.getItem(this.STORE_KEY)) || [];
        products = products.filter(p => p.id !== id);
        localStorage.setItem(this.STORE_KEY, JSON.stringify(products));
        window.dispatchEvent(new CustomEvent('productsUpdated'));
        showToast('Pieza dada de baja', true);
        this.render();
    }
}
customElements.define('product-manager', ProductManager);

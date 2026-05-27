class ProductManager extends HTMLElement {
    get STORE_KEY() { return 'products'; }

    connectedCallback() {
        this.render();
        window.addEventListener('productsUpdated', () => this.render());
        window.addEventListener('storage', (event) => {
            if (event.key === 'products' || event.key === null) {
                this.render();
            }
        });
    }

    render() {
        const products = JSON.parse(localStorage.getItem(this.STORE_KEY)) || [];
        
        this.innerHTML = `
            <style>
                /* Contenedor Principal en Grid para Máximo Orden */
                .dashboard-workspace {
                    display: grid;
                    grid-template-columns: 1.6fr 1fr;
                    gap: 30px;
                    align-items: start;
                    margin-top: 20px;
                }

                /* Panel Izquierdo: Tabla e Inventario */
                .inventory-card {
                    background: #0D0D0F;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    padding: 25px;
                    border-radius: 4px;
                }

                /* Panel Derecho: Consola de Control Fija */
                .control-console {
                    background: #0D0D0F;
                    border: 1px solid var(--accent, #D4AF37);
                    padding: 25px;
                    position: sticky;
                    top: 100px;
                    border-radius: 4px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                }

                .console-title {
                    font-family: var(--font-urban, sans-serif);
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    font-size: 1rem;
                    color: #fff;
                    margin-bottom: 20px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }

                /* Formulario Estilizado en Bloques */
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    margin-bottom: 16px;
                }

                .form-group label {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    color: #888;
                }

                /* Fila de miniaturas para la tabla */
                .prod-thumb {
                    width: 40px;
                    height: 40px;
                    object-fit: cover;
                    border-radius: 2px;
                    border: 1px solid rgba(255,255,255,0.1);
                }

                .align-middle {
                    vertical-align: middle;
                }
            </style>

            <div class="dashboard-workspace">
                
                <div class="inventory-card">
                    <div style="display:flex; justify-content:between; align-items:center; margin-bottom:20px;">
                        <h2 style="font-size:1.1rem; color: #fff; letter-spacing:1px;">CATÁLOGO MAESTRO DE PIEZAS</h2>
                        <span style="font-size:0.8rem; color:var(--accent); font-weight:600;">${products.length} Artículos</span>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Prenda</th>
                                <th>Código</th>
                                <th>Precio COP</th>
                                <th style="text-align: right;">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${products.map(p => `
                                <tr>
                                    <td class="align-middle">
                                        <div style="display:flex; align-items:center; gap:12px;">
                                            <img src="${p.img || 'https://via.placeholder.com/40'}" class="prod-thumb" alt="">
                                            <span style="font-weight:500;">${p.name || 'Sin nombre'}</span>
                                        </div>
                                    </td>
                                    <td class="align-middle" style="font-family:monospace; color:#aaa;">${p.code || 'N/A'}</td>
                                    <td class="align-middle" style="font-weight:600;">$${Number(p.price || 0).toLocaleString()}</td>
                                    <td class="align-middle" style="text-align: right;">
                                        <button class="btn-premium btn-edit" data-id="${p.id}" style="padding: 6px 12px; font-size: 0.75rem; background: transparent; color: var(--accent); border-color: rgba(255,255,255,0.1);">Editar</button>
                                        <button class="btn-danger btn-delete" data-id="${p.id}" style="padding: 6px 12px; font-size: 0.75rem; margin-left:5px;">Eliminar</button>
                                    </td>
                                </tr>
                            `).join('')}
                            ${products.length === 0 ? '<tr><td colspan="4" style="text-align:center; color:#555; padding:40px 0;">El catálogo operativo está vacío.</td></tr>' : ''}
                        </tbody>
                    </table>
                </div>

                <div class="control-console">
                    <h3 id="consoleTitle" class="console-title">Registrar Nueva Pieza</h3>
                    <form id="prodForm">
                        <input type="hidden" id="prodId">
                        
                        <div class="form-group">
                            <label>Código Identificador</label>
                            <input type="text" id="prodCode" class="input-premium" placeholder="Ej: GLZ-WC-01" required>
                        </div>

                        <div class="form-group">
                            <label>Nombre del Artículo</label>
                            <input type="text" id="prodName" class="input-premium" placeholder="Nombre oficial" required>
                        </div>

                        <div class="form-group">
                            <label>Precio Neto (COP)</label>
                            <input type="number" id="prodPrice" class="input-premium" placeholder="Valor numérico" required>
                        </div>

                        <div class="form-group">
                            <label>Enlace de Imagen (URL)</label>
                            <input type="url" id="prodImg" class="input-premium" placeholder="https://..." required>
                        </div>

                        <div class="form-group">
                            <label>Descripción de Diseño</label>
                            <textarea id="prodDesc" class="input-premium" placeholder="Detalles de la prenda..." style="height:70px; resize:none;" required></textarea>
                        </div>

                        <div class="form-group">
                            <label>Categoría del Producto</label>
                            <select id="prodCategory" class="input-premium" required style="padding: 10px; background: #1a1a1c; color: #fff; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px;">
                                <option value="">Selecciona categoría...</option>
                                <option value="Gorras">Gorras</option>
                                <option value="Polos">Polos</option>
                                <option value="Camisas Oversize">Camisas Oversize</option>
                                <option value="Buzos">Buzos</option>
                                <option value="Reloj">Reloj</option>
                                <option value="Zapatos">Zapatos</option>
                                <option value="Accesorios">Accesorios</option>
                            </select>
                        </div>

                        <label style="color: #aaa; font-size: 0.8rem; display: flex; align-items: center; gap: 10px; margin: 20px 0; cursor:pointer;">
                            <input type="checkbox" id="prodHasSizes" checked style="accent-color: var(--accent);">
                            Habilitar selector de tallaje textil
                        </label>

                        <div style="display:flex; gap:10px; margin-top:20px;">
                            <button type="button" class="btn-danger" id="clearFormBtn" style="flex:1; display:none;">Limpiar</button>
                            <button type="submit" class="btn-premium" style="flex:2; width:100%;">Guardar Cambios</button>
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

        // Escuchar el envío del formulario
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProd();
        });

        // Botón de cancelar/limpiar edición
        clearBtn.addEventListener('click', () => {
            this.resetConsole();
        });

        // Mapeo de botones de la lista
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

        let products = JSON.parse(localStorage.getItem(this.STORE_KEY)) || [];

        if (id) {
            products = products.map(p => p.id === id ? newData : p);
        } else {
            products.unshift(newData);
        }

        localStorage.setItem(this.STORE_KEY, JSON.stringify(products));
        window.dispatchEvent(new CustomEvent('productsUpdated'));
        
        if(typeof showToast === 'function') showToast("Catálogo operativo sincronizado");
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
        
        // Hacer scroll suave hacia la consola en pantallas pequeñas
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
        if (!confirm("¿Retirar esta pieza del inventario activo?")) return;
        
        let products = JSON.parse(localStorage.getItem(this.STORE_KEY)) || [];
        products = products.filter(p => p.id !== id);
        
        localStorage.setItem(this.STORE_KEY, JSON.stringify(products));
        window.dispatchEvent(new CustomEvent('productsUpdated'));
        
        if(typeof showToast === 'function') showToast("Pieza dada de baja", true);
        this.render();
    }
}
customElements.define('product-manager', ProductManager);
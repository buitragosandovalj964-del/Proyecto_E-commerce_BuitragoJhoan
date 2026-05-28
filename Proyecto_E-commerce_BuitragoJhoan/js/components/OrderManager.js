class OrderManager extends HTMLElement {
    connectedCallback() {
        this.render();
        window.addEventListener('ordersUpdated', () => this.render());
        window.addEventListener('storage', (event) => {
            if (event.key === 'orders' || event.key === null) {
                this.render();
            }
        });
    }

    render() {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

        this.innerHTML = `
            <style>
                .orders-card {
                    background: #F7EFE5;
                    border: 1px solid rgba(17, 17, 17, 0.08);
                    border-radius: 24px;
                    padding: 28px;
                    box-shadow: 0 28px 70px rgba(0, 0, 0, 0.08);
                }
                .orders-title {
                    font-family: var(--font-urban);
                    color: #111111;
                    letter-spacing: 0.14em;
                    text-transform: uppercase;
                    margin-bottom: 18px;
                    font-size: 1rem;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    background: #FFFFFF;
                    border: 1px solid rgba(17, 17, 17, 0.08);
                }
                th, td {
                    padding: 18px 14px;
                    border-bottom: 1px solid rgba(17, 17, 17, 0.08);
                    font-size: 0.95rem;
                    color: #111111;
                }
                th {
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    font-family: var(--font-urban);
                    font-size: 0.78rem;
                    color: #706B63;
                }
                tr:last-child td { border-bottom: none; }
                .btn-view-order {
                    padding: 10px 14px;
                    font-size: 0.78rem;
                }
                .manifest-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(17, 17, 17, 0.55);
                    display: none;
                    justify-content: center;
                    align-items: center;
                    z-index: 4000;
                    padding: 20px;
                }
                .manifest-card {
                    width: min(620px, 100%);
                    background: #F7EFE5;
                    border: 1px solid rgba(17, 17, 17, 0.08);
                    padding: 30px;
                    border-radius: 26px;
                    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.12);
                    color: #111111;
                }
                .manifest-title {
                    font-family: var(--font-urban);
                    font-size: 1rem;
                    color: #111111;
                    letter-spacing: 0.14em;
                    text-transform: uppercase;
                    margin-bottom: 18px;
                }
                #orderDetailsBody p,
                #orderDetailsBody span,
                #orderDetailsBody div,
                #orderDetailsBody strong {
                    color: #111111;
                    font-family: var(--font-main);
                    font-size: 0.95rem;
                }
                .manifest-section-title {
                    font-family: var(--font-urban);
                    color: #111111;
                    font-size: 0.8rem;
                    letter-spacing: 0.12em;
                    margin-top: 18px;
                    margin-bottom: 8px;
                    text-transform: uppercase;
                }
                .item-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                    border-bottom: 1px solid rgba(17, 17, 17, 0.08);
                    padding: 14px 0;
                    font-size: 0.95rem;
                    color: #111111;
                }
                .item-card {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    flex: 1;
                }
                .item-image {
                    width: 72px;
                    height: 72px;
                    border-radius: 18px;
                    object-fit: cover;
                    border: 1px solid rgba(17, 17, 17, 0.08);
                    flex-shrink: 0;
                }
                .item-meta-wrapper {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }
                .item-title {
                    font-family: var(--font-urban);
                    font-size: 0.95rem;
                    color: #111111;
                }
                .item-subtitle {
                    color: #706B63;
                    font-size: 0.82rem;
                }
                .item-row .item-price-spec {
                    color: var(--accent);
                    font-weight: 900;
                    min-width: 120px;
                    text-align: right;
                }
                .close-order-btn {
                    margin-top: 22px;
                    width: 100%;
                }
                @media(max-width: 680px) {
                    .item-row { flex-direction: column; align-items: flex-start; }
                }
            </style>

            <div class="orders-card">
                <h2 class="orders-title">[ HISTORIAL OPERATIVO DE PEDIDOS ]</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID Pedido</th>
                            <th>Fecha</th>
                            <th>Cliente</th>
                            <th>Destino</th>
                            <th>Total</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orders.length === 0 ? `<tr><td colspan="6" style="text-align:center; color:#706B63; padding:36px 0;">[ NINGUNA_ORDEN_DETECTADA ]</td></tr>` : orders.map(o => `
                            <tr>
                                <td style="font-family:monospace; color: var(--accent); font-weight:700;">${o.orderId}</td>
                                <td>${o.date}</td>
                                <td><strong>${o.customer ? o.customer.name : 'No identificado'}</strong></td>
                                <td>${o.customer ? o.customer.city : 'General'}</td>
                                <td style="font-weight:700; color:#111111;">$${o.total.toLocaleString()} COP</td>
                                <td><button class="btn-premium btn-view-order" data-id="${o.orderId}">Inspeccionar</button></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <div class="manifest-overlay" id="orderDetailModal">
                <div class="manifest-card">
                    <div class="manifest-title">[ MANIFIESTO DE DESPACHO ]</div>
                    <div id="orderDetailsBody" style="display:flex; flex-direction:column; gap:12px;"></div>
                    <button class="btn-premium close-order-btn" id="closeOrderModal">Cerrar Manifiesto</button>
                </div>
            </div>
        `;

        this.querySelectorAll('.btn-view-order').forEach(btn => {
            btn.addEventListener('click', (e) => this.viewOrderDetails(e.target.dataset.id));
        });

        this.querySelector('#closeOrderModal').addEventListener('click', () => {
            this.querySelector('#orderDetailModal').style.display = 'none';
        });
    }

    viewOrderDetails(orderId) {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const order = orders.find(o => o.orderId === orderId);
        if (!order) return;

        const body = this.querySelector('#orderDetailsBody');
        body.innerHTML = `
            <p><strong>Código Único de Rastreo:</strong> <span style="font-family:monospace; color:var(--accent); font-weight:700;">${order.orderId}</span></p>
            <p><strong>Fecha de Solicitud:</strong> ${order.date}</p>
            <p><strong>Estado del Despacho:</strong> <span style="background: rgba(194, 180, 162, 0.18); color: #111111; padding: 4px 10px; font-size: 0.82rem; font-weight:700; border-radius: 8px;">${order.status || 'Pendiente'}</span></p>
            <div class="manifest-section-title">Cliente Destinatario</div>
            <p><strong>Nombre:</strong> ${order.customer.name}</p>
            <p><strong>Identificación:</strong> ${order.customer.document || 'No registrado'}</p>
            <p><strong>Correo:</strong> ${order.customer.email || 'No registrado'}</p>
            <p><strong>Contacto Directo:</strong> ${order.customer.phone}</p>
            <p><strong>Destino:</strong> ${order.customer.city}</p>
            <p><strong>Dirección Postal:</strong> ${order.customer.address}</p>
            <div class="manifest-section-title">Piezas Adquiridas</div>
            <div style="max-height:260px; overflow-y:auto; background: #FFFFFF; padding:16px; border:1px solid rgba(17,17,17,0.08); border-radius:16px;">
                ${order.items.map(i => `
                    <div class="item-row">
                        <div class="item-card">
                            <img class="item-image" src="${i.img}" alt="${i.name}">
                            <div class="item-meta-wrapper">
                                <div class="item-title">${i.name} <strong>(x${i.quantity})</strong></div>
                                <div class="item-subtitle">Talla: ${i.size || 'Única'}</div>
                            </div>
                        </div>
                        <span class="item-price-spec">$${(i.price * i.quantity).toLocaleString()} COP</span>
                    </div>
                `).join('')}
            </div>
            <div style="text-align:right; margin-top:18px; font-size:1rem; font-weight:800; color:#111111; border-top:1px solid rgba(17,17,17,0.08); padding-top:16px;">
                TOTAL CONSOLIDADO: <span style="color:var(--accent);">$${order.total.toLocaleString()} COP</span>
            </div>
        `;

        this.querySelector('#orderDetailModal').style.display = 'flex';
    }
}
customElements.define('order-manager', OrderManager);

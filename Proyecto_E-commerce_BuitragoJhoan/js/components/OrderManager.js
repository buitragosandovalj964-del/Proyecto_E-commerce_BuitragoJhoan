// SEBXZ EXCLUSIVE - OrderManager.js (Letras Blancas de Alta Visibilidad para el Admin)
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
        orders.sort((a, b) => b.orderId.localeCompare(a.orderId));

        this.innerHTML = `
            <style>
                /* Estilos de la tabla base del admin */
                table { width: 100%; border-collapse: collapse; margin-top: 15px; background: #0D0E15; }
                th, td { padding: 14px; text-align: left; border-bottom: 1px solid rgba(0, 240, 255, 0.15); font-size: 0.9rem; }
                th { font-family: var(--font-cyber); color: var(--accent); text-transform: uppercase; font-size: 0.8rem; letter-spacing: 1px; }
                td { color: #FFFFFF; }
                
                /* =========================================================
                   MODAL MANIFIESTO: LETRAS 100% BLANCAS Y LEGIBLES
                   ========================================================= */
                .manifest-overlay {
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                    background: rgba(5, 5, 8, 0.85); backdrop-filter: blur(8px);
                    z-index: 3000; display: none; justify-content: center; align-items: center; padding: 20px;
                }
                .manifest-card {
                    background: #0D0D0F; border: 2px solid var(--accent); padding: 35px;
                    width: 100%; max-width: 550px; display: flex; flex-direction: column; gap: 15px;
                    box-shadow: var(--cyber-glow-intense);
                }
                .manifest-title {
                    font-family: var(--font-cyber); color: #FFFFFF !important; font-size: 1.1rem;
                    text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px;
                    border-bottom: 1px solid var(--accent); padding-bottom: 12px;
                }
                /* Contenedor del contenido del reporte */
                #orderDetailsBody p, #orderDetailsBody span, #orderDetailsBody div, #orderDetailsBody strong {
                    color: #FFFFFF !important; /* Fuerza tipografía blanca sobre el fondo negro */
                    font-family: var(--font-main);
                    font-size: 0.9rem;
                }
                .manifest-section-title {
                    font-family: var(--font-cyber) !important;
                    color: var(--accent) !important;
                    font-size: 0.8rem !important;
                    letter-spacing: 1px;
                    margin-top: 15px;
                    margin-bottom: 5px;
                    text-transform: uppercase;
                }
                .item-row {
                    display: flex; justify-content: space-between; font-size: 0.85rem;
                    border-bottom: 1px solid rgba(255,255,255,0.05); padding: 6px 0;
                }
                .item-row .item-price-spec {
                    color: var(--accent) !important;
                    font-weight: 700;
                }
            </style>

            <h2 style="font-size:1.2rem; font-family:var(--font-cyber); color:var(--accent); margin-bottom:20px; letter-spacing:1px;">
                [ HISTORIAL OPERATIVO DE PEDIDOS ]
            </h2>
            
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
                    ${orders.length === 0 ? `<tr><td colspan="6" style="text-align:center; color:#4b5563;">[ NINGUNA_ORDEN_DETECTADA ]</td></tr>` : 
                    orders.map(o => `
                        <tr>
                            <td style="font-family:monospace; color:var(--accent); font-weight:700;">${o.orderId}</td>
                            <td>${o.date}</td>
                            <td><strong>${o.customer ? o.customer.name : 'No Identificado'}</strong></td>
                            <td>${o.customer ? o.customer.city : 'General'}</td>
                            <td style="font-weight:600; color:#FFF;">$${o.total.toLocaleString()} COP</td>
                            <td>
                                <button class="btn-premium btn-view-order" data-id="${o.orderId}" style="padding:4px 10px; font-size:0.75rem;">Inspeccionar</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div class="manifest-overlay" id="orderDetailModal">
                <div class="manifest-card">
                    <div class="manifest-title">[ MANIFIESTO DE DESPACHO ]</div>
                    
                    <div id="orderDetailsBody" style="display:flex; flex-direction:column; gap:8px;">
                        </div>

                    <button class="btn-premium" id="closeOrderModal" style="margin-top:20px; width:100%;">Cerrar Manifiesto</button>
                </div>
            </div>
        `;

        this.querySelectorAll('.btn-view-order').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.viewOrderDetails(e.target.getAttribute('data-id'));
            });
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
            <p><strong>Código Único de Rastreo:</strong> <span style="font-family:monospace; color:var(--accent) !important; font-weight:700;">${order.orderId}</span></p>
            <p><strong>Fecha de Solicitud:</strong> ${order.date}</p>
            <p><strong>Estado del Despacho:</strong> <span style="background:rgba(0,240,255,0.1); color:var(--accent) !important; padding:2px 8px; font-size:0.75rem; font-weight:700;">${order.status || 'Pendiente'}</span></p>
            
            <div class="manifest-section-title">Cliente Destinatario</div>
            <p><strong>Nombre:</strong> ${order.customer.name}</p>
            <p><strong>Identificación:</strong> ${order.customer.document || 'No registrado'}</p>
            <p><strong>Correo:</strong> ${order.customer.email || 'No registrado'}</p>
            <p><strong>Contacto Directo:</strong> ${order.customer.phone}</p>
            <p><strong>Destino:</strong> ${order.customer.city}</p>
            <p><strong>Dirección Postal:</strong> ${order.customer.address}</p>

            <div class="manifest-section-title">Piezas Adquiridas</div>
            <div style="max-height:160px; overflow-y:auto; background:rgba(0,0,0,0.4); padding:12px; border:1px solid rgba(0,240,255,0.15);">
                ${order.items.map(i => `
                    <div class="item-row">
                        <span>${i.name} <strong>(x${i.quantity})</strong> <small style="color:var(--accent) !important;">[Talla: ${i.size || 'Única'}]</small></span>
                        <span class="item-price-spec">$${(i.price * i.quantity).toLocaleString()} COP</span>
                    </div>
                `).join('')}
            </div>

            <div style="text-align:right; margin-top:15px; font-size:1.05rem; font-weight:900; border-top:1px solid rgba(0,240,255,0.3); padding-top:12px; color:#FFFFFF !important;">
                TOTAL CONSOLIDADO: <span style="color:var(--accent) !important;">$${order.total.toLocaleString()} COP</span>
            </div>
        `;

        this.querySelector('#orderDetailModal').style.display = 'flex';
    }
}
customElements.define('order-manager', OrderManager);
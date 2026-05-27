// SEBXZ EXCLUSIVE - Componente de Bolsa Desplegable con Cuestionario y Alerta de Éxito
class CartModal extends HTMLElement {
    constructor() {
        super();
        this.isOpen = false;
        this.renderStatic();
    }

    connectedCallback() {
        this.cacheElements();
        this.attachListeners();
        this.updateCartView();

        window.addEventListener('cartUpdated', () => {
            this.updateCartView();
            this.restoreVisualState();
        });

        window.addEventListener('storage', (event) => {
            if (event.key === 'cart' || event.key === 'orders' || event.key === null) {
                this.updateCartView();
                this.restoreVisualState();
            }
        });
    }

    renderStatic() {
        this.innerHTML = `
            <style>
                .cart-overlay {
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                    background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(4px);
                    z-index: 1000; display: none; justify-content: flex-end;
                }
                .cart-sidebar {
                    width: 100%; max-width: 450px; height: 100%; background: #0D0D0F;
                    box-shadow: -10px 0 40px rgba(0,0,0,0.5); display: flex; flex-direction: column; padding: 30px;
                }
                .btn-back-store {
                    display: inline-flex; align-items: center; gap: 12px; background: transparent;
                    border: none; color: #EAE6DF; font-family: var(--font-cyber); font-size: 0.85rem;
                    font-weight: 800; text-transform: uppercase; letter-spacing: 2px; cursor: pointer;
                    margin-bottom: 40px; transition: all 0.3s;
                }
                .btn-back-store:hover { color: var(--accent); transform: translateX(-6px); }
                .cart-title {
                    font-family: var(--font-cyber); color: #FFFFFF; font-size: 1.1rem;
                    text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 20px;
                    border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;
                }
                .cart-items-container { flex: 1; overflow-y: auto; margin-bottom: 20px; }
                .cart-item {
                    display: flex; gap: 15px; background: rgba(255, 255, 255, 0.03);
                    padding: 15px; margin-bottom: 15px; border: 1px solid rgba(255,255,255,0.05);
                }
                .cart-item img { width: 70px; height: 90px; object-fit: cover; }
                .item-details { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
                .item-details h4 { font-family: var(--font-cyber); color: #FFFFFF; font-size: 0.9rem; }
                .item-meta { font-size: 0.75rem; color: #4b5563; }
                .cart-quantity {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-top: 12px;
                }
                .qty-btn {
                    width: 30px;
                    height: 30px;
                    border: 1px solid rgba(255,255,255,0.12);
                    background: transparent;
                    color: #FFFFFF;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: background 0.2s ease;
                }
                .qty-btn:hover { background: rgba(255,255,255,0.08); }
                .qty-btn:disabled { opacity: 0.35; cursor: not-allowed; }
                .delete-item-btn {
                    margin-top: 14px;
                    align-self: flex-start;
                    padding: 6px 10px;
                    border: 1px solid rgba(255,255,255,0.15);
                    background: transparent;
                    color: #fbbf24;
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    cursor: pointer;
                    transition: background 0.2s ease, border-color 0.2s ease;
                }
                .delete-item-btn:hover { background: rgba(251,191,36,0.08); border-color: rgba(251,191,36,0.4); }
                .item-price { color: var(--accent); font-weight: 700; font-size: 0.9rem; }
                .cart-footer { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; }
                .total-box {
                    display: flex; justify-content: space-between; font-family: var(--font-cyber);
                    color: #FFF; font-size: 1.1rem; font-weight: 800; margin-bottom: 20px;
                }
                .total-box span { color: var(--accent); }
                .form-overlay {
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                    background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(6px);
                    z-index: 2000; display: none; justify-content: center; align-items: center; padding: 20px;
                }
                .form-container {
                    background: #0D0D0F; border: 1px solid var(--border-color);
                    width: 100%; max-width: 500px; padding: 35px; box-shadow: 0 20px 50px rgba(0,0,0,0.8);
                }
                .form-header {
                    font-family: var(--font-cyber); color: #FFFFFF; font-size: 1.2rem;
                    text-transform: uppercase; letter-spacing: 2px; margin-bottom: 25px;
                    border-bottom: 1px solid var(--accent); padding-bottom: 12px; text-align: center;
                }
                .form-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 18px; }
                .form-group label { font-family: var(--font-cyber); color: #4b5563; font-size: 0.75rem; text-transform: uppercase; }
                .form-group input {
                    background: #000; border: 1px solid var(--border-color); padding: 12px;
                    color: #FFFFFF; font-size: 0.85rem; outline: none;
                }
                .form-group input:focus { border-color: var(--accent); box-shadow: var(--cyber-glow); }
                .form-actions { display: flex; gap: 15px; margin-top: 30px; }
                .success-overlay {
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                    background: rgba(5, 5, 8, 0.9); backdrop-filter: blur(8px);
                    z-index: 3000; display: none; justify-content: center; align-items: center; padding: 20px;
                }
                .success-card {
                    background: #0D0E15; border: 2px solid var(--accent); padding: 40px;
                    width: 100%; max-width: 420px; text-align: center; box-shadow: var(--cyber-glow-intense);
                }
                .success-icon {
                    width: 70px; height: 70px; background: rgba(0, 240, 255, 0.1);
                    border: 2px solid var(--accent); color: var(--accent); border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 2.2rem; margin: 0 auto 20px auto;
                    box-shadow: var(--cyber-glow);
                }
                .success-title {
                    font-family: var(--font-cyber); color: #FFF; font-size: 1.3rem;
                    text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;
                }
                .success-msg { color: #4b5563; font-size: 0.85rem; margin-bottom: 25px; line-height: 1.5; }
                .success-msg strong { color: #FFF; font-family: monospace; }
            </style>

            <div class="cart-overlay" id="modalOverlay">
                <div class="cart-sidebar">
                    <button class="btn-back-store" id="backToStoreBtn">← Volver a la tienda</button>
                    <div class="cart-title">[ Tu Bolsa de Compra ]</div>
                    <div class="cart-items-container" id="cartItemsContainer"></div>
                    <div class="cart-footer">
                        <div class="total-box"><div>TOTAL:</div><span id="cartTotalAmount">$0 COP</span></div>
                        <button class="btn-premium" id="checkoutBtn" style="width:100%;">Proceder al Pago</button>
                    </div>
                </div>
            </div>

            <div class="form-overlay" id="checkoutFormOverlay">
                <div class="form-container">
                    <div class="form-header">[ Datos de Despacho ]</div>
                    <form id="orderForm">
                        <div class="form-group"><label>Identificación *</label><input type="text" id="clientDocument" required placeholder="Ej. CC 123456789"></div>
                        <div class="form-group"><label>Correo Electrónico *</label><input type="email" id="clientEmail" required placeholder="Ej. cliente@mail.com"></div>
                        <div class="form-group"><label>Nombre Completo *</label><input type="text" id="clientName" required placeholder="Ej. Jhoan Sebastián"></div>
                        <div class="form-group"><label>Teléfono / WhatsApp *</label><input type="tel" id="clientPhone" required placeholder="Ej. 3123456789"></div>
                        <div class="form-group"><label>Ciudad Destino *</label><input type="text" id="clientCity" required placeholder="Ej. Bucaramanga"></div>
                        <div class="form-group"><label>Dirección Completa *</label><input type="text" id="clientAddress" required placeholder="Ej. Calle 36 #24-10"></div>
                        <div class="form-actions">
                            <button type="button" class="btn-danger" id="cancelFormBtn" style="flex:1;">Cancelar</button>
                            <button type="submit" class="btn-premium" style="flex:2;">Confirmar Pedido</button>
                        </div>
                    </form>
                </div>
            </div>

            <div class="success-overlay" id="successAlertModal">
                <div class="success-card">
                    <div class="success-icon">✔</div>
                    <div class="success-title">Pedido Realizado</div>
                    <div class="success-msg">
                        El protocolo de despacho ha sido transmitido con éxito al sistema central de administración.<br><br>
                        MANIFIESTO DE RASTREO:<br><strong id="successOrderId">OR-000000</strong>
                    </div>
                    <button class="btn-premium" id="closeSuccessBtn" style="width: 100%;">Finalizar Operación</button>
                </div>
            </div>
        `;
    }

    cacheElements() {
        this.overlay = this.querySelector('.cart-overlay');
        this.cartItemsContainer = this.querySelector('#cartItemsContainer');
        this.cartTotalAmount = this.querySelector('#cartTotalAmount');
        this.checkoutBtn = this.querySelector('#checkoutBtn');
        this.checkoutFormOverlay = this.querySelector('#checkoutFormOverlay');
        this.orderForm = this.querySelector('#orderForm');
        this.cancelFormBtn = this.querySelector('#cancelFormBtn');
        this.successOverlay = this.querySelector('#successAlertModal');
        this.successOrderId = this.querySelector('#successOrderId');
    }

    attachListeners() {
        const backBtn = this.querySelector('#backToStoreBtn');
        if (backBtn) backBtn.addEventListener('click', () => this.closeCart());

        if (this.checkoutBtn) {
            this.checkoutBtn.addEventListener('click', () => this.openCheckoutForm());
        }

        if (this.cartItemsContainer) {
            this.cartItemsContainer.addEventListener('click', (event) => {
                const deleteBtn = event.target.closest('.delete-item-btn');
                if (deleteBtn) {
                    const productId = deleteBtn.dataset.id;
                    const productSize = deleteBtn.dataset.size || 'Única';
                    this.removeItem(productId, productSize);
                    return;
                }

                const button = event.target.closest('.qty-btn');
                if (!button) return;
                const action = button.dataset.action;
                const productId = button.dataset.id;
                const productSize = button.dataset.size || 'Única';
                changeQuantity(productId, productSize, action === 'increase' ? 1 : -1);
            });
        }

        if (this.cancelFormBtn) {
            this.cancelFormBtn.addEventListener('click', () => {
                this.closeCheckoutForm();
                this.openCart();
            });
        }

        if (this.orderForm) {
            this.orderForm.addEventListener('submit', (event) => this.processOrder(event));
        }

        const closeSuccessBtn = this.querySelector('#closeSuccessBtn');
        if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', () => this.closeSuccessAlert());

        if (this.successOverlay) {
            this.successOverlay.addEventListener('click', (event) => {
                if (event.target === this.successOverlay) this.closeSuccessAlert();
            });
        }
    }

    openCart() {
        this.isOpen = true;
        if (this.overlay) this.overlay.style.display = 'flex';
    }

    closeCart() {
        this.isOpen = false;
        if (this.overlay) this.overlay.style.display = 'none';
    }

    restoreVisualState() {
        if (this.overlay) {
            this.overlay.style.display = this.isOpen ? 'flex' : 'none';
        }
    }

    openCheckoutForm() {
        this.closeCart();
        if (this.checkoutFormOverlay) this.checkoutFormOverlay.style.display = 'flex';
    }

    closeCheckoutForm() {
        if (this.checkoutFormOverlay) this.checkoutFormOverlay.style.display = 'none';
    }

    removeItem(productId, size) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => !(item.id === productId && item.size === size));
        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    }

    showSuccessAlert(orderId) {
        if (this.successOrderId) this.successOrderId.textContent = orderId;
        if (this.successOverlay) this.successOverlay.style.display = 'flex';
    }

    closeSuccessAlert() {
        if (this.successOverlay) this.successOverlay.style.display = 'none';
    }

    processOrder(event) {
        event.preventDefault();

        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) return;

        const documentId = this.querySelector('#clientDocument').value.trim();
        const email = this.querySelector('#clientEmail').value.trim();
        const clientName = this.querySelector('#clientName').value.trim();
        const clientPhone = this.querySelector('#clientPhone').value.trim();
        const clientCity = this.querySelector('#clientCity').value.trim();
        const clientAddress = this.querySelector('#clientAddress').value.trim();

        if (!documentId || !email || !clientName || !clientPhone || !clientCity || !clientAddress) {
            showToast('Complete todos los campos obligatorios', true);
            return;
        }

        const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const generatedId = `OR-${Date.now().toString().slice(-6)}`;

        const newOrder = {
            orderId: generatedId,
            date: new Date().toLocaleDateString(),
            customer: {
                document: documentId,
                email,
                name: clientName,
                phone: clientPhone,
                address: clientAddress,
                city: clientCity
            },
            items: cart,
            total,
            status: 'Pendiente'
        };

        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(newOrder);
        localStorage.setItem('orders', JSON.stringify(orders));
        localStorage.setItem('cart', JSON.stringify([]));

        window.dispatchEvent(new CustomEvent('cartUpdated'));
        window.dispatchEvent(new CustomEvent('ordersUpdated'));

        if (this.orderForm) this.orderForm.reset();
        this.closeCheckoutForm();
        this.showSuccessAlert(generatedId);
    }

    updateCartView() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

        if (this.cartItemsContainer) {
            if (cart.length === 0) {
                this.cartItemsContainer.innerHTML = `
                    <p style="text-align:center; color:#4b5563; font-family:var(--font-cyber); font-size:0.8rem; margin-top:40px;">[ BOLSA_VACÍA ]</p>
                `;
            } else {
                this.cartItemsContainer.innerHTML = cart.map(item => `
                    <div class="cart-item">
                        <img src="${item.img}" alt="${item.name}">
                        <div class="item-details">
                            <div>
                                <h4>${item.name}</h4>
                                <div class="item-meta">TALLA: <strong>${item.size || 'Única'}</strong></div>
                                <div class="cart-quantity">
                                    <button type="button" class="qty-btn" data-action="decrease" data-id="${item.id}" data-size="${item.size || 'Única'}">−</button>
                                    <span style="color:#FFFFFF; font-size:0.95rem; font-weight:700;">${item.quantity}</span>
                                    <button type="button" class="qty-btn" data-action="increase" data-id="${item.id}" data-size="${item.size || 'Única'}">+</button>
                                </div>
                                <button type="button" class="delete-item-btn" data-id="${item.id}" data-size="${item.size || 'Única'}">Eliminar</button>
                            </div>
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <div class="item-price">$${(item.price * item.quantity).toLocaleString()} COP</div>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }

        if (this.cartTotalAmount) {
            this.cartTotalAmount.textContent = `$${total.toLocaleString()} COP`;
        }

        if (this.checkoutBtn) {
            this.checkoutBtn.disabled = cart.length === 0;
            if (cart.length === 0) {
                this.checkoutBtn.style.opacity = '0.3';
                this.checkoutBtn.style.cursor = 'not-allowed';
            } else {
                this.checkoutBtn.style.opacity = '1';
                this.checkoutBtn.style.cursor = 'pointer';
            }
        }
    }
}
customElements.define('cart-modal', CartModal);
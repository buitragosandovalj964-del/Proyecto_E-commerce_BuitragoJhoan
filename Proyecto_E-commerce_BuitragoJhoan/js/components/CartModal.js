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
                    position: fixed;
                    inset: 0;
                    background: rgba(17, 17, 17, 0.45);
                    backdrop-filter: blur(12px);
                    z-index: 2000;
                    display: none;
                    justify-content: flex-end;
                }
                .cart-sidebar {
                    width: 100%;
                    max-width: 460px;
                    height: 100%;
                    background: #F7EFE5;
                    box-shadow: -12px 0 50px rgba(0, 0, 0, 0.12);
                    display: flex;
                    flex-direction: column;
                    padding: 32px;
                }
                .btn-back-store {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    color: #111111;
                    background: transparent;
                    border: none;
                    font-family: var(--font-urban);
                    font-size: 0.82rem;
                    letter-spacing: 0.16em;
                    text-transform: uppercase;
                    cursor: pointer;
                    margin-bottom: 24px;
                }
                .btn-back-store:hover {
                    color: var(--beige-premium);
                }
                .cart-title {
                    font-family: var(--font-urban);
                    font-size: 1rem;
                    letter-spacing: 0.22em;
                    text-transform: uppercase;
                    margin-bottom: 14px;
                    color: #111111;
                }
                .cart-items-container {
                    flex: 1;
                    overflow-y: auto;
                    padding-right: 6px;
                    margin-bottom: 20px;
                }
                .cart-item {
                    display: flex;
                    gap: 16px;
                    background: #FFFFFF;
                    border: 1px solid rgba(17, 17, 17, 0.08);
                    padding: 18px;
                    border-radius: 20px;
                    margin-bottom: 16px;
                }
                .cart-item img {
                    width: 82px;
                    height: 88px;
                    object-fit: cover;
                    border-radius: 16px;
                }
                .item-details {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
                .item-details h4 {
                    font-family: var(--font-urban);
                    font-size: 0.95rem;
                    margin-bottom: 6px;
                    color: #111111;
                }
                .item-meta {
                    color: #706B63;
                    font-size: 0.78rem;
                    margin-bottom: 10px;
                }
                .cart-quantity {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 10px;
                }
                .qty-btn {
                    width: 34px;
                    height: 34px;
                    border: 1px solid rgba(17, 17, 17, 0.12);
                    background: #FFFFFF;
                    color: #111111;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: background 0.2s ease;
                }
                .qty-btn:hover {
                    background: rgba(17, 17, 17, 0.05);
                }
                .delete-item-btn {
                    padding: 8px 12px;
                    border: 1px solid rgba(17, 17, 17, 0.18);
                    background: transparent;
                    color: #111111;
                    font-size: 0.78rem;
                    text-transform: uppercase;
                    letter-spacing: 0.12em;
                    cursor: pointer;
                    border-radius: 4px;
                    width: fit-content;
                }
                .delete-item-btn:hover {
                    background: rgba(17, 17, 17, 0.05);
                }
                .item-price {
                    color: var(--accent);
                    font-weight: 900;
                    font-size: 0.95rem;
                }
                .cart-footer {
                    border-top: 1px solid rgba(17, 17, 17, 0.12);
                    padding-top: 24px;
                }
                .total-box {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-family: var(--font-urban);
                    font-size: 1rem;
                    font-weight: 800;
                    color: #111111;
                    margin-bottom: 18px;
                }
                .total-box span {
                    color: var(--accent);
                }
                .form-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(17, 17, 17, 0.45);
                    backdrop-filter: blur(12px);
                    z-index: 2400;
                    display: none;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                }
                .form-container {
                    width: min(560px, 100%);
                    background: #FFFFFF;
                    border: 1px solid rgba(17, 17, 17, 0.12);
                    box-shadow: 0 35px 70px rgba(0, 0, 0, 0.08);
                    padding: 32px;
                    border-radius: 24px;
                }
                .form-header {
                    margin-bottom: 24px;
                    font-family: var(--font-urban);
                    font-size: 1.15rem;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: #111111;
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    margin-bottom: 18px;
                }
                .form-group label {
                    color: #706B63;
                    font-size: 0.77rem;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                }
                .form-group input {
                    background: #F7EFE5;
                    border: 1px solid rgba(17, 17, 17, 0.12);
                    padding: 14px 16px;
                    border-radius: 8px;
                    color: #111111;
                    font-size: 0.95rem;
                }
                .form-group input:focus {
                    outline: 2px solid rgba(17, 17, 17, 0.12);
                }
                .form-actions {
                    display: flex;
                    gap: 14px;
                    flex-wrap: wrap;
                    margin-top: 22px;
                }
                .success-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(17, 17, 17, 0.65);
                    backdrop-filter: blur(16px);
                    z-index: 2600;
                    display: none;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                }
                .success-card {
                    width: min(500px, 100%);
                    background: #F7EFE5;
                    border: 1px solid rgba(17, 17, 17, 0.12);
                    padding: 36px;
                    border-radius: 24px;
                    text-align: center;
                    box-shadow: 0 35px 80px rgba(0, 0, 0, 0.12);
                }
                .success-icon {
                    width: 72px;
                    height: 72px;
                    border-radius: 50%;
                    background: rgba(17, 17, 17, 0.08);
                    color: var(--accent);
                    display: grid;
                    place-items: center;
                    margin: 0 auto 22px;
                    font-size: 2rem;
                }
                .success-title {
                    font-family: var(--font-urban);
                    font-size: 1.2rem;
                    margin-bottom: 12px;
                    color: #111111;
                    letter-spacing: 0.16em;
                    text-transform: uppercase;
                }
                .success-msg {
                    color: #4F493F;
                    font-size: 0.92rem;
                    line-height: 1.7;
                    margin-bottom: 24px;
                }
                .success-msg strong {
                    color: #111111;
                }
                @media(max-width: 680px) {
                    .cart-sidebar {
                        max-width: 100%;
                        padding: 24px;
                    }
                    .cart-item {
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                    }
                    .cart-item img {
                        margin-bottom: 12px;
                    }
                    .item-details {
                        align-items: center;
                    }
                    .form-actions {
                        flex-direction: column;
                    }
                }
            </style>

            <div class="cart-overlay" id="modalOverlay">
                <div class="cart-sidebar">
                    <button class="btn-back-store" id="backToStoreBtn">← Volver a la tienda</button>
                    <div class="cart-title">[ Tu Bolsa de Compra ]</div>
                    <div class="cart-items-container" id="cartItemsContainer"></div>
                    <div class="cart-footer">
                        <div class="total-box"><span>Total:</span><span id="cartTotalAmount">$0 COP</span></div>
                        <button class="btn-premium" id="checkoutBtn" style="width:100%;">Proceder al Pago</button>
                    </div>
                </div>
            </div>

            <div class="form-overlay" id="checkoutFormOverlay">
                <div class="form-container">
                    <div class="form-header">[ Datos de Despacho ]</div>
                    <form id="orderForm">
                        <div class="form-group"><label for="clientDocument">Identificación *</label><input type="text" id="clientDocument" required placeholder="Ej. CC 123456789"></div>
                        <div class="form-group"><label for="clientEmail">Correo Electrónico *</label><input type="email" id="clientEmail" required placeholder="Ej. cliente@mail.com"></div>
                        <div class="form-group"><label for="clientName">Nombre Completo *</label><input type="text" id="clientName" required placeholder="Ej. Jhoan Sebastián"></div>
                        <div class="form-group"><label for="clientPhone">Teléfono / WhatsApp *</label><input type="tel" id="clientPhone" required placeholder="Ej. 3123456789"></div>
                        <div class="form-group"><label for="clientCity">Ciudad Destino *</label><input type="text" id="clientCity" required placeholder="Ej. Bucaramanga"></div>
                        <div class="form-group"><label for="clientAddress">Dirección Completa *</label><input type="text" id="clientAddress" required placeholder="Ej. Calle 36 #24-10"></div>
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
            timestamp: Date.now(),
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
                    <p style="text-align:center; color:#706B63; font-family:var(--font-main); font-size:0.9rem; margin-top:40px;">[ BOLSA_VACÍA ]</p>
                `;
            } else {
                this.cartItemsContainer.innerHTML = cart.map(item => `
                    <div class="cart-item">
                        <img src="${item.img}" alt="${item.name}">
                        <div class="item-details">
                            <div>
                                <h4>${item.name}</h4>
                                <div class="item-meta">Talla: <strong>${item.size || 'Única'}</strong></div>
                                <div class="cart-quantity">
                                    <button type="button" class="qty-btn" data-action="decrease" data-id="${item.id}" data-size="${item.size || 'Única'}">−</button>
                                    <span style="color:#111111; font-size:0.95rem; font-weight:700;">${item.quantity}</span>
                                    <button type="button" class="qty-btn" data-action="increase" data-id="${item.id}" data-size="${item.size || 'Única'}">+</button>
                                </div>
                            </div>
                            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                                <div class="item-price">$${(item.price * item.quantity).toLocaleString()} COP</div>
                                <button type="button" class="delete-item-btn" data-id="${item.id}" data-size="${item.size || 'Única'}">Eliminar</button>
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
            this.checkoutBtn.style.opacity = cart.length === 0 ? '0.35' : '1';
            this.checkoutBtn.style.cursor = cart.length === 0 ? 'not-allowed' : 'pointer';
        }
    }
}
customElements.define('cart-modal', CartModal);

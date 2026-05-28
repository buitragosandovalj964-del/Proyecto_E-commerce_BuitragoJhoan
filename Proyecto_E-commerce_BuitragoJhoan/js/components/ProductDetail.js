class ProductDetailModal extends HTMLElement {
    constructor() {
        super();
        this.selectedSize = 'Única';
        this.innerHTML = `
            <style>
                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(17, 17, 17, 0.55);
                    backdrop-filter: blur(14px);
                    display: none;
                    justify-content: center;
                    align-items: center;
                    z-index: 2200;
                    padding: 20px;
                }

                .modal-content {
                    width: min(980px, 100%);
                    background: #F7EFE5;
                    border: 1px solid rgba(17, 17, 17, 0.08);
                    border-radius: 28px;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    overflow: hidden;
                    box-shadow: 0 35px 90px rgba(0, 0, 0, 0.16);
                    min-height: 420px;
                }

                .modal-close {
                    position: absolute;
                    right: 28px;
                    top: 24px;
                    font-size: 1.8rem;
                    color: #111111;
                    cursor: pointer;
                    z-index: 10;
                }

                .modal-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    aspect-ratio: 4 / 5;
                }

                .modal-info {
                    padding: 40px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    color: #111111;
                }

                .modal-info h2 {
                    font-family: var(--font-urban);
                    font-size: clamp(2rem, 2.4vw, 2.8rem);
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    margin-bottom: 14px;
                }

                .modal-info .product-code {
                    font-family: var(--font-main);
                    font-size: 0.82rem;
                    letter-spacing: 0.14em;
                    text-transform: uppercase;
                    color: #706B63;
                    margin-bottom: 18px;
                }

                .modal-info .price {
                    font-family: var(--font-urban);
                    font-size: 2rem;
                    color: #111111;
                    font-weight: 900;
                    margin-bottom: 18px;
                }

                .modal-info p {
                    color: #3f3a33;
                    line-height: 1.75;
                    font-size: 0.98rem;
                    margin-bottom: 26px;
                }

                .detail-size-selector {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    margin-bottom: 26px;
                }

                .detail-size-btn {
                    min-width: 56px;
                    padding: 12px 16px;
                    border: 1px solid rgba(17, 17, 17, 0.16);
                    background: #FFFFFF;
                    color: #111111;
                    font-family: var(--font-urban);
                    font-size: 0.85rem;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    cursor: pointer;
                    transition: all 0.25s ease;
                }

                .detail-size-btn.active {
                    background: #111111;
                    color: #F7EFE5;
                    border-color: #111111;
                }

                .detail-actions {
                    display: flex;
                    gap: 14px;
                    flex-wrap: wrap;
                }

                .detail-actions button {
                    flex: 1;
                    min-width: 160px;
                }

                .secondary-btn {
                    background: transparent;
                    color: #111111;
                    border: 1px solid rgba(17, 17, 17, 0.16);
                }

                .primary-btn {
                    background: #111111;
                    color: #F7EFE5;
                }

                @media(max-width: 900px) {
                    .modal-content {
                        grid-template-columns: 1fr;
                    }
                }

                @media(max-width: 620px) {
                    .modal-info {
                        padding: 24px;
                    }

                    .modal-close {
                        right: 18px;
                        top: 18px;
                    }
                }
            </style>

            <div class="modal-overlay" id="detailOverlay">
                <div class="modal-content">
                    <span class="modal-close" id="closeDetail">&times;</span>
                    <img class="modal-img" id="detailImg" src="" alt="">
                    <div class="modal-info">
                        <div>
                            <div class="product-code" id="detailCode"></div>
                            <h2 id="detailTitle"></h2>
                            <div class="price" id="detailPrice"></div>
                            <p id="detailDesc"></p>
                        </div>
                        <div>
                            <div class="detail-size-selector" id="detailSizeSelector"></div>
                            <div class="detail-actions">
                                <button class="btn-premium secondary-btn" id="backBtn" type="button">Volver</button>
                                <button class="btn-premium primary-btn" id="addCartFromDetail" type="button">Añadir al Carrito</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    connectedCallback() {
        this.overlay = this.querySelector('#detailOverlay');
        this.detailSizeSelector = this.querySelector('#detailSizeSelector');
        this.addCartButton = this.querySelector('#addCartFromDetail');
        this.querySelector('#closeDetail').addEventListener('click', () => this.close());
        this.querySelector('#backBtn').addEventListener('click', () => this.close());

        this.addEventListener('click', (event) => {
            const target = event.target;

            if (target.classList.contains('detail-size-btn')) {
                this.detailSizeSelector.querySelectorAll('.detail-size-btn').forEach(btn => btn.classList.remove('active'));
                target.classList.add('active');
                this.selectedSize = target.dataset.size || 'S';
                this.updateAddButtonLabel();
            }

            if (target.id === 'addCartFromDetail') {
                if (!this.currentProd) return;
                const size = this.currentProd.hasSizes ? this.selectedSize : 'Única';
                addToCart(this.currentProd.id, size);
                this.close();
            }
        });
    }

    openProduct(id) {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        this.currentProd = products.find(p => p.id === id);
        if (!this.currentProd) return;

        this.querySelector('#detailImg').src = this.currentProd.img;
        this.querySelector('#detailImg').alt = this.currentProd.name;
        this.querySelector('#detailTitle').innerText = this.currentProd.name;
        this.querySelector('#detailCode').innerText = this.currentProd.code;
        this.querySelector('#detailDesc').innerText = this.currentProd.desc;
        this.querySelector('#detailPrice').innerText = `$${Number(this.currentProd.price).toLocaleString()} COP`;

        if (this.currentProd.hasSizes) {
            this.detailSizeSelector.innerHTML = ['S', 'M', 'L', 'XL'].map(size => `
                <button type="button" class="detail-size-btn${size === 'S' ? ' active' : ''}" data-size="${size}">${size}</button>
            `).join('');
            this.selectedSize = 'S';
        } else {
            this.detailSizeSelector.innerHTML = '';
            this.selectedSize = 'Única';
        }

        this.updateAddButtonLabel();
        this.overlay.style.display = 'flex';
    }

    updateAddButtonLabel() {
        if (!this.addCartButton) return;
        this.addCartButton.textContent = this.currentProd && this.currentProd.hasSizes
            ? `Añadir al Carrito (${this.selectedSize})`
            : 'Añadir al Carrito';
    }

    close() {
        if (this.overlay) {
            this.overlay.style.display = 'none';
        }
    }
}

customElements.define('product-detail-modal', ProductDetailModal);

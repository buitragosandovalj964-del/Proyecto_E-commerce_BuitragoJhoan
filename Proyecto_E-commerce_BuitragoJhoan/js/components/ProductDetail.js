class ProductDetailModal extends HTMLElement {
    constructor() {
        super();
        this.selectedSize = 'Única';
        this.innerHTML = `
            <style>
                .modal-overlay {
                    position: fixed; top:0; left:0; width:100%; height:100%;
                    background: rgba(0,0,0,0.85); backdrop-filter: blur(15px);
                    display: none; justify-content: center; align-items: center; z-index: 2000;
                }
                .modal-content {
                    background: #111; border: 1px solid var(--accent);
                    width: 80%; max-width: 900px; display: flex; position: relative;
                }
                .modal-close {
                    position: absolute; top: 15px; right: 20px; font-size: 1.8rem;
                    cursor: pointer; color: var(--accent);
                }
                .modal-img { width: 50%; height: 500px; object-fit: cover; }
                .modal-info { width: 50%; padding: 40px; display: flex; flex-direction: column; justify-content: center; }
                .modal-info h2 { font-family: var(--font-luxury); font-size: 2rem; margin-bottom: 15px; }
                .modal-info p { color: var(--text-muted); line-height: 1.6; margin-bottom: 25px; font-size: 0.95rem; }
                .modal-info .price { font-size: 1.5rem; color: var(--accent); font-weight: bold; margin-bottom: 20px; font-family: monospace; }
                .detail-size-selector { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
                .detail-size-btn {
                    border: 1px solid var(--border-color);
                    background: #fff;
                    color: var(--text-main);
                    padding: 8px 14px;
                    font-family: var(--font-urban);
                    cursor: pointer;
                }
                .detail-size-btn.active {
                    background: var(--accent);
                    color: #fff;
                    border-color: var(--accent);
                }
                @media(max-width: 768px) {
                    .modal-content { flex-direction: column; }
                    .modal-img { width:100%; height:300px; }
                    .modal-info { width:100%; padding:20px; }
                }
            </style>
            <div class="modal-overlay" id="detailOverlay">
                <div class="modal-content">
                    <span class="modal-close" id="closeDetail">&times;</span>
                    <img class="modal-img" id="detailImg" src="" alt="">
                    <div class="modal-info">
                        <h2 id="detailTitle"></h2>
                        <p id="detailDesc"></p>
                        <div class="price" id="detailPrice"></div>
                        <div id="detailSizeSelector" class="detail-size-selector"></div>
                        <div style="display:flex; gap:10px; flex-wrap: wrap; align-items:center;">
                            <button class="btn-premium" id="backBtn" type="button">Volver</button>
                            <button class="btn-premium" id="addCartFromDetail" type="button" style="background: var(--accent); color:#000;">Añadir al Carrito</button>
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
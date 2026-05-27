class ProductCard extends HTMLElement {
    connectedCallback() {
        const id = this.getAttribute('id');
        const name = this.getAttribute('name');
        const price = this.getAttribute('price');
        const img = this.getAttribute('img');
        const hasSizes = this.getAttribute('has-sizes') === 'true';

        this.innerHTML = `
            <div class="card">
                <img src="${img}" alt="${name}">
                <h3>${name}</h3>
                <div class="price">$${Number(price).toLocaleString()} COP</div>
                
                ${hasSizes ? `
                <div class="size-selector">
                    <button class="size-btn active" data-size="S">S</button>
                    <button class="size-btn" data-size="M">M</button>
                    <button class="size-btn" data-size="L">L</button>
                    <button class="size-btn" data-size="XL">XL</button>
                </div>
                ` : '<div style="height: 36px;"></div>'}

                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button class="btn-premium" id="viewBtn-${id}" style="background:transparent; color:var(--accent);">Ver</button>
                    <button class="btn-premium" id="addBtn-${id}">+ Bolsa</button>
                </div>
            </div>
        `;

        if (hasSizes) {
            const sizeButtons = this.querySelectorAll('.size-btn');
            sizeButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    sizeButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                });
            });
        }

        this.querySelector(`#viewBtn-${id}`).addEventListener('click', () => {
            document.getElementById('detailModal').openProduct(id);
        });

        this.querySelector(`#addBtn-${id}`).addEventListener('click', () => {
            let selectedSize = 'Única';
            if (hasSizes) {
                const activeBtn = this.querySelector('.size-btn.active');
                selectedSize = activeBtn ? activeBtn.getAttribute('data-size') : 'M';
            }
            addToCart(id, selectedSize);
        });
    }
}
customElements.define('product-card', ProductCard);
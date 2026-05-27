class ProductCard extends HTMLElement {

    connectedCallback() {
        this.render();
    }

    static get observedAttributes() {
        return ['id', 'name', 'price', 'img', 'has-sizes', 'data-product-id'];
    }

    attributeChangedCallback() {
        this.render();
    }

    render() {
        // Primero intentar obtener el ID del atributo data-product-id
        let id = this.getAttribute('data-product-id') || this.getAttribute('id');
        
        // Si tenemos un ID, buscar el producto en localStorage
        if (id && (this.getAttribute('data-product-id') || !this.getAttribute('name'))) {
            const products = JSON.parse(localStorage.getItem('products')) || [];
            const product = products.find(p => p.id === id);
            
            if (product) {
                this.setAttribute('id', product.id);
                this.setAttribute('name', product.name);
                this.setAttribute('price', product.price);
                this.setAttribute('img', product.img);
                if (product.hasSizes) {
                    this.setAttribute('has-sizes', 'true');
                }
            }
        }

        const id_final = this.getAttribute('id');
        const name = this.getAttribute('name');
        const price = this.getAttribute('price');
        const img = this.getAttribute('img');
        const hasSizes = this.getAttribute('has-sizes') === 'true';

        this.innerHTML = `
            <div class="card">
                <img src="${img}" alt="${name}">
                <h3>${name}</h3>
                <div class="price">
                    $${Number(price).toLocaleString()} COP
                </div>
                ${
                    hasSizes
                    ? `
                        <div class="size-selector">
                            <button type="button" class="size-btn active" data-size="S">S</button>
                            <button type="button" class="size-btn" data-size="M">M</button>
                            <button type="button" class="size-btn" data-size="L">L</button>
                            <button type="button" class="size-btn" data-size="XL">XL</button>
                        </div>
                    `
                    : `
                        <div style="height:36px;"></div>
                    `
                }
                <div style="display:flex; gap:10px; justify-content:center;">
                    <button 
                        type="button"
                        class="btn-premium view-btn"
                        style="background:transparent; color:var(--accent);"
                    >
                        Ver
                    </button>
                    <button 
                        type="button"
                        class="btn-premium add-btn"
                    >
                        + Bolsa
                    </button>
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

        const viewBtn = this.querySelector('.view-btn');
        if (viewBtn) {
            viewBtn.addEventListener('click', () => {
                const modal = document.getElementById('detailModal');
                if (modal && typeof modal.openProduct === 'function') {
                    modal.openProduct(id_final);
                }
            });
        }

        const addBtn = this.querySelector('.add-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                let selectedSize = 'Única';
                if (hasSizes) {
                    const activeBtn = this.querySelector('.size-btn.active');
                    selectedSize = activeBtn ? activeBtn.dataset.size : 'S';
                }
                addToCart(id_final, selectedSize);
            });
        }
    }
}

customElements.define('product-card', ProductCard);
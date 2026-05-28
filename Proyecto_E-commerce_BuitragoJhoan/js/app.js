// SEBXZ EXCLUSIVE - Base de Datos Centralizada (Streetwear Drop v2 - Bone & Beige)
const defaultProducts = [
    { id: "p1", code: "UG-HD-01", name: "Buzo Undergold 'Core Hype'", price: 340000, img: "https://i.pinimg.com/736x/3a/20/66/3a206653d6a4bd0f6f50ab087fccc92e.jpg", desc: "Buzo estilo hoodie pesado de la marca Undergold. Horma boxy fit con capota reforzada e intervenciones gráficas minimalistas.", hasSizes: true, category: "Buzos" },
    { id: "p2", code: "OV-SH-02", name: "Camisa Oversize Heavy Canvas", price: 180000, img: "https://i.pinimg.com/1200x/de/d0/3b/ded03b15726f49e97dc777ac71e1c292.jpg", desc: "Camisa de corte relajado y hombros caídos en tono neutro deslavado. Ideal para outfits streetwear por capas.", hasSizes: true, category: "Camisas Oversize" },
    { id: "p3", code: "OV-SH-03", name: "Camisa Oversize Cyber Grid", price: 195000, img: "https://i.pinimg.com/1200x/f9/30/bc/f930bc4022652e5017c26566ecf4a20e.jpg", desc: "Camisa de silueta premium amplia. Textura suave de alta caída optimizada para climas urbanos.", hasSizes: true, category: "Camisas Oversize" },
    { id: "p4", code: "RL-SW-04", name: "Buzo Crewneck Ralph Lauren", price: 650000, img: "https://i.pinimg.com/736x/62/c2/af/62c2af13ba3b900ba9a7f62ae6b5977c.jpg", desc: "Sweater clásico de cuello redondo con el icónico bordado de Ralph Lauren. Un balance perfecto entre el lujo clásico y el block core urbano.", hasSizes: true, category: "Buzos" },
    { id: "p5", code: "BB-PL-05", name: "Polo Burberry 'Monogram Edge'", price: 1450000, img: "https://i.pinimg.com/1200x/ac/52/f0/ac52f06c4596f4adce7a05d19a1e2e63.jpg", desc: "Camisa polo de alta costura Burberry. Tejido piqué texturizado con sutiles detalles del tartán de la casa en los perfiles del cuello.", hasSizes: true, category: "Polos" },
    { id: "p6", code: "RL-PL-06", name: "Polo Ralph Lauren Green Signature", price: 480000, img: "https://i.pinimg.com/1200x/da/b4/ff/dab4ffbd58f51266b8fb4edc2687b443.jpg", desc: "Polo de algodón entallado en verde botella profundo. Estilo vintage impecable para elevar la rotación diaria.", hasSizes: true, category: "Polos" },
    { id: "p7", code: "GS-WT-07", name: "Reloj Casio G-Shock G-Steel Premium", price: 1150000, img: "https://i.pinimg.com/1200x/c9/1e/53/c91e533dc0b04e8cb547043283cc9af2.jpg", desc: "Accesorio de alta resistencia con estructura de acero cepillado y resina reforzada. El balance definitivo entre la estética utilitarian y el lujo callejero.", hasSizes: false, category: "Reloj" },
    { id: "p8", code: "NE-CP-08", name: "Gorra New Era Azul Classic", price: 240000, img: "https://i.pinimg.com/1200x/84/01/8d/84018d689434d7deb3f77efd178f4f31.jpg", desc: "Gorra fitted clásica de New Era. Color azul eléctrico con visera estructurada y bordado lateral de alta densidad.", hasSizes: false, category: "Gorras" },
    { id: "p9", code: "NK-AM-09", name: "Sneakers Nike Air Max White Volt", price: 680000, img: "https://i.pinimg.com/1200x/5a/67/a1/5a67a1f5293897df59e565f9a429b785.jpg", desc: "Calzado deportivo con cápsula de aire expuesta. Silueta agresiva, detalles en cuero sintético blanco y máxima comodidad reflectiva.", hasSizes: false, category: "Zapatos" },
    { id: "p10", code: "NK-AF-10", name: "Nike Air Force 1 Black Stealth", price: 520000, img: "https://i.pinimg.com/1200x/29/0f/2d/290f2dceb78dd80a03b246422a20e16b.jpg", desc: "La silueta callejera más icónica del mundo en su versión completamente oscura. Cuero mate de alta duración resistente al desgarre.", hasSizes: false, category: "Zapatos" },
    { id: "p11", code: "VT-PR-11", name: "Perfume Valentino 'Born In Roma'", price: 720000, img: "https://i.pinimg.com/736x/93/05/0e/93050e3fce37c6e17f27b596b4d22639.jpg", desc: "Fragancia premium con notas amaderadas de alta fijación. Frasco icónico esculpido con los tachones representativos de Valentino.", hasSizes: false, category: "Accesorios" }
];

const STORAGE_KEYS = {
    PRODUCTS: 'products',
    CART: 'cart',
    ORDERS: 'orders',
    CATEGORIES: 'categories'
};

function normalizeCategoryId(name) {
    return `cat-${name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '')}`;
}

function getCategories() {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES)) || [];
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)) || defaultProducts;
    const productCategories = [...new Set(products.map(p => p.category).filter(Boolean))];
    const merged = [...stored];

    productCategories.forEach(name => {
        if (!merged.find(cat => cat.name === name)) {
            merged.push({ id: normalizeCategoryId(name), name, description: '' });
        }
    });

    return merged;
}

function initializeStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(defaultProducts));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CART)) {
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
    }
    const categories = getCategories();
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
}

initializeStorage();
window.getCategories = getCategories;

function showToast(message, isError = false) {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.right = '20px';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '10px';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.style.background = '#FFFFFF';
    toast.style.color = '#111111';
    toast.style.border = '1px solid var(--accent)';
    toast.style.padding = '14px 22px';
    toast.style.borderLeft = `4px solid ${isError ? '#ef4444' : 'var(--beige-premium)'}`;
    toast.style.fontFamily = 'var(--font-urban)';
    toast.style.fontSize = '0.75rem';
    toast.style.fontWeight = '700';
    toast.style.letterSpacing = '1px';
    toast.innerText = `[DROP]: ${message.toUpperCase()}`;

    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.4s';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

function addToCart(productId, size) {
    let cart = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART)) || [];
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)) || [];
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const finalSize = product.hasSizes ? size : 'Única';
    const existingItem = cart.find(item => item.id === productId && item.size === finalSize);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            img: product.img,
            code: product.code,
            size: finalSize,
            quantity: 1,
            hasSizes: product.hasSizes
        });
    }

    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    showToast(`Pieza añadida [${finalSize}]`);
}

function changeQuantity(productId, size, change) {
    let cart = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART)) || [];
    const itemIndex = cart.findIndex(item => item.id === productId && item.size === size);
    if (itemIndex === -1) return;

    cart[itemIndex].quantity += change;
    if (cart[itemIndex].quantity <= 0) {
        cart.splice(itemIndex, 1);
        showToast('Removido del drop');
    }

    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('cartUpdated'));
}

window.addEventListener('storage', event => {
    if ([STORAGE_KEYS.PRODUCTS, STORAGE_KEYS.CATEGORIES, STORAGE_KEYS.CART].includes(event.key) || event.key === null) {
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        window.dispatchEvent(new CustomEvent('productsUpdated'));
        window.dispatchEvent(new CustomEvent('categoriesUpdated'));
    }
});

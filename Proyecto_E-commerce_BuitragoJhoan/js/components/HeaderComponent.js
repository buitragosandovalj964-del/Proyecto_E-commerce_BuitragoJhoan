// SEBXZ EXCLUSIVE - Componente Temático de Navegación Premium (Bone & Beige Drop)
class HeaderLuxe extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <style>
                /* Barra de anuncios superior con tipografía limpia */
                .top-bar {
                    background: var(--accent); /* Negro Absoluto */
                    color: #FFFFFF;
                    text-align: center;
                    padding: 8px;
                    font-family: var(--font-main);
                    font-size: 0.75rem;
                    font-weight: 500;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                }

                /* Contenedor de navegación minimalista premium */
                .nav-luxe {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px 5%;
                    background: #FFFFFF; /* Fondo blanco para contraste total con el hueso */
                    border-bottom: 1px solid rgba(194, 180, 162, 0.4);
                    position: sticky;
                    top: 0;
                    z-index: 999;
                }

                /* Logo urbano pesado */
                .logo {
                    font-family: var(--font-urban);
                    font-size: 1.6rem;
                    font-weight: 800;
                    letter-spacing: 2px;
                    text-decoration: none;
                    color: var(--text-main);
                    text-transform: uppercase;
                }
                .logo span {
                    color: var(--beige-premium);
                }

                .nav-links {
                    display: flex;
                    align-items: center;
                    gap: 30px;
                }

                .nav-links a {
                    font-family: var(--font-main);
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: var(--text-muted);
                    text-decoration: none;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    transition: color 0.3s;
                }
                .nav-links a:hover {
                    color: var(--accent);
                }
                
                /* =========================================================
                   BLOQUE MAXIMIZADO DEL CARRITO (STREETWEAR TAG DESIGN)
                   ========================================================= */
                .cart-link {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-family: var(--font-urban) !important;
                    font-size: 1.15rem !important; /* Texto notablemente más grande */
                    font-weight: 800;
                    color: var(--text-main) !important;
                    text-decoration: none;
                    letter-spacing: 1.5px;
                    padding: 10px 20px;
                    border: 2px solid var(--accent); /* Recuadro pesado para que resalte */
                    background: transparent;
                    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }
                
                /* El ícono emoji escalado de forma independiente */
                .cart-icon {
                    font-size: 1.5rem; 
                    display: inline-block;
                    transition: transform 0.3s ease;
                }
                
                /* Contador numérico sólido */
                .cart-badge {
                    background: var(--accent);
                    color: #FFFFFF;
                    padding: 2px 10px;
                    border-radius: 0px; /* Ángulos rectos agresivos */
                    font-size: 0.95rem;
                    font-weight: 800;
                    font-family: var(--font-urban);
                    min-width: 25px;
                    text-align: center;
                    transition: all 0.3s ease;
                }

                /* Efecto de inversión urbana al pasar el mouse */
                .cart-link:hover {
                    background: var(--accent);
                    color: #FFFFFF !important;
                }
                
                .cart-link:hover .cart-icon {
                    transform: scale(1.1) rotate(-5deg);
                }
                
                .cart-link:hover .cart-badge {
                    background: #FFFFFF;
                    color: var(--accent);
                }
            </style>

            <div class="top-bar">[ PROTOCOLO DE DESPACHO INMEDIATO ACTIVADO // ENVÍOS NACIONALES ]</div>
            <nav class="nav-luxe">
                <a href="index.html" class="logo">SEBXZ<span>_EXCLUSIVE</span></a>
                <div class="nav-links">
                    <a href="admin.html">// SYSTEM_ADMIN</a>
                    <a href="#" id="cartTrigger" class="cart-link">
                        <span class="cart-icon">🛒</span> 
                        <span>BAG</span> 
                        <span class="cart-badge" id="countSpan">0</span>
                    </a>
                </div>
            </nav>
        `;
    }

    connectedCallback() {
        this.updateCartCount();
        this.querySelector('#cartTrigger').addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('cartModal').openCart();
        });
    }

    // Lógica optimizada para refrescar el conteo de ítems reales en la bolsa
    updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((acumulador, item) => acumulador + item.quantity, 0);
        const countSpan = this.querySelector('#countSpan');
        if (countSpan) {
            countSpan.innerText = totalItems;
        }
    }
}

customElements.define('header-luxe', HeaderLuxe);
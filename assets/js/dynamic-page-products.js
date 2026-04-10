(function () {
    const API_BASE = 'https://pagina-6ygv.onrender.com/api';

    function getCurrentPageName() {
        const path = window.location.pathname || '';
        const file = path.split('/').pop();
        return file || 'index.html';
    }

    function getProductsGrid() {
        // support several grid containers: page category grids, generic product-grid, and the index featured grid
        return (
            document.getElementById('productsGrid') ||
            document.getElementById('featuredProductsGrid') ||
            document.querySelector('.product-grid-category') ||
            document.querySelector('.product-grid')
        );
    }

    function toNumber(value, fallback = 0) {
        const n = Number(value);
        return Number.isFinite(n) ? n : fallback;
    }

    function isInFavorites(productId) {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        return favorites.some((item) => String(item.id) === String(productId));
    }

    function isInCart(productId) {
        const cart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
        return cart.some((item) => String(item.id) === String(productId));
    }

    function addToFavorites(product) {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const exists = favorites.some((item) => String(item.id) === String(product.id));
        if (exists) return;
        favorites.push(product);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    function addToCartDirect(product) {
        const cart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
        const existing = cart.find((item) => String(item.id) === String(product.id));
        if (existing) {
            existing.quantity = (existing.quantity || 1) + 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
    }

    function notify(message, type) {
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type || 'success');
        }
    }

    function renderCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.id = String(product.id);

        const hasDiscount = toNumber(product.discount, 0) > 0;
        const currentPrice = toNumber(product.finalPrice, toNumber(product.price, 0));
        const originalPrice = hasDiscount ? toNumber(product.price, currentPrice) : null;
        const favoriteActive = isInFavorites(product.id) ? 'active' : '';
        const inCart = isInCart(product.id);

        card.innerHTML = `
            ${hasDiscount ? `<div class="product-badge">-${toNumber(product.discount, 0)}%</div>` : ''}
            <button class="favorite-btn ${favoriteActive}" data-fav-id="${product.id}">
                <i class="fas fa-heart"></i>
            </button>
            <div class="product-image">
                <img src="${product.image || ''}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description || ''}</p>
                <div class="product-price">
                    <span class="current-price">$${currentPrice.toFixed(2)}</span>
                    ${originalPrice ? `<span class="original-price">$${originalPrice.toFixed(2)}</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="${inCart ? 'added-to-cart-btn' : 'add-to-cart-btn'}" data-cart-id="${product.id}">
                        <i class="fas fa-shopping-bag"></i> ${inCart ? 'En el carrito' : 'Añadir al carrito'}
                    </button>
                    <button class="buy-now-btn" data-buy-id="${product.id}">
                        <i class="fas fa-credit-card"></i> Comprar
                    </button>
                </div>
            </div>
        `;

        card.querySelector('[data-fav-id]')?.addEventListener('click', function (e) {
            e.preventDefault();
            if (typeof window.toggleFavorite === 'function') {
                window.toggleFavorite(product.id);
                return;
            }
            const exists = isInFavorites(product.id);
            if (!exists) {
                addToFavorites(product);
                this.classList.add('active');
                notify('Producto añadido a favoritos', 'success');
            } else {
                let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
                favorites = favorites.filter((item) => String(item.id) !== String(product.id));
                localStorage.setItem('favorites', JSON.stringify(favorites));
                this.classList.remove('active');
                notify('Producto eliminado de favoritos', 'info');
            }
            if (typeof window.updateWishlistCount === 'function') window.updateWishlistCount();
        });

        card.querySelector('[data-cart-id]')?.addEventListener('click', function (e) {
            e.preventDefault();
            addToCartDirect(product);
            this.classList.remove('add-to-cart-btn');
            this.classList.add('added-to-cart-btn');
            this.innerHTML = '<i class="fas fa-check"></i> En el carrito';
            notify(`${product.name} añadido al carrito`, 'success');
            if (typeof window.updateCartCount === 'function') window.updateCartCount();
        });

        card.querySelector('[data-buy-id]')?.addEventListener('click', function (e) {
            e.preventDefault();
            addToCartDirect(product);
            window.location.href = 'carrito.html#step2';
        });

        return card;
    }

    async function fetchProductsFromApi() {
        try {
            const response = await fetch(`${API_BASE}/products`);
            if (!response.ok) throw new Error('API response not ok');
            const products = await response.json();
            if (!Array.isArray(products) || products.length === 0) throw new Error('No products from API');
            return products;
        } catch (err) {
            console.warn('API products load failed, will try local seed:', err);
            return null;
        }
    }

    async function fetchProductsFromSeed() {
        try {
            const resp = await fetch('assets/js/products-seed.json');
            if (!resp.ok) throw new Error('Seed file not found');
            const data = await resp.json();
            if (!Array.isArray(data)) throw new Error('Invalid seed format');
            return data;
        } catch (err) {
            console.warn('Local seed load failed:', err);
            return [];
        }
    }

    async function appendDynamicProducts() {
        const grid = getProductsGrid();
        if (!grid) return;

        let products = await fetchProductsFromApi();
        if (!Array.isArray(products) || products.length === 0) {
            products = await fetchProductsFromSeed();
        }

        if (!Array.isArray(products) || products.length === 0) return;

        const existingIds = new Set(
            Array.from(grid.querySelectorAll('[data-id]')).map((el) => String(el.getAttribute('data-id')))
        );

        products.forEach((product) => {
            if (!product || !product.id) return;
            if (existingIds.has(String(product.id))) return;

            const normalized = {
                id: String(product.id),
                name: product.name,
                image: product.image,
                description: product.description,
                price: toNumber(product.price, 0),
                finalPrice: toNumber(product.finalPrice ?? product.price, toNumber(product.price, 0)),
                discount: toNumber(product.discount, 0)
            };

            grid.appendChild(renderCard(normalized));
        });

        const productsCount = document.getElementById('productsCount');
        if (productsCount) {
            const total = grid.querySelectorAll('[data-id]').length;
            productsCount.textContent = `Mostrando ${total} productos`;
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        appendDynamicProducts().catch((err) => {
            console.error('No se pudieron cargar productos dinámicos:', err);
        });
    });
})();

// ===== VARIABLES GLOBALES =====
        let cart = [];
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        let promoCodeApplied = false;
        let discountAmount = 0;
        let currentStep = 1;
        let checkoutOrderData = null;

        const MP_DRAFT_KEY = 'mpCheckoutDraft';
        const MP_LAST_PAYMENT_KEY = 'mpLastPaymentId';
        const IS_LOCAL_HOST = ['localhost', '127.0.0.1'].includes(window.location.hostname);
        const API_BASE = IS_LOCAL_HOST ? 'http://localhost:3000' : '';
        const CHECKOUT_RETURN_BASE = IS_LOCAL_HOST ? 'https://stylehub.pics' : window.location.origin;

        const SHIPPING_COST = 5.99;
        const SHIPPING_FREE_THRESHOLD = 29.99;
        const VALID_PROMO_CODES = {
            'VERANO20': 0.20,
            'BIENVENIDA': 0.15,
            'STYLE10': 0.10
        };

        // Base de datos de productos para búsqueda
        const productDatabase = [
            // Mujer
            { name: 'Vestido Floral', category: 'Mujer', subcategory: 'Vestidos', icon: 'fa-tshirt', url: 'vestidos.html' },
            { name: 'Blusa de Seda', category: 'Mujer', subcategory: 'Tops y Blusas', icon: 'fa-tshirt', url: 'tops.html' },
            { name: 'Pantalón Palazzo', category: 'Mujer', subcategory: 'Pantalones', icon: 'fa-tshirt', url: 'pantalones-mujer.html' },
            { name: 'Falda Plisada', category: 'Mujer', subcategory: 'Faldas', icon: 'fa-tshirt', url: 'faldas.html' },
            { name: 'Chaqueta de Cuero', category: 'Mujer', subcategory: 'Chaquetas', icon: 'fa-tshirt', url: 'chaquetas-mujer.html' },
            { name: 'Bolso de Mano', category: 'Mujer', subcategory: 'Bolsos', icon: 'fa-shopping-bag', url: 'bolsos.html' },
            { name: 'Collar de Plata', category: 'Mujer', subcategory: 'Joyería', icon: 'fa-gem', url: 'joyeria.html' },
            { name: 'Tacones', category: 'Mujer', subcategory: 'Zapatos', icon: 'fa-shoe-prints', url: 'zapatos-mujer.html' },

            // Hombre
            { name: 'Camiseta Básica', category: 'Hombre', subcategory: 'Camisetas', icon: 'fa-tshirt', url: 'camisetas.html' },
            { name: 'Camisa Oxford', category: 'Hombre', subcategory: 'Camisas', icon: 'fa-tshirt', url: 'camisas.html' },
            { name: 'Pantalón Chino', category: 'Hombre', subcategory: 'Pantalones', icon: 'fa-tshirt', url: 'pantalones-hombre.html' },
            { name: 'Chaqueta Bomber', category: 'Hombre', subcategory: 'Chaquetas', icon: 'fa-tshirt', url: 'chaquetas.html' },
            { name: 'Traje Azul Marino', category: 'Hombre', subcategory: 'Trajes', icon: 'fa-tshirt', url: 'trajes.html' },
            { name: 'Zapatos Derby', category: 'Hombre', subcategory: 'Zapatos', icon: 'fa-shoe-prints', url: 'zapatos-hombre.html' },
            { name: 'Reloj Cronógrafo', category: 'Hombre', subcategory: 'Relojes', icon: 'fa-clock', url: 'relojes.html' },
            { name: 'Cinturón de Cuero', category: 'Hombre', subcategory: 'Cinturones', icon: 'fa-belt', url: 'cinturones.html' },

            // Niños
            { name: 'Tops para niñas', category: 'Niños', subcategory: 'Tops', icon: 'fa-tshirt', url: 'tops-niña.html' },
            { name: 'Pantalones para niñas', category: 'Niños', subcategory: 'Pantalones', icon: 'fa-tshirt', url: 'pantalones-niña.html' },
            { name: 'Camisetas para niños', category: 'Niños', subcategory: 'Camisetas', icon: 'fa-tshirt', url: 'camisetas-niños.html' },
            { name: 'Pantalones para niño', category: 'Niños', subcategory: 'Pantalones', icon: 'fa-tshirt', url: 'pantalones-niño.html' },
            { name: 'Chaquetas para niño', category: 'Niños', subcategory: 'Chaquetas', icon: 'fa-tshirt', url: 'chaquetas-niño.html' },

            // Páginas generales
            { name: 'Novedades', category: 'Página', subcategory: 'Colección 2024', icon: 'fa-star', url: 'novedades.html' },
            { name: 'Ofertas', category: 'Página', subcategory: 'Descuentos', icon: 'fa-tag', url: 'ofertas.html' },
            { name: 'Colecciones', category: 'Página', subcategory: 'Diseños exclusivos', icon: 'fa-palette', url: 'colecciones.html' }
        ];

        // ===== FUNCIONES DE INICIALIZACIÓN =====
        document.addEventListener('DOMContentLoaded', function() {
            loadCartFromStorage();
            updateCartDisplay();
            updateCartCount();
            updateWishlistCount();
            setupEventListeners();
            setupMobileMenu();
            setupSearch();
            updateUserInterface();
            updateCheckoutProgress(1);
            handleMercadoPagoReturn();
        });

        // ===== FUNCIONES DE BÚSQUEDA =====
        function searchProducts(query) {
            if (!query || query.trim() === '') {
                return [];
            }

            const searchTerm = query.toLowerCase().trim();

            return productDatabase.filter(product => {
                return product.name.toLowerCase().includes(searchTerm) ||
                       product.category.toLowerCase().includes(searchTerm) ||
                       product.subcategory.toLowerCase().includes(searchTerm);
            });
        }

        function groupByCategory(results) {
            const groups = {};
            results.forEach(product => {
                if (!groups[product.category]) {
                    groups[product.category] = [];
                }
                groups[product.category].push(product);
            });
            return groups;
        }

        function showSuggestions(results) {
            const suggestionsDiv = document.getElementById('searchSuggestions');
            if (!suggestionsDiv) return;

            if (results.length === 0) {
                suggestionsDiv.innerHTML = `
                    <div class="suggestions-header">
                        <i class="fas fa-search"></i>
                        <span>BÚSQUEDA</span>
                    </div>
                    <div class="no-suggestions">
                        <i class="fas fa-box-open"></i>
                        <p>No se encontraron productos</p>
                        <small>Intenta con otras palabras</small>
                    </div>
                    <div class="suggestion-footer">
                        <i class="fas fa-arrow-up"></i> Presiona Enter para buscar <i class="fas fa-arrow-down"></i>
                    </div>
                `;
                suggestionsDiv.classList.add('active');
                return;
            }

            const groupedResults = groupByCategory(results);
            const categories = Object.keys(groupedResults);

            let html = `
                <div class="suggestions-header">
                    <i class="fas fa-search"></i>
                    <span>SUGERENCIAS (${results.length} resultados)</span>
                </div>
            `;

            categories.slice(0, 3).forEach(category => {
                const products = groupedResults[category].slice(0, 3);

                html += `
                    <div class="suggestion-group">
                        <div class="suggestion-group-title">
                            <i class="fas fa-tag"></i> ${category}
                        </div>
                `;

                products.forEach(product => {
                    html += `
                        <div class="suggestion-item" data-url="${product.url}">
                            <i class="fas ${product.icon}"></i>
                            <div class="suggestion-info">
                                <div class="suggestion-name">${product.name}</div>
                                <div class="suggestion-category">
                                    <i class="fas fa-angle-right"></i>
                                    ${product.subcategory}
                                </div>
                            </div>
                            <span class="suggestion-badge">${product.category}</span>
                        </div>
                    `;
                });

                if (groupedResults[category].length > 3) {
                    html += `
                        <div class="suggestion-item view-more" data-category="${category}">
                            <i class="fas fa-plus-circle"></i>
                            <div class="suggestion-info">
                                <div class="suggestion-name">Ver más de ${category}</div>
                                <div class="suggestion-category">${groupedResults[category].length - 3} productos más</div>
                            </div>
                        </div>
                    `;
                }

                html += `</div>`;
            });

            if (results.length > 9) {
                html += `
                    <div class="suggestion-footer">
                        <i class="fas fa-search"></i> 
                        Mostrando 9 de ${results.length} resultados. 
                        <strong id="viewAllResults">Ver todos los resultados</strong>
                    </div>
                `;
            } else {
                html += `
                    <div class="suggestion-footer">
                        <i class="fas fa-arrow-up"></i> Presiona Enter para buscar <i class="fas fa-arrow-down"></i>
                    </div>
                `;
            }

            suggestionsDiv.innerHTML = html;
            suggestionsDiv.classList.add('active');

            document.querySelectorAll('.suggestion-item[data-url]').forEach(item => {
                item.addEventListener('click', function() {
                    window.location.href = this.dataset.url;
                });
            });

            const viewAllBtn = document.getElementById('viewAllResults');
            if (viewAllBtn) {
                viewAllBtn.addEventListener('click', function() {
                    const query = document.getElementById('searchInput').value;
                    showSearchResults(query);
                    suggestionsDiv.classList.remove('active');
                });
            }
        }

        function showSearchResults(query) {
            const results = searchProducts(query);
            const modal = document.getElementById('searchModal');
            const statsDiv = document.getElementById('searchStats');
            const resultsGrid = document.getElementById('searchResultsGrid');

            if (!modal || !statsDiv || !resultsGrid) return;

            statsDiv.innerHTML = `Se encontraron <strong>${results.length}</strong> resultados para "<strong>${query}</strong>"`;

            if (results.length === 0) {
                resultsGrid.innerHTML = `
                    <div class="no-results" style="grid-column: 1 / -1;">
                        <i class="fas fa-search"></i>
                        <h3>No se encontraron resultados</h3>
                        <p>Intenta con otras palabras clave</p>
                    </div>
                `;
            } else {
                resultsGrid.innerHTML = results.map(product => {
                    return `
                        <div class="search-result-card" data-url="${product.url}">
                            <i class="fas ${product.icon} search-result-icon"></i>
                            <div class="search-result-title">${product.name}</div>
                            <div class="search-result-category">${product.category} - ${product.subcategory}</div>
                        </div>
                    `;
                }).join('');

                document.querySelectorAll('.search-result-card').forEach(card => {
                    card.addEventListener('click', function() {
                        window.location.href = this.dataset.url;
                    });
                });
            }

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function setupSearch() {
            const searchInput = document.getElementById('searchInput');
            const searchButton = document.getElementById('searchButton');
            const suggestionsDiv = document.getElementById('searchSuggestions');
            const closeModal = document.getElementById('closeSearchModal');
            const modal = document.getElementById('searchModal');

            if (searchInput) {
                searchInput.addEventListener('input', function(e) {
                    const query = e.target.value;
                    if (query.trim().length >= 2) {
                        const results = searchProducts(query);
                        showSuggestions(results);
                    } else {
                        suggestionsDiv.classList.remove('active');
                    }
                });

                document.addEventListener('click', function(e) {
                    if (!searchInput.contains(e.target) && !suggestionsDiv.contains(e.target)) {
                        suggestionsDiv.classList.remove('active');
                    }
                });

                searchInput.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        const query = e.target.value;
                        if (query.trim()) {
                            showSearchResults(query);
                            suggestionsDiv.classList.remove('active');
                        }
                    }
                });
            }

            if (searchButton) {
                searchButton.addEventListener('click', function() {
                    const query = searchInput.value;
                    if (query.trim()) {
                        showSearchResults(query);
                        suggestionsDiv.classList.remove('active');
                    }
                });
            }

            if (closeModal) {
                closeModal.addEventListener('click', function() {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                });
            }

            if (modal) {
                modal.addEventListener('click', function(e) {
                    if (e.target === modal) {
                        modal.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                });
            }

            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }

        // ===== FUNCIONES DE FAVORITOS =====
        function updateWishlistCount() {
            const wishlistCount = document.getElementById('wishlistCount');
            if (wishlistCount) {
                wishlistCount.textContent = favorites.length;
                wishlistCount.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    wishlistCount.style.transform = 'scale(1)';
                }, 300);
            }
        }

        // ===== FUNCIONES DEL CARRITO =====
        function readCartFromStorage() {
            // Compatibilidad con claves usadas en versiones anteriores del frontend
            const cartKeys = ['shoppingCart', 'cartItems', 'carrito'];

            for (const key of cartKeys) {
                const raw = localStorage.getItem(key);
                if (!raw) continue;

                try {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        return parsed;
                    }
                } catch (err) {
                    console.warn(`No se pudo parsear el carrito almacenado en ${key}:`, err);
                }
            }

            return [];
        }

        function loadCartFromStorage() {
            cart = readCartFromStorage().map(item => ({
                ...item,
                quantity: item.quantity || 1
            }));
        }

        function saveCartToStorage() {
            localStorage.setItem('shoppingCart', JSON.stringify(cart));
        }

        function updateCartDisplay() {
            updateCartItems();
            updateOrderSummary();
        }

        function updateCartItems() {
            const cartItemsContainer = document.getElementById('cartItemsContainer');
            const cartItemsCount = document.getElementById('cartItemsCount');
            const proceedBtn = document.getElementById('proceedToInfo');

            if (!cartItemsContainer) return;

            if (cart.length === 0) {
                cartItemsContainer.innerHTML = `
                    <div class="empty-cart">
                        <div class="empty-cart-icon">
                            <i class="fas fa-shopping-cart"></i>
                        </div>
                        <h3>Tu carrito está vacío</h3>
                        <p>Agrega productos desde la tienda para comenzar tu compra</p>
                        <a href="index.html" class="explore-btn">Explorar Productos</a>
                    </div>
                `;
                if (proceedBtn) proceedBtn.disabled = true;
                if (cartItemsCount) cartItemsCount.textContent = '(0 productos)';
            } else {
                let html = '';

                cart.forEach((item, index) => {
                    const quantity = item.quantity || 1;
                    const itemTotal = item.price * quantity;

                    html += `
                        <div class="cart-item" data-index="${index}">
                            <div class="cart-item-image">
                                <img src="${item.image}" alt="${item.name}">
                            </div>
                            <div class="cart-item-details">
                                <h3 class="cart-item-title">${item.name}</h3>
                                <div class="cart-item-price">
                                    <span>$${item.price.toFixed(2)}</span>
                                    ${item.originalPrice ? `<span class="cart-item-original-price">$${item.originalPrice.toFixed(2)}</span>` : ''}
                                </div>
                                <div class="cart-item-actions">
                                    <div class="quantity-controls">
                                        <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                                        <span class="quantity-display">${quantity}</span>
                                        <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                                    </div>
                                    <button class="remove-btn" onclick="removeFromCart(${index})">
                                        <i class="fas fa-trash-alt"></i> Eliminar
                                    </button>
                                </div>
                            </div>
                            <div class="cart-item-total">
                                <div class="cart-item-total-price">$${itemTotal.toFixed(2)}</div>
                            </div>
                        </div>
                    `;
                });

                cartItemsContainer.innerHTML = html;
                if (proceedBtn) proceedBtn.disabled = false;

                const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
                if (cartItemsCount) cartItemsCount.textContent = `(${totalItems} ${totalItems === 1 ? 'producto' : 'productos'})`;
            }
        }

        function updateQuantity(index, change) {
            if (cart[index]) {
                cart[index].quantity = (cart[index].quantity || 1) + change;

                if (cart[index].quantity <= 0) {
                    cart.splice(index, 1);
                }

                saveCartToStorage();
                updateCartDisplay();
                updateCartCount();
                showNotification('Cantidad actualizada', 'success');
            }
        }

        function removeFromCart(index) {
            const productName = cart[index].name;
            cart.splice(index, 1);
            saveCartToStorage();
            updateCartDisplay();
            updateCartCount();
            showNotification(`${productName} eliminado del carrito`, 'success');
        }

        function clearCart() {
            if (cart.length === 0) return;

            if (confirm('¿Estás seguro de que quieres vaciar todo el carrito?')) {
                cart = [];
                saveCartToStorage();
                updateCartDisplay();
                updateCartCount();
                showNotification('Carrito vaciado correctamente', 'success');
            }
        }

        function updateCartCount() {
            const cartCount = document.getElementById('cartCount');
            if (cartCount) {
                const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
                cartCount.textContent = totalItems;
                cartCount.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    cartCount.style.transform = 'scale(1)';
                }, 300);
            }
        }

        function updateOrderSummary() {
            const subtotal = cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
            const shipping = subtotal >= SHIPPING_FREE_THRESHOLD ? 0 : SHIPPING_COST;
            let discount = 0;

            if (promoCodeApplied && subtotal > 0) {
                discount = subtotal * discountAmount;
            }

            const total = subtotal + shipping - discount;

            const subtotalElement = document.getElementById('subtotal');
            const shippingElement = document.getElementById('shipping');
            const discountElement = document.getElementById('discount');
            const totalElement = document.getElementById('total');

            if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
            if (shippingElement) shippingElement.textContent = shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`;
            if (discountElement) discountElement.textContent = discount > 0 ? `-$${discount.toFixed(2)}` : '$0.00';
            if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;

            // Estimated delivery
            const etaEl = document.getElementById('estimatedDelivery');
            if (etaEl) {
                const eta = estimateDeliveryRange(subtotal);
                etaEl.textContent = eta;
            }
        }

        // ===== FUNCIONES DE PROMOCIONES =====
        function applyPromoCode() {
            const promoCodeInput = document.getElementById('promoCode');
            if (!promoCodeInput) return;

            const code = promoCodeInput.value.trim().toUpperCase();

            if (!code) {
                showNotification('Por favor ingresa un código promocional', 'error');
                return;
            }

            if (VALID_PROMO_CODES[code]) {
                promoCodeApplied = true;
                discountAmount = VALID_PROMO_CODES[code];
                updateOrderSummary();

                showNotification(`¡Código ${code} aplicado! Descuento del ${discountAmount * 100}%`);

                promoCodeInput.disabled = true;
                const applyBtn = document.querySelector('.apply-promo-btn');
                if (applyBtn) {
                    applyBtn.disabled = true;
                    applyBtn.textContent = 'Aplicado';
                }
            } else {
                showNotification('Código promocional inválido', 'error');
                promoCodeInput.value = '';
            }
        }

        // ===== FUNCIONES DE NAVEGACIÓN =====
            // ===== ESTIMACIÓN DE ENTREGA =====
            function addBusinessDays(date, days) {
                const result = new Date(date);
                while (days > 0) {
                    result.setDate(result.getDate() + 1);
                    const dow = result.getDay();
                    if (dow !== 0 && dow !== 6) days--;
                }
                return result;
            }

            function formatDateES(d) {
                const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
                return `${d.getDate()} ${months[d.getMonth()]}`;
            }

            function estimateDeliveryRange(subtotal = 0) {
                // Simple business rule for ETA ranges (in business days)
                let minDays = 3, maxDays = 7;
                if (subtotal >= 80) { minDays = 1; maxDays = 3; }
                else if (subtotal >= 50) { minDays = 2; maxDays = 5; }

                const today = new Date();
                const start = addBusinessDays(today, minDays);
                const end = addBusinessDays(today, maxDays);

                if (minDays === maxDays) return formatDateES(start);
                return `${formatDateES(start)} - ${formatDateES(end)}`;
            }
        function updateCheckoutProgress(step) {
            const fill = document.getElementById('progressFill');
            if (!fill) return;

            const normalizedStep = Math.max(1, Math.min(4, Number(step) || 1));
            const percent = ((normalizedStep - 1) / 3) * 100;
            fill.style.width = `${percent}%`;
        }

        function goToStep(step) {
            if (step > 1 && cart.length === 0) {
                showNotification('Tu carrito está vacío', 'error');
                return;
            }

            for (let i = 1; i <= 4; i++) {
                const circle = document.getElementById(`step${i}Circle`);
                const label = document.getElementById(`step${i}Label`);
                const container = document.getElementById(`step${i}`);

                if (i < step) {
                    if (circle) circle.className = 'step-circle completed';
                    if (label) label.className = 'step-label completed';
                } else if (i === step) {
                    if (circle) circle.className = 'step-circle active';
                    if (label) label.className = 'step-label active';
                } else {
                    if (circle) circle.className = 'step-circle';
                    if (label) label.className = 'step-label';
                }

                if (container) {
                    container.className = i === step ? 'step-container active' : 'step-container';
                }
            }

            currentStep = step;
            updateCheckoutProgress(step);

            if (step === 4) {
                loadConfirmationDetails();
            }
        }

        function validateAndGoToPayment() {
            if (validateInfo()) {
                goToStep(3);
            }
        }

        function validateInfo() {
            const fields = ['fullName', 'email', 'phone', 'address', 'city', 'zipCode'];
            let isValid = true;

            fields.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    if (!element.value.trim()) {
                        element.classList.add('error');
                        isValid = false;
                    } else {
                        element.classList.remove('error');
                    }
                }
            });

            const email = document.getElementById('email');
            if (email && email.value.trim()) {
                if (!email.value.includes('@') || !email.value.includes('.')) {
                    email.classList.add('error');
                    isValid = false;
                }
            }

            if (!isValid) {
                showNotification('Por favor completa todos los campos correctamente', 'error');
                return false;
            }

            return true;
        }

        async function processPayment() {
            if (cart.length === 0) {
                showNotification('Tu carrito está vacío', 'error');
                return;
            }

            await checkoutWithMercadoPago();
        }

        // Mercado Pago checkout
        async function checkoutWithMercadoPago() {
            // Recarga desde localStorage por si el usuario abrió el checkout desde otra pestaña/origen
            loadCartFromStorage();

            if (cart.length === 0) {
                showNotification('Tu carrito está vacío', 'error');
                return;
            }

            const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
            const inferredEmail =
                currentUser?.email ||
                cart.find(item => item.userEmail)?.userEmail ||
                '';
            const inferredName =
                currentUser?.fullName ||
                currentUser?.name ||
                'Cliente StyleHub';

            const subtotal = cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
            const shipping = subtotal >= SHIPPING_FREE_THRESHOLD ? 0 : SHIPPING_COST;
            const discount = promoCodeApplied ? subtotal * discountAmount : 0;
            const total = subtotal + shipping - discount;

            const shippingInfo = {
                fullName: inferredName,
                email: inferredEmail,
                phone: '',
                address: '',
                city: '',
                zipCode: ''
            };

            const payer = {
                email: shippingInfo.email,
                name: shippingInfo.fullName
            };

            const items = cart.map(item => ({
                title: item.name,
                quantity: item.quantity || 1,
                unit_price: Number(item.price) || 0
            }));

            const draftOrder = {
                createdAt: new Date().toISOString(),
                shippingInfo,
                items: cart.map(item => ({ ...item })),
                summary: { subtotal, shipping, discount, total }
            };

            localStorage.setItem(MP_DRAFT_KEY, JSON.stringify(draftOrder));

            try {
                showNotification('Redirigiendo a Mercado Pago...', 'info');

                const response = await fetch(`${API_BASE}/api/payments/create_preference`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        items,
                        payer,
                        shippingInfo,
                        summary: { subtotal, shipping, discount, total },
                        back_urls: {
                            success: `${CHECKOUT_RETURN_BASE}/carrito.html?mp_status=success`,
                            failure: `${CHECKOUT_RETURN_BASE}/carrito.html?mp_status=failure`,
                            pending: `${CHECKOUT_RETURN_BASE}/carrito.html?mp_status=pending`
                        }
                    })
                });

                if (!response.ok) {
                    const err = await response.json().catch(() => ({}));
                    console.error('MP create preference failed', err);
                    showNotification('Error al iniciar el pago', 'error');
                    return;
                }

                const data = await response.json();
                if (data.init_point) {
                    if (data.externalReference) {
                        draftOrder.externalReference = data.externalReference;
                        localStorage.setItem(MP_DRAFT_KEY, JSON.stringify(draftOrder));
                    }
                    window.location.href = data.init_point;
                } else {
                    console.error('No init_point', data);
                    showNotification('No se pudo iniciar el pago', 'error');
                }
            } catch (err) {
                console.error('Checkout error', err);
                showNotification('Error al conectar con el servidor de pago', 'error');
            }
        }

        async function handleMercadoPagoReturn() {
            const params = new URLSearchParams(window.location.search);
            const mpStatus = (params.get('mp_status') || '').toLowerCase();
            const collectionStatus = (params.get('collection_status') || params.get('status') || '').toLowerCase();
            const paymentId = params.get('payment_id') || params.get('collection_id') || '';

            const isApproved = mpStatus === 'success' || collectionStatus === 'approved';
            const isFailure = mpStatus === 'failure' || collectionStatus === 'rejected';
            const isPending = mpStatus === 'pending' || collectionStatus === 'pending';

            if (!isApproved && !isFailure && !isPending) return;

            if (isFailure) {
                showNotification('El pago no fue aprobado. Inténtalo nuevamente.', 'error');
                goToStep(1);
                return;
            }

            if (isPending) {
                showNotification('Tu pago está pendiente de confirmación.', 'info');
                goToStep(1);
                return;
            }

            if (paymentId && localStorage.getItem(MP_LAST_PAYMENT_KEY) === paymentId) {
                return;
            }

            const rawDraft = localStorage.getItem(MP_DRAFT_KEY);
            if (!rawDraft) {
                showNotification('No se encontró el pedido pendiente para confirmar.', 'error');
                return;
            }

            let draft;
            try {
                draft = JSON.parse(rawDraft);
            } catch (err) {
                console.error('Error leyendo borrador de pago:', err);
                showNotification('No se pudo recuperar el detalle del pedido.', 'error');
                return;
            }

            if (paymentId) {
                try {
                    const response = await fetch(`/api/payments/status/${paymentId}`);
                    if (response.ok) {
                        const statusData = await response.json();
                        const realStatus = String(statusData.paymentStatus || '').toLowerCase();

                        if (realStatus && realStatus !== 'approved') {
                            if (realStatus === 'pending' || realStatus === 'in_process') {
                                showNotification('El pago sigue pendiente de confirmación.', 'info');
                                goToStep(1);
                                return;
                            }

                            showNotification('El pago no fue aprobado por Mercado Pago.', 'error');
                            goToStep(1);
                            return;
                        }

                        if (statusData.externalReference) {
                            draft.externalReference = statusData.externalReference;
                        }
                    }
                } catch (err) {
                    console.error('No se pudo consultar el estado del pago:', err);
                }
            }

            checkoutOrderData = {
                ...draft,
                paymentMethodLabel: 'Mercado Pago',
                paymentId
            };

            await persistOrderInBackend(checkoutOrderData);

            if (paymentId) {
                localStorage.setItem(MP_LAST_PAYMENT_KEY, paymentId);
            }

            localStorage.removeItem(MP_DRAFT_KEY);
            localStorage.removeItem('shoppingCart');
            cart = [];
            updateCartCount();
            updateCartDisplay();

            const orderNumber = draft.externalReference
                ? `#${draft.externalReference}`
                : paymentId
                    ? `#MP-${paymentId}`
                    : generateLocalOrderNumber();
            const orderNumberEl = document.getElementById('orderNumber');
            if (orderNumberEl) orderNumberEl.textContent = orderNumber;

            goToStep(4);
            loadConfirmationDetails();
            showNotification('¡Pago aprobado en Mercado Pago!', 'success');

            const cleanUrl = `${window.location.origin}${window.location.pathname}`;
            window.history.replaceState({}, document.title, cleanUrl);
        }

        async function persistOrderInBackend(order) {
            if (!order || !order.shippingInfo || !Array.isArray(order.items) || order.items.length === 0) {
                return;
            }

            try {
                await fetch('/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: order.shippingInfo.fullName,
                        email: order.shippingInfo.email
                    })
                });

                const itemsPayload = order.items.map(item => ({
                    productId: item.id || item.productId || '',
                    name: item.name,
                    qty: item.quantity || 1,
                    price: Number(item.price) || 0,
                    userEmail: order.shippingInfo.email
                }));

                await Promise.all(itemsPayload.map(it => fetch('/api/cart', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(it)
                })));
            } catch (err) {
                console.error('No se pudo registrar el pedido en backend:', err);
            }
        }

        function generateLocalOrderNumber() {
            const year = new Date().getFullYear();
            const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
            return `#SH-${year}-${random}`;
        }

        function loadConfirmationDetails() {
            const container = document.getElementById('confirmationDetails');
            if (!container) return;

            const source = checkoutOrderData || {
                shippingInfo: {
                    fullName: document.getElementById('fullName')?.value || '',
                    email: document.getElementById('email')?.value || '',
                    phone: document.getElementById('phone')?.value || '',
                    address: document.getElementById('address')?.value || '',
                    city: document.getElementById('city')?.value || '',
                    zipCode: document.getElementById('zipCode')?.value || ''
                },
                summary: (() => {
                    const subtotal = cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
                    const shipping = subtotal >= SHIPPING_FREE_THRESHOLD ? 0 : SHIPPING_COST;
                    const discount = promoCodeApplied ? subtotal * discountAmount : 0;
                    const total = subtotal + shipping - discount;
                    return { subtotal, shipping, discount, total };
                })(),
                paymentMethodLabel: 'Mercado Pago'
            };

            const fullName = source.shippingInfo.fullName || '';
            const email = source.shippingInfo.email || '';
            const address = source.shippingInfo.address || '';
            const city = source.shippingInfo.city || '';
            const zipCode = source.shippingInfo.zipCode || '';
            const phone = source.shippingInfo.phone || '';
            const subtotal = Number(source.summary.subtotal || 0);
            const shipping = Number(source.summary.shipping || 0);
            const discount = Number(source.summary.discount || 0);
            const total = Number(source.summary.total || 0);
            const estimated = estimateDeliveryRange(subtotal);

            container.innerHTML = `
                <div class="detail-row">
                    <span class="detail-label">Nombre:</span>
                    <span class="detail-value">${fullName || 'No especificado'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">${email || 'No especificado'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Dirección:</span>
                    <span class="detail-value">${address || ''}, ${city || ''} ${zipCode || ''}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Teléfono:</span>
                    <span class="detail-value">${phone || 'No especificado'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Subtotal:</span>
                    <span class="detail-value">$${Number(subtotal).toFixed(2)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Envío:</span>
                    <span class="detail-value">${shipping === 0 ? 'Gratis' : '$' + Number(shipping).toFixed(2)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Descuento:</span>
                    <span class="detail-value">-$${Number(discount).toFixed(2)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Total:</span>
                    <span class="detail-value" style="font-weight: 800; color: #ff3366;">$${Number(total).toFixed(2)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Método de pago:</span>
                    <span class="detail-value">${source.paymentMethodLabel || 'Mercado Pago'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Fecha estimada de entrega:</span>
                    <span class="detail-value">${estimated}</span>
                </div>
            `;
        }

        // ===== FUNCIONES AUXILIARES =====
        function showNotification(message, type = 'success') {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerHTML = `
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            `;
            document.body.appendChild(notification);
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 3000);
        }

        function setupEventListeners() {
            const cardNumber = document.getElementById('cardNumber');
            if (cardNumber) {
                cardNumber.addEventListener('input', function(e) {
                    let value = e.target.value.replace(/\D/g, '');
                    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
                    e.target.value = value;
                });
            }

            const expiryDate = document.getElementById('expiryDate');
            if (expiryDate) {
                expiryDate.addEventListener('input', function(e) {
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length >= 2) {
                        value = value.substring(0,2) + '/' + value.substring(2,4);
                    }
                    e.target.value = value;
                });
            }

            const cvv = document.getElementById('cvv');
            if (cvv) {
                cvv.addEventListener('input', function(e) {
                    e.target.value = e.target.value.replace(/\D/g, '');
                });
            }
        }

        function updateUserInterface() {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            const accountLink = document.getElementById('accountLink');
            const accountText = document.getElementById('accountText');

            if (currentUser && accountText) {
                const firstName = currentUser.fullName ? currentUser.fullName.split(' ')[0] : 'Usuario';
                accountText.textContent = firstName;
            }
        }

        function setupMobileMenu() {
            const menuToggle = document.querySelector('.mobile-menu-toggle');
            const navLinks = document.querySelector('.nav-links');

            if (menuToggle && navLinks) {
                menuToggle.addEventListener('click', () => {
                    navLinks.classList.toggle('active');
                    const icon = menuToggle.querySelector('i');
                    if (icon) {
                        if (navLinks.classList.contains('active')) {
                            icon.classList.remove('fa-bars');
                            icon.classList.add('fa-times');
                        } else {
                            icon.classList.remove('fa-times');
                            icon.classList.add('fa-bars');
                        }
                    }
                });
            }

            const dropdowns = document.querySelectorAll('.dropdown > .nav-link');
            dropdowns.forEach(dropdown => {
                dropdown.addEventListener('click', function(e) {
                    if (window.innerWidth <= 992) {
                        e.preventDefault();
                        const parent = this.parentElement;
                        parent.classList.toggle('active');
                    }
                });
            });
        }

        // Escuchar cambios en localStorage
        window.addEventListener('storage', function(e) {
            if (e.key === 'shoppingCart') {
                cart = JSON.parse(e.newValue) || [];
                updateCartCount();
                updateCartDisplay();
            }
            if (e.key === 'favorites') {
                favorites = JSON.parse(e.newValue) || [];
                updateWishlistCount();
            }
        });

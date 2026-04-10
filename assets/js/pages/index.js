// ===== CONFIGURACIÓN =====
        const API_URL = 'https://pagina-6ygv.onrender.com/api'; // Backend en Render

        // ===== VARIABLES GLOBALES =====
        let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        let token = localStorage.getItem('token') || null;

        // Productos destacados (estos se cargarán desde la BD más adelante)
        const featuredProducts = [
            // Mujer
            { id: 101, name: "Vestido Floral Midi", price: 59.99, originalPrice: 119.99, discount: 50, image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", rating: 4.8, reviews: 428, badge: "Nuevo", category: "Mujer", subcategory: "Vestidos" },
            { id: 102, name: "Blusa de Seda Negra", price: 39.99, originalPrice: 79.99, discount: 50, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsCD2puMlTNi6bvbkZmZxXiP2vohDJJWGxYA&s", rating: 4.5, reviews: 234, badge: "Premium", category: "Mujer", subcategory: "Tops" },
            { id: 103, name: "Pantalones Palazzo", price: 44.99, originalPrice: 89.99, discount: 50, image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", rating: 4.6, reviews: 156, badge: "Nuevo", category: "Mujer", subcategory: "Pantalones" },
            { id: 201, name: "Camiseta Básica", price: 19.99, originalPrice: 39.99, discount: 50, image: "https://m.media-amazon.com/images/I/61lUj+LrFXL._AC_SY679_.jpg", rating: 4.5, reviews: 1230, badge: "Esencial", category: "Hombre", subcategory: "Camisetas" },
            { id: 202, name: "Camisa Oxford", price: 34.99, originalPrice: 69.99, discount: 50, image: "https://m.media-amazon.com/images/I/41+V3RqkQrS._AC_.jpg", rating: 4.3, reviews: 567, badge: "Clásica", category: "Hombre", subcategory: "Camisas" },
            { id: 203, name: "Pantalón Chino", price: 42.99, originalPrice: 85.99, discount: 50, image: "https://static2.goldengoose.com/public/Style/ECOMM/GKP01396.P001072-55159-9.jpg?im=Resize=(1200)", rating: 4.4, reviews: 432, badge: "Más vendido", category: "Hombre", subcategory: "Pantalones" },
            { id: 301, name: "Tops para niñas", price: 25.99, originalPrice: 51.99, discount: 50, image: "https://assets.theplace.com/image/upload/l_ecom:assets:static:badge:pack8,g_west,w_0.22,fl_relative/t_pdp_img_m,f_auto,q_auto/v1/ecom/assets/products/tcp/3029905/3029905_376.jpg", rating: 4.2, reviews: 89, badge: "Nuevo", category: "Niños", subcategory: "Tops" },
            { id: 302, name: "Pantalones niño", price: 27.99, originalPrice: 55.99, discount: 50, image: "https://m.media-amazon.com/images/I/31Dg4DvU1HL._AC_.jpg", rating: 4.3, reviews: 134, badge: "Cómodo", category: "Niños", subcategory: "Pantalones" },
            { id: 303, name: "Camisetas niños", price: 22.99, originalPrice: 45.99, discount: 50, image: "https://m.media-amazon.com/images/I/312D+ESANWL.jpg", rating: 4.5, reviews: 203, badge: "Más vendido", category: "Niños", subcategory: "Camisetas" }
        ];

        // Base de datos de productos para búsqueda
        const productDatabase = [
            { name: 'Vestido Floral', category: 'Mujer', subcategory: 'Vestidos', icon: 'fa-tshirt', url: 'vestidos.html' },
            { name: 'Blusa de Seda', category: 'Mujer', subcategory: 'Tops y Blusas', icon: 'fa-tshirt', url: 'tops.html' },
            { name: 'Pantalón Palazzo', category: 'Mujer', subcategory: 'Pantalones', icon: 'fa-tshirt', url: 'pantalones-mujer.html' },
            { name: 'Falda Plisada', category: 'Mujer', subcategory: 'Faldas', icon: 'fa-tshirt', url: 'faldas.html' },
            { name: 'Chaqueta de Cuero', category: 'Mujer', subcategory: 'Chaquetas', icon: 'fa-tshirt', url: 'chaquetas-mujer.html' },
            { name: 'Bolso de Mano', category: 'Mujer', subcategory: 'Bolsos', icon: 'fa-shopping-bag', url: 'bolsos.html' },
            { name: 'Collar de Plata', category: 'Mujer', subcategory: 'Joyería', icon: 'fa-gem', url: 'joyeria.html' },
            { name: 'Tacones', category: 'Mujer', subcategory: 'Zapatos', icon: 'fa-shoe-prints', url: 'zapatos-mujer.html' },
            { name: 'Camiseta Básica', category: 'Hombre', subcategory: 'Camisetas', icon: 'fa-tshirt', url: 'camisetas.html' },
            { name: 'Camisa Oxford', category: 'Hombre', subcategory: 'Camisas', icon: 'fa-tshirt', url: 'camisas.html' },
            { name: 'Pantalón Chino', category: 'Hombre', subcategory: 'Pantalones', icon: 'fa-tshirt', url: 'pantalones-hombre.html' },
            { name: 'Chaqueta Bomber', category: 'Hombre', subcategory: 'Chaquetas', icon: 'fa-tshirt', url: 'chaquetas.html' },
            { name: 'Traje Azul Marino', category: 'Hombre', subcategory: 'Trajes', icon: 'fa-tshirt', url: 'trajes.html' },
            { name: 'Zapatos Derby', category: 'Hombre', subcategory: 'Zapatos', icon: 'fa-shoe-prints', url: 'zapatos-hombre.html' },
            { name: 'Reloj Cronógrafo', category: 'Hombre', subcategory: 'Relojes', icon: 'fa-clock', url: 'relojes.html' },
            { name: 'Cinturón de Cuero', category: 'Hombre', subcategory: 'Cinturones', icon: 'fa-belt', url: 'cinturones.html' },
            { name: 'Tops para niñas', category: 'Niños', subcategory: 'Tops', icon: 'fa-tshirt', url: 'tops-niña.html' },
            { name: 'Pantalones para niñas', category: 'Niños', subcategory: 'Pantalones', icon: 'fa-tshirt', url: 'pantalones-niña.html' },
            { name: 'Camisetas para niños', category: 'Niños', subcategory: 'Camisetas', icon: 'fa-tshirt', url: 'camisetas-niños.html' },
            { name: 'Pantalones para niño', category: 'Niños', subcategory: 'Pantalones', icon: 'fa-tshirt', url: 'pantalones-niño.html' },
            { name: 'Chaquetas para niño', category: 'Niños', subcategory: 'Chaquetas', icon: 'fa-tshirt', url: 'chaquetas-niño.html' },
            { name: 'Novedades', category: 'Página', subcategory: 'Colección 2024', icon: 'fa-star', url: 'novedades.html' },
            { name: 'Ofertas', category: 'Página', subcategory: 'Descuentos', icon: 'fa-tag', url: 'ofertas.html' },
            { name: 'Colecciones', category: 'Página', subcategory: 'Diseños exclusivos', icon: 'fa-palette', url: 'colecciones.html' }
        ];

        // ===== FUNCIONES DE INICIALIZACIÓN =====
        document.addEventListener('DOMContentLoaded', function() {
            optimizeImageLoading();
            loadFeaturedProducts();
            setupFeaturedSort();
            updateCartCount();
            updateWishlistCount();
            setupMobileMenu();
            setupSearch();
            updateUserInterface();
            checkAuthStatus();

            window.addEventListener('stylehub:logout', function() {
                currentUser = null;
                token = null;
                updateUserInterface();
            });
        });

        // ===== FUNCIONES DE AUTENTICACIÓN =====
        function openAuthModal(event) {
            if (event) event.preventDefault();
            if (currentUser) {
                // Si ya está logueado, mostrar opciones de perfil
                showUserMenu();
            } else {
                document.getElementById('authModal').classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }

        function closeAuthModal() {
            document.getElementById('authModal').classList.remove('active');
            document.body.style.overflow = '';
            // Limpiar errores
            document.getElementById('loginError').style.display = 'none';
            document.getElementById('registerError').style.display = 'none';
        }

        function switchAuthTab(tab) {
            const loginTab = document.getElementById('loginTab');
            const registerTab = document.getElementById('registerTab');
            const loginForm = document.getElementById('loginForm');
            const registerForm = document.getElementById('registerForm');

            if (tab === 'login') {
                loginTab.classList.add('active');
                registerTab.classList.remove('active');
                loginForm.classList.add('active');
                registerForm.classList.remove('active');
            } else {
                registerTab.classList.add('active');
                loginTab.classList.remove('active');
                registerForm.classList.add('active');
                loginForm.classList.remove('active');
            }
        }

        async function handleLogin(event) {
            event.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const errorDiv = document.getElementById('loginError');
            const loginBtn = document.getElementById('loginBtn');

            // Mostrar loading
            loginBtn.disabled = true;
            loginBtn.innerHTML = '<span class="loading-spinner"></span> Cargando...';

            try {
                const response = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    // Guardar token y usuario
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('currentUser', JSON.stringify(data.user));
                    token = data.token;
                    currentUser = data.user;

                    closeAuthModal();
                    updateUserInterface();
                    showNotification('¡Bienvenido de vuelta!', 'success');
                } else {
                    errorDiv.textContent = data.message || 'Error al iniciar sesión';
                    errorDiv.style.display = 'flex';
                }
            } catch (error) {
                errorDiv.textContent = 'Error de conexión con el servidor';
                errorDiv.style.display = 'flex';
            } finally {
                loginBtn.disabled = false;
                loginBtn.innerHTML = '<span>Iniciar Sesión</span>';
            }
        }

        async function handleRegister(event) {
            event.preventDefault();
            
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const errorDiv = document.getElementById('registerError');
            const registerBtn = document.getElementById('registerBtn');

            // Validar contraseña
            if (password.length < 6) {
                errorDiv.textContent = 'La contraseña debe tener al menos 6 caracteres';
                errorDiv.style.display = 'flex';
                return;
            }

            // Mostrar loading
            registerBtn.disabled = true;
            registerBtn.innerHTML = '<span class="loading-spinner"></span> Cargando...';

            try {
                const response = await fetch(`${API_URL}/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    // Guardar token y usuario
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('currentUser', JSON.stringify(data.user));
                    token = data.token;
                    currentUser = data.user;

                    closeAuthModal();
                    updateUserInterface();
                    showNotification('¡Registro exitoso! Bienvenido a StyleHub', 'success');
                } else {
                    errorDiv.textContent = data.message || 'Error al registrar';
                    errorDiv.style.display = 'flex';
                }
            } catch (error) {
                errorDiv.textContent = 'Error de conexión con el servidor';
                errorDiv.style.display = 'flex';
            } finally {
                registerBtn.disabled = false;
                registerBtn.innerHTML = '<span>Crear Cuenta</span>';
            }
        }

        function logout() {
            if (typeof window.logout === 'function' && window.logout !== logout) {
                window.logout();
                return;
            }

            localStorage.removeItem('token');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('mpCheckoutDraft');
            localStorage.removeItem('mpLastPaymentId');
            token = null;
            currentUser = null;
            updateUserInterface();
            showNotification('Has cerrado sesión', 'info');
            setTimeout(() => {
                window.location.href = `${window.location.origin}${window.location.pathname}`;
            }, 250);
        }

        function showUserMenu() {
            // Aquí puedes mostrar un menú flotante con opciones de perfil
            if (confirm('¿Cerrar sesión?')) {
                logout();
            }
        }

        function checkAuthStatus() {
            if (token && currentUser) {
                // Verificar si el token sigue siendo válido
                // Opcional: hacer una petición al backend para validar
            }
        }

        function updateUserInterface() {
            const accountText = document.getElementById('accountText');
            const accountLink = document.getElementById('accountLink');

            if (currentUser && accountText) {
                const firstName = currentUser.name ? currentUser.name.split(' ')[0] : 'Usuario';
                accountText.textContent = `Hola, ${firstName}`;
                accountLink.href = 'perfil.html'; // Cambiar a página de perfil
            } else {
                accountText.textContent = 'Mi cuenta';
                accountLink.href = '#';
            }
        }

        // ===== FUNCIONES DE PRODUCTOS =====
        function optimizeImageLoading() {
            const images = document.querySelectorAll('img');
            images.forEach((img, index) => {
                if (!img.getAttribute('loading')) {
                    img.setAttribute('loading', index < 2 ? 'eager' : 'lazy');
                }
                img.setAttribute('decoding', 'async');
            });
        }

        function getSortedFeaturedProducts() {
            const sortValue = (document.getElementById('featuredSort') || {}).value || 'featured';
            const products = [...featuredProducts];

            if (sortValue === 'newest') {
                return products.sort((a, b) => Number(b.id || 0) - Number(a.id || 0));
            }
            if (sortValue === 'price-asc') {
                return products.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
            }
            if (sortValue === 'price-desc') {
                return products.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
            }

            return products;
        }

        function setupFeaturedSort() {
            const sort = document.getElementById('featuredSort');
            if (!sort) return;
            sort.addEventListener('change', () => {
                loadFeaturedProducts();
            });
        }

        function loadFeaturedProducts() {
            const grid = document.getElementById('featuredProductsGrid');
            if (!grid) return;

            grid.innerHTML = '';
            const sortedProducts = getSortedFeaturedProducts();
            sortedProducts.forEach(product => {
                const card = createProductCard(product);
                grid.appendChild(card);
            });
        }

        function createProductCard(product) {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.dataset.id = product.id;

            const stars = generateStarRating(product.rating);
            const inCart = cart.some(item => item.id === product.id);
            const inFavorites = favorites.some(item => item.id === product.id);

            card.innerHTML = `
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
                <button class="favorite-btn ${inFavorites ? 'active' : ''}" onclick="toggleFavorite(${product.id})">
                    <i class="fas fa-heart"></i>
                </button>
                <div class="product-image" onclick="window.location.href='${getProductUrl(product)}'">
                    <img src="${product.image}" alt="${product.name}" loading="lazy" decoding="async">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">
                        <span class="current-price">$${product.price.toFixed(2)}</span>
                        ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                        ${product.discount ? `<span class="discount">-${product.discount}%</span>` : ''}
                    </div>
                    <div class="product-rating">
                        ${stars}
                        <span>(${product.reviews})</span>
                    </div>
                        <div class="product-actions">
                            <button class="${inCart ? 'added-to-cart-btn' : 'add-to-cart-btn'}" onclick="addToCart(${product.id})">
                                <i class="fas fa-shopping-bag"></i> ${inCart ? 'En el carrito' : 'Añadir al carrito'}
                            </button>
                            <button class="buy-now-btn" onclick="buyNow(${product.id})">
                                <i class="fas fa-credit-card"></i> Comprar
                            </button>
                        </div>
                </div>
            `;

            return card;
        }

        function generateStarRating(rating) {
            let stars = '';
            const fullStars = Math.floor(rating);
            const hasHalfStar = rating % 1 !== 0;

            for (let i = 0; i < fullStars; i++) {
                stars += '<i class="fas fa-star"></i>';
            }

            if (hasHalfStar) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            }

            const emptyStars = 5 - Math.ceil(rating);
            for (let i = 0; i < emptyStars; i++) {
                stars += '<i class="far fa-star"></i>';
            }

            return stars;
        }

        function getProductUrl(product) {
            if (product.category === 'Mujer') {
                if (product.subcategory === 'Vestidos') return 'vestidos.html';
                if (product.subcategory === 'Tops') return 'tops.html';
                if (product.subcategory === 'Pantalones') return 'pantalones-mujer.html';
            } else if (product.category === 'Hombre') {
                if (product.subcategory === 'Camisetas') return 'camisetas.html';
                if (product.subcategory === 'Camisas') return 'camisas.html';
                if (product.subcategory === 'Pantalones') return 'pantalones-hombre.html';
            } else if (product.category === 'Niños') {
                if (product.subcategory === 'Tops') return 'tops-niña.html';
                if (product.subcategory === 'Pantalones') return 'pantalones-niño.html';
                if (product.subcategory === 'Camisetas') return 'camisetas-niños.html';
            }
            return 'index.html';
        }

        // ===== FUNCIONES DE FAVORITOS =====
        window.toggleFavorite = function(productId) {
            const product = featuredProducts.find(p => p.id === productId);
            if (!product) return;

            favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            const existingIndex = favorites.findIndex(item => item.id === productId);

            if (existingIndex >= 0) {
                favorites.splice(existingIndex, 1);
                showNotification(`${product.name} eliminado de favoritos`, 'info');
            } else {
                favorites.push(product);
                showNotification(`${product.name} añadido a favoritos`, 'success');
            }

            localStorage.setItem('favorites', JSON.stringify(favorites));
            updateWishlistCount();

            const button = document.querySelector(`.product-card[data-id="${productId}"] .favorite-btn`);
            if (button) {
                button.classList.toggle('active');
            }
        }

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
        window.addToCart = function(productId) {
            const product = featuredProducts.find(p => p.id === productId);
            if (!product) return;

            cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
            const existingItem = cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity = (existingItem.quantity || 1) + 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }

            localStorage.setItem('shoppingCart', JSON.stringify(cart));
            updateCartCount();
            showNotification(`${product.name} se ha añadido al carrito`, 'success');

            const button = document.querySelector(`.product-card[data-id="${productId}"] button:not(.favorite-btn)`);
            if (button && button.classList.contains('add-to-cart-btn')) {
                button.innerHTML = '<i class="fas fa-check"></i> En el carrito';
                button.classList.remove('add-to-cart-btn');
                button.classList.add('added-to-cart-btn');
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
            }
            if (e.key === 'favorites') {
                favorites = JSON.parse(e.newValue) || [];
                updateWishlistCount();
            }
            if (e.key === 'currentUser') {
                currentUser = JSON.parse(e.newValue);
                updateUserInterface();
            }
        });

        // Exponer funciones globalmente
        window.openAuthModal = openAuthModal;
        window.closeAuthModal = closeAuthModal;
        window.switchAuthTab = switchAuthTab;
        window.handleLogin = handleLogin;
        window.handleRegister = handleRegister;
        window.logout = logout;

// ===== VARIABLES GLOBALES =====
        let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

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

        // Datos de productos de camisetas
        const productsData = [
            { id: 301, name: "Camiseta Básica Negra", price: 19.99, originalPrice: 29.99, discount: 33, image: "https://m.media-amazon.com/images/I/61lUj+LrFXL._AC_SY679_.jpg", rating: 4.5, reviews: 1230, badge: "Esencial" },
            { id: 302, name: "Camiseta Estampada Gráfica", price: 29.99, originalPrice: 39.99, discount: 25, image: "https://i.ebayimg.com/images/g/z3sAAOSw9N1i7~Y9/s-l1600.jpg", rating: 4.8, reviews: 856, badge: "Nuevo diseño" },
            { id: 303, name: "Camiseta Manga Larga", price: 34.99, originalPrice: 44.99, discount: 22, image: "https://contents.mediadecathlon.com/p2389711/k$bd6bdfc370e0af4a7c3d12e1a79f0da2/manga-larga-hombre.jpg?format=auto&f=800x0", rating: 4.2, reviews: 432, badge: "Térmica" },
            { id: 304, name: "Camiseta Deportiva", price: 24.99, originalPrice: 34.99, discount: 29, image: "https://www.dhresource.com/0x0/f2/albu/g9/M00/3A/48/rBVaVV0bN1SAHxKBAADkO1K-6EY402.jpg", rating: 4.3, reviews: 567, badge: "Transpirable" },
            { id: 305, name: "Camiseta Polo", price: 39.99, originalPrice: 49.99, discount: 20, image: "https://http2.mlstatic.com/D_NQ_NP_672362-MLM49317543954_032022-O.webp", rating: 4.6, reviews: 345, badge: "Elegante" },
            { id: 306, name: "Camiseta de Algodón", price: 22.99, originalPrice: 32.99, discount: 30, image: "https://media.istockphoto.com/id/1281127383/es/foto/primer-plano-de-una-playera-blanca-aislada-en-blanco.jpg?s=612x612&w=0&k=20&c=u02sPl7EaZ8zmG6l0A2w0MawII33Om3J91sO6N28BdI=", rating: 4.4, reviews: 789, badge: "Suave" },
            { id: 307, name: "Camiseta Estampada Floral", price: 32.99, originalPrice: 42.99, discount: 23, image: "https://m.media-amazon.com/images/I/71RRb7lzqXL._AC_SY741_.jpg", rating: 4.1, reviews: 234, badge: "Verano" },
            { id: 308, name: "Camiseta Cuello V", price: 21.99, originalPrice: 31.99, discount: 31, image: "https://media.istockphoto.com/id/1273408248/es/foto/camiseta-negra-aislada-sobre-fondo-blanco.jpg?s=612x612&w=0&k=20&c=-gymCHyYYmgKvQlMN6O3Tj9PMd_J9enj_3oHlQOwr6E=", rating: 4.7, reviews: 654, badge: "Clásica" },
            { id: 309, name: "Camiseta Oversize", price: 27.99, originalPrice: 37.99, discount: 26, image: "https://http2.mlstatic.com/D_NQ_NP_683771-MLM51548735593_092022-O.webp", rating: 4.9, reviews: 432, badge: "Tendencia" }
        ];

        // Estado de la aplicación
        let currentPriceFilter = 'all';
        let currentSort = 'featured';

        // ===== FUNCIONES DE INICIALIZACIÓN =====
        document.addEventListener('DOMContentLoaded', function() {
            updateCartCount();
            updateWishlistCount();
            loadProducts();
            setupFilters();
            setupSorting();
            setupAddToCart();
            setupMobileMenu();
            setupSearch();
            updateUserInterface();
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
        window.toggleFavorite = function(productId) {
            const product = productsData.find(p => p.id === productId);
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

        // ===== FUNCIONES DE PRODUCTOS =====
        function loadProducts() {
            const productsGrid = document.getElementById('productsGrid');
            if (!productsGrid) return;

            let filteredProducts = [...productsData];

            // Aplicar filtro de precio
            if (currentPriceFilter !== 'all') {
                filteredProducts = filteredProducts.filter(p => {
                    const price = p.price;
                    switch(currentPriceFilter) {
                        case '0-30': return price <= 30;
                        case '30-50': return price > 30 && price <= 50;
                        case '50-70': return price > 50 && price <= 70;
                        case '70+': return price > 70;
                        default: return true;
                    }
                });
            }

            // Aplicar ordenamiento
            filteredProducts = sortProducts(filteredProducts, currentSort);

            const productsCount = document.querySelector('.products-count');
            if (productsCount) {
                productsCount.textContent = `Mostrando ${filteredProducts.length} de ${productsData.length} productos`;
            }

            productsGrid.innerHTML = '';

            filteredProducts.forEach(product => {
                const productCard = createProductCard(product);
                productsGrid.appendChild(productCard);
            });
        }

        function createProductCard(product) {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.dataset.id = product.id;

            const stars = generateStarRating(product.rating);
            const inCart = cart.some(item => item.id === product.id);
            const inFavorites = favorites.some(item => item.id === product.id);
            const buttonText = inCart ? 'En el carrito' : 'Añadir al carrito';
            const buttonClass = inCart ? 'added-to-cart-btn' : 'add-to-cart-btn';

            productCard.innerHTML = `
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
                <button class="favorite-btn ${inFavorites ? 'active' : ''}" onclick="toggleFavorite(${product.id})">
                    <i class="fas fa-heart"></i>
                </button>
                <div class="product-image" onclick="window.location.href='${getProductUrl(product)}'">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x400?text=Sin+Imagen'">
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
                    <button class="${buttonClass}" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-bag"></i> ${buttonText}
                    </button>
                </div>
            `;

            return productCard;
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
            return 'camisetas.html'; // Página actual
        }

        function sortProducts(products, sortType) {
            const sorted = [...products];

            switch(sortType) {
                case 'price-asc':
                    return sorted.sort((a, b) => a.price - b.price);
                case 'price-desc':
                    return sorted.sort((a, b) => b.price - a.price);
                case 'newest':
                    return sorted.sort((a, b) => b.id - a.id);
                case 'rating':
                    return sorted.sort((a, b) => b.rating - a.rating);
                default:
                    return sorted;
            }
        }

        // ===== FUNCIONES DE INTERACCIÓN =====
        window.addToCart = function(productId) {
            const product = productsData.find(p => p.id === productId);
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

        function setupFilters() {
            const priceFilters = document.querySelectorAll('[data-price]');
            priceFilters.forEach(btn => {
                btn.addEventListener('click', function() {
                    priceFilters.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    currentPriceFilter = this.dataset.price;
                    loadProducts();
                });
            });
        }

        function setupSorting() {
            const sortSelect = document.getElementById('sortSelect');
            if (sortSelect) {
                sortSelect.addEventListener('change', function() {
                    currentSort = this.value;
                    loadProducts();
                });
            }
        }

        function setupAddToCart() {
            // No es necesario, se usa onclick directamente
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

        function updateUserInterface() {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            const accountText = document.getElementById('accountText');

            if (currentUser && accountText) {
                const firstName = currentUser.fullName ? currentUser.fullName.split(' ')[0] : 'Usuario';
                accountText.textContent = firstName;
            }
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
        });

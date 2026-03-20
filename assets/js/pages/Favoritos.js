// ===== VARIABLES GLOBALES =====
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

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
            { name: 'Vestidos para niñas', category: 'Niños', subcategory: 'Vestidos', icon: 'fa-tshirt', url: 'vestidos-niñas.html' },
            
            // Páginas generales
            { name: 'Novedades', category: 'Página', subcategory: 'Colección 2024', icon: 'fa-star', url: 'novedades.html' },
            { name: 'Ofertas', category: 'Página', subcategory: 'Descuentos', icon: 'fa-tag', url: 'ofertas.html' },
            { name: 'Colecciones', category: 'Página', subcategory: 'Diseños exclusivos', icon: 'fa-palette', url: 'colecciones.html' }
        ];

        // Productos de ejemplo para recomendaciones
        const allProducts = [
            // Mujer
            { id: 101, name: "Vestido Floral Midi", price: 59.99, originalPrice: 119.99, discount: 50, image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", rating: 4.8, reviews: 428, badge: "Nuevo", category: "Mujer", subcategory: "Vestidos" },
            { id: 102, name: "Blusa de Seda Negra", price: 39.99, originalPrice: 79.99, discount: 50, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsCD2puMlTNi6bvbkZmZxXiP2vohDJJWGxYA&s", rating: 4.5, reviews: 234, badge: "Premium", category: "Mujer", subcategory: "Tops" },
            { id: 103, name: "Pantalones Palazzo Beige", price: 44.99, originalPrice: 89.99, discount: 50, image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", rating: 4.6, reviews: 156, badge: "Nuevo", category: "Mujer", subcategory: "Pantalones" },
            
            // Hombre
            { id: 201, name: "Camiseta Básica Blanca", price: 19.99, originalPrice: 39.99, discount: 50, image: "https://m.media-amazon.com/images/I/61lUj+LrFXL._AC_SY679_.jpg", rating: 4.5, reviews: 1230, badge: "Esencial", category: "Hombre", subcategory: "Camisetas" },
            { id: 202, name: "Camisa Oxford Azul", price: 34.99, originalPrice: 69.99, discount: 50, image: "https://m.media-amazon.com/images/I/41+V3RqkQrS._AC_.jpg", rating: 4.3, reviews: 567, badge: "Clásica", category: "Hombre", subcategory: "Camisas" },
            { id: 203, name: "Pantalón Chino Beige", price: 42.99, originalPrice: 85.99, discount: 50, image: "https://static2.goldengoose.com/public/Style/ECOMM/GKP01396.P001072-55159-9.jpg?im=Resize=(1200)", rating: 4.4, reviews: 432, badge: "Más vendido", category: "Hombre", subcategory: "Pantalones" },
            
            // Niños
            { id: 301, name: "Tops para niñas", price: 25.99, originalPrice: 51.99, discount: 50, image: "https://assets.theplace.com/image/upload/l_ecom:assets:static:badge:pack8,g_west,w_0.22,fl_relative/t_pdp_img_m,f_auto,q_auto/v1/ecom/assets/products/tcp/3029905/3029905_376.jpg", rating: 4.2, reviews: 89, badge: "Nuevo", category: "Niños", subcategory: "Tops" },
            { id: 302, name: "Pantalones para niños", price: 27.99, originalPrice: 55.99, discount: 50, image: "https://m.media-amazon.com/images/I/31Dg4DvU1HL._AC_.jpg", rating: 4.3, reviews: 134, badge: "Cómodo", category: "Niños", subcategory: "Pantalones" },
            { id: 303, name: "Camisetas para niños", price: 22.99, originalPrice: 45.99, discount: 50, image: "https://m.media-amazon.com/images/I/312D+ESANWL.jpg", rating: 4.5, reviews: 203, badge: "Más vendido", category: "Niños", subcategory: "Camisetas" }
        ];

        // ===== FUNCIONES DE INICIALIZACIÓN =====
        document.addEventListener('DOMContentLoaded', function() {
            loadFavorites();
            updateWishlistCount();
            updateCartCount();
            loadRecommendations();
            setupMobileMenu();
            setupSearch();
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
        function loadFavorites() {
            const favoritesGrid = document.getElementById('favoritesGrid');
            const favoritesCount = document.getElementById('favoritesCount');
            
            if (!favoritesGrid) return;
            
            if (favorites.length === 0) {
                favoritesGrid.innerHTML = `
                    <div class="empty-favorites" style="grid-column: 1 / -1;">
                        <div class="empty-favorites-icon">
                            <i class="fas fa-heart-broken"></i>
                        </div>
                        <h2>No tienes favoritos aún</h2>
                        <p>Explora nuestros productos y guarda tus favoritos para volver a ellos después</p>
                        <a href="index.html" class="explore-btn">Explorar Productos</a>
                    </div>
                `;
                if (favoritesCount) favoritesCount.textContent = '0';
            } else {
                let html = '';
                
                favorites.forEach((item, index) => {
                    const inCart = cart.some(cartItem => cartItem.id === item.id);
                    
                    html += `
                        <div class="favorite-card" data-id="${item.id}">
                            ${item.badge ? `<div class="favorite-badge">${item.badge}</div>` : ''}
                            <button class="favorite-remove" onclick="removeFromFavorites(${index})">
                                <i class="fas fa-times"></i>
                            </button>
                            <div class="favorite-image" onclick="window.location.href='producto.html?id=${item.id}'">
                                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/300x400?text=Sin+Imagen'">
                            </div>
                            <div class="favorite-info">
                                <h3 class="favorite-title">${item.name}</h3>
                                <div class="favorite-price">
                                    <span class="current-price">$${item.price.toFixed(2)}</span>
                                    ${item.originalPrice ? `<span class="original-price">$${item.originalPrice.toFixed(2)}</span>` : ''}
                                    ${item.discount ? `<span class="discount">-${item.discount}%</span>` : ''}
                                </div>
                                <div class="favorite-rating">
                                    ${generateStarRating(item.rating || 4.5)}
                                    <span>(${item.reviews || 100})</span>
                                </div>
                                <div class="favorite-actions">
                                    <button class="${inCart ? 'added-to-cart-btn' : 'add-to-cart-btn'}" onclick="addToCartFromFavorites(${item.id})">
                                        <i class="fas fa-shopping-bag"></i> ${inCart ? 'En el carrito' : 'Añadir al carrito'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                });
                
                favoritesGrid.innerHTML = html;
                if (favoritesCount) favoritesCount.textContent = favorites.length;
            }
        }

        function removeFromFavorites(index) {
            const productName = favorites[index].name;
            favorites.splice(index, 1);
            saveFavorites();
            loadFavorites();
            updateWishlistCount();
            showNotification(`${productName} eliminado de favoritos`, 'success');
        }

        function clearAllFavorites() {
            if (favorites.length === 0) return;
            
            if (confirm('¿Estás seguro de que quieres vaciar todos tus favoritos?')) {
                favorites = [];
                saveFavorites();
                loadFavorites();
                updateWishlistCount();
                showNotification('Favoritos vaciados correctamente', 'success');
            }
        }

        function saveFavorites() {
            localStorage.setItem('favorites', JSON.stringify(favorites));
        }

        function updateWishlistCount() {
            const wishlistCount = document.getElementById('wishlistCount');
            if (wishlistCount) {
                wishlistCount.textContent = favorites.length;
            }
        }

        // ===== FUNCIONES DEL CARRITO =====
        function updateCartCount() {
            const cartCountElement = document.getElementById('cartCount');
            if (cartCountElement) {
                const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
                cartCountElement.textContent = totalItems;
            }
        }

        function addToCartFromFavorites(productId) {
            const product = favorites.find(p => p.id === productId);
            if (!product) return;
            
            cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
            const existingItem = cart.find(item => item.id === product.id);
            
            if (existingItem) {
                existingItem.quantity = (existingItem.quantity || 1) + 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            
            localStorage.setItem('shoppingCart', JSON.stringify(cart));
            updateCartCount();
            
            // Actualizar el botón
            const button = document.querySelector(`.favorite-card[data-id="${productId}"] .add-to-cart-btn`);
            if (button) {
                button.innerHTML = '<i class="fas fa-check"></i> En el carrito';
                button.classList.remove('add-to-cart-btn');
                button.classList.add('added-to-cart-btn');
            }
            
            showNotification(`${product.name} se ha añadido al carrito`, 'success');
        }

        // ===== FUNCIONES DE RECOMENDACIONES =====
        function loadRecommendations() {
            const recommendationsGrid = document.getElementById('recommendationsGrid');
            if (!recommendationsGrid) return;
            
            // Obtener productos aleatorios que no están en favoritos
            const favoriteIds = favorites.map(f => f.id);
            const availableProducts = allProducts.filter(p => !favoriteIds.includes(p.id));
            const shuffled = availableProducts.sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, 4);
            
            let html = '';
            selected.forEach(product => {
                html += `
                    <div class="recommendation-card" onclick="window.location.href='${getProductUrl(product)}'">
                        <i class="fas ${getProductIcon(product.category)} recommendation-icon"></i>
                        <div class="recommendation-title">${product.name}</div>
                        <div class="recommendation-category">${product.category} - ${product.subcategory}</div>
                        <div class="recommendation-price">$${product.price.toFixed(2)}</div>
                    </div>
                `;
            });
            
            recommendationsGrid.innerHTML = html;
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
                if (product.subcategory === 'Chaquetas') return 'chaquetas.html';
                if (product.subcategory === 'Trajes') return 'trajes.html';
            } else if (product.category === 'Niños') {
                if (product.subcategory === 'Tops') return 'tops-niña.html';
                if (product.subcategory === 'Pantalones') return 'pantalones-niño.html';
                if (product.subcategory === 'Camisetas') return 'camisetas-niños.html';
                if (product.subcategory === 'Chaquetas') return 'chaquetas-niño.html';
            }
            return 'index.html';
        }

        function getProductIcon(category) {
            switch(category) {
                case 'Mujer': return 'fa-female';
                case 'Hombre': return 'fa-male';
                case 'Niños': return 'fa-child';
                default: return 'fa-tshirt';
            }
        }

        // ===== FUNCIONES AUXILIARES =====
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
                loadFavorites(); // Recargar para actualizar botones
            }
            if (e.key === 'favorites') {
                favorites = JSON.parse(e.newValue) || [];
                updateWishlistCount();
                loadFavorites();
                loadRecommendations();
            }
        });

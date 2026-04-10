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
            { name: 'Vestidos para niñas', category: 'Niños', subcategory: 'Vestidos', icon: 'fa-tshirt', url: 'vestidos-niñas.html' },
            
            // Páginas generales
            { name: 'Novedades', category: 'Página', subcategory: 'Colección 2024', icon: 'fa-star', url: 'novedades.html' },
            { name: 'Ofertas', category: 'Página', subcategory: 'Descuentos', icon: 'fa-tag', url: 'ofertas.html' },
            { name: 'Colecciones', category: 'Página', subcategory: 'Diseños exclusivos', icon: 'fa-palette', url: 'colecciones.html' }
        ];

        // Datos de productos de tops
        const productsData = [
            { id: 201, name: "Top Negro de Encaje Premium", price: 24.99, originalPrice: 49.99, discount: 50, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsCD2puMlTNi6bvbkZmZxXiP2vohDJJWGxYA&s", rating: 4.7, reviews: 156, badge: "Nuevo", type: "encaje", color: "negro" },
            { id: 202, name: "Blusa Blanca Elegante", price: 29.99, originalPrice: 59.99, discount: 50, image: "https://http2.mlstatic.com/D_NQ_NP_668830-MLM85056189208_052025-O-blusas-dama-blanca-manga-larga-casual-formal-elegantes.webp", rating: 4.5, reviews: 89, badge: "Elegante", type: "blusa", color: "blanco" },
            { id: 203, name: "Top Corto Deportivo", price: 19.99, originalPrice: 39.99, discount: 50, image: "https://detqhtv6m6lzl.cloudfront.net/HCLContenido/producto/FullImage/7506497323422-1.jpg", rating: 4.8, reviews: 234, badge: "Deportivo", type: "deportivo", color: "gris" },
            { id: 204, name: "Camiseta Básica Algodón", price: 14.99, originalPrice: 29.99, discount: 50, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", rating: 4.3, reviews: 187, badge: "Básico", type: "camiseta", color: "blanco" },
            { id: 205, name: "Top Manga Larga Rosa", price: 27.99, originalPrice: 55.99, discount: 50, image: "https://media.gotrendier.mx/media/p/2022/08/09/n_34facbc6-1814-11ed-9bb4-12fdd4c00437.jpeg", rating: 4.6, reviews: 112, badge: "Nuevo", type: "manga-larga", color: "rosa" },
            { id: 206, name: "Top Estampado Floral", price: 22.99, originalPrice: 45.99, discount: 50, image: "https://highstreet.com.mx/cdn/shop/files/HIGH-STREET-Top-strapless-floral-escote-corazon-con-nudo-tbtu-240074_01_6953a8e9-96c6-49b8-ab93-88e47e62826d.jpg?v=1740598677", rating: 4.4, reviews: 95, badge: "Floral", type: "estampado", color: "estampado" },
            { id: 207, name: "Top Azul Marino", price: 21.99, originalPrice: 43.99, discount: 50, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgkZ0-qdmpS4YzrlhWBvBR83T1McOzBzgcRA&s", rating: 4.2, reviews: 143, badge: null, type: "basico", color: "azul" },
            { id: 208, name: "Blusa de Seda Roja", price: 39.99, originalPrice: 79.99, discount: 50, image: "https://m.media-amazon.com/images/I/61yihVGDEPL._AC_UY1000_.jpg", rating: 4.9, reviews: 78, badge: "Premium", type: "blusa", color: "rojo" },
            { id: 209, name: "Top de Encaje Blanco", price: 26.99, originalPrice: 53.99, discount: 50, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgzgYTQ5-vB8OpYJj-VMMkYU7Ytk3kRp3lqw&s", rating: 4.5, reviews: 134, badge: "Nuevo", type: "encaje", color: "blanco" },
            { id: 210, name: "Top Corto Cropped", price: 18.99, originalPrice: 37.99, discount: 50, image: "https://static.e-stradivarius.net/assets/public/4220/835c/d78b48ad9d25/78491902d36a/02526648001-s1/02526648001-s1.jpg?ts=1750242118670&w=1082&f=auto", rating: 4.3, reviews: 167, badge: "Tendencia", type: "corto", color: "negro" },
            { id: 211, name: "Camiseta Oversize Gris", price: 23.99, originalPrice: 47.99, discount: 50, image: "https://puntofino.co/cdn/shop/files/PHOTO-2024-04-16-09-25-56.jpg?v=1713294893", rating: 4.4, reviews: 201, badge: "Oversize", type: "camiseta", color: "gris" },
            { id: 212, name: "Top Deportivo Rosa", price: 24.99, originalPrice: 49.99, discount: 50, image: "https://www.run24.mx/cdn/shop/files/526646-89-3_800x.jpg?v=1743627305", rating: 4.7, reviews: 189, badge: "Deportivo", type: "deportivo", color: "rosa" },
            { id: 213, name: "Blusa de Lino Beige", price: 34.99, originalPrice: 69.99, discount: 50, image: "https://image.hm.com/assets/hm/e4/09/e409c6c4a4fdf445f1738722e8a091488aaa6d0b.jpg?imwidth=2160", rating: 4.6, reviews: 145, badge: "Verano", type: "blusa", color: "beige" },
            { id: 214, name: "Top de Encaje Rojo", price: 28.99, originalPrice: 57.99, discount: 50, image: "https://cdn-images.farfetch-contents.com/19/17/28/84/19172884_50442283_600.jpg", rating: 4.5, reviews: 98, badge: "Exclusivo", type: "encaje", color: "rojo" },
            { id: 215, name: "Top Manga Larga Negro", price: 29.99, originalPrice: 59.99, discount: 50, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXWiZhyo_GYz9tC3AJNGHn8T-8-cQoiHdjdA&s", rating: 4.3, reviews: 112, badge: null, type: "manga-larga", color: "negro" },
            { id: 216, name: "Top Estampado Geométrico", price: 25.99, originalPrice: 51.99, discount: 50, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnRQXwvqnJwlC-x_I3q1Yl6WEIPqvmzBC8Pw&s", rating: 4.2, reviews: 87, badge: "Nuevo", type: "estampado", color: "estampado" }
        ];

        // Estado de la aplicación
        let currentFilter = 'all';
        let currentPriceFilter = 'all';
        let currentSort = 'featured';

        document.addEventListener('DOMContentLoaded', function() {
            updateCartCount();
            updateWishlistCount();
            loadProducts();
            setupFilters();
            setupSorting();
            setupMobileMenu();
            setupSearch();
        });

        function updateCartCount() {
            const cartCount = document.getElementById('cartCount');
            if (cartCount) {
                const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
                cartCount.textContent = totalItems;
                
                // Animación
                cartCount.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    cartCount.style.transform = 'scale(1)';
                }, 300);
            }
        }

        function updateWishlistCount() {
            const wishlistCount = document.getElementById('wishlistCount');
            if (wishlistCount) {
                wishlistCount.textContent = favorites.length;
                
                // Animación
                wishlistCount.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    wishlistCount.style.transform = 'scale(1)';
                }, 300);
            }
        }

        function loadProducts() {
            const productsGrid = document.getElementById('productsGrid');
            if (!productsGrid) return;
            
            let filteredProducts = [...productsData];
            
            // Aplicar filtro de tipo
            if (currentFilter !== 'all') {
                filteredProducts = filteredProducts.filter(p => p.type === currentFilter);
            }
            
            // Aplicar filtro de precio
            if (currentPriceFilter !== 'all') {
                filteredProducts = filteredProducts.filter(p => {
                    const price = p.price;
                    switch(currentPriceFilter) {
                        case '0-15': return price <= 15;
                        case '15-30': return price > 15 && price <= 30;
                        case '30-50': return price > 30 && price <= 50;
                        case '50+': return price > 50;
                        default: return true;
                    }
                });
            }
            
            // Aplicar ordenamiento
            filteredProducts = sortProducts(filteredProducts, currentSort);
            
            // Actualizar contador de productos
            const productsCount = document.getElementById('productsCount');
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
            
            // Generar estrellas de valoración
            const stars = generateStarRating(product.rating);
            
            // Verificar si el producto ya está en el carrito o favoritos
            const inCart = cart.some(item => item.id === product.id);
            const inFavorites = favorites.some(item => item.id === product.id);
            const buttonText = inCart ? '✓ En el carrito' : 'Añadir al carrito';
            const buttonClass = inCart ? 'added-to-cart-btn' : 'add-to-cart-btn';
            
            productCard.innerHTML = `
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
                <button class="favorite-btn ${inFavorites ? 'active' : ''}" onclick="toggleFavorite(${product.id})">
                    <i class="fas fa-heart"></i>
                </button>
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">
                        <span class="current-price">${formatCurrency(product.price)}</span>
                        ${product.originalPrice ? `<span class="original-price">${formatCurrency(product.originalPrice)}</span>` : ''}
                        ${product.discount ? `<span class="discount">-${product.discount}%</span>` : ''}
                    </div>
                    <div class="product-rating">
                        ${stars}
                        <span>(${product.reviews})</span>
                    </div>
                        <div class="product-actions">
                            <button class="${buttonClass}" onclick="addToCart(${product.id})">
                                <i class="fas fa-shopping-bag"></i> ${buttonText}
                            </button>
                            <button class="buy-now-btn" onclick="buyNow(${product.id})">
                                <i class="fas fa-credit-card"></i> Comprar
                            </button>
                        </div>
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

        function setupFilters() {
            // Filtros de categoría
            const categoryFilters = document.querySelectorAll('[data-filter]');
            categoryFilters.forEach(btn => {
                btn.addEventListener('click', function() {
                    categoryFilters.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    currentFilter = this.dataset.filter;
                    loadProducts();
                });
            });
            
            // Filtros de precio
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
            
            // Actualizar el botón
            const button = document.querySelector(`.product-card[data-id="${productId}"] .favorite-btn`);
            if (button) {
                button.classList.toggle('active');
            }
        }

        // ===== FUNCIONES DEL CARRITO =====
        function setupAddToCart() {
            document.addEventListener('click', function(e) {
                const button = e.target.closest('.add-to-cart-btn');
                if (!button) return;
                
                e.preventDefault();
                
                const productId = parseInt(button.dataset.id);
                const product = productsData.find(p => p.id === productId);
                
                if (product) {
                    addToCart(product);
                    
                    button.innerHTML = '<i class="fas fa-check"></i> ✓ En el carrito';
                    button.classList.remove('add-to-cart-btn');
                    button.classList.add('added-to-cart-btn');
                }
            });
        }

        function addToCart(product) {
            cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
            const existingItem = cart.find(item => item.id === product.id);
            
            if (existingItem) {
                existingItem.quantity = (existingItem.quantity || 1) + 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            
            localStorage.setItem('shoppingCart', JSON.stringify(cart));
            updateCartCount();
            showNotification(`${product.name} se ha añadido al carrito`, 'success');
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
        });

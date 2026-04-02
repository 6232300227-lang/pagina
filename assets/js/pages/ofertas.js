// ===== VARIABLES GLOBALES =====
        let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        
        // Datos de productos en oferta
        const offersData = [
            // Mujer - Ofertas
            { id: 101, name: "Vestido Floral Estampado", price: 34.99, originalPrice: 69.99, discount: 50, image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", rating: 4.5, reviews: 128, badge: "50% OFF", category: "mujer", subcategory: "vestidos" },
            { id: 102, name: "Blusa de Seda Blanca", price: 24.99, originalPrice: 49.99, discount: 50, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsCD2puMlTNi6bvbkZmZxXiP2vohDJJWGxYA&s", rating: 4.2, reviews: 89, badge: "50% OFF", category: "mujer", subcategory: "tops" },
            { id: 103, name: "Jeans Rectos Tiro Alto", price: 39.99, originalPrice: 79.99, discount: 50, image: "https://julio.com/media/catalog/product/e/5/jeans-rectos-tiro-alto-azul-medio.jpg?quality=80&bg-color=255,255,255&height=638&width=508&canvas=508:638", rating: 4.8, reviews: 256, badge: "50% OFF", category: "mujer", subcategory: "pantalones" },
            { id: 104, name: "Blazer Oversize Beige", price: 49.99, originalPrice: 99.99, discount: 50, image: "https://image.hm.com/assets/hm/de/dd/dedde8dd39827f5a52fcc1c04dea68df3fc52bfc.jpg?imwidth=1260", rating: 4.5, reviews: 156, badge: "50% OFF", category: "mujer", subcategory: "chaquetas" },
            { id: 105, name: "Falda Plisada Midi", price: 29.99, originalPrice: 59.99, discount: 50, image: "https://m.media-amazon.com/images/I/51cvOIAErOL._AC_UY1000_.jpg", rating: 4.3, reviews: 92, badge: "50% OFF", category: "mujer", subcategory: "faldas" },
            { id: 106, name: "Vestido de Noche Rojo", price: 79.99, originalPrice: 159.99, discount: 50, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", rating: 4.9, reviews: 178, badge: "50% OFF", category: "mujer", subcategory: "vestidos" },
            
            // Hombre - Ofertas
            { id: 201, name: "Camiseta Básica Algodón", price: 19.99, originalPrice: 39.99, discount: 50, image: "https://m.media-amazon.com/images/I/61lUj+LrFXL._AC_SY679_.jpg", rating: 4.5, reviews: 1230, badge: "50% OFF", category: "hombre", subcategory: "camisetas" },
            { id: 202, name: "Camisa Informal", price: 34.99, originalPrice: 69.99, discount: 50, image: "https://m.media-amazon.com/images/I/41+V3RqkQrS._AC_.jpg", rating: 4.3, reviews: 567, badge: "50% OFF", category: "hombre", subcategory: "camisas" },
            { id: 203, name: "Pantalón Chino Beige", price: 42.99, originalPrice: 85.99, discount: 50, image: "https://static2.goldengoose.com/public/Style/ECOMM/GKP01396.P001072-55159-9.jpg?im=Resize=(1200)", rating: 4.4, reviews: 432, badge: "50% OFF", category: "hombre", subcategory: "pantalones" },
            { id: 204, name: "Chaqueta Bomber", price: 45.99, originalPrice: 91.99, discount: 50, image: "https://image.hm.com/assets/hm/3b/dc/3bdce0e0d0786333c7392fa3f53b507983b68245.jpg", rating: 4.6, reviews: 344, badge: "50% OFF", category: "hombre", subcategory: "chaquetas" },
            { id: 205, name: "Traje de Vestir", price: 85.99, originalPrice: 171.99, discount: 50, image: "https://arturocalle.vtexassets.com/arquivos/ids/811689/HOMBRE-TRAJE-10151608-NEGRO-090_1.jpg?v=638996122143700000", rating: 4.5, reviews: 244, badge: "50% OFF", category: "hombre", subcategory: "trajes" },
            
            // Niños - Ofertas
            { id: 301, name: "Tops para niñas", price: 25.99, originalPrice: 51.99, discount: 50, image: "https://assets.theplace.com/image/upload/l_ecom:assets:static:badge:pack8,g_west,w_0.22,fl_relative/t_pdp_img_m,f_auto,q_auto/v1/ecom/assets/products/tcp/3029905/3029905_376.jpg", rating: 4.2, reviews: 89, badge: "50% OFF", category: "ninos", subcategory: "tops" },
            { id: 302, name: "Pantalones para niños", price: 27.99, originalPrice: 55.99, discount: 50, image: "https://m.media-amazon.com/images/I/31Dg4DvU1HL._AC_.jpg", rating: 4.3, reviews: 134, badge: "50% OFF", category: "ninos", subcategory: "pantalones" },
            { id: 303, name: "Camisetas para niños", price: 22.99, originalPrice: 45.99, discount: 50, image: "https://m.media-amazon.com/images/I/312D+ESANWL.jpg", rating: 4.5, reviews: 203, badge: "50% OFF", category: "ninos", subcategory: "camisetas" },
            { id: 304, name: "Vestido de Fiesta", price: 45.99, originalPrice: 91.99, discount: 50, image: "https://m.media-amazon.com/images/I/71nnZJaR7eL._AC_SX679_.jpg", rating: 4.4, reviews: 244, badge: "50% OFF", category: "ninos", subcategory: "vestidos" }
        ];

        // Estado de la aplicación
        let currentFilter = 'all';
        let currentDiscountFilter = 'all';
        let currentPriceFilter = 'all';
        let currentSort = 'featured';

        // ===== FUNCIONES DE INICIALIZACIÓN =====
        document.addEventListener('DOMContentLoaded', function() {
            loadProducts();
            updateCartCount();
            updateWishlistCount();
            setupFilters();
            setupSorting();
            setupAddToCart();
            setupMobileMenu();
            startTimer();
        });

        // ===== FUNCIONES DE PRODUCTOS =====
        function loadProducts() {
            const productsGrid = document.getElementById('productsGrid');
            if (!productsGrid) return;
            
            let filteredProducts = [...offersData];
            
            // Aplicar filtro de categoría
            if (currentFilter !== 'all') {
                filteredProducts = filteredProducts.filter(p => p.category === currentFilter);
            }
            
            // Aplicar filtro de descuento
            if (currentDiscountFilter !== 'all') {
                filteredProducts = filteredProducts.filter(p => {
                    const discount = p.discount;
                    switch(currentDiscountFilter) {
                        case '10-30': return discount >= 10 && discount < 30;
                        case '30-50': return discount >= 30 && discount < 50;
                        case '50-70': return discount >= 50 && discount < 70;
                        case '70+': return discount >= 70;
                        default: return true;
                    }
                });
            }
            
            // Aplicar filtro de precio
            if (currentPriceFilter !== 'all') {
                filteredProducts = filteredProducts.filter(p => {
                    const price = p.price;
                    switch(currentPriceFilter) {
                        case '0-25': return price <= 25;
                        case '25-50': return price > 25 && price <= 50;
                        case '50-100': return price > 50 && price <= 100;
                        case '100+': return price > 100;
                        default: return true;
                    }
                });
            }
            
            // Aplicar ordenamiento
            filteredProducts = sortProducts(filteredProducts, currentSort);
            
            // Actualizar contador de productos
            const productsCount = document.querySelector('.products-count');
            if (productsCount) {
                productsCount.textContent = `Mostrando ${filteredProducts.length} de ${offersData.length} productos en oferta`;
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
            
            // Verificar si el producto ya está en el carrito
            const inCart = cart.some(item => item.id === product.id);
            // Verificar si el producto ya está en favoritos
            const inFavorites = favorites.some(item => item.id === product.id);
            
            const buttonText = inCart ? '✓ En el carrito' : 'Añadir al carrito';
            const buttonClass = inCart ? 'added-to-cart-btn' : 'add-to-cart-btn';
            const favoriteClass = inFavorites ? 'add-to-favorites-btn active' : 'add-to-favorites-btn';
            
            productCard.innerHTML = `
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
                <button class="${favoriteClass}" onclick="toggleFavorite(${product.id})">
                    <i class="fas fa-heart"></i>
                </button>
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
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
                            <button class="${buttonClass}" data-id="${product.id}">
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
                case 'discount':
                    return sorted.sort((a, b) => b.discount - a.discount);
                case 'rating':
                    return sorted.sort((a, b) => b.rating - a.rating);
                default:
                    return sorted;
            }
        }

        // ===== FUNCIONES DE FILTROS =====
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
            
            // Filtros de descuento
            const discountFilters = document.querySelectorAll('[data-discount]');
            discountFilters.forEach(btn => {
                btn.addEventListener('click', function() {
                    discountFilters.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    currentDiscountFilter = this.dataset.discount;
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

        // ===== FUNCIONES DEL CARRITO =====
        function updateCartCount() {
            const cartCountElement = document.getElementById('cartCount');
            if (cartCountElement) {
                const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
                cartCountElement.textContent = totalItems;
            }
        }

        function setupAddToCart() {
            document.addEventListener('click', function(e) {
                const button = e.target.closest('.add-to-cart-btn');
                if (!button) return;
                
                e.preventDefault();
                
                const productId = parseInt(button.dataset.id);
                const product = offersData.find(p => p.id === productId);
                
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

        // ===== FUNCIONES DE FAVORITOS =====
        function toggleFavorite(productId) {
            const product = offersData.find(p => p.id === productId);
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
            const button = document.querySelector(`.product-card[data-id="${productId}"] .add-to-favorites-btn`);
            if (button) {
                button.classList.toggle('active');
            }
        }

        function updateWishlistCount() {
            const wishlistCount = document.getElementById('wishlistCount');
            if (wishlistCount) {
                wishlistCount.textContent = favorites.length;
            }
        }

        // ===== TIMER =====
        function startTimer() {
            // Establecer fecha objetivo (7 días desde ahora)
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() + 7);
            
            function updateTimer() {
                const now = new Date().getTime();
                const distance = targetDate - now;
                
                if (distance < 0) {
                    document.getElementById('days').textContent = '00';
                    document.getElementById('hours').textContent = '00';
                    document.getElementById('minutes').textContent = '00';
                    document.getElementById('seconds').textContent = '00';
                    return;
                }
                
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                
                document.getElementById('days').textContent = days.toString().padStart(2, '0');
                document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
                document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
                document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
            }
            
            updateTimer();
            setInterval(updateTimer, 1000);
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

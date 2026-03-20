// Función para mostrar notificaciones
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

        // Función para actualizar el contador del carrito
        function updateCartCount() {
            const cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
            const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
            const cartCountElement = document.getElementById('cartCount');
            if (cartCountElement) {
                cartCountElement.textContent = totalItems;
                
                // Animación
                cartCountElement.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    cartCountElement.style.transform = 'scale(1)';
                }, 300);
            }
        }

        // Datos de productos de pantalones para niño
        const productsData = [
            {
                id: 501,
                name: "Jogger para niño",
                price: 25.99,
                originalPrice: 47.99,
                discount: 46,
                image: "https://m.media-amazon.com/images/I/31Dg4DvU1HL._AC_.jpg",
                rating: 3.5,
                reviews: 244,
                badge: "Más vendido"
            },
            {
                id: 502,
                name: "Vaqueros (Jeans) niño",
                price: 24.99,
                originalPrice: 37.99,
                discount: 34,
                image: "https://marionetamoda.com/cdn/shop/products/CapturadePantalla2021-07-23ala_s_20.21.16.png?v=1627090253",
                rating: 3.5,
                reviews: 244,
                badge: "Más vendido"
            },
            {
                id: 503,
                name: "Pantalones de chándal clásicos",
                price: 25.99,
                originalPrice: 30.99,
                discount: 16,
                image: "https://m.media-amazon.com/images/I/41fqInGVE2L._AC_.jpg",
                rating: 3.5,
                reviews: 244,
                badge: "Más vendido"
            },
            {
                id: 504,
                name: "Pantalón Chino",
                price: 22.99,
                originalPrice: 47.99,
                discount: 52,
                image: "https://static2.goldengoose.com/public/Style/ECOMM/GKP01396.P001072-55159-9.jpg?im=Resize=(1200)",
                rating: 3.5,
                reviews: 244,
                badge: "Más vendido"
            },
            {
                id: 505,
                name: "Pantalón de pinzas",
                price: 20.99,
                originalPrice: 33.99,
                discount: 38,
                image: "https://static.lefties.com/assets/public/1f51/455e/b3d54bf2b511/bcad287b889b/05924107800-A5/05924107800-A5.jpg?ts=1759754245836&w=800&f=auto",
                rating: 3.5,
                reviews: 344,
                badge: "Más vendido"
            },
            {
                id: 506,
                name: "Pantalón de Vestir",
                price: 35.99,
                originalPrice: 43.99,
                discount: 18,
                image: "https://m.media-amazon.com/images/I/31mKYaH9MdL._AC_.jpg",
                rating: 3.5,
                reviews: 314,
                badge: "Más vendido"
            }
        ];

        // Estado de la aplicación
        let currentPriceFilter = 'all';
        let currentSort = 'featured';

        document.addEventListener('DOMContentLoaded', function() {
            updateCartCount();
            loadProducts();
            setupFilters();
            setupSorting();
            setupAddToCart();
            setupMobileMenu();
        });

        function loadProducts() {
            const productsGrid = document.getElementById('productsGrid');
            if (!productsGrid) return;
            
            let filteredProducts = [...productsData];
            
            // Aplicar filtro de precio
            if (currentPriceFilter !== 'all') {
                filteredProducts = filteredProducts.filter(p => {
                    const price = p.price;
                    switch(currentPriceFilter) {
                        case '0-20': return price <= 20;
                        case '20-30': return price > 20 && price <= 30;
                        case '30+': return price > 30;
                        default: return true;
                    }
                });
            }
            
            // Aplicar ordenamiento
            filteredProducts = sortProducts(filteredProducts, currentSort);
            
            // Actualizar contador de productos
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
            
            // Generar estrellas de valoración
            const stars = generateStarRating(product.rating);
            
            // Verificar si el producto ya está en el carrito
            const cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
            const inCart = cart.some(item => item.id === product.id);
            const buttonText = inCart ? '✓ En el carrito' : 'Añadir al carrito';
            const buttonClass = inCart ? 'added-to-cart-btn' : 'add-to-cart-btn';
            
            productCard.innerHTML = `
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
                <div class="product-image">
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
                    <button class="${buttonClass}" data-id="${product.id}">
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
            let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
            const existingItem = cart.find(item => item.id === product.id);
            
            if (existingItem) {
                existingItem.quantity = (existingItem.quantity || 1) + 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            
            localStorage.setItem('shoppingCart', JSON.stringify(cart));
            updateCartCount();
            showNotification(`${product.name} se ha añadido al carrito`);
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
            
            // Dropdowns en móvil
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

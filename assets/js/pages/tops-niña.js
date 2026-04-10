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

        // Datos de productos de tops para niña
        const productsData = [
            {
                id: 701,
                name: "Camisetas básicas",
                price: 45.99,
                originalPrice: 67.99,
                discount: 32,
                image: "https://assets.theplace.com/image/upload/l_ecom:assets:static:badge:pack8,g_west,w_0.22,fl_relative/t_pdp_img_m,f_auto,q_auto/v1/ecom/assets/products/tcp/3029905/3029905_376.jpg",
                rating: 3.5,
                reviews: 244,
                badge: "Más vendido"
            },
            {
                id: 702,
                name: "Camisetas gráficas",
                price: 52.99,
                originalPrice: 67.99,
                discount: 22,
                image: "https://assets.theplace.com/image/upload/t_pdp_img_m,f_auto,q_auto/v1/ecom/assets/products/tcp/3037101/3037101_802.png",
                rating: 4.0,
                reviews: 333,
                badge: "Más vendido"
            },
            {
                id: 703,
                name: "Blusas",
                price: 55.99,
                originalPrice: 75.99,
                discount: 26,
                image: "https://ss433.liverpool.com.mx/xl/1172292883.jpg",
                rating: 4.5,
                reviews: 324,
                badge: "Más vendido"
            },
            {
                id: 704,
                name: "Blusas con Botones",
                price: 42.99,
                originalPrice: 57.99,
                discount: 26,
                image: "https://i5.walmartimages.com/asr/885d5f43-ff01-4f8b-88ac-f48d187ce052.abd571047e5b08dfc3f29222732caf86.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
                rating: 3.5,
                reviews: 244,
                badge: "Más vendido"
            },
            {
                id: 705,
                name: "Polos",
                price: 35.99,
                originalPrice: 47.99,
                discount: 25,
                image: "https://sydney.pe/wp-content/uploads/2025/01/L2-CEREZA-4-6-1000x1000.jpg",
                rating: 5.0,
                reviews: 194,
                badge: "Más vendido"
            },
            {
                id: 706,
                name: "Tops Cruzados",
                price: 58.99,
                originalPrice: 74.99,
                discount: 21,
                image: "https://www.reycocr.com/wp-content/uploads/2020/10/3712-P-.jpg",
                rating: 3.5,
                reviews: 342,
                badge: "Más vendido"
            },
            {
                id: 707,
                name: "Boleros",
                price: 45.99,
                originalPrice: 67.99,
                discount: 32,
                image: "https://assets.mayoral.com/images/v1736960957/25-00320-090-XL-4/torera-bolero-basica-tricot-nina-rojo-XL-4.jpg",
                rating: 3.5,
                reviews: 144,
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
                        case '0-35': return price <= 35;
                        case '35-45': return price > 35 && price <= 45;
                        case '45-55': return price > 45 && price <= 55;
                        case '55+': return price > 55;
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

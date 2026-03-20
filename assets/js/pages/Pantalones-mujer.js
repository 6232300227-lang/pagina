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

        // Datos de productos de pantalones de mujer
        const productsData = [
            { id: 201, name: "Jeans Rectos Tiro Alto Azul", price: 39.99, originalPrice: 79.99, discount: 50, image: "https://julio.com/media/catalog/product/e/5/jeans-rectos-tiro-alto-azul-medio.jpg?quality=80&bg-color=255,255,255&height=638&width=508&canvas=508:638", rating: 4.8, reviews: 342, badge: "Más vendido", category: "jeans", color: "azul" },
            { id: 202, name: "Pantalones Palazzo de Lino Beige", price: 44.99, originalPrice: 89.99, discount: 50, image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", rating: 4.5, reviews: 156, badge: "Nuevo", category: "palazzo", color: "beige" },
            { id: 203, name: "Jeans Skinny Negro Elásticos", price: 34.99, originalPrice: 69.99, discount: 50, image: "https://xcdn.next.co.uk/common/items/default/default/itemimages/3_4Ratio/product/lge/N38300s5.jpg?im=Resize,width=750", rating: 4.6, reviews: 289, badge: null, category: "jeans", color: "negro" },
            { id: 204, name: "Pantalones Cargo Oliva", price: 49.99, originalPrice: 99.99, discount: 50, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfLUyFrQUMZ4SwFrgFHV0i_ofRM7DZdgWl-w&s", rating: 4.4, reviews: 98, badge: "Nuevo", category: "cargo", color: "verde" },
            { id: 205, name: "Pantalones Deportivos Jogger Gris", price: 29.99, originalPrice: 59.99, discount: 50, image: "https://salvajetentacion.mx/cdn/shop/files/76728bda-ee10-424f-b28f-ec286cd76ca4.jpg?v=1768019255", rating: 4.3, reviews: 167, badge: "Oferta", category: "deportivos", color: "gris" },
            { id: 206, name: "Jeans Acampanados Vintage", price: 54.99, originalPrice: 109.99, discount: 50, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQYq3HBJM5krs8Hv1T-MiKDmynkVZSi8P6Ug&s", rating: 4.7, reviews: 203, badge: "Exclusivo", category: "jeans", color: "azul" },
            { id: 207, name: "Pantalones Palazzo Estampados", price: 42.99, originalPrice: 85.99, discount: 50, image: "https://m.media-amazon.com/images/I/71yUPbcKF8L._AC_UY1000_.jpg", rating: 4.5, reviews: 134, badge: "Nuevo", category: "palazzo", color: "multicolor" },
            { id: 208, name: "Pantalones Cargo Negros", price: 47.99, originalPrice: 95.99, discount: 50, image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", rating: 4.4, reviews: 76, badge: null, category: "cargo", color: "negro" },
            { id: 209, name: "Jeans Blancos Rectos", price: 37.99, originalPrice: 75.99, discount: 50, image: "https://mivestidorazul.es/20682-large_default/pantalon-recto-pcblume-blanco.jpg", rating: 4.2, reviews: 112, badge: "Nuevo", category: "jeans", color: "blanco" },
            { id: 210, name: "Pantalones Deportivos Negros", price: 27.99, originalPrice: 55.99, discount: 50, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQo5vUl7bFpmyxbZcBwwfqr9Rkz9QIW4LqtTg&s", rating: 4.3, reviews: 201, badge: "Oferta", category: "deportivos", color: "negro" }
        ];

        // Estado de la aplicación
        let currentFilter = 'all';
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
            
            // Aplicar filtro de categoría
            if (currentFilter !== 'all') {
                filteredProducts = filteredProducts.filter(p => p.category === currentFilter);
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

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

        // Datos de productos de vestidos
        const productsData = [
            { id: 101, name: "Vestido Floral Midi Premium", price: 59.99, originalPrice: 119.99, discount: 50, image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", rating: 4.8, reviews: 428, badge: "Nuevo", style: "verano", color: "estampado" },
            { id: 102, name: "Vestido Negro Elegante de Seda", price: 89.99, originalPrice: 179.99, discount: 50, image: "https://i.etsystatic.com/22414300/r/il/1f4d06/5715371972/il_fullxfull.5715371972_9b08.jpg", rating: 4.9, reviews: 289, badge: "Exclusivo", style: "noche", color: "negro" },
            { id: 103, name: "Vestido Blanco con Abertura Lateral", price: 79.99, originalPrice: 159.99, discount: 50, image: "https://i5.walmartimages.com/asr/7eed763d-460e-4d34-9ebf-0d2de3e1ee0a.adac72e977933ea9fd8337ef304a825f.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF", rating: 4.7, reviews: 167, badge: "Nuevo", style: "fiesta", color: "blanco" },
            { id: 104, name: "Vestido Rojo de Seda Italiana", price: 129.99, originalPrice: 259.99, discount: 50, image: "https://1ns.mx/cdn/shop/files/VESTIDO-XIOMARA-rojo-saten-corset-largo.jpg?v=1711134345&width=1080", rating: 4.9, reviews: 503, badge: "Exclusivo", style: "noche", color: "rojo" },
            { id: 105, name: "Vestido Plisado Verde Esmeralda", price: 99.99, originalPrice: 199.99, discount: 50, image: "https://img.ltwebstatic.com/images3_pi/2024/03/04/f8/1709534351db098389144d5c77405ea4dc0b6271eb_thumbnail_405x.webp", rating: 4.6, reviews: 342, badge: null, style: "casual", color: "verde" },
            { id: 106, name: "Vestido Corto de Fiesta con Lentejuelas", price: 69.99, originalPrice: 139.99, discount: 50, image: "https://kpy.com.uy/cdn/shop/files/kapullo1982.jpg?v=1751997653", rating: 4.8, reviews: 298, badge: "Oferta Especial", style: "fiesta", color: "negro" },
            { id: 107, name: "Vestido Largo Estampado Premium", price: 119.99, originalPrice: 239.99, discount: 50, image: "https://i.pinimg.com/originals/78/67/75/786775ea389398805c7b216a542e273a.jpg", rating: 4.7, reviews: 276, badge: "Edición Limitada", style: "largo", color: "estampado" },
            { id: 108, name: "Vestido Casual de Algodón Orgánico", price: 49.99, originalPrice: 99.99, discount: 50, image: "https://i.etsystatic.com/12201809/r/il/ffd3c0/4653615080/il_570xN.4653615080_2kfo.jpg", rating: 4.5, reviews: 411, badge: "Sostenible", style: "casual", color: "blanco" },
            { id: 109, name: "Vestido Azul Noche con Transparencias", price: 109.99, originalPrice: 219.99, discount: 50, image: "https://i.pinimg.com/736x/c1/eb/60/c1eb60155703df2993c224ae3b316333.jpg", rating: 4.8, reviews: 189, badge: "Nuevo", style: "noche", color: "azul" },
            { id: 110, name: "Vestido de Verano Estampado", price: 54.99, originalPrice: 109.99, discount: 50, image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", rating: 4.6, reviews: 234, badge: "Verano 2024", style: "verano", color: "estampado" },
            { id: 111, name: "Vestido de Noche Dorado", price: 149.99, originalPrice: 299.99, discount: 50, image: "https://ae-pic-a1.aliexpress-media.com/kf/S723c5376aedf41f48ee7f389c3693d77D.jpg", rating: 5.0, reviews: 156, badge: "Premium", style: "noche", color: "dorado" },
            { id: 112, name: "Vestido Corto Casual Rosa", price: 44.99, originalPrice: 89.99, discount: 50, image: "https://resources.claroshop.com/medios-plazavip/s2/10996/3905016/62d990fb4d859-0dfa42d2-384a-4b03-a747-84b1792fb97b-1600x1600.jpg", rating: 4.4, reviews: 178, badge: "Nuevo", style: "casual", color: "rosa" }
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
            
            // Aplicar filtro de estilo
            if (currentFilter !== 'all') {
                filteredProducts = filteredProducts.filter(p => p.style === currentFilter);
            }
            
            // Aplicar filtro de precio
            if (currentPriceFilter !== 'all') {
                filteredProducts = filteredProducts.filter(p => {
                    const price = p.price;
                    switch(currentPriceFilter) {
                        case '0-50': return price <= 50;
                        case '50-100': return price > 50 && price <= 100;
                        case '100-150': return price > 100 && price <= 150;
                        case '150+': return price > 150;
                        default: return true;
                    }
                });
            }
            
            // Aplicar ordenamiento
            filteredProducts = sortProducts(filteredProducts, currentSort);
            
            // Actualizar contador de productos
            const productsCount = document.getElementById('productsCount');
            if (productsCount) {
                productsCount.textContent = `Mostrando ${filteredProducts.length} de ${productsData.length} productos premium`;
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
            const buttonText = inCart ? '<i class="fas fa-check"></i> En el carrito' : '<i class="fas fa-shopping-bag"></i> Añadir al carrito';
            const buttonClass = inCart ? 'added-to-cart-btn' : 'add-to-cart-btn';
            
            productCard.innerHTML = `
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
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
                        <span>(${product.reviews} reseñas)</span>
                    </div>
                        <div class="product-actions">
                            <button class="${buttonClass}" data-id="${product.id}">${buttonText}</button>
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
            const hasHalfStar = rating % 1 >= 0.3 && rating % 1 <= 0.7;
            
            for (let i = 0; i < fullStars; i++) {
                stars += '<i class="fas fa-star"></i>';
            }
            
            if (hasHalfStar) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            }
            
            const emptyStars = 5 - (hasHalfStar ? fullStars + 1 : fullStars);
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
            // Filtros de estilo
            const styleFilters = document.querySelectorAll('[data-filter]');
            styleFilters.forEach(btn => {
                btn.addEventListener('click', function() {
                    styleFilters.forEach(b => b.classList.remove('active'));
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
            
            // Filtros de talla (solo UI)
            const sizeFilters = document.querySelectorAll('[data-size]');
            sizeFilters.forEach(btn => {
                btn.addEventListener('click', function() {
                    this.classList.toggle('active');
                });
            });
            
            // Filtros de color (solo UI)
            const colorFilters = document.querySelectorAll('[data-color]');
            colorFilters.forEach(btn => {
                btn.addEventListener('click', function() {
                    this.classList.toggle('active');
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
                    
                    button.innerHTML = '<i class="fas fa-check"></i> En el carrito';
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
            showNotification(`${product.name} se ha añadido a tu carrito premium`);
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

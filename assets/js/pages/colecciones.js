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

        // ===== FUNCIONES DE INICIALIZACIÓN =====
        document.addEventListener('DOMContentLoaded', function() {
            updateCartCount();
            updateWishlistCount();
            setupMobileMenu();
            startLimitedTimer();
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

        // ===== FUNCIONES DEL CARRITO Y FAVORITOS =====
        function updateCartCount() {
            const cartCountElement = document.getElementById('cartCount');
            if (cartCountElement) {
                const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
                cartCountElement.textContent = totalItems;
            }
        }

        function updateWishlistCount() {
            const wishlistCount = document.getElementById('wishlistCount');
            if (wishlistCount) {
                wishlistCount.textContent = favorites.length;
            }
        }

        // ===== TIMER =====
        function startLimitedTimer() {
            // Establecer fecha objetivo (5 días desde ahora)
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() + 5);
            
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

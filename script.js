const productsData = [
    {
        id: 1,
        name: "Vestido Floral con Abertura",
        price: 18.99,
        originalPrice: 34.99,
        discount: 45,
        image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1462&q=80",
        rating: 4,
        reviews: 128,
        badge: "Nuevo"
    },
    {
        id: 2,
        name: "Jeans Rotos de Tiro Alto",
        price: 22.50,
        originalPrice: 45.00,
        discount: 50,
        image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1435&q=80",
        rating: 4.5,
        reviews: 342,
        badge: "Más vendido"
    },
    {
        id: 3,
        name: "Top de Encaje Negro",
        price: 12.99,
        originalPrice: null,
        discount: 0,
        image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
        rating: 4,
        reviews: 89,
        badge: null
    },
    {
        id: 4,
        name: "Blazer Oversize Beige",
        price: 28.75,
        originalPrice: 57.50,
        discount: 50,
        image: "https://images.unsplash.com/photo-1539533113205-9d5b6f60d3b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        rating: 5,
        reviews: 256,
        badge: "Últimas unidades"
    },
    {
        id: 5,
        name: "Falda Plisada Midaxi",
        price: 16.99,
        originalPrice: 33.99,
        discount: 50,
        image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
        rating: 4,
        reviews: 156,
        badge: "Nuevo"
    },
    {
        id: 6,
        name: "Zapatos de Tacón Nude",
        price: 24.99,
        originalPrice: 49.99,
        discount: 50,
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        rating: 4.5,
        reviews: 203,
        badge: null
    },
    {
        id: 7,
        name: "Chaqueta de Cuero Sintético",
        price: 32.99,
        originalPrice: 65.99,
        discount: 50,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        rating: 4.5,
        reviews: 189,
        badge: "Oferta"
    },
    {
        id: 8,
        name: "Bolso de Mano Grande",
        price: 19.99,
        originalPrice: 39.99,
        discount: 50,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        rating: 4,
        reviews: 112,
        badge: null
    }
];

// Estado de la aplicación
let cart = [];
let displayedProducts = 4;

// Funcionalidad cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Cargar carrito desde localStorage
    loadCartFromStorage();
    
    // Cargar productos iniciales
    loadProducts();
    
    // Configurar botón de "Ver más productos"
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreProducts);
    }
    
    // Configurar funcionalidad del carrito
    setupCartFunctionality();
    
    // Configurar funcionalidad de búsqueda
    setupSearchFunctionality();
    
    // Configurar efectos interactivos
    setupInteractiveEffects();
    
    // Configurar navegación móvil
    setupMobileNavigation();
});

// Función para cargar productos
function loadProducts() {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;
    
    productGrid.innerHTML = '';
    
    for (let i = 0; i < Math.min(displayedProducts, productsData.length); i++) {
        const product = productsData[i];
        productGrid.appendChild(createProductCard(product));
    }
    
    // Actualizar estado del botón "Ver más"
    updateLoadMoreButton();
}

// Función para crear una tarjeta de producto
function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.dataset.id = product.id;
    
    // Generar estrellas de valoración
    const stars = generateStarRating(product.rating);
    
    // Verificar si el producto ya está en el carrito
    const inCart = cart.some(item => item.id === product.id);
    const buttonText = inCart ? '✓ En el carrito' : 'Añadir al carrito';
    const buttonClass = inCart ? 'btn added-to-cart-btn' : 'btn add-to-cart-btn';
    
    // Construir el HTML de la tarjeta
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
                <span>(${product.reviews})</span>
            </div>
            <button class="${buttonClass}" data-id="${product.id}">${buttonText}</button>
        </div>
    `;
    
    return productCard;
}

// Función para generar estrellas de valoración
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

// Función para cargar más productos
function loadMoreProducts() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (!loadMoreBtn) return;
    
    loadMoreBtn.textContent = 'Cargando...';
    loadMoreBtn.disabled = true;
    
    // Simular carga de datos
    setTimeout(() => {
        displayedProducts += 4;
        loadProducts();
        
        loadMoreBtn.textContent = 'Ver más productos';
        loadMoreBtn.disabled = false;
    }, 1000);
}

// Función para actualizar el botón "Ver más"
function updateLoadMoreButton() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (!loadMoreBtn) return;
    
    if (displayedProducts >= productsData.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'inline-block';
    }
}

// Función para configurar la funcionalidad del carrito
function setupCartFunctionality() {
    // Actualizar contador del carrito al añadir productos
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart-btn') || 
            e.target.closest('.add-to-cart-btn')) {
            
            const button = e.target.classList.contains('add-to-cart-btn') ? 
                          e.target : e.target.closest('.add-to-cart-btn');
            
            const productId = parseInt(button.dataset.id);
            const product = productsData.find(p => p.id === productId);
            
            if (product) {
                addToCart(product);
                
                // Actualizar botón
                button.textContent = '✓ En el carrito';
                button.classList.remove('add-to-cart-btn');
                button.classList.add('added-to-cart-btn');
                button.disabled = true;
                
                setTimeout(() => {
                    button.disabled = false;
                }, 500);
            }
        }
    });
}

// Función para añadir producto al carrito
function addToCart(product) {
    // Verificar si el producto ya está en el carrito
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1,
            cartId: Date.now() // ID único para cada item en el carrito
        });
    }
    
    updateCartCount();
    saveCartToStorage();
    
    // Mostrar notificación
    showNotification(`${product.name} se ha añadido al carrito`);
}

// Función para actualizar el contador del carrito
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }
}

// Función para guardar carrito en localStorage
function saveCartToStorage() {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
}

// Función para cargar carrito desde localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('shoppingCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Función para mostrar notificaciones
function showNotification(message) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    // Estilos para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #4CAF50;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
    `;
    
    // Añadir estilos de animación
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // Eliminar la notificación después de 3 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Función para configurar la funcionalidad de búsqueda
function setupSearchFunctionality() {
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');
    
    if (!searchInput || !searchButton) return;
    
    // Buscar al hacer clic en el botón
    searchButton.addEventListener('click', function() {
        performSearch(searchInput.value);
    });
    
    // Buscar al presionar Enter
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
        }
    });
}

// Función para realizar búsqueda
function performSearch(query) {
    if (query.trim() === '') return;
    
    // En una aplicación real, aquí se haría una petición al servidor
    // Por ahora, solo mostramos una alerta
    showNotification(`Buscando: "${query}"`);
    
    // Simular resultados de búsqueda
    const searchResults = productsData.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase())
    );
    
    // Si hay resultados, mostrar mensaje
    if (searchResults.length > 0) {
        setTimeout(() => {
            showNotification(`Encontrados ${searchResults.length} productos para "${query}"`);
        }, 500);
    }
}

// Función para configurar efectos interactivos
function setupInteractiveEffects() {
    // Efecto hover en el banner
    const banner = document.querySelector('.banner');
    const bannerBtn = document.querySelector('.banner .btn');
    
    if (bannerBtn && banner) {
        bannerBtn.addEventListener('mouseenter', function() {
            banner.style.backgroundPosition = 'center 30%';
        });
        
        bannerBtn.addEventListener('mouseleave', function() {
            banner.style.backgroundPosition = 'center center';
        });
    }
    
    // Efecto hover en las tarjetas de categoría
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const img = this.querySelector('img');
            img.style.transform = 'scale(1.05)';
        });
        
        card.addEventListener('mouseleave', function() {
            const img = this.querySelector('img');
            img.style.transform = 'scale(1)';
        });
    });
}

// Función para configurar navegación móvil
function setupMobileNavigation() {
    // En pantallas pequeñas, agregar menú hamburguesa
    if (window.innerWidth <= 768) {
        createMobileMenu();
    }
    
    // Actualizar al cambiar tamaño de ventana
    window.addEventListener('resize', function() {
        const mobileMenu = document.querySelector('.mobile-menu-toggle');
        if (window.innerWidth <= 768 && !mobileMenu) {
            createMobileMenu();
        } else if (window.innerWidth > 768 && mobileMenu) {
            mobileMenu.remove();
            const navLinks = document.querySelector('.nav-links');
            if (navLinks) {
                navLinks.style.display = 'flex';
            }
        }
    });
}

// Función para crear menú móvil
function createMobileMenu() {
    const nav = document.querySelector('nav .container');
    const navLinks = document.querySelector('.nav-links');
    
    if (!nav || !navLinks) return;
    
    // Crear botón de menú hamburguesa
    const menuToggle = document.createElement('button');
    menuToggle.className = 'mobile-menu-toggle';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    
    // Estilos para el botón
    menuToggle.style.cssText = `
        display: block;
        background: none;
        border: none;
        font-size: 1.5rem;
        color: var(--primary);
        cursor: pointer;
        padding: 10px;
        margin: 10px auto;
    `;
    
    // Insertar antes de la navegación
    nav.insertBefore(menuToggle, navLinks);
    
    // Ocultar navegación por defecto
    navLinks.style.display = 'none';
    
    // Alternar navegación al hacer clic
    menuToggle.addEventListener('click', function() {
        if (navLinks.style.display === 'none') {
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.alignItems = 'center';
            menuToggle.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            navLinks.style.display = 'none';
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
}

// Obtener el carrito para uso en otros archivos
function getCart() {
    return cart;
}

// Actualizar el carrito (para uso en cart.js)
function updateCart(updatedCart) {
    cart = updatedCart;
    saveCartToStorage();
    updateCartCount();
}

// Global image error fallback: when an <img> fails to load (e.g., remote placeholder down),
// replace it with an inline SVG data-URI showing the `alt` text.
window.addEventListener('error', function (e) {
    const el = e.target;
    if (!el || el.tagName !== 'IMG' || el.dataset.fallbackApplied) return;
    el.dataset.fallbackApplied = '1';

    const w = el.naturalWidth || el.width || el.getAttribute('width') || 300;
    const h = el.naturalHeight || el.height || el.getAttribute('height') || 400;
    const text = el.getAttribute('alt') || 'Sin Imagen';

    function escapeHtml(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '">' +
        '<rect width="100%" height="100%" fill="#dddddd"/>' +
        '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#666" font-family="Arial, sans-serif" font-size="20">' +
        escapeHtml(text) +
        '</text></svg>';

    el.src = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
}, true);

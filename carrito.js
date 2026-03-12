// Estado del carrito
let cart = [];
let promoCodeApplied = false;
let discountAmount = 0;

// Constantes
const SHIPPING_COST = 5.99;
const SHIPPING_FREE_THRESHOLD = 29.99;
const VALID_PROMO_CODES = {
    'VERANO20': 0.20, // 20% de descuento
    'BIENVENIDA': 0.15, // 15% de descuento
    'STYLE10': 0.10 // 10% de descuento
};

// Variables globales para el proceso de checkout
let currentStep = 1;
let selectedPaymentMethod = 'card';
let orderData = {
    subtotal: 0,
    shipping: 0,
    discount: 0,
    total: 0,
    shippingInfo: {},
    paymentMethod: ''
};

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Cargar carrito desde localStorage
    loadCartFromStorage();
    
    // Actualizar visualización del carrito
    updateCartDisplay();
    
    // Configurar eventos
    setupEventListeners();

    // Configurar menú móvil
    setupMobileMenu();

    // Formatear número de tarjeta
    const cardNumber = document.getElementById('cardNumber');
    if (cardNumber) {
        cardNumber.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            e.target.value = value;
        });
    }

    // Formatear fecha de expiración
    const expiryDate = document.getElementById('expiryDate');
    if (expiryDate) {
        expiryDate.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0,2) + '/' + value.substring(2,4);
            }
            e.target.value = value;
        });
    }

    // Formatear CVV
    const cvv = document.getElementById('cvv');
    if (cvv) {
        cvv.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
});

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

// Función para actualizar la UI según el estado del usuario
function updateUserInterface() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const accountLink = document.getElementById('accountLink');
    const accountText = document.getElementById('accountText');
    const topAccountLink = document.getElementById('topAccountLink');
    
    if (currentUser) {
        const firstName = currentUser.fullName ? currentUser.fullName.split(' ')[0] : 'Usuario';
        
        if (accountLink) {
            accountLink.href = '#';
            accountText.textContent = firstName;
            
            const accountIcon = accountLink.querySelector('i');
            if (accountIcon && !document.querySelector('.user-badge')) {
                const badge = document.createElement('span');
                badge.className = 'user-badge';
                badge.innerHTML = '✓';
                accountIcon.style.position = 'relative';
                accountIcon.appendChild(badge);
            }
            
            accountLink.onclick = function(e) {
                e.preventDefault();
                if (confirm(`¿Cerrar sesión ${currentUser.fullName}?`)) {
                    logout();
                }
            };
        }
        
        if (topAccountLink) {
            topAccountLink.innerHTML = `<i class="fas fa-user-circle"></i> ${firstName}`;
            topAccountLink.href = '#';
            topAccountLink.onclick = function(e) {
                e.preventDefault();
                if (confirm(`¿Cerrar sesión ${currentUser.fullName}?`)) {
                    logout();
                }
            };
        }
    } else {
        if (accountLink) {
            accountLink.href = 'usuarios.html';
            accountText.textContent = 'Mi cuenta';
            
            const badge = document.querySelector('.user-badge');
            if (badge) badge.remove();
            
            accountLink.onclick = null;
        }
        
        if (topAccountLink) {
            topAccountLink.innerHTML = '<i class="fas fa-user"></i> Mi cuenta';
            topAccountLink.href = 'usuarios.html';
            topAccountLink.onclick = null;
        }
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    updateUserInterface();
    showNotification('Has cerrado sesión correctamente', 'info');
}

// Cargar carrito desde localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('shoppingCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        // Asegurar que cada item tenga una propiedad cartId única para operaciones
        cart = cart.map((item, index) => ({
            ...item,
            cartId: item.cartId || `cart_${index}_${Date.now()}`
        }));
    }
}

// Guardar carrito en localStorage
function saveCartToStorage() {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
}

// Configurar event listeners
function setupEventListeners() {
    // Botón para vaciar carrito
    const clearCartBtn = document.querySelector('.clear-cart-btn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }
    
    // Botón para aplicar código promocional
    const applyPromoBtn = document.querySelector('.apply-promo-btn');
    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', applyPromoCode);
    }
    
    // Botón para proceder al pago
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            goToStep(2);
        });
    }
}

// Actualizar visualización del carrito
function updateCartDisplay() {
    updateCartItems();
    updateOrderSummary();
    updateCartCount();
}

// Actualizar items del carrito
function updateCartItems() {
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    const cartItemsCount = document.getElementById('cart-items-count');
    const proceedBtn = document.getElementById('proceedToInfo');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">
                    <i class="fas fa-shopping-cart"></i>
                </div>
                <h3>Tu carrito está vacío</h3>
                <p>Agrega productos desde la tienda para comenzar tu compra</p>
                <a href="index.html" class="btn" style="display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%); color: white; text-decoration: none; border-radius: 50px; font-weight: 700;">Explorar Productos</a>
            </div>
        `;
        if (proceedBtn) proceedBtn.disabled = true;
        if (cartItemsCount) cartItemsCount.textContent = '(0 productos)';
    } else {
        let html = '';
        let subtotal = 0;
        
        cart.forEach((item, index) => {
            const itemTotal = item.price * (item.quantity || 1);
            subtotal += itemTotal;
            
            html += `
                <div class="cart-item" data-index="${index}">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/300x400?text=Sin+Imagen'">
                    </div>
                    <div class="cart-item-details">
                        <h3 class="cart-item-title">${item.name}</h3>
                        <div class="cart-item-price">
                            <span>$${item.price.toFixed(2)}</span>
                            ${item.originalPrice ? `<span class="cart-item-original-price">$${item.originalPrice.toFixed(2)}</span>` : ''}
                        </div>
                        <div class="cart-item-actions">
                            <div class="quantity-controls">
                                <button class="quantity-btn decrease-btn" onclick="updateQuantity(${index}, -1)">-</button>
                                <span class="quantity-display">${item.quantity || 1}</span>
                                <button class="quantity-btn increase-btn" onclick="updateQuantity(${index}, 1)">+</button>
                            </div>
                            <button class="remove-btn" onclick="removeFromCart(${index})">
                                <i class="fas fa-trash"></i> Eliminar
                            </button>
                        </div>
                    </div>
                    <div class="cart-item-total">
                        <div class="cart-item-total-price">$${itemTotal.toFixed(2)}</div>
                    </div>
                </div>
            `;
        });
        
        cartItemsContainer.innerHTML = html;
        if (proceedBtn) proceedBtn.disabled = false;
        
        const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
        if (cartItemsCount) cartItemsCount.textContent = `(${totalItems} ${totalItems === 1 ? 'producto' : 'productos'})`;
    }
    
    updateCartCount();
}

// Actualizar cantidad de un item
function updateQuantity(index, change) {
    if (cart[index]) {
        cart[index].quantity = (cart[index].quantity || 1) + change;
        
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        
        saveCartToStorage();
        updateCartDisplay();
        showNotification('Cantidad actualizada', 'success');
    }
}

// Remover item del carrito
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCartToStorage();
    updateCartDisplay();
    showNotification('Producto eliminado del carrito', 'success');
}

// Vaciar todo el carrito
function clearCart() {
    if (cart.length === 0) return;
    
    if (confirm('¿Estás seguro de que quieres vaciar todo el carrito?')) {
        cart = [];
        saveCartToStorage();
        updateCartDisplay();
        showNotification('Carrito vaciado correctamente', 'success');
    }
}

// Actualizar resumen del pedido
function updateOrderSummary() {
    // Calcular subtotal
    const subtotal = cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
    
    // Calcular costo de envío
    const shipping = subtotal >= SHIPPING_FREE_THRESHOLD ? 0 : SHIPPING_COST;
    
    // Calcular descuento
    let discount = 0;
    if (promoCodeApplied && subtotal > 0) {
        discount = subtotal * discountAmount;
    }
    
    // Calcular total
    const total = subtotal + shipping - discount;
    
    // Actualizar elementos HTML
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const discountElement = document.getElementById('discount');
    const totalElement = document.getElementById('total');
    
    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingElement) shippingElement.textContent = shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`;
    if (discountElement) discountElement.textContent = discount > 0 ? `-$${discount.toFixed(2)}` : '$0.00';
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
    
    orderData.subtotal = subtotal;
    orderData.shipping = shipping;
    orderData.discount = discount;
    orderData.total = total;
}

// Actualizar contador del carrito en el header
function updateCartCount() {
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
        cartCountElement.textContent = totalItems;
    }
}

// Aplicar código promocional
function applyPromoCode() {
    const promoCodeInput = document.getElementById('promoCode');
    if (!promoCodeInput) return;
    
    const code = promoCodeInput.value.trim().toUpperCase();
    
    if (!code) {
        showNotification('Por favor ingresa un código promocional', 'error');
        return;
    }
    
    if (VALID_PROMO_CODES[code]) {
        promoCodeApplied = true;
        discountAmount = VALID_PROMO_CODES[code];
        updateOrderSummary();
        
        showNotification(`¡Código ${code} aplicado! Descuento del ${discountAmount * 100}%`);
        
        promoCodeInput.disabled = true;
        document.querySelector('.apply-promo-btn').disabled = true;
        document.querySelector('.apply-promo-btn').textContent = 'Aplicado';
    } else {
        showNotification('Código promocional inválido', 'error');
        promoCodeInput.value = '';
    }
}

// Función para navegar entre pasos
function goToStep(step) {
    if (step === 2) {
        if (cart.length === 0) {
            showNotification('Tu carrito está vacío', 'error');
            return;
        }
    }
    
    for (let i = 1; i <= 4; i++) {
        const circle = document.getElementById(`step${i}Circle`);
        const label = document.getElementById(`step${i}Label`);
        const container = document.getElementById(`step${i}`);
        
        if (i < step) {
            if (circle) circle.className = 'step-circle completed';
            if (label) label.className = 'step-label completed';
        } else if (i === step) {
            if (circle) circle.className = 'step-circle active';
            if (label) label.className = 'step-label active';
        } else {
            if (circle) circle.className = 'step-circle';
            if (label) label.className = 'step-label';
        }
        
        if (container) {
            container.className = i === step ? 'step-container active' : 'step-container';
        }
    }
    
    currentStep = step;
    
    if (step === 4) {
        loadConfirmationDetails();
    }
}

// Función para validar y continuar al pago
function validateAndGoToPayment() {
    if (validateInfo()) {
        goToStep(3);
    }
}

// Función para validar información de envío
function validateInfo() {
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const zipCode = document.getElementById('zipCode').value.trim();
    
    document.querySelectorAll('.form-control').forEach(input => {
        input.classList.remove('error');
    });
    
    let isValid = true;
    
    if (!fullName) {
        document.getElementById('fullName').classList.add('error');
        isValid = false;
    }
    
    if (!email || !email.includes('@') || !email.includes('.')) {
        document.getElementById('email').classList.add('error');
        isValid = false;
    }
    
    if (!phone || phone.length < 9) {
        document.getElementById('phone').classList.add('error');
        isValid = false;
    }
    
    if (!address) {
        document.getElementById('address').classList.add('error');
        isValid = false;
    }
    
    if (!city) {
        document.getElementById('city').classList.add('error');
        isValid = false;
    }
    
    if (!zipCode || zipCode.length < 5) {
        document.getElementById('zipCode').classList.add('error');
        isValid = false;
    }
    
    if (!isValid) {
        showNotification('Por favor completa todos los campos correctamente', 'error');
        return false;
    }
    
    orderData.shippingInfo = {
        fullName, email, phone, address, city, zipCode
    };
    
    return true;
}

// Función para seleccionar método de pago
function selectPaymentMethod(method, element) {
    selectedPaymentMethod = method;
    
    document.querySelectorAll('.payment-method').forEach(el => {
        el.classList.remove('selected');
    });
    
    element.classList.add('selected');
    
    const cardDetails = document.getElementById('cardDetails');
    if (method === 'card') {
        cardDetails.style.display = 'block';
    } else {
        cardDetails.style.display = 'none';
    }
}

// Función para validar tarjeta de crédito
function validateCard() {
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    const cardHolder = document.getElementById('cardHolder').value.trim();
    
    let isValid = true;
    
    if (!cardNumber || cardNumber.length < 16) {
        document.getElementById('cardNumber').classList.add('error');
        isValid = false;
    } else {
        document.getElementById('cardNumber').classList.remove('error');
    }
    
    if (!expiryDate || expiryDate.length < 5) {
        document.getElementById('expiryDate').classList.add('error');
        isValid = false;
    } else {
        document.getElementById('expiryDate').classList.remove('error');
    }
    
    if (!cvv || cvv.length < 3) {
        document.getElementById('cvv').classList.add('error');
        isValid = false;
    } else {
        document.getElementById('cvv').classList.remove('error');
    }
    
    if (!cardHolder) {
        document.getElementById('cardHolder').classList.add('error');
        isValid = false;
    } else {
        document.getElementById('cardHolder').classList.remove('error');
    }
    
    return isValid;
}

// Procesar el pago
async function processPayment() {
    if (selectedPaymentMethod === 'card') {
        if (!validateCard()) {
            showNotification('Datos de tarjeta inválidos', 'error');
            return;
        }
    }

    if (cart.length === 0) {
        showNotification('Tu carrito está vacío', 'error');
        return;
    }

    orderData.paymentMethod = selectedPaymentMethod;

    const generatedNumber = '#SH-' + new Date().getFullYear() + '-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const orderNumberEl = document.getElementById('orderNumber');
    if (orderNumberEl) orderNumberEl.textContent = generatedNumber;

    const subtotal = cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
    const shipping = subtotal >= SHIPPING_FREE_THRESHOLD ? 0 : SHIPPING_COST;
    const discount = promoCodeApplied ? subtotal * discountAmount : 0;
    const total = subtotal + shipping - discount;

    const payload = {
        numero_pedido: generatedNumber,
        shippingInfo: orderData.shippingInfo || {},
        productos: cart.map(i => ({ id: i.id ?? null, name: i.name, price: i.price, quantity: i.quantity || 1 })),
        subtotal: subtotal,
        shipping: shipping,
        discount: discount,
        total: total,
        paymentMethod: selectedPaymentMethod,
        promoCode: document.getElementById('promoCode') ? document.getElementById('promoCode').value : ''
    };

    showNotification('Enviando pedido...', 'info');

    try {
        const resp = await fetch('api/procesar_pedido.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await resp.json();
        if (resp.ok && result && result.success) {
            showNotification('Pedido guardado (ID: ' + (result.pedido_id || '-') + ')', 'success');

            cart = [];
            promoCodeApplied = false;
            discountAmount = 0;
            saveCartToStorage();
            updateCartCount();

            goToStep(4);
            loadConfirmationDetails();
        } else {
            const msg = (result && result.message) ? result.message : 'Error al guardar el pedido';
            showNotification(msg, 'error');
            console.error('procesar_pedido error:', result);
        }
    } catch (err) {
        showNotification('Error de red al enviar el pedido', 'error');
        console.error('Fetch error:', err);
    }
}

// Cargar detalles en la sección de confirmación
function loadConfirmationDetails() {
    const container = document.getElementById('confirmationDetails');
    if (!container) return;

    const info = orderData.shippingInfo || {};
    const subt = orderData.subtotal || cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
    const sh = orderData.shipping || (subt >= SHIPPING_FREE_THRESHOLD ? 0 : SHIPPING_COST);
    const disc = orderData.discount || (promoCodeApplied ? subt * discountAmount : 0);
    const tot = orderData.total || (subt + sh - disc);

    container.innerHTML = `
        <div class="detail-row"><div class="detail-label">Nombre</div><div class="detail-value">${info.fullName || ''}</div></div>
        <div class="detail-row"><div class="detail-label">Email</div><div class="detail-value">${info.email || ''}</div></div>
        <div class="detail-row"><div class="detail-label">Dirección</div><div class="detail-value">${info.address || ''}, ${info.city || ''} ${info.zipCode || ''}</div></div>
        <div class="detail-row"><div class="detail-label">Subtotal</div><div class="detail-value">$${Number(subt).toFixed(2)}</div></div>
        <div class="detail-row"><div class="detail-label">Envío</div><div class="detail-value">${sh === 0 ? 'Gratis' : '$' + Number(sh).toFixed(2)}</div></div>
        <div class="detail-row"><div class="detail-label">Descuento</div><div class="detail-value">-$${Number(disc).toFixed(2)}</div></div>
        <div class="detail-row"><div class="detail-label">Total</div><div class="detail-value">$${Number(tot).toFixed(2)}</div></div>
        <div class="detail-row"><div class="detail-label">Método de pago</div><div class="detail-value">${selectedPaymentMethod === 'card' ? 'Tarjeta de Crédito/Débito' : 'PayPal'}</div></div>
    `;
}

// Configurar menú móvil
function setupMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.innerHTML = navLinks.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
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
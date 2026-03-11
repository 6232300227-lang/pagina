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

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Cargar carrito desde localStorage
    loadCartFromStorage();
    
    // Configurar eventos
    setupEventListeners();
    
    // Actualizar visualización del carrito
    updateCartDisplay();
});

// Cargar carrito desde localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('shoppingCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Guardar carrito en localStorage
function saveCartToStorage() {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
}

// Configurar event listeners
function setupEventListeners() {
    // Botón para vaciar carrito
    const clearCartBtn = document.getElementById('clearCartBtn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }
    
    // Botón para aplicar código promocional
    const applyPromoBtn = document.getElementById('applyPromoBtn');
    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', applyPromoCode);
    }
    
    // Botón para proceder al pago
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', showCheckoutModal);
    }
    
    // Botón para seguir comprando
    const continueShoppingBtn = document.getElementById('continueShoppingBtn');
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }
    
    // Modal de checkout
    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal) {
        // Cerrar modal
        const closeModalBtns = checkoutModal.querySelectorAll('.close-modal, .cancel-purchase');
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                checkoutModal.classList.remove('show');
            });
        });
        
        // Enviar formulario de compra
        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', processCheckout);
        }
    }
    
    // Modal de recibo
    const receiptModal = document.getElementById('receiptModal');
    if (receiptModal) {
        // Cerrar modal
        const closeReceiptBtns = receiptModal.querySelectorAll('.close-modal');
        closeReceiptBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                receiptModal.classList.remove('show');
            });
        });
        
        // Botón para imprimir ticket
        const printReceiptBtn = document.getElementById('printReceiptBtn');
        if (printReceiptBtn) {
            printReceiptBtn.addEventListener('click', printReceipt);
        }
        
        // Botón para volver a la tienda
        const backToStoreBtn = document.getElementById('backToStoreBtn');
        if (backToStoreBtn) {
            backToStoreBtn.addEventListener('click', function() {
                receiptModal.classList.remove('show');
                window.location.href = 'index.html';
            });
        }
    }
    
    // Cerrar modales al hacer clic fuera
    window.addEventListener('click', function(event) {
        const checkoutModal = document.getElementById('checkoutModal');
        const receiptModal = document.getElementById('receiptModal');
        
        if (checkoutModal && event.target === checkoutModal) {
            checkoutModal.classList.remove('show');
        }
        
        if (receiptModal && event.target === receiptModal) {
            receiptModal.classList.remove('show');
        }
    });
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
    
    if (!cartItemsContainer) return;
    
    // Limpiar contenedor
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        // Mostrar mensaje de carrito vacío
        if (emptyCartMessage) {
            emptyCartMessage.style.display = 'block';
        }
        if (cartItemsCount) {
            cartItemsCount.textContent = '0';
        }
        return;
    }
    
    // Ocultar mensaje de carrito vacío
    if (emptyCartMessage) {
        emptyCartMessage.style.display = 'none';
    }
    
    // Actualizar contador de items
    if (cartItemsCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartItemsCount.textContent = totalItems;
    }
    
    // Agregar cada item del carrito
    cart.forEach(item => {
        const cartItemElement = createCartItemElement(item);
        cartItemsContainer.appendChild(cartItemElement);
    });
}

// Crear elemento HTML para un item del carrito
function createCartItemElement(item) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.dataset.id = item.cartId;
    
    const itemTotal = item.price * item.quantity;
    
    cartItem.innerHTML = `
        <div class="cart-item-image">
            <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="cart-item-details">
            <h3 class="cart-item-title">${item.name}</h3>
            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            <div class="cart-item-actions">
                <div class="quantity-selector">
                    <button class="quantity-btn decrease-btn">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10">
                    <button class="quantity-btn increase-btn">+</button>
                </div>
                <button class="remove-item-btn">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        </div>
        <div class="cart-item-total">$${itemTotal.toFixed(2)}</div>
    `;
    
    // Agregar event listeners a los botones
    const decreaseBtn = cartItem.querySelector('.decrease-btn');
    const increaseBtn = cartItem.querySelector('.increase-btn');
    const quantityInput = cartItem.querySelector('.quantity-input');
    const removeBtn = cartItem.querySelector('.remove-item-btn');
    
    decreaseBtn.addEventListener('click', function() {
        updateQuantity(item.cartId, -1);
    });
    
    increaseBtn.addEventListener('click', function() {
        updateQuantity(item.cartId, 1);
    });
    
    quantityInput.addEventListener('change', function() {
        const newQuantity = parseInt(this.value);
        if (newQuantity >= 1 && newQuantity <= 10) {
            setQuantity(item.cartId, newQuantity);
        } else {
            this.value = item.quantity;
        }
    });
    
    removeBtn.addEventListener('click', function() {
        removeFromCart(item.cartId);
    });
    
    return cartItem;
}

// Actualizar cantidad de un item
function updateQuantity(cartId, change) {
    const itemIndex = cart.findIndex(item => item.cartId === cartId);
    if (itemIndex === -1) return;
    
    const newQuantity = cart[itemIndex].quantity + change;
    
    if (newQuantity >= 1 && newQuantity <= 10) {
        cart[itemIndex].quantity = newQuantity;
        saveCartToStorage();
        updateCartDisplay();
    }
}

// Establecer cantidad específica de un item
function setQuantity(cartId, quantity) {
    const itemIndex = cart.findIndex(item => item.cartId === cartId);
    if (itemIndex === -1) return;
    
    cart[itemIndex].quantity = quantity;
    saveCartToStorage();
    updateCartDisplay();
}

// Remover item del carrito
function removeFromCart(cartId) {
    cart = cart.filter(item => item.cartId !== cartId);
    saveCartToStorage();
    updateCartDisplay();
    
    // Mostrar notificación
    showNotification('Producto eliminado del carrito');
}

// Vaciar todo el carrito
function clearCart() {
    if (cart.length === 0) return;
    
    if (confirm('¿Estás seguro de que quieres vaciar todo el carrito?')) {
        cart = [];
        saveCartToStorage();
        updateCartDisplay();
        
        // Mostrar notificación
        showNotification('Carrito vaciado correctamente');
    }
}

// Actualizar resumen del pedido
function updateOrderSummary() {
    // Calcular subtotal
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
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
}

// Actualizar contador del carrito en el header
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }
}

// Aplicar código promocional
function applyPromoCode() {
    const promoCodeInput = document.getElementById('promoCode');
    if (!promoCodeInput) return;
    
    const code = promoCodeInput.value.trim().toUpperCase();
    
    if (!code) {
        showNotification('Por favor ingresa un código promocional');
        return;
    }
    
    if (VALID_PROMO_CODES[code]) {
        promoCodeApplied = true;
        discountAmount = VALID_PROMO_CODES[code];
        updateOrderSummary();
        
        // Mostrar notificación
        showNotification(`¡Código ${code} aplicado! Descuento del ${discountAmount * 100}%`);
        
        // Deshabilitar campo y botón
        promoCodeInput.disabled = true;
        document.getElementById('applyPromoBtn').disabled = true;
        document.getElementById('applyPromoBtn').textContent = 'Aplicado';
    } else {
        showNotification('Código promocional inválido');
        promoCodeInput.value = '';
    }
}

// Mostrar modal de checkout
function showCheckoutModal() {
    if (cart.length === 0) {
        showNotification('Tu carrito está vacío');
        return;
    }
    
    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal) {
        checkoutModal.classList.add('show');
    }
}

// Procesar checkout
async function processCheckout(event) {
    event.preventDefault();

    // Obtener datos del formulario
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone') ? document.getElementById('phone').value : '';
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const zipCode = document.getElementById('zipCode').value;
    const paymentMethod = document.getElementById('paymentMethod').value;

    // Validar que todos los campos estén completos
    if (!fullName || !email || !address || !city || !zipCode || !paymentMethod) {
        showNotification('Por favor completa todos los campos obligatorios');
        return;
    }

    // Cerrar modal de checkout
    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal) {
        checkoutModal.classList.remove('show');
    }

    // Generar recibo (actualiza DOM con número de orden)
    generateReceipt(fullName, email, address, city, zipCode, paymentMethod);

    // Obtener número de pedido generado en el recibo
    const orderNumberEl = document.getElementById('orderNumber');
    const numeroPedido = orderNumberEl ? orderNumberEl.textContent : (Math.floor(Math.random() * 1000000).toString().padStart(6, '0'));

    // Preparar payload para enviar al servidor
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal >= SHIPPING_FREE_THRESHOLD ? 0 : SHIPPING_COST;
    const discount = promoCodeApplied ? subtotal * discountAmount : 0;
    const total = subtotal + shipping - discount;

    const payload = {
        numero_pedido: numeroPedido,
        shippingInfo: {
            fullName: fullName,
            email: email,
            phone: phone,
            address: address,
            city: city,
            zipCode: zipCode
        },
        productos: cart.map(item => ({ id: item.id || null, name: item.name, price: item.price, quantity: item.quantity })),
        subtotal: subtotal,
        shipping: shipping,
        discount: discount,
        total: total,
        paymentMethod: paymentMethod,
        promoCode: (document.getElementById('promoCode') ? document.getElementById('promoCode').value : '')
    };

    try {
        const resp = await fetch('api/procesar_pedido.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await resp.json();

        if (result && result.success) {
            showNotification('Pedido guardado correctamente (ID: ' + (result.pedido_id || '-') + ')');

            // Vaciar carrito después de la compra
            cart = [];
            saveCartToStorage();
            updateCartDisplay();

            // Mostrar modal de recibo
            const receiptModal = document.getElementById('receiptModal');
            if (receiptModal) {
                receiptModal.classList.add('show');
            }
        } else {
            const msg = (result && result.message) ? result.message : 'Error al guardar el pedido';
            showNotification(msg);
            console.error('Error procesando pedido:', result);
        }
    } catch (err) {
        showNotification('Error de red al enviar el pedido');
        console.error('Fetch error:', err);
    }
}

// Generar recibo
function generateReceipt(fullName, email, address, city, zipCode, paymentMethod) {
    // Calcular totales
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal >= SHIPPING_FREE_THRESHOLD ? 0 : SHIPPING_COST;
    const discount = promoCodeApplied ? subtotal * discountAmount : 0;
    const total = subtotal + shipping - discount;
    
    // Actualizar fecha y número de orden
    const now = new Date();
    const receiptDate = document.getElementById('receiptDate');
    const orderNumber = document.getElementById('orderNumber');
    
    if (receiptDate) {
        receiptDate.textContent = now.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    if (orderNumber) {
        orderNumber.textContent = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    }
    
    // Actualizar items del recibo
    const receiptItemsBody = document.getElementById('receiptItemsBody');
    if (receiptItemsBody) {
        receiptItemsBody.innerHTML = '';
        
        cart.forEach(item => {
            const row = document.createElement('tr');
            const itemTotal = item.price * item.quantity;
            
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>$${itemTotal.toFixed(2)}</td>
            `;
            
            receiptItemsBody.appendChild(row);
        });
    }
    
    // Actualizar totales del recibo
    const receiptSubtotal = document.getElementById('receiptSubtotal');
    const receiptShipping = document.getElementById('receiptShipping');
    const receiptDiscount = document.getElementById('receiptDiscount');
    const receiptTotal = document.getElementById('receiptTotal');
    const receiptPaymentMethod = document.getElementById('receiptPaymentMethod');
    
    if (receiptSubtotal) receiptSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (receiptShipping) receiptShipping.textContent = shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`;
    if (receiptDiscount) receiptDiscount.textContent = discount > 0 ? `-$${discount.toFixed(2)}` : '$0.00';
    if (receiptTotal) receiptTotal.textContent = `$${total.toFixed(2)}`;
    
    // Actualizar método de pago
    if (receiptPaymentMethod) {
        const paymentMethods = {
            'credit': 'Tarjeta de crédito',
            'debit': 'Tarjeta de débito',
            'paypal': 'PayPal',
            'cash': 'Contra reembolso'
        };
        receiptPaymentMethod.textContent = paymentMethods[paymentMethod] || paymentMethod;
    }
}

// Imprimir ticket
function printReceipt() {
    const receiptContent = document.getElementById('printableReceipt').innerHTML;
    const originalContent = document.body.innerHTML;
    
    // Crear ventana de impresión
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Ticket de Compra - StyleHub</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    font-size: 12px;
                    line-height: 1.4;
                    color: #000;
                    margin: 0;
                    padding: 20px;
                }
                .receipt {
                    max-width: 300px;
                    margin: 0 auto;
                    border: 1px solid #ccc;
                    padding: 15px;
                }
                .receipt-header {
                    text-align: center;
                    border-bottom: 1px dashed #ccc;
                    padding-bottom: 10px;
                    margin-bottom: 15px;
                }
                .receipt-header h3 {
                    margin: 0;
                    font-size: 16px;
                    color: #f1356d;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 15px 0;
                }
                th {
                    text-align: left;
                    border-bottom: 1px solid #ccc;
                    padding: 5px 0;
                    font-weight: bold;
                }
                td {
                    padding: 5px 0;
                    border-bottom: 1px solid #eee;
                }
                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    margin: 5px 0;
                }
                .summary-row.total {
                    font-weight: bold;
                    border-top: 1px solid #ccc;
                    padding-top: 10px;
                    margin-top: 10px;
                }
                .receipt-footer {
                    text-align: center;
                    margin-top: 15px;
                    padding-top: 10px;
                    border-top: 1px dashed #ccc;
                    font-size: 10px;
                }
                @media print {
                    @page {
                        margin: 0;
                        size: auto;
                    }
                    body {
                        margin: 0;
                        padding: 10px;
                    }
                }
            </style>
        </head>
        <body>
            ${receiptContent}
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    // Esperar a que se cargue el contenido antes de imprimir
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 250);
}

// Mostrar notificación
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
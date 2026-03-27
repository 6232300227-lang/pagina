// Global buyNow helper used by product pages
window.buyNow = function(productId) {
    try {
        const products = typeof productsData !== 'undefined' ? productsData : (typeof productDatabase !== 'undefined' ? productDatabase : null);
        if (!products) return;

        const product = products.find(p => p.id === productId);
        if (!product) return;

        let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        const existing = cart.find(i => i.id === productId);
        if (existing) {
            existing.quantity = (existing.quantity || 1) + 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        // Redirect to cart information step
        window.location.href = 'carrito.html#step2';
    } catch (err) {
        console.error('buyNow error', err);
    }
};

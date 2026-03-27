const API_BASE = 'https://pagina-6ygv.onrender.com/api';
let salesChartInstance = null;

function sectionLabel(section) {
    const map = {
        mujer: 'Mujer',
        hombre: 'Hombre',
        ninos: 'Niños',
        ofertas: 'Ofertas',
        novedades: 'Novedades',
        general: 'General'
    };
    return map[section] || 'General';
}

function pageLabel(pageTarget) {
    const map = {
        'index.html': 'Inicio',
        'camisas.html': 'Camisas',
        'camisetas.html': 'Camisetas',
        'camisetas-niños.html': 'Camisetas Niños',
        'chaquetas.html': 'Chaquetas',
        'chaquetas-niño.html': 'Chaquetas Niño',
        'pantalones-hombre.html': 'Pantalones Hombre',
        'Pantalones-mujer.html': 'Pantalones Mujer',
        'pantalones-niña.html': 'Pantalones Niña',
        'pantalones-niño.html': 'Pantalones Niño',
        'tops.html': 'Tops',
        'tops-niña.html': 'Tops Niña',
        'Trajes.html': 'Trajes',
        'vestidos.html': 'Vestidos',
        'vestidos-niñas.html': 'Vestidos Niñas',
        'novedades.html': 'Novedades',
        'ofertas.html': 'Ofertas',
        'colecciones.html': 'Colecciones'
    };
    return map[pageTarget] || pageTarget || 'Inicio';
}

function currency(value) {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(value || 0);
}

function formatDate(value) {
    if (!value) return '-';
    const d = new Date(value);
    return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: '2-digit' });
}

function getStoredAuth() {
    const token = localStorage.getItem('token');
    let currentUser = null;
    try {
        currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    } catch (err) {
        currentUser = null;
    }
    return { token, currentUser };
}

function enforceAdminAccess() {
    const { token, currentUser } = getStoredAuth();
    if (!token || !currentUser || currentUser.role !== 'admin') {
        window.location.href = 'usuarios.html';
        return null;
    }
    const welcome = document.getElementById('adminWelcome');
    if (welcome) {
        const name = currentUser.name || currentUser.fullName || 'Administrador';
        welcome.textContent = `Bienvenido, ${name}`;
    }
    return token;
}

async function apiGet(path, token) {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error de API');
    return data;
}

function renderStats(stats) {
    document.getElementById('totalUsers').textContent = stats.totalUsers || 0;
    document.getElementById('totalAdmins').textContent = stats.totalAdmins || 0;
    document.getElementById('newUsers').textContent = stats.newUsersLast7d || 0;
    document.getElementById('cartValue').textContent = currency(stats.cart?.totalValue || 0);
}

function renderUsers(users) {
    const body = document.getElementById('usersTableBody');
    if (!body) return;
    if (!users || users.length === 0) {
        body.innerHTML = '<tr><td colspan="5" class="empty">No hay usuarios para mostrar</td></tr>';
        return;
    }

    body.innerHTML = users.map((user) => {
        const role = user.role || 'customer';
        const google = user.googleId ? 'Sí' : 'No';
        const roleClass = role === 'admin' ? 'role-admin' : 'role-customer';
        return `
            <tr>
                <td>${user.name || 'Sin nombre'}</td>
                <td>${user.email || '-'}</td>
                <td><span class="role-pill ${roleClass}">${role}</span></td>
                <td>${google}</td>
                <td>${formatDate(user.createdAt)}</td>
            </tr>
        `;
    }).join('');
}

async function loadDashboard(token) {
    const [stats, users, salesOverview, products] = await Promise.all([
        apiGet('/admin/stats', token),
        apiGet('/admin/users', token),
        apiGet('/admin/sales-overview', token),
        apiGet('/admin/products', token)
    ]);
    renderStats(stats);
    renderUsers(users);
    renderSales(salesOverview);
    renderProducts(products);
}

function renderSales(data) {
    document.getElementById('salesRevenue').textContent = currency(data.totalRevenue || 0);
    document.getElementById('salesOrders').textContent = data.totalOrders || 0;
    document.getElementById('salesPending').textContent = data.pendingOrders || 0;
    document.getElementById('salesAvg').textContent = currency(data.avgTicket || 0);

    const canvas = document.getElementById('salesChart');
    if (!canvas || typeof Chart === 'undefined') return;

    if (salesChartInstance) {
        salesChartInstance.destroy();
    }

    salesChartInstance = new Chart(canvas, {
        type: 'line',
        data: {
            labels: data.chart?.labels || [],
            datasets: [{
                label: 'Ventas',
                data: data.chart?.values || [],
                borderColor: '#d64b2a',
                backgroundColor: 'rgba(214, 75, 42, 0.15)',
                fill: true,
                tension: 0.35,
                pointRadius: 4,
                pointBackgroundColor: '#d64b2a'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    ticks: {
                        callback: (value) => `$${value}`
                    }
                }
            }
        }
    });
}

function renderProducts(products) {
    const container = document.getElementById('productsList');
    if (!container) return;

    if (!products || products.length === 0) {
        container.innerHTML = '<p class="empty">No hay productos registrados todavía.</p>';
        return;
    }

    container.innerHTML = products.map((product) => {
        const oldPrice = Number(product.price || 0);
        const discount = Number(product.discountPercent || 0);
        const finalPrice = Number(product.finalPrice || oldPrice);
        const image = product.image || 'https://via.placeholder.com/200x200?text=Producto';

        return `
            <div class="product-item">
                <img src="${image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/200x200?text=Producto'">
                <div>
                    <p class="product-name">${product.name}</p>
                    <p class="product-meta">Apartado: ${sectionLabel(product.section)}</p>
                    <p class="product-meta">Página: ${pageLabel(product.pageTarget)}</p>
                    <p class="product-meta">${product.description || 'Sin descripción'}</p>
                    <p class="product-price">
                        ${discount > 0 ? `<span class="old">${currency(oldPrice)}</span>` : ''}
                        <span>${currency(finalPrice)}</span>
                        ${discount > 0 ? `<span>(${discount}% off)</span>` : ''}
                    </p>
                    <p class="product-meta">Estado: ${product.isActive ? 'Activo' : 'Inactivo'}</p>
                </div>
                <div class="product-actions">
                    <button class="tiny-btn edit" data-edit-product="${product.id}">Editar</button>
                </div>
            </div>
        `;
    }).join('');

    container.querySelectorAll('[data-edit-product]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-edit-product');
            const found = products.find((p) => String(p.id) === String(id));
            if (!found) return;
            fillProductForm(found);
        });
    });
}

function fillProductForm(product) {
    document.getElementById('productId').value = product.id || '';
    document.getElementById('productName').value = product.name || '';
    document.getElementById('productSection').value = product.section || 'general';
    document.getElementById('productPageTarget').value = product.pageTarget || 'index.html';
    document.getElementById('productImage').value = product.image || '';
    document.getElementById('productDescription').value = product.description || '';
    document.getElementById('productPrice').value = product.price ?? '';
    document.getElementById('productDiscount').value = product.discountPercent ?? 0;
    document.getElementById('productActive').checked = product.isActive !== false;

    const btn = document.getElementById('saveProductBtn');
    if (btn) btn.innerHTML = '<i class="fas fa-pen"></i> Actualizar producto';
}

function resetProductForm() {
    const form = document.getElementById('productForm');
    if (form) form.reset();
    const productId = document.getElementById('productId');
    if (productId) productId.value = '';
    const active = document.getElementById('productActive');
    if (active) active.checked = true;
    const btn = document.getElementById('saveProductBtn');
    if (btn) btn.innerHTML = '<i class="fas fa-save"></i> Guardar producto';
}

async function saveProduct(token) {
    const productId = document.getElementById('productId').value;
    const payload = {
        name: document.getElementById('productName').value.trim(),
        section: document.getElementById('productSection').value,
        pageTarget: document.getElementById('productPageTarget').value,
        image: document.getElementById('productImage').value.trim(),
        description: document.getElementById('productDescription').value.trim(),
        price: Number(document.getElementById('productPrice').value || 0),
        discountPercent: Number(document.getElementById('productDiscount').value || 0),
        isActive: document.getElementById('productActive').checked
    };

    if (!payload.name || payload.price < 0) {
        alert('Nombre y precio válido son requeridos');
        return;
    }

    const url = productId ? `${API_BASE}/admin/products/${productId}` : `${API_BASE}/admin/products`;
    const method = productId ? 'PUT' : 'POST';

    const res = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data.error || 'No se pudo guardar el producto');
    }

    resetProductForm();
}

function bindActions(token) {
    const logoutBtn = document.getElementById('logoutAdmin');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('mpCheckoutDraft');
            localStorage.removeItem('mpLastPaymentId');
            window.location.href = 'usuarios.html';
        });
    }

    const refreshBtn = document.getElementById('refreshUsers');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', async () => {
            refreshBtn.disabled = true;
            refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando';
            try {
                await loadDashboard(token);
            } catch (err) {
                alert(err.message || 'No se pudo actualizar el panel');
            } finally {
                refreshBtn.disabled = false;
                refreshBtn.innerHTML = '<i class="fas fa-rotate"></i> Actualizar';
            }
        });
    }

    const refreshSales = document.getElementById('refreshSales');
    if (refreshSales) {
        refreshSales.addEventListener('click', async () => {
            refreshSales.disabled = true;
            try {
                const sales = await apiGet('/admin/sales-overview', token);
                renderSales(sales);
            } catch (err) {
                alert(err.message || 'No se pudo actualizar ventas');
            } finally {
                refreshSales.disabled = false;
            }
        });
    }

    const refreshProducts = document.getElementById('refreshProducts');
    if (refreshProducts) {
        refreshProducts.addEventListener('click', async () => {
            refreshProducts.disabled = true;
            try {
                const products = await apiGet('/admin/products', token);
                renderProducts(products);
            } catch (err) {
                alert(err.message || 'No se pudo actualizar productos');
            } finally {
                refreshProducts.disabled = false;
            }
        });
    }

    const clearForm = document.getElementById('clearProductForm');
    if (clearForm) {
        clearForm.addEventListener('click', resetProductForm);
    }

    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const saveBtn = document.getElementById('saveProductBtn');
            if (saveBtn) {
                saveBtn.disabled = true;
                saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando';
            }

            try {
                await saveProduct(token);
                const [products, sales] = await Promise.all([
                    apiGet('/admin/products', token),
                    apiGet('/admin/sales-overview', token)
                ]);
                renderProducts(products);
                renderSales(sales);
            } catch (err) {
                alert(err.message || 'Error guardando producto');
            } finally {
                if (saveBtn) {
                    saveBtn.disabled = false;
                    if (!document.getElementById('productId').value) {
                        saveBtn.innerHTML = '<i class="fas fa-save"></i> Guardar producto';
                    } else {
                        saveBtn.innerHTML = '<i class="fas fa-pen"></i> Actualizar producto';
                    }
                }
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const token = enforceAdminAccess();
    if (!token) return;
    bindActions(token);

    try {
        await loadDashboard(token);
    } catch (err) {
        alert(err.message || 'No se pudo cargar el dashboard');
    }
});

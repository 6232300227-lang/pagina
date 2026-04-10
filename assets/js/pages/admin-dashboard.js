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
    // Preferir el formateador global si está disponible
    try {
        if (typeof window !== 'undefined' && typeof window.formatCurrency === 'function') {
            return window.formatCurrency(value);
        }
    } catch (e) {}
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value || 0);
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

async function apiDelete(path, token) {
    const res = await fetch(`${API_BASE}${path}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'No se pudo eliminar el usuario');
    return data;
}

async function apiPatch(path, token, payload) {
    const res = await fetch(`${API_BASE}${path}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'No se pudo actualizar el usuario');
    return data;
}

function renderStats(stats) {
    document.getElementById('totalUsers').textContent = stats.totalUsers || 0;
    document.getElementById('totalAdmins').textContent = stats.totalAdmins || 0;
    document.getElementById('newUsers').textContent = stats.newUsersLast7d || 0;
    document.getElementById('cartValue').textContent = currency(stats.cart?.totalValue || 0);
}

function renderUsers(users, token) {
    const body = document.getElementById('usersTableBody');
    if (!body) return;

    const { currentUser } = getStoredAuth();
    const currentAdminId = currentUser?.id || currentUser?._id || null;

    if (!users || users.length === 0) {
        body.innerHTML = '<tr><td colspan="7" class="empty">No hay usuarios para mostrar</td></tr>';
        return;
    }

    body.innerHTML = users.map((user) => {
        const role = user.role || 'customer';
        const google = user.googleId ? 'Sí' : 'No';
        const roleClass = role === 'admin' ? 'role-admin' : 'role-customer';
        const statusClass = user.isActive === false ? 'status-inactive' : 'status-active';
        const statusText = user.isActive === false ? 'Desactivado' : 'Activo';
        const userId = user._id || user.id;
        const isCurrentAdmin = String(userId || '') === String(currentAdminId || '');
        const toggleText = user.isActive === false ? 'Activar' : 'Desactivar';
        return `
            <tr>
                <td>${user.name || 'Sin nombre'}</td>
                <td>${user.email || '-'}</td>
                <td><span class="role-pill ${roleClass}">${role}</span></td>
                <td><span class="status-pill ${statusClass}">${statusText}</span></td>
                <td>${google}</td>
                <td>${formatDate(user.createdAt)}</td>
                <td>
                    ${isCurrentAdmin
                        ? '<span class="empty">Tu cuenta</span>'
                        : `
                            <div class="row-actions">
                                <button class="tiny-btn toggle" data-toggle-user="${userId}" data-next-status="${user.isActive === false ? 'true' : 'false'}">${toggleText}</button>
                                <button class="tiny-btn delete" data-delete-user="${userId}">Eliminar</button>
                            </div>
                        `}
                </td>
            </tr>
        `;
    }).join('');

    body.querySelectorAll('[data-toggle-user]').forEach((btn) => {
        btn.addEventListener('click', async () => {
            const userId = btn.getAttribute('data-toggle-user');
            const nextStatus = btn.getAttribute('data-next-status') === 'true';
            if (!userId) return;

            const actionText = nextStatus ? 'activar' : 'desactivar';
            const ok = window.confirm(`¿Seguro que deseas ${actionText} este usuario?`);
            if (!ok) return;

            const original = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = 'Guardando...';

            try {
                await apiPatch(`/admin/users/${encodeURIComponent(userId)}/status`, token, { isActive: nextStatus });
                const [stats, updatedUsers] = await Promise.all([
                    apiGet('/admin/stats', token),
                    apiGet('/admin/users', token)
                ]);
                renderStats(stats);
                renderUsers(updatedUsers, token);
            } catch (err) {
                alert(err.message || 'No se pudo actualizar el estado del usuario');
                btn.disabled = false;
                btn.innerHTML = original;
            }
        });
    });

    body.querySelectorAll('[data-delete-user]').forEach((btn) => {
        btn.addEventListener('click', async () => {
            const userId = btn.getAttribute('data-delete-user');
            if (!userId) return;

            const ok = window.confirm('¿Seguro que deseas eliminar este usuario? Esta acción no se puede deshacer.');
            if (!ok) return;

            const original = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = 'Eliminando...';

            try {
                await apiDelete(`/admin/users/${encodeURIComponent(userId)}`, token);
                const [stats, updatedUsers] = await Promise.all([
                    apiGet('/admin/stats', token),
                    apiGet('/admin/users', token)
                ]);
                renderStats(stats);
                renderUsers(updatedUsers, token);
            } catch (err) {
                alert(err.message || 'No se pudo eliminar el usuario');
                btn.disabled = false;
                btn.innerHTML = original;
            }
        });
    });
}

async function loadDashboard(token) {
    const [stats, users, salesOverview, products] = await Promise.all([
        apiGet('/admin/stats', token),
        apiGet('/admin/users', token),
        apiGet('/admin/sales-overview', token),
        apiGet('/admin/products', token)
    ]);
    renderStats(stats);
    renderUsers(users, token);
    renderSales(salesOverview);
    renderProducts(products, token);
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
                        callback: (value) => {
                            try { return formatCurrency(value); } catch (e) { return `$${value}`; }
                        }
                    }
                }
            }
        }
    });
}

/* Banner de conectividad con la API */
function showApiBanner(message, retryFn) {
    let banner = document.getElementById('apiWarningBanner');
    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'apiWarningBanner';
        banner.className = 'api-warning-banner';
        const p = document.createElement('p');
        p.id = 'apiWarningBannerMsg';
        const btn = document.createElement('button');
        btn.className = 'retry-btn';
        btn.textContent = 'Reintentar';
        btn.addEventListener('click', () => {
            if (typeof retryFn === 'function') retryFn();
        });
        banner.appendChild(p);
        banner.appendChild(btn);
        const container = document.querySelector('.admin-main') || document.body;
        container.insertBefore(banner, container.firstChild);
    }
    const msgEl = document.getElementById('apiWarningBannerMsg');
    if (msgEl) msgEl.textContent = message || 'No se pudo conectar con el servidor';
    banner.style.display = 'flex';
}

function hideApiBanner() {
    const banner = document.getElementById('apiWarningBanner');
    if (banner) banner.style.display = 'none';
}

function renderProducts(products, token) {
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
        const image = product.image || '';

        return `
            <div class="product-item">
                <img src="${image}" alt="${product.name}">
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
                    <button class="tiny-btn delete" data-delete-product="${product.id}">Eliminar</button>
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

    container.querySelectorAll('[data-delete-product]').forEach((btn) => {
        // deletion handled via delegated listener in bindActions to apply across the page
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
                hideApiBanner();
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
                hideApiBanner();
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
                renderProducts(products, token);
                hideApiBanner();
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
                hideApiBanner();
                const [products, sales] = await Promise.all([
                    apiGet('/admin/products', token),
                    apiGet('/admin/sales-overview', token)
                ]);
                renderProducts(products, token);
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

    // Delegated delete handler for products: captures any element with data-delete-product
    document.addEventListener('click', async (ev) => {
        const btn = ev.target.closest('[data-delete-product]');
        if (!btn) return;
        ev.preventDefault();
        const id = btn.getAttribute('data-delete-product');
        if (!id) return;

        const ok = window.confirm('¿Seguro que deseas eliminar este producto? Esta acción no se puede deshacer.');
        if (!ok) return;

        const original = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = 'Eliminando...';

        try {
            await apiDelete(`/admin/products/${encodeURIComponent(id)}`, token);
            const productsUpdated = await apiGet('/admin/products', token);
            renderProducts(productsUpdated, token);
        } catch (err) {
            alert(err.message || 'No se pudo eliminar el producto');
            btn.disabled = false;
            btn.innerHTML = original;
        }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const token = enforceAdminAccess();
    if (!token) return;
    bindActions(token);

    try {
        await loadDashboard(token);
    } catch (err) {
        console.warn('No se pudo cargar el dashboard:', err);
        // Intentar comprobar salud del backend para dar un mensaje más claro
        try {
            const healthRes = await fetch(`${API_BASE}/health`);
            if (healthRes.ok) {
                // backend responde, problema puede ser token/403/401
                showApiBanner('El servidor responde pero hubo un error al cargar datos (revisa token). Pulsa Reintentar.', async () => {
                    hideApiBanner();
                    try { await loadDashboard(token); hideApiBanner(); } catch (_) { /* ignore */ }
                });
            } else {
                showApiBanner('El servidor respondió con error. Pulsa Reintentar para intentarlo de nuevo.', async () => {
                    hideApiBanner();
                    try { await loadDashboard(token); hideApiBanner(); } catch (_) { /* ignore */ }
                });
            }
        } catch (healthErr) {
            showApiBanner('No se puede conectar al servidor API. Comprueba que el backend esté en línea. Pulsa Reintentar.', async () => {
                hideApiBanner();
                try { await loadDashboard(token); hideApiBanner(); } catch (_) { /* ignore */ }
            });
        }
        try { renderStats({}); } catch (e) {}
        try { renderUsers([], token); } catch (e) {}
        try { renderSales({}); } catch (e) {}
        try { renderProducts([], token); } catch (e) {}
    }
});

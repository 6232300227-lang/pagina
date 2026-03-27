const API_BASE = 'https://pagina-6ygv.onrender.com';

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

function getStoredSession() {
    let token = '';
    let user = null;
    try {
        token = localStorage.getItem('token') || '';
    } catch (_err) {
        token = '';
    }
    try {
        user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    } catch (_err) {
        user = null;
    }
    // Fallback to window globals if set by auth.js
    if ((!token || token === '') && typeof window.token !== 'undefined') {
        token = window.token || '';
    }
    if ((!user || user === null) && typeof window.currentUser !== 'undefined') {
        user = window.currentUser || null;
    }
    return { token, user };
}

function getAuthHeaders() {
    const { token } = getStoredSession();
    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
    };
}

function logoutUser() {
    if (typeof window.logout === 'function') {
        window.logout({ redirectTo: 'usuarios.html' });
        return;
    }
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    window.location.href = 'usuarios.html';
}

function formatMoney(value) {
    return Number(value || 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
}

function formatDate(value) {
    if (!value) return 'Sin fecha';
    return new Date(value).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

function statusLabel(status = '') {
    const normalized = String(status).toLowerCase();
    if (normalized === 'approved') return 'Aprobada';
    if (normalized === 'pending' || normalized === 'pending_payment') return 'Pendiente';
    if (normalized === 'rejected') return 'Rechazada';
    if (normalized === 'cancelled') return 'Cancelada';
    return 'En proceso';
}

function renderOrderList(container, orders, mode) {
    if (!container) return;

    if (!Array.isArray(orders) || orders.length === 0) {
        container.innerHTML = '<div class="empty-orders">No hay compras para mostrar todavía.</div>';
        return;
    }

    container.innerHTML = orders.map((order) => {
        const items = Array.isArray(order.items) ? order.items : [];
        const itemsText = items
            .slice(0, 3)
            .map((item) => `${item.quantity} x ${item.title}`)
            .join(' • ');
        const estimated = order.estimatedDelivery ? formatDate(order.estimatedDelivery) : 'Por confirmar';

        return `
            <article class="order-card ${mode === 'recent' ? 'recent' : ''}">
                <div class="order-main-row">
                    <div>
                        <h4>Pedido ${order.externalReference || order.id}</h4>
                        <p class="order-meta">Estado: <strong>${statusLabel(order.status)}</strong> • ${formatDate(order.createdAt)}</p>
                    </div>
                    <div class="order-total">${formatMoney(order.summary && order.summary.total)}</div>
                </div>
                <p class="order-items">${itemsText || 'Sin detalle de productos'}</p>
                <p class="order-delivery"><i class="fas fa-truck"></i> Llegada estimada: <strong>${estimated}</strong></p>
            </article>
        `;
    }).join('');
}

function setupAccountTabs() {
    const tabsHost = document.getElementById('accountTabs');
    if (!tabsHost) return;

    tabsHost.addEventListener('click', (event) => {
        const btn = event.target.closest('.account-tab-btn');
        if (!btn) return;

        tabsHost.querySelectorAll('.account-tab-btn').forEach((node) => node.classList.remove('active'));
        btn.classList.add('active');

        document.querySelectorAll('.account-panel').forEach((panel) => panel.classList.remove('active'));
        const target = document.getElementById(btn.dataset.target);
        if (target) target.classList.add('active');
    });
}

function fillProfileForm(profile) {
    const name = document.getElementById('profileName');
    const email = document.getElementById('profileEmail');
    const phone = document.getElementById('profilePhone');
    const address = document.getElementById('profileAddress');
    const city = document.getElementById('profileCity');
    const zip = document.getElementById('profileZipCode');
    const welcome = document.getElementById('accountWelcomeText');

    if (name) name.value = profile.name || '';
    if (email) email.value = profile.email || '';
    if (phone) phone.value = profile.phone || '';
    if (address) address.value = profile.address || '';
    if (city) city.value = profile.city || '';
    if (zip) zip.value = profile.zipCode || '';
    if (welcome) welcome.textContent = `Hola ${profile.name || 'Cliente'}, administra tu perfil y revisa tus pedidos.`;
}

async function loadAccountData() {
    const [profileResp, historyResp, recentResp] = await Promise.all([
        fetch(`${API_BASE}/api/account/me`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE}/api/account/orders`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE}/api/account/orders/recent`, { headers: getAuthHeaders() })
    ]);

    if ([profileResp, historyResp, recentResp].some((resp) => resp.status === 401)) {
        showNotification('Tu sesión expiró. Inicia sesión nuevamente.', 'info');
        logoutUser();
        return;
    }

    if (!profileResp.ok || !historyResp.ok || !recentResp.ok) {
        throw new Error('No se pudieron cargar tus datos de cuenta');
    }

    const profile = await profileResp.json();
    const history = await historyResp.json();
    const recent = await recentResp.json();

    fillProfileForm(profile);
    renderOrderList(document.getElementById('orderHistoryList'), history, 'history');
    renderOrderList(document.getElementById('recentOrdersList'), recent, 'recent');

    const stored = JSON.parse(localStorage.getItem('currentUser') || 'null') || {};
    localStorage.setItem('currentUser', JSON.stringify({
        ...stored,
        id: profile.id,
        name: profile.name,
        fullName: profile.name,
        email: profile.email,
        role: profile.role || 'customer'
    }));
    if (typeof window.updateUserInterface === 'function') {
        window.updateUserInterface();
    }
}

function bindProfileForm() {
    const form = document.getElementById('profileForm');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const saveBtn = document.getElementById('saveProfileBtn');
        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.innerHTML = '<span><i class="fas fa-spinner fa-spin"></i> Guardando...</span>';
        }

        try {
            const payload = {
                name: document.getElementById('profileName').value.trim(),
                phone: document.getElementById('profilePhone').value.trim(),
                address: document.getElementById('profileAddress').value.trim(),
                city: document.getElementById('profileCity').value.trim(),
                zipCode: document.getElementById('profileZipCode').value.trim()
            };

            const response = await fetch(`${API_BASE}/api/account/me`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            if (!response.ok) {
                showNotification(data.error || 'No se pudo guardar tu perfil', 'error');
                return;
            }

            fillProfileForm(data);
            const stored = JSON.parse(localStorage.getItem('currentUser') || 'null') || {};
            localStorage.setItem('currentUser', JSON.stringify({
                ...stored,
                id: data.id,
                name: data.name,
                fullName: data.name,
                email: data.email,
                role: data.role || 'customer'
            }));
            if (typeof window.updateUserInterface === 'function') {
                window.updateUserInterface();
            }

            showNotification('Perfil actualizado correctamente', 'success');
        } catch (error) {
            console.error('Save profile error:', error);
            showNotification('Error de conexión al guardar el perfil', 'error');
        } finally {
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.innerHTML = '<span><i class="fas fa-save"></i> Guardar cambios</span>';
            }
        }
    });
}

async function initAccountView() {
    const loginSection = document.querySelector('.login-section');
    const accountSection = document.getElementById('accountSection');
    if (loginSection) loginSection.style.display = 'none';
    if (accountSection) accountSection.style.display = 'block';

    setupAccountTabs();
    bindProfileForm();

    const logoutBtn = document.getElementById('accountLogoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logoutUser);
    }

    try {
        await loadAccountData();
    } catch (error) {
        console.error('Account load error:', error);
        showNotification('No se pudo cargar tu cuenta en este momento', 'error');
    }
}

function initLoginView() {
    const loginSection = document.querySelector('.login-section');
    const accountSection = document.getElementById('accountSection');
    if (loginSection) loginSection.style.display = 'block';
    if (accountSection) accountSection.style.display = 'none';

    const loginForm = document.getElementById('loginFormPage');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            const loginBtn = document.getElementById('loginBtnPage');

            if (!email || !password) {
                showNotification('Por favor completa todos los campos', 'error');
                return;
            }

            if (loginBtn) {
                loginBtn.disabled = true;
                loginBtn.innerHTML = '<span><i class="fas fa-spinner fa-spin"></i> Iniciando sesión...</span>';
            }

            try {
                const resp = await fetch(`${API_BASE}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await resp.json();
                if (!resp.ok) {
                    showNotification(data.error || 'Error al iniciar sesión', 'error');
                    return;
                }

                localStorage.setItem('token', data.token);
                localStorage.setItem('currentUser', JSON.stringify({
                    id: data.user.id,
                    name: data.user.name,
                    fullName: data.user.name,
                    email: data.user.email,
                    role: data.user.role || 'customer'
                }));

                if (rememberMe) {
                    localStorage.setItem('rememberedUser', email);
                } else {
                    localStorage.removeItem('rememberedUser');
                }

                if (data.user.role === 'admin') {
                    window.location.href = 'admin-dashboard.html';
                    return;
                }

                showNotification(`¡Bienvenido/a ${data.user.name}!`, 'success');
                await initAccountView();
            } catch (error) {
                console.error('Login error:', error);
                showNotification('Error de conexión al iniciar sesión', 'error');
            } finally {
                if (loginBtn) {
                    loginBtn.disabled = false;
                    loginBtn.innerHTML = '<span><i class="fas fa-sign-in-alt"></i> Iniciar Sesión</span>';
                }
            }
        });
    }

    const forgot = document.getElementById('forgotPassword');
    if (forgot) {
        forgot.addEventListener('click', (event) => {
            event.preventDefault();
            const modal = document.getElementById('forgotModal');
            if (modal) modal.style.display = 'flex';
        });
    }

    const rememberedEmail = localStorage.getItem('rememberedUser');
    if (rememberedEmail) {
        const emailInput = document.getElementById('email');
        const rememberCheck = document.getElementById('rememberMe');
        if (emailInput) emailInput.value = rememberedEmail;
        if (rememberCheck) rememberCheck.checked = true;
    }
}

function closeForgotModal() {
    const modal = document.getElementById('forgotModal');
    if (modal) modal.style.display = 'none';
}

function sendResetLink() {
    const email = (document.getElementById('resetEmail') || {}).value || '';
    if (!email.trim()) {
        showNotification('Por favor ingresa tu email', 'error');
        return;
    }
    showNotification('Hemos enviado un enlace a tu correo electrónico', 'info');
    closeForgotModal();
}

document.addEventListener('DOMContentLoaded', async () => {
    const { token, user } = getStoredSession();

    if (token && user && user.role === 'admin') {
        window.location.href = 'admin-dashboard.html';
        return;
    }

    if (token && user) {
        // If token present but user object lacks role, still try to load account view
        await initAccountView();
    } else {
        initLoginView();
    }

    const googleLogin = document.getElementById('googleLogin');
    if (googleLogin) {
        googleLogin.addEventListener('click', (event) => {
            event.preventDefault();
            if (typeof window.loginWithGoogle === 'function') {
                window.loginWithGoogle();
                return;
            }
            showNotification('Google Sign-In no está disponible aún', 'info');
        });
    }

    const facebookLogin = document.getElementById('facebookLogin');
    if (facebookLogin) {
        facebookLogin.addEventListener('click', (event) => {
            event.preventDefault();
            showNotification('Redirigiendo a Facebook...', 'info');
        });
    }
});

window.closeForgotModal = closeForgotModal;
window.sendResetLink = sendResetLink;

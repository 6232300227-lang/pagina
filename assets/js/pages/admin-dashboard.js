const API_BASE = 'https://pagina-6ygv.onrender.com/api';

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
    const [stats, users] = await Promise.all([
        apiGet('/admin/stats', token),
        apiGet('/admin/users', token)
    ]);
    renderStats(stats);
    renderUsers(users);
}

function bindActions(token) {
    const logoutBtn = document.getElementById('logoutAdmin');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('currentUser');
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

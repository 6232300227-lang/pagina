// ===== AUTENTICACIÓN GLOBAL =====
// Este archivo debe incluirse en todas las páginas

const API_URL = 'https://pagina-6ygv.onrender.com/api';

let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let token = localStorage.getItem('token') || null;

// Función para abrir el modal de autenticación
function openAuthModal(event) {
    if (event) event.preventDefault();
    if (currentUser) {
        showUserMenu();
    } else {
        const authModal = document.getElementById('authModal');
        if (authModal) {
            authModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
}

// Función para cerrar el modal de autenticación
function closeAuthModal() {
    const authModal = document.getElementById('authModal');
    if (authModal) {
        authModal.classList.remove('active');
        document.body.style.overflow = '';
        // Limpiar errores
        const loginError = document.getElementById('loginError');
        const registerError = document.getElementById('registerError');
        if (loginError) loginError.style.display = 'none';
        if (registerError) registerError.style.display = 'none';
    }
}

// Cambiar entre tabs de login y registro
// Gestiona la visualización de los formularios de login y registro
function switchAuthTab(tab) {
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginTab && registerTab && loginForm && registerForm) {
        if (tab === 'login') {
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
        } else {
            registerTab.classList.add('active');
            loginTab.classList.remove('active');
            registerForm.classList.add('active');
            loginForm.classList.remove('active');
        }
    }
}

// Manejar login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');
    const loginBtn = document.getElementById('loginBtn');

    if (loginBtn) {
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<span class="loading-spinner"></span> Cargando...';
    }

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            token = data.token;
            currentUser = data.user;

            closeAuthModal();
            updateUserInterface();
            showNotification('¡Bienvenido de vuelta!', 'success');
            
            // Limpiar formulario
            document.getElementById('loginEmail').value = '';
            document.getElementById('loginPassword').value = '';
        } else {
            if (errorDiv) {
                errorDiv.textContent = data.message || 'Error al iniciar sesión';
                errorDiv.style.display = 'flex';
            }
        }
    } catch (error) {
        if (errorDiv) {
            errorDiv.textContent = 'Error de conexión con el servidor';
            errorDiv.style.display = 'flex';
        }
    } finally {
        if (loginBtn) {
            loginBtn.disabled = false;
            loginBtn.innerHTML = '<span>Iniciar Sesión</span>';
        }
    }
}

// Manejar registro
async function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const errorDiv = document.getElementById('registerError');
    const registerBtn = document.getElementById('registerBtn');

    // Validar contraseña
    if (password.length < 6) {
        if (errorDiv) {
            errorDiv.textContent = 'La contraseña debe tener al menos 6 caracteres';
            errorDiv.style.display = 'flex';
        }
        return;
    }

    if (registerBtn) {
        registerBtn.disabled = true;
        registerBtn.innerHTML = '<span class="loading-spinner"></span> Cargando...';
    }

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            token = data.token;
            currentUser = data.user;

            closeAuthModal();
            updateUserInterface();
            showNotification('¡Registro exitoso! Bienvenido a StyleHub', 'success');
            
            // Limpiar formulario
            document.getElementById('registerName').value = '';
            document.getElementById('registerEmail').value = '';
            document.getElementById('registerPassword').value = '';
        } else {
            if (errorDiv) {
                errorDiv.textContent = data.message || 'Error al registrar';
                errorDiv.style.display = 'flex';
            }
        }
    } catch (error) {
        if (errorDiv) {
            errorDiv.textContent = 'Error de conexión con el servidor';
            errorDiv.style.display = 'flex';
        }
    } finally {
        if (registerBtn) {
            registerBtn.disabled = false;
            registerBtn.innerHTML = '<span>Crear Cuenta</span>';
        }
    }
}

// Cerrar sesión
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    token = null;
    currentUser = null;
    updateUserInterface();
    showNotification('Has cerrado sesión', 'info');
}

// Mostrar menú de usuario
function showUserMenu() {
    if (confirm('¿Cerrar sesión?')) {
        logout();
    }
}

// Actualizar interfaz de usuario
function updateUserInterface() {
    const accountText = document.getElementById('accountText');
    const accountLink = document.getElementById('accountLink');

    if (currentUser && accountText) {
        const firstName = currentUser.name ? currentUser.name.split(' ')[0] : 'Usuario';
        accountText.textContent = `Hola, ${firstName}`;
        if (accountLink) accountLink.href = 'perfil.html';
    } else {
        if (accountText) accountText.textContent = 'Mi cuenta';
        if (accountLink) accountLink.href = '#';
    }
}

// Mostrar notificación
function showNotification(message, type = 'info') {
    // Crear elemento de notificación si no existe
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        document.body.appendChild(notification);
    }

    notification.textContent = message;
    notification.className = `notification notification-${type}`;
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Cerrar modal cuando se hace click fuera de él
document.addEventListener('DOMContentLoaded', function() {
    const authModal = document.getElementById('authModal');
    if (authModal) {
        authModal.addEventListener('click', function(event) {
            if (event.target === authModal) {
                closeAuthModal();
            }
        });
    }

    // Actualizar interfaz al cargar la página
    updateUserInterface();
});

// Exponer funciones globalmente
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.switchAuthTab = switchAuthTab;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.logout = logout;
window.updateUserInterface = updateUserInterface;

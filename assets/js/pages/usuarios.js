const API_BASE = 'https://pagina-6ygv.onrender.com';
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

        // Función para cerrar sesión
        function logout() {
            if (typeof window.logout === 'function' && window.logout !== logout) {
                window.logout({ redirectTo: 'usuarios.html' });
                return;
            }

            localStorage.removeItem('currentUser');
            localStorage.removeItem('token');
            localStorage.removeItem('mpCheckoutDraft');
            localStorage.removeItem('mpLastPaymentId');
            showNotification('Has cerrado sesión correctamente', 'info');
            setTimeout(() => {
                window.location.href = 'usuarios.html';
            }, 250);
        }

        // Manejar el login (envía al backend)
        document.getElementById('loginForm').addEventListener('submit', async function(e) {
            e.preventDefault();

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            const loginBtn = document.getElementById('loginBtn') || document.getElementById('loginBtnPage');

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
                    const msg = data && data.error ? data.error : 'Error al iniciar sesión';
                    showNotification(msg, 'error');
                    if (loginBtn) {
                        loginBtn.disabled = false;
                        loginBtn.innerHTML = '<span><i class="fas fa-sign-in-alt"></i> Iniciar Sesión</span>';
                    }
                    return;
                }

                // Guardar token y usuario
                localStorage.setItem('token', data.token);
                localStorage.setItem('currentUser', JSON.stringify({ id: data.user.id, name: data.user.name, fullName: data.user.name, email: data.user.email, role: data.user.role || 'customer' }));

                if (rememberMe) {
                    localStorage.setItem('rememberedUser', email);
                } else {
                    localStorage.removeItem('rememberedUser');
                }

                showNotification(`¡Bienvenido/a ${data.user.name}!`);
                const target = (data.user.role === 'admin') ? 'admin-dashboard.html' : 'index.html';
                setTimeout(() => { window.location.href = target; }, 1000);
            } catch (err) {
                console.error('Login error:', err);
                showNotification('Error de conexión al iniciar sesión', 'error');
                if (loginBtn) {
                    loginBtn.disabled = false;
                    loginBtn.innerHTML = '<span><i class="fas fa-sign-in-alt"></i> Iniciar Sesión</span>';
                }
            }
        });

        // Modal de recuperación de contraseña
        document.getElementById('forgotPassword').addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('forgotModal').style.display = 'flex';
        });

        function closeForgotModal() {
            document.getElementById('forgotModal').style.display = 'none';
        }

        function sendResetLink() {
            const email = document.getElementById('resetEmail').value.trim();
            if (!email) {
                showNotification('Por favor ingresa tu email', 'error');
                return;
            }
            showNotification('Hemos enviado un enlace a tu correo electrónico', 'info');
            closeForgotModal();
        }

        // Cerrar modal al hacer clic fuera
        window.onclick = function(event) {
            const modal = document.getElementById('forgotModal');
            if (event.target === modal) {
                closeForgotModal();
            }
        };

        // Verificar si hay sesión activa al cargar la página
        document.addEventListener('DOMContentLoaded', function() {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            const token = localStorage.getItem('token');

            if (currentUser && token) {
                if (confirm(`Ya tienes una sesión activa como ${currentUser.fullName}. ¿Quieres continuar con esta sesión?`)) {
                    window.location.href = 'index.html';
                } else {
                    logout();
                }
            }

            // Autocompletar email si hay uno recordado
            const rememberedEmail = localStorage.getItem('rememberedUser');
            if (rememberedEmail) {
                document.getElementById('email').value = rememberedEmail;
                document.getElementById('rememberMe').checked = true;
            }
        });

        // Integración con Google Sign-In real si está disponible
        document.getElementById('googleLogin').addEventListener('click', function(e) {
            e.preventDefault();
            if (typeof window.loginWithGoogle === 'function') {
                window.loginWithGoogle();
                return;
            }
            showNotification('Google Sign-In no está disponible aún', 'info');
        });

        document.getElementById('facebookLogin').addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Redirigiendo a Facebook...', 'info');
        });

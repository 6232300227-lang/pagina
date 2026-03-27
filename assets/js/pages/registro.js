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

        // Función para actualizar la UI según el estado del usuario
        function updateUserInterface() {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            const topAccountLink = document.getElementById('topAccountLink');
            
            if (currentUser && topAccountLink) {
                const firstName = currentUser.fullName ? currentUser.fullName.split(' ')[0] : 'Usuario';
                topAccountLink.innerHTML = `<i class="fas fa-user-circle"></i> ${firstName}`;
                topAccountLink.href = 'usuarios.html';
            }
        }

        // Medidor de fortaleza de contraseña
        document.getElementById('password').addEventListener('input', function() {
            const password = this.value;
            const strengthBar = document.getElementById('strengthBar');
            const strengthText = document.getElementById('strengthText');
            
            let strength = 0;
            
            if (password.length >= 8) strength += 25;
            if (password.match(/[a-z]+/)) strength += 25;
            if (password.match(/[A-Z]+/)) strength += 25;
            if (password.match(/[0-9]+/)) strength += 25;
            if (password.match(/[$@#&!]+/)) strength += 25;
            
            strength = Math.min(strength, 100);
            strengthBar.style.width = strength + '%';
            
            if (strength < 30) {
                strengthBar.style.background = '#f44336';
                strengthText.textContent = 'Débil';
                strengthText.style.color = '#f44336';
            } else if (strength < 60) {
                strengthBar.style.background = '#ff9800';
                strengthText.textContent = 'Media';
                strengthText.style.color = '#ff9800';
            } else if (strength < 90) {
                strengthBar.style.background = '#2196F3';
                strengthText.textContent = 'Fuerte';
                strengthText.style.color = '#2196F3';
            } else {
                strengthBar.style.background = '#4CAF50';
                strengthText.textContent = 'Muy fuerte';
                strengthText.style.color = '#4CAF50';
            }
        });

        // Manejar el registro (envía al backend)
        document.getElementById('registerForm').addEventListener('submit', async function(e) {
            e.preventDefault();

            const fullName = document.getElementById('fullName').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const terms = document.getElementById('terms').checked;
            const registerBtn = document.getElementById('registerBtn') || document.getElementById('registerBtnPage');

            // Validaciones
            if (!fullName || !email || !password || !confirmPassword) {
                showNotification('Por favor completa todos los campos obligatorios', 'error');
                return;
            }

            if (password !== confirmPassword) {
                showNotification('Las contraseñas no coinciden', 'error');
                return;
            }

            if (password.length < 8) {
                showNotification('La contraseña debe tener al menos 8 caracteres', 'error');
                return;
            }

            if (!terms) {
                showNotification('Debes aceptar los términos y condiciones', 'error');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Por favor ingresa un email válido', 'error');
                return;
            }

            if (registerBtn) {
                registerBtn.disabled = true;
                registerBtn.innerHTML = '<span><i class="fas fa-spinner fa-spin"></i> Registrando...</span>';
            }

            try {
                const resp = await fetch(`${API_BASE}/api/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: fullName, email, password })
                });

                const data = await resp.json();
                if (!resp.ok) {
                    const msg = data && data.error ? data.error : 'Error al registrar';
                    showNotification(msg, 'error');
                    if (registerBtn) {
                        registerBtn.disabled = false;
                        registerBtn.innerHTML = '<span><i class="fas fa-user-check"></i> Crear Cuenta</span>';
                    }
                    return;
                }

                // Guardar token y usuario
                localStorage.setItem('token', data.token);
                localStorage.setItem('currentUser', JSON.stringify({ id: data.user.id, name: data.user.name, fullName: data.user.name, email: data.user.email, role: data.user.role || 'customer' }));

                showNotification(`¡Bienvenido/a ${data.user.name}! Registro exitoso.`);
                setTimeout(() => { window.location.href = 'index.html'; }, 1200);
            } catch (err) {
                console.error('Error registering:', err);
                showNotification('Error de conexión al registrar', 'error');
                if (registerBtn) {
                    registerBtn.disabled = false;
                    registerBtn.innerHTML = '<span><i class="fas fa-user-check"></i> Crear Cuenta</span>';
                }
            }
        });

        // Verificar si ya hay sesión iniciada
        document.addEventListener('DOMContentLoaded', function() {
            updateUserInterface();
            
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            const token = localStorage.getItem('token');
            
            if (currentUser && token) {
                if (confirm(`Ya tienes una sesión activa como ${currentUser.fullName}. ¿Quieres cerrar sesión para crear una nueva cuenta?`)) {
                    localStorage.removeItem('currentUser');
                    localStorage.removeItem('token');
                    updateUserInterface();
                } else {
                    window.location.href = 'index.html';
                }
            }
        });

        // Integración con Google Sign-In real si está disponible
        document.getElementById('googleRegister').addEventListener('click', function(e) {
            e.preventDefault();
            if (typeof window.loginWithGoogle === 'function') {
                window.loginWithGoogle();
                return;
            }
            showNotification('Google Sign-In no está disponible aún', 'info');
        });

        document.getElementById('facebookRegister').addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Redirigiendo a Facebook...', 'info');
        });


document.addEventListener("DOMContentLoaded", function () {
    // --- UI: Label animation for inputs and textareas ---
    document.querySelectorAll('.contenedor-formularios input, .contenedor-formularios textarea').forEach(function (input) {
        var label = input.previousElementSibling;
        function updateLabel(e) {
            if (e.type === "keyup") {
                if (input.value === "") {
                    label.classList.remove("active", "highlight");
                } else {
                    label.classList.add("active", "highlight");
                }
            } else if (e.type === "blur") {
                if (input.value === "") {
                    label.classList.remove("active", "highlight");
                } else {
                    label.classList.remove("highlight");
                }
            } else if (e.type === "focus") {
                if (input.value === "") {
                    label.classList.remove("highlight");
                } else if (input.value !== "") {
                    label.classList.add("highlight");
                }
            }
        }
        input.addEventListener("keyup", updateLabel);
        input.addEventListener("blur", updateLabel);
        input.addEventListener("focus", updateLabel);
    });

    // --- UI: Tab switching logic ---
    document.querySelectorAll(".tab a").forEach(function (tabLink) {
        tabLink.addEventListener("click", function (e) {
            e.preventDefault();
            var parentLi = tabLink.parentElement;
            var siblings = parentLi.parentElement.children;
            Array.prototype.forEach.call(siblings, function (li) {
                li.classList.remove("active");
            });
            parentLi.classList.add("active");
            var target = tabLink.getAttribute("href");
            document.querySelectorAll(".contenido-tab > div").forEach(function (div) {
                if ("#" + div.id === target) {
                    div.style.display = "block";
                    div.style.opacity = 0;
                    setTimeout(function () {
                        div.style.transition = "opacity 0.6s";
                        div.style.opacity = 1;
                    }, 10);
                } else {
                    div.style.display = "none";
                    div.style.opacity = 0;
                }
            });
        });
    });
    var firstTab = document.querySelector(".tab.active a");
    if (firstTab) {
        var event = new Event('click');
        firstTab.dispatchEvent(event);
    }

    // --- UI: Panel switching for alternate design (if present) ---
    const sign_in_btn = document.querySelector("#sign-in-btn");
    const sign_up_btn = document.querySelector("#sign-up-btn");
    const container = document.querySelector(".container");
    if (sign_up_btn && sign_in_btn && container) {
        sign_up_btn.addEventListener("click", () => {
            container.classList.add("sign-up-mode");
        });
        sign_in_btn.addEventListener("click", () => {
            container.classList.remove("sign-up-mode");
        });
    }

    // --- Password show/hide toggles ---
    const togglePasswordSignin = document.querySelector("#toggle-password-signin");
    const passwordInputSignin = document.querySelector("#sign-in-password");
    if (togglePasswordSignin && passwordInputSignin) {
        togglePasswordSignin.addEventListener("click", () => {
            const type = passwordInputSignin.getAttribute("type") === "password" ? "text" : "password";
            passwordInputSignin.setAttribute("type", type);
            togglePasswordSignin.innerHTML =
                type === "password" ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
    }
    const togglePasswordSignup = document.querySelector("#toggle-password-signup");
    const passwordInputSignup = document.querySelector("#sign-up-password");
    if (togglePasswordSignup && passwordInputSignup) {
        togglePasswordSignup.addEventListener("click", () => {
            const type = passwordInputSignup.getAttribute("type") === "password" ? "text" : "password";
            passwordInputSignup.setAttribute("type", type);
            togglePasswordSignup.innerHTML =
                type === "password" ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
    }

    // --- Password validation helper ---
    function validatePassword(password) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    }

    // --- API endpoints ---
    const REGISTRO_API_URL = "http://localhost:3000/api/Usuario";
    const LOGIN_API_URL = "http://localhost:3000/api/login";

    // --- Registro handler (API) ---
    
const formRegistro = document.getElementById("form-registrarse");
if (formRegistro) {
    formRegistro.addEventListener("submit", async function (e) {
        e.preventDefault();
        const nombre = formRegistro.querySelector('input[name="nombre"]').value;
        const usuario = formRegistro.querySelector('input[name="usuario"]').value;
        const email = formRegistro.querySelector('input[name="email"]').value;
        const password = formRegistro.querySelector('input[name="password"]').value;
        const repeat_password = formRegistro.querySelector('input[name="repeat_password"]').value;

        if (!nombre || !usuario || !email || !password || !repeat_password) {
            mostrarNotificacion("¡Error en registro!", "Todos los campos son obligatorios para el registro.");
            return;
        }
        if (password !== repeat_password) {
            mostrarNotificacion("¡Error en registro!", "Las contraseñas no coinciden.");
            return;
        }
        if (!validatePassword(password)) {
            mostrarNotificacion("¡Error en registro!", "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.");
            return;
        }
        try {
            const response = await fetch(REGISTRO_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre,
                    usuario,
                    email,
                    contraseña: password // así lo espera el backend
                }),
            });

            // Verifica si la respuesta es JSON
            const contentType = response.headers.get("content-type");
            if (!response.ok) {
                if (contentType && contentType.includes("application/json")) {
                    const error = await response.json();
                    throw new Error(error.error || "Error en el registro");
                } else {
                    const text = await response.text();
                    throw new Error("Respuesta inesperada del servidor: " + text.substring(0, 100) + "...");
                }
            }

            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                mostrarNotificacion("¡Registro exitoso!", "Tu cuenta ha sido creada correctamente.");
                formRegistro.reset();
            } else {
                mostrarNotificacion("¡Registro exitoso!", "Registro completado, pero la respuesta no fue JSON.");
                formRegistro.reset();
            }
        } catch (error) {
            mostrarNotificacion("¡Error en registro!", error.message);
        }
    });
}

    // --- Login handler (API) ---
    const formLogin = document.getElementById("form-iniciar-sesion");
    if (formLogin) {
        formLogin.addEventListener("submit", async function (e) {
            e.preventDefault();
            const usuario = formLogin.querySelector('input[name="usuario"]').value;
            const password = formLogin.querySelector('input[name="password"]').value;
            if (!usuario || !password) {
                mostrarNotificacion("¡Error en inicio de sesión!", "Usuario y contraseña son obligatorios.");
                return;
            }
            try {
                const response = await fetch(LOGIN_API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        usuario,
                        contraseña: password // así lo espera el backend
                    }),
                });
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || "Error en el inicio de sesión");
                }
                const data = await response.json();
            mostrarNotificacion("¡Inicio de sesión exitoso!", "Bienvenido/a.");
            formLogin.reset();
            // Redirige después de un pequeño delay para que el usuario vea la notificación
            setTimeout(() => {
                window.location.href = "cuenta.html";
            }, 1500);
        } catch (error) {
            mostrarNotificacion("¡Error en inicio de sesión!", "Error en el inicio de sesión: " + error.message);
        }
        });
    }


    // --- Local simulation: sign-in form (if present) ---
    const signInForm = document.querySelector("#sign-in-form");
    if (signInForm) {
        signInForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const username = document.querySelector("#sign-in-username").value.trim();
            const password = document.querySelector("#sign-in-password").value.trim();
            const user = registeredUsers.find(
                (user) => user.username === username && user.password === password
            );
            if (user) {
                localStorage.setItem("isLoggedIn", true);
                localStorage.setItem("userProfile", JSON.stringify(user));
                mostrarNotificacion("¡Inicio de sesión exitoso!", "Redirigiendo a tu cuenta...");
                setTimeout(() => {
                    window.location.href = "cuenta.html";
                }, 1500);
            } else {
                mostrarNotificacion("¡Error!", "Usuario o contraseña incorrectos. Por favor, regístrate.");
                if (sign_up_btn) sign_up_btn.click();
            }
        });
    }

    // --- Local simulation: sign-up form (if present) ---
    const signUpForm = document.querySelector("#sign-up-form");
    if (signUpForm) {
        signUpForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const username = document.querySelector("#sign-up-username").value.trim();
            const email = document.querySelector("#sign-up-email").value.trim();
            const password = document.querySelector("#sign-up-password").value.trim();
            if (!username || !email || !password) {
                mostrarNotificacion("¡Error en registro!", "Todos los campos son obligatorios para el registro.");
                return;
            }
            const isUserRegistered = registeredUsers.some(
                (user) => user.username === username || user.email === email
            );
            if (isUserRegistered) {
                mostrarNotificacion("¡Error en registro!", "El usuario o correo ya está registrado.");
                return;
            }
            if (!validatePassword(password)) {
                mostrarNotificacion("¡Error en registro!", "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.");
                return;
            }
            const newUser = { username, email, password };
            registeredUsers.push(newUser);
            localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
            mostrarNotificacion("¡Registro exitoso!", "Ahora puedes iniciar sesión.");
            if (sign_in_btn) sign_in_btn.click();
        });
    }

    // --- Modal de Notificación: Inicialización segura ---
    function mostrarNotificacion(titulo, mensaje) {
        const modal = document.getElementById('modal-notificacion');
        if (!modal) return;
        document.getElementById('modal-titulo').textContent = titulo;
        document.getElementById('modal-mensaje').textContent = mensaje;
        modal.style.display = 'flex';
    }
    function cerrarNotificacion() {
        const modal = document.getElementById('modal-notificacion');
        if (modal) modal.style.display = 'none';
    }

    // Cerrar al hacer click en la X
    const cerrarModalBtn = document.getElementById('cerrar-modal');
    if (cerrarModalBtn) {
        cerrarModalBtn.onclick = cerrarNotificacion;
    }

    // Cerrar al hacer click fuera del modal
    window.addEventListener("click", function(event) {
        const modal = document.getElementById('modal-notificacion');
        if (modal && event.target === modal) {
            cerrarNotificacion();
        }
    });

    // Puedes borrar este ejemplo en producción:
    // mostrarNotificacion('¡Error!', 'Usuario o contraseña incorrectos.');
});

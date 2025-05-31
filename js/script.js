document.addEventListener('DOMContentLoaded', () => {
    // --- Referencias a elementos del DOM ---
    const authContainer = document.getElementById('auth-container');
    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const linkRegister = document.getElementById('link-register');
    const linkLogin = document.getElementById('link-login');
    const dashboard = document.getElementById('dashboard');

    const navLinks = document.querySelectorAll('.main-nav ul li a');
    const contentSections = document.querySelectorAll('.content-section');
    const profileMenuToggle = document.getElementById('profile-menu-toggle');
    const profileDropdown = document.querySelector('.profile-dropdown');
    const logoutBtn = document.getElementById('logout-btn');
    const linkMyAccount = document.getElementById('link-my-account');

    const studyChatMessages = document.getElementById('study-chat-messages');
    const askStudyChatInput = document.getElementById('ask-study-chat-input');
    const mainChatInput = document.getElementById('main-chat-input');
    const sendFromMainChatBtn = document.querySelector('.send-from-main-chat');
    const sendStudyChatBtn = document.querySelector('#chat-de-estudio-section .send-chat-btn');
    const mathTutorInput = document.getElementById('math-tutor-input');
    const mathChatMessages = document.getElementById('math-chat-messages');
    const mathChatSendBtn = document.querySelector('.math-chat-send-btn');

    const essayTextInput = document.getElementById('essay-text-input');
    const gradeEssayBtn = document.getElementById('grade-essay-btn');
    const essayFeedbackDiv = document.getElementById('essay-feedback');
    const gradedPercentageSpan = document.getElementById('graded-percentage');
    const markerNotesContent = document.getElementById('marker-notes-content');
    const suggestionsList = document.getElementById('suggestions-list');

    const flashcardContentDiv = document.getElementById('current-flashcard');
    const prevFlashcardBtn = document.querySelector('.prev-flashcard');
    const nextFlashcardBtn = document.querySelector('.next-flashcard');
    const shuffleFlashcardsBtn = document.querySelector('.shuffle-flashcards');
    const flashcardCounterSpan = document.getElementById('flashcard-counter');

    // Elementos del perfil (Tu cuenta)
    const dropdownUsername = document.getElementById('dropdown-username');
    const dropdownEmail = document.getElementById('dropdown-email');
    const creditAnswers = document.getElementById('credit-answers');
    const creditChats = document.getElementById('credit-chats');
    const creditQuickChats = document.getElementById('credit-quick-chats');
    const accountNameInput = document.getElementById('account-name');
    const accountEmailInput = document.getElementById('account-email');
    const accountCountryInput = document.getElementById('account-country');
    const subscriptionStatusP = document.getElementById('subscription-status');
    const updateSubscriptionBtn = document.getElementById('update-subscription-btn');

    // Elemento del control de modo oscuro
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    // --- Simulación de Base de Datos (localStorage) ---
    const DB_KEY_USERS = 'studyBudiUsers';
    const DB_KEY_CURRENT_USER = 'studyBudiCurrentUser';
    const DB_KEY_THEME_MODE = 'studyBudiThemeMode';

    let users = JSON.parse(localStorage.getItem(DB_KEY_USERS)) || [];
    let currentUser = JSON.parse(localStorage.getItem(DB_KEY_CURRENT_USER));

    // Función para guardar todos los usuarios
    const saveUsers = () => {
        localStorage.setItem(DB_KEY_USERS, JSON.stringify(users));
    };

    // Función para guardar el usuario actual logueado
    const saveCurrentUser = (user) => {
        localStorage.setItem(DB_KEY_CURRENT_USER, JSON.stringify(user));
        currentUser = user; // Actualiza la variable global
        updateProfileDropdown(); // Actualiza la UI del perfil
        updateAccountPage(); // Actualiza la UI de la página de cuenta
    };

    // Función para limpiar la sesión del usuario actual
    const clearCurrentUser = () => {
        localStorage.removeItem(DB_KEY_CURRENT_USER);
        currentUser = null;
    };

    // --- Funciones de Interfaz de Usuario ---

    // Muestra la sección de login y oculta la de registro
    const showLoginSection = () => {
        registerSection.classList.remove('active');
        loginSection.classList.add('active');
    };

    // Muestra la sección de registro y oculta la de login
    const showRegisterSection = () => {
        loginSection.classList.remove('active');
        registerSection.classList.add('active');
    };

    // Muestra las páginas de autenticación y oculta el dashboard
    const showAuthPages = () => {
        authContainer.classList.remove('hidden');
        dashboard.classList.add('hidden');
    };

    // Muestra el dashboard y oculta las páginas de autenticación
    const showDashboard = () => {
        authContainer.classList.add('hidden');
        dashboard.classList.remove('hidden');
    };

    // Activa una sección de contenido en el dashboard
    const activateSection = (sectionId) => {
        // Eliminar 'active' de todas las secciones y añadir 'hidden'
        contentSections.forEach(section => {
            section.classList.remove('active');
            section.classList.add('hidden');
        });
        // Añadir 'active' a la sección deseada y quitar 'hidden'
        document.getElementById(sectionId).classList.remove('hidden');
        document.getElementById(sectionId).classList.add('active');

        // Actualizar la clase 'active-nav-link' en la navegación
        navLinks.forEach(link => {
            const linkSectionId = link.dataset.section + '-section';
            if (linkSectionId === sectionId) {
                link.classList.add('active-nav-link');
            } else {
                link.classList.remove('active-nav-link');
            }
        });
    };

    // Actualiza los datos del perfil en el menú desplegable
    const updateProfileDropdown = () => {
        if (currentUser) {
            dropdownUsername.textContent = currentUser.username;
            dropdownEmail.textContent = currentUser.email;
            creditAnswers.textContent = `${currentUser.credits.answers} Hoy`;
            creditChats.textContent = `${currentUser.credits.chats} Hoy`;
            creditQuickChats.textContent = currentUser.credits.quickChats;
        } else {
            // Valores por defecto si no hay usuario logueado (ej. para un estado inicial o después de cerrar sesión)
            dropdownUsername.textContent = 'Admin';
            dropdownEmail.textContent = 'Admin@gmail.com';
            creditAnswers.textContent = '6 Hoy';
            creditChats.textContent = '5 Hoy';
            creditQuickChats.textContent = 'ilimitados';
        }
    };

    // Actualiza los datos en la página "Tu cuenta"
    const updateAccountPage = () => {
        if (currentUser) {
            accountNameInput.value = currentUser.profile.name;
            accountEmailInput.value = currentUser.email;
            accountCountryInput.value = currentUser.profile.country;
            subscriptionStatusP.textContent = currentUser.profile.subscription;
        }
    };

    // Agrega un mensaje a la interfaz de chat especificada
    const addChatMessage = (chatContainerElement, message, sender) => {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', sender === 'user' ? 'user-message' : 'studyable-message');
        msgDiv.innerHTML = message;
        chatContainerElement.appendChild(msgDiv);
        chatContainerElement.scrollTop = chatContainerElement.scrollHeight; // Desplaza al final
        // Re-renderizar MathJax si hay ecuaciones en el mensaje (solo para math-chat-messages)
        if (typeof MathJax !== 'undefined' && chatContainerElement.id === 'math-chat-messages') {
             MathJax.typesetPromise([msgDiv]).catch((err) => console.error("MathJax render error:", err));
        }
    };

    // --- Funcionalidad del Modo Oscuro/Claro ---
    const applyTheme = (isDarkMode) => {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
        } else {
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
        }
        localStorage.setItem(DB_KEY_THEME_MODE, isDarkMode ? 'dark' : 'light');
    };

    const loadThemePreference = () => {
        const savedTheme = localStorage.getItem(DB_KEY_THEME_MODE);
        if (savedTheme === 'dark') {
            darkModeToggle.checked = true;
            applyTheme(true);
        } else {
            darkModeToggle.checked = false;
            applyTheme(false); // Por defecto o si es 'light'
        }
    };

    darkModeToggle.addEventListener('change', () => {
        applyTheme(darkModeToggle.checked);
    });

    // --- Lógica de Autenticación ---

    // Manejar el envío del formulario de Login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            alert('¡Inicio de sesión exitoso!');
            saveCurrentUser(user);
            showDashboard();
            activateSection('homepage-section'); // Muestra el inicio del dashboard
        } else {
            alert('Usuario o contraseña inválidos.');
        }
        loginForm.reset(); // Limpia los campos
    });

    // Manejar el envío del formulario de Registro
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-gmail').value;
        const password = document.getElementById('register-password').value;

        if (users.some(u => u.username === username || u.email === email)) {
            alert('El nombre de usuario o el correo electrónico ya existen.');
            return;
        }

        const newUser = {
            username,
            email,
            password,
            credits: { answers: 6, chats: 5, quickChats: 'ilimitados' }, // Valores iniciales según imagen
            profile: { name: username, country: 'Perú', subscription: 'No estás suscrito a Studyable Pro.' } // Valores iniciales según imagen
        };
        users.push(newUser);
        saveUsers();
        alert('¡Registro exitoso! Por favor, inicia sesión.');
        showLoginSection(); // Vuelve a la sección de login
        registerForm.reset(); // Limpia los campos
    });

    // Enlace para ir de login a registro
    linkRegister.addEventListener('click', (e) => {
        e.preventDefault();
        showRegisterSection();
    });

    // Enlace para ir de registro a login
    linkLogin.addEventListener('click', (e) => {
        e.preventDefault();
        showLoginSection();
    });

    // Simulación de "Iniciar sesión con Google"
    document.querySelector('.google-login').addEventListener('click', () => {
        alert('Simulando Inicio de Sesión con Google...');
        const googleUser = {
            username: 'UsuarioGoogle',
            email: 'google@example.com',
            password: 'dummygooglepassword', // Contraseña de relleno
            credits: { answers: 10, chats: 10, quickChats: 'ilimitados' },
            profile: { name: 'Usuario Google', country: 'EE. UU.', subscription: 'Suscrito a Studyable Pro.' }
        };
        // Verificar si el usuario ya existe por email (simulación)
        if (!users.some(u => u.email === googleUser.email)) {
            users.push(googleUser);
            saveUsers();
        }
        saveCurrentUser(googleUser);
        showDashboard();
        activateSection('homepage-section');
    });

    // Manejar cierre de sesión
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        clearCurrentUser();
        showAuthPages();
        showLoginSection(); // Vuelve al login
        alert('Has cerrado sesión.');
    });

    // --- Lógica del Dashboard y Navegación ---

    // Navegación principal del dashboard
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.dataset.section;
            if (sectionId) {
                activateSection(sectionId + '-section');
                // Cerrar el dropdown del perfil si está abierto
                profileDropdown.classList.remove('show');
            }
        });
    });

    // Navegación desde las tarjetas de características (Homepage)
    document.querySelectorAll('.feature-cards .card').forEach(card => {
        card.addEventListener('click', () => {
            const sectionId = card.dataset.section;
            if (sectionId) {
                activateSection(sectionId + '-section');
            }
        });
    });

    // Navegación desde el botón "Califica tu primer ensayo"
    document.querySelector('.add-essay-card').addEventListener('click', () => {
        activateSection('calificador-de-ensayos-section');
    });

    // Manejar el toggle de visibilidad de contraseña
    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', () => {
            const targetId = toggle.dataset.target;
            const passwordInput = document.getElementById(targetId);
            const icon = toggle.querySelector('i');
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            }
        });
    });

    // Toggle del menú de perfil
    profileMenuToggle.addEventListener('click', () => {
        profileDropdown.classList.toggle('show');
    });

    // Cerrar el menú de perfil al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!profileMenuToggle.contains(e.target) && !profileDropdown.contains(e.target) && e.target !== darkModeToggle) {
            profileDropdown.classList.remove('show');
        }
    });

    // Navegación a "Tu cuenta" desde el dropdown
    linkMyAccount.addEventListener('click', (e) => {
        e.preventDefault();
        activateSection('my-account-section');
        profileDropdown.classList.remove('show'); // Cierra el dropdown
        updateAccountPage(); // Asegura que los datos estén actualizados al ir a la página
    });

    // Simulación del botón "Actualizar suscripción"
    updateSubscriptionBtn.addEventListener('click', () => {
        if (currentUser) {
            if (currentUser.profile.subscription.includes('No estás suscrito')) {
                currentUser.profile.subscription = 'Suscrito a Studyable Pro.';
                alert('¡Has actualizado tu suscripción a Pro!');
            } else {
                currentUser.profile.subscription = 'No estás suscrito a Studyable Pro.';
                alert('Tu suscripción Pro ha sido cancelada (simulación).');
            }
            saveUsers(); // Guardar cambios en la lista de usuarios
            saveCurrentUser(currentUser); // Actualizar el usuario actual guardado y la UI
        }
    });


    // --- Funcionalidad de Chats (Estudio y Matemáticas) ---

    // Función genérica para manejar el envío de mensajes y respuestas simuladas
    const handleChatSend = (inputElement, chatDisplayElement, type) => {
        const userQuestion = inputElement.value.trim();
        if (userQuestion) {
            addChatMessage(chatDisplayElement, userQuestion, 'user');
            inputElement.value = '';

            // Simular respuesta de la IA
            setTimeout(() => {
                let aiResponse = "Lo siento, no tengo suficiente información para responder a esa pregunta.";

                if (type === 'study') {
                    if (userQuestion.toLowerCase().includes('newton')) {
                        aiResponse = "La tercera ley de Newton establece que para cada acción, hay una reacción igual y opuesta.";
                    } else if (userQuestion.toLowerCase().includes('capital de francia')) {
                        aiResponse = "La capital de Francia es París.";
                    } else if (userQuestion.toLowerCase().includes('calentamiento global')) {
                        aiResponse = "El calentamiento global es el aumento a largo plazo de la temperatura promedio de la Tierra debido a la acumulación de gases de efecto invernadero en la atmósfera.";
                    } else if (userQuestion.toLowerCase().includes('tq')) {
                        aiResponse = "'TQ' es una abreviatura popular en español que significa 'Te Quiero'. Se usa comúnmente en mensajes de texto y redes sociales para expresar afecto."
                    }
                } else if (type === 'math') {
                    if (userQuestion.toLowerCase().includes('pitagoras') || userQuestion.toLowerCase().includes('teorema de pitagoras') || userQuestion.toLowerCase().includes('cuerda')) {
                        aiResponse = `Para resolver este problema, podemos usar el teorema de Pitágoras. La cuerda forma la hipotenusa de un triángulo rectángulo donde la diferencia en las alturas de los dos mástiles forma una pata, y la distancia entre los mástiles forma la otra pata.
                                <p>• <b>Identifica las longitudes de las patas del triángulo rectángulo:</b></p>
                                <ul>
                                    <li>La pata vertical es la diferencia de altura entre los dos mástiles: $29 \, m - 9 \, m = 20 \, m$.</li>
                                    <li>La pata horizontal es la distancia entre las bases de los dos mástiles: $15 \, m$.</li>
                                </ul>
                                <p>• <b>Aplica el teorema de Pitágoras:</b></p>
                                <ul>
                                    <li>El teorema de Pitágoras establece que $a^2 + b^2 = c^2$, donde $c$ es la longitud de la hipotenusa, y $a$ y $b$ son las longitudes de los otros dos lados.</li>
                                    <li>Aquí, $a = 15 \, m$ y $b = 20 \, m$.</li>
                                </ul>
                                <p>Calculemos la longitud de la cuerda ($c$).</p>
                                $$c = \\sqrt{a^2 + b^2} = \\sqrt{(15 \, m)^2 + (20 \, m)^2}$$
                                $$c = \\sqrt{225 + 400} = \\sqrt{625} = 25 \, m$$
                                <p>Por lo tanto, la longitud de la cuerda es $25 \, m$.</p>`;
                    } else if (userQuestion.toLowerCase().includes('2+2')) {
                        aiResponse = "2 + 2 es igual a 4. ¡Matemáticas básicas!";
                    }
                }
                addChatMessage(chatDisplayElement, aiResponse, 'studyable');
            }, 1000);
        }
    };

    // Event listeners para los botones de enviar chat
    sendStudyChatBtn.addEventListener('click', () => {
        handleChatSend(askStudyChatInput, studyChatMessages, 'study');
    });

    sendFromMainChatBtn.addEventListener('click', () => {
        const userQuestion = mainChatInput.value.trim();
        if (userQuestion) {
            activateSection('chat-de-estudio-section'); // Navega a la sección de chat
            addChatMessage(studyChatMessages, userQuestion, 'user'); // Agrega la pregunta al chat de estudio
            mainChatInput.value = ''; // Limpia el input principal

            // Simular respuesta de la IA en el chat de estudio
            setTimeout(() => {
                const aiResponse = "Gracias por tu pregunta. Estoy procesando esto...";
                addChatMessage(studyChatMessages, aiResponse, 'studyable');
            }, 1000);
        }
    });

    mathChatSendBtn.addEventListener('click', () => {
        handleChatSend(mathTutorInput, mathChatMessages, 'math');
    });


    // Permitir enviar con la tecla Enter
    askStudyChatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendStudyChatBtn.click();
        }
    });

    mainChatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendFromMainChatBtn.click();
        }
    });

    mathTutorInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            mathChatSendBtn.click();
        }
    });


    // --- Simulación del Calificador de Ensayos ---
    gradeEssayBtn.addEventListener('click', () => {
        const essayText = essayTextInput.value.trim();
        if (essayText.length < 50) {
            alert('Por favor, escribe un ensayo más largo (mínimo 50 caracteres) para calificar.');
            essayFeedbackDiv.classList.add('hidden');
            return;
        }

        const grade = Math.floor(Math.random() * (95 - 60 + 1)) + 60; // Generar un grado aleatorio entre 60 y 95
        gradedPercentageSpan.textContent = `${grade}%`;

        let notes = "El ensayo demuestra una comprensión profunda de la información, el tema y la tesis. La evidencia es sólida y bien desarrollada. La estructura es clara y coherente. El tono es académico, la puntuación y la gramática son impecables.";
        const suggestions = [];

        if (grade < 75) {
            notes = "El ensayo necesita más desarrollo en ciertos puntos. La claridad y la coherencia podrían mejorarse. Hay algunos errores gramaticales y de puntuación. Considera revisar la estructura de tus argumentos.";
            suggestions.push("Asegúrate de que tus puntos de apoyo sean claros y estén bien desarrollados.");
            suggestions.push("Considera usar más ejemplos específicos para respaldar tus afirmaciones.");
            suggestions.push("Revisa la coherencia entre tus párrafos para una mejor fluidez.");
        } else if (grade < 85) {
            notes = "Un ensayo bien estructurado con argumentos sólidos. Sin embargo, hay espacio para mejorar la profundidad del análisis y la originalidad de las ideas.";
            suggestions.push("Explora más a fondo las implicaciones de tus argumentos.");
            suggestions.push("Intenta conectar tus ideas de maneras más complejas.");
        }

        if (essayText.split(' ').length < 200) { // Ejemplo de sugerencia basada en longitud
            suggestions.push("Tu ensayo es un poco corto. Considera expandir tus ideas con más detalles o ejemplos.");
        }
        if (!essayText.includes('.')) { // Ejemplo de sugerencia de puntuación muy básica
            suggestions.push("Revisa la puntuación, especialmente el uso de puntos al final de las oraciones.");
        }

        markerNotesContent.textContent = notes;
        suggestionsList.innerHTML = '';
        if (suggestions.length === 0) {
            suggestionsList.innerHTML = '<li>¡Excelente trabajo! No hay sugerencias importantes en este momento.</li>';
        } else {
            suggestions.forEach(sug => {
                const li = document.createElement('li');
                li.textContent = sug;
                suggestionsList.appendChild(li);
            });
        }

        essayFeedbackDiv.classList.remove('hidden');
    });

    // --- Simulación de Tarjetas Didácticas (Flashcards) ---
    const flashcardsData = [
        { term: "influence of volume, variety, variation in demand and visibility", definition: "Estas son las 4 'V' en la gestión de operaciones, que impactan la elección del proceso." },
        { term: "Fotosíntesis", definition: "Proceso por el cual las plantas convierten la luz solar en energía química, utilizando dióxido de carbono y agua." },
        { term: "Átomo", definition: "La unidad más pequeña de materia que conserva la identidad de un elemento químico, compuesto por un núcleo y electrones." },
        { term: "Ecuación cuadrática", definition: "Una ecuación polinómica de segundo grado, en la forma $ax^2 + bx + c = 0$, donde $x$ es la variable y $a, b, c$ son constantes con $a \\neq 0$." },
        { term: "Right Atrium", definition: "The chamber of the heart that receives deoxygenated blood from the body before pumping it to the right ventricle." },
        { term: "Capital de Francia", definition: "París, conocida por su arte, moda, gastronomía y cultura." },
        { term: "Teorema de Pitágoras", definition: "En un triángulo rectángulo, el cuadrado de la longitud de la hipotenusa (el lado opuesto al ángulo recto) es igual a la suma de los cuadrados de las longitudes de los otros dos lados: $a^2 + b^2 = c^2$." }
    ];
    let currentFlashcardIndex = 0;

    const displayFlashcard = () => {
        if (flashcardsData.length === 0) {
            flashcardContentDiv.innerHTML = "No hay tarjetas didácticas disponibles.";
            flashcardCounterSpan.textContent = "0 / 0";
            return;
        }
        // Usar innerHTML para permitir renderizar LaTeX si MathJax está activo
        flashcardContentDiv.innerHTML = flashcardsData[currentFlashcardIndex].term;
        flashcardCounterSpan.textContent = `${currentFlashcardIndex + 1} / ${flashcardsData.length}`;
        // Si MathJax está presente, re-renderizar
        if (typeof MathJax !== 'undefined') {
            MathJax.typesetPromise([flashcardContentDiv]).catch((err) => console.error("MathJax render error:", err));
        }
    };

    flashcardContentDiv.addEventListener('click', () => {
        // Alternar entre término y definición
        if (flashcardContentDiv.textContent.trim() === flashcardsData[currentFlashcardIndex].term.trim()) {
            flashcardContentDiv.innerHTML = flashcardsData[currentFlashcardIndex].definition;
        } else {
            flashcardContentDiv.innerHTML = flashcardsData[currentFlashcardIndex].term;
        }
        // Si MathJax está presente, re-renderizar
        if (typeof MathJax !== 'undefined') {
            MathJax.typesetPromise([flashcardContentDiv]).catch((err) => console.error("MathJax render error:", err));
        }
    });

    prevFlashcardBtn.addEventListener('click', () => {
        currentFlashcardIndex = (currentFlashcardIndex - 1 + flashcardsData.length) % flashcardsData.length;
        displayFlashcard();
    });

    nextFlashcardBtn.addEventListener('click', () => {
        currentFlashcardIndex = (currentFlashcardIndex + 1) % flashcardsData.length;
        displayFlashcard();
    });

    shuffleFlashcardsBtn.addEventListener('click', () => {
        // Fisher-Yates shuffle
        for (let i = flashcardsData.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [flashcardsData[i], flashcardsData[j]] = [flashcardsData[j], flashcardsData[i]];
        }
        currentFlashcardIndex = 0;
        displayFlashcard();
    });

    // --- Lógica de Inicialización de la Aplicación ---
    const initApp = () => {
        loadThemePreference(); // Cargar la preferencia de tema primero
        if (currentUser) {
            showDashboard();
            activateSection('homepage-section'); // Muestra la sección de inicio por defecto
            updateProfileDropdown();
            updateAccountPage();
        } else {
            showAuthPages();
            showLoginSection(); // Muestra el login por defecto
        }
        displayFlashcard(); // Inicializa la primera tarjeta didáctica
    };

    // Ejecuta la inicialización de la aplicación al cargar el DOM
    initApp();
});
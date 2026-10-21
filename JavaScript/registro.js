/* ---------- Progreso por estudiante (intercambio al entrar y salir) ---------- */
const CLAVES_PROGRESO = [
    // Astral Travel
    "engligo-astral-travel-nivel-desbloqueado",
    "engligo-astral-travel-progreso",
    // Vocabulario
    "engligo-vocab-saludos",
    "engligo-vocab-objetos",
    "engligo-vocab-animales",
    "engligo-vocab-colores",
    "engligo-vocab-cuerpo",
    // Juegos
    "engligo-juego-meteor",
    "engligo-juego-words",
    "engligo-juego-wordsearch"
];

// Guarda el progreso actual en el "cajón" del estudiante que está dentro
function guardarProgresoDeEstudianteActual() {
    const actual = localStorage.getItem("registeredEmail");
    if (!actual) return;
    const paquete = {};
    CLAVES_PROGRESO.forEach(k => paquete[k] = localStorage.getItem(k));
    localStorage.setItem("engligo-progreso::" + actual, JSON.stringify(paquete));
}

// Carga el progreso guardado de un estudiante (o lo deja en cero si es nuevo)
function cargarProgresoDeEstudiante(email) {
    let paquete = {};
    try {
        paquete = JSON.parse(localStorage.getItem("engligo-progreso::" + email)) || {};
    } catch (e) { paquete = {}; }
    CLAVES_PROGRESO.forEach(k => {
        if (paquete[k] != null) localStorage.setItem(k, paquete[k]);
        else localStorage.removeItem(k);
    });
}

/* ---------- Lista de estudiantes (varias cuentas en el mismo equipo) ---------- */
const CLAVE_ESTUDIANTES = "engligo-estudiantes";

function leerEstudiantes() {
    try {
        return JSON.parse(localStorage.getItem(CLAVE_ESTUDIANTES)) || {};
    } catch (e) {
        return {};
    }
}

function guardarEstudiantes(lista) {
    localStorage.setItem(CLAVE_ESTUDIANTES, JSON.stringify(lista));
}

// Hash sencillo para no guardar la contraseña escrita tal cual.
// OJO: sirve para el proyecto, pero NO es seguridad real.
function hashSimple(texto) {
    let h = 5381;
    for (const c of texto) {
        h = ((h << 5) + h + c.charCodeAt(0)) | 0;
    }
    return String(h);
}

/* ---------- Registro ---------- */
function handleRegister(event) {
    event.preventDefault();

    const nameInput = document.getElementById("reg-name");
    const emailInput = document.getElementById("reg-email");
    const passwordInput = document.getElementById("reg-password");
    const confirmPasswordInput = document.getElementById("confirm-password");

    const name = nameInput ? nameInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim().toLowerCase() : "";
    const password = passwordInput ? passwordInput.value : "";
    const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : "";

    if (!name || !email || !password || !confirmPassword) {
        showToast("Por favor completa todos los campos del formulario.", "error");
        return;
    }

    if (password.length < 6) {
        showToast("La contraseña debe tener al menos 6 caracteres.", "error");
        if (passwordInput) passwordInput.focus();
        return;
    }

    if (password !== confirmPassword) {
        showToast("Las contraseñas no coinciden.", "error");
        if (confirmPasswordInput) confirmPasswordInput.focus();
        return;
    }

    const estudiantes = leerEstudiantes();

    if (estudiantes[email]) {
        showToast("Ese correo ya está registrado. Inicia sesión.", "error");
        return;
    }

    estudiantes[email] = { name: name, password: hashSimple(password) };
    guardarEstudiantes(estudiantes);

    showToast("¡Cuenta creada con éxito! Redirigiendo al inicio de sesión...", "success");

    setTimeout(() => {
        window.location.href = "login.html";
    }, 1500);
}

/* ---------- Inicio de sesión ---------- */
function handleLogin(event) {
    event.preventDefault();

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    const estudiantes = leerEstudiantes();

    if (Object.keys(estudiantes).length === 0) {
        showToast("Primero debes crear una cuenta.", "error");

        setTimeout(() => {
            window.location.href = "register.html";
        }, 1500);
        return;
    }

    const estudiante = estudiantes[email];

    if (!estudiante) {
        showToast("El correo electrónico no está registrado.", "error");
        emailInput.focus();
        return;
    }

    if (!password) {
        showToast("Por favor escribe tu contraseña.", "error");
        passwordInput.focus();
        return;
    }

    if (estudiante.password !== hashSimple(password)) {
        showToast("Contraseña incorrecta.", "error");
        passwordInput.focus();
        return;
    }

    // Guarda el progreso de quien estaba dentro y carga el de este estudiante
    guardarProgresoDeEstudianteActual();
    localStorage.setItem("registeredUser", estudiante.name);
    localStorage.setItem("registeredEmail", email);
    cargarProgresoDeEstudiante(email);

    showToast(`¡Bienvenido, ${estudiante.name}!`, "success");

    setTimeout(() => {
        window.location.href = "index.html";
    }, 1000);
}

function showRegisteredUser() {
    const registeredUser = localStorage.getItem("registeredUser");

    const registerButton = document.getElementById("register-button");
    const registeredUserElement = document.getElementById("registered-user");

    if (!registerButton || !registeredUserElement) return;

    if (registeredUser) {
        registerButton.style.display = "none";

        registeredUserElement.textContent = `Usuario: ${registeredUser}`;
        registeredUserElement.style.display = "inline-block";
    } else {
        registerButton.style.display = "inline-block";

        registeredUserElement.style.display = "none";
    }
}

function showToast(message, type = "info") {
    let toast = document.getElementById("toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        toast.innerHTML = `
            <span id="toast-icon"></span>
            <span id="toast-message"></span>
        `;
        document.body.appendChild(toast);
    }

    const toastMessage = document.getElementById("toast-message");
    const toastIcon = document.getElementById("toast-icon");

    const colors = {
        success: "#10b981",
        error: "#ef4444",
        info: "#0f172a"
    };

    const icons = {
        success: "✓",
        error: "⚠",
        info: "i"
    };

    toast.style.position = "fixed";
    toast.style.right = "20px";
    toast.style.bottom = "20px";
    toast.style.background = colors[type] || colors.info;
    toast.style.color = "white";
    toast.style.padding = "14px 20px";
    toast.style.borderRadius = "10px";
    toast.style.boxShadow = "0 10px 25px rgba(0,0,0,0.3)";
    toast.style.zIndex = "9999";
    toast.style.display = "flex";
    toast.style.gap = "10px";
    toast.style.fontFamily = "Arial, sans-serif";
    toast.style.fontSize = "0.95rem";

    toastMessage.textContent = message;
    toastIcon.textContent = icons[type] || icons.info;

    setTimeout(() => {
        toast.style.display = "none";
    }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
    showRegisteredUser();
});

const API_URL = window.location.hostname.includes("localhost")
    ? "http://localhost:4000"
    : "https://formbacknew.vercel.app/";

document.addEventListener("DOMContentLoaded", () => {
    // Referencias a elementos del DOM
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");
    const logoutButton = document.getElementById("logoutButton");
    const authButton = document.getElementById("authButton");

    // Evento para el registro
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("email").value;
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch(`${API_URL}/register`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, username, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    alert(data.message); // Mensaje del servidor
                    window.location.href = "TuCuenta.html"; // Redirigir a la página de cuenta
                } else {
                    alert(`Error: ${data.message}`); // Mostrar error del servidor
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Ocurrió un error. Por favor, inténtalo de nuevo.");
            }
        });
    }

    // Evento para el inicio de sesión
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("loginEmail").value;
            const password = document.getElementById("loginPassword").value;
            
            try {
                const response = await fetch(`${API_URL}/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    alert(data.message); // Mensaje de inicio de sesión exitoso
                    localStorage.setItem("token", data.token); // Guardar el token en localStorage
                    localStorage.setItem("username", data.username); // Guardar el nombre de usuario
                    updateAuthUI(); // Actualizar la interfaz
                    window.location.href = "TuCuenta.html"; // Redirigir
                } else {
                    alert(`Error: ${data.message}`); // Mostrar error del servidor
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Ocurrió un error. Por favor, inténtalo de nuevo.");
            }
        });
    }

    // Evento para el cierre de sesión
    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            localStorage.removeItem("token"); // Eliminar el token
            localStorage.removeItem("username"); // Eliminar el nombre de usuario
            alert("Sesión cerrada exitosamente.");
            updateAuthUI(); // Actualizar la interfaz
            window.location.href = "index"; // Redirigir a la página principal
        });
    }

    // Actualizar la interfaz al cargar la página
    updateAuthUI();
});

// Función para actualizar la interfaz de usuario según el estado de autenticación
function updateAuthUI() {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    const authButton = document.getElementById("authButton");
    const logoutButton = document.getElementById("logoutButton");
    const welcomeText = document.getElementById("welcomeText");

    if (token) {
        if (authButton) authButton.style.display = "none"; // Ocultar botón de "Acceder"
        if (logoutButton) logoutButton.style.display = "block"; // Mostrar botón de "Cerrar sesión"
        if (welcomeText) welcomeText.textContent = `Bienvenido, ${username}!`; // Mostrar mensaje de bienvenida
    } else {
        if (authButton) authButton.style.display = "block"; // Mostrar botón de "Acceder"
        if (logoutButton) logoutButton.style.display = "none"; // Ocultar botón de "Cerrar sesión"
        if (welcomeText) welcomeText.textContent = ""; // Limpiar mensaje de bienvenida
    }
}
document.addEventListener("DOMContentLoaded", () => {
    handleRouting();
    window.addEventListener("popstate", handleRouting);
});

function handleRouting() {
    const path = window.location.pathname.replace("/", "") || "index";
    loadPage(path);
}

function loadPage(page) {
    fetch(`${page}.html`)
        .then(response => {
            if (!response.ok) throw new Error("Página no encontrada");
            return response.text();
        })
        .then(html => {
            document.getElementById("content").innerHTML = html;
        })
        .catch(error => {
            document.getElementById("content").innerHTML = "<h2>Error 404: Página no encontrada</h2>";
        });
}

document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", event => {
        event.preventDefault();
        const page = event.target.getAttribute("href").replace(".html", "");
        history.pushState({}, "", `/${page}`);
        loadPage(page);
    });
});

const API_URL = window.location.hostname.includes("localhost")
    ? "http://localhost:4000"
    : "https://mentestranquilas.vercel.app/"; // Cambia esto por la URL real de tu backend

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
            window.location.href = "index.html"; // Redirigir a la página principal
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

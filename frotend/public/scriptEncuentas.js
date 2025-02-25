document.addEventListener("DOMContentLoaded", async () => {
    const yesButton = document.getElementById("yes-button");
    const noButton = document.getElementById("no-button");
    const form = document.getElementById("poll-form");
    const username = localStorage.getItem("username"); // Obtener usuario logueado

    if (!username) {
        alert("Debes iniciar sesión para votar.");
        return;
    }

    // Verificar si el usuario ya ha votado
    try {
        const response = await fetch(`/verificarRespuesta?username=${username}`);
        const data = await response.json();

        if (data.respuesta) {
            // Deshabilitar botones si el usuario ya ha votado
            yesButton.disabled = true;
            noButton.disabled = true;
        }
    } catch (error) {
        console.error("Error al verificar la respuesta:", error);
    }

    form.addEventListener("click", async (event) => {
        if (event.target.tagName !== "BUTTON") return; // Evitar clicks fuera de los botones

        const respuesta = event.target.textContent.trim();
        const token = localStorage.getItem("authToken");

        try {
            const response = await fetch("${API_URL}/guardarRespuesta", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ username, respuesta }),
            });

            if (response.ok) {
                alert("Tu respuesta ha sido guardada.");
                yesButton.disabled = true;
                noButton.disabled = true;
            } else {
                const error = await response.json();
                alert("Error: " + error.error);
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            alert("Hubo un problema al enviar los datos.");
        }
    });
});

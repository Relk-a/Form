document.querySelector('.poll-form').addEventListener('click', async (event) => {
    const respuesta = event.target.textContent.trim(); // Obtiene "SI" o "NO"

    try {
        const token = localStorage.getItem('authToken'); // Token almacenado al iniciar sesión
        const response = await fetch('/guardarRespuesta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Enviar el token al backend
            },
            body: JSON.stringify({ respuesta }),
        });

        if (response.ok) {
            alert('Tu respuesta ha sido guardada.');
        } else {
            const error = await response.json();
            alert('Error: ' + error.error);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Hubo un problema al enviar los datos.');
    }
});

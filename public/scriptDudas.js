const form = document.querySelector('.dudas-form');
form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita que se recargue la página

    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();

    if (!nombre || !apellido || !correo || !mensaje) {
        alert('Por favor completa todos los campos.');
        return;
    }

    const data = { nombre, apellido, correo, mensaje };

    try {
        const response = await fetch('/dudas/guardar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            alert('Tu duda ha sido enviada exitosamente.');
            form.reset();
        } else {
            const error = await response.json();
            console.error('Error del servidor:', error);
            alert('Error al enviar los datos: ' + error.error);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Hubo un problema al enviar los datos. Revisa la consola para más detalles.');
    }
});

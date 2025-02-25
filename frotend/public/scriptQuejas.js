const form = document.querySelector('.quejas-sugerencias-form');
form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita que se recargue la página

    const nombre = document.getElementById('nombre').value;
    const correo = document.getElementById('correo').value;
    const mensaje = document.getElementById('mensaje').value;
    const opciones = Array.from(document.querySelectorAll('input[name="opciones"]:checked'))
                          .map(opcion => opcion.value);

    if (opciones.length === 0) {
        alert('Por favor selecciona al menos una opción (Queja o Sugerencia).');
        return;
    }
//Cambiar el fetch del local a el link de produccion
    const data = { nombre, correo, mensaje, opciones };

        try {
            const response = await fetch('${API_URL}/quejasSugerencias/guardar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

        if (response.ok) {
            alert('Queja o sugerencia enviada exitosamente.');
            form.reset();
        } else {
            throw new Error('Error al enviar los datos.');
        }
    } catch (error) {
        console.error(error);
        alert('Hubo un problema al enviar los datos.');
    }
});
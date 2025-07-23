async function convertPoints() {
  const pointsInput = document.getElementById('pointsInput');
  const points = parseInt(pointsInput.value);
  const token = (localStorage.getItem('token') || '').trim();

  if (isNaN(points) || points < 100 || points % 100 !== 0) {
    alert('Por favor, introduce un número válido (mínimo 100 y múltiplo de 100).');
    return;
  }

  try {
    const response = await fetch('https://albertaapi.onrender.com/api/convert/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + token,
      },
      body: JSON.stringify({ points })
    });

    const contentType = response.headers.get('Content-Type');

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      alert(`¡Conversión exitosa!\nMonedas ganadas: ${data.coins_earned}\nPuntos restantes: ${data.remaining_score}`);
    } else {
      const text = await response.text();
      alert('Respuesta inesperada del servidor:\n' + text);
    }

  } catch (error) {
    console.error('Error al convertir puntos:', error);
    alert('No se pudo realizar la conversión. Intenta más tarde.');
  }
}

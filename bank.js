async function convertPoints() {
  const pointsInput = document.getElementById('pointsInput');
  const feedback = document.getElementById('feedback');
  const spinner = document.getElementById('spinner');
  const points = parseInt(pointsInput.value);
  const token = (localStorage.getItem('token') || '').trim();

  feedback.innerHTML = '';

  if (!token) {
    feedback.innerHTML = `<div class="alert alert-warning">Debes iniciar sesión para convertir puntos.</div>`;
    return;
  }

  if (isNaN(points) || points < 100 || points % 100 !== 0) {
    feedback.innerHTML = `<div class="alert alert-danger">Por favor, introduce un número válido (mínimo 100 y múltiplo de 100).</div>`;
    return;
  }

  spinner.style.display = 'block';

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
    spinner.style.display = 'none';

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Error ${response.status}`);
    }

    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      feedback.innerHTML = `
        <div class="alert alert-success">
          <strong>¡Conversión exitosa!</strong><br>
          Monedas ganadas: <strong>${data.coins_earned}</strong><br>
          Puntos restantes: <strong>${data.remaining_score}</strong>
        </div>
      `;
      pointsInput.value = '';
    } else {
      const text = await response.text();
      feedback.innerHTML = `<div class="alert alert-warning">Respuesta inesperada:\n${text}</div>`;
    }

  } catch (error) {
  spinner.style.display = 'none';

  // Intenta parsear error JSON si es posible
  let errorMsg = 'No se pudo realizar la conversión. Intenta más tarde.';

  try {
    const parsed = JSON.parse(error.message);
    if (parsed.error) {
      errorMsg = parsed.error;
    }
  } catch (_) {
    // no es JSON, se deja el mensaje genérico
  }

  feedback.innerHTML = `<div class="alert alert-danger">${errorMsg}</div>`;
}
}

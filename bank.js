async function convertPoints() {
  const points = parseInt(document.getElementById('pointsInput').value);

  const response = await fetch('http://localhost:8000/api/convert/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    },
    body: JSON.stringify({ points })
  });

  const data = await response.json();

  if (response.ok) {
    alert(`Has convertido ${data.points_spent} puntos y recibido ${data.coins_earned} monedas.\nTe quedan ${data.remaining_score} puntos.`);
  } else {
    alert(data.error);
  }
}

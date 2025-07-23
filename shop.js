async function fetchShopItems() {
  const token = (localStorage.getItem('token') || '').trim();

  try {
    const response = await fetch('https://albertaapi.onrender.com/minigames/shop/', {
      headers: {
        'Authorization': 'Token ' + token,
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const contentType = response.headers.get('Content-Type');

    if (contentType && contentType.includes('application/json')) {
      const items = await response.json();
      const container = document.getElementById('shop');
      container.innerHTML = '';

      items.forEach(item => {
        const div = document.createElement('div');
        div.innerHTML = `
          <h3>${item.name}</h3>
          <p>Precio: ${item.price} monedas</p>
          <img src="assets/img/${item.image_name}" width="100" />
          <button onclick="buyItem(${item.id})">Comprar</button>
          <hr>
        `;
        container.appendChild(div);
      });
    } else {
      const text = await response.text();
      alert('Respuesta inesperada del servidor:\n' + text);
    }
  } catch (error) {
    console.error('Error al obtener los items de la tienda:', error);
    alert('No se pudo cargar la tienda. Intenta más tarde.');
  }
}

async function buyItem(itemId) {
  const token = (localStorage.getItem('token') || '').trim();

  try {
    const response = await fetch('https://albertaapi.onrender.com/minigames/buy/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + token,
      },
      body: JSON.stringify({ item_id: itemId })
    });

    const contentType = response.headers.get('Content-Type');

    if (!response.ok) {
      // Intentamos obtener el mensaje de error
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error desconocido al comprar.');
      } else {
        const errorText = await response.text();
        throw new Error(errorText || 'Error desconocido al comprar.');
      }
    }

    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      alert(`¡Compra exitosa! Compraste: ${data.item}`);
    } else {
      const text = await response.text();
      alert('Respuesta inesperada del servidor:\n' + text);
    }

    // Refrescamos la tienda para actualizar la información
    fetchShopItems();

  } catch (error) {
    console.error('Error al comprar el item:', error);
    alert('No se pudo completar la compra. Intenta más tarde.');
  }
}

// Inicializamos la carga de items en la tienda
fetchShopItems();

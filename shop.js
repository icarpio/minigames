async function fetchShopItems() {
  const token = (localStorage.getItem('token') || '').trim();
  const shop = document.getElementById('shop');
  const loading = document.getElementById('loading');

  if (!token) {
    alert('No estás autenticado. Por favor, inicia sesión.');
    return;
  }

  try {
    const response = await fetch('https://albertaapi.onrender.com/api/minigames/shop/', {
      headers: {
        'Authorization': 'Token ' + token,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Respuesta no válida del servidor:', errorText);
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const contentType = response.headers.get('Content-Type');
    loading.style.display = 'none';
    shop.innerHTML = '';

    if (contentType && contentType.includes('application/json')) {
      const items = await response.json();

      if (items.length === 0) {
        shop.innerHTML = '<div class="alert alert-warning text-center">No hay productos disponibles en la tienda.</div>';
        return;
      }

      items.forEach(item => {
        const col = document.createElement('div');
        col.className = 'col-md-4';

        col.innerHTML = `
          <div class="card h-100 shadow-sm">
            <img src="assets/img/${item.image_name}" class="card-img-top" alt="${item.name}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${item.name}</h5>
              <p class="card-text">Precio: <strong>${item.price}</strong> monedas</p>
              <button class="btn btn-success mt-auto" onclick="buyItem(${item.id})">Comprar</button>
            </div>
          </div>
        `;

        shop.appendChild(col);
      });
    } else {
      const text = await response.text();
      alert('Respuesta inesperada del servidor:\n' + text);
    }
  } catch (error) {
    loading.style.display = 'none';
    shop.innerHTML = '<div class="alert alert-danger text-center">Error al cargar la tienda.</div>';
    console.error('Error al obtener los items de la tienda:', error);
    alert('No se pudo cargar la tienda. Intenta más tarde.');
  }
}

async function buyItem(itemId) {
  const token = (localStorage.getItem('token') || '').trim();

  try {
    const response = await fetch('https://albertaapi.onrender.com/api/minigames/buy/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + token,
      },
      body: JSON.stringify({ item_id: itemId })
    });

    const contentType = response.headers.get('Content-Type');

    if (!response.ok) {
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

    // Recargar tienda
    fetchShopItems();

  } catch (error) {
    console.error('Error al comprar el item:', error);
    alert('No se pudo completar la compra. Intenta más tarde.');
  }
}

// Cargar tienda al inicio
fetchShopItems();

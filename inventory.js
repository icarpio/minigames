async function loadInventory() {
  const token = (localStorage.getItem('token') || '').trim();
  const loading = document.getElementById('loading');
  const inv = document.getElementById('inventory');

  try {
    const response = await fetch('https://albertaapi.onrender.com/api/minigames/inventory/', {
      headers: { 'Authorization': 'Token ' + token }
    });

    const items = await response.json();
    inv.innerHTML = ''; // Limpia el contenedor
    loading.style.display = 'none'; // Oculta el spinner

    if (items.length === 0) {
      inv.innerHTML = '<div class="alert alert-warning text-center">No tienes ítems.</div>';
      return;
    }

    items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'col-md-4';

      div.innerHTML = `
        <div class="card h-100">
          <img src="assets/img/${item.image_name}" class="card-img-top" alt="${item.name}">
          <div class="card-body">
            <h5 class="card-title">${item.name}</h5>
            <p class="card-text">Comprado el: ${new Date(item.purchased_at).toLocaleString()}</p>
          </div>
        </div>
      `;

      inv.appendChild(div);
    });

  } catch (error) {
    loading.style.display = 'none';
    inv.innerHTML = '<div class="alert alert-danger text-center">Error al cargar el inventario.</div>';
    console.error('Error al cargar inventario:', error);
  }
}

loadInventory();

async function loadInventory() {
  const response = await fetch('https://albertaapi.onrender.com/minigames/inventory/', {
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
  });

  const items = await response.json();
  const inv = document.getElementById('inventory');
  inv.innerHTML = items.length === 0 ? 'No tienes ítems.' : '';

  items.forEach(item => {
    const div = document.createElement('div');
    div.innerHTML = `
      <h3>${item.name}</h3>
      <img src="assets/img/${item.image_name}" width="100" />
      <p>Comprado el: ${new Date(item.purchased_at).toLocaleString()}</p>
      <hr>
    `;
    inv.appendChild(div);
  });
}

loadInventory();

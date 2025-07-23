async function fetchShopItems() {
  const response = await fetch('https://albertaapi.onrender.com/minigames/shop/', {
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
  });

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
}

async function buyItem(itemId) {
  const response = await fetch('https://albertaapi.onrender.com/api/buy/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    },
    body: JSON.stringify({ item_id: itemId })
  });

  const data = await response.json();
  alert(response.ok ? `Compraste ${data.item}` : data.error);
  fetchShopItems();
}

fetchShopItems();

export async function saveGameSession(token, gameName, scoreValue) {
  try {
    //'https://albertaapi.onrender.com/api/minigames/auth/sessions/'
    //'http://localhost:8000/api/minigames/sessions/'
    const response = await fetch('https://albertaapi.onrender.com/api/minigames/auth/sessions/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + token,
      },
      body: JSON.stringify({
        game: gameName,
        score: scoreValue,
        played_at: new Date().toISOString() // siempre string ISO
      }),
    });

    const contentType = response.headers.get('content-type');
    let errorData = {};

    if (!response.ok) {
      if (contentType && contentType.includes("application/json")) {
        errorData = await response.json();
      }
      console.error("Respuesta con error:", errorData);
      throw new Error(errorData.detail || response.statusText || "Error desconocido");
    }

    const data = await response.json();
    //console.log("Puntuación guardada:", data);
    return data;

  } catch (error) {
    console.error("saveGameSession error:", error);
    throw error;
  }
}



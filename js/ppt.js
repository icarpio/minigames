import { saveGameSession } from './api.js';

const choices = ["piedra", "papel", "tijera"];
let round = 1;
let points = 0;
let maxRounds = 3;

const resultDiv = document.getElementById('result');
const roundDiv = document.getElementById('round');
const scoreDiv = document.getElementById('score');
const restartBtn = document.getElementById('restartBtn');
const buttons = document.querySelectorAll('.choice-btn');

// Ocultar el botón reiniciar al iniciar
restartBtn.style.display = 'none';

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    if (round > maxRounds) return;
    const playerChoice = btn.dataset.choice;
    const cpuChoice = choices[Math.floor(Math.random() * 3)];
    const result = getResult(playerChoice, cpuChoice);

    if (result === "win") {
      resultDiv.textContent = `Ganaste esta ronda 🎉 (${playerChoice} vence a ${cpuChoice})`;
      points += 50;
    } else if (result === "lose") {
      resultDiv.textContent = `Perdiste esta ronda 😞 (${cpuChoice} vence a ${playerChoice})`;
      points -= 50;
    } else {
      resultDiv.textContent = `Empate 🤝 (${playerChoice} = ${cpuChoice})`;
    }

    scoreDiv.textContent = `Puntos: ${points}`;
    round++;
    roundDiv.textContent = `Ronda: ${round > maxRounds ? maxRounds : round} / ${maxRounds}`;

    if (round > maxRounds) {
      endGame();
    }
  });
});

function getResult(player, cpu) {
  if (player === cpu) return "draw";
  if (
    (player === "piedra" && cpu === "tijera") ||
    (player === "papel" && cpu === "piedra") ||
    (player === "tijera" && cpu === "papel")
  ) {
    return "win";
  }
  return "lose";
}

function endGame() {
  buttons.forEach(btn => btn.disabled = true);

 if (points < 0) {
  points -= 400;
  resultDiv.innerHTML += ` <span style="color: red; font-weight: bold;">| Tu puntuación fue negativa. Se aplicó una penalización de 400 puntos.</span>`;
} else if (points === 0) {
  resultDiv.innerHTML += ` <span style="color: gray; font-weight: bold;">| Empate 🤝. Sigue jugando...</span>`;
} else {
  resultDiv.innerHTML += ` <span style="color: #0a8a0a; font-weight: bold;">| ¡Felicidades 🎉🎉! Has ganado ${points} puntos.</span>`;
}

  //resultDiv.textContent += ` | Juego terminado. Total: ${points} puntos.`;
  restartBtn.style.display = "inline-block";

  const token = localStorage.getItem('token');
  if (!token) {
    console.warn("No hay token, no se puede guardar puntuación.");
    return;
  }

  saveGameSession(token, "PPT", points)
    .then(() => console.log("Puntuación guardada."))
    .catch(err => console.error("Error al guardar:", err));
}

// Listener para reiniciar el juego
restartBtn.addEventListener('click', () => {
  round = 1;
  points = 0;
  roundDiv.textContent = `Ronda: 1 / ${maxRounds}`;
  scoreDiv.textContent = `Puntos: 0`;
  resultDiv.textContent = 'Haz tu elección';
  restartBtn.style.display = 'none';

  buttons.forEach(btn => btn.disabled = false);
});

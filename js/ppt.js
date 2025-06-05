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
  resultDiv.textContent += ` | Juego terminado. Total: ${points} puntos.`;
  restartBtn.style.display = "inline-block";

  const token = localStorage.getItem('token');
  if (!token) {
    console.warn("No hay token, no se puede guardar puntuación.");
    return;
  }

  saveGameSession(token, "Piedra Papel Tijera", points)
    .then(() => console.log("Puntuación guardada."))
    .catch(err => console.error("Error al guardar:", err));
}

restartBtn.addEventListener('click', () => {
  round = 1;
  points = 0;
  roundDiv.textContent = `Ronda: 1 / ${maxRounds}`;
  resultDiv.textContent = 'Haz tu elección';
  scoreDiv.textContent = 'Puntos: 0';
  restartBtn.style.display = "none";
  buttons.forEach(btn => {
    btn.disabled = false;
  });
});

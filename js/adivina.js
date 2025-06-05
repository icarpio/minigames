import { saveGameSession } from './api.js';

const guessInput = document.getElementById("guessInput");
const guessBtn = document.getElementById("guessBtn");
const restartBtn = document.getElementById("restartBtn");
const feedback = document.getElementById("feedback");
const instructions = document.getElementById("instructions");

let secretNumber = Math.floor(Math.random() * 50) + 1;
let attemptsLeft = 5;
let score = 0;

guessBtn.addEventListener("click", () => {
  const guess = parseInt(guessInput.value);

  if (isNaN(guess) || guess < 1 || guess > 50) {
    feedback.textContent = "❗ Ingresa un número válido entre 1 y 50.";
    return;
  }

  if (guess === secretNumber) {
    feedback.textContent = `🎉 ¡Correcto! El número era ${secretNumber}.`;
    score = 500;
    endGame();
  } else {
    attemptsLeft--;
    if (attemptsLeft > 0) {
      feedback.textContent = guess < secretNumber
        ? "🔼 Demasiado bajo..."
        : "🔽 Demasiado alto...";
      instructions.textContent = `Intentos restantes: ${attemptsLeft}`;
    } else {
      feedback.textContent = `❌ Has perdido. El número era ${secretNumber}.`;
      score = -50;
      endGame();
    }
  }

  guessInput.value = '';
  guessInput.focus();
});

function endGame() {
  guessInput.disabled = true;
  guessBtn.disabled = true;
  restartBtn.style.display = "inline-block";

  const token = localStorage.getItem("token");
  if (token) {
    saveGameSession(token, "Adivina el Número", score)
      .then(() => console.log("Puntuación guardada"))
      .catch(err => console.error("Error al guardar:", err));
  } else {
    console.warn("Token no disponible: puntuación no guardada.");
  }
}

restartBtn.addEventListener("click", () => {
  secretNumber = Math.floor(Math.random() * 50) + 1;
  attemptsLeft = 5;
  score = 0;
  feedback.textContent = "";
  instructions.textContent = "Tienes 5 intentos";
  guessInput.disabled = false;
  guessBtn.disabled = false;
  guessInput.value = '';
  restartBtn.style.display = "none";
  guessInput.focus();
});

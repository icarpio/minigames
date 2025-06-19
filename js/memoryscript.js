import { saveGameSession } from './api.js';  // Ajusta la ruta si es necesario

// Variables
let turnedButtons = 0;
let firstResult = null;
let secondResult = null;
let button01 = null;
let button02 = null;
let successes = 0;
const showSuccesses = document.getElementById('successes');
const timeDisplay = document.getElementById('time');
let timeRemaining = 50;
let timer = null;

let images = [
  "../assets/img/img1.png", "../assets/img/img1.png",
  "../assets/img/img2.png", "../assets/img/img2.png",
  "../assets/img/img3.png", "../assets/img/im3_.png",
  "../assets/img/img4.png", "../assets/img/img4.png",
  "../assets/img/img5.png", "../assets/img/img5.png",
  "../assets/img/img6.png", "../assets/img/img6.png",
  "../assets/img/img7.png", "../assets/img/img7.png",
  "../assets/img/img8.png", "../assets/img/img8.png"
];

function shuffleImages() {
  images.sort(() => Math.random() - 0.5);
}

function startTimer() {
  if (timer) return;
  timer = setInterval(() => {
    if (timeRemaining > 0) {
      timeRemaining--;
      timeDisplay.textContent = `Tiempo restante: ${timeRemaining} seg`;
    } else {
      clearInterval(timer);
      timer = null;
      endGame();
    }
  }, 1000);
}

function endGame() {
  document.querySelectorAll('button').forEach(btn => btn.disabled = true);
  alert(`¡Se acabó el tiempo! Tu puntuación final es: ${successes} aciertos.`);
  showSuccesses.textContent = `Número de aciertos: ${successes}`;
}

function spin(id) {
  if (turnedButtons === 0) startTimer();

  const clickedButton = document.getElementById(id);
  if (clickedButton.disabled) return;

  turnedButtons++;

  if (turnedButtons === 1) {
    button01 = clickedButton;
    firstResult = images[id];
    button01.innerHTML = `<img src="${firstResult}" alt="Imagen" />`;
    button01.disabled = true;
  } else if (turnedButtons === 2) {
    button02 = clickedButton;
    secondResult = images[id];
    button02.innerHTML = `<img src="${secondResult}" alt="Imagen" />`;
    button02.disabled = true;

    if (firstResult === secondResult) {
      turnedButtons = 0;
      successes++;
      showSuccesses.textContent = `Número de aciertos: ${successes}`;

      if (successes === 8) {
        clearInterval(timer);
        const token = localStorage.getItem('token');
        const gameName = "Juego de Memoria";
        const scoreValue = 400;

        saveGameSession(token, gameName, scoreValue)
          .then(() => {
            setTimeout(() => {
              alert("🎉¡Felicidades! Has ganado 400 puntos");
              restartGame();
            }, 500);
          })
          .catch(error => {
            console.error("Error guardando la puntuación:", error);
            alert("Error guardando la puntuación");
            restartGame();
          });
      }
    } else {
      setTimeout(() => {
        button01.innerHTML = '';
        button02.innerHTML = '';
        button01.disabled = false;
        button02.disabled = false;
        turnedButtons = 0;
      }, 1000);
    }
  }
}

function restartGame() {
  timeRemaining = 50;
  successes = 0;
  showSuccesses.textContent = `Número de aciertos: ${successes}`;
  timeDisplay.textContent = `Tiempo restante: ${timeRemaining} seg`;

  document.querySelectorAll('button').forEach(btn => {
    btn.innerHTML = '';
    btn.disabled = false;
  });

  clearInterval(timer);
  timer = null;
  shuffleImages();
  startTimer();
}

// Al cargar el DOM, asignamos eventos y barajamos imágenes
window.addEventListener('DOMContentLoaded', () => {
  shuffleImages();

  document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
      spin(parseInt(button.id));
    });
  });

  document.getElementById('restartBtn').addEventListener('click', restartGame);
});

import { saveGameSession } from './api.js';

const board = Array(9).fill(null);
const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const restartBtn = document.getElementById('restartBtn');

let gameOver = false;

// El usuario siempre es 'X', la computadora es 'O'
const USER = 'X';
const CPU = 'O';

cells.forEach(cell => {
  cell.addEventListener('click', () => {
    if (gameOver) return;
    const idx = +cell.dataset.index;

    if (!board[idx]) {
      makeMove(idx, USER);
      if (!gameOver) {
        cpuTurn();
      }
    }
  });
});

restartBtn.addEventListener('click', restartGame);

function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;
  cells[index].classList.add('disabled');

  if (checkWinner(board, player)) {
    gameOver = true;
    if (player === USER) {
      message.textContent = "🎉 ¡Ganaste!";
      saveScore(400);
    } else {
      message.textContent = "😞 La computadora ganó. Mejor suerte la próxima.";
      saveScore(0);
    }
    disableBoard();
  } else if (board.every(cell => cell !== null)) {
    gameOver = true;
    message.textContent = "🤝 Empate.";
    saveScore(0);
    disableBoard();
  } else {
    message.textContent = (player === USER) ? "Turno de la computadora..." : "Tu turno";
  }
}

function cpuTurn() {
  // Estrategia muy simple: elige una celda vacía al azar
  const emptyIndices = board
    .map((val, idx) => val === null ? idx : null)
    .filter(idx => idx !== null);

  // CPU juega tras un pequeño delay para simular "pensar"
  setTimeout(() => {
    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    makeMove(randomIndex, CPU);
  }, 500);
}

function checkWinner(b, player) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8], // filas
    [0,3,6],[1,4,7],[2,5,8], // columnas
    [0,4,8],[2,4,6]          // diagonales
  ];
  return lines.some(line => line.every(idx => b[idx] === player));
}

function disableBoard() {
  cells.forEach(cell => cell.classList.add('disabled'));
}

function restartGame() {
  for(let i = 0; i < 9; i++) {
    board[i] = null;
    cells[i].textContent = '';
    cells[i].classList.remove('disabled');
  }
  gameOver = false;
  message.textContent = "Tu turno";
}

async function saveScore(points) {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn("No hay token de usuario, no se puede guardar la puntuación");
    return;
  }

  try {
    await saveGameSession(token, "3 en Raya", points);
    console.log(`Puntuación guardada: ${points} puntos.`);
  } catch (err) {
    console.error("Error guardando la puntuación:", err);
  }
}

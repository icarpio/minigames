import { saveGameSession } from './api.js';

const token = (localStorage.getItem('token') || '').trim();
if (!token) {
  alert('No has iniciado sesión. Serás redirigido al login.');
  window.location.href = './index.html'
}

const todasLasPalabras = [
  'HTML', 'CSS', 'JAVASCRIPT', 'PYTHON', 'REACT',
  'ANGULAR', 'NODE', 'VUE', 'MONGO', 'SQL',
  'LINUX', 'WINDOWS', 'ARRAY', 'OBJECT', 'STRING',
  'NUMBER', 'BOOLEAN', 'BROWSER', 'EDITOR', 'SERVER'
];

let palabras = [];
const gridSize = 12;
let grid = [];
let palabrasEncontradas = 0;
let selectedCells = [];

const sopaElement = document.getElementById('sopa');
const palabrasElement = document.getElementById('palabras');
const mensajeElement = document.getElementById('mensaje');
const reiniciarBtn = document.getElementById('reiniciar');

function seleccionarPalabras() {
  palabras = [...todasLasPalabras]
    .sort(() => 0.5 - Math.random())
    .slice(0, 10);
}

function init() {
  seleccionarPalabras();
  grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));
  placeWordsInGrid();
  fillEmptySpaces();
  renderGrid();
  renderWordList();
  palabrasEncontradas = 0;
  selectedCells = [];
  mensajeElement.textContent = '';
}

function placeWordsInGrid() {
  palabras.forEach(word => {
    let placed = false;
    while (!placed) {
      const direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';
      const row = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * gridSize);

      if (direction === 'horizontal' && col + word.length <= gridSize) {
        if (canPlaceWord(word, row, col, direction)) {
          for (let i = 0; i < word.length; i++) {
            grid[row][col + i] = word[i];
          }
          placed = true;
        }
      } else if (direction === 'vertical' && row + word.length <= gridSize) {
        if (canPlaceWord(word, row, col, direction)) {
          for (let i = 0; i < word.length; i++) {
            grid[row + i][col] = word[i];
          }
          placed = true;
        }
      }
    }
  });
}

function canPlaceWord(word, row, col, direction) {
  for (let i = 0; i < word.length; i++) {
    if (direction === 'horizontal') {
      if (grid[row][col + i] !== '' && grid[row][col + i] !== word[i]) return false;
    } else {
      if (grid[row + i][col] !== '' && grid[row + i][col] !== word[i]) return false;
    }
  }
  return true;
}

function fillEmptySpaces() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (grid[i][j] === '') {
        grid[i][j] = letters[Math.floor(Math.random() * letters.length)];
      }
    }
  }
}

function renderGrid() {
  sopaElement.innerHTML = '';
  grid.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const cellElement = document.createElement('div');
      cellElement.textContent = cell;
      cellElement.dataset.row = rowIndex;
      cellElement.dataset.col = colIndex;
      cellElement.addEventListener('mousedown', () => startSelection(cellElement));
      cellElement.addEventListener('mouseenter', () => {
        if (selectedCells.length > 0) {
          selectCell(cellElement);
        }
      });
      cellElement.addEventListener('mouseup', endSelection);
      sopaElement.appendChild(cellElement);
    });
  });
}

function renderWordList() {
  palabrasElement.innerHTML = '';
  palabras.forEach(word => {
    const wordElement = document.createElement('div');
    wordElement.textContent = word;
    palabrasElement.appendChild(wordElement);
  });
}

function startSelection(cellElement) {
  selectedCells = [{ row: parseInt(cellElement.dataset.row), col: parseInt(cellElement.dataset.col) }];
  cellElement.classList.add('selected');
}

function selectCell(cellElement) {
  const row = parseInt(cellElement.dataset.row);
  const col = parseInt(cellElement.dataset.col);

  if (isAdjacent(row, col)) {
    selectedCells.push({ row, col });
    cellElement.classList.add('selected');
  }
}

function isAdjacent(row, col) {
  const lastCell = selectedCells[selectedCells.length - 1];
  const rowDiff = Math.abs(row - lastCell.row);
  const colDiff = Math.abs(col - lastCell.col);

  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

function endSelection() {
  if (selectedCells.length === 0) return;

  let palabraSeleccionada = selectedCells.map(cell => grid[cell.row][cell.col]).join('');

  const palabraIndex = palabras.findIndex(p => p === palabraSeleccionada || p === palabraSeleccionada.split('').reverse().join(''));

  if (palabraIndex !== -1) {
    marcarPalabraEncontrada(palabras[palabraIndex]);
    palabras.splice(palabraIndex, 1);
    palabrasEncontradas++;
    mostrarMensaje('¡Palabra encontrada: ' + palabraSeleccionada + '!');
    if (palabrasEncontradas === 10) {
      mostrarMensaje('¡Felicidades! Has encontrado todas las palabras.');
      guardarPuntuacion();
    }
  } else {
    mostrarMensaje('Palabra no encontrada.');
  }

  limpiarSeleccion();
}

function marcarPalabraEncontrada(word) {
  selectedCells.forEach(cell => {
    const index = cell.row * gridSize + cell.col;
    sopaElement.children[index].classList.add('found');
    sopaElement.children[index].classList.remove('selected');
  });

  Array.from(palabrasElement.children).forEach(child => {
    if (child.textContent === word) {
      child.style.textDecoration = 'line-through';
      child.style.color = 'gray';
    }
  });
}

function limpiarSeleccion() {
  selectedCells.forEach(cell => {
    const index = cell.row * gridSize + cell.col;
    sopaElement.children[index].classList.remove('selected');
  });
  selectedCells = [];
}

function mostrarMensaje(msg) {
  mensajeElement.textContent = msg;
  setTimeout(() => mensajeElement.textContent = '', 3000);
}

function guardarPuntuacion() {
  const score = palabrasEncontradas * 100;
  saveGameSession(token, 'Sopa de Letras', score)
    .then(() => console.log('Puntuación guardada correctamente'))
    .catch(e => {
      alert('Error guardando puntuación: ' + e.message);
      if (e.message.toLowerCase().includes('unauthorized')) {
        localStorage.clear();
        window.location.href = './index.html'
      }
    });
}

reiniciarBtn.addEventListener('click', init);

init();

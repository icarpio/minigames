import { saveGameSession } from './api.js'


const token = (localStorage.getItem('token') || '').trim();
if (!token) {
  alert('No has iniciado sesión. Serás redirigido al login.');
  window.location.href = './index.html'
}


const categorias = {
  ciudadesDeEspana: [
    'MADRID', 'BARCELONA', 'VALENCIA', 'SEVILLA', 'ZARAGOZA',
    'MALAGA', 'BILBAO', 'SALAMANCA', 'TOLEDO', 'CORDOBA',
    'BURGOS', 'OVIEDO', 'CADIZ', 'ALICANTE', 'GRANADA',
    'MURCIA', 'PAMPLONA', 'LEON', 'VALLADOLID', 'TARRAGONA'
  ],
  ciudadesDeItalia: [
    'ROMA', 'MILAN', 'VENECIA', 'NAPOLES', 'FLORENCIA',
    'TURIN', 'GENOVA', 'PALERMO', 'SIENA', 'BOLONIA',
    'PISA', 'VERONA', 'BARI', 'CATANIA', 'TRENTO',
    'REGGIO', 'ANCONA', 'AREZZO', 'SALERNO', 'UDINE'
  ],
  comidas: [
    'PAELLA', 'PIZZA', 'TORTILLA', 'RISOTTO', 'GAZPACHO',
    'LASAGNA', 'EMPANADA', 'HAMBURGUESA', 'ENSALADA', 'SUSHI',
    'CROQUETA', 'TACOS', 'FONDUE', 'BURRITO', 'PUDIN',
    'SOUFLÉ', 'CAVIAR', 'QUICHE', 'OMELETTE', 'TAPAS'
  ], animalesAcuaticos: [
    'DELFIN', 'BALLENA', 'TIBURON', 'PULPO', 'MEDUSA',
    'TRUCHA', 'ATUN', 'LANGOSTA', 'CANGREJO', 'ORCA',
    'NARVAL', 'MERO', 'ANGUILA', 'CALAMAR', 'FOCA',
    'MANATI', 'RAYA', 'BACALAO', 'SALMON'
  ],
  aves: [
    'AGUILA', 'BUHO', 'CUERVO', 'GAVIOTA', 'FLAMENCO',
    'COLIBRI', 'PALOMA', 'CIGUEÑA', 'PATO', 'CANARIO',
    'PINGÜINO', 'LORO', 'AVESTRUZ', 'FAISAN', 'JILGUERO',
    'GALLINA', 'HALCON', 'TUCAN', 'GORRION', 'CARBONERO'
  ],
  mamiferos: [
    'ELEFANTE', 'TIGRE', 'LEON', 'OSO', 'CABALLO',
    'PERRO', 'GATO', 'VACA', 'CERDO', 'CANGURO',
    'LOBO', 'CEBRA', 'JIRAFA',
    'MONO', 'RATA', 'ZORRO', 'ERIZO', 'BALLENA'
  ],
  ciudadesEuropa: [
  'PARIS',
  'BERLIN',
  'VIENA',
  'LISBOA',
  'PRAGA',
  'DUBLIN',
  'OSLO',
  'ZURICH',
  'GINEBRA',
  'SOFIA',
  'ROMA',
  'ATENAS',
  'RIGA',
  'TALLIN',
  'VILNA',
  'BLED',
  'NAPOLES',
  'MUNICH',
  'BREMEN',
  'BILBAO'
],
  instrumentosMusicales: [
  'PIANO',
  'VIOLIN',
  'BAJO',
  'ARPA',
  'FLAUTA',
  'TAMBOR',
  'CELLO',
  'OBOE',
  'BANJO',
  'DJEMBE',
  'LIRA',
  'BONGO',
  'GUITARRA',
  'SAXOFON',
  'UKULELE',
  'TROMBON',
  'ZAMPOÑA',
  'CAJON',
  'CLAVES',
  'CUERDA'
],
  deportes: [
  'FUTBOL',
  'TENIS',
  'GOLF',
  'ESQUI',
  'BOXEO',
  'JUDO',
  'RUGBY',
  'SURF',
  'REMO',
  'AJEDREZ',
  'PESCA',
  'BASQUET',
  'HANDBOL',
  'BMX',
  'KARATE',
  'LUCHA',
  'ESGRIMA',
  'PARKOUR',
  'SKATE',
  'TIRO'
],
 colores: [
  'ROJO',
  'AZUL',
  'VERDE',
  'NARANJA',
  'MORADO',
  'ROSADO',
  'BLANCO',
  'NEGRO',
  'GRIS',
  'MARRON',
  'CELESTE',
  'VIOLETA',
  'DORADO',
  'BEIGE',
  'FUCSIA',
  'LAVANDA',
  'CORAL',
  'OCRE',
  'CARMESI',
  'BRONCE'
],
  profesiones: [
  'MEDICO',
  'ABOGADO',
  'MAESTRO',
  'POLICIA',
  'BOMBERO',
  'CHEF',
  'ACTOR',
  'CANTANTE',
  'ESCRITOR',
  'JUEZ',
  'GUARDA',
  'MODELO',
  'PINTOR',
  'NOTARIO',
  'FISICO',
  'DENTISTA',
  'LOCUTOR',
  'BARISTA',
  'FARMACE',
  'COCINERO'
],
  elementosQuimicos: [
    'HIERRO', 'ORO', 'COBRE', 'PLATA', 'ZINC',
    'CLORO', 'AZUFRE', 'OXIGENO', 'HELIO', 'CARBONO',
    'CALCIO', 'SODIO', 'BORO', 'NEON', 'LITIO',
    'FLUOR', 'RADON', 'RADIO', 'CESIO', 'ARGON'
  ],
  inventos: [
    'RUEDA', 'RADIO', 'RELOJ', 'IMAN', 'AVION',
    'COCHE', 'CAMARA', 'LENTE', 'PLUMA', 'VACUNA',
    'FAX', 'MOTOR', 'CELULA', 'LAMPARA', 'BOMBA',
    'LLAVE', 'TELEFAX', 'SONAR', 'RADAR', 'HORNOS'
  ],
  personajesHistoricos: [
    'PLATON', 'SOCRATES', 'DARWIN', 'TESLA', 'BOLIVAR',
    'NEWTON', 'EINSTEIN', 'MANDELA', 'MARX', 'COLON',
    'CAESAR', 'GALILEO', 'CICERON', 'NAPOLEON', 'JUANA',
    'KANT', 'HOMERO', 'ARISTO', 'GANDHI', 'CURIE'
  ],
  marcasFamosas: [
    'APPLE', 'SONY', 'TESLA', 'NIKE', 'ZARA',
    'BMW', 'HONDA', 'AUDI', 'PEPSI', 'DODGE',
    'ADIDAS', 'FORD', 'GUCCI', 'VOLVO', 'NOKIA',
    'FIAT', 'SAMSUNG', 'TOYOTA', 'INTEL', 'HUAWEI'
  ],
   rios: [
    'AMAZONAS', 'NILO', 'EBRO', 'DANUBIO', 'LOIRA',
    'TAMESIS', 'RHIN', 'URUGUAY', 'ORINOCO', 'YANGTSE',
    'SEINE', 'DUERO', 'LENA', 'CONGO', 'MURRAY',"ESCALDA"
  ],
    mitologia: [
    'ZEUS', 'ODIN', 'RA', 'ISIS', 'HERA',
    'ARES', 'THOR', 'LOKI', 'FREYA', 'OSIRIS',
    'HORUS', 'POSEIDON', 'HADES', 'GAIA', 'ATENEA'
  ],
   pintores: [
    'PICASSO', 'GOYA', 'DALI', 'MONET','VERMEER',
    'VANGOGH', 'MIRÓ', 'EL GRECO', 'REMBRAND', 'KLIMT','RUBENS'
  ],
    frutas: [
    'MANZANA',
    'PERA',
    'KIWI',
    'MELON',
    'UVAS',
    'PIÑA',
    'LIMON',
    'CEREZA',
    'FRESA',
    'BANANA',
    'MANGO',
    'GUAYABA',
    'CIRUELA',
    'COCO',
    'DURAZNO',
    'HIGO',
    'NECTARIN',
    'TAMARIND',
    'PAPAYA',
    'CAQUI'
  ]
};

let palabras = [];
let categoriaSeleccionada = '';
const gridSize = 10;
let grid = [];
let palabrasEncontradas = 0;
let selectedCells = [];

const sopaElement = document.getElementById('sopa');
const palabrasElement = document.getElementById('palabras');
const mensajeElement = document.getElementById('mensaje');
const reiniciarBtn = document.getElementById('reiniciar');

function seleccionarPalabras() {
  const nombresCategorias = Object.keys(categorias);
  const indiceAleatorio = Math.floor(Math.random() * nombresCategorias.length);
  categoriaSeleccionada = nombresCategorias[indiceAleatorio];

  const lista = categorias[categoriaSeleccionada];

  palabras = [...lista]
    .sort(() => 0.5 - Math.random())
    .slice(0, 10)
    .sort((a, b) => b.length - a.length); // ordenar de mayor a menor
}

const DIRECTIONS = [
  { name: 'horizontal', dx: 1, dy: 0 },
  { name: 'horizontal-reverse', dx: -1, dy: 0 },
  { name: 'vertical', dx: 0, dy: 1 },
  { name: 'vertical-reverse', dx: 0, dy: -1 },
  { name: 'diagonal', dx: 1, dy: 1 },
  { name: 'diagonal-reverse', dx: -1, dy: -1 },
  { name: 'diagonal-up', dx: 1, dy: -1 },
  { name: 'diagonal-up-reverse', dx: -1, dy: 1 }
];

function placeWordsInGrid() {
  palabras.forEach(word => {
    let placed = false;
    let attempts = 0;
    const maxAttempts = 100; // evitar bucle infinito

    while (!placed && attempts < maxAttempts) {
      attempts++;

      const direction = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
      const dx = direction.dx;
      const dy = direction.dy;

      const maxRow = dy === -1 ? word.length - 1 : 0;
      const maxCol = dx === -1 ? word.length - 1 : 0;

      const row = Math.floor(Math.random() * (gridSize - Math.abs(dy * (word.length - 1)) - maxRow));
      const col = Math.floor(Math.random() * (gridSize - Math.abs(dx * (word.length - 1)) - maxCol));

      if (canPlaceWord(word, row, col, dx, dy)) {
        for (let i = 0; i < word.length; i++) {
          grid[row + i * dy][col + i * dx] = word[i];
        }
        placed = true;
      }
    }

    if (!placed) {
      console.warn(`No se pudo colocar la palabra: ${word}`);
    }
  });
}

function canPlaceWord(word, row, col, dx, dy) {
  for (let i = 0; i < word.length; i++) {
    const newRow = row + i * dy;
    const newCol = col + i * dx;

    if (newRow < 0 || newRow >= gridSize || newCol < 0 || newCol >= gridSize) return false;

    const currentCell = grid[newRow][newCol];
    if (currentCell !== '' && currentCell !== word[i]) return false;
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
        if (selectedCells.length > 0) selectCell(cellElement);
      });
      cellElement.addEventListener('mouseup', endSelection);

      cellElement.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startSelection(cellElement);
      }, { passive: false });

      cellElement.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const el = document.elementFromPoint(touch.clientX, touch.clientY);
        if (el && el.dataset && el.dataset.row !== undefined && el.dataset.col !== undefined) {
          selectCell(el);
        }
      }, { passive: false });

      cellElement.addEventListener('touchend', (e) => {
        e.preventDefault();
        endSelection();
      }, { passive: false });

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

function mostrarCategoria() {
  let categoriaElement = document.getElementById('categoria-actual');
  if (!categoriaElement) {
    categoriaElement = document.createElement('div');
    categoriaElement.id = 'categoria-actual';
    mensajeElement.parentElement.insertBefore(categoriaElement, mensajeElement);
  }
  categoriaElement.textContent = formatearNombreCategoria(categoriaSeleccionada);
}

function formatearNombreCategoria(nombre) {
  return nombre.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
}

let currentDirection = null;

function startSelection(cellElement) {
  selectedCells = [{
    row: parseInt(cellElement.dataset.row),
    col: parseInt(cellElement.dataset.col)
  }];
  cellElement.classList.add('selected');
  currentDirection = null;
}

function selectCell(cellElement) {
  const row = parseInt(cellElement.dataset.row);
  const col = parseInt(cellElement.dataset.col);
  const lastCell = selectedCells[selectedCells.length - 1];

  const dx = col - lastCell.col;
  const dy = row - lastCell.row;

  const normDx = dx === 0 ? 0 : dx / Math.abs(dx);
  const normDy = dy === 0 ? 0 : dy / Math.abs(dy);

  if (!currentDirection && selectedCells.length === 1) {
    if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1 && !(normDx === 0 && normDy === 0)) {
      currentDirection = { dx: normDx, dy: normDy };
      selectedCells.push({ row, col });
      cellElement.classList.add('selected');
    }
    return;
  }

  if (currentDirection) {
    const expectedRow = lastCell.row + currentDirection.dy;
    const expectedCol = lastCell.col + currentDirection.dx;

    if (row === expectedRow && col === expectedCol) {
      selectedCells.push({ row, col });
      cellElement.classList.add('selected');
    }
  }
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
      saveScore(500);
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

function init() {
  reiniciarBtn.disabled = true; // evitar clics mientras se inicializa
  seleccionarPalabras();
  grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));
  placeWordsInGrid();
  fillEmptySpaces();
  renderGrid();
  renderWordList();
  palabrasEncontradas = 0;
  selectedCells = [];
  mensajeElement.textContent = '';
  mostrarCategoria();
  reiniciarBtn.disabled = false;
}

function guardarPuntuacion() {
  const score = palabrasEncontradas * 10;
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

async function saveScore(score) {
  try {
    await saveGameSession(token, "Sopa de Letras", score);
    console.log("Puntuación guardada:", score);
  } catch (e) {
    alert("Error guardando puntuación: " + e.message);
    if (e.message.toLowerCase().includes("unauthorized")) {
      localStorage.clear();
      window.location.href = "../index.html";
    }
  }
}

reiniciarBtn.addEventListener('click', init);

init();



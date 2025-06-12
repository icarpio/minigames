//import { saveGameSession } from './api.js'; 
import { english_questions } from './eng_questions.js';


const englandImageDiv = document.getElementById('englandImage');

const englandImages = [
      'https://flagcdn.com/w80/gb.png',
	  'https://upload.wikimedia.org/wikipedia/commons/3/3b/Red_double_decker_bus_in_London.jpg',
	  'https://upload.wikimedia.org/wikipedia/commons/4/46/Puente_de_la_Torre%2C_Londres%2C_Inglaterra%2C_2014-08-11%2C_DD_092.JPG',
	  'https://upload.wikimedia.org/wikipedia/commons/b/b4/Buckingham_Palace%2C_London_-_April_2009.jpg',
	  'https://upload.wikimedia.org/wikipedia/commons/9/98/City_of_London_skyline_from_London_City_Hall_-_Oct_2008_-_Aligned.jpg',
	  'https://upload.wikimedia.org/wikipedia/commons/b/b4/London_Eye_Twilight_April_2006.jpg',
	  'https://upload.wikimedia.org/wikipedia/commons/d/dc/Two_black_cabs_with_Big_Ben_in_the_background.jpg',
	  'https://upload.wikimedia.org/wikipedia/commons/3/37/London_Underground_Roundel%2C_London_SW1_-_geograph.org.uk_-_4291435.jpg',
	  'https://upload.wikimedia.org/wikipedia/commons/b/b6/Queen_Elizabeth_II_in_March_2015.jpg',
	  'https://upload.wikimedia.org/wikipedia/commons/1/14/London%2C_Ontario_Police_Charger.png',
];


const totalQuestions = 20;
let selectedQuestions = [];
let currentQuestion = 0;
let score = 0;
let answersSummary = [];
let timer = null;
let timePerQuestion = 15;
let timeLeft = timePerQuestion;

// Referencias a elementos DOM
const progressBar = document.getElementById('progressBar');
const timerDisplay = document.getElementById('timer');
const questionText = document.getElementById('questionText');
const optionsContainer = document.getElementById('options');
const resultDiv = document.getElementById('result');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');
const summaryDiv = document.getElementById('summary');

// Removido selector de categoría ya que no se usa

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}


function startQuiz() {
  score = 0;
  currentQuestion = 0;
  answersSummary = [];
  summaryDiv.innerHTML = '';
  restartBtn.style.display = 'none';
  nextBtn.style.display = 'none';
  resultDiv.textContent = '';
  progressBar.style.width = '0%';

  // Mezclar todas las preguntas de todas las categorías
  const all = Object.values(english_questions).flat();
  selectedQuestions = shuffleArray([...all]).slice(0, totalQuestions);

  showQuestion();
}

function showQuestion() {
  clearInterval(timer);
  timeLeft = timePerQuestion;
  updateTimerDisplay();

  const q = selectedQuestions[currentQuestion];
  questionText.innerText = `${currentQuestion + 1}: ${q.question}`;
  // Mostrar imagen aleatoria de Inglaterra
const randomImage = englandImages[Math.floor(Math.random() * englandImages.length)];
englandImageDiv.innerHTML = `<img src="${randomImage}" alt="Inglaterra" style="max-width: 100px; display: block; margin: 0 auto 15px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">`;

  optionsContainer.innerHTML = '';
  resultDiv.textContent = '';
  nextBtn.style.display = 'none';

  const progressPercent = (currentQuestion / totalQuestions) * 100;
  progressBar.style.width = progressPercent + '%';

  q.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.classList.add('option-btn');
    btn.onclick = () => selectOption(btn, q.answer);
    optionsContainer.appendChild(btn);
  });

  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timer);
      lockOptions();
      resultDiv.textContent = `⏰ Tiempo agotado. Respuesta correcta: ${q.answer}`;
      answersSummary.push({ question: q.question, correctAnswer: q.answer, userAnswer: null, correct: false });
      nextBtn.style.display = 'inline-block';
    }
  }, 1000);

  const audioBtn = document.getElementById('audioBtn');
  audioBtn.addEventListener('click', () => {
  const textToSpeak = document.getElementById('questionText').textContent.trim();

  if (!textToSpeak) {
    alert("No hay pregunta para leer.");
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(textToSpeak);
  utterance.lang = 'en-EN';
  utterance.rate = 1;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
});
}

function updateTimerDisplay() {
  timerDisplay.textContent = `Tiempo: ${timeLeft}s`;
}

function lockOptions() {
  const correctAnswer = selectedQuestions[currentQuestion].answer;
  document.querySelectorAll('.option-btn').forEach(b => {
    b.disabled = true;
    b.style.opacity = '0.7';
    if (b.textContent === correctAnswer) b.classList.add('correct');
  });
}

function selectOption(button, correctAnswer) {
  clearInterval(timer);
  document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);

  if (button.textContent === correctAnswer) {
    score++;
    button.classList.add('correct');
    resultDiv.style.textAlign = 'center';
    resultDiv.textContent = "✅ Correcto!";
  } else {
    button.classList.add('wrong');
    resultDiv.textContent = `❌ Incorrecto! La respuesta correcta era: ${correctAnswer}`;
    document.querySelectorAll('.option-btn').forEach(b => {
      if (b.textContent === correctAnswer) b.classList.add('correct');
    });
  }

  answersSummary.push({
    question: selectedQuestions[currentQuestion].question,
    correctAnswer,
    userAnswer: button.textContent,
    correct: button.textContent === correctAnswer
  });

  nextBtn.style.display = 'inline-block';
}

nextBtn.addEventListener('click', () => {
  currentQuestion++;
  if (currentQuestion < totalQuestions) {
    showQuestion();
  } else {
    showSummary();
  }
});

restartBtn.addEventListener('click', () => {
  startQuiz();
});

function showSummary() {
  progressBar.style.width = '100%';
  questionText.textContent = '';
  optionsContainer.innerHTML = '';
  timerDisplay.textContent = '';
  nextBtn.style.display = 'none';
  restartBtn.style.display = 'inline-block';

  let html = `<h2>Resumen</h2>`;
  html += `<p>Has respondido ${score} de ${totalQuestions} correctamente.</p>`;
  html += `<p>Puntuación total: ${score * 100} puntos.</p>`;
  html += '<ul>';
  answersSummary.forEach((item, idx) => {
  html += `<li class="${item.correct ? 'correct' : 'incorrect'}">
    <strong>Q${idx + 1}:</strong> ${item.question} <br/>
    Tu respuesta: ${item.userAnswer || 'Sin respuesta'} <br/>
    Correcta: ${item.correctAnswer} <br/>
    Estado: ${item.correct ? 'Correcto' : 'Incorrecto'}
  </li>`;
});
  html += '</ul>';

  summaryDiv.innerHTML = html;

  // Obtener token del localStorage
  const token = (localStorage.getItem('token') || '').trim();
  if (!token) {
    alert('No has iniciado sesión. Serás redirigido al login.');
    window.location.href = '/index.html';
    return;
  }

  // Guardar puntaje y manejar errores de autorización
  saveGameSession(token, 'Quiz Game', score * 50)
    .then(() => console.log('Puntuación guardada correctamente'))
    .catch(e => {
      alert('Error guardando puntuación: ' + e.message);
      if (e.message.toLowerCase().includes('unauthorized')) {
        localStorage.clear();
         window.location.href = '/index.html';
      }
    });
}

// Iniciar quiz automáticamente
startQuiz();
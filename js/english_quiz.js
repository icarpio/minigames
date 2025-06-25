import { saveGameSession } from './api.js'; 
import { english_questions } from './eng_questions.js';

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
const timePerQuestion = 15;
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
const englandImageDiv = document.getElementById('englandImage');
const audioBtn = document.getElementById('audioBtn');

// Función para mezclar arrays (Fisher-Yates)
function shuffleArray(array) {
  let arr = [...array];
  for (let i = arr.length -1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i +1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
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

  const all = Object.values(english_questions).flat();
  selectedQuestions = shuffleArray(all).slice(0, totalQuestions);

  showQuestion();
}

// Función para obtener la voz inglesa disponible
function getEnglishVoice() {
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  let voice = voices.find(v => v.lang.startsWith('en-US'));
  if (!voice) voice = voices.find(v => v.lang.startsWith('en-GB'));
  if (!voice) voice = voices.find(v => v.lang.startsWith('en'));
  if (!voice) voice = voices[0];
  return voice;
}

function speakText(text) {
  if (!text) {
    alert("No hay pregunta para leer.");
    return;
  }
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const voice = getEnglishVoice();
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    utterance.lang = 'en-US';
  }
  utterance.rate = 1;
  utterance.pitch = 1;

  window.speechSynthesis.speak(utterance);
}

// Asignar listener al botón de audio solo una vez
audioBtn.onclick = () => {
  const textToSpeak = questionText.textContent.trim();
  speakText(textToSpeak);
};

function showQuestion() {
  clearInterval(timer);
  timeLeft = timePerQuestion;
  updateTimerDisplay();

  const q = selectedQuestions[currentQuestion];
  questionText.innerText = `${currentQuestion + 1}: ${q.question}`;

  if (englandImages && englandImages.length > 0) {
    const randomImage = englandImages[Math.floor(Math.random() * englandImages.length)];
    englandImageDiv.innerHTML = `<img src="${randomImage}" alt="Inglaterra" style="max-width: 100px; display: block; margin: 0 auto 15px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">`;
  } else {
    englandImageDiv.innerHTML = '';
  }

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

  // Ocultar opciones para que no ocupen espacio y el resumen pueda crecer
  optionsContainer.style.display = 'none';
  optionsContainer.innerHTML = '';

  timerDisplay.textContent = '';
  nextBtn.style.display = 'none';
  restartBtn.style.display = 'inline-block';

  let html = `<h2>Resumen</h2>`;
  html += `<p>Has respondido ${score} de ${totalQuestions} correctamente.</p>`;
  html += `<p>Puntuación total: ${score * 10} puntos.</p>`;
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
  saveGameSession(token, 'English Quiz', score * 10)
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

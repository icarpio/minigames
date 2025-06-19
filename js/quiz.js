import { saveGameSession } from './api.js'; 
import { allQuestions } from './questions.js';

const totalQuestions = 10;
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
const questionText = document.getElementById('question');
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
  const all = Object.values(allQuestions).flat();
  selectedQuestions = shuffleArray([...all]).slice(0, totalQuestions);

  showQuestion();
}

function showQuestion() {
  clearInterval(timer);
  timeLeft = timePerQuestion;
  updateTimerDisplay();

  const q = selectedQuestions[currentQuestion];
  questionText.textContent = `Pregunta ${currentQuestion + 1}: ${q.question}`;
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
    window.location.href = '../index.html';
    return;
  }

  // Guardar puntaje y manejar errores de autorización
  saveGameSession(token, 'Quiz Game', score * 10)
    .then(() => console.log('Puntuación guardada correctamente'))
    .catch(e => {
      alert('Error guardando puntuación: ' + e.message);
      if (e.message.toLowerCase().includes('unauthorized')) {
        localStorage.clear();
        window.location.href = '../index.html';
      }
    });
}

// Iniciar quiz automáticamente
startQuiz();

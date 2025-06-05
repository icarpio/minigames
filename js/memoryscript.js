// Importa la función saveGameSession desde tu archivo api.js
import { saveGameSession } from './api.js';  // Ajusta la ruta si es necesario

// Inicialización de variables
let turnedButtons = 0;
let firstResult = null;
let secondResult = null; 
let button01 = null;
let button02 = null;
let successes = 0;
let showSuccesses = document.getElementById('successes');
let timeDisplay = document.getElementById('time');
let timeRemaining = 50; // Tiempo inicial en segundos
let timer = null;  // Temporizador

// Array de imágenes
let images = [
    "../assets/img/img1.png", "../assets/img/img1.png",
    "../assets/img/img2.png", "../assets/img/img2.png",
    "../assets/img/img3.png", "../assets/img/img3.png",
    "../assets/img/img4.png", "../assets/img/img4.png",
    "../assets/img/img5.png", "../assets/img/img5.png",
    "../assets/img/img6.png", "../assets/img/img6.png",
    "../assets/img/img7.png", "../assets/img/img7.png",
    "../assets/img/img8.png", "../assets/img/img8.png"
];

// Mezclamos las imágenes aleatoriamente
images = images.sort(() => Math.random() - 0.5);

// Función para iniciar el temporizador
function startTimer() {
    if (timer !== null) return;

    timer = setInterval(function() {
        if (timeRemaining > 0) {
            timeRemaining--;
            timeDisplay.innerHTML = `Tiempo restante: ${timeRemaining} seg`;
        } else {
            clearInterval(timer);
            timer = null;
            endGame();
        }
    }, 1000);
}

// Función para finalizar el juego cuando se acaba el tiempo
function endGame() {
    let buttons = document.querySelectorAll('button');
    buttons.forEach(button => button.disabled = true);

    alert(`¡Se acabó el tiempo! Tu puntuación final es: ${successes} aciertos.`);
    showSuccesses.innerHTML = `Número de aciertos: ${successes}`;
}

// Función para destapar el contenido de los botones
function spin(id) {
    if (turnedButtons === 0) {
        startTimer();
    }

    turnedButtons++;

    if(turnedButtons === 1) {
        button01 = document.getElementById(id);
        firstResult = images[id];
        button01.innerHTML = `<img src="${firstResult}" alt="Imagen" />`;
        button01.disabled = true;
    }
    else if(turnedButtons === 2) {
        button02 = document.getElementById(id);
        secondResult = images[id];
        button02.innerHTML = `<img src="${secondResult}" alt="Imagen" />`;
        button02.disabled = true;

        if(firstResult == secondResult) {
            turnedButtons = 0;
            successes++;
            showSuccesses.innerHTML = `Número de aciertos: ${successes}`;

            if (successes === 8) {
                clearInterval(timer);

                // Guardar puntuación al ganar
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

// Función para reiniciar el juego
function restartGame() {
    timeRemaining = 50;
    successes = 0;
    showSuccesses.innerHTML = `Número de aciertos: ${successes}`;
    timeDisplay.innerHTML = `Tiempo restante: ${timeRemaining} seg`;

    let buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.innerHTML = '';
        button.disabled = false;
    });

    clearInterval(timer);
    timer = null;
    startTimer();
}

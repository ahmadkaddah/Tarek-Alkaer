const quizStart = document.getElementById('quiz-start');
const quizQuestions = document.getElementById('quiz-questions');
const quizResults = document.getElementById('quiz-results');
const startBtn = document.getElementById('start-btn');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const currentScoreElement = document.getElementById('current-score');
const totalQuestionsElement = document.getElementById('total-questions');
const timerElement = document.getElementById('timer');
const answerFeedback = document.getElementById('answer-feedback');
const feedbackText = document.getElementById('feedback-text');
const explanation = document.getElementById('explanation');
const nextBtn = document.getElementById('next-btn');
const finalScoreElement = document.getElementById('final-score');
const finalTotalElement = document.getElementById('final-total');
const resultsMessage = document.getElementById('results-message');
const playerNameInput = document.getElementById('player-name');
const saveScoreBtn = document.getElementById('save-score-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const viewLeaderboardBtn = document.getElementById('view-leaderboard-btn');
const leaderboardBody = document.getElementById('leaderboard-body');
const backToTop = document.querySelector('.back-to-top');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

let questions = [];
let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 30;
let selectedOption = null;
let leaderboard = [];

document.addEventListener('DOMContentLoaded', () => {
  loadQuestions();

  loadLeaderboard();

  setupEventListeners();

  window.addEventListener('scroll', handleScroll);
});

function loadQuestions() {
  fetch('quiz-questions.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      questions = data;
      totalQuestionsElement.textContent = questions.length;
      finalTotalElement.textContent = questions.length;
    })
    .catch(error => {
      console.error('Error loading questions:', error);
      alert('حدث خطأ أثناء تحميل الأسئلة. يرجى تحديث الصفحة والمحاولة مرة أخرى.');
    });
}

function loadLeaderboard() {
  const savedLeaderboard = localStorage.getItem('quizLeaderboard');
  if (savedLeaderboard) {
    leaderboard = JSON.parse(savedLeaderboard);
    displayLeaderboard();
  }
}

function displayLeaderboard() {
  leaderboard.sort((a, b) => b.score - a.score);

  const top10 = leaderboard.slice(0, 10);

  leaderboardBody.innerHTML = '';

  top10.forEach((entry, index) => {
    const row = document.createElement('tr');

    row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.name}</td>
            <td>${entry.score}/${entry.total}</td>
            <td>${entry.date}</td>
        `;

    leaderboardBody.appendChild(row);
  });

  if (top10.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = '<td colspan="4">لا توجد نتائج بعد. كن أول من يسجل نتيجة!</td>';
    leaderboardBody.appendChild(row);
  }
}

function setupEventListeners() {
  startBtn.addEventListener('click', startQuiz);

  nextBtn.addEventListener('click', () => {
    answerFeedback.style.display = 'none';
    currentQuestion++;

    if (currentQuestion < questions.length) {
      displayQuestion();
    } else {
      endQuiz();
    }
  });

  saveScoreBtn.addEventListener('click', saveScore);

  playAgainBtn.addEventListener('click', resetQuiz);

  viewLeaderboardBtn.addEventListener('click', () => {
    window.location.href = '#leaderboard';
  });

  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}
function startQuiz() {
  const allQuestions = shuffleArray([...questions]);

  questions = allQuestions.slice(0, 5);

  currentQuestion = 0;
  score = 0;

  currentScoreElement.textContent = score;
  totalQuestionsElement.textContent = questions.length;
  finalTotalElement.textContent = questions.length;

  quizStart.style.display = 'none';
  quizQuestions.style.display = 'block';
  quizResults.style.display = 'none';

  displayQuestion();
}

function displayQuestion() {
  selectedOption = null;

  const question = questions[currentQuestion];

  questionText.textContent = question.question;

  optionsContainer.innerHTML = '';

  question.options.forEach((option, index) => {
    const optionElement = document.createElement('div');
    optionElement.className = 'option';
    optionElement.textContent = option;
    optionElement.dataset.index = index;

    optionElement.addEventListener('click', selectOption);

    optionsContainer.appendChild(optionElement);
  });

  resetTimer();
}

function selectOption() {
  if (selectedOption !== null) return;

  document.querySelectorAll('.option').forEach(option => {
    option.classList.remove('selected');
  });

  this.classList.add('selected');

  selectedOption = parseInt(this.dataset.index);

  clearInterval(timer);

  setTimeout(checkAnswer, 500);
}

function resetTimer() {
  clearInterval(timer);

  timeLeft = 30;
  timerElement.textContent = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;

    if (timeLeft <= 5) {
      timerElement.style.color = '#F44336';
    } else {
      timerElement.style.color = '';
    }

    if (timeLeft <= 0) {
      clearInterval(timer);
      timeOut();
    }
  }, 1000);
}

function timeOut() {
  feedbackText.textContent = 'انتهى الوقت!';
  feedbackText.className = 'feedback-text incorrect';
  explanation.textContent = questions[currentQuestion].explanation;
  answerFeedback.style.display = 'flex';

  const options = document.querySelectorAll('.option');
  options[questions[currentQuestion].correctAnswer].classList.add('correct');
}

function checkAnswer() {
  const correctIndex = questions[currentQuestion].correctAnswer;
  const options = document.querySelectorAll('.option');

  options[correctIndex].classList.add('correct');

  if (selectedOption === correctIndex) {
    score++;
    currentScoreElement.textContent = score;

    feedbackText.textContent = 'إجابة صحيحة!';
    feedbackText.className = 'feedback-text correct';
  } else {
    if (selectedOption !== null) {
      options[selectedOption].classList.add('incorrect');
    }

    feedbackText.textContent = 'إجابة خاطئة!';
    feedbackText.className = 'feedback-text incorrect';
  }

  explanation.textContent = questions[currentQuestion].explanation;

  answerFeedback.style.display = 'flex';
}

function endQuiz() {
  quizQuestions.style.display = 'none';
  quizResults.style.display = 'block';

  finalScoreElement.textContent = score;

  const percentage = (score / questions.length) * 100;
  let message = '';

  if (percentage >= 90) {
    message = 'ممتاز! أنت عالم في الدين الإسلامي!';
  } else if (percentage >= 70) {
    message = 'جيد جداً! معلوماتك الدينية قوية!';
  } else if (percentage >= 50) {
    message = 'جيد! استمر في تعلم المزيد عن الدين الإسلامي.';
  } else {
    message = 'لا بأس، استمر في التعلم وحاول مرة أخرى!';
  }

  resultsMessage.textContent = message;
}

function saveScore() {
  const playerName = playerNameInput.value.trim();

  if (!playerName) {
    alert('الرجاء إدخال اسمك!');
    return;
  }

  const newEntry = {
    name: playerName,
    score: score,
    total: questions.length,
    date: new Date().toLocaleDateString('ar-SA')
  };

  leaderboard.push(newEntry);

  localStorage.setItem('quizLeaderboard', JSON.stringify(leaderboard));

  displayLeaderboard();

  alert('تم حفظ النتيجة بنجاح!');

  playerNameInput.value = '';

  saveScoreBtn.disabled = true;
}

function resetQuiz() {
  currentQuestion = 0;
  score = 0;

  questions = shuffleArray(questions);

  currentScoreElement.textContent = score;

  quizResults.style.display = 'none';
  quizStart.style.display = 'block';

  saveScoreBtn.disabled = false;
}

function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function handleScroll() {
  if (window.pageYOffset > 300) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}

backToTop.addEventListener('click', function (e) {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});
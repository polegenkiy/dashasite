// =====================================================
// ТЕКСТИ ТА ЗАПИТАННЯ — редагуйте тут
// Кожне запитання: текст + варіанти. У кожного варіанта є реакція,
// яка з'являється після натискання. Запитань і варіантів може бути скільки завгодно.
// Якщо QUESTIONS порожній ([]), екран із запитаннями буде пропущено.
// =====================================================
const QUESTIONS = [
  {
    text: "Який зараз місяць?",
    options: [
      { label: "Жовтень", reaction: "Молодець, вгадала!<3" },
      { label: "Листопад", reaction: "Завтра." },
    ],
  },
  {
    text: "Скільки буде 2+2?",
    options: [
      { label: "4", reaction: "Розумничка моя!" },
      { label: "2²", reaction: "Хороший варіант, молодець" },
      { label: "67", reaction: "СЫГС СЭВАААН" },
    ],
  },
  {
    text: "Якщо Владька буде забагато вибачатись, то що буде?",
    options: [
      { label: "Буде приємно що він за тебе переживає", reaction: "хы" },
      { label: "Пропіздона получить", reaction: "улаулаа" },
    ],
  },
  {
    text: "хто найкрасивіша дівчинка на світі?",
    options: [
      { label: "Дашуля", reaction: "Це правда." },
      { label: "Будь хто крім неї", reaction: "Ти в мене щас таких піздюлєй получиш шо дай боже" },
    ],
  },
  {
    text: "Як ти відреагуєш якщо я пострижусь налисо?",
    options: [
      { label: '"Йди ти нахуй"', reaction: "Поняв" },
      { label: "Який ти лєв внатурі", reaction: "Ти не це хотіла натиснути" },
    ],
  },
];

// Скільки мс відкривається конверт, перш ніж з'явиться фінал.
// Має збігатися з тривалістю transition у .envelope-flap (style.css).
const ENVELOPE_OPEN_MS = 900;

// =====================================================
// ЛОГІКА — зазвичай чіпати не потрібно
// =====================================================
const byId = (id) => document.getElementById(id);

const screens = {
  start: byId("screen-start"),
  quiz: byId("screen-quiz"),
  envelope: byId("screen-envelope"),
  final: byId("screen-final"),
};
const progressEl = byId("quiz-progress");
const questionEl = byId("quiz-question");
const optionsEl = byId("quiz-options");
const reactionEl = byId("quiz-reaction");
const nextBtn = byId("btn-next");
const envelopeBtn = byId("btn-open");

let currentQuestion = 0;

// Показує один екран і ховає решту
function showScreen(name) {
  for (const key in screens) {
    screens[key].classList.toggle("is-active", key === name);
  }
  window.scrollTo(0, 0);
}

// Малює поточне запитання та кнопки з варіантами
function renderQuestion() {
  const question = QUESTIONS[currentQuestion];
  progressEl.textContent = `${currentQuestion + 1} / ${QUESTIONS.length}`;
  questionEl.textContent = question.text;
  reactionEl.textContent = "";
  nextBtn.hidden = true;
  optionsEl.replaceChildren();

  for (const option of question.options) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-option";
    button.textContent = option.label;
    button.addEventListener("click", () => chooseOption(button, option));
    optionsEl.append(button);
  }
}

// Після вибору: блокуємо інші варіанти, показуємо реакцію та кнопку «Далі»
function chooseOption(chosenButton, option) {
  for (const button of optionsEl.children) button.disabled = true;
  chosenButton.classList.add("is-chosen");
  reactionEl.textContent = option.reaction;
  nextBtn.hidden = false;
}

byId("btn-start").addEventListener("click", () => {
  currentQuestion = 0;
  if (QUESTIONS.length === 0) {
    showScreen("envelope");
    return;
  }
  renderQuestion();
  showScreen("quiz");
});

nextBtn.addEventListener("click", () => {
  currentQuestion += 1;
  if (currentQuestion < QUESTIONS.length) {
    renderQuestion();
  } else {
    showScreen("envelope");
  }
});

envelopeBtn.addEventListener("click", () => {
  if (envelopeBtn.classList.contains("is-open")) return; // захист від подвійного натискання
  envelopeBtn.classList.add("is-open");
  setTimeout(() => showScreen("final"), ENVELOPE_OPEN_MS);
});

byId("btn-restart").addEventListener("click", () => {
  envelopeBtn.classList.remove("is-open");
  showScreen("start");
});

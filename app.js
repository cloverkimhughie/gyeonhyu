const WORDS = [
  { cn:"你好", py:"nǐ hǎo", ko:"안녕하세요" },
  { cn:"谢谢", py:"xièxie", ko:"감사합니다" },
  { cn:"学习", py:"xuéxí", ko:"공부하다" },
  { cn:"历史", py:"lìshǐ", ko:"역사" },
  { cn:"朋友", py:"péngyou", ko:"친구" },
  { cn:"中国", py:"Zhōngguó", ko:"중국" },
  { cn:"喜欢", py:"xǐhuan", ko:"좋아하다" },
  { cn:"问题", py:"wèntí", ko:"문제, 질문" },
  { cn:"时间", py:"shíjiān", ko:"시간" },
  { cn:"开始", py:"kāishǐ", ko:"시작하다" },
  { cn:"了解", py:"liǎojiě", ko:"이해하다, 알다" },
  { cn:"文化", py:"wénhuà", ko:"문화" }
];

const state = {
  queue: [],
  index: 0,
  correct: 0,
  answered: 0,
  combo: 0,
  wrong: [],
  sound: true,
  mode: "choice"
};

const $ = (id) => document.getElementById(id);
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

function start(words = WORDS) {
  state.queue = shuffle(words).slice(0, Math.min(10, words.length));
  state.index = state.correct = state.answered = state.combo = 0;
  state.wrong = [];
  $("result").classList.add("hidden");
  $("quiz").classList.remove("hidden");
  render();
}

function render() {
  const word = state.queue[state.index];
  const total = state.queue.length;
  const isTyping = state.index % 3 === 2;
  state.mode = isTyping ? "typing" : "choice";
  $("progressText").textContent = `${state.index} / ${total}`;
  $("comboText").textContent = state.combo;
  $("accuracyText").textContent = state.answered ? Math.round(state.correct / state.answered * 100) + "%" : "0%";
  $("progressBar").style.width = (state.index / total * 100) + "%";
  $("feedback").textContent = "";
  $("feedback").className = "feedback";
  $("nextBtn").classList.add("hidden");
  $("prompt").textContent = word.cn;
  $("pinyin").textContent = word.py;

  $("answers").innerHTML = "";
  $("typingForm").classList.toggle("hidden", !isTyping);
  $("answers").classList.toggle("hidden", isTyping);

  if (isTyping) {
    $("questionType").textContent = "한국어 → 중국어";
    $("prompt").textContent = word.ko;
    $("pinyin").textContent = "중국어 단어를 입력하세요";
    $("typingInput").value = "";
    setTimeout(() => $("typingInput").focus(), 50);
  } else {
    $("questionType").textContent = "중국어 → 한국어";
    const options = shuffle([word.ko, ...shuffle(WORDS.filter(w => w.cn !== word.cn)).slice(0,3).map(w => w.ko)]);
    options.forEach(option => {
      const button = document.createElement("button");
      button.className = "answer";
      button.textContent = option;
      button.onclick = () => check(option === word.ko, button);
      $("answers").appendChild(button);
    });
  }
}

function check(ok, clicked) {
  if ($("nextBtn").classList.contains("hidden") === false) return;
  state.answered++;
  if (ok) {
    state.correct++;
    state.combo++;
    if (clicked) clicked.classList.add("correct");
    $("feedback").textContent = state.combo >= 3 ? `정답! 🔥 ${state.combo}콤보` : "정답! 잘했어요.";
    $("feedback").className = "feedback good";
  } else {
    state.combo = 0;
    state.wrong.push(state.queue[state.index]);
    if (clicked) clicked.classList.add("wrong");
    $("feedback").textContent = `아쉬워요. 정답은 “${state.queue[state.index].ko}”입니다.`;
    $("feedback").className = "feedback bad";
  }
  document.querySelectorAll(".answer").forEach(b => b.disabled = true);
  $("nextBtn").classList.remove("hidden");
  $("comboText").textContent = state.combo;
  $("accuracyText").textContent = Math.round(state.correct / state.answered * 100) + "%";
}

$("typingForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = $("typingInput").value.trim().replaceAll(" ", "");
  const answer = state.queue[state.index].cn.replaceAll(" ", "");
  check(input === answer);
});

$("nextBtn").onclick = () => {
  state.index++;
  if (state.index >= state.queue.length) finish();
  else render();
};

$("speakBtn").onclick = speakCurrent;
$("soundToggle").onclick = () => {
  state.sound = !state.sound;
  $("soundToggle").textContent = state.sound ? "🔊" : "🔇";
};

function speakCurrent() {
  if (!state.sound || !("speechSynthesis" in window)) return;
  const text = state.queue[state.index]?.cn;
  if (!text) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = 0.85;
  speechSynthesis.speak(utterance);
}

function finish() {
  $("quiz").classList.add("hidden");
  $("result").classList.remove("hidden");
  $("progressBar").style.width = "100%";
  const accuracy = state.answered ? Math.round(state.correct / state.answered * 100) : 0;
  $("resultSummary").textContent = `${state.answered}문제 중 ${state.correct}문제를 맞혔어요. 정확도 ${accuracy}% · 오답 ${state.wrong.length}개`;
  $("reviewBtn").classList.toggle("hidden", state.wrong.length === 0);
}

$("reviewBtn").onclick = () => start(state.wrong);
$("restartBtn").onclick = () => start(WORDS);
start();
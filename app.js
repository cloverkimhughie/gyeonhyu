const LESSONS = [
  {
    ko: "나는 매일 중국어를 공부해.",
    zh: "我每天学习中文。",
    before: "我每天",
    answer: "学习",
    after: "中文。",
    pinyin: "xuéxí",
    meaning: "공부하다, 배우다",
    sentencePinyin: "Wǒ měitiān xuéxí Zhōngwén.",
    level: "기초"
  },
  {
    ko: "나는 중국 역사를 아주 좋아해.",
    zh: "我很喜欢中国历史。",
    before: "我很",
    answer: "喜欢",
    after: "中国历史。",
    pinyin: "xǐhuan",
    meaning: "좋아하다",
    sentencePinyin: "Wǒ hěn xǐhuan Zhōngguó lìshǐ.",
    level: "기초"
  },
  {
    ko: "그는 나의 좋은 친구야.",
    zh: "他是我的好朋友。",
    before: "他是我的好",
    answer: "朋友",
    after: "。",
    pinyin: "péngyou",
    meaning: "친구",
    sentencePinyin: "Tā shì wǒ de hǎo péngyou.",
    level: "기초"
  },
  {
    ko: "나는 이 문제를 이해하지 못해.",
    zh: "我不明白这个问题。",
    before: "我不明白这个",
    answer: "问题",
    after: "。",
    pinyin: "wèntí",
    meaning: "문제, 질문",
    sentencePinyin: "Wǒ bù míngbai zhège wèntí.",
    level: "기초"
  },
  {
    ko: "지금 수업을 시작합시다.",
    zh: "我们现在开始上课吧。",
    before: "我们现在",
    answer: "开始",
    after: "上课吧。",
    pinyin: "kāishǐ",
    meaning: "시작하다",
    sentencePinyin: "Wǒmen xiànzài kāishǐ shàngkè ba.",
    level: "기초"
  },
  {
    ko: "나는 중국 문화를 더 알고 싶어.",
    zh: "我想更了解中国文化。",
    before: "我想更",
    answer: "了解",
    after: "中国文化。",
    pinyin: "liǎojiě",
    meaning: "이해하다, 알아보다",
    sentencePinyin: "Wǒ xiǎng gèng liǎojiě Zhōngguó wénhuà.",
    level: "기초"
  },
  {
    ko: "우리는 시간이 별로 없어.",
    zh: "我们的时间不多。",
    before: "我们的",
    answer: "时间",
    after: "不多。",
    pinyin: "shíjiān",
    meaning: "시간",
    sentencePinyin: "Wǒmen de shíjiān bù duō.",
    level: "기초"
  },
  {
    ko: "선생님께서 우리에게 새로운 단어를 설명해 주셨어.",
    zh: "老师给我们解释了一个新词。",
    before: "老师给我们",
    answer: "解释",
    after: "了一个新词。",
    pinyin: "jiěshì",
    meaning: "설명하다",
    sentencePinyin: "Lǎoshī gěi wǒmen jiěshì le yí ge xīn cí.",
    level: "초급"
  },
  {
    ko: "나는 내일 도서관에 갈 계획이야.",
    zh: "我打算明天去图书馆。",
    before: "我",
    answer: "打算",
    after: "明天去图书馆。",
    pinyin: "dǎsuàn",
    meaning: "계획하다, ~할 생각이다",
    sentencePinyin: "Wǒ dǎsuàn míngtiān qù túshūguǎn.",
    level: "초급"
  },
  {
    ko: "이 책은 중국의 전통문화를 소개해.",
    zh: "这本书介绍中国的传统文化。",
    before: "这本书",
    answer: "介绍",
    after: "中国的传统文化。",
    pinyin: "jièshào",
    meaning: "소개하다",
    sentencePinyin: "Zhè běn shū jièshào Zhōngguó de chuántǒng wénhuà.",
    level: "초급"
  },
  {
    ko: "나는 그의 의견에 동의해.",
    zh: "我同意他的意见。",
    before: "我",
    answer: "同意",
    after: "他的意见。",
    pinyin: "tóngyì",
    meaning: "동의하다",
    sentencePinyin: "Wǒ tóngyì tā de yìjiàn.",
    level: "초급"
  },
  {
    ko: "우리는 이 문제를 함께 해결해야 해.",
    zh: "我们应该一起解决这个问题。",
    before: "我们应该一起",
    answer: "解决",
    after: "这个问题。",
    pinyin: "jiějué",
    meaning: "해결하다",
    sentencePinyin: "Wǒmen yīnggāi yìqǐ jiějué zhège wèntí.",
    level: "초급"
  }
];

const state = {
  queue: [],
  index: 0,
  correct: 0,
  answered: 0,
  combo: 0,
  wrong: [],
  sound: true,
  locked: false
};

const $ = (id) => document.getElementById(id);
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

function start(items = LESSONS) {
  const uniqueItems = [...new Set(items)];
  state.queue = shuffle(uniqueItems).slice(0, Math.min(10, uniqueItems.length));
  state.index = 0;
  state.correct = 0;
  state.answered = 0;
  state.combo = 0;
  state.wrong = [];
  state.locked = false;

  $("result").classList.add("hidden");
  $("quiz").classList.remove("hidden");
  render();
}

function render() {
  const item = state.queue[state.index];
  const total = state.queue.length;

  state.locked = false;

  $("progressText").textContent = `${state.index + 1} / ${total}`;
  $("comboText").textContent = state.combo;
  $("accuracyText").textContent = state.answered
    ? Math.round((state.correct / state.answered) * 100) + "%"
    : "0%";
  $("progressBar").style.width = (state.index / total) * 100 + "%";

  $("levelBadge").textContent = item.level;
  $("koSentence").textContent = item.ko;
  $("zhBefore").textContent = item.before;
  $("blankWord").textContent = "□".repeat(Math.max(1, item.answer.length));
  $("blankWord").classList.remove("revealed");
  $("zhAfter").textContent = item.after;

  $("sentencePinyin").textContent = "";
  $("sentencePinyin").classList.add("hidden");

  $("answerInput").value = "";
  $("answerInput").disabled = false;
  $("submitBtn").disabled = false;

  $("hintBtn").disabled = false;
  $("giveUpBtn").disabled = false;
  $("hintText").textContent = "";
  $("hintText").classList.add("hidden");

  $("feedback").textContent = "";
  $("feedback").className = "feedback hidden";
  $("answerDetail").classList.add("hidden");
  $("speakBtn").classList.add("hidden");
  $("nextBtn").classList.add("hidden");

  setTimeout(() => $("answerInput").focus(), 50);
}

function normalize(value) {
  return value
    .trim()
    .replace(/\s+/g, "")
    .replace(/[，。！？,.!?]/g, "");
}

function checkAnswer(forceWrong = false) {
  if (state.locked) return;

  const item = state.queue[state.index];
  const typed = normalize($("answerInput").value);
  const target = normalize(item.answer);

  if (!forceWrong && !typed) {
    $("answerInput").focus();
    return;
  }

  const isCorrect = !forceWrong && typed === target;
  state.locked = true;
  state.answered++;

  if (isCorrect) {
    state.correct++;
    state.combo++;
    $("feedback").textContent =
      state.combo >= 3
        ? `정답! 🔥 ${state.combo}연속 정답`
        : "정답! 문맥에 맞는 단어를 잘 떠올렸어요.";
    $("feedback").className = "feedback good";
  } else {
    state.combo = 0;
    if (!state.wrong.includes(item)) state.wrong.push(item);
    $("feedback").textContent = forceWrong
      ? `정답은 “${item.answer}”입니다.`
      : `아쉬워요. 빈칸에는 “${item.answer}”가 들어갑니다.`;
    $("feedback").className = "feedback bad";
  }

  $("blankWord").textContent = item.answer;
  $("blankWord").classList.add("revealed");
  $("sentencePinyin").textContent = item.sentencePinyin;
  $("sentencePinyin").classList.remove("hidden");

  $("answerWord").textContent = item.answer;
  $("answerPinyin").textContent = item.pinyin;
  $("answerMeaning").textContent = item.meaning;
  $("answerDetail").classList.remove("hidden");

  $("answerInput").disabled = true;
  $("submitBtn").disabled = true;
  $("hintBtn").disabled = true;
  $("giveUpBtn").disabled = true;
  $("speakBtn").classList.remove("hidden");
  $("nextBtn").classList.remove("hidden");

  $("comboText").textContent = state.combo;
  $("accuracyText").textContent =
    Math.round((state.correct / state.answered) * 100) + "%";
  $("progressBar").style.width =
    ((state.index + 1) / state.queue.length) * 100 + "%";
}

$("answerForm").addEventListener("submit", (event) => {
  event.preventDefault();
  checkAnswer(false);
});

$("hintBtn").addEventListener("click", () => {
  if (state.locked) return;
  const item = state.queue[state.index];
  $("hintText").textContent = `병음 힌트: ${item.pinyin}`;
  $("hintText").classList.remove("hidden");
  $("hintBtn").disabled = true;
  $("answerInput").focus();
});

$("giveUpBtn").addEventListener("click", () => {
  checkAnswer(true);
});

$("nextBtn").addEventListener("click", () => {
  state.index++;
  if (state.index >= state.queue.length) finish();
  else render();
});

$("soundToggle").addEventListener("click", () => {
  state.sound = !state.sound;
  $("soundToggle").textContent = state.sound ? "🔊" : "🔇";
  $("soundToggle").setAttribute(
    "aria-label",
    state.sound ? "소리 끄기" : "소리 켜기"
  );
});

$("speakBtn").addEventListener("click", speakCurrentSentence);

function speakCurrentSentence() {
  if (!state.sound || !("speechSynthesis" in window)) return;

  const item = state.queue[state.index];
  if (!item) return;

  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(item.zh);
  utterance.lang = "zh-CN";
  utterance.rate = 0.82;
  speechSynthesis.speak(utterance);
}

function finish() {
  $("quiz").classList.add("hidden");
  $("result").classList.remove("hidden");
  $("progressBar").style.width = "100%";

  const accuracy = state.answered
    ? Math.round((state.correct / state.answered) * 100)
    : 0;

  $("resultSummary").textContent =
    `${state.answered}문장 중 ${state.correct}문장을 맞혔어요. 정답률 ${accuracy}% · 복습할 단어 ${state.wrong.length}개`;

  $("reviewBtn").classList.toggle("hidden", state.wrong.length === 0);
}

$("reviewBtn").addEventListener("click", () => start(state.wrong));
$("restartBtn").addEventListener("click", () => start(LESSONS));

start();
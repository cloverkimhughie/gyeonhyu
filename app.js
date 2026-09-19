const LESSONS = [
  { ko: "나는 매일 중국어를 공부해.", zh: "我每天学习中文。", before: "我每天", answer: "学习", after: "中文。", pinyin: "xuéxí", meaning: "공부하다, 배우다", sentencePinyin: "Wǒ měitiān xuéxí Zhōngwén.", level: "기초" },
  { ko: "나는 중국 역사를 아주 좋아해.", zh: "我很喜欢中国历史。", before: "我很", answer: "喜欢", after: "中国历史。", pinyin: "xǐhuan", meaning: "좋아하다", sentencePinyin: "Wǒ hěn xǐhuan Zhōngguó lìshǐ.", level: "기초" },
  { ko: "그는 나의 좋은 친구야.", zh: "他是我的好朋友。", before: "他是我的好", answer: "朋友", after: "。", pinyin: "péngyou", meaning: "친구", sentencePinyin: "Tā shì wǒ de hǎo péngyou.", level: "기초" },
  { ko: "나는 이 문제를 이해하지 못해.", zh: "我不明白这个问题。", before: "我不明白这个", answer: "问题", after: "。", pinyin: "wèntí", meaning: "문제, 질문", sentencePinyin: "Wǒ bù míngbai zhège wèntí.", level: "기초" },
  { ko: "지금 수업을 시작합시다.", zh: "我们现在开始上课吧。", before: "我们现在", answer: "开始", after: "上课吧。", pinyin: "kāishǐ", meaning: "시작하다", sentencePinyin: "Wǒmen xiànzài kāishǐ shàngkè ba.", level: "기초" },
  { ko: "나는 중국 문화를 더 알고 싶어.", zh: "我想更了解中国文化。", before: "我想更", answer: "了解", after: "中国文化。", pinyin: "liǎojiě", meaning: "이해하다, 알아보다", sentencePinyin: "Wǒ xiǎng gèng liǎojiě Zhōngguó wénhuà.", level: "기초" },
  { ko: "우리는 시간이 별로 없어.", zh: "我们的时间不多。", before: "我们的", answer: "时间", after: "不多。", pinyin: "shíjiān", meaning: "시간", sentencePinyin: "Wǒmen de shíjiān bù duō.", level: "기초" },
  { ko: "선생님께서 우리에게 새로운 단어를 설명해 주셨어.", zh: "老师给我们解释了一个新词。", before: "老师给我们", answer: "解释", after: "了一个新词。", pinyin: "jiěshì", meaning: "설명하다", sentencePinyin: "Lǎoshī gěi wǒmen jiěshì le yí ge xīn cí.", level: "초급" },
  { ko: "나는 내일 도서관에 갈 계획이야.", zh: "我打算明天去图书馆。", before: "我", answer: "打算", after: "明天去图书馆。", pinyin: "dǎsuàn", meaning: "계획하다, ~할 생각이다", sentencePinyin: "Wǒ dǎsuàn míngtiān qù túshūguǎn.", level: "초급" },
  { ko: "이 책은 중국의 전통문화를 소개해.", zh: "这本书介绍中国的传统文化。", before: "这本书", answer: "介绍", after: "中国的传统文化。", pinyin: "jièshào", meaning: "소개하다", sentencePinyin: "Zhè běn shū jièshào Zhōngguó de chuántǒng wénhuà.", level: "초급" },
  { ko: "나는 그의 의견에 동의해.", zh: "我同意他的意见。", before: "我", answer: "同意", after: "他的意见。", pinyin: "tóngyì", meaning: "동의하다", sentencePinyin: "Wǒ tóngyì tā de yìjiàn.", level: "초급" },
  { ko: "우리는 이 문제를 함께 해결해야 해.", zh: "我们应该一起解决这个问题。", before: "我们应该一起", answer: "解决", after: "这个问题。", pinyin: "jiějué", meaning: "해결하다", sentencePinyin: "Wǒmen yīnggāi yìqǐ jiějué zhège wèntí.", level: "초급" }
];

const STORAGE_KEY = "gyeonhyu_custom_lessons_v1";
const $ = (id) => document.getElementById(id);
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const state = {
  queue: [], index: 0, correct: 0, answered: 0, combo: 0,
  wrong: [], sound: true, locked: false, sourceMode: "all"
};

function getCustomLessons() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(stored) ? stored.filter(isValidLesson) : [];
  } catch (error) {
    return [];
  }
}

function isValidLesson(item) {
  return item && ["ko", "zh", "before", "answer", "after", "pinyin", "meaning"]
    .every((key) => typeof item[key] === "string");
}

function saveCustomLessons(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    return true;
  } catch (error) {
    showMakerMessage("이 브라우저에서는 문제를 저장할 수 없어요. 저장 공간 설정을 확인해 주세요.");
    return false;
  }
}

function getAllLessons() {
  return [...LESSONS, ...getCustomLessons()];
}

function start(items = getAllLessons(), sourceMode = "all") {
  const uniqueItems = [...new Set(items)];
  if (!uniqueItems.length) return;

  state.queue = shuffle(uniqueItems).slice(0, Math.min(10, uniqueItems.length));
  state.index = 0;
  state.correct = 0;
  state.answered = 0;
  state.combo = 0;
  state.wrong = [];
  state.locked = false;
  state.sourceMode = sourceMode;

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
  $("accuracyText").textContent = state.answered ? Math.round((state.correct / state.answered) * 100) + "%" : "0%";
  $("progressBar").style.width = (state.index / total) * 100 + "%";
  $("levelBadge").textContent = item.level || "기초";
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
  return value.trim().replace(/\s+/g, "").replace(/[，。！？,.!?]/g, "");
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
    $("feedback").textContent = state.combo >= 3 ? `정답! 🔥 ${state.combo}연속 정답` : "정답! 문맥에 맞는 단어를 잘 떠올렸어요.";
    $("feedback").className = "feedback good";
  } else {
    state.combo = 0;
    if (!state.wrong.includes(item)) state.wrong.push(item);
    $("feedback").textContent = forceWrong ? `정답은 “${item.answer}”입니다.` : `아쉬워요. 빈칸에는 “${item.answer}”가 들어갑니다.`;
    $("feedback").className = "feedback bad";
  }

  $("blankWord").textContent = item.answer;
  $("blankWord").classList.add("revealed");
  if (item.sentencePinyin) {
    $("sentencePinyin").textContent = item.sentencePinyin;
    $("sentencePinyin").classList.remove("hidden");
  }
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
  $("accuracyText").textContent = Math.round((state.correct / state.answered) * 100) + "%";
  $("progressBar").style.width = ((state.index + 1) / state.queue.length) * 100 + "%";
}

function finish() {
  $("quiz").classList.add("hidden");
  $("result").classList.remove("hidden");
  $("progressBar").style.width = "100%";
  const accuracy = state.answered ? Math.round((state.correct / state.answered) * 100) : 0;
  $("resultSummary").textContent = `${state.answered}문장 중 ${state.correct}문장을 맞혔어요. 정답률 ${accuracy}% · 복습할 단어 ${state.wrong.length}개`;
  $("reviewBtn").classList.toggle("hidden", state.wrong.length === 0);
}

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

function openMaker() {
  $("studyView").classList.add("hidden");
  $("makerView").classList.remove("hidden");
  renderCustomList();
  updateMakerPreview();
}

function closeMaker() {
  $("makerView").classList.add("hidden");
  $("studyView").classList.remove("hidden");
}

function createPreviewParts(zh, answer) {
  const index = zh.indexOf(answer);
  if (!zh || !answer || index === -1) return null;
  return { before: zh.slice(0, index), after: zh.slice(index + answer.length) };
}

function updateMakerPreview() {
  const zh = $("makerZh").value.trim();
  const answer = $("makerAnswer").value.trim();
  const parts = createPreviewParts(zh, answer);
  const preview = $("makerPreview");
  preview.replaceChildren();

  if (!zh || !answer) {
    preview.textContent = "중국어 문장과 정답 단어를 입력하면 미리보기가 나타나요.";
    preview.classList.remove("ready");
    return;
  }
  if (!parts) {
    preview.textContent = "정답 단어가 중국어 완성 문장에 들어 있지 않아요.";
    preview.classList.remove("ready");
    return;
  }

  const blank = document.createElement("span");
  blank.className = "preview-blank";
  blank.textContent = "□".repeat(Math.max(1, answer.length));
  preview.append(document.createTextNode(parts.before), blank, document.createTextNode(parts.after));
  preview.classList.add("ready");
}

function showMakerMessage(message, success = false) {
  $("makerMessage").textContent = message;
  $("makerMessage").classList.toggle("success", success);
}

function getMakerValues() {
  return {
    ko: $("makerKo").value.trim(),
    zh: $("makerZh").value.trim(),
    answer: $("makerAnswer").value.trim(),
    pinyin: $("makerPinyin").value.trim(),
    meaning: $("makerMeaning").value.trim(),
    level: $("makerLevel").value,
    sentencePinyin: $("makerSentencePinyin").value.trim()
  };
}

function submitMakerForm(event) {
  event.preventDefault();
  const values = getMakerValues();
  const missing = [values.ko, values.zh, values.answer, values.pinyin, values.meaning].some((value) => !value);
  if (missing) {
    showMakerMessage("필수 항목을 모두 입력해 주세요.");
    return;
  }

  const parts = createPreviewParts(values.zh, values.answer);
  if (!parts) {
    showMakerMessage("정답 단어가 중국어 완성 문장에 정확히 들어가야 해요.");
    $("makerAnswer").focus();
    return;
  }
  if (values.zh.indexOf(values.answer) !== values.zh.lastIndexOf(values.answer)) {
    showMakerMessage("정답 단어가 문장에 두 번 이상 있어요. 한 번만 등장하는 단어를 선택해 주세요.");
    return;
  }

  const items = getCustomLessons();
  const editingId = $("editingId").value;
  const lesson = {
    id: editingId || `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    ...values,
    before: parts.before,
    after: parts.after,
    custom: true
  };

  const nextItems = editingId
    ? items.map((item) => item.id === editingId ? lesson : item)
    : [lesson, ...items];

  if (!saveCustomLessons(nextItems)) return;
  const message = editingId ? "문제를 수정했어요." : "새 문제를 저장했어요.";
  resetMakerForm();
  renderCustomList();
  showMakerMessage(message, true);
}

function resetMakerForm() {
  $("makerForm").reset();
  $("editingId").value = "";
  $("saveQuestionBtn").textContent = "문제 저장";
  $("cancelEditBtn").classList.add("hidden");
  showMakerMessage("");
  updateMakerPreview();
}

function editCustomLesson(id) {
  const item = getCustomLessons().find((lesson) => lesson.id === id);
  if (!item) return;
  $("editingId").value = item.id;
  $("makerKo").value = item.ko;
  $("makerZh").value = item.zh;
  $("makerAnswer").value = item.answer;
  $("makerPinyin").value = item.pinyin;
  $("makerMeaning").value = item.meaning;
  $("makerLevel").value = item.level || "기초";
  $("makerSentencePinyin").value = item.sentencePinyin || "";
  $("saveQuestionBtn").textContent = "수정 내용 저장";
  $("cancelEditBtn").classList.remove("hidden");
  showMakerMessage("문제 내용을 수정한 뒤 저장해 주세요.");
  updateMakerPreview();
  $("makerKo").focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteCustomLesson(id) {
  const item = getCustomLessons().find((lesson) => lesson.id === id);
  if (!item || !window.confirm(`“${item.answer}” 문제를 삭제할까요?`)) return;
  const nextItems = getCustomLessons().filter((lesson) => lesson.id !== id);
  if (!saveCustomLessons(nextItems)) return;
  if ($("editingId").value === id) resetMakerForm();
  renderCustomList();
  showMakerMessage("문제를 삭제했어요.", true);
}

function renderCustomList() {
  const items = getCustomLessons();
  const list = $("customList");
  list.replaceChildren();
  $("customCount").textContent = `${items.length}개`;
  $("emptyCustom").classList.toggle("hidden", items.length > 0);
  $("studyCustomBtn").classList.toggle("hidden", items.length === 0);

  items.forEach((item) => {
    const article = document.createElement("article");
    article.className = "custom-item";

    const copy = document.createElement("div");
    copy.className = "custom-item-copy";
    const title = document.createElement("h3");
    title.textContent = item.ko;
    const sentence = document.createElement("p");
    sentence.textContent = `${item.before} □□ ${item.after}`;
    const info = document.createElement("p");
    info.className = "word-info";
    info.textContent = `${item.answer} · ${item.pinyin} · ${item.meaning}`;
    copy.append(title, sentence, info);

    const actions = document.createElement("div");
    actions.className = "item-actions";
    const editButton = document.createElement("button");
    editButton.className = "mini-btn";
    editButton.type = "button";
    editButton.textContent = "수정";
    editButton.setAttribute("aria-label", `${item.answer} 문제 수정`);
    editButton.addEventListener("click", () => editCustomLesson(item.id));
    const deleteButton = document.createElement("button");
    deleteButton.className = "mini-btn delete";
    deleteButton.type = "button";
    deleteButton.textContent = "삭제";
    deleteButton.setAttribute("aria-label", `${item.answer} 문제 삭제`);
    deleteButton.addEventListener("click", () => deleteCustomLesson(item.id));
    actions.append(editButton, deleteButton);
    article.append(copy, actions);
    list.append(article);
  });
}

$("answerForm").addEventListener("submit", (event) => { event.preventDefault(); checkAnswer(false); });
$("hintBtn").addEventListener("click", () => {
  if (state.locked) return;
  $("hintText").textContent = `병음 힌트: ${state.queue[state.index].pinyin}`;
  $("hintText").classList.remove("hidden");
  $("hintBtn").disabled = true;
  $("answerInput").focus();
});
$("giveUpBtn").addEventListener("click", () => checkAnswer(true));
$("nextBtn").addEventListener("click", () => { state.index++; state.index >= state.queue.length ? finish() : render(); });
$("soundToggle").addEventListener("click", () => {
  state.sound = !state.sound;
  $("soundToggle").textContent = state.sound ? "🔊" : "🔇";
  $("soundToggle").setAttribute("aria-label", state.sound ? "소리 끄기" : "소리 켜기");
});
$("speakBtn").addEventListener("click", speakCurrentSentence);
$("reviewBtn").addEventListener("click", () => start(state.wrong, "review"));
$("restartBtn").addEventListener("click", () => start(state.sourceMode === "custom" ? getCustomLessons() : getAllLessons(), state.sourceMode === "custom" ? "custom" : "all"));
$("makerBtn").addEventListener("click", openMaker);
$("backToStudyBtn").addEventListener("click", closeMaker);
$("makerForm").addEventListener("submit", submitMakerForm);
$("makerZh").addEventListener("input", updateMakerPreview);
$("makerAnswer").addEventListener("input", updateMakerPreview);
$("cancelEditBtn").addEventListener("click", resetMakerForm);
$("studyCustomBtn").addEventListener("click", () => {
  const customItems = getCustomLessons();
  if (!customItems.length) return;
  closeMaker();
  start(customItems, "custom");
});

renderCustomList();
start();

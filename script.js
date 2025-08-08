let words = [];
let learned = new Set(JSON.parse(localStorage.getItem('learnedWords') || '[]'));
let wrong = new Set(JSON.parse(localStorage.getItem('wrongWords') || '[]'));
let currentWord = null;

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === 'progress') {
    renderProgress();
  } else if (id === 'study') {
    nextWord();
  } else if (id === 'quiz') {
    nextQuestion();
  }
}

function nextWord() {
  if (words.length === 0) return;
  const unlearned = words.filter(w => !learned.has(w.word));
  if (unlearned.length === 0) {
    document.getElementById('study-card').innerHTML = '<p>All words learned!</p>';
    return;
  }
  currentWord = unlearned[Math.floor(Math.random() * unlearned.length)];
  const card = document.getElementById('study-card');
  card.querySelector('.word').textContent = currentWord.word;
  card.querySelector('.phonetic').textContent = currentWord.phonetic;
  card.querySelector('.translation').textContent = currentWord.translation;
}

function markKnown() {
  if (!currentWord) return;
  learned.add(currentWord.word);
  localStorage.setItem('learnedWords', JSON.stringify([...learned]));
  nextWord();
}

function nextQuestion() {
  if (words.length === 0) return;
  currentWord = words[Math.floor(Math.random() * words.length)];
  const options = new Set([currentWord.word]);
  while (options.size < 4) {
    const w = words[Math.floor(Math.random() * words.length)].word;
    options.add(w);
  }
  const shuffled = Array.from(options).sort(() => Math.random() - 0.5);
  const q = document.getElementById('quiz-card');
  q.querySelector('.question').textContent = currentWord.translation;
  const opts = q.querySelector('.options');
  opts.innerHTML = '';
  shuffled.forEach(opt => {
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.onclick = () => checkAnswer(opt);
    opts.appendChild(btn);
  });
}

function checkAnswer(ans) {
  if (ans === currentWord.word) {
    learned.add(currentWord.word);
  } else {
    wrong.add(currentWord.word);
    alert('Correct answer: ' + currentWord.word);
  }
  localStorage.setItem('learnedWords', JSON.stringify([...learned]));
  localStorage.setItem('wrongWords', JSON.stringify([...wrong]));
  nextQuestion();
}

function renderProgress() {
  const unlearned = words.filter(w => !learned.has(w.word)).map(w => w.word);
  document.getElementById('progress-stats').textContent = `Learned ${learned.size} / ${words.length}`;
  renderList('learned-list', [...learned]);
  renderList('unlearned-list', unlearned);
  renderList('wrong-list', [...wrong]);
}

function renderList(id, arr) {
  const ul = document.getElementById(id);
  ul.innerHTML = '';
  arr.forEach(w => {
    const li = document.createElement('li');
    li.textContent = w;
    ul.appendChild(li);
  });
}

fetch('words.json')
  .then(r => r.json())
  .then(data => {
    words = data;
    const home = document.getElementById('home');
    home.querySelector('p').innerHTML += `<br/>Currently loaded ${words.length} words.`;
    // if a learning page was opened before data loaded, populate it now
    if (document.getElementById('study').classList.contains('active')) {
      nextWord();
    }
    if (document.getElementById('quiz').classList.contains('active')) {
      nextQuestion();
    }
  })
  .catch(err => console.error('Failed to load words', err));

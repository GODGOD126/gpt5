const words = [
  { word: 'apple', meaning: '苹果' },
  { word: 'banana', meaning: '香蕉' },
  { word: 'cat', meaning: '猫' },
  { word: 'dog', meaning: '狗' },
  { word: 'egg', meaning: '鸡蛋' }
];

let score = 0;
let currentWord = null;

const startBtn = document.getElementById('start');
const scoreDiv = document.getElementById('score');
const hintDiv = document.getElementById('hint');
const balloonsDiv = document.getElementById('balloons');

startBtn.addEventListener('click', startGame);

function startGame() {
  score = 0;
  scoreDiv.textContent = 'Score: ' + score;
  nextRound();
}

function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-US';
  speechSynthesis.speak(utter);
}

function nextRound() {
  balloonsDiv.innerHTML = '';
  hintDiv.textContent = '';
  currentWord = words[Math.floor(Math.random() * words.length)];
  speak(currentWord.word);
  const otherWords = words.filter(w => w.word !== currentWord.word);
  const options = shuffle(otherWords.map(w => w.word).slice(0, 2).concat(currentWord.word));
  options.forEach(opt => {
    const b = document.createElement('div');
    b.className = 'balloon';
    b.textContent = opt;
    b.addEventListener('click', () => {
      if (opt === currentWord.word) {
        score++;
        scoreDiv.textContent = 'Score: ' + score;
        hintDiv.textContent = currentWord.word + ' = ' + currentWord.meaning;
        setTimeout(nextRound, 1000);
      } else {
        b.classList.add('shake');
        setTimeout(() => b.classList.remove('shake'), 300);
      }
    });
    balloonsDiv.appendChild(b);
  });
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

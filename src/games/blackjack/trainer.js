// Blackjack basic strategy trainer. Reads BJ_STRATEGY (see
// src/_data/blackjackStrategy.js, loaded via a <script> tag just before
// this file) -- the exact same decision table the strategy chart page
// renders -- so there is exactly one source of truth for the correct play.
// Client-side only: no account, no backend, score resets on reload.

const VERB = { H: 'hit', S: 'stand on', D: 'double', P: 'split' };
const TYPE_LABEL = { hard: 'Hard', soft: 'Soft', pair: 'Pair' };

let current = null;
let correctCount = 0;
let totalCount = 0;

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function handDescriptor(category, row) {
  if (category === 'hard') return 'hard ' + row.total;
  if (category === 'soft') return 'soft ' + row.total;
  const rank = row.hand.split(',')[0];
  return rank === 'A' ? 'aces' : rank + 's';
}

function nextScenario() {
  const category = pick(['hard', 'soft', 'pair']);
  const table = category === 'hard' ? BJ_STRATEGY.HARD_TOTALS
    : category === 'soft' ? BJ_STRATEGY.SOFT_TOTALS
    : BJ_STRATEGY.PAIRS;
  const row = pick(table);
  const dealerIdx = Math.floor(Math.random() * BJ_STRATEGY.DEALER_UPCARDS.length);
  const dealerCard = BJ_STRATEGY.DEALER_UPCARDS[dealerIdx];
  const correct = row.dec[dealerIdx];

  current = { category, row, dealerCard, correct };

  document.getElementById('scType').textContent = TYPE_LABEL[category];
  document.getElementById('scDealer').textContent = dealerCard;
  document.getElementById('scHand').textContent = row.cards + ' = ' + row.total + (category === 'soft' ? ' (soft)' : '');
  document.getElementById('splitBtn').classList.toggle('hidden', category !== 'pair');

  const fb = document.getElementById('feedback');
  fb.className = 'trainer-feedback hidden';
  fb.innerHTML = '';

  document.getElementById('nextBtn').classList.add('hidden');
  setButtonsEnabled(true);
}

function setButtonsEnabled(on) {
  ['hitBtn', 'standBtn', 'doubleBtn', 'splitBtn'].forEach((id) => {
    document.getElementById(id).disabled = !on;
  });
}

function answer(action) {
  if (!current) return;
  setButtonsEnabled(false);
  totalCount++;
  const isCorrect = action === current.correct;
  if (isCorrect) correctCount++;

  const desc = handDescriptor(current.category, current.row);
  const sentence = 'Basic strategy says to ' + VERB[current.correct] + ' ' + desc + ' against a dealer ' + current.dealerCard + '.';

  const fb = document.getElementById('feedback');
  if (isCorrect) {
    fb.className = 'trainer-feedback correct';
    fb.innerHTML = '<strong>Correct &#10003;</strong><p>Correct. ' + sentence + '</p>';
  } else {
    fb.className = 'trainer-feedback incorrect';
    fb.innerHTML = '<strong>Incorrect</strong><p>' + sentence + '</p>';
  }

  document.getElementById('nextBtn').classList.remove('hidden');
  updateScore();
}

function updateScore() {
  document.getElementById('scoreLine').textContent = correctCount + ' / ' + totalCount;
  const pct = totalCount ? Math.round((correctCount / totalCount) * 100) : 0;
  document.getElementById('accuracyLine').textContent = pct + '%';
}

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('hitBtn').addEventListener('click', () => answer('H'));
  document.getElementById('standBtn').addEventListener('click', () => answer('S'));
  document.getElementById('doubleBtn').addEventListener('click', () => answer('D'));
  document.getElementById('splitBtn').addEventListener('click', () => answer('P'));
  document.getElementById('nextBtn').addEventListener('click', nextScenario);
  updateScore();
  nextScenario();
});

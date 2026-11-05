// Loads the real browser craps.js (plus its odds files) into an isolated VM
// context with a stub DOM, so tests exercise the exact code the game page
// runs, not a re-implementation. Dice are injected by calling resolveRoll()
// directly, or by seeding Math.random for simulations.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const CARDS = require('../src/games/shared/cards.js');

const root = path.join(__dirname, '..', 'src');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');

function loadCraps(variant, seed) {
  const ctx = { console, notices: [] };
  ctx.window = { addEventListener() {} };
  ctx.document = { getElementById: () => null, querySelector: () => null, querySelectorAll: () => [], addEventListener() {} };
  vm.createContext(ctx);
  vm.runInContext(read('_data/odds.js'), ctx, { filename: 'odds.js' });
  if (variant === 'crapless') vm.runInContext(read('_data/craplessOdds.js').replace(/typeof module !== 'undefined' && typeof require === 'function'/, 'false'), ctx, { filename: 'craplessOdds.js' });
  vm.runInContext(read('games/craps/craps.js'), ctx, { filename: 'craps.js' });
  if (seed !== undefined) { ctx.__rng = CARDS.seededRng(seed); vm.runInContext('Math.random = __rng;', ctx); }
  // No DOM in tests: rendering is a no-op, notices are captured.
  vm.runInContext('render = function () {}; notice = function (m) { notices.push(m); }; state = newState(1000);', ctx);
  const run = code => vm.runInContext(code, ctx);
  return {
    run,
    get state() { return run('state'); },
    rules: run('RULES'),
    roll: (d1, d2) => run(`resolveRoll(${d1}, ${d2}, ${d1 + d2})`),
    notices: ctx.notices,
  };
}

// Dice pairs for each total, used to force a specific roll.
const DICE = { 2: [1, 1], 3: [1, 2], 4: [1, 3], 5: [2, 3], 6: [2, 4], 7: [3, 4], 8: [3, 5], 9: [4, 5], 10: [4, 6], 11: [5, 6], 12: [6, 6] };
const HARD = { 4: [2, 2], 6: [3, 3], 8: [4, 4], 10: [5, 5] };

module.exports = { loadCraps, DICE, HARD };

const test = require('node:test');
const assert = require('node:assert');
const { create } = require('../src/js/wallet-bridge.js');

// Fake wallet + manual timers so batching is deterministic.
function setup({ balance = 5000, signedIn = true, enabled = true } = {}) {
  const calls = [];
  const w = {
    enabled,
    user: signedIn ? { id: 'u1' } : null,
    balance: signedIn ? balance : null,
    report(game, delta) { calls.push([game, delta]); this.balance += delta; return Promise.resolve(this.balance); },
  };
  const timers = [];
  const bridge = create({
    wallet: () => w,
    game: 'blackjack',
    setTimeout: (f) => { timers.push(f); return timers.length; },
    clearTimeout: (id) => { timers[id - 1] = null; },
  });
  const tick = () => { const fs = timers.splice(0).filter(Boolean); fs.forEach(f => f()); };
  return { w, bridge, calls, tick };
}

test('guest and unconfigured wallet: everything is a no-op', () => {
  for (const opts of [{ signedIn: false }, { enabled: false }]) {
    const { bridge, calls, tick } = setup(opts);
    assert.strictEqual(bridge.clamp(9999), 9999);
    bridge.buyIn(200); bridge.sync(50); tick();
    assert.deepStrictEqual(calls, []);
  }
});

test('buy-in is capped at the wallet balance', () => {
  const { bridge } = setup({ balance: 300 });
  assert.strictEqual(bridge.clamp(200), 200);
  assert.strictEqual(bridge.clamp(1000), 300);
});

test('only the net result is reported, batched into one call', async () => {
  const { bridge, calls, tick, w } = setup({ balance: 1000 });
  bridge.buyIn(200);
  bridge.sync(190); bridge.sync(150); bridge.sync(260);   // several renders, one batch
  tick();
  assert.deepStrictEqual(calls, [['blackjack', 60]]);
  await Promise.resolve();
  assert.strictEqual(w.balance, 1060);
});

test('fractional chips carry forward instead of being lost', () => {
  const { bridge, calls, tick } = setup();
  bridge.buyIn(200);
  bridge.sync(200.5); tick();
  assert.deepStrictEqual(calls, []);                      // under one whole chip
  bridge.sync(201.5); tick();
  assert.deepStrictEqual(calls, [['blackjack', 1]]);
  bridge.sync(203.5); tick();
  assert.deepStrictEqual(calls[1], ['blackjack', 2]);     // reports the increment, not the total
});

test('starting a new session settles the old one first', () => {
  const { bridge, calls } = setup({ balance: 1000 });
  bridge.buyIn(200);
  bridge.sync(120);
  bridge.buyIn(500);                                      // reset bankroll
  assert.deepStrictEqual(calls, [['blackjack', -80]]);
});

test('available chips include the live session result', () => {
  const { bridge } = setup({ balance: 1000 });
  bridge.buyIn(200);
  bridge.sync(320);                                       // up 120, not yet reported
  assert.strictEqual(bridge.available(), 1120);
  assert.strictEqual(bridge.clamp(5000), 1120);
});

test('a failed report is retried with the next batch', async () => {
  const { bridge, tick, w } = setup({ balance: 1000 });
  let fail = true;
  const calls = [];
  w.report = (g, d) => { calls.push(d); return fail ? Promise.reject(new Error('net')) : Promise.resolve(); };
  bridge.buyIn(200);
  bridge.sync(250); tick();
  await new Promise(r => setImmediate(r));
  fail = false; tick();                                   // the retry timer scheduled on failure
  await new Promise(r => setImmediate(r));
  assert.deepStrictEqual(calls, [50, 50]);
});

test('an empty wallet plays untracked and reports nothing', () => {
  const { bridge, calls, tick } = setup({ balance: 0 });
  bridge.buyIn(200); bridge.sync(900); tick();
  assert.deepStrictEqual(calls, []);
  assert.match(bridge.hint(), /wallet is empty/);
});

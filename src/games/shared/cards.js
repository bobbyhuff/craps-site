// Shared playing-card helpers for the poker-family games (video poker, three
// card poker, pai gow poker). Same isomorphic pattern as the _data odds
// files: loaded in the browser as a plain <script> (exposes window.CARDS),
// and require()-able from Node so tests exercise the exact same code.
//
// Card shape: { rank: 2..14, suit: 0..3 } where 11=J, 12=Q, 13=K, 14=A and
// suits are 0=spades, 1=hearts, 2=diamonds, 3=clubs. The pai gow joker is
// { joker: true, rank: 0, suit: -1 }. Engines only ever look at rank/suit,
// so the visual label lives here, not in game logic.

(function () {
  const RANK_LABEL = { 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10', 11: 'J', 12: 'Q', 13: 'K', 14: 'A' };
  const RANK_NAME = { 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five', 6: 'Six', 7: 'Seven', 8: 'Eight', 9: 'Nine', 10: 'Ten', 11: 'Jack', 12: 'Queen', 13: 'King', 14: 'Ace' };
  const RANK_PLURAL = { 2: 'Twos', 3: 'Threes', 4: 'Fours', 5: 'Fives', 6: 'Sixes', 7: 'Sevens', 8: 'Eights', 9: 'Nines', 10: 'Tens', 11: 'Jacks', 12: 'Queens', 13: 'Kings', 14: 'Aces' };
  const SUIT_SYMBOL = ['♠', '♥', '♦', '♣'];
  const SUIT_NAME = ['spades', 'hearts', 'diamonds', 'clubs'];

  function makeDeck(opts) {
    const deck = [];
    for (let s = 0; s < 4; s++) {
      for (let r = 2; r <= 14; r++) deck.push({ rank: r, suit: s });
    }
    if (opts && opts.jokers) {
      for (let j = 0; j < opts.jokers; j++) deck.push({ joker: true, rank: 0, suit: -1 });
    }
    return deck;
  }

  // Small, fast, seedable PRNG (mulberry32). Games use Math.random; tests
  // inject a seeded one so every dealt hand is reproducible.
  function seededRng(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Fisher-Yates, in place. rng defaults to Math.random.
  function shuffle(arr, rng) {
    const rand = rng || Math.random;
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  function shuffledDeck(opts, rng) { return shuffle(makeDeck(opts), rng); }

  function isRed(card) { return card.suit === 1 || card.suit === 2; }

  function cardLabel(card) {
    if (card.joker) return 'Joker';
    return `${RANK_LABEL[card.rank]}${SUIT_SYMBOL[card.suit]}`;
  }

  function cardSpoken(card) {
    if (card.joker) return 'Joker';
    return `${RANK_NAME[card.rank]} of ${SUIT_NAME[card.suit]}`;
  }

  function sameCard(a, b) {
    if (a.joker || b.joker) return !!(a.joker && b.joker);
    return a.rank === b.rank && a.suit === b.suit;
  }

  // Parse "As Kh 10d Jc 2s Jk" style shorthand. Tests use this; it is also
  // handy in the browser console for reproducing a reported hand.
  function parseCards(str) {
    const SUITS = { s: 0, h: 1, d: 2, c: 3 };
    const RANKS = { J: 11, Q: 12, K: 13, A: 14, T: 10 };
    return str.trim().split(/\s+/).map(tok => {
      if (/^(jk|joker)$/i.test(tok)) return { joker: true, rank: 0, suit: -1 };
      const suitCh = tok.slice(-1).toLowerCase();
      const rankStr = tok.slice(0, -1).toUpperCase();
      const rank = RANKS[rankStr] || parseInt(rankStr, 10);
      if (!(suitCh in SUITS) || !(rank >= 2 && rank <= 14)) throw new Error(`Bad card: ${tok}`);
      return { rank, suit: SUITS[suitCh] };
    });
  }

  // Markup matches the .pcard component used by blackjack/baccarat so every
  // card on the site looks identical. opts: isNew (deal-in animation),
  // faceDown, cls (extra classes), attrs (extra attribute string).
  function cardHtml(card, opts) {
    opts = opts || {};
    const anim = opts.isNew ? ' pcard-deal-in' : '';
    const extra = opts.cls ? ` ${opts.cls}` : '';
    const attrs = opts.attrs ? ` ${opts.attrs}` : '';
    if (opts.faceDown) return `<div class="pcard-back${anim}${extra}"${attrs} aria-label="Face-down card"></div>`;
    if (card.joker) {
      return `<div class="pcard is-joker${anim}${extra}"${attrs} aria-label="Joker">
        <div class="pcard-corner">JK<span class="pcard-corner-suit">★</span></div>
        <div class="pcard-suit-big">★</div>
      </div>`;
    }
    const label = RANK_LABEL[card.rank];
    const suit = SUIT_SYMBOL[card.suit];
    return `<div class="pcard ${isRed(card) ? 'is-red' : ''}${anim}${extra}"${attrs} aria-label="${cardSpoken(card)}">
      <div class="pcard-corner">${label}<span class="pcard-corner-suit">${suit}</span></div>
      <div class="pcard-suit-big">${suit}</div>
    </div>`;
  }

  const CARDS = {
    RANK_LABEL, RANK_NAME, RANK_PLURAL, SUIT_SYMBOL, SUIT_NAME,
    makeDeck, seededRng, shuffle, shuffledDeck, isRed, cardLabel, cardSpoken,
    sameCard, parseCards, cardHtml,
  };

  if (typeof module !== 'undefined') module.exports = CARDS;
  if (typeof window !== 'undefined') window.CARDS = CARDS;
})();

"""
Blackjack Monte Carlo for 0stakes.
Rules: 6 decks, dealer STANDS on soft 17, double any first two, DAS allowed,
one split per hand (no resplit), split aces get one card, no surrender,
blackjack pays 3:2, dealer peeks on A and 10.
"""
import numpy as np

SEED = 44
NDECKS = 6
PEN = 0.75  # reshuffle after 75% dealt


class Shoe:
    def __init__(self, rng):
        self.rng = rng
        self.cards = np.array([], dtype=np.int8)
        self.i = 0
        self.shuffle()

    def shuffle(self):
        base = np.repeat(np.array([2,3,4,5,6,7,8,9,10,10,10,10,11], dtype=np.int8), 4 * NDECKS)
        self.rng.shuffle(base)
        self.cards, self.i = base, 0
        self.cut = int(len(base) * PEN)

    def deal(self):
        if self.i >= len(self.cards):
            self.shuffle()
        c = self.cards[self.i]; self.i += 1
        return int(c)

    def maybe_shuffle(self):
        if self.i >= self.cut:
            self.shuffle()


def total(hand):
    t = sum(hand); aces = hand.count(11)
    while t > 21 and aces:
        t -= 10; aces -= 1
    return t

def is_soft(hand):
    t = sum(hand); aces = hand.count(11)
    while t > 21 and aces:
        t -= 10; aces -= 1
    return aces > 0


# ---------- basic strategy: 6D, S17, DAS, no resplit, no surrender ----------
def bs_action(hand, up, can_double, can_split):
    t = total(hand)

    if can_split and len(hand) == 2 and hand[0] == hand[1]:
        v = hand[0]
        if v == 11: return "P"
        if v == 10: return "S"
        if v == 9:  return "P" if up in (2,3,4,5,6,8,9) else "S"
        if v == 8:  return "P"
        if v == 7:  return "P" if up <= 7 else "H"
        if v == 6:  return "P" if up <= 6 else "H"
        if v == 5:  pass  # play as hard 10
        if v == 4:  return "P" if up in (5,6) else "H"
        if v in (2,3): return "P" if up <= 7 else "H"

    if is_soft(hand):
        if t >= 19: return "S"
        if t == 18:
            if up in (3,4,5,6) and can_double: return "D"
            if up in (2,7,8): return "S"
            if up in (3,4,5,6): return "S"
            return "H"
        if t == 17: return "D" if (up in (3,4,5,6) and can_double) else "H"
        if t in (15,16): return "D" if (up in (4,5,6) and can_double) else "H"
        if t in (13,14): return "D" if (up in (5,6) and can_double) else "H"
        return "H"

    if t >= 17: return "S"
    if t in (13,14,15,16): return "S" if up <= 6 else "H"
    if t == 12: return "S" if up in (4,5,6) else "H"
    if t == 11: return "D" if can_double and up != 11 else "H"
    if t == 10: return "D" if (can_double and up <= 9) else "H"
    if t == 9:  return "D" if (can_double and up in (3,4,5,6)) else "H"
    return "H"


def never_bust_action(hand, up, can_double, can_split):
    """The casual player: stand on anything 12+, never double, never split."""
    return "S" if total(hand) >= 12 else "H"


def play_dealer(hand, shoe):
    while total(hand) < 17:          # stands on all 17 including soft
        hand.append(shoe.deal())
    return total(hand)


def play_hand(shoe, strategy, bet=10, take_insurance=False):
    """Returns (net, insurance_net)."""
    player = [shoe.deal(), shoe.deal()]
    dealer = [shoe.deal(), shoe.deal()]
    up = dealer[0]
    ins_net = 0.0

    if up == 11 and take_insurance:
        ins = bet / 2
        ins_net = ins * 2 if total(dealer) == 21 and len(dealer) == 2 else -ins

    p_bj = total(player) == 21
    d_bj = total(dealer) == 21

    if up in (10, 11) and d_bj:                       # dealer peeks
        return (0.0 if p_bj else -bet), ins_net
    if p_bj:
        return bet * 1.5, ins_net

    hands = [(player, bet, False)]                    # (cards, bet, from_split_ace)
    if strategy(player, up, True, True) == "P":
        c = player[0]
        if c == 11:
            h1 = [c, shoe.deal()]; h2 = [c, shoe.deal()]
            hands = [(h1, bet, True), (h2, bet, True)]
        else:
            hands = [([c, shoe.deal()], bet, False), ([c, shoe.deal()], bet, False)]

    resolved = []
    for cards, b, split_ace in hands:
        if split_ace:
            resolved.append((cards, b)); continue
        while True:
            if total(cards) >= 21: break
            a = strategy(cards, up, len(cards) == 2, False)
            if a == "S": break
            if a == "D":
                b *= 2; cards.append(shoe.deal()); break
            cards.append(shoe.deal())
        resolved.append((cards, b))

    dt = play_dealer(dealer, shoe)
    net = 0.0
    for cards, b in resolved:
        pt = total(cards)
        if pt > 21:      net -= b
        elif dt > 21:    net += b
        elif pt > dt:    net += b
        elif pt < dt:    net -= b
    return net, ins_net

"""Reproducible 0stakes educational experiment; Python 3 stdlib only."""
import random,json,statistics,collections,pathlib
SEED=20261012
N=10000
MAX_ROUNDS=100
ROOT=pathlib.Path(__file__).parent
# 6 shoe decks, cut at 75% used (reshuffle between rounds), peek, S17, 3:2,
# one split maximum per original round, DAS, no surrender/insurance.
UP=list(range(2,12))
HARD={9:'HDDDDHHHHH',10:'DDDDDDDDHH',11:'DDDDDDDDDD',12:'HHSSSHHHHH'}
SOFT={13:'HHHDDHHHHH',14:'HHHDDHHHHH',15:'HHDDDHHHHH',16:'HHDDDHHHHH',17:'HDDDDHHHHH',18:'SDDDDSSHHH',19:'SSSSDSSSSS'}
PAIRS={2:'PPPPPPHHHH',3:'PPPPPPHHHH',4:'HHHPPHHHHH',6:'PPPPPHHHHH',7:'PPPPPPHHHH',8:'PPPPPPPPPP',9:'PPPPPSPPSS',11:'PPPPPPPPPP'}
assert all(len(x)==10 for x in list(HARD.values())+list(SOFT.values())+list(PAIRS.values()))
def val(hand):
    total=sum(hand); aces=hand.count(11)
    while total>21 and aces: total-=10;aces-=1
    return total,aces>0
def action(hand, up, can_double, can_split):
    ix=UP.index(up)
    if can_split and len(hand)==2 and hand[0]==hand[1] and hand[0] in PAIRS:
        a=PAIRS[hand[0]][ix]
    else:
        total,soft=val(hand)
        a=(SOFT.get(total,'SSSSSSSSSS') if soft else HARD.get(total,'HHHHHHHHHH' if total<=11 else 'SSSSSSSSSS'))[ix]
        if not soft and total>=13 and total<=16: a=('SSSSSHHHHH')[ix]
    return 'H' if a=='D' and not can_double else a

def run(bet,rng):
    shoe=[];pos=0
    bankroll=100.0; rounds=0; peak=100.0; doubled=0; splits=0
    def fresh():
        s=[v for v in ([11]+list(range(2,10))+[10]*4) for _ in range(24)] # 6 decks x 4 suits
        rng.shuffle(s);return s
    while rounds<MAX_ROUNDS and bankroll>=bet:
        if not shoe or pos>len(shoe)*.75: shoe=fresh();pos=0
        def draw():
            nonlocal pos
            c=shoe[pos];pos+=1;return c
        bankroll-=bet; rounds+=1
        player=[draw(),draw()];dealer=[draw(),draw()]
        natural=sorted(player)==[10,11];dnatural=sorted(dealer)==[10,11]
        if dnatural:
            if natural: bankroll+=bet
            peak=max(peak,bankroll);continue
        if natural:
            bankroll+=2.5*bet;peak=max(peak,bankroll);continue
        hands=[(player,bet,False,False)]
        if player[0]==player[1] and bankroll>=bet and action(player,dealer[0],True,True)=='P':
            bankroll-=bet;splits+=1
            a=player[0];hands=[([a,draw()],bet,a==11,True),([a,draw()],bet,a==11,True)]
        played=[]
        for cards,stake,ace_split,was_split in hands:
            if not ace_split:
                while True:
                    score,_=val(cards)
                    if score>=21:break
                    can_double=len(cards)==2 and bankroll>=stake
                    a=action(cards,dealer[0],can_double,False)
                    if a=='S':break
                    if a=='D':
                        bankroll-=stake;stake*=2;doubled+=1;cards.append(draw());break
                    cards.append(draw())
            played.append((cards,stake))
        if any(val(h)[0]<=21 for h,_ in played):
            while True:
                score,soft=val(dealer)
                if score>=17:break
                dealer.append(draw())
        dealer_total=val(dealer)[0]
        for cards,stake in played:
            score=val(cards)[0]
            if score>21:continue
            if dealer_total>21 or score>dealer_total: bankroll+=2*stake
            elif score==dealer_total:bankroll+=stake
        peak=max(peak,bankroll)
    return {'rounds':rounds,'ending_bankroll':bankroll,'profit':bankroll-100,'bankrupt_before_100':rounds<100,'peak':peak,'doubles':doubled,'splits':splits}

def summarize(bet):
    rng=random.Random(SEED+bet)
    x=[run(bet,rng) for _ in range(N)]
    end=sorted(r['ending_bankroll'] for r in x)
    rounds=sorted(r['rounds'] for r in x)
    ended=sum(r['bankrupt_before_100'] for r in x)
    ahead=sum(r['profit']>0 for r in x)
    even=sum(r['profit']==0 for r in x)
    return {'bet_usd':bet,'sessions':N,'max_rounds':MAX_ROUNDS,'seed':SEED+bet,
     'ruined_before_100_count':ended,'ruined_before_100_pct':round(ended/N*100,2),
     'finished_ahead_count':ahead,'finished_ahead_pct':round(ahead/N*100,2),
     'finished_even_count':even,'finished_even_pct':round(even/N*100,2),
     'mean_ending_bankroll_usd':round(statistics.mean(end),2),
     'median_ending_bankroll_usd':round(statistics.median(end),2),
     'p10_ending_bankroll_usd':round(end[int(N*.1)],2),
     'p90_ending_bankroll_usd':round(end[int(N*.9)],2),
     'mean_rounds':round(statistics.mean(rounds),2),'median_rounds':statistics.median(rounds),
     'median_rounds_if_ruined':statistics.median([r['rounds'] for r in x if r['bankrupt_before_100']]) if ended else None,
     'histogram': [{'min_usd':a,'max_usd_exclusive':b,'sessions':sum(a<=v<b for v in end)} for a,b in [(0,25),(25,50),(50,75),(75,100),(100,125),(125,150),(150,200),(200,1000000)]],
     'example_session_counts':{'doubles':sum(r['doubles'] for r in x),'splits':sum(r['splits'] for r in x)},
     'definition':'ruined before 100 means balance fell below base wager, not necessarily zero'}
if __name__=='__main__':
 out={'experiment':'How long will $100 last playing blackjack?', 'model':'six-deck blackjack with S17, 3:2, one split, DAS, no surrender or insurance; basic strategy per published 0stakes chart with affordability fallbacks; reshuffle at >75% penetration between rounds; full 100 rounds or balance below wager', 'caveats':['Finite simulation, not a promise or a precise house-edge estimate','Affordability changes doubling and splitting near bankruptcy','Shoe is reshuffled between rounds once over 75% dealt','Splitting aces receives one card only','Session end at 100 rounds is not literal bankroll exhaustion','Simulation uses self-contained model; not a verified replay of website production game engine'], 'results':[summarize(5),summarize(10)]}
 (ROOT/'simulation.json').write_text(json.dumps(out,indent=2)+'\n')
 print(json.dumps(out['results'],indent=2))

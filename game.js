// 카드 덱, 플레이어와 딜러 손, 카드 카운팅 변수
let deck = [];
let playerHand = [];
let dealerHand = [];
let count = 0;  // 카드 카운팅 점수

const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

// 카드 덱 생성 함수
function createDeck() {
    deck = [];
    for (let suit of suits) {
        for (let rank of ranks) {
            deck.push({ suit: suit, rank: rank });
        }
    }
    shuffleDeck();
}

// 덱 섞기
function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// 카드 값 계산 (Hi-Lo 시스템)
function cardValue(card) {
    if (['2', '3', '4', '5', '6'].includes(card.rank)) return 1;
    if (['10', 'J', 'Q', 'K', 'A'].includes(card.rank)) return -1;
    return 0;
}

// 카드 뽑기
function drawCard() {
    const card = deck.pop();
    updateCount(card); // 카드가 뽑힐 때마다 카운트 업데이트
    return card;
}

// 카운팅 업데이트
function updateCount(card) {
    count += cardValue(card);
}

// 카드 합 계산
function calculateHandTotal(hand) {
    let total = 0;
    let aceCount = 0;

    // 카드 합 계산
    for (let card of hand) {
        if (['J', 'Q', 'K'].includes(card.rank)) {
            total += 10;
        } else if (card.rank === 'A') {
            aceCount++;
            total += 11;
        } else {
            total += parseInt(card.rank);
        }
    }

    // Ace가 11이면 1로 변경해야 할 경우 처리
    while (total > 21 && aceCount > 0) {
        total -= 10;
        aceCount--;
    }

    return total;
}

// 카드 표시
function displayCards() {
    document.getElementById('playerCards').innerHTML = playerHand.map(card => `<div class="card" style="background-image: url('cards/${card.rank}_of_${card.suit}.png')"></div>`).join('');
    document.getElementById('dealerCards').innerHTML = dealerHand.map(card => `<div class="card" style="background-image: url('cards/${card.rank}_of_${card.suit}.png')"></div>`).join('');
}

// 딜러의 행동 결정 (카드 카운팅 및 블랙잭 규칙)
function dealerAction() {
    let dealerTotal = calculateHandTotal(dealerHand);

    // 카드 카운팅에 따른 전략 적용
    if (dealerTotal < 17 || count > 0) {
        dealerHand.push(drawCard());
        displayCards();
        dealerTotal = calculateHandTotal(dealerHand);
        if (dealerTotal >= 17) {
            stand(); // 카드 합이 17 이상이면 스탠드
        } else {
            dealerAction(); // 계속해서 히트
        }
    } else {
        stand(); // 카드 합이 17 이상이면 스탠드
    }
}

// 게임 시작
function startGame() {
    createDeck();
    playerHand = [drawCard(), drawCard()];
    dealerHand = [drawCard(), drawCard()];
    displayCards();

    // 시작 버튼 숨기기
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('hitBtn').style.display = 'inline-block';
    document.getElementById('standBtn').style.display = 'inline-block';
}

// 히트
function hit() {
    playerHand.push(drawCard());
    displayCards();
    let playerTotal = calculateHandTotal(playerHand);
    if (playerTotal > 21) {
        alert('플레이어가 패배했습니다. 카드 합이 21을 초과했습니다.');
        resetGame();
    }
}

// 스탠드
function stand() {
    let playerTotal = calculateHandTotal(playerHand);
    let dealerTotal = calculateHandTotal(dealerHand);

    while (dealerTotal < 17) {
        dealerHand.push(drawCard());
        dealerTotal = calculateHandTotal(dealerHand);
    }

    displayCards();
    // 승패 결정
    if (dealerTotal > 21) {
        alert('딜러가 패배했습니다. 카드 합이 21을 초과했습니다.');
    } else if (playerTotal > dealerTotal) {
        alert('플레이어 승리!');
    } else if (playerTotal < dealerTotal) {
        alert('딜러 승리!');
    } else {
        alert('무승부!');
    }

    resetGame();
}

// 게임 리셋
function resetGame() {
    playerHand = [];
    dealerHand = [];
    document.getElementById('startBtn').style.display = 'inline-block';
    document.getElementById('hitBtn').style.display = 'none';
    document.getElementById('standBtn').style.display = 'none';
}

// 버튼 이벤트 연결
document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('hitBtn').addEventListener('click', hit);
document.getElementById('standBtn').addEventListener('click', stand);

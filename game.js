let deckId = "";
let playerHand = [];
let dealerHand = [];
let count = 0;  // 카드 카운팅 점수

// 카드 덱 생성 함수
async function createDeck() {
    const response = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1");
    const data = await response.json();
    deckId = data.deck_id;  // 덱 ID 저장
    console.log("덱 ID: ", deckId);
}

// 카드 뽑기
async function drawCard() {
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
    const data = await response.json();
    return data.cards[0];  // 뽑은 카드 반환
}

// 카드 이미지 표시
function displayCards() {
    // 플레이어와 딜러 카드 표시
    document.getElementById('playerCards').innerHTML = playerHand.map(card => `<div class="card" style="background-image: url('${card.image}')"></div>`).join('');
    document.getElementById('dealerCards').innerHTML = dealerHand.map(card => `<div class="card" style="background-image: url('${card.image}')"></div>`).join('');
}

// 게임 시작
async function startGame() {
    await createDeck();  // 덱 생성
    playerHand = [await drawCard(), await drawCard()];
    dealerHand = [await drawCard(), await drawCard()];
    displayCards();

    // 시작 버튼 숨기기
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('hitBtn').style.display = 'inline-block';
    document.getElementById('standBtn').style.display = 'inline-block';
}

// 히트
async function hit() {
    const card = await drawCard();
    playerHand.push(card);
    displayCards();

    let playerTotal = calculateHandTotal(playerHand);

    // 카드 합이 21을 넘으면 더 이상 카드를 뽑지 않음
    if (playerTotal > 21) {
        alert('플레이어가 패배했습니다. 카드 합이 21을 초과했습니다.');
        resetGame();
        return; // 여기서 게임을 끝내도록 return 추가
    }
}


// 스탠드
async function stand() {
    let playerTotal = calculateHandTotal(playerHand);
    let dealerTotal = calculateHandTotal(dealerHand);

    while (dealerTotal < 17) {
        dealerHand.push(await drawCard());
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

// 카드 합 계산
function calculateHandTotal(hand) {
    let total = 0;
    let aceCount = 0;

    // 카드 합 계산
    for (let card of hand) {
        if (['J', 'Q', 'K'].includes(card.value)) {
            total += 10;
        } else if (card.value === 'A') {
            aceCount++;
            total += 11;
        } else {
            total += parseInt(card.value);
        }
    }

    // Ace가 11이면 1로 변경해야 할 경우 처리
    while (total > 21 && aceCount > 0) {
        total -= 10;
        aceCount--;
    }

    return total;
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

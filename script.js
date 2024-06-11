document.addEventListener('DOMContentLoaded', () => {
    const cardsArray = [
        'image1', 'image2', 'image3', 'image4',
        'image5', 'image6', 'image7', 'image8',
        'image1', 'image2', 'image3', 'image4',
        'image5', 'image6', 'image7', 'image8'
    ];

    const gameContainer = document.getElementById('game-container');
    const messageElement = document.getElementById('message');
    const timerElement = document.getElementById('timer');
    const resetButton = document.getElementById('reset-button');
    const startButton = document.getElementById('start-button');
    const usernameInput = document.getElementById('username');
    const rankingList = document.getElementById('ranking-list');

    let firstCard, secondCard;
    let lockBoard = false;
    let matchedPairs = 0;
    let timer;
    let time = 0;
    let rankings = [];

    startButton.addEventListener('click', startGame);
    resetButton.addEventListener('click', startGame);

    function startGame() {
        if (usernameInput.value.trim() === '') {
            alert('Por favor, insira seu nome!');
            return;
        }
        resetGame();
        shuffle(cardsArray);
        createBoard();
        startTimer();
    }

    function resetGame() {
        clearInterval(timer);
        time = 0;
        timerElement.textContent = `Tempo: ${time}s`;
        matchedPairs = 0;
        firstCard = null;
        secondCard = null;
        lockBoard = false;
        messageElement.textContent = '';
        gameContainer.innerHTML = '';
    }

    function startTimer() {
        timer = setInterval(() => {
            time++;
            timerElement.textContent = `Tempo: ${time}s`;
        }, 1000);
    }

    function shuffle(array) {
        array.sort(() => Math.random() - 0.5);
    }

    function createBoard() {
        cardsArray.forEach(imageClass => {
            const card = document.createElement('div');
            card.classList.add('card', imageClass);
            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">?</div>
                    <div class="card-back"></div>
                </div>
            `;
            card.addEventListener('click', flipCard);
            gameContainer.appendChild(card);
        });
    }

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        this.classList.add('flipped');

        if (!firstCard) {
            firstCard = this;
            return;
        }

        secondCard = this;
        checkForMatch();
    }

    function checkForMatch() {
        const isMatch = firstCard.className === secondCard.className;
        isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        matchedPairs++;
        resetBoard();

        if (matchedPairs === cardsArray.length / 2) {
            clearInterval(timer);
            messageElement.textContent = `Parabéns, ${usernameInput.value}! Você venceu em ${time} segundos!`;
            updateRankings(usernameInput.value, time);
        }
    }

    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [firstCard, secondCard] = [null, null];
        lockBoard = false;
    }

    function updateRankings(username, time) {
        rankings.push({ name: username, time: time });
        rankings.sort((a, b) => a.time - b.time);
        displayRankings();
    }

    function displayRankings() {
        rankingList.innerHTML = '';
        rankings.forEach((ranking, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${ranking.name} - ${ranking.time} segundos`;
            rankingList.appendChild(listItem);
        });
    }
});

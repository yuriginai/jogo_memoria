document.addEventListener('DOMContentLoaded', () => {
    // Array de imagens usadas no jogo
    const cardsArray = [
        'image1', 'image2', 'image3', 'image4',
        'image5', 'image6', 'image7', 'image8',
        'image1', 'image2', 'image3', 'image4',
        'image5', 'image6', 'image7', 'image8'
    ];

    // Seleção de elementos do DOM
    const gameContainer = document.getElementById('game-container');
    const message = document.getElementById('message');
    const timerElement = document.getElementById('timer');
    const resetButton = document.getElementById('reset-button');
    const startButton = document.getElementById('start-button');
    const usernameInput = document.getElementById('username');
    const rankingList = document.getElementById('ranking-list');

    // Variáveis do jogo
    let firstCard, secondCard;
    let lockBoard = false;
    let matchedPairs = 0;
    let timer;
    let time = 0;
    let rankings = [];

    // Eventos de clique para iniciar e reiniciar o jogo
    startButton.addEventListener('click', startGame);
    resetButton.addEventListener('click', startGame);

    // Função para iniciar o jogo
    function startGame() {
        // Verifica se o nome de usuário foi inserido
        if (usernameInput.value.trim() === '') {
            alert('Por favor, insira seu nome!');
            return;
        }
        resetGame();
        shuffle(cardsArray);
        createBoard();
        startTimer();
    }

    // Função para resetar o jogo
    function resetGame() {
        clearInterval(timer);
        time = 0;
        timerElement.textContent = `Tempo: ${time}s`;
        matchedPairs = 0;
        firstCard = null;
        secondCard = null;
        lockBoard = false;
        message.textContent = '';
        gameContainer.innerHTML = '';
    }

    // Função para iniciar o timer
    function startTimer() {
        timer = setInterval(() => {
            time++;
            timerElement.textContent = `Tempo: ${time}s`;
        }, 1000);
    }

    // Função para embaralhar as cartas
    function shuffle(array) {
        array.sort(() => Math.random() - 0.5);
    }

    // Função para criar o tabuleiro do jogo
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

    // Função para virar uma carta
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

    // Função para checar se as cartas combinam
    function checkForMatch() {
        const isMatch = firstCard.className === secondCard.className;
        isMatch ? disableCards() : unflipCards();
    }

    // Função para desabilitar as cartas combinadas
    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        matchedPairs++;
        resetBoard();

        // Verifica se todas as cartas foram combinadas
        if (matchedPairs === cardsArray.length / 2) {
            clearInterval(timer);
            message.textContent = `Parabéns, ${usernameInput.value}! Você venceu em ${time} segundos!`;
            updateRankings(usernameInput.value, time);
        }
    }

    // Função para desvirar as cartas que não combinam
    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 900);
    }

    // Função para virar todas as cartas (usada na tecla 'G')
    function flipAllCards(){
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => card.classList.add('flipped'));
    }

    // Função para resetar o estado do tabuleiro
    function resetBoard() {
        [firstCard, secondCard] = [null, null];
        lockBoard = false;
    }

    // Função para atualizar o ranking
    function updateRankings(username, time) {
        rankings.push({ name: username, time: time });
        rankings.sort((a, b) => a.time - b.time);
        displayRankings();
    }

    // Função para exibir o ranking
    function displayRankings() {
        rankingList.innerHTML = '';
        rankings.forEach((ranking, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${ranking.name} - ${ranking.time} segundos`;
            rankingList.appendChild(listItem);
        });
    }

    // Função para terminar o jogo e registrar a vitória
    function endGame() {
        clearInterval(timer);
        matchedPairs = cardsArray.length / 2; // Simula que todos os pares foram encontrados
        message.textContent = `Parabéns, ${usernameInput.value}! Você venceu o jogo em ${time} segundos.`;
        updateRankings(usernameInput.value, time);
    }

    // Evento de teclado para pressionar 'G' e vencer o jogo instantaneamente
    document.addEventListener('keydown', (event) => {
        if (event.key === 'g' || event.key === 'G') {
            if (usernameInput.value.trim() !== '') {
                endGame();
                flipAllCards();
            } else {
                alert('Por favor, insira seu nome!');
            }
        }
    });
});

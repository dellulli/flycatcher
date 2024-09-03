const startButton = document.getElementById('startButton');
const retryButton = document.getElementById('retryButton');
const message = document.getElementById('message');
const gameArea = document.getElementById('gameArea');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
let score = 0;
const totalFlies = 30; // Updated goal to catch 35 flies
const timeLimit = 16; // seconds
const flyInterval = 500; // Time interval for adding new flies (in milliseconds)
const flyLifetime = 2000; // Lifetime of each fly (in milliseconds)
const specialItemInterval = 2000; // Time interval for adding special items (in milliseconds)
const specialItemLifetime = 3000; // Lifetime of each special item (in milliseconds)
const specialItems = ['vapeleak.png', 'warmwater.png'];
let flyAdder, specialItemAdder, timer;

function startGame() {
    startButton.style.display = 'none';
    score = 0;
    updateScore();
    timerElement.textContent = `Time Left: ${timeLimit}s`;
    message.textContent = '';
    retryButton.style.display = 'none';
    gameArea.innerHTML = ''; // Clear the game area

    const pencilholder = document.createElement('img');
    pencilholder.src = 'pencilholder.png';
    pencilholder.id = 'pencilholder';
    pencilholder.style.width = '70px';  // Ensure pencilholder size matches CSS
    pencilholder.style.height = '70px'; // Ensure pencilholder size matches CSS
    pencilholder.style.position = 'absolute';
    pencilholder.style.left = `${gameArea.offsetWidth / 2 - 35}px`;  // Center horizontally
    pencilholder.style.top = `${gameArea.offsetHeight / 2 - 35}px`;  // Center vertically
    gameArea.appendChild(pencilholder);

    // Add initial flies
    addFly();
    flyAdder = setInterval(() => {
        if (document.querySelectorAll('.fly').length < totalFlies) {
            addFly();
        }
    }, flyInterval);

    // Add special items
    specialItemAdder = setInterval(() => {
        addSpecialItem();
    }, specialItemInterval);

    // Set up pencilholder dragging
    let isDragging = false;

    pencilholder.addEventListener('mousedown', () => {
        isDragging = true;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            pencilholder.style.left = `${e.pageX - pencilholder.width / 2}px`;
            pencilholder.style.top = `${e.pageY - pencilholder.height / 2}px`;

            // Check for collision with flies and special items
            document.querySelectorAll('.fly, .special-item').forEach(item => {
                const itemRect = item.getBoundingClientRect();
                const pencilholderRect = pencilholder.getBoundingClientRect();

                if (pencilholderRect.left < itemRect.right &&
                    pencilholderRect.right > itemRect.left &&
                    pencilholderRect.top < itemRect.bottom &&
                    pencilholderRect.bottom > itemRect.top) {

                    if (item.classList.contains('fly')) {
                        if (item.dataset.caught === 'false') {
                            item.dataset.caught = 'true';
                            item.remove();
                            score++;
                            updateScore();
                            if (score >= totalFlies) {
                                endGame(true);
                            }
                        }
                    } else if (item.classList.contains('special-item')) {
                        endGame(false, item.src);
                        item.remove();
                    }
                }
            });
        }
    });

    // Start timer
    let timeRemaining = timeLimit;
    timerElement.textContent = `Time Left: ${timeRemaining}s`;
    timer = setInterval(() => {
        if (timeRemaining <= 0) {
            clearInterval(timer);
            clearInterval(flyAdder);
            clearInterval(specialItemAdder);
            if (score < totalFlies) {
                endGame(false);
            }
        } else {
            timeRemaining--;
            timerElement.textContent = `Time Left: ${timeRemaining}s`;
        }
    }, 1000);
}

function addFly() {
    const fly = document.createElement('img');
    fly.src = 'fly.png';
    fly.className = 'fly';
    fly.style.position = 'absolute'; // Ensure flies are absolutely positioned
    fly.style.top = `${Math.random() * (window.innerHeight - 50)}px`; // Adjust for fly height
    fly.style.left = `${Math.random() * (window.innerWidth - 50)}px`; // Adjust for fly width
    fly.dataset.caught = 'false';
    fly.style.width = '50px';  // Adjust the size of the flies
    fly.style.height = '50px'; // Adjust the size of the flies
    gameArea.appendChild(fly);

    // Remove fly after its lifetime
    setTimeout(() => {
        if (fly.dataset.caught === 'false') {
            fly.remove();
        }
    }, flyLifetime);
}

function addSpecialItem() {
    const specialItem = document.createElement('img');
    const randomItem = specialItems[Math.floor(Math.random() * specialItems.length)];
    specialItem.src = randomItem;
    specialItem.className = 'special-item';
    specialItem.style.position = 'absolute'; // Ensure special items are absolutely positioned
    specialItem.style.top = `${Math.random() * (window.innerHeight - 50)}px`; // Adjust for item height
    specialItem.style.left = `${Math.random() * (window.innerWidth - 50)}px`; // Adjust for item width
    specialItem.style.width = '50px';  // Adjust the size of the special items
    specialItem.style.height = '50px'; // Adjust the size of the special items
    gameArea.appendChild(specialItem);

    // Remove special item after its lifetime
    setTimeout(() => {
        if (specialItem.parentNode) {
            specialItem.remove();
        }
    }, specialItemLifetime);
}

function updateScore() {
    scoreElement.textContent = `Score: ${score}`;
}

function endGame(won, specialItemSrc) {
    clearInterval(flyAdder);
    clearInterval(specialItemAdder);
    clearInterval(timer);
    if (won) {
        message.textContent = 'Good Job! You are a pro fly catcher 💪';
    } else {
        if (specialItemSrc && specialItemSrc.includes('vapeleak.png')) {
            message.textContent = 'Game Over! You caught Dexter instead :(';
        } else if (specialItemSrc && specialItemSrc.includes('warmwater.png')) {
            message.textContent = 'Game Over! You caught Walter instead :(';
        } else {
            message.textContent = 'Maybe one day you\'ll be able to beat dellulli the pro fly catcher 😈';
        }
    }
    retryButton.style.display = 'inline';
    retryButton.style.top = '50%'; // Center the retry button vertically
    retryButton.style.left = '50%';
    retryButton.style.transform = 'translate(-50%, -50%)';
}

startButton.addEventListener('click', startGame);
retryButton.addEventListener('click', () => {
    window.location.reload();
});

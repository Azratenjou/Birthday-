/* =========================================
   PASSWORD
========================================= */

const SECRET = "100309";

const digits = [
    0,
    0,
    0,
    0,
    0,
    0
];

const digitElements =
    document.querySelectorAll(".digit");

const lock =
    document.querySelector(".lock");

const status =
    document.getElementById("status");

const unlockButton =
    document.getElementById("unlock-btn");

const lockScreen =
    document.getElementById("lock-screen");

const birthdayScreen =
    document.getElementById("birthday-screen");

const replayButton =
    document.getElementById("replay-btn");


function renderDigits() {

    digitElements.forEach((element, index) => {

        element.textContent =
            digits[index];

    });

}


function changeDigit(index, amount) {

    digits[index] =
        (digits[index] + amount + 10) % 10;

    lock.classList.remove("correct");

    status.textContent =
        "Keep going. Your surprise is waiting. ♥";

    renderDigits();

}


/* =========================================
   PASSWORD BUTTONS
========================================= */

document
    .querySelectorAll(".up")
    .forEach(button => {

        button.addEventListener("click", () => {

            changeDigit(
                Number(button.dataset.index),
                1
            );

        });

    });


document
    .querySelectorAll(".down")
    .forEach(button => {

        button.addEventListener("click", () => {

            changeDigit(
                Number(button.dataset.index),
                -1
            );

        });

    });


/* =========================================
   MUSIC
========================================= */

const music =
    document.getElementById("birthday-music");

const musicButton =
    document.getElementById("music-btn");

let musicPlaying = false;


function startMusic() {

    music.volume = 0.35;

    const playPromise =
        music.play();

    if (playPromise !== undefined) {

        playPromise
            .then(() => {

                musicPlaying = true;

                musicButton.textContent =
                    "♫ MUSIC ON";

            })
            .catch(() => {

                musicPlaying = false;

                musicButton.textContent =
                    "♫ TAP FOR MUSIC";

            });

    }

}


musicButton.addEventListener(
    "click",
    () => {

        if (musicPlaying) {

            music.pause();

            musicPlaying = false;

            musicButton.textContent =
                "♫ MUSIC OFF";

        } else {

            music.play()
                .then(() => {

                    musicPlaying = true;

                    musicButton.textContent =
                        "♫ MUSIC ON";

                })
                .catch(() => {

                    musicPlaying = false;

                    musicButton.textContent =
                        "♫ TAP FOR MUSIC";

                });

        }

    }
);


/* =========================================
   FLOATING PIXELS
========================================= */

const floatingContainer =
    document.getElementById(
        "floating-pixels"
    );


const pixelSymbols = [

    {
        symbol: "♥",
        type: "heart"
    },

    {
        symbol: "♡",
        type: "heart"
    },

    {
        symbol: "★",
        type: "star"
    },

    {
        symbol: "✦",
        type: "sparkle"
    },

    {
        symbol: "✧",
        type: "sparkle"
    },

    {
        symbol: "✦",
        type: "blue"
    }

];


let floatingPixelsStarted = false;


function createFloatingPixel() {

    if (!floatingContainer) {
        return;
    }

    const randomPixel =
        pixelSymbols[
            Math.floor(
                Math.random() *
                pixelSymbols.length
            )
        ];


    const pixel =
        document.createElement("div");


    pixel.className =
        `floating-pixel ${randomPixel.type}`;


    pixel.textContent =
        randomPixel.symbol;


    pixel.style.left =
        `${Math.random() * 100}%`;


    pixel.style.fontSize =
        `${12 + Math.random() * 16}px`;


    pixel.style.animationDuration =
        `${6 + Math.random() * 7}s`;


    pixel.style.animationDelay =
        `${Math.random() * 1.5}s`;


    floatingContainer.appendChild(pixel);


    setTimeout(() => {

        pixel.remove();

    }, 15000);

}


function startFloatingPixels() {

    if (floatingPixelsStarted) {
        return;
    }

    floatingPixelsStarted = true;

    createFloatingPixel();

    setInterval(
        createFloatingPixel,
        650
    );

}


/* =========================================
   OPEN BIRTHDAY PAGE
========================================= */

unlockButton.addEventListener(
    "click",
    () => {

        const entered =
            digits.join("");


        if (entered === SECRET) {

            lock.classList.add("correct");

            status.textContent =
                "PASSWORD CORRECT! ♥";


            unlockButton.textContent =
                "OPENING...";


            unlockButton.disabled =
                true;


            setTimeout(() => {

                lockScreen.classList.remove(
                    "active"
                );

                birthdayScreen.classList.add(
                    "active"
                );


                window.scrollTo({
                    top: 0,
                    behavior: "instant"
                });


                startFloatingPixels();

                startMusic();

            }, 900);


        } else {

            status.textContent =
                "Wrong code. Try again! ♥";


            lock.animate(

                [
                    {
                        transform:
                            "translateX(0)"
                    },

                    {
                        transform:
                            "translateX(-8px)"
                    },

                    {
                        transform:
                            "translateX(8px)"
                    },

                    {
                        transform:
                            "translateX(-5px)"
                    },

                    {
                        transform:
                            "translateX(0)"
                    }
                ],

                {
                    duration: 300
                }

            );

        }

    }
);


/* =========================================
   SECRET MESSAGE
========================================= */

const secretButton =
    document.getElementById(
        "secret-btn"
    );

const secretMessage =
    document.getElementById(
        "secret-message"
    );


secretButton.addEventListener(
    "click",
    () => {

        secretMessage.classList.toggle(
            "show"
        );


        if (
            secretMessage.classList.contains(
                "show"
            )
        ) {

            secretButton.textContent =
                "♥ SECRET OPENED ♥";

        } else {

            secretButton.textContent =
                "♥ PRESS THE HEART ♥";

        }

    }
);


/* =========================================
   MINI GAME
========================================= */

const game =
    document.getElementById("game");

const player =
    document.getElementById("player");

const startGameButton =
    document.getElementById(
        "start-game"
    );

const startGameScreen =
    document.getElementById(
        "game-start-screen"
    );

const scoreElement =
    document.getElementById("score");

const timeElement =
    document.getElementById("time");

const gameResult =
    document.getElementById(
        "game-result"
    );


let score = 0;
let timeLeft = 30;

let gameRunning = false;

let gameTimer = null;
let heartSpawner = null;
let collisionChecker = null;


/* =========================================
   MOVE PLAYER
========================================= */

function movePlayer(clientX) {

    if (!gameRunning) {
        return;
    }

    const gameRect =
        game.getBoundingClientRect();


    let x =
        clientX - gameRect.left;


    const playerWidth =
        player.offsetWidth;


    const halfPlayer =
        playerWidth / 2;


    x = Math.max(
        halfPlayer,
        Math.min(
            x,
            gameRect.width - halfPlayer
        )
    );


    player.style.left =
        `${x}px`;

}


/* Mouse */

game.addEventListener(
    "mousemove",
    event => {

        movePlayer(event.clientX);

    }
);


/* Touch */

game.addEventListener(
    "touchmove",
    event => {

        if (!gameRunning) {
            return;
        }

        event.preventDefault();

        movePlayer(
            event.touches[0].clientX
        );

    },
    {
        passive: false
    }
);


/* =========================================
   SPAWN FALLING HEART
========================================= */

function spawnHeart() {

    if (!gameRunning) {
        return;
    }


    const heart =
        document.createElement("div");


    heart.className =
        "falling-heart";


    heart.textContent =
        "♥";


    const gameWidth =
        game.clientWidth;


    const heartSize = 30;


    const randomX =
        Math.random() *
        (gameWidth - heartSize);


    heart.style.left =
        `${Math.max(
            0,
            randomX
        )}px`;


    const fallDuration =
        2.5 +
        Math.random() * 1.5;


    heart.style.animationDuration =
        `${fallDuration}s`;


    game.appendChild(heart);


    setTimeout(() => {

        if (heart.isConnected) {
            heart.remove();
        }

    }, (fallDuration + 0.2) * 1000);

}


/* =========================================
   COLLISION DETECTION
========================================= */

function checkCollisions() {

    if (!gameRunning) {
        return;
    }


    const playerRect =
        player.getBoundingClientRect();


    const hearts =
        document.querySelectorAll(
            ".falling-heart"
        );


    hearts.forEach(heart => {

        const heartRect =
            heart.getBoundingClientRect();


        const collision =

            playerRect.left <
                heartRect.right &&

            playerRect.right >
                heartRect.left &&

            playerRect.top <
                heartRect.bottom &&

            playerRect.bottom >
                heartRect.top;


        if (collision) {

            catchHeart(heart);

        }

    });

}


/* =========================================
   CATCH HEART
========================================= */

function catchHeart(heart) {

    if (!gameRunning) {
        return;
    }


    if (!heart.isConnected) {
        return;
    }


    heart.remove();


    score++;


    scoreElement.textContent =
        score;


    player.animate(

        [
            {
                transform:
                    "translateX(-50%) scale(1)"
            },

            {
                transform:
                    "translateX(-50%) scale(1.3)"
            },

            {
                transform:
                    "translateX(-50%) scale(1)"
            }
        ],

        {
            duration: 180
        }

    );


    if (score >= 10) {

        winGame();

    }

}


/* =========================================
   START GAME
========================================= */

startGameButton.addEventListener(
    "click",
    startGame
);


function startGame() {

    if (gameRunning) {
        return;
    }


    score = 0;

    timeLeft = 30;

    gameRunning = true;


    scoreElement.textContent =
        "0";

    timeElement.textContent =
        "30";


    gameResult.textContent =
        "";


    startGameScreen.style.display =
        "none";


    document
        .querySelectorAll(".falling-heart")
        .forEach(heart => {

            heart.remove();

        });


    clearInterval(gameTimer);
    clearInterval(heartSpawner);
    clearInterval(collisionChecker);


    player.style.left =
        "50%";


    /* Timer */

    gameTimer =
        setInterval(() => {

            timeLeft--;

            timeElement.textContent =
                timeLeft;


            if (timeLeft <= 0) {

                endGame();

            }

        }, 1000);


    /* Spawn hearts */

    heartSpawner =
        setInterval(
            spawnHeart,
            700
        );


    /* Collision checking */

    collisionChecker =
        setInterval(
            checkCollisions,
            30
        );


    /* First heart */

    spawnHeart();

}


/* =========================================
   WIN
========================================= */

function winGame() {

    gameRunning = false;


    clearInterval(gameTimer);
    clearInterval(heartSpawner);
    clearInterval(collisionChecker);


    document
        .querySelectorAll(".falling-heart")
        .forEach(heart => {

            heart.remove();

        });


    gameResult.textContent =
        "YOU DID IT! ♥ 10 HEARTS! HAPPY BIRTHDAY! 🎂";


    startGameScreen.style.display =
        "flex";


    startGameScreen
        .querySelector("p")
        .textContent =
        "YOU WON!";


    startGameButton.textContent =
        "PLAY AGAIN";

}


/* =========================================
   GAME OVER
========================================= */

function endGame() {

    gameRunning = false;


    clearInterval(gameTimer);
    clearInterval(heartSpawner);
    clearInterval(collisionChecker);


    document
        .querySelectorAll(".falling-heart")
        .forEach(heart => {

            heart.remove();

        });


    gameResult.textContent =
        `TIME'S UP! You caught ${score} heart${score === 1 ? "" : "s"}. ♥`;


    startGameScreen.style.display =
        "flex";


    startGameScreen
        .querySelector("p")
        .textContent =
        "TRY AGAIN?";


    startGameButton.textContent =
        "PLAY AGAIN";

}


/* =========================================
   REPLAY PASSWORD
========================================= */

replayButton.addEventListener(
    "click",
    () => {

        clearInterval(gameTimer);
        clearInterval(heartSpawner);
        clearInterval(collisionChecker);


        gameRunning = false;


        document
            .querySelectorAll(".falling-heart")
            .forEach(heart => {

                heart.remove();

            });


        score = 0;

        timeLeft = 30;


        scoreElement.textContent =
            "0";

        timeElement.textContent =
            "30";


        gameResult.textContent =
            "";


        startGameScreen.style.display =
            "flex";


        startGameScreen
            .querySelector("p")
            .textContent =
            "READY?";


        startGameButton.textContent =
            "START GAME";


        secretMessage.classList.remove(
            "show"
        );


        secretButton.textContent =
            "♥ PRESS THE HEART ♥";


        music.pause();

        music.currentTime = 0;

        musicPlaying = false;


        musicButton.textContent =
            "♫ MUSIC ON";


        digits.fill(0);

        renderDigits();


        lock.classList.remove(
            "correct"
        );


        status.textContent =
            "Hint: six digits. Something special is waiting.";


        unlockButton.textContent =
            "OPEN ♥";


        unlockButton.disabled =
            false;


        birthdayScreen.classList.remove(
            "active"
        );


        lockScreen.classList.add(
            "active"
        );


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


/* =========================================
   INITIALIZE
========================================= */

renderDigits();
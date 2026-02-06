
const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const board = document.getElementById("board");
const gameArea = document.getElementById("gameArea");
const modeSelection = document.getElementById("modeSelection");
const confettiContainer = document.getElementById("confetti");

let currentPlayer = "X";
let gameActive = true;
let gameState = ["", "", "", "", "", "", "", "", ""];
let playWithAI = false;

const winConditions = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

cells.forEach(cell => cell.addEventListener("click", handleCellClick));

function startGame(aiMode) {
    playWithAI = aiMode;
    modeSelection.classList.add("hidden");
    gameArea.classList.remove("hidden");
    restartGame();
}

function handleCellClick() {
    const index = this.dataset.index;

    if (gameState[index] !== "" || !gameActive) return;

    gameState[index] = currentPlayer;
    this.textContent = currentPlayer;

    if (checkResult()) return;

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s Turn`;

    if (playWithAI && currentPlayer === "O") {
        setTimeout(aiMove, 500);
    }
}

function checkResult() {
    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (gameState[a] &&
            gameState[a] === gameState[b] &&
            gameState[a] === gameState[c]) {

            gameActive = false;

            if (playWithAI && currentPlayer === "O") {
                statusText.textContent = "You Lost 😢";
            } else {
                statusText.textContent = `Player ${currentPlayer} Wins! 🎉`;
            }

            launchConfetti();
            return true;
        }
    }

    if (!gameState.includes("")) {
        statusText.textContent = "It's a Draw 🤝";
        board.classList.add("draw");
        gameActive = false;
        return true;
    }
    return false;
}

function aiMove() {
    let empty = gameState
        .map((v, i) => v === "" ? i : null)
        .filter(v => v !== null);

    let move = empty[Math.floor(Math.random() * empty.length)];
    gameState[move] = "O";
    cells[move].textContent = "O";

    checkResult();
    currentPlayer = "X";
    statusText.textContent = "Player X's Turn";
}

function restartGame() {
    gameActive = true;
    currentPlayer = "X";
    gameState.fill("");
    cells.forEach(c => c.textContent = "");
    statusText.textContent = "Player X's Turn";
    board.classList.remove("draw");
    confettiContainer.innerHTML = "";
}

function launchConfetti() {
    for (let i = 0; i < 80; i++) {
        const piece = document.createElement("div");
        piece.classList.add("confetti-piece");
        piece.style.left = Math.random() * 100 + "vw";
        piece.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
        piece.style.animationDuration = Math.random() * 2 + 2 + "s";
        confettiContainer.appendChild(piece);

        setTimeout(() => piece.remove(), 3000);
    }
}

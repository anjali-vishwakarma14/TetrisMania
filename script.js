let canvas = document.querySelector("#tetris");
let scoreboard = document.querySelector("h2");
let ctx = canvas.getContext("2d");
ctx.scale(30, 30);

const SHAPES = [
    [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0]
    ],
    [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0]
    ],
    [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1]
    ],
    [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0]
    ],
    [
        [1, 1],
        [1, 1],
    ]
]

const COLORS = [
    "#000000",  // Default background color (white)
    "#FF5733",  // Bright Red-Orange
    "#FFBD33",  // Bright Yellow-Orange
    "#75FF33",  // Bright Lime Green
    "#33FF57",  // Bright Green
    "#33FFBD",  // Bright Aquamarine
    "#339FFF",  // Bright Sky Blue
    "#9F33FF"   // Bright Purple
];

const ROWS = 20;
const COLS = 10;

let grid = generateGrid();
let fallingPieceObj = null;
let score = 0;

setInterval(newGameState, 500);
function newGameState() {
    checkGrid();
    if (!fallingPieceObj) {
        fallingPieceObj = randomPieceObject();
    }
    renderGame();
    moveDown();
}

function checkGrid() {
    let count = 0;
    for (let i = 0; i < grid.length; i++) {
        let allFilled = true;
        for (let j = 0; j < grid[0].length; j++) {
            if (grid[i][j] == 0) {
                allFilled = false
            }
        }
        if (allFilled) {
            count++;
            grid.splice(i, 1);
            grid.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        }
    }
    if (count == 1) {
        score += 10;
    } else if (count == 2) {
        score += 30;
    } else if (count == 3) {
        score += 50;
    } else if (count > 3) {
        score += 100
    }
    scoreboard.innerHTML = "Score: " + score;
}

function generateGrid() {
    let grid = [];
    for (let i = 0; i < ROWS; i++) {
        grid.push([]);
        for (let j = 0; j < COLS; j++) {
            grid[i].push(0)
        }
    }
    return grid;
}

function randomPieceObject() {
    let ran = Math.floor(Math.random() * SHAPES.length);
    let piece = SHAPES[ran];
    let colorIndex = ran + 1;
    let x = Math.floor((COLS - piece[0].length) / 2);
    let y = 0;
    return { piece, colorIndex, x, y }
}

function renderPiece() {
    if(!fallingPieceObj) return;
    let piece = fallingPieceObj.piece;
    for (let i = 0; i < piece.length; i++) {
        for (let j = 0; j < piece[i].length; j++) {
            if (piece[i][j] == 1) {
                ctx.fillStyle = COLORS[fallingPieceObj.colorIndex];
                ctx.fillRect(fallingPieceObj.x + j, fallingPieceObj.y + i, 1, 1);
            }
        }
    }
}

function moveDown() {
    if(!fallingPieceObj) return;
    if (!collision(fallingPieceObj.x, fallingPieceObj.y + 1)) {
        fallingPieceObj.y += 1;
    } else {
        let piece = fallingPieceObj.piece
        for (let i = 0; i < piece.length; i++) {
            for (let j = 0; j < piece[i].length; j++) {
                if (piece[i][j] == 1) {
                    let p = fallingPieceObj.x + j;
                    let q = fallingPieceObj.y + i;
                    grid[q][p] = fallingPieceObj.colorIndex;
                }
            }
        }
        if (fallingPieceObj.y === 0) {
            alert("gamer over");
            grid = generateGrid();
            score = 0;
            fallingPieceObj = null;
            return;
        }
        fallingPieceObj = null;
    }
    renderGame();
}

function moveLeft() {
    if(!fallingPieceObj) return;
    if (!collision(fallingPieceObj.x - 1, fallingPieceObj.y))
        fallingPieceObj.x -= 1;
    renderGame();
}

function moveRight() {
    if(!fallingPieceObj) return;
    if (!collision(fallingPieceObj.x + 1, fallingPieceObj.y))
        fallingPieceObj.x += 1;
    renderGame();
}

function rotate() {
    if(!fallingPieceObj) return;
    let rotatedPiece = [];
    let piece = fallingPieceObj.piece;
    for (let i = 0; i < piece.length; i++) {
        rotatedPiece.push([]);
        for (let j = 0; j < piece[i].length; j++) {
            rotatedPiece[i].push(0);
        }
    }
    for (let i = 0; i < piece.length; i++) {
        for (let j = 0; j < piece[i].length; j++) {
            rotatedPiece[i][j] = piece[j][i]
        }
    }

    for (let i = 0; i < rotatedPiece.length; i++) {
        rotatedPiece[i] = rotatedPiece[i].reverse();
    }
    if (!collision(fallingPieceObj.x, fallingPieceObj.y, rotatedPiece))
        fallingPieceObj.piece = rotatedPiece
    renderGame();
}

function collision(x, y, rotatedPiece) {
    let piece = rotatedPiece || fallingPieceObj.piece
    for (let i = 0; i < piece.length; i++) {
        for (let j = 0; j < piece[i].length; j++) {
            if (piece[i][j] == 1) {
                let p = x + j;
                let q = y + i;
                if (p >= 0 && p < COLS && q >= 0 && q < ROWS) {
                    if (grid[q][p] > 0) {
                        return true;
                    }
                } else {
                    return true;
                }
            }
        }
    }
    return false;
}

function renderGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            ctx.fillStyle = COLORS[grid[i][j]];
            ctx.fillRect(j, i, 1, 1)
        }
    }
    renderPiece();
}

function hardDrop() {
    while (!collision(fallingPieceObj.x, fallingPieceObj.y + 1)) {
        fallingPieceObj.y += 1;
    }
    moveDown();
}

document.addEventListener("keydown", function (e) {
    let key = e.key;
    if(!fallingPieceObj) return;
    if (key == "ArrowDown") {
        moveDown();
    } else if (key == "ArrowLeft") {
        moveLeft();
    } else if (key == "ArrowRight") {
        moveRight();
    } else if (key == "ArrowUp") {
        rotate();
    } else if (key === " ") {
        hardDrop();
    }
});
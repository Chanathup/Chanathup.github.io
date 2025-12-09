// --- Constants & Variables ---
const ROWS = 6;
const COLS = 7;
let board = [];
let currentPlayer = 1; // 1 = Red, 2 = Yellow
let scores = { 1: 0, 2: 0 };
let gameActive = true;
let isProcessing = false;

// --- Audio System ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(freq, type, duration) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

function playDropSound() {
    playTone(600, 'sine', 0.1);
    setTimeout(() => playTone(400, 'triangle', 0.2), 50);
}

function playWinSound() {
    playTone(400, 'square', 0.1);
    setTimeout(() => playTone(500, 'square', 0.1), 150);
    setTimeout(() => playTone(600, 'square', 0.2), 300);
    setTimeout(() => playTone(800, 'square', 0.4), 450);
}

// --- Game Logic ---

function initGame() {
    const boardEl = document.getElementById('board');
    boardEl.innerHTML = '';
    board = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
    
    // สร้างกระดาน
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.onclick = () => handleMove(c);
            boardEl.appendChild(cell);
        }
    }
    gameActive = true;
    isProcessing = false;
    updateStatus();
    highlightActivePlayer();
}

function handleMove(col) {
    if (!gameActive || isProcessing) return;

    // หาแถวล่างสุดที่ว่าง
    let rowToPlace = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
        if (board[r][col] === 0) {
            rowToPlace = r;
            break;
        }
    }

    if (rowToPlace === -1) return; // แถวเต็ม

    isProcessing = true;
    board[rowToPlace][col] = currentPlayer;
    
    // Animation
    const index = rowToPlace * COLS + col;
    const cell = document.getElementById('board').children[index];
    const piece = document.createElement('div');
    piece.classList.add('piece', currentPlayer === 1 ? 'red' : 'yellow');
    cell.appendChild(piece);
    
    playDropSound();

    setTimeout(() => {
        if (checkWin(rowToPlace, col)) {
            handleRoundWin();
        } else if (checkDraw()) {
            document.getElementById('status').textContent = "เสมอ! (Draw)";
            gameActive = false;
        } else {
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            updateStatus();
            highlightActivePlayer();
            isProcessing = false;
        }
    }, 500);
}

function checkWin(r, c) {
    const directions = [
        [[0, 1], [0, -1]], // แนวนอน
        [[1, 0], [-1, 0]], // แนวตั้ง
        [[1, 1], [-1, -1]], // เฉียง \
        [[1, -1], [-1, 1]]  // เฉียง /
    ];

    const player = board[r][c];

    for (let axis of directions) {
        let count = 1;
        for (let dir of axis) {
            let nr = r + dir[0];
            let nc = c + dir[1];
            while (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc] === player) {
                count++;
                nr += dir[0];
                nc += dir[1];
            }
        }
        if (count >= 4) return true;
    }
    return false;
}

function checkDraw() {
    return board[0].every(cell => cell !== 0);
}

function handleRoundWin() {
    gameActive = false;
    playWinSound();
    scores[currentPlayer]++;
    updateScoreBoard();
    
    const colorName = currentPlayer === 1 ? "สีแดง" : "สีเหลือง";
    
    if (scores[currentPlayer] >= 2) {
        // Grand Winner
        const winText = document.getElementById('winnerText');
        winText.textContent = `ผู้เล่น ${colorName} ชนะเลิศ!`;
        winText.style.color = currentPlayer === 1 ? 'var(--p1-color)' : 'var(--p2-color)';
        document.getElementById('winModal').style.display = 'flex';
    } else {
        document.getElementById('status').textContent = `จบเกม! ${colorName} ชนะรอบนี้ (แต้ม 2 ใน 3)`;
    }
    isProcessing = false;
}

function updateScoreBoard() {
    document.getElementById('score1').textContent = scores[1];
    document.getElementById('score2').textContent = scores[2];
}

function highlightActivePlayer() {
    const p1Area = document.getElementById('p1-area');
    const p2Area = document.getElementById('p2-area');
    if (currentPlayer === 1) {
        p1Area.classList.add('active-turn');
        p2Area.classList.remove('active-turn');
    } else {
        p2Area.classList.add('active-turn');
        p1Area.classList.remove('active-turn');
    }
}

function updateStatus() {
    const color = currentPlayer === 1 ? 'สีแดง' : 'สีเหลือง';
    document.getElementById('status').textContent = `ตาของ ${color} เดิน...`;
}

function resetGame() {
    document.getElementById('winModal').style.display = 'none';
    initGame();
}

function resetMatch() {
    scores = { 1: 0, 2: 0 };
    currentPlayer = 1;
    updateScoreBoard();
    resetGame();
}

// --- Theme Toggle ---
function toggleTheme() {
    const body = document.body;
    const btn = document.getElementById('theme-toggle');
    body.classList.toggle('light-mode');
    
    if (body.classList.contains('light-mode')) {
        btn.textContent = '🌙 โหมดมืด';
    } else {
        btn.textContent = '☀️ โหมดสว่าง';
    }
}

// --- Event Listeners ---
document.getElementById('reset-btn').addEventListener('click', resetGame);
document.getElementById('new-match-btn').addEventListener('click', resetMatch);
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

// Start
initGame();

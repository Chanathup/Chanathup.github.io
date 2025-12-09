// ขนาดกระดาน
const ROWS = 6;
const COLS = 7;

// สถานะเกม
let board;
let currentPlayer = 1; // 1 = แดง, 2 = เหลือง
let isGameOver = false;

// คะแนนรวม
let scores = {
    player1: 0,
    player2: 0
};
const MAX_SCORE = 2; // ชนะ 2 ใน 3

// ตัวแปร DOM
const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const resetButton = document.getElementById('reset-button');
const scorePlayer1Element = document.getElementById('score-player1');
const scorePlayer2Element = document.getElementById('score-player2');
const dropSound = document.getElementById('drop-sound'); // ต้องเพิ่มไฟล์ drop.mp3
const winSound = document.getElementById('win-sound');   // ต้องเพิ่มไฟล์ win.mp3

// --- ฟังก์ชันหลักของเกม ---

/**
 * เริ่มต้น/รีเซ็ตสถานะกระดาน
 */
function initializeBoard() {
    board = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
    boardElement.innerHTML = ''; // ล้างกระดาน
    isGameOver = false;
    currentPlayer = 1; // เริ่มที่ผู้เล่น 1 เสมอ

    // สร้างเซลล์กระดาน
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener('click', () => handleTurn(c));
            boardElement.appendChild(cell);
        }
    }
    updateStatus();
    updateScoreboard();
}

/**
 * จัดการเมื่อผู้เล่นคลิกคอลัมน์
 * @param {number} colIndex - ดัชนีคอลัมน์ที่ถูกคลิก
 */
function handleTurn(colIndex) {
    if (isGameOver) return;

    // หาแถวที่ต่ำที่สุดในคอลัมน์นั้นที่ยังว่างอยู่
    let rowIndex = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
        if (board[r][colIndex] === 0) {
            rowIndex = r;
            break;
        }
    }

    if (rowIndex !== -1) {
        // 1. วางชิปในตารางข้อมูล
        board[rowIndex][colIndex] = currentPlayer;

        // 2. อัปเดต UI และเล่นเสียง
        placeChip(rowIndex, colIndex, currentPlayer);
        // dropSound.play(); // ยกเลิกการคอมเมนต์เมื่อเพิ่มไฟล์เสียง

        // 3. ตรวจสอบผู้ชนะ
        if (checkWin(rowIndex, colIndex)) {
            endGame(currentPlayer);
            return;
        }

        // 4. ตรวจสอบการเสมอ
        if (checkTie()) {
            endGame(0); // 0 คือเสมอ
            return;
        }

        // 5. สลับผู้เล่น
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        updateStatus();
    }
}

/**
 * อัปเดต UI ด้วยการวางชิปแบบมีแอนิเมชัน
 * @param {number} r - แถว
 * @param {number} c - คอลัมน์
 * @param {number} player - ผู้เล่น (1 หรือ 2)
 */
function placeChip(r, c, player) {
    const cell = boardElement.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
    const chip = document.createElement('div');
    chip.classList.add('chip', `player${player}`);
    
    // แอนิเมชันจะถูกจัดการด้วย CSS (drop keyframes)
    // การเพิ่มชิปเข้าไปในเซลล์จะทำให้เกิดแอนิเมชัน
    cell.appendChild(chip);
}

/**
 * ตรวจสอบว่ามีผู้ชนะหรือไม่ ณ ตำแหน่งที่วางล่าสุด
 */
function checkWin(r, c) {
    const p = board[r][c]; // ผู้เล่นปัจจุบัน
    
    // ฟังก์ชันย่อยสำหรับตรวจสอบ 4 แนว (แนวนอน, แนวตั้ง, แนวทแยง 2 แบบ)
    const checkLine = (r, c, dr, dc) => {
        let count = 0;
        // ตรวจสอบไปทิศทางหนึ่ง
        for (let i = -3; i <= 3; i++) {
            const nr = r + i * dr;
            const nc = c + i * dc;
            
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc] === p) {
                count++;
            } else {
                count = 0; // รีเซ็ตหากไม่ต่อเนื่อง
            }
            if (count >= 4) return true;
        }
        return false;
    };

    // ตรวจสอบทุกทิศทาง
    return checkLine(r, c, 0, 1) || // แนวนอน
           checkLine(r, c, 1, 0) || // แนวตั้ง
           checkLine(r, c, 1, 1) || // แนวทแยงลงขวา
           checkLine(r, c, 1, -1);  // แนวทแยงลงซ้าย
}

/**
 * ตรวจสอบการเสมอ (กระดานเต็ม)
 */
function checkTie() {
    return board.every(row => row.every(cell => cell !== 0));
}

/**
 * จบเกมและอัปเดตคะแนน
 * @param {number} winner - ผู้ชนะ (1, 2, หรือ 0 สำหรับเสมอ)
 */
function endGame(winner) {
    isGameOver = true;
    
    if (winner === 1 || winner === 2) {
        // winSound.play(); // ยกเลิกการคอมเมนต์เมื่อเพิ่มไฟล์เสียง
        statusElement.textContent = `🎉 ผู้เล่น ${winner === 1 ? '1 (แดง)' : '2 (เหลือง)'} ชนะรอบนี้! 🎉`;
        
        // อัปเดตคะแนน
        if (winner === 1) {
            scores.player1++;
        } else {
            scores.player2++;
        }
        updateScoreboard();

        // ตรวจสอบผู้ชนะรวม (2 ใน 3)
        if (scores.player1 >= MAX_SCORE || scores.player2 >= MAX_SCORE) {
            statusElement.textContent = `🏆 ผู้ชนะการแข่งขันคือ ผู้เล่น ${winner === 1 ? '1 (แดง)' : '2 (เหลือง)'}!! 🏆`;
            resetButton.textContent = 'เริ่มการแข่งขันใหม่'; // เปลี่ยนปุ่มเป็นรีเซ็ตทั้งหมด
        } else {
            // พร้อมเริ่มรอบต่อไป
            setTimeout(() => {
                if (!isGameOver) return; // ป้องกันการรีเซ็ตทันทีหากผู้เล่นกดรีเซ็ตเอง
                statusElement.textContent += ' (กำลังเริ่มรอบใหม่...)';
                setTimeout(initializeBoard, 2000); // หน่วงเวลาเล็กน้อยก่อนเริ่มรอบใหม่
            }, 1000);
        }

    } else {
        statusElement.textContent = 'เสมอ! กระดานเต็ม';
    }
}

/**
 * อัปเดตข้อความสถานะการเล่น
 */
function updateStatus() {
    statusElement.textContent = `ตาของผู้เล่น ${currentPlayer === 1 ? '1 (แดง)' : '2 (เหลือง)'}`;
}

/**
 * อัปเดตการแสดงผลคะแนน
 */
function updateScoreboard() {
    scorePlayer1Element.textContent = scores.player1;
    scorePlayer2Element.textContent = scores.player2;
}

// --- การจัดการเหตุการณ์และเริ่มต้น ---

// เหตุการณ์ปุ่มรีเซ็ต
resetButton.addEventListener('click', () => {
    // หากมีผู้ชนะรวมแล้ว ให้รีเซ็ตคะแนนทั้งหมด
    if (scores.player1 >= MAX_SCORE || scores.player2 >= MAX_SCORE) {
        scores.player1 = 0;
        scores.player2 = 0;
        resetButton.textContent = 'เริ่มเกมใหม่';
    }
    initializeBoard();
});

// เริ่มเกมครั้งแรก
initializeBoard();

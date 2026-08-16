const rows = 6;
const cols = 7;
let currentPlayer = "red";
let board = [];
let isGameOver = false;

const boardDiv = document.getElementById("board");
const buttonsLayer = document.getElementById("buttons-layer");
const playerIndicator = document.getElementById("player-indicator");
const winnerMessage = document.getElementById("winner-message");

// สร้างปุ่มลูกศรด้านบน
function createButtons() {
  buttonsLayer.innerHTML = "";
  for (let c = 0; c < cols; c++) {
    const btn = document.createElement("button");
    btn.className = "column-btn";
    btn.onclick = () => dropPiece(c);
    buttonsLayer.appendChild(btn);
  }
}

// สร้างกระดาน
function createBoard() {
  board = [];
  boardDiv.innerHTML = "";
  for (let r = 0; r < rows; r++) {
    board[r] = [];
    for (let c = 0; c < cols; c++) {
      board[r][c] = null;
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = r;
      cell.dataset.col = c;
      boardDiv.appendChild(cell);
    }
  }
}

// เริ่มเกมครั้งแรก
createButtons();
createBoard();

function dropPiece(c) {
  if (isGameOver) return; // ถ้าจบเกมแล้ว กดไม่ได้

  for (let r = rows - 1; r >= 0; r--) {
    if (!board[r][c]) {
      // 1. ลงข้อมูลใน Logic
      board[r][c] = currentPlayer;

      // 2. แสดงผล (UI)
      const cell = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
      
      // สร้าง element ลูกบอลแยกออกมาเพื่อทำ Animation
      const piece = document.createElement("div");
      piece.classList.add("piece");
      cell.classList.add(currentPlayer); // ใส่ class สีให้ cell (เพื่ออ้างอิง)
      cell.appendChild(piece); // ใส่ลูกบอลลงไป

      // 3. ตรวจสอบผู้ชนะ
      if (checkWin(r, c)) {
        showWinner(currentPlayer);
        isGameOver = true; // ล็อกเกม
        return; // **สำคัญ** จบฟังก์ชันทันที ไม่มีการสลับสี
      }

      // 4. สลับตาผู้เล่น (ถ้ายังไม่มีใครชนะ)
      currentPlayer = currentPlayer === "red" ? "yellow" : "red";
      updatePlayerIndicator();
      break;
    }
  }
}

function updatePlayerIndicator() {
  playerIndicator.className = `player-dot ${currentPlayer}`;
}

function showWinner(winner) {
  const winnerName = winner === "red" ? "สีแดง (Red)" : "สีเหลือง (Yellow)";
  winnerMessage.textContent = `🎉 ยินดีด้วย! ผู้เล่น ${winnerName} เป็นฝ่ายชนะ!`;
  winnerMessage.classList.remove("hidden");
  // เปลี่ยนสีกล่องข้อความตามผู้ชนะ
  winnerMessage.style.backgroundColor = winner === "red" ? "#e74c3c" : "#f1c40f";
  winnerMessage.style.color = winner === "red" ? "white" : "black";
}

// ตรวจสอบเงื่อนไขชนะ
function checkWin(row, col) {
  return (
    checkDir(row, col, 1, 0) || // แนวนอน
    checkDir(row, col, 0, 1) || // แนวตั้ง
    checkDir(row, col, 1, 1) || // แนวทแยงลงขวา
    checkDir(row, col, 1, -1)   // แนวทแยงลงซ้าย
  );
}

function checkDir(row, col, rowDir, colDir) {
  let count = 1;
  const current = board[row][col]; // สีของคนที่เพิ่งวาง

  // เดินหน้า
  for (let i = 1; i < 4; i++) {
    const r = row + i * rowDir;
    const c = col + i * colDir;
    if (r < 0 || r >= rows || c < 0 || c >= cols || board[r][c] !== current) break;
    count++;
  }
  // ถอยหลัง
  for (let i = 1; i < 4; i++) {
    const r = row - i * rowDir;
    const c = col - i * colDir;
    if (r < 0 || r >= rows || c < 0 || c >= cols || board[r][c] !== current) break;
    count++;
  }
  return count >= 4;
}

function resetGame() {
  createBoard();
  currentPlayer = "red";
  isGameOver = false;
  updatePlayerIndicator();
  winnerMessage.classList.add("hidden");
}
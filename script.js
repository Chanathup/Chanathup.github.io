const rows = 6;
const cols = 7;
let currentPlayer = "red";
let board = [];

const boardDiv = document.getElementById("board");
const playerText = document.getElementById("player");
const buttonsDiv = document.getElementById("buttons");

// สร้างปุ่มด้านบนแต่ละคอลัมน์
for (let c = 0; c < cols; c++) {
  const btn = document.createElement("button");
  btn.textContent = "ใส่!";
  btn.onclick = () => dropPiece(c);
  buttonsDiv.appendChild(btn);
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
createBoard();

function dropPiece(c) {
  for (let r = rows - 1; r >= 0; r--) {
    if (!board[r][c]) {
      board[r][c] = currentPlayer;
      const cell = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
      cell.classList.add(currentPlayer);
      if (checkWin(r, c)) {
        setTimeout(() => alert(`🎉 ผู้เล่น ${currentPlayer === "red" ? "🔴" : "🟡"} ชนะ!`), 100);
      }
      currentPlayer = currentPlayer === "red" ? "yellow" : "red";
      playerText.textContent = currentPlayer === "red" ? "🔴" : "🟡";
      break;
    }
  }
}

// ตรวจสอบผู้ชนะ
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
  for (let i = 1; i < 4; i++) {
    const r = row + i * rowDir;
    const c = col + i * colDir;
    if (r < 0 || r >= rows || c < 0 || c >= cols || board[r][c] !== currentPlayer) break;
    count++;
  }
  for (let i = 1; i < 4; i++) {
    const r = row - i * rowDir;
    const c = col - i * colDir;
    if (r < 0 || r >= rows || c < 0 || c >= cols || board[r][c] !== currentPlayer) break;
    count++;
  }
  return count >= 4;
}

function resetGame() {
  createBoard();
  currentPlayer = "red";
  playerText.textContent = "🔴";
}
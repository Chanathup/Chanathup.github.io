function drop(col) {
  if (gameOver) return;

  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r][col] === "") {
      board[r][col] = currentPlayer;
      document.getElementById(`${r}-${col}`).classList.add(currentPlayer);
      dropSound.play();

      if (checkWin()) {
        winSound.play();
        gameOver = true;

        // ✅ การ์ตูนผู้ชนะ
        let winnerIcon = currentPlayer === "red" ? "🐱‍👤🔴" : "🐯🟡";
        let winnerText = currentPlayer === "red" ? "ผู้เล่นสีแดงชนะ!" : "ผู้เล่นสีเหลืองชนะ!";

        setTimeout(() => {
          document.body.innerHTML = `
            <h1 style="font-size:40px;">🎉 ชนะแล้ว! 🎉</h1>
            <div style="font-size:80px;">${winnerIcon}</div>
            <h2>${winnerText}</h2>
            <button onclick="location.reload()" style="
              font-size:24px;
              padding:10px 20px;
              border-radius:10px;
              cursor:pointer;
            ">🔄 เล่นใหม่</button>
          `;
        }, 300);

        return;
      }

      currentPlayer = currentPlayer === "red" ? "yellow" : "red";
      playerIcon.textContent = currentPlayer === "red" ? "🔴" : "🟡";
      return;
    }
  }
}

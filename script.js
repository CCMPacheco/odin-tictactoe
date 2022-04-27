const player = (name, ai) => {
  return { name: name, ai: ai };
};

const gameBoard = (() => {
  const boardState = ["", "", "", "", "", "", "", "", ""];
  const cellElements = document.querySelectorAll("[data-cell]");

  const getBoard = () => {
    const board = [...cellElements];
    for (let i = 0; i < board.length; i++) {
      if (board[i].classList.contains("x")) {
        boardState[i] = "x";
      } else if (board[i].classList.contains("o")) {
        boardState[i] = "o";
      } else {
        boardState[i] = "";
      }
    }
  };

  const resetBoard = () => {
    cellElements.forEach((cell) => {
      cell.classList.remove("x");
      cell.classList.remove("o");
    });
    getBoard();
  };

  return { boardState, getBoard, resetBoard };
})();

const displayController = (() => {
  const startBtn = document.querySelector("[data-start-btn]");
  const playerOneName = document.getElementById("player-one");
  const playerTwoName = document.getElementById("player-two");
  const oneDisplayName = document.querySelector("[data-player-one]");
  const twoDisplayName = document.querySelector("[data-player-two]");
  const namesDisplay = document.querySelector("[data-names]");
  const startScreen = document.getElementById("start-screen");
  const endScreen = document.getElementById("end-screen");
  const againBtn = document.querySelector("[data-again-btn]");
  const backBtn = document.querySelector("[data-back-btn]");

  const handleStartGame = () => {
    const playerOne = player(playerOneName.value, false);
    const playerTwo = player(playerTwoName.value, false);

    if (playerOne.name) {
      oneDisplayName.textContent = playerOne.name.toUpperCase();
    } else {
      oneDisplayName.textContent = "PLAYER ONE";
    }

    if (playerTwo.name) {
      twoDisplayName.textContent = playerTwo.name.toUpperCase();
    } else {
      twoDisplayName.textContent = "PLAYER TWO";
    }

    namesDisplay.classList.add("show");
    startScreen.classList.remove("show");
    endScreen.classList.remove("show");
    gameController.startGame();
  };

  const handleBack = () => {
    endScreen.classList.remove("show");
    playerOneName.value = "";
    playerTwoName.value = "";
    oneDisplayName.textContent = "";
    twoDisplayName.textContent = "";
    startScreen.classList.add("show");
  };

  startBtn.addEventListener("click", handleStartGame);

  againBtn.addEventListener("click", handleStartGame);

  backBtn.addEventListener("click", handleBack);

  return { oneDisplayName, twoDisplayName, endScreen };
})();

const gameController = (() => {
  let xTurn;
  const WIN_CONDITION = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  const board = document.getElementById("board");
  const cellElements = document.querySelectorAll("[data-cell]");
  const winningMsg = document.querySelector("[data-winning-msg]");

  const handleClick = (e) => {
    const cell = e.target;

    placeMark(cell, xTurn);
    gameBoard.getBoard();

    if (checkWin()) {
      if (xTurn) {
        winningMsg.textContent = `${displayController.oneDisplayName.textContent} WINS!`;
        winningMsg.style.color = "var(--color-x-mark)";
        displayController.endScreen.classList.add("show");
      } else {
        winningMsg.textContent = `${displayController.twoDisplayName.textContent} WINS!`;
        winningMsg.style.color = "var(--color-o-mark)";
        displayController.endScreen.classList.add("show");
      }
    } else if (checkDraw()) {
      winningMsg.textContent = `GAME IS A DRAW`;
      winningMsg.style.color = "var(--color-light)";
      displayController.endScreen.classList.add("show");
    } else {
      swapTurn();
      hoverMark();
    }
  };

  const placeMark = (cell, turn) => {
    if (turn) {
      cell.classList.add("x");
    } else {
      cell.classList.add("o");
    }
  };

  const swapTurn = () => {
    xTurn = !xTurn;
  };

  const hoverMark = () => {
    board.classList.remove("x-turn");
    board.classList.remove("o-turn");
    if (xTurn) {
      board.classList.add("x-turn");
    } else {
      board.classList.add("o-turn");
    }
  };

  const startGame = () => {
    xTurn = true;
    cellElements.forEach((cell) => {
      cell.addEventListener("click", handleClick, { once: true });
    });
    gameBoard.resetBoard();
    hoverMark();
  };

  const checkWin = () => {
    let winner = false;
    for (let i = 0; i < WIN_CONDITION.length; i++) {
      const a = gameBoard.boardState[WIN_CONDITION[i][0]];
      const b = gameBoard.boardState[WIN_CONDITION[i][1]];
      const c = gameBoard.boardState[WIN_CONDITION[i][2]];
      if (a !== "" && b !== "" && c !== "" && a === b && b === c) {
        winner = true;
      }
    }
    return winner;
  };

  const checkDraw = () => {
    return gameBoard.boardState.every((cell) => {
      return cell !== "";
    });
  };

  startGame();

  return { startGame };
})();

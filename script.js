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
  const aiOpponent = [false];
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
  const humanBtn = document.querySelector("[data-human]");
  const botBtn = document.querySelector("[data-ai]");
  const againstMsg = document.querySelector("[data-against-msg]");

  const handleStartGame = () => {
    const playerOne = player(playerOneName.value, false);
    const playerTwo = player(playerTwoName.value, aiOpponent[0]);

    if (playerOne.name) {
      oneDisplayName.textContent = playerOne.name.toUpperCase();
    } else {
      oneDisplayName.textContent = "PLAYER ONE";
    }

    if (playerTwo.name) {
      twoDisplayName.textContent = playerTwo.name.toUpperCase();
    } else if (aiOpponent[0]) {
      twoDisplayName.textContent = "BOT";
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
    botBtn.classList.remove("no-show");
    humanBtn.classList.remove("no-show");
    againstMsg.classList.remove("no-show");
    playerOneName.classList.remove("show");
    playerTwoName.classList.remove("show");
    startBtn.classList.remove("show");
    startScreen.classList.add("show");
  };

  const displayHumanMenu = () => {
    aiOpponent[0] = false;
    botBtn.classList.add("no-show");
    humanBtn.classList.add("no-show");
    againstMsg.classList.add("no-show");
    playerOneName.classList.add("show");
    playerTwoName.classList.add("show");
    startBtn.classList.add("show");
  };

  const displayBotMenu = () => {
    aiOpponent[0] = true;
    botBtn.classList.add("no-show");
    humanBtn.classList.add("no-show");
    againstMsg.classList.add("no-show");
    playerOneName.classList.add("show");
    startBtn.classList.add("show");
  };

  startBtn.addEventListener("click", handleStartGame);

  againBtn.addEventListener("click", handleStartGame);

  backBtn.addEventListener("click", handleBack);

  humanBtn.addEventListener("click", displayHumanMenu);

  botBtn.addEventListener("click", displayBotMenu);

  return { oneDisplayName, twoDisplayName, endScreen, aiOpponent };
})();

const gameController = (() => {
  let xTurn;
  const playerOne = player("", false);
  const playerTwo = player("", false);
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
    if (cell.classList.contains("x") || cell.classList.contains("o")) {
      return;
    }
    placeMark(cell, xTurn);
    gameBoard.getBoard();
    endGame();
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

    playerOne.name = displayController.oneDisplayName.textContent;
    playerOne.ai = false;
    playerTwo.name = displayController.aiOpponent[0]
      ? "BOT"
      : displayController.twoDisplayName.textContent;
    playerTwo.ai = displayController.aiOpponent[0];

    cellElements.forEach((cell) => {
      cell.addEventListener("click", handleClick, { once: true });
    });

    gameBoard.resetBoard();
    hoverMark();
  };

  let result;
  const checkWin = () => {
    let winner = false;
    result = null;
    for (let i = 0; i < WIN_CONDITION.length; i++) {
      const a = gameBoard.boardState[WIN_CONDITION[i][0]];
      const b = gameBoard.boardState[WIN_CONDITION[i][1]];
      const c = gameBoard.boardState[WIN_CONDITION[i][2]];
      if (a !== "" && b !== "" && c !== "" && a === b && b === c) {
        winner = true;
        result = a;
      }
    }
    return winner;
  };

  const checkDraw = () => {
    return gameBoard.boardState.every((cell) => {
      return cell !== "";
    });
  };

  const isAiTurn = () => {
    if (xTurn || !playerTwo.ai) {
      return;
    }
    if (!xTurn && playerTwo.ai) {
      bestMove();
      endGame();
    }
  };
  // <-- AI plays RANDOM move -->
  // const botMove = () => {
  //   let available = [];
  //   for (let i = 0; i < 9; i++) {
  //     if (gameBoard.boardState[i] === "") {
  //       available.push(i);
  //     }
  //   }
  //   cellElements[available[randomNumber(available.length)]].classList.add("o");
  // };

  // const randomNumber = (number) => {
  //   return Math.floor(Math.random() * number);
  // };
  // <-- AI plays RANDOM move -->

  const endGame = () => {
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
      isAiTurn();
      hoverMark();
    }
  };

  function bestMove() {
    // find best Move for AI
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
      // Is the cell available?
      if (gameBoard.boardState[i] === "") {
        gameBoard.boardState[i] = "o";
        let score = minimax(gameBoard.boardState, 0, false);
        gameBoard.boardState[i] = "";
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    cellElements[move].classList.add("o");
    gameBoard.getBoard();
  }

  let scores = {
    x: -10,
    o: 10,
    tie: 0,
  };

  function minimax(board, depth, isMaximizing) {
    let win = checkWin();
    let draw = checkDraw();
    if (win) {
      return scores[result];
    }
    if (draw) {
      return scores["tie"];
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        // Is the cell available?
        if (board[i] === "") {
          board[i] = "o";
          let score = minimax(board, depth + 1, false);
          board[i] = "";
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        // Is the cell available?
        if (board[i] === "") {
          board[i] = "x";
          let score = minimax(board, depth + 1, true);
          board[i] = "";
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }

  return { startGame };
})();

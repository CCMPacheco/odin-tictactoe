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
  //updategameboard
  //start and restart game
  //display start screen and end screen
  //display player names
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

  const handleClick = (e) => {
    const cell = e.target;
    placeMark(cell, xTurn);
    gameBoard.getBoard();
    if (checkWin()) {
      if (xTurn) {
        console.log("X's WINS!");
      } else {
        console.log("O's WINS!");
      }
    } else if (checkDraw()) {
      console.log("GAME DRAW");
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
})();

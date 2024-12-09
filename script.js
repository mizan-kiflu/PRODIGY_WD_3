const cells = $("td");
for (let i = 0; i < cells.length; i++) {
  const cell = $(`#${cells[i].attributes.id.value}`);
  cell.click(() => {
    cellClick(cell);
  });
}

const winMoves = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let modeFriend = true;
let currentPlayerX = true;
let playerCharacter = "X";
let botCharachter = "O";
let gameFinished = false;
let moves = [];

$("#new-game").click(() => {
  newGame();
});

$("#change-mode").click(() => {
  modeFriend = !modeFriend;
  $("#mode").text(modeFriend ? "Friend" : "Bot");
});

const finishGame = (winner) => {
  gameFinished = true;
  $("#result").text("Player " + winner + " Won");
};

const checkGame = () => {
  for (let i = 0; i < winMoves.length; i++) {
    const [x, y, z] = winMoves[i];
    if (moves[x] && moves[x] == moves[y] && moves[x] == moves[z]) {
      return moves[x];
    }
  }
  return false;
};

const checkWin = () => {
  const win = checkGame();
  console.log(win);
  if (win) {
    finishGame(win);
  }
};

const cellClick = function (cell) {
  if (!cell.text() && !gameFinished) {
    if (modeFriend) {
      currentPlayerX ? (playerCharacter = "X") : (playerCharacter = "O");
      cell.text(playerCharacter);
      moves[parseInt(cell.attr("id"))] = playerCharacter;
      currentPlayerX = !currentPlayerX;
      checkWin();
    } else {
      cell.text(playerCharacter);
      moves[parseInt(cell.attr("id"))] = playerCharacter;
      checkWin();
      if (!gameFinished) {
        let nextMove = findNextMove();
        moves[nextMove] = botCharachter;
        $(`#${nextMove}`).text(botCharachter);
        checkWin();
      }
    }
  }
};

const newGame = () => {
  for (let i = 0; i < cells.length; i++) {
    $(`#${cells[i].attributes.id.value}`).text("");
  }
  currentPlayerX = true;
  gameFinished = false;
  moves = [];
  $("#result").text("");
};

const selectRandom = (arr) => {
  return arr[Math.floor(Math.random() * arr.length - 0)];
};

const findNextMove = () => {
  const possibleMoves = [];
  const fatalMoves = [];
  winMoves.forEach((winMove) => {
    winMove.forEach((item) => {
      if (moves[item]) {
        possibleMoves.push(
          winMove.filter(
            (element) =>
              element != item &&
              !moves[element] &&
              !possibleMoves.includes(element)
          )
        );
      }
    });
  });
  possibleMoves.forEach((pM) => {
    if (!fatalMoves.includes(...pM) && pM.length == 1) {
      fatalMoves.push(...pM);
    }
  });
  if (fatalMoves.length > 0) {
    console.log(fatalMoves);
    return selectRandom(fatalMoves);
  }
  return selectRandom(possibleMoves.flat());
};

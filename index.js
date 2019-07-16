$("document").ready(function() {
  var BaseGrid = {
    y1x1: {
      value: 2,
      occupied: false
    },
    y1x2: {
      value: 1,
      occupied: false
    },
    y1x3: {
      value: 2,
      occupied: false
    },
    y2x1: {
      value: 1,
      occupied: false
    },
    y2x2: {
      value: 2,
      occupied: false
    },
    y2x3: {
      value: 1,
      occupied: false
    },
    y3x1: {
      value: 2,
      occupied: false
    },
    y3x2: {
      value: 1,
      occupied: false
    },
    y3x3: {
      value: 2,
      occupied: false
    }
  };

  var state = {
    grid: $.extend(true, {}, BaseGrid),
    humanTurn: false,
    humanIcon: "X",
    aiIcon: "O",
    over: false,
    winArr: []
  };

  $(".choose").click(function() {
    $(this).css("color", "yellow");
    var humanIcon = $(this).attr("data");
    var aiIcon = $(this)
      .siblings(".choose")
      .attr("data");
    $(this)
      .siblings(".choose")
      .css("color", "red");
    state.humanIcon = humanIcon;
    state.aiIcon = aiIcon;
    setTimeout(function() {
      $("#message-area").html("");
      firstMove();
    }, 500);
  });

  $(".gridrow li").click(function() {
    if (state.humanTurn === true && state.over === false) {
      var square = this.id;
      var piece = state.humanIcon;
      if (!checkOccupied(square)) {
        placePiece(square, piece, "human");
        state.humanTurn = false;
        var talkOrNot = getRandom(1, 10);
        if (talkOrNot > 5) {
          getMessage("noBestMove");
        }
        computerTurn();
      }
    }
  });

  function placePiece(square, icon, player) {
    $("#" + square)
      .children(".square")
      .html('<p class="' + player + '">' + icon + "</p>");
    state.grid[square].occupied = player;
    if (checkWin(player, state.grid)) {
      getMessage(player + "Wins");
      changeRed(state.winArr);
      state.over = true;
      reset();
    }
    valueDiags();
  }

  function changeRed(arr) {
    arr.forEach(function(square) {
      $("#" + square)
        .children(".square")
        .addClass("win");
    });
  }

  function clearBoard() {
    var square;
    for (var key in state.grid) {
      square = key;
      $("#" + square)
        .children(".square")
        .html("");
    }
  }

  function reset() {
    setTimeout(function() {
      for (var key in state.grid) {
        $("#" + key)
          .children(".square")
          .removeClass("win");
      }
      state.grid = $.extend(true, {}, BaseGrid);
      state.humanTurn = false;
      state.over = false;
      state.winArr = [];
      clearBoard();
      firstMove();
    }, 3000);
  }

  function firstMove() {
    var num = getRandom(1, 2);
    if (num === 2) {
      getMessage("aiFirst");
      setTimeout(function() {
        computerTurn();
      }, 1000);
    } else {
      getMessage("humanFirst");
      state.humanTurn = true;
    }
  }

  function computerTurn() {
    if (state.over === true) {
      reset();
    }
    setTimeout(function() {
      var finished = false;
      var possMove = sortGrid(state.grid);
      if (possMove.length === 0) {
        getMessage("noBestMove");
        state.over = true;
        reset();
        return;
      }
      for (var i = 0; i < possMove.length; i++) {
        if (detectWinningMove(possMove[i][0], "ai")) {
          placePiece(possMove[i][0], state.aiIcon, "ai");
          finished = true;
          return;
        }
      }
      if (finished) {
        return;
      }
      for (var i = 0; i < possMove.length; i++) {
        if (detectWinningMove(possMove[i][0], "human")) {
          placePiece(possMove[i][0], state.aiIcon, "ai");
          finished = true;
          state.humanTurn = true;
          return;
        }
      }
      if (finished) {
        return;
      }

      var bestMoves = getBestMoves(possMove);
      var max = bestMoves.length;
      var num = getRandom(1, max) - 1;
      placePiece(bestMoves[num][0], state.aiIcon, "ai");
      possMove = sortGrid(state.grid);
      if (possMove.length === 0) {
        getMessage("noBestMove");
        state.over = true;
        reset();
        return;
      }
      state.humanTurn = true;
      return;
    }, 500);
  }

  function sortGrid(grid) {
    var sortable = [];
    for (var key in grid) {
      if (!grid[key].occupied) {
        sortable.push([key, grid[key].value]);
      }
    }
    sortable.sort(function(a, b) {
      return b[1] - a[1];
    });
    return sortable;
  }

  function valueDiags() {
    var occupiedDiags = 0;
    var square;
    var row;
    var col;
    for (var key in state.grid) {
      square = key;
      row = square[1];
      col = square[3];
      if (state.grid[key].occupied) {
        if ((row == 1 && col == 3) || (row == 3 && col == 1) || row == col) {
          occupiedDiags++;
        }
      }
    }
    if (occupiedDiags > 0 && checkOccupied("y2x2") === false) {
      state.grid.y2x2.value++;
    } else if (
      (occupiedDiags > 1 && checkOccupied("y2x2")) ||
      occupiedDiags > 3
    ) {
      state.grid.y1x1.value = 1;
      state.grid.y3x1.value = 1;
      state.grid.y1x3.value = 1;
      state.grid.y3x3.value = 1;
      state.grid.y2x2.value = 1;
    }
  }

  function checkOccupied(square) {
    if (state.grid[square].occupied !== false) {
      return true;
    } else {
      return false;
    }
  }

  function detectWinningMove(square, human) {
    var grid = $.extend(true, {}, state.grid);
    grid[square].occupied = human;
    if (checkWin(human, grid)) {
      return true;
    } else {
      return false;
    }
  }

  function getRandom(min, max) {
    return Math.floor(Math.random() * max) + min;
  }

  function getBestMoves(moves) {
    var result = [];
    var score = moves[0][1];
    moves.forEach(function(element) {
      if (element[1] === score) {
        result.push(element);
      }
    });
    return result;
  }

  function checkWin(human, grid) {
    if (
      grid.y1x1.occupied === human &&
      grid.y2x2.occupied === human &&
      grid.y3x3.occupied === human
    ) {
      state.winArr = ["y1x1", "y2x2", "y3x3"];
      return true;
    }
    if (
      grid.y1x3.occupied === human &&
      grid.y2x2.occupied === human &&
      grid.y3x1.occupied === human
    ) {
      state.winArr = ["y1x3", "y2x2", "y3x1"];
      return true;
    }
    if (
      grid.y1x1.occupied === human &&
      grid.y2x1.occupied === human &&
      grid.y3x1.occupied === human
    ) {
      state.winArr = ["y1x1", "y2x1", "y3x1"];
      return true;
    }
    if (
      grid.y1x2.occupied === human &&
      grid.y2x2.occupied === human &&
      grid.y3x2.occupied === human
    ) {
      state.winArr = ["y1x2", "y2x2", "y3x2"];
      return true;
    }
    if (
      grid.y1x3.occupied === human &&
      grid.y2x3.occupied === human &&
      grid.y3x3.occupied === human
    ) {
      state.winArr = ["y1x3", "y2x3", "y3x3"];
      return true;
    }
    if (
      grid.y1x1.occupied === human &&
      grid.y1x2.occupied === human &&
      grid.y1x3.occupied === human
    ) {
      state.winArr = ["y1x1", "y1x2", "y1x3"];
      return true;
    }
    if (
      grid.y2x1.occupied === human &&
      grid.y2x2.occupied === human &&
      grid.y2x3.occupied === human
    ) {
      state.winArr = ["y2x1", "y2x2", "y2x3"];
      return true;
    }
    if (
      grid.y3x1.occupied === human &&
      grid.y3x2.occupied === human &&
      grid.y3x3.occupied === human
    ) {
      state.winArr = ["y3x1", "y3x2", "y3x3"];
      return true;
    }
    return false;
  }

  function getMessage(condition) {
    var max = messages[condition].length;
    var num = getRandom(1, max) - 1;
    var msg = messages[condition][num];
    $("#message-area").html("<h2>" + msg + "</h2>");
  }

  var messages = {
    aiFirst: [
      "My turn, good luck!",
      "I'll go first mwahaha",
      "Watch this!"
    ],
    humanFirst: [
      "Fine, you can go first",
      "Make a move, I'm waiting...",
      "This is hard, you go this time",
      "Ugh, GOOOOO"
    ],
    noBestMove: [
      "Well well well",
      "Again you've resisted destiny",
      "Hmmm...",
      "Keep it up my friend!",
      "Alright, I see"
    ],
    humanWins: [
      "I don't believe it",
      "Who do you think you are?",
      "C'mon, let me redeem myself",
      "Seriously?",
      "Did you hack the source code buddy?"
    ],
    aiWins: [
      "I rule!!!!",
      "Awww, lets do it again",
      "So easy....",
      "Did you know I am smarter?",
      "SNORE!!!"
    ]
  };
});
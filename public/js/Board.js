
  //Board object - controls logistics of game
  var Board = {
    board: gameBoard,
    score: {
      player1: 0,
      player2: 0
    },
    playerTurn: player_turn,
    jumpexist: false,
    continuousjump: continiuousjump,
    tilesElement: $('div.tiles'),
    //dictionary to convert position in Board.board to the viewport units
    dictionary: ["0vmin", "10vmin", "20vmin", "30vmin", "40vmin", "50vmin", "60vmin", "70vmin", "80vmin", "90vmin"],
    //initialize the 8x8 board
    initalize: function () {
      var countPieces = 0;
      var countTiles = 0;
      for (let row in this.board) { //row is the index
        for (let column in this.board[row]) { //column is the index
          //whole set of if statements control where the tiles and pieces should be placed on the board
          if (row % 2 == 1) {
            if (column % 2 == 0) {
              countTiles = this.tileRender(row, column, countTiles)
            }
          } else {
            if (column % 2 == 1) {
              countTiles = this.tileRender(row, column, countTiles)
            }
          }
          if (this.board[row][column] == 1) {
            countPieces = this.playerPiecesRender(1, row, column, countPieces)
          } else if (this.board[row][column] == 2) {
            countPieces = this.playerPiecesRender(2, row, column, countPieces)
          }else if(this.board[row][column] == 3){
            countPieces = this.playerPiecesRender(1, row, column, countPieces, true)
          }else if(this.board[row][column] == 4){
            countPieces = this.playerPiecesRender(2, row, column, countPieces, true)
          }
        }
      }
      // Oxirgi yurishni ko'rsatish
      if(beforeMoves.length !== 0) {
        tiles.forEach(tile => {
          if(tile.position[0] == beforeMoves[0][0] && tile.position[1] == beforeMoves[0][1] || tile.position[0] == beforeMoves[1][0] && tile.position[1] == beforeMoves[1][1]){
            tile.element[0].classList.add('activeTile')
          }
        })
        pieces.forEach(piece => {          
          if(continiuousjump && beforeMoves[1][0] == piece.position[0] && beforeMoves[1][1] == piece.position[1]){
            if(!piece.element.className.includes("selected")){
              piece.element.classList.add("selected")
            }
          }
        })
      }
      
      Board.check_if_jump_exist()
    },
    tileRender: function (row, column, countTiles) {
      this.tilesElement.append("<div class='tile' id='tile" + countTiles + "' style='top:" + this.dictionary[row] + ";left:" + this.dictionary[column] + ";'></div>");
      tiles[countTiles] = new Tile($("#tile" + countTiles), [parseInt(row), parseInt(column)]);
      return countTiles + 1
    },

    playerPiecesRender: function (playerNumber, row, column, countPieces, isKing) {
      $(`.player${playerNumber}pieces`).append("<div class='piece' id='" + countPieces + "' style='top:" + this.dictionary[row] + ";left:" + this.dictionary[column] + ";'></div>");
      pieces[countPieces] = new Piece($("#" + countPieces), [parseInt(row), parseInt(column)]);
      pieces[countPieces].oldPlace = [parseInt(row), parseInt(column)]
      pieces[countPieces].player = playerNumber
      if(isKing) pieces[countPieces].makeKing();
      return countPieces + 1;
    },
    //check if the location has an object
    isValidPlacetoMove: function (row, column) {
      if (row < 0 || row > 7 || column < 0 || column > 7) return false;
      if (this.board[row][column] == 0) {
        return true;
      }
      return false;
    },
    //change the active player - also changes div.turn's CSS
    changePlayerTurn: function () {
      if (this.playerTurn == 1) {
        this.playerTurn = 2;
        $('.turn').css("background", "linear-gradient(to right, transparent 50%, #BEEE62 50%)");
      } else {
        this.playerTurn = 1;
        $('.turn').css("background", "linear-gradient(to right, #BEEE62 50%, transparent 50%)");
      }
      this.check_if_jump_exist()
      socket.emit('turn', {turn: this.playerTurn})
      return;
    },
    checkifAnybodyWon: function () {
      if (this.score.player1 == 12) {
        return 1;
      } else if (this.score.player2 == 12) {
        return 2;
      }
      return false;
    },
    //reset the game
    clear: function () {
      location.reload();
    },
    check_if_jump_exist: function () {
      this.jumpexist = false
      this.continuousjump = false;
      for (let k of pieces) {
        k.allowedtomove = false;
        if(k.canFlyAny()) k.canFlyAny();
        // if jump exist, only set those "jump" pieces "allowed to move"
        if (k.position.length != 0 && k.player == this.playerTurn && k.canJumpAny() && !k.king) {
          this.jumpexist = true
          k.allowedtomove = true;
        }
        if( k.player == this.playerTurn && k.canFlyAny(true) && k.king){
          k.flying = true
          this.jumpexist = true
          k.allowedtomove = true;
        }
      }
      // if jump doesn't exist, all pieces are allowed to move
      if (!this.jumpexist) {
        for (let k of pieces) k.allowedtomove = true;
      }
    },
    // Possibly helpful for communication with back-end.
    str_board: function () {
      ret = ""
      for (let i in this.board) {
        for (let j in this.board[i]) {
          var found = false
          for (let k of pieces) {
            if (k.position[0] == i && k.position[1] == j) {
              if (k.king) ret += (this.board[i][j] + 2)
              else ret += this.board[i][j]
              found = true
              break
            }
          }
          if (!found) ret += '0'
        }
      }
      return ret
    }
  }

  
  //initialize the board
  Board.initalize()

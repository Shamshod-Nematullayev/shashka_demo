
  //The initial setup
  

  var gameBoard = baqay; 
  // console.log(gameBoard);
 
  // var gameBoard = [
  //   [0, 1, 0, 1, 0, 0, 0, 0],
  //   [1, 0, 1, 0, 1, 0, 2, 0],
  //   [0, 1, 0, 1, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0],
  //   [0, 0, 0, 0, 0, 0, 0, 0],
  //   [2, 0, 2, 0, 2, 0, 0, 0],
  //   [0, 2, 0, 2, 0, 2, 0, 2],
  //   [2, 0, 2, 0, 2, 0, 2, 0]
  // ];
  //arrays to store the instances
  var pieces = [];
  var tiles = [];
  // sounds

  //distance formula
  var dist = function (x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
  }
  //Piece object - there are 24 instances of them in a checkers game
  function Piece(element, position) {
    // when jump exist, regular move is not allowed
    // since there is no jump at round 1, all pieces are allowed to move initially
    this.allowedtomove = true;
    //linked DOM element
    this.element = element;
    //positions on gameBoard array in format row, column
    this.position = position;
    //which player's piece i it
    this.player = '';
    this.oldPlace = []
    //figure out player by piece id
    if (this.element.attr("id") < 12)
      this.player = 1;
    else
      this.player = 2;
    //makes object a king
    this.king = false;
    this.makeKing = function () {
      this.element.css("backgroundImage", "url('/img/king" + this.player + ".png')");
      this.king = true;
      // this.flying = false
    }
    //moves the piece
    this.move = function (tile, range = "") {
      this.element.removeClass('selected');
      if (!Board.isValidPlacetoMove(tile.position[0], tile.position[1])) return false;
      //make sure piece doesn't go backwards if it's not a king
      if (this.player == 1 && range != "jump") {
        if (tile.position[0] < this.position[0] && !this.king) return false;
      } else if (this.player == 2 && range != "jump") {
        if (tile.position[0] > this.position[0] && !this.king) return false;
      }
      //remove the mark from Board.board and put it in the new spot
      Board.board[this.position[0]][this.position[1]] = 0;
      if(!this.king){ Board.board[tile.position[0]][tile.position[1]] = this.player;}
      else {Board.board[tile.position[0]][tile.position[1]] = this.player + 2 } // Agar damka bo'lsa 2 qo'shib saqlaydi
      
      // Bundan oldingi yurishni ko'rsatish 
      this.oldPlace = this.position 
      tiles.forEach(e => {
        if(e.position[0] == this.oldPlace[0] && e.position[1] == this.position[1]){
          e.element[0].classList.add('activeTile')
        }else{
          e.element[0].classList.remove('activeTile')
        }
      })
      tile.element[0].classList.add('activeTile')
      this.position = [tile.position[0], tile.position[1]];
      //change the css using board's dictionary
      this.element.css('top', Board.dictionary[this.position[0]]);
      this.element.css('left', Board.dictionary[this.position[1]]);
      //if piece reaches the end of the row on opposite side crown it a king (can move all directions)
      if (!this.king && (this.position[0] == 0 && this.player == 2)){
        Board.board[tile.position[0]][tile.position[1]] = 4
        this.makeKing();
      }else if(!this.king && (this.position[0] == 7 && this.player == 1)){
        Board.board[tile.position[0]][tile.position[1]] = 3
        this.makeKing();
      }
        Board.changePlayerTurn()
        socket.emit('board', {board: Board.board, beforeMove: [this.oldPlace, this.position] })

        return true;
    };

    //tests if piece can jump anywhere
    this.canJumpAny = function () {
      return (
        this.canOpponentJump([this.position[0] + 2, this.position[1] + 2]) ||
        this.canOpponentJump([this.position[0] + 2, this.position[1] - 2]) ||
        this.canOpponentJump([this.position[0] - 2, this.position[1] + 2]) ||
        this.canOpponentJump([this.position[0] - 2, this.position[1] - 2]))
      
    };

    //tests if an opponent jump can be made to a specific place
    this.canOpponentJump = function (newPosition) {
      //find what the displacement is
      var dx = newPosition[1] - this.position[1];
      var dy = newPosition[0] - this.position[0];
      //must be in bounds // Oxirgi qator emasmi buni aniqlash
      if (newPosition[0] > 7 || newPosition[1] > 7 || newPosition[0] < 0 || newPosition[1] < 0) return false;
      //middle tile where the piece to be conquered sits
      var tileToCheckx = this.position[1] + dx / 2;
      var tileToChecky = this.position[0] + dy / 2;
      if (tileToCheckx > 7 || tileToChecky > 7 || tileToCheckx < 0 || tileToChecky < 0) return false;
      //if there is a piece there and there is no piece in the space after that
      if (!Board.isValidPlacetoMove(tileToChecky, tileToCheckx) && Board.isValidPlacetoMove(newPosition[0], newPosition[1])) {
        //find which object instance is sitting there
        for (let pieceIndex in pieces) {  
          if (pieces[pieceIndex].position[0] == tileToChecky && pieces[pieceIndex].position[1] == tileToCheckx) {
            if (this.player != pieces[pieceIndex].player) {
              //return the piece sitting there
              return pieces[pieceIndex];
            }
          }
        }
        
      }
      return false;
    };

    this.canFlyOpponent = function (newPosition){
      // let dx = newPosition[1] - this.position[1];
      // let dy = newPosition[0] - this.position[0];
      let y, x
      //must be in bounds // Oxirgi qator emasmi buni aniqlash
      if (newPosition[0] > 7 || newPosition[1] > 7 || newPosition[0] < 0 || newPosition[1] < 0) return false;
      var tileToCheckx;
      var tileToChecky;
      if(newPosition[0] > this.position[0] && newPosition[1] > this.position[1]){
        tileToChecky = this.position[0] + 1;
        tileToCheckx = this.position[1] + 1;
        y=1;
        x=1;
      }else if(newPosition[0] > this.position[0] && newPosition[1] < this.position[1]){
        tileToChecky = this.position[0] + 1;
        tileToCheckx = this.position[1] - 1;
        y=1;
        x=-1;
      }else if(newPosition[0] < this.position[0] && newPosition[1] > this.position[1]){
        tileToChecky = this.position[0] - 1;
        tileToCheckx = this.position[1] + 1;
        y=-1;
        x=1;
      }else if(newPosition[0] < this.position[0] && newPosition[1] < this.position[1]){
        tileToChecky = this.position[0] - 1;
        tileToCheckx = this.position[1] - 1;
        y=-1;
        x=-1;
      }
      if (tileToCheckx > 7 || tileToChecky > 7 || tileToCheckx < 0 || tileToChecky < 0) return false;

      let oraliqMasofa = Math.abs(newPosition[0] - this.position[0])
      let o = 0;
      let nishon = [];
      for(let i = 0; i< oraliqMasofa; i++){
        if (!Board.isValidPlacetoMove(tileToChecky+i*y, tileToCheckx+i*x) && Board.isValidPlacetoMove(newPosition[0], newPosition[1])){
          o++
          nishon= [tileToChecky+i*y, tileToCheckx+i*x]
        }
      }
        if(o==1){
          for (let pieceIndex in pieces) {
            // ;console.log(pieces[pieceIndex]);
            if (pieces[pieceIndex].position[0] == nishon[0] && pieces[pieceIndex].position[1] == nishon[1]) {
              if (this.player != pieces[pieceIndex].player && this.king) {
                //return the piece sitting there
                return pieces[pieceIndex];
              }
            }
          }
        }else if(o == 0){
          return true
        }
        return false;
      
    }
   
    this.opponentJump = function (tile) {
      var pieceToRemove = this.canOpponentJump(tile.position);
      //if there is a piece to be removed, remove it
      console.log(pieceToRemove);
      // console.log(tile.position);
      if (pieceToRemove) {
        pieceToRemove.remove();
        return true;
      }
    };
    this.canFly = function(tile){
      var pieceToRemove = this.canFlyOpponent(tile.position);
      if (pieceToRemove === true && !this.flying) {
        return 'regular';
      }else if(typeof pieceToRemove != 'boolean'){
        pieceToRemove.remove();
        this.flying = false
        return true
      }
      return false
    }
// YO'LBARSCHA OLISH QISMI ISHLAYAPTI FAQAT ENDI UNI MAJBURIY HOLATLARDA TEKSHIRADIGAN QILISH KERAK VA URISHGA MAJBURLASH KERAK
    this.canFlyAny = (mmm)=>{
      let y=0;
      let x=0;
      if(!mmm)  if(this.position[0] > this.oldPlace[0] && this.position[1] > this.oldPlace[1]){
        y=1;
        x=1;
      }else if(this.position[0] > this.oldPlace[0] && this.position[1] < this.oldPlace[1]){
        y=1;
        x=-1;
      }else if(this.position[0] < this.oldPlace[0] && this.position[1] > this.oldPlace[1]){
        y=-1;
        x=1;
      }else if(this.position[0] < this.oldPlace[0] && this.position[1] < this.oldPlace[1]){
        y=-1;
        x=-1;
      }

      let a, b, c, d
      if (this.king)  {console.log(x ,y); console.log(this.oldPlace);}
      if(x != -1 || y != -1) ////Yurish tepa chapga
        {for(let i = 0; i < 8 - this.position[0] -2; i++){
          if(this.king){console.log(i);
          console.log((this.position[0] + 2 + i) , (this.position[1] + 2 + i));}
          if(typeof this.canFlyOpponent([(this.position[0] + 2 + i), (this.position[1] + 2 + i)]) !== 'boolean' ){
            a = true
          }
          if(this.position[1] +2+ i == 7 || this.position[0]+2+i ==7){
            break;
          }
        }}
      
      if(x != 1 || y != -1) //tepaga o'ngga
        {for(let i = 0; i < 8 - this.position[0] -2; i++){
          if(typeof this.canFlyOpponent([this.position[0] + 2 + i, this.position[1] - 2 - i]) !== 'boolean'){
            b = true
          }
          if(this.position[1] -2- i == 0 || this.position[0] + 2 +i == 7){
            break;
          }
        }}

      if(x != 1 || y != 1){ //Yurish past o'ngga
        for(let i = 0; i <  this.position[0] +2; i++){
         if(typeof this.canFlyOpponent([(this.position[0] - 2 - i), (this.position[1] - 2 - i)]) !== 'boolean'){
            c =true
          }
          if(this.position[1] -2 - i == 0 || this.position[0]-2-i ==0){
            break;
          }
        }}

        if(x != -1 || y != 1) // pastga chapga
        {
          for(let i = 0; i <=  this.position[0] -2; i++){
          // console.log(this.canFlyOpponent((this.position[0] - 2 - i) * -1, (this.position[1] + 2 + i)));
          if(this.position[1] + i > 7 || this.position[1] > 5 || this.position[0] > 5){
            break;
          }
          if(typeof this.canFlyOpponent([(this.position[0] - 2 - i), (this.position[1] + 2 + i)]) !== 'boolean'){
            d =true
          }
        }}

        // console.log(a, b, c, d);
        if(a || b || c || d){
          return true
        }
        return false
    }

    this.remove = function () {
      //remove it and delete it from the gameboard
      this.element.css("display", "none");
      if (this.player == 1) {
        $('#player2').append("<div class='capturedPiece'></div>");
        Board.score.player2 += 1;
      }
      if (this.player == 2) {
        $('#player1').append("<div class='capturedPiece'></div>");
        Board.score.player1 += 1;
      }
      Board.board[this.position[0]][this.position[1]] = 0;
      //reset position so it doesn't get picked up by the for loop in the canOpponentJump method
      this.position = [];
      var playerWon = Board.checkifAnybodyWon();
      if (playerWon) {
        $('#winner').html("Player " + playerWon + " has won!");
      }
    }
  }
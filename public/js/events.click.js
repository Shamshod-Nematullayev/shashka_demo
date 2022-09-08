  /***
  Events
  ***/
  //select the piece on click if it is the player's turn
  
  $('.piece').on("click", function () {
    var selected;
    var isPlayersTurn = ($(this).parent().attr("class").split(' ')[0] == "player" + Board.playerTurn + "pieces");
    if (isPlayersTurn && Board.playerTurn == currentPlayer) {
      if (!Board.continuousjump && pieces[$(this).attr("id")].allowedtomove) {
        if ($(this).hasClass('selected')) selected = true;
        $('.piece').each(function (index) {
          $('.piece').eq(index).removeClass('selected')
        });
        if (!selected) {
          $(this).addClass('selected');
        }
      } else {
        let exist = "jump exist for other pieces, that piece is not allowed to move"
        let continuous = "continuous jump exist, you have to jump the same piece"
        let message = !Board.continuousjump ? exist : continuous
        console.log(message)
      }
    }
  });

  //reset game when clear button is pressed
  $('#cleargame').on("click", function () {
    Board.clear()
  });

  //move piece when tile is clicked
  $('.tile').on("click", function () {
    //make sure a piece is selected
    if ($('.selected').length != 0) {
      //find the tile object being clicked
      var tileID = $(this).attr("id").replace(/tile/, '');
      var tile = tiles[tileID];
      //find the piece being selected
      var piece;
      pieces.forEach(elem => {
        if(elem.element[0].className.includes('selected')) piece = elem 
      })
      //check if the tile is in range from the object
      var inRange = tile.inRange(piece);
      if (inRange != 'wrong') {
            socket.emit('move', {tile, piece, board: Board.board, turn: Board.playerTurn })
          }
    }
  });
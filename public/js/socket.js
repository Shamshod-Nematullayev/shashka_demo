
let user_team
let socket = io()
socket.emit('joinRoom', game_id)
let player;
let playerTeam

// sounds
let moveSound = new Audio("/sounds/move.ogg")
let captureSound = new Audio("/sounds/capture.ogg")
socket.on('joinedGame', data => {
  user_team = data.color
  player = data.user_id
  if(data.user_id == sessionID){
    switch (data.color) {
      case "red":
        playerTeam = 1
        break
      case "white":
        playerTeam = 2
        break 
  
    }
    document.querySelector('.modal-choose').style.display = 'none'
    if(data.color == 'red'){
      currentPlayer = 1;
      document.querySelector(".column").classList.add('red_team')
      document.querySelectorAll(".piece").forEach(element => element.classList.add("red_team"))
    }else{
      currentPlayer = 2
    }
  }else{
    try {
      if(data.color == 'red'){
        document.querySelector('.modal-choose').querySelector('#r').remove()
      }else{
        document.querySelector('.modal-choose').querySelector('#w').remove()
      }
    } catch (error) {
      console.log(error)
    }
  }
})

socket.on('timeout', txt => {
  alert(txt)
})

socket.on('movePiece', (data) => {
  let katak;
  tiles.forEach(tile => {
    if(tile.position[0] == data.tile.position[0] && tile.position[1] == data.tile.position[1]){
      katak = tile
    }
  })
  pieces.forEach(piece => {
    if(piece.position[0] == data.piece.position[0] && piece.position[1] == data.piece.position[1]){
      // if(katak) piece.move(katak)
      var inRange = katak.inRange(piece);
      if (inRange != 'wrong') {
        //if the move needed is jump, then move it but also check if another move can be made (double and triple jumps)
        if (inRange == 'jump') {
          if (piece.opponentJump(katak)) {
            piece.move(katak, inRange) ;
            captureSound.play()
            if (piece.canJumpAny()) {
              Board.changePlayerTurn(); //change back to original since another turn can be made
              if(playerTeam == Board.playerTurn) piece.element.addClass('selected');
              // exist continuous jump, you are not allowed to de-select this piece or select other pieces
              Board.continuousjump = true;
              socket.emit('continuousjump', true)
            } 
            
          }
          //if it's regular then move it if no jumping is available
        } else if (inRange == 'regular' && !Board.jumpexist) {
          if (!piece.canJumpAny()) {
            piece.move(katak);
            
            // sound effects
            moveSound.play()
          } else {
            alert("You must jump when possible!");
          }
        }else if(inRange == "fly"){
          
          if (piece.canFly(katak) === true) {
            
            piece.move(katak);
            captureSound.play()
             if(piece.canFlyAny()){
               Board.changePlayerTurn()
               if(playerTeam == Board.playerTurn) piece.element.addClass('selected')
               piece.flying =true
               Board.continuousjump = true;
               socket.emit('continuousjump', true)
              }
            }else if(piece.canFly(katak) === 'regular'){
              piece.move(katak)
              moveSound.play()
            }
          }
        }
      }
    })
    // G'alabani tekshirish
    let str_board = Board.str_board()
    let whites;
    let reds;
    if(str_board.includes(1) || str_board.includes(3)) reds = true
    if(str_board.includes(2) || str_board.includes(4)) whites = true
  
    if(!whites) alert("Red won")
    if(!reds) alert("White won")
  })
  
  
  function chosed(rang){
  socket.emit('joinGame', {user_id:sessionID, color:rang})
}
if(currentPlayer == 1){
  socket.emit('joinGame', {user_id:sessionID, color:'red'})
}else if(currentPlayer == 2){
  socket.emit('joinGame', {user_id:sessionID, color:'white' })
}
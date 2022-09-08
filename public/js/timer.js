socket.on('timeLeft', timeLeft => {
    document.querySelector(`#player_${Board.playerTurn}_time`).textContent = timeLeft
})
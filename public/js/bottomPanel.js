let resignBtn = document.getElementById("resignBtn"),
    drawBtn = document.getElementById('drawBtn'),
    cancelBtn = document.getElementById('cancelBtn')

resignBtn.onclick = () => {
    if(confirm("Taslim bo'lishni hohlaysizmi?")){
        socket.emit("message", {from: sessionID, text: "taslim bo'ldim"})
        socket.emit("resign", {from: sessionID, playerTeam})
    }    
}
drawBtn.onclick = () => {
    drawBtn.disabled = true
    socket.emit("message", {from: sessionID, text: "Durangni taklif qilaman"})
    socket.emit("offerDraw", {from: sessionID})
}

cancelBtn.onclick = () => {
    if(confirm("O'yinni bekor qilmoqchimisiz?")){
        socket.emit("cancelGame")
        cancelBtn.disabled = true
    }
}
socket.on("gameResult", result => {
    if(result !== 'draw'){
        if(result.playerTeam === 1){
            alert('White team win')
        }else if(result.playerTeam === 2){
            alert("Red team win")
        }
    }else{
        alert("Game Over. It's draw")
    }
})

socket.on("offerDraw", drawer => {
    if(drawer.from !== sessionID){
        if(confirm('Durrangga rozimisiz?')){
            socket.emit("draw", {from: sessionID, draw: true})
        }else{
            socket.emit("draw", {from: sessionID, draw: false})
        }
    }
})

socket.on("cancelGame", () => {
    alert("Game canceled")
    resignBtn.disabled = true
    drawBtn.disabled = true
    cancelBtn.disabled = true
})
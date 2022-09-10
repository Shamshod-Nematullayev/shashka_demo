socket.on("joinedGame", ({user_id, color, username, refresh}) => {
    console.log("kell");
   try {
     if(!refresh) if(user_id === sessionID){
        for(let i= document.querySelectorAll(".player2_photo").length; i>0; i--){
            const img = document.querySelectorAll(".player2_photo")[i-1]
            // document.querySelectorAll(".player2_photo").forEach(img => {
                img.src = "/image/"+ user_id + ".jpg"
                
            // })
        }
        let images = document.querySelectorAll(".profile_image")
        images.forEach(img => {
          img.addEventListener('error', function handleError(err) {
          img.src = "/image/unknown.png"
          console.log(err);
        })
    });
        document.querySelectorAll('.player2_name').forEach(div => {
            function format(text){
                text = text.split("")
                let newText = ''
                text.forEach((s, i) => {
                 s === "-" ? newText += " " : newText += s
     
                })
                return newText
               }
            div.textContent = format(username)
        })
    }else{
        document.querySelectorAll(".player1_photo").forEach(img => {
            img.src = "/image/"+ user_id + ".jpg"
            console.log({img})
        })
        document.querySelectorAll('.player1_name').forEach(div => {
            function format(text){
                text = text.split("")
                let newText = ''
                text.forEach((s, i) => {
                 s === "-" ? newText += " " : newText += s
     
                })
                return newText
               }
            div.textContent = format(username)
        })
    }   
   } catch (error) {
        console.log(error)
   }
})
socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

  function retry(){
    socket.emit('joinGame', {user_id:sessionID, color:'red'})
    let color1
    socket.on('joinedGame', ({color}) => {
        color1 = color
    })
    if(color1 == "red" || color1 == "white"){
         console.log({color1});
    }else{
        console.log(color1);
        // retry()
    }
  }

function renderPlayer(user, div_num){
    document.querySelectorAll(`.player${div_num}_photo`).forEach(img => {
        img.src = "/image/"+ user.user_id + ".jpg"
    })
    document.querySelectorAll(`.player${div_num}_name`).forEach(div => {
        function format(text){
            if(text){
                text = text.split("")
            let newText = ''
            text.forEach((s, i) => {
             s === "-" ? newText += " " : newText += s
 
            })
            return newText
            }
           }
        div.textContent = format(user.username)
    })
}
socket.on("loadGameData", game => {
    if(game.player_1 && sessionID ==game.player_1.user_id){
        renderPlayer(game.player_1, '2')
        renderPlayer(game.player_2, '1')
    }
    else 
    if(game.player_2 && sessionID ==game.player_2.user_id){
        renderPlayer(game.player_2, '2')
        renderPlayer(game.player_1, '1')
    }
    else{
         renderPlayer(game.player_2, '2')
         renderPlayer(game.player_1, '1')
    }

    
    addEventListener("DOMContentLoaded", ()=> {
        setTimeout(()=> {
        if(game.player_1 == sessionID){

            socket.emit('joinGame', {user_id:sessionID, color:'red', username: currentUsername, refresh:true })
        }else if(game.player_2 == sessionID){
            socket.emit('joinGame', {user_id:sessionID, color:'white', username: currentUsername, refresh:true })
        }
        }, 1000)
    })
})
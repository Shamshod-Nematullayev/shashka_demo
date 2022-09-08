socket.on("joinedGame", ({user_id, color}) => {
    if(user_id === sessionID){
        document.querySelectorAll(".player2_photo").forEach(img => {
            img.src = "/image/"+ user_id + ".jpg"
        })
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
            div.textContent = format(currentUsername)
        })
    }else{
        
    }
})
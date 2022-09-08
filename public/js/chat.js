socket.on("message", ctx => {
    console.log(ctx);
    drawMessage(ctx)
})


const chat_input = document.querySelector(".chat-input input")
const form = document.querySelector("form")
form.addEventListener("submit", e => {
    e.preventDefault()
    sendMessage()
})
function sendMessage(){

    socket.emit("message", {text: chat_input.value, from: sessionID})
    chat_input.value = ""
}
let chatMessageIndex
function drawMessage(ctx){
    let div = document.createElement("div")
    div.classList.add("chat-message")
    // div.setAttribute("data-index", String(chatMessageIndex))
    if(ctx.from == sessionID){
        div.classList.add('me')
    }
    div.innerHTML = `
    <div class="chat-photo" style="background-image: url('/img/profile-pic-300px.jpg');"></div>
    <div class="chat-text" id="text${chatMessageIndex}">
    <div class="username">${ctx.from}</div></div>`
    document.querySelector(".chat-messages").appendChild(div)
    document.querySelector(".chat-messages").scrollTop = document.querySelector(".chat-messages").scrollHeight
    document.querySelector('#text'+chatMessageIndex).append(ctx.text)
    chatMessageIndex++

}
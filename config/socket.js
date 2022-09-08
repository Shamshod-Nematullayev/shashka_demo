// let timerId,
//     timeLeftInterval,
//     timeLeft = 60
let timers = {}
const { io } = require("..");
const Game = require("../models/Game");
roomNumber = 1
io.on('connection', socket => {
    socket.on('joinRoom',async game_id => {
        await Game.findById(game_id)
        .then(game => {
            socket.emit("loadGameData", game)
        })
        socket.join('room'+game_id)
        socket.on('joinGame',async ({user_id, color})=>{
            if(color === 'red') await Game.findOneAndUpdate({_id: game_id}, {$set: {player_1: {user_id}}});
            if(color ==='white') await Game.findOneAndUpdate({_id: game_id}, {$set: {player_2: {user_id}}})

            io.sockets.in('room' + game_id).emit('joinedGame', {user_id, color})

            await Game.findById(game_id).then(game => {
                socket.on('move',async data => {
                    io.sockets.in('room' + game_id).emit('movePiece', data)
                    clearInterval(timers["timeLeftInterval" + game_id])
                    timers["timeLeft" + game_id]  = 59
                    timers["timeLeftInterval" + game_id] = setInterval(() => {
                        timers["timeLeft" + game_id]--
                        io.sockets.in('room' + game_id).emit('timeLeft', timers["timeLeft" + game_id])
                        if(timers["timeLeft" + game_id] === 0){
                            io.sockets.in('room' + game_id).emit('timeout', "Time Out")
                            clearInterval(timers["timeLeftInterval" + game_id])
                        }
                    }, 1000)
                })
                if(game.player_1 && game.player_2 && !game.beforeMove.length){
                   timers["timeLeftInterval" + game_id] = setInterval(() => {
                       timers["timeLeft" + game_id]--
                       io.sockets.in('room' + game_id).emit('timeLeft', timers["timeLeft" + game_id])
                       if(timers["timeLeft" + game_id] === 0){
                           io.sockets.in('room' + game_id).emit('timeout', "Time Out")
                           clearInterval(timers["timeLeftInterval" + game_id])
                       }
                   }, 1000)
               }
            //    bottom panel actions START
               socket.on("resign",async (loser) => {
                    await Game.findByIdAndUpdate(game_id, {$set: {lose: loser.from}})
                    io.sockets.in('room' + game_id).emit('gameResult', loser)
               })
               socket.on('offerDraw', drawer => {
                io.sockets.in('room' + game_id).emit('offerDraw', drawer)
               })
               socket.on("draw",async res => {
                await Game.findByIdAndUpdate(game_id, {$set: {lose: "draw"}})
                io.sockets.in('room' + game_id).emit('gameResult', "draw")
               })

               socket.on("cancelGame", () => {
                io.sockets.in('room' + game_id).emit('cancelGame')
               })
            //   bottom panel actions END

                socket.on("turn", async ({turn}) => {
                    await Game.findByIdAndUpdate(game_id, {$set: {player_turn: turn}})
                })
                socket.on("continuousjump",async t => {
                    await Game.findByIdAndUpdate(game_id, {$set: {continuousjump: t}})
                })
                
            })
            
            socket.on("board",async (data) => {            
                await Game.findByIdAndUpdate(game_id, {$set: {board: data.board, beforeMove: data.beforeMove, continuousjump: false}})
            })

            socket.on("message",async ctx => {
                ctx
                await Game.findByIdAndUpdate(game_id, {$push: {messages: ctx}})
                io.sockets.in('room' + game_id).emit('message', ctx)
                console.log(ctx);
            })
        })
    })
})
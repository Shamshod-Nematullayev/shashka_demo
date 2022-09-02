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
        // socket.join('room-'+roomNumber)
        // io.sockets.in('room-'+roomNumber).emit('connectToRoom', 'You are in room ' + roomNumber)
        socket.on('joinGame',async ({user_id, color})=>{
            if(color === 'red') await Game.findOneAndUpdate({_id: game_id}, {$set: {player_1: {user_id}}});
            if(color ==='white') await Game.findOneAndUpdate({_id: game_id}, {$set: {player_2: {user_id}}})
            
            io.sockets.in('room' + game_id).emit('joinedGame', {user_id, color})
            socket.on('move',data => {
                io.sockets.in('room' + game_id).emit('movePiece', data)
            })
            socket.on("board",async (data) => {            
                await Game.findByIdAndUpdate(game_id, {$set: {board: data.board, beforeMove: data.beforeMove, continuousjump: false}})
            })
            socket.on("turn",async ({turn}) => {    
                await Game.findByIdAndUpdate(game_id, {$set: {player_turn: turn}})
            })
            socket.on("continuousjump",async t => {
                await Game.findByIdAndUpdate(game_id, {$set: {continuousjump: t}})
            })

            socket.on("message",async ctx => {
                ctx
                await Game.findByIdAndUpdate(game_id, {$push: {messages: ctx}})
                io.sockets.in('room' + game_id).emit('message', ctx)
            })
        })
    })
})
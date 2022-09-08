const Game = require("../models/Game")

const router = require("express").Router()
router.get('/:id/user/:user_id/username/:username',async (req, res) => {
    
    await Game.findById(req.params.id)
        .then(game =>{
            res.render('index.ejs', {board: game.board, player_turn: game.player_turn, player_1: game.player_1,player_2: game.player_2, game_id: game._id, user_id: req.params.user_id, beforeMove: game.beforeMove, continiuousjump: game.continuousjump, messages: game.messages, username: req.params.username})
        })
        .catch(err => {
            res.send("Bu link eskirgan yoki mavjud emas. Yangitdan o'yin yarating")
        })
})

// res.render('index.ejs')
module.exports = router
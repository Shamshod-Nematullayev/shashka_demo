const Game = require("../models/Game")

const router = require("express").Router()
router.get('/',async (req, res) => {
    const newGame = new Game()
    await newGame.save()
    res.send(`<a href="/game/${newGame._id}">Yangi o'yin</a>`)
})

// res.render('index.ejs')
module.exports = router
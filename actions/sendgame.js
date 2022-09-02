const {Composer} = require('telegraf');
const { bot } = require('../core/bot');
const Game = require('../models/Game');

const composer = new Composer

const gameName = "rus";
composer.hears(/start|game/, ctx => bot.gameQuery(ctx.from.id, gameName))
composer.on("inline_query",async (iq) => {
   
    iq.answerInlineQuery([{
        type: "game",
        id: "0",
        game_short_name: gameName
    }])
    
})
composer.on('chosen_inline_result', async ctx => {    
    
    const newGame = new Game({
        inline_message_id: ctx.update.chosen_inline_result.inline_message_id
    })
    await newGame.save()
})

composer.on('callback_query',async query => {
    if (query.update.callback_query.game_short_name !== gameName) {
        query.answerCbQuery( "Sorry, '" + query.update.callback_query.game_short_name + "' is not available.");
        
    } else {
        await Game.findOne({inline_message_id: query.update.callback_query.inline_message_id })
            .then(game => {
                let gameurl = process.env.DOMEN + "/game/" + game._id + "/user/" + query.from.id;
                query.answerGameQuery(gameurl)
            })
    }
})

bot.use(composer.middleware())
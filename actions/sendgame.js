const {Composer} = require('telegraf');
const { bot } = require('../core/bot');
const Game = require('../models/Game');

// file saqlash uchun ishlatilgan modules
const fs = require('fs');
const path = require('path');
const fetch = require("node-fetch")
const request = require("request");
const { default: slugify } = require('slugify');

const composer = new Composer

const download = (url, path, callback) => {
    request.head(url, (err, res, body) => {
    request(url).pipe(fs.createWriteStream(path)).on('close', callback);
  });
};
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

composer.on('callback_query',async ctx => {
    if (ctx.update.callback_query.game_short_name !== gameName) {
        ctx.answerCbQuery( "Sorry, '" + ctx.update.callback_query.game_short_name + "' is not available.");
        
    } else {
        await Game.findOne({inline_message_id: ctx.update.callback_query.inline_message_id })
            .then(game => {
                let id = ctx.from.id
                let slugifedUsername = slugify(`${ctx.from.first_name} ${ctx.from.last_name ? ctx.from.last_name: "-"}`)
                let gameurl = process.env.DOMEN + "/game/" + game._id + "/user/" + id + "/username/" + slugifedUsername;
                ctx.answerGameQuery(gameurl)
                // getProfil photo
                ctx.telegram.getUserProfilePhotos(ctx.from.id).then(async user => {
                    await ctx.telegram.getFileLink(user.photos[0][0].file_id).then(async file => {
                        download(file.href, path.join(__dirname, `../public/image/${id}.jpg`), () =>
                        console.log('Done!')
                        );  
                    })
                })
            })
    }
})

bot.use(composer.middleware())
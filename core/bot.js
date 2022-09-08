const {Telegraf} = require('telegraf');

const bot = new Telegraf(process.env.TOKEN)

bot.launch()
    .then(() => {
        console.log("Telegram Connected")
    })
    .catch(err => {
        console.log(`an error occured connect to Telegram`)
    })

module.exports = {bot}
const mongoose = require('mongoose');

const schema = mongoose.Schema({
    player_1: Object,
    player_2: Object,
    board: {
        type: Array,
        default:  [
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [2, 0, 2, 0, 2, 0, 2, 0],
            [0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0]
          ],
    },
    player_turn: {type:Number, default: 1},
    messages: {
        type: Array(Object),
        default: []
    },
    beforeMove: Array,
    continuousjump: {
        type: Boolean,
        default: false
    },
    inline_message_id: String,
    lose: Object
})

const Game = mongoose.model("game", schema);

module.exports = Game
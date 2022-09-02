const express = require("express");
const app = express()

// socket io config
const http = require("http").Server(app)
const io = require("socket.io")(http)
module.exports = {io}

const ejs = require("ejs")
// dotenv config
require("dotenv").config()
require("./config")

// sesion config 
const store = require("./config/session")
app.use(require('express-session')({
    secret: 'This is a secret',
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    },
    store: store,
    resave: true,
    saveUninitialized: true
  }));

// html
app.use(express.static("public"))
app.set('view engine', ejs)

// use routers
const newGameRouter = require("./routers/newGame")
app.use('/new-game', newGameRouter)

const gameRoomRouter = require('./routers/gameRouter');
app.use('/game', gameRoomRouter)

const ip = require('ip')
const PORT = process.env.PORT || 3000
http.listen(PORT, () => { 
    console.log('listening on *:' + PORT);
    console.log('on network ' + ip.address() + ":" + PORT);
 });

 require("./core")
 require('./actions')
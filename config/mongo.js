const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO)
    .then(()=> console.log('Mongodbga ulandi'))
    .catch(err => console.log(err))
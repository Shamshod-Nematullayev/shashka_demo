const session = require('express-session');
const MongoDBStore = require('express-mongodb-session')(session);

const store = new MongoDBStore({
    uri: process.env.MONGO,
    collection: 'mySessions'
  });

store.on('error', function(error) {
console.log(error);
});

module.exports = store
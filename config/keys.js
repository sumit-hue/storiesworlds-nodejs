const username = require('./appConfig').username;
const password = require('./appConfig').password;
const dbName = require('./appConfig').dbName;
const googleClientID = require('./appConfig').googleClientID;
const googleClientSecret = require('./appConfig').googleClientSecret;

module.exports = {
    googleClientID: googleClientID,
    googleClientSecret: googleClientSecret,
    mongoURI: `mongodb://${username}:${password}@cluster0-shard-00-00-tewas.mongodb.net:27017,cluster0-shard-00-01-tewas.mongodb.net:27017,cluster0-shard-00-02-tewas.mongodb.net:27017/${dbName}?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority`
}
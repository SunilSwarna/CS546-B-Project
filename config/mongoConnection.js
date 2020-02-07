//Reference taken from lecture notes.
const MongoClient = require("mongodb").MongoClient;
const settings = require("./settings");
const mongoConfig = settings.mongoConfig;

let _connection = undefined;
let _db = undefined;

module.exports = async () => {
  if (!_connection) {
<<<<<<< Updated upstream
    _connection = await MongoClient.connect(mongoConfig.serverUrl, {useNewUrlParser: true, useUnifiedTopology: true});
=======
    _connection = await MongoClient.connect(mongoConfig.serverUrl, {useNewUrlParser: true});
>>>>>>> Stashed changes
    _db = await _connection.db(mongoConfig.database);
  }

  return _db;
};
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

class Mongo {
  constructor({ appLog, config }) {
    this.log = appLog
    this.config = config
  }

  connect() {
    return mongoose.connect(this.config.mongo.connectionString, this.config.mongo.settings)
  }
}

module.exports = Mongo

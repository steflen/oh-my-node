const p = require('./../../package.json')

class Application {
  constructor({ appLog, config, httpServer, mongo }) {
    this.log = appLog
    this.config = config
    this.httpServer = httpServer
    this.mongo = mongo
  }

  wait = ms => new Promise(resolve => setTimeout(resolve, ms))

  async start() {
    try {
      await this.wait(this.config.app.startupDelay)
      await this.mongo.connect()
      await this.httpServer.start()
      this.log.info(`App Version ${p.version} up and running`)
    } catch (err) {
      throw new Error(`Critical App Error ${err}`)
    }
  }
}

module.exports = Application

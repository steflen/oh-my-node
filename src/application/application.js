const p = require('./../../package.json')

class Application {
  constructor({ appLog }) {
    this.log = appLog
  }

  async start() {
    this.log.info('App up and running')
    this.log.info(`App Version is ${p.version}`)
  }
}

module.exports = Application

class SomeController {
  constructor({ httpLog, config }) {
    this.log = httpLog
    this.config = config
  }

  test(req, res, next) {
    this.log.info('test')
    res.send('test is working')
  }

}

module.exports = SomeController

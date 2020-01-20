class HomeController {
  constructor({appLog, flashApi}) {
    this.log = appLog
    this.flashApi = flashApi
  }

  async Index(req, res) {
    // let count = 1
    // const repeatThis = () => {
    //   this.log.info(`Hello ${count}`)
    //   this.flashApi.info(`Hello ${count}`)
    //   count = count + 1
    // }
    //
    // setInterval(
    //   repeatThis
    // ,2000)

    res.render('home/index', {
      title: 'Home',
    })
  }
}

module.exports = HomeController

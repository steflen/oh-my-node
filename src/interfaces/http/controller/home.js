class HomeController {
  constructor() {}

  async Index(req, res) {
    res.render('home/index', {
      title: 'Home',
    })
  }
}

module.exports = HomeController

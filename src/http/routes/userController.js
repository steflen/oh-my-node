class UserController {
  constructor({ appLog }) {
    this.log = appLog
  }

  Signin(req, res) {
    if (!!req.headers && !!req.headers.referer)
      if (
        // workaround only goto signup if not already there
        !req.headers.referer.match(/^((http|https):\/)?\/?(?:[0-9]{1,3}\.){3}[0-9]{1,3}\/signin$/g)
      ) {
        this.log.debug(`Storing referer to session: ${req.headers.referer}`)
        req.session.redirect_override = req.headers.referer
        this.log.debug(`Session redirect override: ${req.session.redirect_override}`)
      }
    res.render('user/signin', {
      title: 'Da Entrance',
      theme: req.session.theme,
    })
  }
}

module.exports = UserController

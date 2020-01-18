class UserController {
  constructor({ appLog, user }) {
    this.log = appLog
    this.user = user
  }

  ListView(req, res) {
    res.render('user/list', {
      title: 'All Users',
      theme: req.session.theme,
    })
  }

  DetailView(req, res) {
    const email = req.params.email
    res.render('user/detail', {
      title: 'User Details',
      theme: req.session.theme,
      email,
    })
  }

  GetSignIn(req, res) {
    if (!!req.headers && !!req.headers.referer)
      if (
        // workaround only goto signin if not already there
        !req.headers.referer.match(/^((http|https):\/)?\/?(?:[0-9]{1,3}\.){3}[0-9]{1,3}\/signin$/g)
      ) {
        this.log.debug(`Storing referer to session: ${req.headers.referer}`)
        req.session.redirect_override = req.headers.referer
        this.log.debug(`Session redirect override: ${req.session.redirect_override}`)
      }
    res.render('user/sign-in', {
      title: 'Da Entrance',
      theme: req.session.theme,
    })
  }

  PostSignIn(req, res) {
    try {
      if (!!req.body._csrf) delete req.body._csrf

      req.flash('success', 'Hello user')
      res.redirect('/')
    } catch (err) {
      this.log.error(err)
      req.flash('error', 'Error signin in')
      res.redirect('/')
    }
  }

  GetSignUp(req, res) {
    res.render('user/sign-up', {
      title: 'Da Registration',
      theme: req.session.theme,
    })
  }

  async PostSignUp(req, res) {
    try {
      if (!req.body.email) throw new Error('No Email supplied')
      const result = await this.user.find(req.body.email)
      console.log(result)
      console.log(result)
      if (!!result) {
        console.log(`user exists already`)
      } else {
        console.log('user does not existd')
        const result = await this.user.create(req.body.email)
        console.log('result => ' + result)
      }
      req.flash('success', 'Hello user')
      res.redirect('/')
    } catch (err) {
      this.log.error(err)
      req.flash('error', 'Error signin in')
      res.redirect('/')
    }
  }
}

module.exports = UserController

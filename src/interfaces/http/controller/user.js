const bcrypt = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')

class UserController {
  constructor({ config, appLog, user, userModel }) {
    this.log = appLog
    this.user = user
    this.userModel = userModel
    this.config = config
  }

  ListView(req, res) {
    res.render('user/list', {
      title: 'All Users',
    })
  }

  DetailView(req, res) {
    const email = req.params.email
    res.render('user/detail', {
      title: 'User Details',
      email,
    })
  }

  GetSignIn(req, res) {
    res.render('user/signin', {
      title: 'Sign in',
    })
  }

  PostSignIn(req, res) {
    try {
      const token = jsonwebtoken.sign({
        id: req.user._id
        // iss: 'nodeapp',
        // sub: req.user._id,
        // iat: Math.floor(new Date().getTime() / 1000), // now
        // exp: Math.floor(Date.now() / 1000) + (60 * 60),  // one hour
        // exp: Math.floor(new Date().setDate(new Date().getDate() + 1) / 1000) // one day
      }, this.config.jwt.secret)
      res.cookie('JWT', token);
      req.flash('success', 'Hello user')
      res.redirect('/')
    } catch (err) {
      this.log.error(err)
      req.flash('error', 'Error signin in')
      res.redirect('/')
    }
  }

  GetActivate(req, res) {
    res.render('user/activate', {
      title: 'Account activation',
    })
  }

  async PostActivate(req, res) {
    try {
      // // get the opt from the request
      const { activationCode, email } = req.body
      // // check if the user with email and Otp exisits
      // const user = await this.userModel.findOne({ email, activationCode })
      // if (!user) {
      //   req.flash('error', 'Invalid activation code')
      //   res.redirect('/')
      // }
      // if (!user.active) {
      //   // req.session.email = email
      //   // req.session.activationCode = activationCode
      //   // res.redirect(`/create-password`)
      //   req.flash('success', 'Activation code has been verified')
        res.render('user/create-password', {
          title: 'Create your password',
          email,
          activationCode,
        })
      // } else {
      //   req.flash('error', 'Account already activated')
      //   res.redirect(`/`)
      // }

    } catch (err) {
      this.log.error(err.stack)
      req.flash('error', 'Activation error')
      res.redirect('/')
    }
  }

  GetCreatePassword(req, res) {
    const { email, activationCode } = req.session
    this.log.debug(`Retrieved email from session ${email}`)
    this.log.debug(`Retrieved activationCode from session ${activationCode}`)
    res.render('user/create-password', {
      title: 'Create your password',
      email,
      activationCode,
    })
  }

  async PostCreatePassword(req, res) {
    try {
      // get the password from request
      let { password, confirm, email, activationCode } = req.body

      if(password !== confirm){
        req.flash('success', 'Passwords do not match')
        res.redirect('/create-password')
      }
      // get the current user details
      const userInstance = await this.userModel.findOne({
        email,
        activationCode,
      })
      if (userInstance) {
        // generate salt
        const salt = await bcrypt.genSalt(10)

        userInstance.password = await bcrypt.hash(password, salt)
        userInstance.activationCode = 0
        userInstance.active = true

        await userInstance.save()

        req.flash('success', 'Password created, account active, time to sign in')
        res.redirect('/signin')
      } else {
        req.flash('error', 'Activation code has expired or is invalid')
        res.redirect('/')
      }
    } catch (err) {
      this.log.error(err.stack)
      req.flash('error', 'Password creation error')
      res.redirect('/')
    }
  }


  GetSignUp(req, res) {
    res.render('user/signup', {
      title: 'User Signup',
    })
  }

  async PostSignUp(req, res) {
    try {
      if (!req.body.email) throw new Error('No Email supplied')
      const userLookup = await this.user.find(req.body.email)
      if (!!userLookup) {
        req.flash('error', 'Email already registered')
        res.redirect('/signup')
      } else {
        const user = await this.user.signup(req.body.email)
        req.flash('success', `For first login, a one time password has been sent to ${user.email}`)
        res.redirect('/')
      }
    } catch (err) {
      req.flash('error', err)
      res.redirect('/')
    }
  }

  GetProfile(req, res) {
    res.render('user/profile', {
      title: 'User profile',
      user: req.user
    })
  }
}

module.exports = UserController

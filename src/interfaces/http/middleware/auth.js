const passport = require('passport')
const { ExtractJwt, Strategy: JwtStrategy } = require('passport-jwt')
const { Strategy: LocalStrategy } = require('passport-local')
const bcryptjs = require('bcryptjs')

module.exports = ({ appLog: log, config, userModel }) => {

  const signinStrategy = new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      session: false,
    },
    async function(email, password, done) {
      try {
        const user = await userModel.findOne({ email })
        if (!user)
          return done(null, false, { message: 'Incorrect username.' })
        else {
          if (!user.active) {
            return done(null, false, { message: 'Accont not activated yet' })
          }
          const isValid = bcryptjs.compare(password, user.password)
          if (!isValid)
            return done(null, false, { message: 'Password missmatch' })
          return done(null, user)
        }
      } catch (error) {
        done(error, false)
      }
    },
  )
  const cookieExtractor = function(req) {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies['JWT'];
    }
    return token;
  };
  const jwtStrategy = new JwtStrategy({
    jwtFromRequest: cookieExtractor,
    secretOrKey: config.jwt.secret,
  }, async (payload, done) => {
    try {
      const user = await userModel.findById(payload.id)
      if (!user) {
        done(null, false, { message: 'Invalid access token' })
      }
      done(null, user)
    } catch (error) {
      done(error, false)
    }
  })


  passport.use('signin', signinStrategy)
  passport.use('jwt', jwtStrategy)

  passport.serializeUser(function(user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function(id, done) {
    userModel.findById(id, function(err, user) {
      done(err, user)
    })
  })

  return {
    initialize: () => passport.initialize(),
    session: () => passport.session(),
    attachUser: (req, res, next) => {
      if (req.user) {
        res.locals.user = {
          id: req.user._id,
          role: req.user.role,
        }

      }
      next()
    },
    jwt: passport.authenticate('jwt', {
      failureRedirect: '/',
      failureFlash: true,
    }),
    async notRegistered(req, res, next) {
      try {
        const { email } = req.body
        const user = await userModel.findOne({ email })
        if (user) {
          req.flash('error', 'Username exists already')
          res.redirect('/signup')
        }
        next()
      } catch (err) {
        req.flash('error', 'Error!!')
        log.error(err)
        res.redirect('/')
      }
    },
    async checkActivationCode(req, res, next) {
      try {
        const { email, activationCode } = req.body
        const user = await userModel.findOne({ email })
        if (!user) {
          req.flash('error', 'Account does not exist')
          res.redirect('/activate')
        } else {
          if (user.active) {
            req.flash('error', 'Account already activated')
            res.redirect('/signin')
          } else {
            if (user.activationCode !== activationCode) {
              req.flash('error', 'Invalid activation code')
              res.redirect('/signin')
            } else if (!user.activationCodeExpiration > Date.now()) {
              req.flash('error', 'Code is expired')
              res.redirect('/resend')
            } else {
              next()
            }
          }
        }
      } catch (err) {
        req.flash('error', 'Error!!')
        log.error(err)
        res.redirect('/')
      }
    },

    signin: passport.authenticate('signin', {
      failureRedirect: '/signin',
      failureFlash: true,
    }),
    signout(req, res) {
      req.flash('success', 'Bye')
      req.logout()
      res.redirect('/')
    },
  }
}

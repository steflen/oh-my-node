const passport = require('passport')
const { ExtractJwt, Strategy: JwtStrategy } = require('passport-jwt')
const { Strategy: LocalStrategy } = require('passport-local')

module.exports = ({ config, userModel }) => {
  // in case of unverified accounts, local strategy is used
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
      },
      async (email, password, done) => {
        try {
          const user = await userModel.findOne({ email }).populate('profile')

          if (!user) {
            return done(new Error('Incorrect username', 403), false)
          } else {
            if (!user.active) {
              return done(new Error('Account not active', 403), false)
            }
            if (!(await user.validatePassword(password))) {
              return done(new Error('Incorrect password', 403), false)
            }
            //else
            done(null, user)
          }
        } catch (error) {
          done(error, false)
        }
      }
    )
  )

  // strategy for verified accounts
  // no prefix in authorization header (no "bearer","JWT" or "Token" in front of <token>)
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromHeader('authorization'),
        secretOrKey: config.jwt.secret,
      },
      async (payload, done) => {
        try {
          const user = await userModel.findById(payload.sub).populate('profile')
          if (!user) {
            return done(null, false)
          }
          done(null, user)
        } catch (error) {
          done(error, false)
        }
      }
    )
  )

  passport.serializeUser(function(user, done) {
    done(null, user)
  })

  passport.deserializeUser(function(user, done) {
    done(null, user)
  })

  return {
    initialize: () => {
      return passport.initialize()
    },
    session: () => passport.session(),
    authLocal: () => {
      return passport.authenticate('jwt' /*,{session:false}*/)
    },
    authJwt: () => {
      return passport.authenticate('local' /*,{session:false}*/)
    },
  }
}

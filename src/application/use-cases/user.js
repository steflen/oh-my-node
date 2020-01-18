const { User, Profile } = require('../../domain')

module.exports = ({ appLog: log, userModel, profileModel }) => ({
  create: async email => {
    try {
      const oneTimePassword = Math.floor(10000 + Math.random() * 90000)
      log.debug(`OTP is ${oneTimePassword}`)
      const newProfile = Profile({
        /*empty data for now*/
      })
      const profile = await profileModel.create(newProfile)
      // const data = Object.assign({}, { email, oneTimePassword }, { profile })
      const newUser = User({ email, oneTimePassword, profile: profile._id })
      log.debug(`Creating new user with data ${JSON.stringify(newUser)}`)
      const user = await userModel.create(newUser)
      log.debug(`created user ${user}`)
      return user
    } catch (err) {
      log.error('User creation failed')
      log.error(err.stack)
      throw err
    }
  },
  find: email => userModel.findOne({ email }),
})

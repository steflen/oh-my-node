const { User, Profile } = require('../../domain')

module.exports = ({ appLog: log, userModel, profileModel, mailer, config }) => ({
  signup: async email => {
    try {
      const activationCode = Math.floor(10000 + Math.random() * 90000)
      let activationCodeExpiration = new Date();
      activationCodeExpiration.setHours(activationCodeExpiration.getHours() + 1)

      // const activationCodeExpiration = new Date(Date.now());
      // activationCodeExpiration.setHours(activationCodeExpiration.getHours() + 1);


      const newProfile = Profile({
        /*empty data for now*/
      })
      //make a transaction here since two entities are createdd, if the latter fails, the first remains in db..
      const profile = await profileModel.create(newProfile)

      const newUser = User({
        email,
        activationCode,
        activationCodeExpiration,
        profile,
      })

      const user = await userModel.create(newUser)

      log.debug(`Created user ${user}`)
      console.log(config)
      await mailer.sendActivationCode(email, activationCode)

      return user
    } catch (err) {
      log.error('User creation failed')
      log.error(err.stack)
      throw err
    }
  },
  find: email => {
    return userModel.findOne({ email })
  },

})

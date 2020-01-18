const { User } = require('../../domain')

module.exports = ({ appLog: log, userModel }) => ({
  create: async email => {
    const onTimePassword = Math.floor(10000 + Math.random() * 90000)
    log.debug(`OTP is ${onTimePassword}`)
    const newUser = User({ email, onTimePassword })
    log.debug(`Creating new user with data ${JSON.stringify(newUser)}`)
    const user = await userModel.create(newUser)
    log.debug(`created user ${user}`)
    return user
  },
  find: email => userModel.findOne({ email }),
})

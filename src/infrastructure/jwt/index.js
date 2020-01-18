const jwt = require('jsonwebtoken')

module.exports = ({ config }) => ({
  signin: options => payload => {
    const opt = Object.assign({}, options, { expiresIn: '1h' })
    return jwt.sign(payload, config.jwt.secret, opt)
  },
  verify: options => token => {
    const opt = Object.assign({}, options)
    return jwt.verify(token, config.jwt.secret, opt)
  },
})

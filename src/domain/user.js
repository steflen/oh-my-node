const t = require('tcomb')
const { compose } = require('ramda')
const { cleanData } = require('./helper')

const User = t.struct({
  id: t.maybe(t.String),
  email: t.String,
  password: t.maybe(t.String),
  oneTimePassword: t.maybe(t.Number),
  oneTimePasswordExpiration: t.maybe(t.Date),
  active: t.maybe(t.Boolean),
  role: t.maybe(t.String),
  profile: t.maybe(t.String),
  createdAt: t.maybe(t.Date),
  updatedAt: t.maybe(t.Date),
})

module.exports = compose(
  cleanData,
  User
)

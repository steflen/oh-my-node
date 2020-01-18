const t = require('tcomb')
const { compose } = require('ramda')
const { cleanData } = require('./helper')

const Profile = t.struct({
  firstName: t.maybe(t.String),
  lastName: t.maybe(t.String),
  birthday: t.maybe(t.Date),
  phone: t.maybe(t.String),
  country: t.maybe(t.String),
  state: t.maybe(t.String),
  city: t.maybe(t.String),
  address: t.maybe(t.String),
  zipCode: t.maybe(t.String),
  // createdAt: t.maybe(t.Date),
  // updatedAt: t.maybe(t.Date),
})

module.exports = compose(
  cleanData,
  Profile
)

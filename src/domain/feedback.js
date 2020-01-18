const t = require('tcomb')
const { compose } = require('ramda')
const { cleanData } = require('./helper')

const Feedback = t.struct({
  id: t.maybe(t.String),
  title: t.String,
  rating: t.String,
  description: t.String,
  comeback: t.String,
  createdAt: t.maybe(t.Date),
  updatedAt: t.maybe(t.Date),
})

module.exports = compose(
  cleanData,
  Feedback
)

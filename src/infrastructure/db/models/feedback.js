const { Schema, model } = require('mongoose')

const schema = new Schema({
  title: {
    type: String,
    default: '',
    required: true,
  },
  rating: {
    type: String,
    default: '',
    required: true,
  },
  description: {
    type: String,
    default: '',
    required: true,
  },
  comeback: {
    type: String,
    default: '',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = () => model('feedback', schema)

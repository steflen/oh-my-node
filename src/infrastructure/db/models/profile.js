const { Schema, model } = require('mongoose')

const schema = new Schema({
  firstName: {
    type: String,
    default: '',
    required: false,
  },
  lastName: {
    type: String,
    default: '',
    required: false,
  },
  birthday: {
    type: Date,
    required: false,
  },
  phone: {
    type: String,
    default: '',
    required: false,
  },
  country: {
    type: String,
    default: '',
    required: false,
  },
  state: {
    type: String,
    default: '',
    required: false,
  },
  city: {
    type: String,
    default: '',
    required: false,
  },
  address: {
    type: String,
    default: '',
    required: false,
  },
  zipcode: {
    type: String,
    default: '',
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = () => model('profile', schema)

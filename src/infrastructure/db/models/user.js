//bcryptjs used instead of bcrypt because no node-gyp build is required...
const bcryptjs = require('bcryptjs')
const { Schema, model } = require('mongoose')

const schema = new Schema({
  email: {
    type: String,
    index: true,
    required: true,
    unique: true,
    lowercase: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  password: {
    type: String,
    required: false,
  },
  onTimePassword: {
    type: Number,
    default: null,
    required: false,
  },
  onTimePasswordExpiration: {
    type: Date,
    default: null,
    required: false,
  },
  active: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  profile: {
    type: Schema.Types.ObjectId,
    ref: 'profile',
    required: true,
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

schema.methods.validatePassword = function(password) {
  return bcryptjs.compare(password, this.password)
}

module.exports = () => model('user', schema)

const { Schema, model } = require('mongoose')

module.exports = ({ profileModel }) => {
  const schema = new Schema({
    email: {
      type: String,
      index: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: email => {
          var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
          return re.test(email)
        },
        message: props => `${props.value} is not a valid email!`,
      },
      required: [true, 'Email is required!'],
    },
    password: {
      type: String,
      required: false,
    },
    activationCode: {
      type: Number,
      default: null,
      required: false,
    },
    activationCodeExpiration: {
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
      type: profileModel.schema,
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



  return model('user', schema)
}

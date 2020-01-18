const { Feedback } = require('../../domain')

module.exports = ({ feedbackModel }) => ({
  create: data => feedbackModel.create(Feedback(data)),
})

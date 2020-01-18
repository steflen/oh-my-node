class FeedbackController {
  constructor({ appLog, feedback }) {
    this.log = appLog
    this.feedback = feedback
  }

  Index(req, res) {
    res.render('feedback/index', {
      title: 'Feedback',
    })
  }

  async Submit(req, res) {
    try {
      if (!!req.body._csrf) delete req.body._csrf
      this.log.debug(`Body from feedback form: ${JSON.stringify(req.body)}`)
      const result = await this.feedback.create(req.body)
      this.log.debug(`Feedback stored to db: ${JSON.stringify(result)}`)
      req.flash('success', 'Feedback sent successfully')
      res.redirect('/')
    } catch (err) {
      this.log.error(err)
      req.flash('error', 'Feedback could not be delivered')
      res.redirect('/')
    }
  }
}

module.exports = FeedbackController

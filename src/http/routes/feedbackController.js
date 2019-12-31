class FeedbackController {
  constructor() {}

  Index(req, res) {
    res.render('feedback/index', {
      title: 'Feedback',
    })
  }
  Submit(req, res) {
    console.log(req.body)
    //flash success
    req.flash('success', 'Feedback sent successfully')
    //back to home
    res.redirect('/')
  }
}

module.exports = FeedbackController

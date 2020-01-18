const { Router } = require('express')
const { scopePerRequest, makeInvoker, inject } = require('awilix-express')
const multer = require('multer')
const accessLogger = require('./middleware/accessLog')

// route controllers (~ everything that renders a view)
const HomeController = makeInvoker(require('./controller/home'))
const UserController = makeInvoker(require('./controller/user'))
const FeedbackController = makeInvoker(require('./controller/feedback'))

module.exports = ({ containerMiddleware, httpLog }) => {
  const router = Router()

  //configure uploads
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/')
    },
    filename(req, file, cb) {
      cb(null, `${file.fieldname}-${Date.now()}.json`)
    },
  })
  const upload = multer({ storage })
  router.post('/upload', upload.single('uploadfile'))

  router
    .use(containerMiddleware)
    .use(accessLogger(httpLog))
    // .use('/api', apiRouter)

    .get('/', HomeController('Index'))

    .get('/signin', UserController('GetSignIn'))
    .post('/signin', UserController('PostSignIn'))
    .get('/signup', UserController('GetSignUp'))
    .post('/signup', UserController('PostSignUp'))
    .get('/user/list', UserController('ListView'))
    .get('/user/details/:email', UserController('DetailView'))

    .get('/feedback', FeedbackController('Index'))
    .post('/feedback', FeedbackController('Submit'))

  return router
}

const { Router } = require('express')
const { scopePerRequest, makeInvoker, inject } = require('awilix-express')
const multer = require('multer')
const accessLogger = require('./middleware/accessLog')

// route controllers (~ everything that renders a view)
const HomeController = makeInvoker(require('./controller/home'))
const UserController = makeInvoker(require('./controller/user'))
const FeedbackController = makeInvoker(require('./controller/feedback'))

module.exports = ({ containerMiddleware, httpLog, auth }) => {
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
    .use(auth.attachUser)

    .get('/', HomeController('Index'))

    .get('/signout', auth.signout)
    // when user registers (signup) a one time password is sent via sendgrid
    .get('/signup', UserController('GetSignUp'))
    .post('/signup', auth.notRegistered, UserController('PostSignUp'))
    // activation with code, LOCAL auth is used here
    .get('/activate', UserController('GetActivate'))
    .post('/activate', auth.checkActivationCode, UserController('PostActivate'))
    // create a password after activation
    //.get('/create-password',  UserController('GetCreatePassword'))
    .post('/create-password', UserController('PostCreatePassword'))
    // now login works as usual
    .get('/signin', UserController('GetSignIn'))
    .post('/signin', auth.signin, UserController('PostSignIn'))

    // from now on jwt is used
    .get('/profile', auth.jwt, UserController('GetProfile'))

    .get('/user/list', UserController('ListView'))
    .get('/user/details/:email', UserController('DetailView'))

    .get('/feedback', FeedbackController('Index'))
    .post('/feedback', FeedbackController('Submit'))

  return router
}

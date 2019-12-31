const { Router } = require('express')
const { scopePerRequest, makeInvoker, inject } = require('awilix-express')

const Status = require('http-status')
const lusca = require('lusca')
const multer = require('multer')
const requestLogger = require('./middleware/requestLogger')

// API controllers
const SomeController = makeInvoker(require('./api/someController'))

// route controllers (everything that renders a view)
const HomeController = makeInvoker(require('./routes/homeController'))
const UserController = makeInvoker(require('./routes/userController'))
const FeedbackController = makeInvoker(require('./routes/feedbackController'))

module.exports = ({ containerMiddleware, httpLog }) => {
  const router = Router()
  const apiRouter = Router()

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

  // // inject csrf token
  // router.use((req, res, next) => {
  //   // omit csrf for uploads
  //   if (req.path === '/upload') {
  //     next()
  //   } else {
  //     console.log('LUSCA')
  //     lusca.csrf()(req, res, next)
  //   }
  // })

  apiRouter

    .use(requestLogger(httpLog))

    .get('/test', SomeController('test'))

  router
    .use(scopePerRequest(containerMiddleware))
    .use('/api', apiRouter)
    .get('/', HomeController('Index'))
    .get('/signin', UserController('Signin'))
    .get('/feedback', FeedbackController('Index'))
    .post('/feedback', FeedbackController('Submit'))

  // error stuff
  router.use(function(err, req, res, next) {
    httpLog.error(`InternalServerError ${err.message}`)
    httpLog.error(err.stack)
    if (process.env.NODE_ENV === 'development')
      res.status(Status.INTERNAL_SERVER_ERROR).json({
        type: 'InternalServerError',
        message: err.message,
        stack: err.stack,
      })
    else
      res.status(Status.INTERNAL_SERVER_ERROR).json({
        type: 'InternalServerError',
        message: err.message,
      })
  })

  return router
}

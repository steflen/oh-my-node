const express = require('express')
const path = require('path')

const https = require('https')
const serveFavicon = require('serve-favicon')
const flashMessages = require('express-flash')
const session = require('express-session')
const memorystore = require('memorystore')(session)
const lusca = require('lusca')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const methodOverride = require('method-override')
const fs = require('fs')
// https://github.com/adaltas/node-http-status
// const Status = require('http-status')

class Server {
  constructor({ auth, config, httpLog, httpRouter, flashApi }) {
    this.config = config
    this.log = httpLog
    this.app = express()


    this.httpsServer = https.createServer(
      {
        key: fs.readFileSync(path.join(__dirname, './ssl/key.pem'), 'utf8'),
        cert: fs.readFileSync(path.join(__dirname, './ssl/cert.pem'), 'utf8'),
        //will throw a decrypt error if passphrase not set
        //no error handler for now
        requestCert: false,
        rejectUnauthorized: false,
        passphrase: this.config.server.sslPassphrase,
      },
      this.app,
    )

    const { io } = flashApi
    io.attach(this.httpsServer)


    this.app
      .disable('x-powered-by')
      .use('/uploads', express.static('uploads'))
      .use(
        express.static(path.join(__dirname, '../../../public'), {
          maxAge: '30 days',
        }),
      )
      .use(serveFavicon(path.join(__dirname, '../../../public/static/favicon.ico')))
      .set('view engine', 'pug')
      .set('views', path.join(__dirname, './views'))
      .use(cookieParser())
    const hour = 3600000
    this.app.use(
        session({
          //https://github.com/expressjs/session#compatible-session-stores
          cookie: {
            expires: new Date(Date.now() + hour),
            maxAge: hour,
            secure: true,
            sameSite:true,
            path: '/'
          },
          store: new memorystore({
            // prune expired entries every 24h
            checkPeriod: hour * 24
          }),
          resave: false,
          saveUninitialized: false,
          secret: 'bim-bim-bim',
        }),
      )
      .use(flashMessages())
      .use(auth.initialize())
      .use(auth.session())
      .use((req, res, next) => {
        res.io = io
        next()
      })
      .use(
        cors({
          origin: ['http://localhost:8000', 'https://localhost:8443'],
          methods: ['GET', 'POST', 'PUT', 'DELETE'],
          allowedHeaders: ['Content-Type', 'Authorization'],
        }),
      )
      .use(methodOverride('X-HTTP-Method-Override'))
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({ extended: false }))
      .use(
        lusca({
          csrf: true,
          csp: false,
          xframe: 'SAMEORIGIN',
          p3p: 'ABCDEF',
          hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
          xssProtection: true,
          nosniff: true,
          referrerPolicy: 'same-origin',
        }),
      )

      //routers from routes folder
      .use(httpRouter)

      // catch 404 and forward to error handler
      .use((err, req, res, next) => {
        console.log(err)
        // const nerr = new Error('Not Found')
        err.status = 404
        next(err)
      })

      //error handl0r
      .use((err, req, res, next) => {
        httpLog.error(`InternalServerError ${err.message}`)
        httpLog.error(err.stack)
        if (process.env.NODE_ENV === 'development')
        // res.status(Status.INTERNAL_SERVER_ERROR).json({
        //   type: 'InternalServerError',
        //   message: err.message,
        //   stack: err.stack,
        // })
          res.render('partials/error', {
            type: 'InternalServerError',
            message: err.message,
            stack: err.stack,
          })
        else
          res.render('partials/error', {
            type: 'InternalServerError',
            message: err.message,
            stack: err.stack,
          })
      })
  }

  start() {
    return new Promise(resolve => {

      this.httpsServer.listen(this.config.server.httpsPort, () => {
        this.log.info(
          `HTTPS Server (pid ${process.pid}) listening at port ${this.httpsServer.address().port}`,
        )
        resolve()
      })
    })
  }
}

module.exports = Server

const express = require('express')
const path = require('path')
const http = require('http')
const https = require('https')
const serveFavicon = require('serve-favicon')
const flashMessages = require('express-flash')
const session = require('express-session')
const memorystore = require('memorystore')(session)
const lusca = require('lusca')
const cors = require('cors')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const fs = require('fs')
// https://github.com/adaltas/node-http-status
const Status = require('http-status')

class Server {
  constructor({ auth, config, httpLog, httpRouter, flashApi }) {
    this.config = config
    this.log = httpLog
    this.app = express()

    if (this.config.server.allowInsecure) {
      this.httpServer = http.createServer(this.app)
    }
    this.httpsServer = https.createServer(
      {
        key: fs.readFileSync(path.join(__dirname, './ssl/key.pem'), 'utf8'),
        cert: fs.readFileSync(path.join(__dirname, './ssl/cert.pem'), 'utf8'),
        //will throw a decrypt error if passphrase not set
        //no error handler for now
        passphrase: this.config.server.sslPassphrase,
      },
      this.app
    )

    const { io } = flashApi
    io.attach(this.httpServer)

    this.app
      .disable('x-powered-by')
      .use('/uploads', express.static('uploads'))
      .use(
        express.static(path.join(__dirname, '../../../public'), {
          maxAge: '30 days',
        })
      )
      .use(serveFavicon(path.join(__dirname, '../../../public/static/favicon.ico')))
      .set('view engine', 'pug')
      .set('views', path.join(__dirname, './views'))
      .use(
        session({
          store: new memorystore({ checkPeriod: 90000000 }), // prune expired sessions (random period ;)
          resave: true,
          saveUninitialized: true,
          secret: 'bim-bim-bim',
        })
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
        })
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
        })
      )

      //routers from routes folder
      .use(httpRouter)

      // catch 404 and forward to error handler
      .use((req, res, next) => {
        const err = new Error('Not Found')
        err.status = 404
        next(err)
      })

    //error handl0r
    // .use((err, req, res, next) => {
    //   httpLog.error(`InternalServerError ${err.message}`)
    //   httpLog.error(err.stack)
    //   if (process.env.NODE_ENV === 'development')
    //     res.status(Status.INTERNAL_SERVER_ERROR).json({
    //       type: 'InternalServerError',
    //       message: err.message,
    //       stack: err.stack,
    //     })
    //   else
    //     res.status(Status.INTERNAL_SERVER_ERROR).json({
    //       type: 'InternalServerError',
    //       message: err.message,
    //     })
    // })
  }

  start() {
    return new Promise(resolve => {
      if (this.config.server.allowInsecure)
        this.httpServer.listen(this.config.server.httpPort, () => {
          this.log.info(
            `HTTP Server (pid ${process.pid}) listening at port ${this.httpServer.address().port}`
          )
          resolve()
        })
      this.httpsServer.listen(this.config.server.httpsPort, () => {
        this.log.info(
          `HTTPS Server (pid ${process.pid}) listening at port ${this.httpsServer.address().port}`
        )
        resolve()
      })
    })
  }
}

module.exports = Server

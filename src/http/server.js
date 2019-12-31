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

class Server {
  constructor({ config, httpRouter, httpLog, flashApi }) {
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
        passphrase: 'kiz-kiz-bam-bam',
      },
      this.app
    )

    const { io } = flashApi
    io.attach(this.httpServer)

    this.app
      .disable('x-powered-by')

      .use(
        express.static(path.join(__dirname, '../../public'), {
          maxAge: '30 days',
        })
      )
      .use(serveFavicon(path.join(__dirname, '../../public/static/favicon.ico')))
      .set('view engine', 'pug')
      .set('views', path.join(__dirname, '../views'))
      .use(
        session({
          store: new memorystore({ checkPeriod: 90000000 }), // prune expired sessions (random period ;)
          resave: true,
          saveUninitialized: true,
          secret: 'bim-bim-bim',
        })
      )
      .use(flashMessages())
      .use((req, res, next) => {
        res.io = io
        next()
      })
      .use(cors())
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
      .use(httpRouter)
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
